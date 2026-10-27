import { getPathLanguage } from '../i18n/paths';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/languages';
import {
  LEGAL_DOCUMENT_KINDS,
  buildLegalPath,
  findLegalKind,
} from '../data/legal/paths';

const HOME_PATHS = SUPPORTED_LANGUAGES.map((language) => `/${language}`);

const LEGAL_PATHS = SUPPORTED_LANGUAGES.flatMap((language) =>
  LEGAL_DOCUMENT_KINDS.map((kind) => buildLegalPath(language, kind))
);

const INDEXABLE_PATHS = [...HOME_PATHS, ...LEGAL_PATHS];

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildUrl = (siteUrl: string, path: string): string =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

const getAlternatePaths = (path: string): Record<SupportedLanguage, string> => {
  const language = getPathLanguage(path);
  const slug = path.split('/').filter(Boolean)[1];
  const kind = language && slug ? findLegalKind(language, slug) : null;

  if (!language || !kind) {
    return { es: '/es', en: '/en' };
  }

  return {
    es: buildLegalPath('es', kind),
    en: buildLegalPath('en', kind),
  };
};

export const buildSitemap = (
  siteUrl: string,
  paths: readonly string[] = INDEXABLE_PATHS
): string => {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  const urls = paths.map((path) => {
    const location = escapeXml(buildUrl(normalizedSiteUrl, path));
    const alternates = getAlternatePaths(path);
    const spanishUrl = escapeXml(buildUrl(normalizedSiteUrl, alternates.es));
    const englishUrl = escapeXml(buildUrl(normalizedSiteUrl, alternates.en));

    return [
      '  <url>',
      `    <loc>${location}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="es" href="${spanishUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${spanishUrl}" />`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');
};
