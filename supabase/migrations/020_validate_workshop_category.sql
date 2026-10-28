-- Exige que la inscripción apunte a un producto de categoría 'talleres';
-- hasta ahora solo se validaba la FK y el aforo.

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
    SELECT category INTO producto_categoria
    FROM public.products
    WHERE id = p_product_id;

    IF producto_categoria IS DISTINCT FROM 'talleres' THEN
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

NOTIFY pgrst, 'reload schema';
