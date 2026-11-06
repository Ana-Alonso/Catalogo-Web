-- Herencia de privilegios para el resto de roles de la base (migracion 032).
--
-- La 031 cort6 los privilegios por defecto sobre tablas nuevas, pero
-- ALTER DEFAULT PRIVILEGES sin FOR ROLE solo afecta al rol que ejecuta la
-- sentencia (postgres, el dueno que aplic6 las migraciones). Las tablas que
-- creen los demas roles con permiso de CREATE en public seguirian naciendo
-- accesibles para anon y authenticated, asf que la cesion se retira tambien
-- para cada uno de ellos, recorrido desde el cat6logo (pg_roles + ACL del
-- esquema, que es lo que ve PostgREST). Es idempotente: puede relanzarse
-- cuando aparezca un rol nuevo.
DO $$
DECLARE
    rol RECORD;
BEGIN
    FOR rol IN
        SELECT r.rolname
        FROM pg_roles r
        WHERE r.rolcanlogin
          AND has_schema_privilege(r.rolname, 'public', 'CREATE')
    LOOP
        BEGIN
            EXECUTE format(
                'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public '
                || 'REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated',
                rol.rolname
            );
        EXCEPTION WHEN insufficient_privilege OR undefined_object THEN
            RAISE WARNING '032: no se pudieron ajustar los privilegios por defecto del rol %', rol.rolname;
        END;
    END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
