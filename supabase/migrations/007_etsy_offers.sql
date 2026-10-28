ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "etsyOnSale" BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'products'
          AND column_name = 'etsyOfferPercent'
    ) THEN
        UPDATE public.products
        SET "etsyOnSale" = true
        WHERE "etsyOfferPercent" IS NOT NULL;

        ALTER TABLE public.products
            DROP CONSTRAINT IF EXISTS products_etsy_offer_percent_check;
        ALTER TABLE public.products
            DROP CONSTRAINT IF EXISTS products_local_no_etsy_offer_check;
        ALTER TABLE public.products
            DROP COLUMN IF EXISTS "etsyOfferPercent";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_local_no_etsy_sale_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_local_no_etsy_sale_check
            CHECK (source <> 'local' OR "etsyOnSale" = false)
            NOT VALID;
    END IF;
END $$;
