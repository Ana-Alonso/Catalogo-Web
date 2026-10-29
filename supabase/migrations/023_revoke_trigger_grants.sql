REVOKE ALL ON FUNCTION public.check_workshop_capacity() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.prevent_marketing_consent_delete() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_marketing_consent_delete() TO authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO service_role';
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.prevent_marketing_consent_delete() TO service_role';
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
