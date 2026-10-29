# Laurel en Lienzo

Online portfolio, dynamic product catalog, and workshop registration platform for an independent illustrator and artisan brand.

[Live Demo](https://laurelenlienzo.vercel.app)

---

## Architecture & Features

- **Dynamic Catalog**: Public showcase with tag-based filtering, item details, and integrated external purchase references (Etsy, Vinted).
- **Workshop Management**: Real-time capacity validation, duplicate submission protection, and instant calendar export (`.ics`, Google Calendar).
- **Security & Data Integrity**:
  - PostgreSQL Row Level Security (RLS) policies isolating public read-only views from administrative operations.
  - Atomic database transactions enforcing workshop capacity constraints and concurrency safety.
  - Automated input sanitization and payload validation across all public forms.
- **Internationalization (i18n)**: Fully responsive UI localized in Spanish and English with SSR-friendly route redirection.
- **SEO & Web Standards**: Optimized Open Graph metadata, semantic JSON-LD structured data (`WebSite`, `Organization`), dynamic sitemap, and WCAG AA accessibility compliance.

---

## Tech Stack

- **Frontend**: [React 19](https://react.dev/), [React Router 7](https://reactrouter.com/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Build & Dev Tooling**: [Vite](https://vite.dev/), [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Serverless & Edge**: [Vercel Functions](https://vercel.com/) (Webhook receivers and background sync)

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or pnpm

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ana-Alonso/Catalogo-Web.git
   cd Catalogo-Web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.development
   ```
   Populate `.env.development` with your development credentials (production builds read `.env.production`). For local frontend testing without an active database, set `VITE_USE_MOCKS=true`.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## Environment Variables

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase public anon key |
| `VITE_USE_MOCKS` | Client | Set to `true` to use mock catalog data in dev |
| `VITE_SITE_URL` | Client | Canonical URL for SEO metadata generation |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (API) | Elevated key for secure serverless webhook endpoints |
| `ETSY_KEYSTRING` | Server (API) | Etsy Open API keystring |
| `ETSY_SHARED_SECRET` | Server (API) | Webhook payload signature verification secret |

> **Note**: Never expose server-side credentials (`SUPABASE_SERVICE_ROLE_KEY`, `ETSY_SHARED_SECRET`) to client-side bundles or public pull requests.

---

## Testing & Quality

Run the test suite and static analysis tools:

```bash
# Run unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Code linting
npm run lint

# TypeScript verification and production build
npm run build
```

---

## Database Migrations

Database definitions and RLS policies are version-controlled under `supabase/migrations/`. To apply them locally:

```bash
# Start local Supabase instance
npx supabase start

# Apply pending migrations
npx supabase db reset
```

---

## License

This project is licensed under the [MIT License](LICENSE).