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

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'registrationDeadline'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.registrationDeadline ausente';
  END IF;

  IF to_regclass('public.workshop_registrations') IS NULL THEN
    RAISE EXCEPTION 'FAIL: tabla workshop_registrations ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'workshopCancelled'
  ) THEN
    RAISE EXCEPTION 'FAIL: products.workshopCancelled ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_workshop_cancelled_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de taller cancelado ausente';
  END IF;

  IF to_regprocedure('public.register_for_workshop(uuid,text,text,timestamptz,boolean,integer)') IS NULL THEN
    RAISE EXCEPTION 'FAIL: función register_for_workshop ausente';
  END IF;

  IF to_regprocedure('public.register_for_workshop(uuid,text,text,timestamptz,boolean)') IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL: la firma antigua de 5 parametros de register_for_workshop sigue viva';
  END IF;

  IF to_regprocedure('public.workshop_spots()') IS NULL THEN
    RAISE EXCEPTION 'FAIL: función workshop_spots ausente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'workshop_registrations'
      AND policyname IN ('public_read_registrations', 'admin_all_registrations', 'public_insert_pending')
  ) THEN
    RAISE EXCEPTION 'FAIL: políticas abiertas de la migración 013 todavía existen';
  END IF;

  IF has_table_privilege('anon', 'public.workshop_registrations', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: anon puede leer inscripciones';
  END IF;

  IF NOT has_function_privilege('anon', 'public.workshop_spots()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon no puede ejecutar workshop_spots';
  END IF;

  IF has_function_privilege('anon', 'public.register_for_workshop(uuid,text,text,timestamptz,boolean,integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon todavía puede ejecutar register_for_workshop';
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

  IF to_regprocedure('public.prevent_marketing_consent_delete()') IS NULL THEN
    RAISE EXCEPTION 'FAIL: función prevent_marketing_consent_delete ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_protect_marketing_consent'
      AND tgrelid = 'public.workshop_registrations'::regclass
      AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'FAIL: trigger trg_protect_marketing_consent ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Permitir gestion de productos solo a admins'
      AND roles = '{authenticated}'
  ) THEN
    RAISE EXCEPTION 'FAIL: política de gestión de productos para admins ausente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname IN ('Gestion autenticada de productos', 'Permitir gestion de productos')
  ) THEN
    RAISE EXCEPTION 'FAIL: política abierta antigua en products todavía existe';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'workshop_registrations'
      AND policyname LIKE 'Gestion autenticada de inscripciones%'
  ) THEN
    RAISE EXCEPTION 'FAIL: política abierta antigua en workshop_registrations todavía existe';
  END IF;

  IF has_table_privilege('anon', 'public.products', 'INSERT')
     OR has_table_privilege('anon', 'public.products', 'UPDATE')
     OR has_table_privilege('anon', 'public.products', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: anon puede escribir en products';
  END IF;

  IF pg_get_functiondef('public.is_admin()'::regprocedure) LIKE '%user_metadata%' THEN
    RAISE EXCEPTION 'FAIL: is_admin confía en user_metadata';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'workshop_registrations'
      AND policyname = 'Registro publico de inscripciones'
  ) THEN
    RAISE EXCEPTION 'FAIL: la política de inserción pública sigue activa';
  END IF;

  IF has_table_privilege('authenticated', 'public.workshop_registrations', 'INSERT') THEN
    RAISE EXCEPTION 'FAIL: authenticated puede insertar directamente en workshop_registrations';
  END IF;

  IF NOT has_table_privilege('authenticated', 'public.workshop_registrations', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.workshop_registrations', 'UPDATE')
     OR NOT has_table_privilege('authenticated', 'public.workshop_registrations', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: authenticated perdio SELECT/UPDATE/DELETE en workshop_registrations';
  END IF;

  IF pg_get_functiondef('public.register_for_workshop(uuid,text,text,timestamptz,boolean,integer)'::regprocedure)
     NOT LIKE '%now()%' THEN
    RAISE EXCEPTION 'FAIL: register_for_workshop no usa hora del servidor para el consentimiento';
  END IF;

  IF pg_get_functiondef('public.register_for_workshop(uuid,text,text,timestamptz,boolean,integer)'::regprocedure)
     NOT LIKE '%not_a_workshop%' THEN
    RAISE EXCEPTION 'FAIL: register_for_workshop no valida la categoria de taller';
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

  IF pg_get_functiondef('public.register_for_workshop(uuid,text,text,timestamptz,boolean,integer)'::regprocedure)
     NOT LIKE '%pg_advisory_xact_lock%' THEN
    RAISE EXCEPTION 'FAIL: register_for_workshop no serializa las inscripciones';
  END IF;

  IF pg_get_functiondef('public.workshop_spots()'::regprocedure) NOT LIKE '%isVisible%' THEN
    RAISE EXCEPTION 'FAIL: workshop_spots no filtra por visibilidad';
  END IF;

  IF has_function_privilege('anon', 'public.check_workshop_capacity()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon puede ejecutar check_workshop_capacity';
  END IF;

  IF has_function_privilege('anon', 'public.prevent_marketing_consent_delete()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon puede ejecutar prevent_marketing_consent_delete';
  END IF;

  IF has_function_privilege('authenticated', 'public.check_workshop_capacity()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: authenticated puede ejecutar check_workshop_capacity';
  END IF;

  IF has_function_privilege('authenticated', 'public.prevent_marketing_consent_delete()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: authenticated puede ejecutar prevent_marketing_consent_delete';
  END IF;

  IF pg_get_functiondef('public.check_workshop_capacity()'::regprocedure)
     NOT LIKE '%pg_advisory_xact_lock%' THEN
    RAISE EXCEPTION 'FAIL: check_workshop_capacity no serializa por producto';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'service_role'
  ) AND NOT has_function_privilege(
    'service_role', 'public.check_workshop_capacity()', 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'FAIL: service_role no puede ejecutar check_workshop_capacity';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'service_role'
  ) AND has_function_privilege(
    'authenticated', 'public.register_for_workshop(uuid,text,text,timestamp with time zone,boolean,integer)', 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'FAIL: authenticated puede ejecutar register_for_workshop';
  END IF;

  IF to_regprocedure('public.consume_rate_limit(text,integer,integer)') IS NULL THEN
    RAISE EXCEPTION 'FAIL: función consume_rate_limit ausente';
  END IF;

  IF has_function_privilege('anon', 'public.consume_rate_limit(text,integer,integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon puede ejecutar consume_rate_limit';
  END IF;

  IF has_table_privilege('anon', 'public.rate_limit_buckets', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: anon puede leer rate_limit_buckets';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'service_role'
  ) AND NOT has_function_privilege(
    'service_role', 'public.consume_rate_limit(text,integer,integer)', 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'FAIL: service_role no puede ejecutar consume_rate_limit';
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
    FROM pg_constraint
    WHERE conname = 'products_workshop_links_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de enlaces en talleres ausente';
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
    id, title, description, image, category, status, featured, cupo, "registrationDeadline"
)
VALUES (
    '00000000-0000-0000-0000-000000000011', 'Taller con plazo cerrado', 'Descripción',
    'img.png', 'talleres', 'disponible', false, NULL, timezone('utc'::text, now()) - interval '1 day'
);

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

INSERT INTO public.products (
    id, title, description, image, category, status, featured, "workshopCancelled"
)
VALUES (
    '00000000-0000-0000-0000-000000000012', 'Taller cancelado', 'Descripción',
    'img.png', 'talleres', 'disponible', false, true
);

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000012', 'Tarde Cancelada', 'cancelada@test.com');
    RAISE EXCEPTION 'FAIL: se permitió inscribirse en un taller cancelado';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'registration_closed' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al inscribirse en un taller cancelado: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    UPDATE public.products
    SET "workshopCancelled" = true
    WHERE id = '00000000-0000-0000-0000-000000000003';
    RAISE EXCEPTION 'FAIL: se permitió cancelar un producto que no es taller';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_workshop_cancelled_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al cancelar una ilustración: %', SQLERRM;
      END IF;
  END;
END $$;

-- Ocasionales o de Temporada: reservas con el metodo de talleres (opt-in por producto)
INSERT INTO public.products (
    id, title, description, image, category, status, featured, cupo
)
VALUES (
    '00000000-0000-0000-0000-000000000015', 'Edición especial con cupo', 'Descripción',
    'img.png', 'especiales', 'disponible', false, 2
);

DO $$
BEGIN
  PERFORM public.register_for_workshop(
    '00000000-0000-0000-0000-000000000015', 'Pilar Reserva', 'pilar@test.com', now(), false, 1
  );
EXCEPTION WHEN others THEN
  RAISE EXCEPTION 'FAIL: register_for_workshop rechazó una reserva de especiales: %', SQLERRM;
END $$;

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000015', 'Rosa Tirada', 'rosa@test.com');

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000015', 'Eva Tirada', 'eva@test.com');
    RAISE EXCEPTION 'FAIL: no se bloqueó el exceso de cupo en especiales';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'workshop_full' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al exceder cupo en especiales: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  UPDATE public.products
  SET "workshopCancelled" = true
  WHERE id = '00000000-0000-0000-0000-000000000015';
EXCEPTION WHEN others THEN
  RAISE EXCEPTION 'FAIL: no se permitió cancelar una reserva de especiales: %', SQLERRM;
END $$;

-- Reservas por unidades en 'especiales' (migracion 029).
INSERT INTO public.products (
    id, title, description, image, category, status, featured, cupo
)
VALUES (
    '00000000-0000-0000-0000-000000000016', 'Edicion especial por unidades', 'Descripción',
    'img.png', 'especiales', 'disponible', false, 2
), (
    '00000000-0000-0000-0000-000000000017', 'Hasta agotar existencias', 'Descripción',
    'img.png', 'especiales', 'disponible', false, NULL
);

DO $$
DECLARE
  creada public.workshop_registrations;
  ocupadas BIGINT;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workshop_registrations'
      AND column_name = 'quantity'
  ) THEN
    RAISE EXCEPTION 'FAIL: columna workshop_registrations.quantity ausente';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workshop_registrations_quantity_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: CHECK de cantidad ausente';
  END IF;

  IF pg_get_functiondef('public.check_workshop_capacity()'::regprocedure)
     NOT LIKE '%SUM(quantity)%' THEN
    RAISE EXCEPTION 'FAIL: check_workshop_capacity no cuenta unidades';
  END IF;

  IF pg_get_functiondef('public.workshop_spots()'::regprocedure)
     NOT LIKE '%SUM(r.quantity)%' THEN
    RAISE EXCEPTION 'FAIL: workshop_spots no suma unidades';
  END IF;

  creada := public.register_for_workshop(
    '00000000-0000-0000-0000-000000000016', 'Uma Unidades', 'uma@test.com', now(), false, 2
  );

  IF creada.quantity <> 2 THEN
    RAISE EXCEPTION 'FAIL: register_for_workshop no guardo la cantidad pedida (% en vez de 2)', creada.quantity;
  END IF;

  SELECT taken INTO ocupadas
  FROM public.workshop_spots()
  WHERE product_id = '00000000-0000-0000-0000-000000000016';

  IF ocupadas <> 2 THEN
    RAISE EXCEPTION 'FAIL: workshop_spots devuelve % en vez de 2 unidades', ocupadas;
  END IF;

  -- Cupo 2 agotado por la reserva de 2 unidades: la siguiente bloqueada.
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000016', 'Carlos Uno', 'carlos@test.com', now(), false, 1
    );
    RAISE EXCEPTION 'FAIL: se permitio superar el cupo por unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'workshop_full' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al agotar unidades: %', SQLERRM;
      END IF;
  END;

  -- cantidad 11 o 0 -> invalid_quantity en especiales
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000017', 'Noa Once', 'noa@test.com', now(), false, 11
    );
    RAISE EXCEPTION 'FAIL: se acepto una cantidad de 11 unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'invalid_quantity' THEN
        RAISE EXCEPTION 'FAIL: error inesperado con cantidad 11: %', SQLERRM;
      END IF;
  END;

  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000017', 'Bera Cero', 'bera@test.com', now(), false, 0
    );
    RAISE EXCEPTION 'FAIL: se acepto una cantidad de 0 unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'invalid_quantity' THEN
        RAISE EXCEPTION 'FAIL: error inesperado con cantidad 0: %', SQLERRM;
      END IF;
  END;

  -- un taller no admite cantidades
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000002', 'Iñaki Tres', 'inaki@test.com', now(), false, 3
    );
    RAISE EXCEPTION 'FAIL: un taller admitio una reserva de 3 unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'invalid_quantity' THEN
        RAISE EXCEPTION 'FAIL: error inesperado con cantidad en taller: %', SQLERRM;
      END IF;
  END;

  -- cantidad NULL en especiales -> 1 unidad
  creada := public.register_for_workshop(
    '00000000-0000-0000-0000-000000000017', 'Zuri Nada', 'zuri@test.com', now(), false, NULL
  );

  IF creada.quantity <> 1 THEN
    RAISE EXCEPTION 'FAIL: cantidad NULL no cayo a 1 unidad (% en vez de 1)', creada.quantity;
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email, quantity)
    VALUES ('00000000-0000-0000-0000-000000000017', 'Muga Once', 'muga@test.com', 11);
    RAISE EXCEPTION 'FAIL: el CHECK de cantidad admitio 11 unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_quantity_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al insertar cantidad 11: %', SQLERRM;
      END IF;
  END;

  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email, quantity)
    VALUES ('00000000-0000-0000-0000-000000000017', 'Uga Cero', 'uga@test.com', 0);
    RAISE EXCEPTION 'FAIL: el CHECK de cantidad admitio 0 unidades';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_quantity_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al insertar cantidad 0: %', SQLERRM;
      END IF;
  END;
END $$;

-- Gestion de cobros (migracion 030): columnas, defaults, CHECK de importe
-- y que marcar el pago no disparar la comprobacion de cupo.
DO $$
DECLARE
  fila RECORD;
BEGIN
  IF (
    SELECT count(*) FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workshop_registrations'
      AND column_name IN ('amount', 'paid', 'paid_at', 'fulfilled_at')
  ) <> 4 THEN
    RAISE EXCEPTION 'FAIL: faltan columnas de pago en workshop_registrations';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workshop_registrations_amount_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: no existe el CHECK del importe';
  END IF;

  -- Las filas previas caen a "sin cobrar y sin entregar" por default.
  SELECT * INTO fila FROM public.workshop_registrations
   WHERE email = 'zuri@test.com';

  IF fila.paid IS NOT false OR fila.amount IS NOT NULL
     OR fila.paid_at IS NOT NULL OR fila.fulfilled_at IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL: los defaults de pago no dejaron la fila en pendiente';
  END IF;

  UPDATE public.workshop_registrations
     SET amount = 12.50, paid = true, paid_at = now(), fulfilled_at = now()
   WHERE email = 'zuri@test.com';

  SELECT * INTO fila FROM public.workshop_registrations
   WHERE email = 'zuri@test.com';

  IF fila.amount <> 12.50 OR fila.paid IS NOT true
     OR fila.paid_at IS NULL OR fila.fulfilled_at IS NULL THEN
    RAISE EXCEPTION 'FAIL: el alta de cobro no se guardo correctamente';
  END IF;

  -- Marcar pagada una fila de un especial lleno no debe tocar el cupo.
  UPDATE public.workshop_registrations
     SET paid = true
   WHERE email = 'pilar@test.com';

  BEGIN
    UPDATE public.workshop_registrations SET amount = -1
     WHERE email = 'zuri@test.com';
    RAISE EXCEPTION 'FAIL: el CHECK de importe admitio negativos';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%workshop_registrations_amount_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al poner importe negativo: %', SQLERRM;
      END IF;
  END;

  DELETE FROM public.workshop_registrations WHERE email = 'zuri@test.com';
END $$;

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000002', 'Lucía Prevía', 'lucia@test.com');

DO $$
BEGIN
  BEGIN
    INSERT INTO public.workshop_registrations (product_id, name, email)
    VALUES ('00000000-0000-0000-0000-000000000011', 'Nerea Tardía', 'nerea@test.com');
    RAISE EXCEPTION 'FAIL: no se bloqueó la inscripción fuera de plazo';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'registration_closed' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al inscribirse fuera de plazo: %', SQLERRM;
      END IF;
  END;
END $$;

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

INSERT INTO public.workshop_registrations (product_id, name, email, marketing_consent)
VALUES ('00000000-0000-0000-0000-000000000002', 'Contacto Protegido', 'protegido@test.com', true);

DO $$
BEGIN
  BEGIN
    DELETE FROM public.workshop_registrations WHERE email = 'protegido@test.com';
    RAISE EXCEPTION 'FAIL: se borró una inscripción con consentimiento de marketing';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'marketing_consent_protected' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al borrar una inscripción protegida: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000002';
    RAISE EXCEPTION 'FAIL: se borró un taller con contactos protegidos';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'marketing_consent_protected' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al borrar el taller protegido: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
DECLARE
  protegidas INTEGER;
BEGIN
  SELECT count(*) INTO protegidas
  FROM public.workshop_registrations
  WHERE email = 'protegido@test.com';

  IF protegidas <> 1 THEN
    RAISE EXCEPTION 'FAIL: la inscripción protegida desapareció tras los intentos de borrado';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = '00000000-0000-0000-0000-000000000002') THEN
    RAISE EXCEPTION 'FAIL: el taller protegido desapareció tras el intento de borrado';
  END IF;
END $$;

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000002', 'Contacto Borrable', 'borrable@test.com');

DO $$
DECLARE
  borradas INTEGER;
BEGIN
  DELETE FROM public.workshop_registrations WHERE email = 'borrable@test.com';

  SELECT count(*) INTO borradas
  FROM public.workshop_registrations
  WHERE email = 'borrable@test.com';

  IF borradas <> 0 THEN
    RAISE EXCEPTION 'FAIL: no se borró una inscripción sin consentimiento de marketing';
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
        id, title, description, image, category, status, featured, "etsyLink"
    )
    VALUES (
        '00000000-0000-0000-0000-000000000009', 'Taller con enlace', 'Descripción',
        'img.png', 'talleres', 'disponible', false, 'https://www.etsy.com/listing/1'
    );
    RAISE EXCEPTION 'FAIL: se permitió un enlace de Etsy en un taller';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM NOT LIKE '%products_workshop_links_check%' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al validar enlace en taller: %', SQLERRM;
      END IF;
  END;
END $$;

INSERT INTO public.products (
    id, title, description, image, category, status, featured,
    "etsyLink", "vintedLink"
)
VALUES (
    '00000000-0000-0000-0000-000000000010', 'Obra con enlaces', 'Descripción',
    'img.png', 'ilustraciones', 'disponible', false,
    'https://www.etsy.com/listing/2', 'https://www.vinted.es/items/2'
);

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

INSERT INTO public.products (id, title, description, image, category, status, featured)
VALUES ('00000000-0000-0000-0000-000000000013', 'Taller que se ocultara', 'Descripción', 'img.png', 'talleres', 'disponible', false);

INSERT INTO public.products (id, title, description, image, category, status, featured)
VALUES ('00000000-0000-0000-0000-000000000014', 'Taller que se cancelara', 'Descripción', 'img.png', 'talleres', 'disponible', false);

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000013', 'Oculto Inscrito', 'oculto@test.com');

INSERT INTO public.workshop_registrations (product_id, name, email)
VALUES ('00000000-0000-0000-0000-000000000014', 'Cancelado Inscrito', 'programado@test.com');

UPDATE public.products SET "isVisible" = false WHERE id = '00000000-0000-0000-0000-000000000013';
UPDATE public.products SET "workshopCancelled" = true WHERE id = '00000000-0000-0000-0000-000000000014';

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

DO $$
BEGIN
  BEGIN
    PERFORM 1 FROM public.workshop_registrations;
    RAISE EXCEPTION 'FAIL: anon puede leer las inscripciones';
  EXCEPTION
    WHEN raise_exception THEN
      RAISE;
    WHEN insufficient_privilege THEN
      NULL;
  END;
END $$;

DO $$
DECLARE
  ocupadas BIGINT;
BEGIN
  SELECT taken INTO ocupadas
  FROM public.workshop_spots()
  WHERE product_id = '00000000-0000-0000-0000-000000000001';

  IF ocupadas <> 1 THEN
    RAISE EXCEPTION 'FAIL: workshop_spots devuelve % plazas en vez de 1', ocupadas;
  END IF;
END $$;

DO $$
DECLARE
  filtradas INTEGER;
BEGIN
  SELECT count(*) INTO filtradas
  FROM public.workshop_spots()
  WHERE product_id IN (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014'
  );

  IF filtradas <> 0 THEN
    RAISE EXCEPTION 'FAIL: anon obtiene plazas de talleres ocultos o cancelados';
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000002',
      'Elena Rpc',
      'elena@test.com',
      now(),
      false,
      1
    );
    RAISE EXCEPTION 'FAIL: anon puede ejecutar register_for_workshop';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN insufficient_privilege THEN
      NULL;
  END;
END $$;

RESET ROLE;

DO $$
DECLARE
  creada public.workshop_registrations;
BEGIN
  creada := public.register_for_workshop(
    '00000000-0000-0000-0000-000000000002',
    'Elena Rpc',
    'elena@test.com',
    now(),
    false,
    1
  );

  IF creada.id IS NULL OR creada.status <> 'pendiente' THEN
    RAISE EXCEPTION 'FAIL: register_for_workshop no devolvió una inscripción pendiente';
  END IF;

  IF creada.quantity <> 1 THEN
    RAISE EXCEPTION 'FAIL: un taller registrado via RPC no vale 1 unidad';
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000011',
      'Tarde Rpc',
      'tarde@test.com',
      now(),
      false,
      1
    );
    RAISE EXCEPTION 'FAIL: register_for_workshop ignoró el plazo cerrado';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'registration_closed' THEN
        RAISE EXCEPTION 'FAIL: error inesperado en la RPC fuera de plazo: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000003',
      'Obra Falsa',
      'obra@test.com',
      now(),
      false,
      1
    );
    RAISE EXCEPTION 'FAIL: register_for_workshop permitio inscribirse a una obra';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'not_a_workshop' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al inscribirse a una obra: %', SQLERRM;
      END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    PERFORM public.register_for_workshop(
      '00000000-0000-0000-0000-000000000001',
      'Pedro Lleno',
      'pedro@test.com',
      now(),
      false,
      1
    );
    RAISE EXCEPTION 'FAIL: register_for_workshop permitio superar el cupo';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
      IF SQLERRM <> 'workshop_full' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al superar el cupo via RPC: %', SQLERRM;
      END IF;
    WHEN others THEN
      IF SQLERRM <> 'workshop_full' THEN
        RAISE EXCEPTION 'FAIL: error inesperado al superar el cupo via RPC: %', SQLERRM;
      END IF;
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

  IF ocultos <> 0 THEN
    RAISE EXCEPTION 'FAIL: un usuario autenticado sin rol admin ve el producto oculto';
  END IF;

  UPDATE public.products
  SET "isVisible" = true
  WHERE id = '00000000-0000-0000-0000-000000000004';

  IF FOUND THEN
    RAISE EXCEPTION 'FAIL: un usuario autenticado sin rol admin puede editar productos';
  END IF;
END $$;

RESET ROLE;

SET request.jwt.claims = '{"role":"authenticated","app_metadata":{"role":"admin"}}';

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

  UPDATE public.products
  SET "isVisible" = false
  WHERE id = '00000000-0000-0000-0000-000000000004';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'FAIL: el admin autenticado no puede editar productos';
  END IF;
END $$;

DO $$
DECLARE
  ocultas BIGINT;
  canceladas BIGINT;
BEGIN
  SELECT taken INTO ocultas
  FROM public.workshop_spots()
  WHERE product_id = '00000000-0000-0000-0000-000000000013';

  SELECT taken INTO canceladas
  FROM public.workshop_spots()
  WHERE product_id = '00000000-0000-0000-0000-000000000014';

  IF ocultas IS DISTINCT FROM 1::BIGINT OR canceladas IS DISTINCT FROM 1::BIGINT THEN
    RAISE EXCEPTION 'FAIL: el admin no ve las plazas de los talleres ocultos o cancelados';
  END IF;
END $$;

RESET ROLE;

RESET request.jwt.claims;

-- Renombrado camisetas -> textiles con datos preventes (issue #80):
-- la fila semilla 'camisetas' debe haber sobrevivido la cadena de migraciones.
DO $$
DECLARE
  remaining INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_category_check'
  ) THEN
    RAISE EXCEPTION 'FAIL: constraint products_category_check ausente tras la 026';
  END IF;

  SELECT count(*) INTO remaining
  FROM public.products
  WHERE category = 'camisetas';

  IF remaining <> 0 THEN
    RAISE EXCEPTION 'FAIL: quedan % filas con la categoria antigua camisetas', remaining;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.products
    WHERE id = '00000000-0000-0000-0000-000000000099' AND category = 'textiles'
  ) THEN
    RAISE EXCEPTION 'FAIL: el producto camisetas previo a la 026 no quedo renombrado a textiles';
  END IF;

  BEGIN
    INSERT INTO public.products (id, title, description, image, category, status, featured)
    VALUES ('00000000-0000-0000-0000-000000000098', 'Reincidente', 'Descripcion', 'img.png', 'camisetas', 'disponible', false);
    RAISE EXCEPTION 'FAIL: el CHECK de categorias todavia admite camisetas';
  EXCEPTION
    WHEN check_violation THEN
      NULL;
    WHEN raise_exception THEN
      IF SQLERRM LIKE 'FAIL:%' THEN
        RAISE;
      END IF;
  END;
END $$;

UPDATE public.workshop_registrations SET marketing_consent = false WHERE marketing_consent;

DELETE FROM public.workshop_registrations WHERE email = 'ana@test.com';
DELETE FROM public.workshop_registrations WHERE email IN ('pilar@test.com', 'rosa@test.com');
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000002';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000003';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000004';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000011';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000012';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000013';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000014';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000015';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000016';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000017';
DELETE FROM public.products WHERE id = '00000000-0000-0000-0000-000000000099';

-- Endurecimiento (migracion 031): CHECK validados, sin CREATE de esquema,
-- sin privilegios heredados en tablas nuevas y sin EXECUTE de PUBLIC sobre
-- las funciones existentes.
DO $hardening$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE n.nspname = 'public'
      AND c.contype = 'c'
      AND NOT c.convalidated
  ) THEN
    RAISE EXCEPTION 'FAIL: quedan CHECK NOT VALID en el esquema public';
  END IF;

  -- La 031 retiro CREATE sobre el esquema a anon/authenticated.
  IF has_schema_privilege('anon', 'public', 'CREATE')
     OR has_schema_privilege('authenticated', 'public', 'CREATE') THEN
    RAISE EXCEPTION 'FAIL: anon o authenticated conservan CREATE en public';
  END IF;

  -- La 031 desmontó la cesión implícita de EXECUTE a PUBLIC sobre las
  -- funciones existentes; lo que cada rol necesitaba quedó re-concedido de
  -- forma explícita (assertions de anon sobre workshop_spots arriba).
  -- PUBLIC es un pseudo-rol: se comprueba el ACL crudo (grantee = 0), no
  -- has_function_privilege.
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    CROSS JOIN LATERAL aclexplode(p.proacl) AS a
    WHERE p.oid = 'public.workshop_spots()'::regprocedure
      AND a.privilege_type = 'EXECUTE'
      AND a.grantee = 0
  ) THEN
    RAISE EXCEPTION 'FAIL: PUBLIC conserva EXECUTE sobre workshop_spots tras la 031';
  END IF;

  -- Una tabla nueva no nace accesible para anon/authenticated.
  CREATE TABLE public.probe_default_privs_031 (id integer);
  IF has_table_privilege('anon', 'public.probe_default_privs_031', 'SELECT')
     OR has_table_privilege('authenticated', 'public.probe_default_privs_031', 'INSERT') THEN
    DROP TABLE public.probe_default_privs_031;
    RAISE EXCEPTION 'FAIL: una tabla nueva hereda privilegios para anon/authenticated';
  END IF;

  -- La 032 extiende el corte a los demas roles con CREATE sobre public:
  -- una tabla creada por otro dueno tampoco nace accesible.
  IF has_schema_privilege(current_role, 'public', 'CREATE') THEN
    EXECUTE format('GRANT CREATE ON SCHEMA public TO %I', current_role);
    EXECUTE format('SET ROLE %I', current_role);
    CREATE TABLE public.probe_default_privs_032 (id integer);
    IF has_table_privilege('anon', 'public.probe_default_privs_032', 'SELECT')
       OR has_table_privilege('authenticated', 'public.probe_default_privs_032', 'INSERT') THEN
      RESET ROLE;
      DROP TABLE public.probe_default_privs_032;
      RAISE EXCEPTION 'FAIL: una tabla creada por otro rol hereda privilegios para anon/authenticated';
    END IF;
    RESET ROLE;
    DROP TABLE public.probe_default_privs_032;
  END IF;

  -- PostgreSQL concede EXECUTE a PUBLIC por valor por defecto y no se puede
  -- suprimir con ALTER DEFAULT PRIVILEGES (comprobado sobre postgres:15). La
  -- sonda documenta el límite: las migraciones futuras deben revocar por
  -- funcion, como hacen 025 y 031, y no confiar en los privilegios por defecto.
  CREATE FUNCTION public.probe_fn_031() RETURNS integer
  LANGUAGE sql AS $fn$ SELECT 1; $fn$;
  IF NOT (
    (SELECT proacl FROM pg_proc WHERE oid = 'public.probe_fn_031()'::regprocedure) IS NULL
    OR EXISTS (
      SELECT 1 FROM pg_proc p
      CROSS JOIN LATERAL aclexplode(p.proacl) AS a
      WHERE p.oid = 'public.probe_fn_031()'::regprocedure
        AND a.privilege_type = 'EXECUTE'
        AND a.grantee = 0
    )
  ) THEN
    DROP TABLE public.probe_default_privs_031;
    DROP FUNCTION public.probe_fn_031();
    RAISE EXCEPTION 'FAIL: cambia el modelo de EXECUTE heredado; revisa el patron de revoco por funcion de 031';
  END IF;
  DROP FUNCTION public.probe_fn_031();
  DROP TABLE public.probe_default_privs_031;

  -- Solo los duenos de la base (roles con BYPASSRLS o superusuario) pueden
  -- saltarse RLS: las roles de la API no lo tienen.
  IF EXISTS (
    SELECT 1 FROM pg_roles
    WHERE rolname IN ('anon', 'authenticated') AND rolbypassrls
  ) THEN
    RAISE EXCEPTION 'FAIL: anon o authenticated tienen BYPASSRLS';
  END IF;
END $hardening$;
