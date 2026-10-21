import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';
import {
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './languages';

export const LANGUAGE_COOKIE = 'laurel_lang';
export const LANGUAGE_STORAGE_KEY = 'laurel_language';

export const persistLanguage = (language: string): SupportedLanguage => {
  const normalized = normalizeLanguage(language);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized;
    document.cookie = `${LANGUAGE_COOKIE}=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  }

  return normalized;
};

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
