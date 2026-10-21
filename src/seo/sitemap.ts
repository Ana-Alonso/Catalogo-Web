const INDEXABLE_PATHS = ['/es', '/en'] as const;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildUrl = (siteUrl: string, path: string): string =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

export const buildSitemap = (
  siteUrl: string,
  paths: readonly string[] = INDEXABLE_PATHS
): string => {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');
  const spanishUrl = escapeXml(buildUrl(normalizedSiteUrl, '/es'));
  const englishUrl = escapeXml(buildUrl(normalizedSiteUrl, '/en'));
  const urls = paths.map((path) => {
    const location = escapeXml(buildUrl(normalizedSiteUrl, path));

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
