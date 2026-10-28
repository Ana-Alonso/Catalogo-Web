-- Permitir inscripciones públicas anónimas a talleres
DROP POLICY IF EXISTS "Registro publico de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Permitir registro publico de inscripciones" ON public.workshop_registrations;

CREATE POLICY "Registro publico de inscripciones"
    ON public.workshop_registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pendiente');
