-- Reservas por unidades para la categoria 'especiales'.
--
-- Cada registro guarda cuantas unidades pidio la persona (quantity). La
-- capacidad pasa a medirse en unidades (SUM) en lugar de filas (COUNT).
-- 'talleres' conserva su comportamiento: sus filas valen 1 y la aritmetica
-- nuevas (others + 1 > cupo) equivale a la antigua (others >= cupo).

ALTER TABLE public.workshop_registrations
    ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

ALTER TABLE public.workshop_registrations
    DROP CONSTRAINT IF EXISTS workshop_registrations_quantity_check;

ALTER TABLE public.workshop_registrations
    ADD CONSTRAINT workshop_registrations_quantity_check
    CHECK (quantity BETWEEN 1 AND 10);

CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    cupo_limit INTEGER;
    taken_units INTEGER;
    deadline TIMESTAMPTZ;
    is_cancelled BOOLEAN;
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.product_id IS NOT DISTINCT FROM OLD.product_id
       AND NEW.status = OLD.status
       AND NEW.quantity = OLD.quantity THEN
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

    SELECT COALESCE(SUM(quantity), 0)::INTEGER INTO taken_units
    FROM public.workshop_registrations
    WHERE product_id = NEW.product_id
      AND status <> 'cancelado'
      AND id <> NEW.id;

    IF taken_units + NEW.quantity > cupo_limit THEN
        RAISE EXCEPTION 'workshop_full';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.check_workshop_capacity() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO service_role';
    END IF;
END $$;

-- La firma de 5 parametros se retira: el RPC pasa a recibir p_quantity.
DROP FUNCTION IF EXISTS public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN);

CREATE OR REPLACE FUNCTION public.register_for_workshop(
    p_product_id UUID,
    p_name TEXT,
    p_email TEXT,
    p_privacy_consent_at TIMESTAMPTZ,
    p_marketing_consent BOOLEAN,
    p_quantity INTEGER
)
RETURNS public.workshop_registrations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    created public.workshop_registrations;
    producto_categoria TEXT;
    unidades INTEGER;
BEGIN
    PERFORM pg_advisory_xact_lock(hashtextextended(p_product_id::text, 0));

    SELECT category INTO producto_categoria
    FROM public.products
    WHERE id = p_product_id;

    IF producto_categoria IS DISTINCT FROM 'talleres' AND producto_categoria IS DISTINCT FROM 'especiales' THEN
        RAISE EXCEPTION 'not_a_workshop';
    END IF;

    IF producto_categoria = 'talleres' THEN
        IF p_quantity IS NOT NULL AND p_quantity <> 1 THEN
            RAISE EXCEPTION 'invalid_quantity';
        END IF;
        unidades := 1;
    ELSE
        unidades := COALESCE(p_quantity, 1);
        IF unidades < 1 OR unidades > 10 THEN
            RAISE EXCEPTION 'invalid_quantity';
        END IF;
    END IF;

    INSERT INTO public.workshop_registrations (
        product_id, name, email, privacy_consent_at, marketing_consent, quantity
    )
    VALUES (
        p_product_id,
        p_name,
        p_email,
        CASE WHEN p_privacy_consent_at IS NOT NULL THEN now() ELSE NULL END,
        COALESCE(p_marketing_consent, false),
        unidades
    )
    RETURNING * INTO created;

    RETURN created;
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN, INTEGER) FROM anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.register_for_workshop(UUID, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN, INTEGER) TO service_role';
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.workshop_spots()
RETURNS TABLE (product_id UUID, taken BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.product_id AS product_id, COALESCE(SUM(r.quantity), 0)::BIGINT AS taken
    FROM public.workshop_registrations r
    JOIN public.products p ON p.id = r.product_id
    WHERE r.status <> 'cancelado'
      AND (
        public.is_admin()
        OR (
          p.category IN ('talleres', 'especiales')
          AND p."isVisible"
          AND NOT p."workshopCancelled"
        )
      )
    GROUP BY r.product_id;
$$;

REVOKE ALL ON FUNCTION public.workshop_spots() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.workshop_spots() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
