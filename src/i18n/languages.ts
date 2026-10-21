export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const isSupportedLanguage = (
  language: string | undefined
): language is SupportedLanguage =>
  language === 'es' || language === 'en';

export const normalizeLanguage = (language?: string): SupportedLanguage =>
  language?.toLowerCase().startsWith('en') ? 'en' : 'es';

export const getIntlLocale = (language?: string): string =>
  normalizeLanguage(language) === 'en' ? 'en-GB' : 'es-ES';
