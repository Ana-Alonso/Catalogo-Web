import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';
import { normalizeLanguage, SUPPORTED_LANGUAGES } from './languages';
import { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY } from './constants';
import { persistLanguage } from './persistLanguage';

export { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, persistLanguage };

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: 'languageOnly',
    initAsync: false,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      lookupCookie: LANGUAGE_COOKIE,
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['cookie', 'localStorage'],
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
      },
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (language) => {
  persistLanguage(language);
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = normalizeLanguage(i18n.language);
}

export default i18n;
