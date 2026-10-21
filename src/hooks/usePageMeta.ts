import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { normalizeLanguage, type SupportedLanguage } from '../i18n/languages';
import { buildLocalizedPath } from '../i18n/paths';
import { buildHomeStructuredData, getSocialLinks } from '../seo/jsonLd';
import {
  DEFAULT_OG_IMAGE_PATH,
  getAbsoluteUrl,
  getSiteUrl,
  SITE_NAME,
} from '../seo/site';

const OG_LOCALES: Record<SupportedLanguage, string> = {
  es: 'es_ES',
  en: 'en_GB',
};

const getOrCreateMeta = (
  attribute: 'name' | 'property',
  value: string
): HTMLMetaElement => {
  const selector = `meta[${attribute}="${value}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (existing) {
    return existing;
  }

  const meta = document.createElement('meta');
  meta.setAttribute(attribute, value);
  document.head.appendChild(meta);
  return meta;
};

const getOrCreateLink = (
  rel: string,
  hrefLang?: string
): HTMLLinkElement => {
  const selector = hrefLang
    ? `link[rel="${rel}"][hreflang="${hrefLang}"]`
    : `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);

  if (existing) {
    return existing;
  }

  const link = document.createElement('link');
  link.rel = rel;

  if (hrefLang) {
    link.hreflang = hrefLang;
  }

  document.head.appendChild(link);
  return link;
};

const getOrCreateStructuredData = (): HTMLScriptElement => {
  const selector = 'script[data-seo="structured-data"]';
  const existing = document.head.querySelector<HTMLScriptElement>(selector);

  if (existing) {
    return existing;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.seo = 'structured-data';
  document.head.appendChild(script);
  return script;
};

export const usePageMeta = (): void => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const language = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonicalPath = buildLocalizedPath(
      location.pathname,
      '',
      '',
      language
    );
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const alternateLanguage = language === 'es' ? 'en' : 'es';
    const imageUrl = getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
    const title = t('meta.title');
    const description = t('meta.description');

    document.documentElement.lang = language;
    document.title = title;

    getOrCreateMeta('name', 'description').content = description;
    getOrCreateLink('canonical').href = canonicalUrl;
    getOrCreateLink('alternate', 'es').href = `${siteUrl}${buildLocalizedPath(
      location.pathname,
      '',
      '',
      'es'
    )}`;
    getOrCreateLink('alternate', 'en').href = `${siteUrl}${buildLocalizedPath(
      location.pathname,
      '',
      '',
      'en'
    )}`;
    getOrCreateLink('alternate', 'x-default').href = `${siteUrl}/es`;

    getOrCreateMeta('property', 'og:type').content = 'website';
    getOrCreateMeta('property', 'og:site_name').content = SITE_NAME;
    getOrCreateMeta('property', 'og:title').content = title;
    getOrCreateMeta('property', 'og:description').content = description;
    getOrCreateMeta('property', 'og:url').content = canonicalUrl;
    getOrCreateMeta('property', 'og:image').content = imageUrl;
    getOrCreateMeta('property', 'og:image:width').content = '1200';
    getOrCreateMeta('property', 'og:image:height').content = '630';
    getOrCreateMeta('property', 'og:image:alt').content = title;
    getOrCreateMeta('property', 'og:locale').content = OG_LOCALES[language];
    getOrCreateMeta('property', 'og:locale:alternate').content =
      OG_LOCALES[alternateLanguage];

    getOrCreateMeta('name', 'twitter:card').content = 'summary_large_image';
    getOrCreateMeta('name', 'twitter:title').content = title;
    getOrCreateMeta('name', 'twitter:description').content = description;
    getOrCreateMeta('name', 'twitter:image').content = imageUrl;
    getOrCreateMeta('name', 'twitter:image:alt').content = title;

    const structuredData = getOrCreateStructuredData();
    structuredData.textContent = JSON.stringify(
      buildHomeStructuredData(language, description, {
        siteUrl,
        socialLinks: getSocialLinks(),
      })
    );
  }, [language, location.pathname, t]);
};

export default usePageMeta;
