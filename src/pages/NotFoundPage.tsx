import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNoindex } from '../hooks/useNoindex';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { normalizeLanguage } from '../i18n/languages';
import { SITE_NAME } from '../seo/site';
import { theme } from '../theme';

export const NotFoundPage: React.FC = () => {
  useNoindex();
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useDocumentTitle(`${t('errors.notFound.title')} | ${SITE_NAME}`);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className={`${theme.colors.primaryText} text-6xl font-bold`}>404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-wide uppercase">
          {t('errors.notFound.title')}
        </h1>
        <p className={`${theme.colors.textMuted} mt-4 text-base`}>
          {t('errors.notFound.description')}
        </p>
        <Link
          to={`/${language}`}
          className={`inline-flex mt-8 items-center justify-center rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest ${theme.colors.primary} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
        >
          {t('errors.notFound.backHome')}
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
