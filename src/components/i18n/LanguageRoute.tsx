import React, { useEffect, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { persistLanguage } from '../../i18n';
import { isSupportedLanguage, normalizeLanguage } from '../../i18n/languages';
import { LanguageRedirect } from './LanguageRedirect';

interface LanguageRouteProps {
  children: ReactNode;
}

export const LanguageRoute: React.FC<LanguageRouteProps> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const currentLanguage = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useEffect(() => {
    if (!isSupportedLanguage(lang)) {
      return;
    }

    persistLanguage(lang);

    if (currentLanguage !== lang) {
      void i18n.changeLanguage(lang);
    }
  }, [currentLanguage, i18n, lang]);

  if (!isSupportedLanguage(lang)) {
    return <LanguageRedirect />;
  }

  return <>{children}</>;
};

export default LanguageRoute;
