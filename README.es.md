# Laurel en Lienzo

Plataforma web de catálogo digital, portfolio y reserva de plazas en talleres para una ilustradora y creadora artística independiente.

[Ver Demo en Vivo](https://laurelenlienzo.vercel.app)

---

## Características Principales

- **Catálogo Dinámico**: Muestra de obras con filtrado por categorías, fichas descriptivas y enlaces de compra a plataformas externas (Etsy, Vinted).
- **Gestión de Talleres**: Validación de plazas en tiempo real, prevención de registros duplicados y exportación a calendarios (`.ics`, Google Calendar).
- **Seguridad y Consistencia**:
  - Políticas de seguridad a nivel de fila (Row Level Security - RLS) en PostgreSQL que aíslan la lectura pública de las operaciones administrativas.
  - Transacciones atómicas para prevenir el sobrecupo (*overbooking*) ante peticiones concurrentes.
  - Validación y desinfección estricta de formularios tanto en cliente como en base de datos.
- **Internacionalización**: Interfaz adaptativa disponible en español e inglés con redirección limpia según el navegador.
- **Optimización SEO y Accesibilidad**: Estructura semántica JSON-LD (`WebSite`, `Organization`), etiquetas Open Graph, sitemap dinámico y cumplimiento de estándares WCAG AA.

---

## Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/), [React Router 7](https://reactrouter.com/), [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Herramientas de Build y Test**: [Vite](https://vite.dev/), [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)
- **Backend y Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Endpoints Serverless**: [Vercel Functions](https://vercel.com/) (Sincronización y webhooks)

---

## Instalación y Desarrollo Local

### Requisitos previos

- Node.js >= 20.0.0
- npm o gestor equivalente

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Ana-Alonso/Catalogo-Web.git
   cd Catalogo-Web
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de entorno**:
   Copia la plantilla base:
   ```bash
   cp .env.example .env.local
   ```
   Rellena `.env.local` con tus credenciales de desarrollo. Puedes activar `VITE_USE_MOCKS=true` para trabajar en frontend sin conectar una base de datos real.

4. **Iniciar el servidor local**:
   ```bash
   npm run dev
   ```

---

## Variables de Entorno

| Variable | Ámbito | Descripción |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Cliente | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Cliente | Clave anónima pública de Supabase |
| `VITE_USE_MOCKS` | Cliente | `true` para usar datos simulados en desarrollo |
| `VITE_SITE_URL` | Cliente | URL canónica para metadatos SEO |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor (API) | Clave con permisos elevados para webhooks seguros |
| `ETSY_API_KEY` | Servidor (API) | API key de la aplicación en Etsy Open API |
| `ETSY_SHARED_SECRET` | Servidor (API) | Secreto de validación de firma para webhooks |

> **Importante**: Las claves con privilegios de administración o secretos de servidor nunca deben incluirse en bundles de cliente ni comitearse al repositorio.

---

## Pruebas y Calidad de Código

```bash
# Ejecutar suite de tests
npm run test

# Modo observador (watch)
npm run test:watch

# Verificación de tipos TypeScript
npm run typecheck

# Linter
npm run lint
```

---

## Migraciones de Base de Datos

Las definiciones de tablas y políticas RLS están bajo control de versiones en `supabase/migrations/`. Para ejecutarlas localmente:

```bash
# Iniciar instancia local de Supabase
npx supabase start

# Aplicar migraciones
npx supabase db reset
```

---

## Licencia

Distribuido bajo la licencia [MIT](LICENSE).