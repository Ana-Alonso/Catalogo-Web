import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/languages';

export const LEGAL_DOCUMENT_KINDS = ['privacy', 'cookies', 'notice'] as const;

export type LegalDocumentKind = (typeof LEGAL_DOCUMENT_KINDS)[number];

const LEGAL_SLUGS: Record<SupportedLanguage, Record<LegalDocumentKind, string>> = {
  es: { privacy: 'privacidad', cookies: 'cookies', notice: 'aviso-legal' },
  en: { privacy: 'privacy', cookies: 'cookies', notice: 'legal-notice' },
};

export const getLegalSlug = (language: SupportedLanguage, kind: LegalDocumentKind): string =>
  LEGAL_SLUGS[language][kind];

export const buildLegalPath = (language: SupportedLanguage, kind: LegalDocumentKind): string =>
  `/${language}/${LEGAL_SLUGS[language][kind]}`;

export const getLegalAlternatePaths = (kind: LegalDocumentKind): string[] =>
  SUPPORTED_LANGUAGES.map((language) => buildLegalPath(language, kind));

export const findLegalKind = (
  language: SupportedLanguage,
  slug: string
): LegalDocumentKind | null =>
  LEGAL_DOCUMENT_KINDS.find((kind) => LEGAL_SLUGS[language][kind] === slug) ?? null;
