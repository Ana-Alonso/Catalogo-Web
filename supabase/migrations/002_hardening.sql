ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
DROP POLICY IF EXISTS "Gestion autenticada de productos" ON public.products;
CREATE POLICY "Gestion autenticada de productos"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir gestion de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Registro publico de inscripciones" ON public.workshop_registrations;
CREATE POLICY "Registro publico de inscripciones"
    ON public.workshop_registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pendiente');

DROP POLICY IF EXISTS "Gestion autenticada de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Gestion autenticada de inscripciones (update)" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Gestion autenticada de inscripciones (delete)" ON public.workshop_registrations;
CREATE POLICY "Gestion autenticada de inscripciones (update)"
    ON public.workshop_registrations
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
CREATE POLICY "Gestion autenticada de inscripciones (delete)"
    ON public.workshop_registrations
    FOR DELETE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir subida y gestion de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Gestion autenticada de imagenes" ON storage.objects;
CREATE POLICY "Gestion autenticada de imagenes"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'workshop_registrations_email_format_check'
    ) THEN
        ALTER TABLE public.workshop_registrations
            ADD CONSTRAINT workshop_registrations_email_format_check
            CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'workshop_registrations_name_length_check'
    ) THEN
        ALTER TABLE public.workshop_registrations
            ADD CONSTRAINT workshop_registrations_name_length_check
            CHECK (char_length(name) BETWEEN 2 AND 100)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'workshop_registrations_email_length_check'
    ) THEN
        ALTER TABLE public.workshop_registrations
            ADD CONSTRAINT workshop_registrations_email_length_check
            CHECK (char_length(email) BETWEEN 5 AND 254)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'products_title_length_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_title_length_check
            CHECK (char_length(title) BETWEEN 2 AND 120)
            NOT VALID;
    END IF;

END $$;
