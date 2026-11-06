import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/languages';

// Mismo slug en los dos idiomas: buildLocalizedPath conserva el segmento al cambiar
// de idioma, así que un slug propio por idioma (como el de las legales) daría 404.
export const FAQ_SLUG = 'faq';

export const buildFaqPath = (language: SupportedLanguage): string =>
  `/${language}/${FAQ_SLUG}`;

export const getFaqAlternatePaths = (): string[] =>
  SUPPORTED_LANGUAGES.map((language) => buildFaqPath(language));
