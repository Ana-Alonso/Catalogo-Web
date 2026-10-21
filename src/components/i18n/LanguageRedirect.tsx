import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../../i18n/languages';

export const LanguageRedirect: React.FC = () => {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  return <Navigate to={`/${language}`} replace />;
};

export default LanguageRedirect;
