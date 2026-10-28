-- Permitir SELECT a anon para que el trigger pueda contar inscripciones
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.workshop_registrations TO anon, authenticated;
GRANT INSERT ON TABLE public.workshop_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.workshop_registrations TO authenticated;
