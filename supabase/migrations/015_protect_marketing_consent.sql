CREATE OR REPLACE FUNCTION public.prevent_marketing_consent_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.marketing_consent THEN
        RAISE EXCEPTION 'marketing_consent_protected';
    END IF;

    RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_marketing_consent_delete() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prevent_marketing_consent_delete() TO anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_marketing_consent ON public.workshop_registrations;
CREATE TRIGGER trg_protect_marketing_consent
    BEFORE DELETE ON public.workshop_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_marketing_consent_delete();

NOTIFY pgrst, 'reload schema';
