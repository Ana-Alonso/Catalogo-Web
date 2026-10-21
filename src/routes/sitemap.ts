import { buildSitemap } from '../seo/sitemap';
import { getSiteUrl } from '../seo/site';

export function loader() {
  return new Response(buildSitemap(getSiteUrl()), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
