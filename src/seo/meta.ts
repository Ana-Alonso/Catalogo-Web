import type { MetaArgs, MetaDescriptor } from 'react-router';
import { normalizeLanguage, type SupportedLanguage } from '../i18n/languages';
import { resources } from '../i18n/resources';
import { DEFAULT_OG_IMAGE_PATH, getSiteUrl, SITE_NAME } from './site';

const OG_LOCALES: Record<SupportedLanguage, string> = {
  es: 'es_ES',
  en: 'en_GB',
};

interface RootLoaderData {
  preferredLanguage?: SupportedLanguage;
}

const isPreviewDeployment = (): boolean => {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
  };

  return runtime.process?.env?.VERCEL_ENV === 'preview';
};

const buildLanguageLinks = (
  siteUrl: string,
  language: SupportedLanguage
): MetaDescriptor[] => {
  const alternateLanguage = language === 'es' ? 'en' : 'es';

  return [
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'es',
      href: `${siteUrl}/es`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${siteUrl}/en`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${siteUrl}/es`,
    },
    {
      property: 'og:locale',
      content: OG_LOCALES[language],
    },
    {
      property: 'og:locale:alternate',
      content: OG_LOCALES[alternateLanguage],
    },
  ];
};

export const getRootLanguage = (
  matches: MetaArgs['matches']
): SupportedLanguage => {
  const rootMatch = matches.find((match) => match.id === 'root') ?? matches[0];
  const rootData = rootMatch?.data as RootLoaderData | undefined;

  return normalizeLanguage(rootData?.preferredLanguage);
};

export const getHomeMeta = (
  language: SupportedLanguage,
  siteUrl: string = getSiteUrl()
): MetaDescriptor[] => {
  const translation = resources[language].translation;
  const title = translation.meta.title;
  const description = translation.meta.description;
  const canonicalUrl = `${siteUrl}/${language}`;
  const imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
  const robots = isPreviewDeployment()
    ? 'noindex, nofollow'
    : 'index, follow';

  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    ...buildLanguageLinks(siteUrl, language),
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: title },
  ];
};

export const getNotFoundMeta = (
  language: SupportedLanguage
): MetaDescriptor[] => {
  const translation = resources[language].translation.errors.notFound;

  return [
    { title: `${translation.title} | ${SITE_NAME}` },
    { name: 'description', content: translation.description },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
};

export const getAdminMeta = (language: SupportedLanguage): MetaDescriptor[] => {
  const translation = resources[language].translation.admin;

  return [
    { title: `${translation.title} | ${SITE_NAME}` },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
};

export const getDefaultMeta = (): MetaDescriptor[] => {
  const translation = resources.es.translation;

  return [
    { title: translation.meta.title },
    { name: 'description', content: translation.meta.description },
  ];
};
