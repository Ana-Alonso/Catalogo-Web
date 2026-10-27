import type { SupportedLanguage } from '../../i18n/languages';
import type { LegalDocument } from './types';
import type { LegalDocumentKind } from './paths';
import { PRIVACY_DOCUMENT as PRIVACY_ES } from './es/privacy';
import { COOKIES_DOCUMENT as COOKIES_ES } from './es/cookies';
import { LEGAL_NOTICE_DOCUMENT as NOTICE_ES } from './es/legal-notice';
import { PRIVACY_DOCUMENT as PRIVACY_EN } from './en/privacy';
import { COOKIES_DOCUMENT as COOKIES_EN } from './en/cookies';
import { LEGAL_NOTICE_DOCUMENT as NOTICE_EN } from './en/legal-notice';

const LEGAL_DOCUMENTS: Record<SupportedLanguage, Record<LegalDocumentKind, LegalDocument>> = {
  es: { privacy: PRIVACY_ES, cookies: COOKIES_ES, notice: NOTICE_ES },
  en: { privacy: PRIVACY_EN, cookies: COOKIES_EN, notice: NOTICE_EN },
};

export const getLegalDocument = (
  language: SupportedLanguage,
  kind: LegalDocumentKind
): LegalDocument => LEGAL_DOCUMENTS[language][kind];
