import { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY } from './constants';
import { normalizeLanguage, type SupportedLanguage } from './languages';

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

export default persistLanguage;
