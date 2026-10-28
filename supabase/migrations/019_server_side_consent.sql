-- Sella el consentimiento con hora del servidor y retira el INSERT directo
-- residual de 017; las altas escriben solo via /api/registrations (service_role).

REVOKE ALL ON public.workshop_registrations FROM anon;
REVOKE ALL ON public.workshop_registrations FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON public.workshop_registrations TO authenticated;

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
