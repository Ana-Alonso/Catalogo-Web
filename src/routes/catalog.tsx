import type { MetaArgs } from 'react-router';
import CatalogPage from '../pages/CatalogPage';
import { getHomeMeta, getRootLanguage } from '../seo/meta';

export function meta({ matches }: MetaArgs) {
  return getHomeMeta(getRootLanguage(matches));
}

export default function CatalogRoute() {
  return <CatalogPage />;
}
