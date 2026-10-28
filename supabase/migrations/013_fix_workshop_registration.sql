-- Arreglar permisos y políticas para registro público
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Asegurar grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT ON TABLE public.workshop_registrations TO anon, authenticated;
GRANT INSERT ON TABLE public.workshop_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.workshop_registrations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Eliminar TODAS las políticas relacionadas con workshop_registrations para empezar limpio
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'workshop_registrations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.workshop_registrations', pol.policyname);
    END LOOP;
END $$;

-- Crear solo las políticas necesarias
CREATE POLICY "public_insert_pending"
    ON public.workshop_registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pendiente');

CREATE POLICY "public_read_registrations"
    ON public.workshop_registrations
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "admin_all_registrations"
    ON public.workshop_registrations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Hacer trigger SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    WHERE id = NEW.product_id;

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

GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
