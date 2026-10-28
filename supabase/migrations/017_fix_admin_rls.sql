-- Endurecimiento de RLS: is_admin fiable y retirada de políticas laxas heredadas.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gestion autenticada de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir gestion de productos solo a admins" ON public.products;
CREATE POLICY "Permitir gestion de productos solo a admins"
    ON public.products
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
DROP POLICY IF EXISTS "Lectura publica de productos visibles" ON public.products;
DROP POLICY IF EXISTS "Lectura de productos visibles" ON public.products;
CREATE POLICY "Lectura de productos visibles"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING ("isVisible" OR public.is_admin());

REVOKE ALL ON public.products FROM anon;
REVOKE ALL ON public.products FROM authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gestion autenticada de inscripciones" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Gestion autenticada de inscripciones (update)" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Gestion autenticada de inscripciones (delete)" ON public.workshop_registrations;

REVOKE ALL ON public.workshop_registrations FROM anon;
REVOKE ALL ON public.workshop_registrations FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshop_registrations TO authenticated;

DROP POLICY IF EXISTS "Gestion autenticada de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida y gestion de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Subida gestion de imagenes solo a admins" ON storage.objects;
DROP POLICY IF EXISTS "Actualizacion imagenes solo a admins" ON storage.objects;
DROP POLICY IF EXISTS "Borrado imagenes solo a admins" ON storage.objects;

CREATE POLICY "Subida gestion de imagenes solo a admins"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Actualizacion imagenes solo a admins"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'products' AND public.is_admin())
    WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Borrado imagenes solo a admins"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'products' AND public.is_admin());

NOTIFY pgrst, 'reload schema';
