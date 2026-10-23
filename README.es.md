# Laurel en Lienzo

[English](README.md) · **Español**

Catálogo de arte y reserva de talleres para una ilustradora independiente. Los visitantes exploran obras originales, camisetas y piezas personalizadas, se inscriben a talleres con control real de plazas y añaden los eventos a su calendario. La propietaria gestiona todo el catálogo y las inscripciones desde un panel de administración protegido.

[![CI](https://github.com/Ana-Alonso/Catalogo-Web/actions/workflows/ci.yml/badge.svg)](https://github.com/Ana-Alonso/Catalogo-Web/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres_%2B_Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

> **Demo en vivo:** _próximamente_ (despliegue en Vercel).
> <!-- TODO: sustituye el bloque inferior por la URL de producción cuando esté desplegada -->
> <!-- [tu-proyecto.vercel.app](https://tu-proyecto.vercel.app) -->

<!--
CAPTURAS
Añade tus imágenes en docs/screenshots/ y descomenta este bloque:

## Capturas

| Inicio | Inscripción a taller | Panel de administración |
| --- | --- | --- |
| ![Inicio](docs/screenshots/home.png) | ![Inscripción](docs/screenshots/workshop.png) | ![Admin](docs/screenshots/admin.png) |
-->

## Descripción

El proyecto sustituye un portafolio estático por un pequeño producto: un catálogo público respaldado por Supabase y un sistema de talleres con límite de plazas aplicado en la propia base de datos. La compra se deriva intencionadamente a Etsy y Vinted: la aplicación se centra en mostrar el trabajo y gestionar las inscripciones.

## Funcionalidades

### Sitio público

- **Catálogo dinámico** desde Supabase (PostgreSQL + Storage): publicar una pieza no requiere volver a desplegar.
- **Ofertas en porcentaje** por producto con filtro «Ofertas» y precio tachado. El precio también puede quedar «a consultar».
- **Filtros por categoría** y piezas destacadas fijadas arriba.
- **Talleres con plazas en vivo**: «Quedan N de M plazas» o «Completo», calculado con las inscripciones reales.
- **Formulario de inscripción** con nombre y email, control de duplicados por taller y sin sobreventa incluso con peticiones concurrentes.
- **Añadir al calendario** tras inscribirse: Google Calendar, Outlook o descarga de un archivo `.ics` compatible con Apple Calendar y otras apps.
- **Responsive y accesible**: navegación por teclado, HTML semántico, etiquetas ARIA y foco visible.
- **Enlaces de compra** a Etsy / Vinted en productos que no son talleres — la app no maneja datos de pago. Los talleres nunca muestran enlaces externos de compra.

### Panel de administración (`/admin`)

- **Autenticación email + contraseña** con Supabase Auth. Las políticas de base de datos restringen toda escritura a usuarios autenticados.
- **Gestión de productos**: crear, editar y eliminar, subir imágenes a Supabase Storage (tipo MIME y límite de 5 MB validados), fijar precios en euros, aplicar descuentos en porcentaje, destacar piezas y cambiar disponibilidad.
- **Sincronización con Etsy**: los productos llegan por webhooks o con el botón «Sincronizar ahora». Los campos sincronizados son de solo lectura; la categoría y el destacado se editan en local.
- **Cupo por taller** configurable por evento (opcional; sin límite si se deja vacío).
- **Gestión de inscripciones** agrupadas por taller: confirmar, cancelar (libera plaza y email) o borrar.
- **Accesos rápidos al calendario** al publicar un taller nuevo.

### Ingeniería

- TypeScript estricto sin `any`; UI, hooks, servicios y utilidades separados.
- Migraciones SQL versionadas e idempotentes para esquema, políticas y restricciones.
- Row Level Security endurecido para producción (lectura pública, escritura autenticada, inserción anónima acotada).
- Tests automatizados y suite de aserciones SQL real sobre PostgreSQL 15.
- Integración serverless con Etsy: OAuth 2.0 + PKCE, webhooks firmados y endpoint de reconciliación manual.
- CI en cada push y pull request; despliegue continuo mediante Vercel.
- Cabeceras de seguridad y Content Security Policy definidas en `vercel.json`.

## Aspectos técnicos destacados

- **Sobreventa imposible, garantizada por la base de datos.** Un disparador `BEFORE INSERT/UPDATE` bloquea la fila del taller (`SELECT ... FOR UPDATE`) y rechaza inscripciones al alcanzar el cupo. Un índice único parcial sobre `(product_id, lower(email))` impide duplicados, a la vez que permite volver a inscribirse tras una cancelación.
- **Los usuarios anónimos solo pueden hacer una cosa**: crear una inscripción con `status = 'pendiente'`. Todo lo demás (escritura del catálogo e inscripciones, subidas a Storage) requiere sesión autenticada.
- **Migraciones idempotentes**: todos los scripts SQL pueden re-ejecutarse sin errores sobre una base existente.
- **Integridad en el esquema**: CHECKs de formato de email, longitudes de nombre/título, validez de precio/moneda, límites del descuento, unicidad del listing de Etsy y valores válidos de estado.
- **74 tests automatizados** que cubren generación de calendario/ICS, utilidades de precio, ofertas y enlaces de compra, mapeo de Etsy y firmas de webhook, el servicio de inscripciones (incluido el mapeo de errores de Supabase) y flujos de UI, más una suite SQL que verifica políticas, restricciones, cupo y duplicados sobre un PostgreSQL real.
- **Autenticidad de los webhooks**: las peticiones de Etsy se verifican con HMAC-SHA256 sobre el cuerpo original, ventana de 5 minutos y comparación en tiempo constante.
- **Modo desarrollo offline**: la app funciona con datos mock y `localStorage`, sin credenciales de base de datos.

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19, React Router 7 |
| Lenguaje | TypeScript 6 (estricto) |
| Estilos | Tailwind CSS 4, Framer Motion 14, lucide-react |
| Backend | Supabase (PostgreSQL, Storage, Auth, RLS) |
| Build | Vite 8 |
| Testing | Vitest 5, Testing Library, jsdom |
| Calidad | ESLint 10, GitHub Actions |
| Hosting | Vercel |

## Inicio rápido

```bash
git clone https://github.com/Ana-Alonso/Catalogo-Web.git
cd Catalogo-Web
npm install
npm run dev
```

Abre `http://localhost:5173`. El modo desarrollo usa datos mock (`VITE_USE_MOCKS=true`), así que **no necesitas base de datos ni credenciales** para explorar la interfaz. El panel está en `/admin`.

<details>
<summary><strong>Conectar un proyecto real de Supabase</strong></summary>

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecuta estos scripts en orden (todos son idempotentes):
   - `supabase/migrations/legacy/000_upgrade_existing.sql` — tablas, disparador de cupo, políticas base y bucket `products`.
   - `supabase/migrations/002_hardening.sql` — políticas RLS endurecidas y restricciones de validación.
   - `supabase/migrations/003_offers_etsy.sql` — precios numéricos, ofertas en porcentaje, visibilidad, metadatos de Etsy y tabla `etsy_credentials`.
   - `supabase/migrations/004_workshop_links.sql` — elimina los enlaces de compra de los talleres y los bloquea a nivel de base de datos.
3. Crea el usuario administrador en **Authentication → Users → Add user**. Esa cuenta será la única que pueda entrar en `/admin` y escribir en el catálogo.
4. Copia el archivo de entorno y rellena tus claves:

   ```bash
   cp .env.example .env
   ```

5. Ejecuta contra Supabase (sin editar ningún archivo):

   ```bash
   VITE_USE_MOCKS=false npm run dev
   ```

</details>

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase. |
| `VITE_USE_MOCKS` | `true` usa datos mock locales; `false` usa Supabase. |
| `VITE_ETSY_SHOP_URL` | URL de la tienda Etsy en el pie de página. |
| `VITE_GA_MEASUREMENT_ID` | ID de medición de Google Analytics 4 (ej. `G-XXXXXXXXXX`). |
| `VITE_INSTAGRAM_URL` / `VITE_TIKTOK_URL` | Enlaces a redes sociales. |
| `VITE_CONTACT_EMAIL` | Email de contacto mostrado en el pie. |
| `ETSY_KEYSTRING` / `ETSY_SHARED_SECRET` | Credenciales de la app de Etsy (solo servidor). |
| `ETSY_SHOP_ID` | ID numérico de la tienda de Etsy a sincronizar. |
| `ETSY_REFRESH_TOKEN` | Refresh token inicial, solo se usa si `etsy_credentials` está vacía. |
| `ETSY_WEBHOOK_SECRET` | Secreto de firma del Webhook Portal de Etsy (empieza por `whsec_`). |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | URL y clave pública de Supabase para verificar el JWT en el servidor. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio usada por los procesos de sincronización (solo servidor). |
| `CRON_SECRET` | Protege el endpoint de reconciliación diaria (`GET /api/etsy-sync`). |

Las claves reales nunca se versionan: viven en `.env` (ignorado por git) en local y en el dashboard de Vercel en producción. Solo las variables `VITE_*` llegan al navegador.

## Integración con Etsy

1. Crea una app personal en el [panel de desarrollador de Etsy](https://www.etsy.com/developers/your-apps) y añade `https://<tu-dominio>/etsy-callback.html` como URI de redirección permitida. Solicita los scopes `listings_r` y `shops_r`.
2. Genera los tokens OAuth en local:

   ```bash
   ETSY_KEYSTRING=... ETSY_SHARED_SECRET=... \
   ETSY_REDIRECT_URI=https://<tu-dominio>/etsy-callback.html \
   node scripts/etsy-oauth.mjs
   ```

   Abre la URL que imprime, autoriza la app, copia el código que muestra la página de callback y canjéalo:

   ```bash
   node scripts/etsy-oauth.mjs --exchange <code>
   ```

   El script imprime `ETSY_REFRESH_TOKEN` y una sentencia SQL idempotente para `etsy_credentials`. Los refresh tokens rotan: la función guarda el nuevo automáticamente.
3. Registra el webhook en el Webhook Portal de Etsy con URL `https://<tu-dominio>/api/etsy-webhook`, el `ETSY_WEBHOOK_SECRET` que elijas y los eventos `listing.created`, `listing.updated`, `listing.deleted`, `inventory.updated` e `inventory.out_of_stock`.
4. Define las variables de servidor anteriores en Vercel. La reconciliación diaria opcional usa un Cron de Vercel:

   ```json
   { "crons": [{ "path": "/api/etsy-sync", "schedule": "0 4 * * *" }] }
   ```

   Vercel envía `Authorization: Bearer $CRON_SECRET` automáticamente si la variable existe.

El título, la descripción, la imagen, el precio y el estado sincronizados vienen de Etsy. La categoría y el destacado se editan en esta app, pero los listings de Etsy no pueden clasificarse como talleres. Los listings desactivados o borrados se ocultan en lugar de eliminarse. La API de Etsy no expone las rebajas de tienda, así que el precio sincronizado es el precio base del listing; las ofertas porcentuales son locales.

## Modos de desarrollo y producción

| Contexto | Archivo | `VITE_USE_MOCKS` | Origen de datos |
| --- | --- | --- | --- |
| `npm run dev` | `.env.development` | `true` | Mocks + `localStorage` |
| `npm run build` / Vercel | `.env.production` | `false` | Supabase |

## Estructura del proyecto

```text
src/
  components/
    ui/            # Primitivas del sistema de diseño (Button, Input, PasswordInput, CalendarEventActions…)
    layout/        # Navbar y pie de página
    admin/         # Login, dashboard, formulario/tabla de productos, paneles de inscripciones, Etsy y calendario
  hooks/           # useProducts, useRegistrations, useAdminAuth, useWorkshopSpots…
  services/        # Acceso a datos de Supabase (productos, inscripciones) y cliente de sync de Etsy
  utils/           # Generación de ICS/calendario, utilidades de precio, validación de imágenes, logger, cliente Supabase
  types/           # Modelos de dominio
  mocks/           # Datos locales para desarrollo offline
  pages/           # CatalogPage, AdminPage
api/               # Funciones de Vercel: webhook de Etsy, sync y helpers de servidor
scripts/           # Bootstrap de OAuth y suite SQL de tests con Docker
.github/workflows/ # Pipeline de CI
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con hot reload (datos mock). |
| `npm run build` | Typecheck (`tsc -b`) y build de producción. |
| `npm run lint` | Análisis con ESLint. |
| `npm test` | Tests unitarios y de componentes (Vitest + Testing Library). |
| `npm run test:watch` | Tests en modo watch. |
| `npm run test:db` | Suite de aserciones SQL sobre PostgreSQL 15 con Docker. |
| `npm run preview` | Vista previa del build de producción. |
| `node scripts/etsy-oauth.mjs` | Genera los tokens OAuth de Etsy y el SQL de `etsy_credentials`. |

## Testing y CI/CD

- **CI** (`.github/workflows/ci.yml`) se ejecuta en cada push a `main` y en cada pull request: lint → tests → typecheck + build → suite SQL en un contenedor PostgreSQL 15. El pipeline no necesita secrets.
- **CD** usa la integración Git de Vercel: los push a `main` despliegan a producción y cada pull request obtiene su propia URL de vista previa. `vercel.json` aporta el rewrite SPA y las cabeceras de seguridad.
- En producción, define las variables de entorno anteriores en el dashboard de Vercel (*Production* y *Preview*) y añade el dominio desplegado como **Site URL** en Supabase *Authentication → URL Configuration*.

## Roadmap

- Exportación CSV de inscripciones a talleres.
- Emails de confirmación opcionales.
- Vista de control de asistencia a talleres.

## Autora

**Ana Alonso** — Desarrolladora full-stack



## Licencia

El código no puede reutilizarse comercialmente sin permiso. Todas las obras, imágenes y activos de marca pertenecen a Laurel en Lienzo y no pueden reproducirse. © 2026 Ana Alonso y Laurel en Lienzo.
