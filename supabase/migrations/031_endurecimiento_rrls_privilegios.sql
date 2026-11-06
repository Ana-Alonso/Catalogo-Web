-- Endurecimiento de la base de datos (migracion 031).
--
-- 1) Los CHECK de precio, divisa, descuentos y origen/Etsy (003 y 007) se
--    anadieron NOT VALID y nunca se validaron: las filas anteriores a su
--    creacion siguen pudiendo incumplirlos. Se validan aqui siguiendo el
--    patron de 025: cada constraint en su bloque, para que una fila
--    incompatible no revierta las demas. Si alguna valida y falla, queda
--    el aviso (WARNING) con el nombre para poder limpiar los datos y
--    relanzar.
--
-- 2) Privilegios por defecto: hasta ahora las tablas nuevas nacian accesibles
--    para anon y authenticated heredado del dueno (comportamiento historico de
--    Supabase). A partir de aqui cada tabla nueva debe recibir sus GRANT
--    explicitos, como ya hacen las migraciones desde 010. Solo la propiedad de
--    la base de datos (la duena de la cuenta) puede alterar tablas o desactivar
--    RLS; las roles de la API no tienen ese permiso y con esto tampoco lo
--    heredan sobre tablas futuras.
--
--    Las funciones tienen una particularidad: PostgreSQL siempre nace con
--    EXECUTE concedido a PUBLIC y ALTER DEFAULT PRIVILEGES no puede suprimir
--    ese valor por defecto (comprobado sobre postgres:15: proacl queda NULL y
--    anon conserva EXECUTE). Por eso aqui se desmonta la cesion implicita de
--    las funciones existentes (revoke a PUBLIC + re-GRANT explicito de lo que
--    cada rol usaba de verdad) y las migraciones futuras deben seguir el
--    patron de 025/031: REVOKE por funcion cuando no deba ser publica.

DO $$
BEGIN
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_price_cents_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_price_cents_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_currency_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_currency_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_discount_percent_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_discount_percent_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_source_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_source_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_etsy_listing_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_etsy_listing_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_etsy_no_discount_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_etsy_no_discount_check';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_local_no_etsy_sale_check;
EXCEPTION WHEN check_violation THEN
    RAISE WARNING '031: filas de products incumplen products_local_no_etsy_sale_check';
END;
END $$;

-- 2a) Los writes de la API pasan por RLS y por los GRANT explicitos de cada
--     migracion; CREATE sobre el esquema no lo necesita ninguna rol anonima o
--     autenticada y se retira tambien para el pseudo-rol PUBLIC.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM anon, authenticated;

-- 2b) Tablas futuras: nada nace accesible para anon/authenticated, cada tabla
--     nueva tendra que conceder permisos explicitamente.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;

-- 2c) Funciones existentes: PostgreSQL nace concediendo EXECUTE a PUBLIC y
--    ese valor por defecto no se puede suprimir con ALTER DEFAULT
--    PRIVILEGES, ni con un REVOKE global (comprobado sobre postgres:15:
--    mientras el ACL esta sin tocar, la cesion implicita sigue viva). La
--    unica via eficaz es el REVOKE por objeto, que materializa el ACL y
--    desactiva el defecto. Aqui se desmonta la cesion implicita de todas las
--    funciones existentes; los GRANT explicitos de las migraciones (anon
--    sobre workshop_spots, service_role sobre las RPC...) siguen valiendo
--    porque el revoke solo afecta a PUBLIC. Las funciones futuras necesitan
--    su REVOKE por funcion, como hacen 025 y este mismo bloque.
DO $$
DECLARE
    sig TEXT;
BEGIN
    FOR sig IN
        SELECT p.oid::regprocedure::text
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
    LOOP
        EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', sig);
    END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
