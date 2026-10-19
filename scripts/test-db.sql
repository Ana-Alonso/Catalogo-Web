DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'cupo'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.cupo ausente';
  END IF;

  IF to_regclass('public.workshop_registrations') IS NULL THEN
    RAISE EXCEPTION 'FAIL: tabla workshop_registrations ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'workshop_registrations_active_email_idx'
  ) THEN
    RAISE EXCEPTION 'FAIL: índice único de email ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_workshop_capacity'
      AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'FAIL: trigger trg_workshop_capacity ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Gestion autenticada de productos'
      AND roles = '{authenticated}'
  ) THEN
    RAISE EXCEPTION 'FAIL: política autenticada en products ausente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Permitir gestion de productos'
  ) THEN
    RAISE EXCEPTION 'FAIL: política abierta antigua en products todavía existe';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'workshop_registrations'
      AND policyname = 'Registro publico de inscripciones'
      AND cmd = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'FAIL: política INSERT pública en workshop_registrations ausente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'workshop_registrations'
      AND policyname = 'Permitir gestion de inscripciones'
  ) THEN
    RAISE EXCEPTION 'FAIL: política abierta antigua en workshop_registrations todavía existe';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workshop_registrations_email_format_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de formato de email ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workshop_registrations_name_length_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de longitud de nombre ausente';
  END IF;
END $$;

INSERT INTO public.products (id, title, description, image, category, status, featured, cupo)
VALUES ('00000000-0000-0000-0000-000000000001', 'Taller con cupo', 'Descripción', 'img.png', 'talleres', 'disponible', false, 1);

INSERT INTO public.products (id, title, description, image, category, status, featured, cupo)
VALUES ('00000000-0000-0000-0000-000000000002', 'Taller sin cupo', 'Descripción', 'img.png', 'talleres', 'disponible', false, NULL);

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Ana García', 'ana@test.com');

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Luis Prueba', 'luis@test.com');
    RAISE EXCEPTION 'FAIL: no se bloqueó el exceso de cupo';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'workshop_full' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al exceder cupo: %', SQLERRM;
      END IF;
  END;
END $$;

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000002', 'Lucía Prevía', 'lucia@test.com');

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000002', 'Ana Duplicada', 'LUCIA@test.com');
    RAISE EXCEPTION 'FAIL: no se bloqueó el email duplicado';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_active_email_idx%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al duplicar email: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000002', 'Email Inválido', 'no-es-un-email');
    RAISE EXCEPTION 'FAIL: se permitió un email inválido';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_email_format_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar email: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000002', 'X', 'corto@test.com');
    RAISE EXCEPTION 'FAIL: se permitió un nombre de un solo carácter';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_name_length_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar nombre: %', SQLERRM;
      END IF;
  END;
END $$;

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000002', 'Luis Sin Límite', 'luis2@test.com');

DO $$
DECLARE
  activas INTEGER;
BEGIN
  SELECT count(*) INTO activas
  FROM public.workshop_registrations
  WHERE product_id = '00000000-0000-0000-0000-000000000002'
    AND status <> 'cancelado';

  IF activas <> 2 THEN
    RAISE EXCEPTION 'FAIL: se esperaban 2 inscripciones activas en taller sin cupo, hay %', activas;
  END IF;
END $$;

DELETE FROM public.workshop_registrations WHERE email = 'ana@test.com';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000002';
