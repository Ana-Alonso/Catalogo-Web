ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS "workshopCancelled" BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'products_workshop_cancelled_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_workshop_cancelled_check
            CHECK (NOT "workshopCancelled" OR category = 'talleres');
    END IF;
END $$;

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

REVOKE ALL ON FUNCTION public.check_workshop_capacity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_workshop_capacity() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
