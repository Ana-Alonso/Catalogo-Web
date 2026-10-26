import React from 'react';
import { useLocation } from 'react-router';
import { NavLink, Option, OptionList } from '../ui';
import { useTranslation } from 'react-i18next';
import { persistLanguage } from '../../i18n/persistLanguage';
import { normalizeLanguage, type SupportedLanguage } from '../../i18n/languages';
import { buildLocalizedPath } from '../../i18n/paths';

interface LanguageSwitcherProps {
  onSelect?: () => void;
}

const languages: Array<{ code: SupportedLanguage; label: string }> = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
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
    <OptionList label={t('language.label')}>
        {languages.map((language) => {
          const isActive = currentLanguage === language.code;
          const ariaLabel =
            language.code === 'es'
              ? t('language.switchToSpanish')
              : t('language.switchToEnglish');

          return (
            <Option key={language.code}>
              <NavLink
                variant="pill"
                active={isActive}
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
              >
                {language.label}
              </NavLink>
            </Option>
          );
        })}
    </OptionList>
  );
};

export default LanguageSwitcher;
