import type { SupportedLanguage } from '../../i18n/languages';
import type { FaqDocument } from './types';
import { FAQ_DOCUMENT_ES } from './es/faq';
import { FAQ_DOCUMENT_EN } from './en/faq';

const FAQ_DOCUMENTS: Record<SupportedLanguage, FaqDocument> = {
  es: FAQ_DOCUMENT_ES,
  en: FAQ_DOCUMENT_EN,
};

export const getFaqDocument = (language: SupportedLanguage): FaqDocument =>
  FAQ_DOCUMENTS[language];
