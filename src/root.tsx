import { useEffect, useMemo, type ReactNode } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
} from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';
import '@fontsource-variable/yanone-kaffeesatz';
import './index.css';
import { createI18nInstance } from './i18n/createI18nInstance';
import { normalizeLanguage } from './i18n/languages';
import { persistLanguage } from './i18n/persistLanguage';
import { getPathLanguage } from './i18n/paths';
import { resolvePreferredLanguage } from './i18n/server';
import { ErrorFallback } from './components/errors/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import { getDefaultMeta } from './seo/meta';

export function loader({ request }: LoaderFunctionArgs) {
  return {
    preferredLanguage: resolvePreferredLanguage(request),
  };
}

export function meta() {
  return getDefaultMeta();
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const pathLanguage = getPathLanguage(location.pathname);
  const preferredLanguage = data?.preferredLanguage ?? 'es';
  const language = pathLanguage ?? preferredLanguage;
  const i18n = useMemo(() => createI18nInstance(language), [language]);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage: string): void => {
      document.documentElement.lang = normalizeLanguage(nextLanguage);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (pathLanguage) {
      persistLanguage(pathLanguage);
    }
  }, [pathLanguage]);

  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return <ErrorFallback />;
}