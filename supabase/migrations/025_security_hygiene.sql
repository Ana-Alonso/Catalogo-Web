-- Higiene de permisos y cierre de la carrera de cupo.

-- 1) El trigger perdió el FOR UPDATE en 012 y nunca volvió. El bloqueo advisory
--    de 022 solo cubre quien entra por register_for_workshop: los writes que van
--    directo a la tabla (cambiar estado desde el panel, INSERT con service_role)
--    contaban plazas sin serializar y podían superar el cupo. El bloqueo se toma
--    ahora en el propio trigger, con la misma clave, así que todos los caminos
--    de escritura se serializan. pg_advisory_xact_lock se puede adquirir más de
--    una vez en la misma transacción, así que registrar por la vía RPC no se
--    bloquea a sí mismo.
CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    cupo_limit INTEGER;
    taken_count INTEGER;
    deadline TIMESTAMPTZ;
    is_cancelled BOOLEAN;
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.product_id IS NOT DISTINCT FROM OLD.product_id
       AND NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'cancelado' THEN
        RETURN NEW;
    END IF;

    IF NEW.product_id IS NOT NULL THEN
        PERFORM pg_advisory_xact_lock(hashtextextended(NEW.product_id::text, 0));
    END IF;

    SELECT "registrationDeadline", cupo, "workshopCancelled"
    INTO deadline, cupo_limit, is_cancelled
    FROM public.products
    WHERE id = NEW.product_id;

    IF is_cancelled THEN
        RAISE EXCEPTION 'registration_closed';
    END IF;

    IF deadline IS NOT NULL AND now() >= deadline THEN
        RAISE EXCEPTION 'registration_closed';
    END IF;

    IF cupo_limit IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT count(*) INTO taken_count
    FROM public.workshop_registrations
    WHERE product_id = NEW.product_id
      AND status <> 'cancelado'
      AND id <> NEW.id;

    IF taken_count >= cupo_limit THEN
        RAISE EXCEPTION 'workshop_full';
    END IF;

    RETURN NEW;
END;
$$;

-- 2) Son funciones de trigger: se disparan por el evento, no las llama el
--    cliente, así que su EXECUTE a authenticated es superficie muerta.
REVOKE ALL ON FUNCTION public.check_workshop_capacity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_marketing_consent_delete() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO service_role';
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.prevent_marketing_consent_delete() TO service_role';
    END IF;
END $$;

-- 3) 013 dio USAGE, SELECT sobre ALL SEQUENCES a anon y authenticated y nunca se
--    revocó. Hoy no hay secuencias, pero volvería a aplicarse si se añade una
--    columna serial; se retira la cesión actual y la de las futuras.
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;

-- 4) Los checks de 002 se añadieron NOT VALID y nunca se validaron: siguen
--    admitiendo filas históricas incompatibles. Cada validación va en su bloque
--    para que una fila incompatible no revierta las demás; se avisa sin abortar,
--    para no dejar el resto de la migración sin aplicar.
DO $$
BEGIN
BEGIN
    ALTER TABLE public.workshop_registrations VALIDATE CONSTRAINT workshop_registrations_email_format_check;
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE '025: filas de workshop_registrations incumplen el formato de email';
END;
BEGIN
    ALTER TABLE public.workshop_registrations VALIDATE CONSTRAINT workshop_registrations_name_length_check;
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE '025: filas de workshop_registrations incumplen la longitud de nombre';
END;
BEGIN
    ALTER TABLE public.workshop_registrations VALIDATE CONSTRAINT workshop_registrations_email_length_check;
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE '025: filas de workshop_registrations incumplen la longitud de email';
END;
BEGIN
    ALTER TABLE public.products VALIDATE CONSTRAINT products_title_length_check;
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE '025: filas de products incumplen la longitud de título';
END;
END $$;

NOTIFY pgrst, 'reload schema';
