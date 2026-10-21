import es from './locales/es.json';
import en from './locales/en.json';

const enTyped: typeof es = en;

export const resources = {
  es: { translation: es },
  en: { translation: enTyped },
} as const;
