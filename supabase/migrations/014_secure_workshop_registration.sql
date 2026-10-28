-- Registro público de talleres sin exponer datos personales.
-- Sustituye las políticas abiertas introducidas en 013 y restaura el control de plazo.

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_pending" ON public.workshop_registrations;
DROP POLICY IF EXISTS "public_read_registrations" ON public.workshop_registrations;
DROP POLICY IF EXISTS "admin_all_registrations" ON public.workshop_registrations;

DROP POLICY IF EXISTS "Permitir lectura publica de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Permitir gestion de inscripciones" ON public.workshop_registrations;

DROP POLICY IF EXISTS "Registro publico de inscripciones" ON public.workshop_registrations;
CREATE POLICY "Registro publico de inscripciones"
    ON public.workshop_registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pendiente');

DROP POLICY IF EXISTS "Lectura de inscripciones solo a admins" ON public.workshop_registrations;
CREATE POLICY "Lectura de inscripciones solo a admins"
    ON public.workshop_registrations
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Gestion de inscripciones solo a admins" ON public.workshop_registrations;
CREATE POLICY "Gestion de inscripciones solo a admins"
    ON public.workshop_registrations
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

REVOKE ALL ON public.workshop_registrations FROM anon;
GRANT INSERT ON public.workshop_registrations TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.workshop_registrations TO authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    cupo_limit INTEGER;
    taken_count INTEGER;
    deadline TIMESTAMPTZ;
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.product_id IS NOT DISTINCT FROM OLD.product_id
       AND NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'cancelado' THEN
        RETURN NEW;
    END IF;

    SELECT "registrationDeadline", cupo INTO deadline, cupo_limit
    FROM public.products
    WHERE id = NEW.product_id;

    IF deadline IS NOT NULL AND now() >= deadline THEN
        RAISE EXCEPTION 'registration_closed';
    END IF;

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

REVOKE ALL ON FUNCTION public.check_workshop_capacity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.register_for_workshop(
    p_product_id UUID,
    p_name TEXT,
    p_email TEXT,
    p_privacy_consent_at TIMESTAMPTZ,
    p_marketing_consent BOOLEAN
)
RETURNS public.workshop_registrations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    created public.workshop_registrations;
BEGIN
    INSERT INTO public.workshop_registrations (
        product_id, name, email, privacy_consent_at, marketing_consent
    )
    VALUES (
        p_product_id, p_name, p_email, p_privacy_consent_at, COALESCE(p_marketing_consent, false)
    )
    RETURNING * INTO created;

    RETURN created;
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.workshop_spots()
RETURNS TABLE (product_id UUID, taken BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.product_id AS product_id, count(*)::BIGINT AS taken
    FROM public.workshop_registrations r
    WHERE r.status <> 'cancelado'
    GROUP BY r.product_id;
$$;

REVOKE ALL ON FUNCTION public.workshop_spots() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.workshop_spots() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
