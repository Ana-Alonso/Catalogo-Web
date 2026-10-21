import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { normalizeLanguage } from '../i18n/languages';
import { buildLocalizedPath } from '../i18n/paths';

const getSiteBaseUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return window.location.origin;
};

const getOrCreateMeta = (name: string): HTMLMetaElement => {
  const selector = `meta[name="${name}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (existing) {
    return existing;
  }

  const meta = document.createElement('meta');
  meta.name = name;
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

export const usePageMeta = (): void => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const language = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useEffect(() => {
    const baseUrl = getSiteBaseUrl();
    const canonicalPath = buildLocalizedPath(
      location.pathname,
      '',
      '',
      language
    );

    document.documentElement.lang = language;
    document.title = t('meta.title');
    getOrCreateMeta('description').content = t('meta.description');
    getOrCreateLink('canonical').href = `${baseUrl}${canonicalPath}`;

    getOrCreateLink('alternate', 'es').href = `${baseUrl}${buildLocalizedPath(
      location.pathname,
      '',
      '',
      'es'
    )}`;
    getOrCreateLink('alternate', 'en').href = `${baseUrl}${buildLocalizedPath(
      location.pathname,
      '',
      '',
      'en'
    )}`;
    getOrCreateLink('alternate', 'x-default').href = `${baseUrl}/es`;
  }, [language, location.pathname, t]);
};

export default usePageMeta;
