import type { MetaArgs } from 'react-router';
import LegalPage from '../../pages/LegalPage';
import { getLegalMeta, getLegalRouteLanguage } from '../../seo/legal';

export function meta(args: MetaArgs) {
  return getLegalMeta('cookies', getLegalRouteLanguage(args));
}

export default function CookiesRoute() {
  return <LegalPage kind="cookies" />;
}
