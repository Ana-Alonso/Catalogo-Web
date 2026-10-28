-- Asegurar permisos para inserciones anónimas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.workshop_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.workshop_registrations TO authenticated;
