import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/language-redirect.ts', { id: 'routes/language-redirect' }),
  route('admin', 'routes/admin.tsx', { id: 'routes/admin' }),
  route('sitemap.xml', 'routes/sitemap.ts', { id: 'routes/sitemap' }),
  route('api/etsy-webhook', 'routes/api/etsy-webhook.ts', {
    id: 'routes/api/etsy-webhook',
  }),
  route('api/etsy-sync', 'routes/api/etsy-sync.ts', {
    id: 'routes/api/etsy-sync',
  }),
  route('api/registrations', 'routes/api/registrations.ts', {
    id: 'routes/api/registrations',
  }),
  route('es', 'routes/language-layout.tsx', { id: 'routes/es' }, [
    index('routes/catalog.tsx', { id: 'routes/es/catalog' }),
    route('privacidad', 'routes/legal/privacy.tsx', { id: 'routes/es/privacy' }),
    route('cookies', 'routes/legal/cookies.tsx', { id: 'routes/es/cookies' }),
    route('aviso-legal', 'routes/legal/legal-notice.tsx', { id: 'routes/es/notice' }),
    route('*', 'routes/not-found.tsx', { id: 'routes/es/not-found' }),
  ]),
  route('en', 'routes/language-layout.tsx', { id: 'routes/en' }, [
    index('routes/catalog.tsx', { id: 'routes/en/catalog' }),
    route('privacy', 'routes/legal/privacy.tsx', { id: 'routes/en/privacy' }),
    route('cookies', 'routes/legal/cookies.tsx', { id: 'routes/en/cookies' }),
    route('legal-notice', 'routes/legal/legal-notice.tsx', { id: 'routes/en/notice' }),
    route('*', 'routes/not-found.tsx', { id: 'routes/en/not-found' }),
  ]),
  route('*', 'routes/not-found.tsx', { id: 'routes/not-found' }),
] satisfies RouteConfig;
