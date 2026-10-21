# Laurel en Lienzo

**English** · [Español](README.es.md)

An art catalog and workshop-booking website for an independent illustrator. Visitors browse original artwork, T-shirts and custom pieces, register for workshops with real capacity control, and add events to their calendar. The owner runs the whole catalog and registration flow from a protected admin panel.

[![CI](https://github.com/Ana-Alonso/Catalogo-Web/actions/workflows/ci.yml/badge.svg)](https://github.com/Ana-Alonso/Catalogo-Web/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres_%2B_Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

> **Live demo:** _coming soon_ (Vercel deployment).
> <!-- TODO: replace the block below with the production URL once deployed -->
> <!-- [your-project.vercel.app](https://your-project.vercel.app) -->

<!--
SCREENSHOTS
Add your own images under docs/screenshots/ and uncomment this block:

## Screenshots

| Home | Workshop signup | Admin panel |
| --- | --- | --- |
| ![Home](docs/screenshots/home.png) | ![Workshop signup](docs/screenshots/workshop.png) | ![Admin panel](docs/screenshots/admin.png) |
-->

## Overview

The site replaces a static portfolio with a small product: a public catalog backed by Supabase, and a workshop system with real capacity limits enforced in the database. Purchases are intentionally outsourced to Etsy and Vinted — the app focuses on showcasing the work and managing workshop signups.

## Features

### Public site

- **Dynamic catalog** served from Supabase (PostgreSQL + Storage): publishing a piece does not require a redeploy.
- **Percentage offers** per product with an "Ofertas" filter and discounted-price badges. Prices can also be set to "consultar" (no public price).
- **Category filters** and featured items pinned to the top.
- **Workshops with live capacity**: "N of M spots left" or "Full", computed from real registrations.
- **Signup form** with name and email, duplicate protection per workshop, and no overbooking even under concurrent requests.
- **Add to calendar** after signing up: Google Calendar, Outlook, or a downloadable `.ics` file for Apple Calendar and other apps.
- **Responsive and accessible**: keyboard navigation, semantic HTML, ARIA labels and visible focus states.
- **Purchase links** to Etsy / Vinted on non-workshop items — no payment data is handled by this app. Workshops never show external purchase links.

### Admin panel (`/admin`)

- **Email + password authentication** with Supabase Auth. Database policies restrict every write to authenticated users.
- **Product management**: create, edit and delete items, upload images to Supabase Storage (MIME type and 5 MB limit validated), set prices in euros, apply a percentage discount, mark items as featured and set availability.
- **Etsy sync**: products arrive from Etsy through webhooks or the "Sincronizar ahora" button. Synced fields are read-only; category and featured status remain editable locally.
- **Workshop capacity** configured per event (optional, unlimited if empty).
- **Registration management** grouped by workshop: confirm, cancel (frees the spot and the email) or delete.
- **Calendar shortcuts** for newly published workshops.

### Engineering

- Strict TypeScript with no `any`; UI, hooks, services and utilities kept separate.
- Versioned, idempotent SQL migrations for schema, policies and constraints.
- Row Level Security hardened for production (public reads, authenticated writes, guarded anonymous inserts).
- Automated tests and a real SQL assertion suite running on PostgreSQL 15.
- Serverless Etsy integration with OAuth 2.0 + PKCE, signed webhooks and a manual reconciliation endpoint.
- CI on every push and pull request; continuous deployment through Vercel.
- Server-side rendering with React Router 7 framework mode, localized metadata and a nonce-based Content Security Policy.
- Security headers in `vercel.json`; the SSR entry applies a per-request Content Security Policy with nonces.

## Engineering highlights

- **No overbooking, guaranteed by the database.** A `BEFORE INSERT/UPDATE` trigger locks the workshop row (`SELECT ... FOR UPDATE`) and rejects registrations once the capacity is reached. A partial unique index on `(product_id, lower(email))` blocks duplicate signups while still allowing a cancelled user to register again.
- **Anonymous users can only do one thing**: create a registration with `status = 'pendiente'`. Everything else (catalog and registration writes, Storage uploads) requires an authenticated session.
- **Idempotent migrations**: all SQL scripts can be re-run safely against an existing database.
- **Data integrity in the schema**: CHECK constraints for email format, name/title lengths, price/currency validity, discount bounds, Etsy listing uniqueness and valid status values.
- **146 automated tests** covering calendar/ICS generation, price, offer and purchase-link helpers, Etsy mapping and webhook signatures, the registration service (including Supabase error mapping), UI flows, localized SEO metadata and sitemap generation, plus a SQL suite that verifies policies, constraints, capacity and duplicate handling on a real PostgreSQL instance.
- **Webhook authenticity**: Etsy requests are verified with HMAC-SHA256 over the raw body, a 5-minute timestamp window and constant-time signature comparison.
- **Offline development mode**: the app runs with local mock data and `localStorage`, with no database credentials required.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19, React Router 7 |
| Language | TypeScript 6 (strict) |
| Styling | Tailwind CSS 4, Framer Motion 14, lucide-react |
| Backend | Supabase (PostgreSQL, Storage, Auth, RLS) |
| Build | Vite 8 |
| Testing | Vitest 5, Testing Library, jsdom |
| Quality | ESLint 10, GitHub Actions |
| Hosting | Vercel |

## Quick start

```bash
git clone https://github.com/Ana-Alonso/Catalogo-Web.git
cd Catalogo-Web
npm install
npm run dev
```

Open `http://localhost:5173`. Development mode uses local mock data (`VITE_USE_MOCKS=true`), so **no database or credentials are needed** to explore the UI. The admin panel is available at `/admin`.

<details>
<summary><strong>Connect a real Supabase project</strong></summary>

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run these scripts in order (all are idempotent):
   - `supabase-migration.sql` — tables, capacity trigger, base policies and the `products` storage bucket.
   - `supabase-hardening.sql` — hardened RLS policies and data validation constraints.
   - `supabase-offers-etsy.sql` — numeric prices, percentage offers, visibility flags, Etsy metadata and the `etsy_credentials` table.
   - `supabase-workshop-links.sql` — removes purchase links from workshops and blocks them at the database level.
3. Create the admin user in **Authentication → Users → Add user**. That account is the only one able to sign in at `/admin` and write to the catalog.
4. Copy the environment file and fill in your keys:

   ```bash
   cp .env.example .env
   ```

5. Run against Supabase (without editing any file):

   ```bash
   VITE_USE_MOCKS=false npm run dev
   ```

</details>

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase public (anon) key. |
| `VITE_USE_MOCKS` | `true` uses local mock data; `false` uses Supabase. |
| `VITE_ETSY_SHOP_URL` | Etsy shop URL shown in the footer. |
| `VITE_INSTAGRAM_URL` / `VITE_TIKTOK_URL` | Social media links. |
| `VITE_CONTACT_EMAIL` | Contact email shown in the footer. |
| `ETSY_KEYSTRING` / `ETSY_SHARED_SECRET` | Etsy app credentials (server only). |
| `ETSY_SHOP_ID` | Numeric Etsy shop ID to synchronise. |
| `ETSY_REFRESH_TOKEN` | Bootstrap refresh token, used only when `etsy_credentials` has no row. |
| `ETSY_WEBHOOK_SECRET` | Signing secret from the Etsy Webhook Portal (starts with `whsec_`). |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Supabase project URL and public key for server-side JWT verification. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used by the sync jobs (server only). |
| `CRON_SECRET` | Protects the daily reconciliation endpoint (`GET /api/etsy-sync`). |

Secrets are never committed: real keys live in `.env` (git-ignored) locally and in the Vercel dashboard in production. Only `VITE_*` variables are exposed to the browser.

## Etsy integration

1. Create a personal app in the [Etsy developer dashboard](https://www.etsy.com/developers/your-apps) and add `https://<your-domain>/etsy-callback.html` as an allowed redirect URI. Request the `listings_r` and `shops_r` scopes.
2. Generate the OAuth tokens locally:

   ```bash
   ETSY_KEYSTRING=... ETSY_SHARED_SECRET=... \
   ETSY_REDIRECT_URI=https://<your-domain>/etsy-callback.html \
   node scripts/etsy-oauth.mjs
   ```

   Open the printed URL, authorise the app, then copy the code shown on the callback page and exchange it:

   ```bash
   node scripts/etsy-oauth.mjs --exchange <code>
   ```

   The script prints the `ETSY_REFRESH_TOKEN` and an idempotent SQL statement for `etsy_credentials`. Refresh tokens rotate: the function stores the new one automatically.
3. Register the webhook in the Etsy Webhook Portal with URL `https://<your-domain>/api/etsy-webhook`, the `ETSY_WEBHOOK_SECRET` you chose and the events `listing.created`, `listing.updated`, `listing.deleted`, `inventory.updated` and `inventory.out_of_stock`.
4. Set the server variables listed above in Vercel. The optional daily reconciliation uses a Vercel Cron job:

   ```json
   { "crons": [{ "path": "/api/etsy-sync", "schedule": "0 4 * * *" }] }
   ```

   Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when the variable is defined.

Synced title, description, image, price and state come from Etsy. Category and featured status stay editable in this app, but Etsy listings cannot be classified as workshops. Deactivated or deleted listings are hidden instead of removed. Etsy shop-wide sales are not exposed by the API, so the synced price is the listing's base price; percentage offers are local-only.

## Development and production modes

| Context | File | `VITE_USE_MOCKS` | Data source |
| --- | --- | --- | --- |
| `npm run dev` | `.env.development` | `true` | Mocks + `localStorage` |
| `npm run build` / Vercel | `.env.production` | `false` | Supabase |

## Project structure

```text
src/
  components/
    ui/            # Design system primitives (Button, Input, PasswordInput, CalendarEventActions…)
    layout/        # Navbar and footer
    admin/         # Login, dashboard, product form/table, registration, Etsy and calendar panels
  hooks/           # useProducts, useRegistrations, useAdminAuth, useWorkshopSpots…
  services/        # Supabase data access (products, registrations) and Etsy sync client
  utils/           # ICS/calendar generation, price helpers, image validation, logger, Supabase client
  types/           # Domain models
  mocks/           # Local data for offline development
  pages/           # CatalogPage, AdminPage
api/               # Vercel functions: Etsy webhook, sync and shared server helpers
scripts/           # OAuth bootstrap and Docker-based SQL test suite
.github/workflows/ # CI pipeline
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload (mock data). |
| `npm run build` | Typecheck (`tsc -b`) and production build. |
| `npm run lint` | ESLint analysis. |
| `npm test` | Unit and component tests (Vitest + Testing Library). |
| `npm run test:watch` | Tests in watch mode. |
| `npm run test:db` | SQL assertion suite on PostgreSQL 15 via Docker. |
| `npm run preview` | Preview the production build locally. |
| `node scripts/etsy-oauth.mjs` | Generate Etsy OAuth tokens and the `etsy_credentials` SQL. |

## Testing and CI/CD

- **CI** (`.github/workflows/ci.yml`) runs on every push to `main` and every pull request: lint → tests → typecheck + build → SQL suite in a PostgreSQL 15 container. The pipeline needs no secrets.
- **CD** uses Vercel's Git integration: pushes to `main` deploy to production, and every pull request gets its own preview URL. `vercel.json` provides security headers; React Router handles SSR routing, redirects and 404 responses.
- In production, set the environment variables listed above in the Vercel dashboard (Production and Preview) and add the deployed domain as the **Site URL** in Supabase *Authentication → URL Configuration*.

## Roadmap

- CSV export of workshop registrations.
- Optional confirmation emails.
- Check-in view for workshop attendance.

## Author

**Ana Alonso** — Full-stack developer

## License

The source code may not be reused commercially without permission. All artwork, images and brand assets belong to Laurel en Lienzo and may not be reproduced. © 2026 Ana Alonso and Laurel en Lienzo.
