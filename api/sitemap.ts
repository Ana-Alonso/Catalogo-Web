import type { ApiRequest, ApiResponse } from './_lib/http';

const INDEXABLE_PATHS = ['/es', '/en'] as const;
const FALLBACK_SITE_URL = 'https://lauraenlienzo.vercel.app';

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getSiteUrl = (): string =>
  (process.env.VITE_SITE_URL || process.env.SITE_URL || FALLBACK_SITE_URL).replace(
    /\/$/,
    ''
  );

const buildUrl = (siteUrl: string, path: string): string =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

const buildSitemap = (siteUrl: string): string => {
  const urls = INDEXABLE_PATHS.map((path) => {
    const location = escapeXml(buildUrl(siteUrl, path));

    return [
      '  <url>',
      `    <loc>${location}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(
        buildUrl(siteUrl, '/es')
      )}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(
        buildUrl(siteUrl, '/en')
      )}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
        buildUrl(siteUrl, '/es')
      )}" />`,
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

export default function handler(_req: ApiRequest, res: ApiResponse): void {
  const sitemap = buildSitemap(getSiteUrl());

  res.status(200);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(sitemap);
}
