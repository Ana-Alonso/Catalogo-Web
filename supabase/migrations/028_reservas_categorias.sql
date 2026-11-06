-- Habilitar el metodo de reservas para las categorias 'talleres' y 'especiales'.

ALTER TABLE public.products
    DROP CONSTRAINT products_workshop_cancelled_check;

ALTER TABLE public.products
    ADD CONSTRAINT products_workshop_cancelled_check
    CHECK (NOT "workshopCancelled" OR category IN ('talleres', 'especiales'));

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
    producto_categoria TEXT;
BEGIN
    PERFORM pg_advisory_xact_lock(hashtextextended(p_product_id::text, 0));

    SELECT category INTO producto_categoria
    FROM public.products
    WHERE id = p_product_id;

    IF producto_categoria IS DISTINCT FROM 'talleres' AND producto_categoria IS DISTINCT FROM 'especiales' THEN
        RAISE EXCEPTION 'not_a_workshop';
    END IF;

    INSERT INTO public.workshop_registrations (
        product_id, name, email, privacy_consent_at, marketing_consent
    )
    VALUES (
        p_product_id,
        p_name,
        p_email,
        CASE WHEN p_privacy_consent_at IS NOT NULL THEN now() ELSE NULL END,
        COALESCE(p_marketing_consent, false)
    )
    RETURNING * INTO created;

    RETURN created;
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) FROM anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) TO service_role';
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.workshop_spots()
RETURNS TABLE (product_id UUID, taken BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.product_id AS product_id, count(*)::BIGINT AS taken
    FROM public.workshop_registrations r
    JOIN public.products p ON p.id = r.product_id
    WHERE r.status <> 'cancelado'
      AND (
        public.is_admin()
        OR (
          p.category IN ('talleres', 'especiales')
          AND p."isVisible"
          AND NOT p."workshopCancelled"
        )
      )
    GROUP BY r.product_id;
$$;

REVOKE ALL ON FUNCTION public.workshop_spots() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.workshop_spots() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
