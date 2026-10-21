import i18next from 'i18next';
import { resources } from './resources';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from './languages';

export type AppI18n = ReturnType<typeof i18next.createInstance>;

export const createI18nInstance = (language: SupportedLanguage): AppI18n => {
  const instance = i18next.createInstance();

  void instance.init({
    resources,
    lng: language,
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: 'languageOnly',
    initAsync: false,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return instance;
};

export default createI18nInstance;
