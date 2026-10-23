ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "priceCents" INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "discountPercent" SMALLINT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "etsyListingId" BIGINT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "etsyState" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "etsySyncedAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "isVisible" BOOLEAN;

DO $$
DECLARE
    product RECORD;
    normalized TEXT;
    cents INTEGER;
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'products'
          AND column_name = 'price'
    ) THEN
        FOR product IN
            SELECT id, price
            FROM public.products
            WHERE "priceCents" IS NULL
              AND price IS NOT NULL
        LOOP
            normalized := regexp_replace(product.price, '[^0-9,.]', '', 'g');

            IF normalized = '' THEN
                CONTINUE;
            END IF;

            IF position(',' IN normalized) > 0 THEN
                normalized := replace(normalized, '.', '');
                normalized := replace(normalized, ',', '.');
            END IF;

            BEGIN
                cents := round(normalized::numeric * 100)::integer;
            EXCEPTION
                WHEN others THEN
                    cents := NULL;
            END;

            UPDATE public.products
            SET "priceCents" = cents
            WHERE id = product.id;
        END LOOP;
    END IF;
END $$;

UPDATE public.products
SET currency = CASE
    WHEN currency ~ '^[A-Za-z]{3}$' THEN upper(currency)
    ELSE 'EUR'
END
WHERE currency IS NULL
   OR currency !~ '^[A-Z]{3}$';

UPDATE public.products
SET source = 'local'
WHERE source IS NULL
   OR source NOT IN ('local', 'etsy');

UPDATE public.products
SET "isVisible" = true
WHERE "isVisible" IS NULL;

UPDATE public.products
SET "discountPercent" = NULL
WHERE source = 'etsy';

ALTER TABLE public.products ALTER COLUMN "priceCents" DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN currency SET DEFAULT 'EUR';
ALTER TABLE public.products ALTER COLUMN currency SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN "discountPercent" DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN source SET DEFAULT 'local';
ALTER TABLE public.products ALTER COLUMN source SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN "isVisible" SET DEFAULT true;
ALTER TABLE public.products ALTER COLUMN "isVisible" SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_price_cents_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_price_cents_check
            CHECK ("priceCents" IS NULL OR "priceCents" >= 0)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_currency_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_currency_check
            CHECK (currency ~ '^[A-Z]{3}$')
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_discount_percent_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_discount_percent_check
            CHECK (
                "discountPercent" IS NULL
                OR ("discountPercent" BETWEEN 1 AND 90 AND "priceCents" IS NOT NULL)
            )
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_source_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_source_check
            CHECK (source IN ('local', 'etsy'))
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_etsy_listing_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_etsy_listing_check
            CHECK (source <> 'etsy' OR "etsyListingId" IS NOT NULL)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_etsy_no_discount_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_etsy_no_discount_check
            CHECK (source <> 'etsy' OR "discountPercent" IS NULL)
            NOT VALID;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS products_etsy_listing_id_idx
    ON public.products ("etsyListingId")
    WHERE "etsyListingId" IS NOT NULL;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
DROP POLICY IF EXISTS "Lectura publica de productos visibles" ON public.products;
DROP POLICY IF EXISTS "Lectura de productos visibles" ON public.products;
CREATE POLICY "Lectura de productos visibles"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING ("isVisible" OR auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.etsy_credentials (
    id SMALLINT PRIMARY KEY DEFAULT 1,
    access_token TEXT,
    refresh_token TEXT NOT NULL,
    access_token_expires_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT etsy_credentials_singleton CHECK (id = 1)
);

ALTER TABLE public.etsy_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.etsy_credentials FROM anon, authenticated;

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_price_length_check;
ALTER TABLE public.products DROP COLUMN IF EXISTS price;
