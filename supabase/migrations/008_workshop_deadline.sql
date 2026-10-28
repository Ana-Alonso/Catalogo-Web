ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS "registrationDeadline" TIMESTAMPTZ NULL;

CREATE OR REPLACE FUNCTION public.check_workshop_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    cupo_limit INTEGER;
    taken_count INTEGER;
    deadline TIMESTAMPTZ;
BEGIN
    IF TG_OP = 'UPDATE'
       AND NEW.product_id IS NOT DISTINCT FROM OLD.product_id
       AND NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'cancelado' THEN
        RETURN NEW;
    END IF;

    SELECT "registrationDeadline", cupo INTO deadline, cupo_limit
    FROM public.products
    WHERE id = NEW.product_id
    FOR UPDATE;

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
