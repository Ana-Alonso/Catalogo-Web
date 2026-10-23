-- ==========================================
-- Migracion idempotente para Laurel en Lienzo
-- Ejecuta este script en el SQL Editor de Supabase
-- Es seguro re-ejecutarlo tantas veces como sea necesario
-- ==========================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('personalizados', 'camisetas', 'ilustraciones', 'talleres')),
    "etsyLink" TEXT,
    "vintedLink" TEXT,
    price TEXT,
    status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservado', 'vendido')),
    featured BOOLEAN NOT NULL DEFAULT false,
    "eventDate" TEXT,
    "eventLocation" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "etsyLink" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "vintedLink" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'disponible';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "eventDate" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "eventLocation" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

DO $$
DECLARE
    existing_constraint RECORD;
BEGIN
    FOR existing_constraint IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.products'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%category%'
    LOOP
        EXECUTE format('ALTER TABLE public.products DROP CONSTRAINT %I', existing_constraint.conname);
    END LOOP;
END $$;

DO $$
DECLARE
    existing_constraint RECORD;
BEGIN
    FOR existing_constraint IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.products'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE public.products DROP CONSTRAINT %I', existing_constraint.conname);
    END LOOP;
END $$;

UPDATE public.products SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE public.products SET title = '' WHERE title IS NULL;
UPDATE public.products SET description = '' WHERE description IS NULL;
UPDATE public.products SET image = '' WHERE image IS NULL;
UPDATE public.products
    SET category = 'personalizados'
    WHERE category IS NULL
       OR category NOT IN ('personalizados', 'camisetas', 'ilustraciones', 'talleres');
UPDATE public.products
    SET status = 'disponible'
    WHERE status IS NULL
       OR status NOT IN ('disponible', 'reservado', 'vendido');
UPDATE public.products SET featured = false WHERE featured IS NULL;
UPDATE public.products SET created_at = timezone('utc'::text, now()) WHERE created_at IS NULL;

ALTER TABLE public.products ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.products ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN image SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN category SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN status SET DEFAULT 'disponible';
ALTER TABLE public.products ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN featured SET DEFAULT false;
ALTER TABLE public.products ALTER COLUMN featured SET NOT NULL;
ALTER TABLE public.products ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
ALTER TABLE public.products ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.products ALTER COLUMN "etsyLink" DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN "vintedLink" DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN "eventDate" DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN "eventLocation" DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.products'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE public.products ADD PRIMARY KEY (id);
    END IF;
END $$;

ALTER TABLE public.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN ('personalizados', 'camisetas', 'ilustraciones', 'talleres'));

ALTER TABLE public.products
    ADD CONSTRAINT products_status_check
    CHECK (status IN ('disponible', 'reservado', 'vendido'));

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cupo INTEGER;
ALTER TABLE public.products ALTER COLUMN cupo DROP NOT NULL;

DO $$
DECLARE
    existing_constraint RECORD;
BEGIN
    FOR existing_constraint IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.products'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%cupo%'
    LOOP
        EXECUTE format('ALTER TABLE public.products DROP CONSTRAINT %I', existing_constraint.conname);
    END LOOP;
END $$;

ALTER TABLE public.products
    ADD CONSTRAINT products_cupo_check
    CHECK (cupo IS NULL OR cupo > 0);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
CREATE POLICY "Permitir lectura publica de productos"
    ON public.products
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
CREATE POLICY "Permitir gestion de productos"
    ON public.products
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS product_id UUID;
ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendiente';
ALTER TABLE public.workshop_registrations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.workshop_registrations'::regclass
          AND contype = 'f'
    ) THEN
        ALTER TABLE public.workshop_registrations
            ADD CONSTRAINT workshop_registrations_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
DECLARE
    existing_constraint RECORD;
BEGIN
    FOR existing_constraint IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.workshop_registrations'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE public.workshop_registrations DROP CONSTRAINT %I', existing_constraint.conname);
    END LOOP;
END $$;

UPDATE public.workshop_registrations SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE public.workshop_registrations SET name = '' WHERE name IS NULL;
UPDATE public.workshop_registrations SET email = '' WHERE email IS NULL;
UPDATE public.workshop_registrations
    SET status = 'pendiente'
    WHERE status IS NULL
       OR status NOT IN ('pendiente', 'confirmado', 'cancelado');
UPDATE public.workshop_registrations SET created_at = timezone('utc'::text, now()) WHERE created_at IS NULL;

ALTER TABLE public.workshop_registrations ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.workshop_registrations ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.workshop_registrations ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE public.workshop_registrations ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.workshop_registrations ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.workshop_registrations ALTER COLUMN status SET DEFAULT 'pendiente';
ALTER TABLE public.workshop_registrations ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.workshop_registrations ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
ALTER TABLE public.workshop_registrations ALTER COLUMN created_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.workshop_registrations'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE public.workshop_registrations ADD PRIMARY KEY (id);
    END IF;
END $$;

ALTER TABLE public.workshop_registrations
    ADD CONSTRAINT workshop_registrations_status_check
    CHECK (status IN ('pendiente', 'confirmado', 'cancelado'));

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
