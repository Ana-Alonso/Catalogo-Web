-- La inscripción pública viaja por la ruta /api/registrations del servidor,
-- que escribe con el rol service_role. El rol anon ya no puede registrar talleres.

REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN)
    FROM anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) TO service_role';
    END IF;
END $$;

DROP POLICY IF EXISTS "Registro publico de inscripciones" ON public.workshop_registrations;

NOTIFY pgrst, 'reload schema';
