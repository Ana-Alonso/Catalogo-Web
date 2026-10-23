-- ==========================================
-- Hardening RLS para Laurel en Lienzo
-- Ejecutar tras supabase-schema.sql
-- ==========================================

-- 1) Función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'role') = 'admin',
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    FALSE
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) Restringir gestión de productos solo a admins
DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir gestion de productos solo a admins" ON public.products;
CREATE POLICY "Permitir gestion de productos solo a admins"
    ON public.products
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3) Restringir gestión de inscripciones solo a admins
DROP POLICY IF EXISTS "Permitir lectura publica de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Lectura de inscripciones solo a admins" ON public.workshop_registrations;
CREATE POLICY "Lectura de inscripciones solo a admins"
    ON public.workshop_registrations
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir gestion de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Gestion de inscripciones solo a admins" ON public.workshop_registrations;
CREATE POLICY "Gestion de inscripciones solo a admins"
    ON public.workshop_registrations
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4) Restringir storage: solo admins pueden subir/actualizar/borrar
DROP POLICY IF EXISTS "Permitir subida y gestion de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Subida gestion de imagenes solo a admins" ON storage.objects;
DROP POLICY IF EXISTS "Actualizacion imagenes solo a admins" ON storage.objects;
DROP POLICY IF EXISTS "Borrado imagenes solo a admins" ON storage.objects;
CREATE POLICY "Subida gestion de imagenes solo a admins"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Actualizacion imagenes solo a admins"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'products' AND public.is_admin())
    WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Borrado imagenes solo a admins"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'products' AND public.is_admin());
