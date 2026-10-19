# Laurel en Lienzo - Catálogo Visual

Catálogo visual frontend moderno, minimalista y accesible para mostrar obras de arte, ilustraciones, camisetas personalizadas y talleres. La aplicación funciona como un portafolio interactivo con panel de administración: el catálogo se gestiona desde Supabase y el proceso de compra se redirige a plataformas externas como [Etsy](https://www.etsy.com/es/shop/Laurelenlienzo) o Vinted.

## 🚀 Características Principales

*   **Catálogo dinámico:** Obras y talleres se cargan desde Supabase (PostgreSQL + Storage), no del código.
*   **Talleres con inscripciones:** Cupo opcional por taller, contador público de plazas («Quedan N de M» / «Completo»), formulario de inscripción con nombre y email, control de duplicados y bloqueo de sobreventa en la base de datos.
*   **Añadir al calendario:** Tras inscribirse (y al publicar un taller en el panel) se puede añadir el evento a Google Calendar u Outlook, o descargar un archivo `.ics` compatible con Apple Calendar y otras apps.
*   **Panel de administración:** Acceso con email y contraseña (Supabase Auth) en `/admin`. Permite crear, editar y eliminar productos (con subida de imágenes a Supabase Storage), destacar piezas y gestionar las inscripciones a talleres (confirmar, cancelar —libera plaza— o borrar). Las políticas RLS restringen la escritura a usuarios autenticados.
*   **Diseño Minimalista y Moderno:** Interfaz limpia con paleta de negro, blancos, grises y acentos naranja.
*   **Animaciones Dinámicas:** Transiciones fluidas y efectos hover con Framer Motion.
*   **Totalmente Responsivo:** Cuadrícula y navegación adaptadas a móvil, tablet y escritorio.
*   **Accesibilidad (WCAG):** Navegación por teclado, semántica HTML5 y atributos ARIA.

## 🛠️ Tecnologías Utilizadas

*   **[React](https://reactjs.org/)** (v19) + **[React Router](https://reactrouter.com/)** - UI y enrutado (`/` catálogo, `/admin` panel).
*   **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático estricto.
*   **[Tailwind CSS](https://tailwindcss.com/)** (v4) - Estilos utilitarios.
*   **[Framer Motion](https://www.framer.com/motion/)** - Animaciones.
*   **[Lucide React](https://lucide.dev/)** - Iconos.
*   **[Supabase](https://supabase.com/)** (`@supabase/supabase-js`) - Base de datos, Storage de imágenes y políticas RLS.
*   **[Vite](https://vitejs.dev/)** - Desarrollo y empaquetado.

## 📦 Instalación y Configuración Local

1.  **Clonar e instalar dependencias:**
    ```bash
    git clone [url-del-repositorio] laura-web
    cd laura-web
    npm install
    ```

2.  **Configurar variables de entorno:**
    ```bash
    cp .env.example .env
    ```
    Rellena el `.env` (ver tabla siguiente).

3.  **Preparar la base de datos (Supabase):**
    En el proyecto de [Supabase](https://supabase.com), abre el **SQL Editor** y ejecuta, en este orden:
    1.  `supabase-migration.sql` — estructura de tablas, disparador de cupo e inscripciones, políticas base y bucket `products`. Es **idempotente**: puede re-ejecutarse sin errores.
    2.  `supabase-hardening.sql` — endurece las políticas RLS (escritura solo para usuarios autenticados; el INSERT público de inscripciones valida que el status sea `pendiente`) y añade CHECKs de formato de email y longitudes. También es idempotente.
    3.  Crea el usuario administrador en **Authentication → Users → Add user** (email y contraseña). Ese usuario será el único que pueda entrar en `/admin` y escribir en el catálogo.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Visita `http://localhost:5173`. El panel de administración está en `http://localhost:5173/admin`.

## 🔐 Variables de Entorno

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase. |
| `VITE_USE_MOCKS` | `true` usa datos mock y almacenamiento local; `false` usa Supabase. |
| `VITE_ETSY_SHOP_URL` | URL de la tienda Etsy (pie de página). |
| `VITE_INSTAGRAM_URL` / `VITE_TIKTOK_URL` | Enlaces de redes sociales. |
| `VITE_CONTACT_EMAIL` | Email de contacto mostrado en el pie. |

## 🎓 Talleres e Inscripciones

*   **Público:** Los talleres muestran fecha, lugar y plazas restantes. «Apuntarse al taller» abre un modal con nombre y email; la base de datos impide duplicados (mismo email y taller) y que se superen las plazas del cupo (un disparador serializa las inscripciones). Si no se define cupo, la inscripción es libre.
*   **Panel admin:** En «Inscripciones a Talleres» se ven las inscripciones agrupadas por taller con su estado (`pendiente`, `confirmado`, `cancelado`). Cancelar libera la plaza y el email para una futura inscripción.
*   **Calendario:** Tras inscribirse, o al publicar un taller con fecha desde el panel, aparecen botones para añadir el evento a Google Calendar / Outlook o descargarlo en formato `.ics`.

## 📄 Scripts Disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con hot reload. |
| `npm run build` | Typecheck (`tsc -b`) y build de producción. |
| `npm run lint` | Análisis con ESLint. |
| `npm test` | Tests unitarios y de componentes (Vitest + Testing Library). |
| `npm run test:watch` | Tests en modo watch. |
| `npm run test:db` | Suite de aserciones SQL contra PostgreSQL 15 en Docker (requiere Docker). |
| `npm run preview` | Vista previa del build de producción. |

## 📄 Licencia

Este proyecto es de uso exclusivo para **Laurel en Lienzo**. Todos los derechos de las imágenes e ilustraciones pertenecen a su respectivo autor.
