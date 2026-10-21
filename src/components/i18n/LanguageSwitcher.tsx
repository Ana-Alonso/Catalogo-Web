import React from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { persistLanguage } from '../../i18n/persistLanguage';
import { normalizeLanguage, type SupportedLanguage } from '../../i18n/languages';
import { buildLocalizedPath } from '../../i18n/paths';

interface LanguageSwitcherProps {
  className?: string;
  onSelect?: () => void;
}

const languages: Array<{ code: SupportedLanguage; label: string }> = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  onSelect,
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLanguage = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );
  const isAdminRoute =
    location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  return (
    <nav aria-label={t('language.label')} className={className}>
      <ul className="flex items-center gap-1">
        {languages.map((language) => {
          const isActive = currentLanguage === language.code;
          const ariaLabel =
            language.code === 'es'
              ? t('language.switchToSpanish')
              : t('language.switchToEnglish');

          return (
            <li key={language.code}>
              <Link
                to={buildLocalizedPath(
                  location.pathname,
                  location.search,
                  location.hash,
                  language.code
                )}
                hrefLang={language.code}
                lang={language.code}
                aria-label={ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  persistLanguage(language.code);
                  if (isAdminRoute) {
                    void i18n.changeLanguage(language.code);
                  }
                  onSelect?.();
                }}
                className={`inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default LanguageSwitcher;
