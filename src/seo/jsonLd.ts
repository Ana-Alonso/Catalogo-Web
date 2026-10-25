import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from './site';
import type { SupportedLanguage } from '../i18n/languages';

interface HomeStructuredDataOptions {
  siteUrl: string;
  socialLinks?: string[];
}

export type LdJsonValue =
  | string
  | number
  | boolean
  | null
  | LdJsonValue[]
  | LdJsonObject;

export interface LdJsonObject {
  [key: string]: LdJsonValue;
}

const absoluteUrl = (siteUrl: string, path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
};

export const getSocialLinks = (): string[] =>
  [
    import.meta.env.VITE_ETSY_SHOP_URL,
    import.meta.env.VITE_INSTAGRAM_URL,
    import.meta.env.VITE_TIKTOK_URL,
  ].filter((value): value is string => Boolean(value));

export const buildHomeStructuredData = (
  language: SupportedLanguage,
  description: string,
  options: HomeStructuredDataOptions
): LdJsonObject => {
  const { siteUrl, socialLinks = [] } = options;
  const rootUrl = `${siteUrl.replace(/\/+$/, '')}/`;
  const organizationId = `${rootUrl}#organization`;
  const websiteId = `${rootUrl}#website`;
  const pageUrl = absoluteUrl(siteUrl, `/${language}`);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: SITE_NAME,
        url: rootUrl,
        logo: absoluteUrl(siteUrl, '/favicon.svg'),
        ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE_NAME,
        alternateName: ['Laurelenlienzo', 'Laurel en Lienzo'],
        url: rootUrl, 
        description,
        inLanguage: language,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: SITE_NAME,
        description,
        inLanguage: language,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: absoluteUrl(siteUrl, DEFAULT_OG_IMAGE_PATH),
      },
    ],
  };
};