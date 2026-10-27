import type { MetaArgs, MetaDescriptor } from 'react-router';
import { type SupportedLanguage } from '../i18n/languages';
import { getPathLanguage } from '../i18n/paths';
import {
  buildLegalPath,
  getLegalAlternatePaths,
  type LegalDocumentKind,
} from '../data/legal/paths';
import { getLegalDocument } from '../data/legal/documents';
import { getRootLanguage } from './meta';
import { DEFAULT_OG_IMAGE_PATH, getSiteUrl, SITE_NAME } from './site';

const OG_LOCALES: Record<SupportedLanguage, string> = {
  es: 'es_ES',
  en: 'en_GB',
};

export const getLegalRouteLanguage = ({
  location,
  matches,
}: MetaArgs): SupportedLanguage => getPathLanguage(location.pathname) ?? getRootLanguage(matches);

export const getLegalMeta = (
  kind: LegalDocumentKind,
  language: SupportedLanguage,
  siteUrl: string = getSiteUrl()
): MetaDescriptor[] => {
  const document = getLegalDocument(language, kind);
  const canonicalUrl = `${siteUrl}${buildLegalPath(language, kind)}`;
  const imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
  const alternateLanguage = language === 'es' ? 'en' : 'es';

  return [
    { title: `${document.title} | ${SITE_NAME}` },
    { name: 'description', content: document.description },
    { name: 'robots', content: 'index, follow' },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    ...getLegalAlternatePaths(kind).map((path) => ({
      tagName: 'link' as const,
      rel: 'alternate',
      hrefLang: path.split('/')[1],
      href: `${siteUrl}${path}`,
    })),
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${siteUrl}${buildLegalPath('es', kind)}`,
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: document.title },
    { property: 'og:description', content: document.description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:locale', content: OG_LOCALES[language] },
    { property: 'og:locale:alternate', content: OG_LOCALES[alternateLanguage] },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: document.title },
    { name: 'twitter:description', content: document.description },
    { name: 'twitter:image', content: imageUrl },
  ];
};
