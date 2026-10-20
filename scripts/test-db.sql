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

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'priceCents'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.priceCents ausente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'price'
  ) THEN
    RAISE EXCEPTION 'FAIL: columna legacy products.price todavía existe';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'discountPercent'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.discountPercent ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'etsyListingId'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.etsyListingId ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'isVisible'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.isVisible ausente';
  END IF;

  IF to_regclass('public.etsy_credentials') IS NULL THEN
    RAISE EXCEPTION 'FAIL: tabla etsy_credentials ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'products_etsy_listing_id_idx'
  ) THEN
    RAISE EXCEPTION 'FAIL: índice único de etsyListingId ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_discount_percent_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de descuento ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_etsy_no_discount_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de descuento en Etsy ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Lectura de productos visibles'
  ) THEN
    RAISE EXCEPTION 'FAIL: política de visibilidad en products ausente';
  END IF;
END $$;

INSERT INTO public.products (id, title, description, image, category, status, featured, cupo)
VALUES ('00000000-0000-0000-0000-000000000001', 'Taller con cupo', 'Descripción', 'img.png', 'talleres', 'disponible', false, 1);

INSERT INTO public.products (id, title, description, image, category, status, featured, cupo)
VALUES ('00000000-0000-0000-0000-000000000002', 'Taller sin cupo', 'Descripción', 'img.png', 'talleres', 'disponible', false, NULL);

INSERT INTO public.products (
    id, title, description, image, category, status, featured,
    "priceCents", currency, "discountPercent", source, "isVisible"
)
VALUES (
    '00000000-0000-0000-0000-000000000003', 'Obra en oferta', 'Descripción', 'img.png',
    'ilustraciones', 'disponible', false, 2500, 'EUR', 20, 'local', true
);

INSERT INTO public.products (
    id, title, description, image, category, status, featured,
    "priceCents", currency, source, "etsyListingId", "isVisible"
)
VALUES (
    '00000000-0000-0000-0000-000000000004', 'Obra oculta de Etsy', 'Descripción', 'img.png',
    'ilustraciones', 'disponible', false, 3000, 'EUR', 'etsy', 987654321, false
);

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

DO $$
BEGIN
  BEGIN
    INSERT INTO public.products (
        id, title, description, image, category, status, featured,
        "priceCents", currency, "discountPercent", source
    )
    VALUES (
        '00000000-0000-0000-0000-000000000005', 'Descuento sin precio', 'Descripción',
        'img.png', 'ilustraciones', 'disponible', false, NULL, 'EUR', 20, 'local'
    );
    RAISE EXCEPTION 'FAIL: se permitió un descuento sin precio';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_discount_percent_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar descuento sin precio: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.products (
        id, title, description, image, category, status, featured,
        "priceCents", currency, "discountPercent", source, "etsyListingId"
    )
    VALUES (
        '00000000-0000-0000-0000-000000000006', 'Descuento en Etsy', 'Descripción',
        'img.png', 'ilustraciones', 'disponible', false, 2500, 'EUR', 20, 'etsy', 111222333
    );
    RAISE EXCEPTION 'FAIL: se permitió un descuento en un producto de Etsy';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_etsy_no_discount_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar descuento Etsy: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.products (
        id, title, description, image, category, status, featured, source
    )
    VALUES (
        '00000000-0000-0000-0000-000000000007', 'Etsy sin listing', 'Descripción',
        'img.png', 'ilustraciones', 'disponible', false, 'etsy'
    );
    RAISE EXCEPTION 'FAIL: se permitió un producto Etsy sin listing id';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_etsy_listing_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar listing Etsy: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.products (
        id, title, description, image, category, status, featured, source
    )
    VALUES (
        '00000000-0000-0000-0000-000000000008', 'Origen inválido', 'Descripción',
        'img.png', 'ilustraciones', 'disponible', false, 'vinted'
    );
    RAISE EXCEPTION 'FAIL: se permitió un origen inválido';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_source_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar origen: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.products (
        id, title, description, image, category, status, featured,
        "priceCents", currency, source, "etsyListingId"
    )
    VALUES (
        '00000000-0000-0000-0000-000000000009', 'Listing duplicado', 'Descripción',
        'img.png', 'ilustraciones', 'disponible', false, 3000, 'EUR', 'etsy', 987654321
    );
    RAISE EXCEPTION 'FAIL: se permitió un listing de Etsy duplicado';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_etsy_listing_id_idx%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al duplicar listing Etsy: %', SQLERRM;
      END IF;
  END;
END $$;

SET ROLE anon;

DO $$
DECLARE
  visibles INTEGER;
  ocultos INTEGER;
BEGIN
  SELECT count(*) INTO visibles
  FROM public.products
  WHERE id = '00000000-0000-0000-0000-000000000003';

  SELECT count(*) INTO ocultos
  FROM public.products
  WHERE id = '00000000-0000-0000-0000-000000000004';

  IF visibles <> 1 THEN
    RAISE EXCEPTION 'FAIL: anon no ve el producto visible';
  END IF;

  IF ocultos <> 0 THEN
    RAISE EXCEPTION 'FAIL: anon ve el producto oculto';
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    PERFORM 1 FROM public.etsy_credentials;
    RAISE EXCEPTION 'FAIL: anon puede leer etsy_credentials';
  EXCEPTION
    WHEN raise_exception THEN
      RAISE;
    WHEN insufficient_privilege THEN
      NULL;
  END;
END $$;

RESET ROLE;

SET ROLE authenticated;

DO $$
DECLARE
  ocultos INTEGER;
BEGIN
  SELECT count(*) INTO ocultos
  FROM public.products
  WHERE id = '00000000-0000-0000-0000-000000000004';

  IF ocultos <> 1 THEN
    RAISE EXCEPTION 'FAIL: el admin autenticado no ve el producto oculto';
  END IF;
END $$;

RESET ROLE;

DELETE FROM public.workshop_registrations WHERE email = 'ana@test.com';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000002';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000003';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000004';
