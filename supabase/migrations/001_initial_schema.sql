-- ==========================================
-- Esquema de Base de Datos para Laurel en Lienzo
-- Ejecuta este script en el SQL Editor de Supabase
-- ==========================================

-- 1. Tabla de Productos / Obras
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('personalizados', 'camisetas', 'ilustraciones', 'talleres')),
    "etsyLink" TEXT,
    "vintedLink" TEXT,
    "priceCents" INTEGER,
    currency TEXT NOT NULL DEFAULT 'EUR',
    "discountPercent" SMALLINT,
    source TEXT NOT NULL DEFAULT 'local',
    "etsyListingId" BIGINT,
    "etsyState" TEXT,
    "etsySyncedAt" TIMESTAMP WITH TIME ZONE,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido')),
    featured BOOLEAN NOT NULL DEFAULT false,
    "eventDate" TEXT,
    "eventLocation" TEXT,
    cupo INTEGER CHECK (cupo IS NULL OR cupo > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT products_price_cents_check CHECK ("priceCents" IS NULL OR "priceCents" >= 0),
    CONSTRAINT products_currency_check CHECK (currency ~ '^[A-Z]{3}$'),
    CONSTRAINT products_discount_percent_check CHECK (
        "discountPercent" IS NULL
        OR ("discountPercent" BETWEEN 1 AND 90 AND "priceCents" IS NOT NULL)
    ),
    CONSTRAINT products_source_check CHECK (source IN ('local', 'etsy')),
    CONSTRAINT products_etsy_listing_check CHECK (source <> 'etsy' OR "etsyListingId" IS NOT NULL),
    CONSTRAINT products_etsy_no_discount_check CHECK (source <> 'etsy' OR "discountPercent" IS NULL),
    CONSTRAINT products_workshop_links_check CHECK (
        category <> 'talleres'
        OR ("etsyLink" IS NULL AND "vintedLink" IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS products_etsy_listing_id_idx
    ON public.products ("etsyListingId")
    WHERE "etsyListingId" IS NOT NULL;

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso (RLS):
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
DROP POLICY IF EXISTS "Lectura de productos visibles" ON public.products;
CREATE POLICY "Lectura de productos visibles"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING ("isVisible" OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
CREATE POLICY "Permitir gestion de productos"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

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

-- 4. Tabla de Inscripciones a Talleres
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS workshop_registrations_active_email_idx
    ON public.workshop_registrations (product_id, lower(email))
    WHERE status <> 'cancelado';

CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    cupo_limit INTEGER;
    taken_count INTEGER;
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.product_id IS NOT DISTINCT FROM OLD.product_id
       AND NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'cancelado' THEN
        RETURN NEW;
    END IF;

    SELECT cupo INTO cupo_limit
    FROM public.products
    WHERE id = NEW.product_id
    FOR UPDATE;

    IF cupo_limit IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT count(*) INTO taken_count
    FROM public.workshop_registrations
    WHERE product_id = NEW.product_id
      AND status <> 'cancelado'
      AND id <> NEW.id;

    IF taken_count >= cupo_limit THEN
        RAISE EXCEPTION 'workshop_full';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_workshop_capacity ON public.workshop_registrations;
CREATE TRIGGER trg_workshop_capacity
    BEFORE INSERT OR UPDATE ON public.workshop_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.check_workshop_capacity();

-- 5. RLS de Inscripciones
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de inscripciones" ON public.workshop_registrations;
CREATE POLICY "Permitir lectura publica de inscripciones"
    ON public.workshop_registrations
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir gestion de inscripciones" ON public.workshop_registrations;
CREATE POLICY "Permitir gestion de inscripciones"
    ON public.workshop_registrations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Configuración del Storage Bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Permitir ver imagenes publicas" ON storage.objects;
CREATE POLICY "Permitir ver imagenes publicas"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Permitir subida y gestion de imagenes" ON storage.objects;
CREATE POLICY "Permitir subida y gestion de imagenes"
    ON storage.objects FOR ALL
    USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products');
