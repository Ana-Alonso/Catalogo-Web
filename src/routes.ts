import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/language-redirect.ts', { id: 'routes/language-redirect' }),
  route('admin', 'routes/admin.tsx', { id: 'routes/admin' }),
  route('sitemap.xml', 'routes/sitemap.ts', { id: 'routes/sitemap' }),
  route('es', 'routes/language-layout.tsx', { id: 'routes/es' }, [
    index('routes/catalog.tsx', { id: 'routes/es/catalog' }),
    route('*', 'routes/not-found.tsx', { id: 'routes/es/not-found' }),
  ]),
  route('en', 'routes/language-layout.tsx', { id: 'routes/en' }, [
    index('routes/catalog.tsx', { id: 'routes/en/catalog' }),
    route('*', 'routes/not-found.tsx', { id: 'routes/en/not-found' }),
  ]),
  route('*', 'routes/not-found.tsx', { id: 'routes/not-found' }),
] satisfies RouteConfig;
