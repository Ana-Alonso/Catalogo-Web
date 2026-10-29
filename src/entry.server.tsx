import { handleRequest } from '@vercel/react-router/entry.server';
import type { AppLoadContext, EntryContext } from 'react-router';

export { streamTimeout } from '@vercel/react-router/entry.server';

interface RuntimeProcess {
  env?: Record<string, string | undefined>;
}

const getRuntimeEnv = (): Record<string, string | undefined> => {
  const runtime = globalThis as { process?: RuntimeProcess };
  return runtime.process?.env ?? {};
};

export const buildContentSecurityPolicy = (nonce: string): string =>
  [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.etsystatic.com https://*.google-analytics.com https://*.googletagmanager.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "form-action 'self'",
  ].join('; ');

export default async function handleDocumentRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
): Promise<Response> {
  const nonce = crypto.randomUUID();
  const env = getRuntimeEnv();
  const pathname = new URL(request.url).pathname;
  const routeErrors = routerContext.staticHandlerContext.errors;
  const hasRouteErrors = routeErrors
    ? Object.keys(routeErrors).length > 0
    : false;
  const shouldNoindex =
    env.VERCEL_ENV === 'preview' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    hasRouteErrors ||
    responseStatusCode >= 400;

  if (shouldNoindex) {
    responseHeaders.set('X-Robots-Tag', 'noindex, nofollow');
  }

  if (env.VERCEL_ENV === 'production' || env.VERCEL_ENV === 'preview') {
    responseHeaders.set(
      'Content-Security-Policy',
      buildContentSecurityPolicy(nonce)
    );
  }

  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    routerContext,
    loadContext,
    { nonce }
  );
}
