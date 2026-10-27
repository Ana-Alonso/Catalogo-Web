import type { MetaArgs } from 'react-router';
import LegalPage from '../../pages/LegalPage';
import { getLegalMeta, getLegalRouteLanguage } from '../../seo/legal';

export function meta(args: MetaArgs) {
  return getLegalMeta('privacy', getLegalRouteLanguage(args));
}

export default function PrivacyRoute() {
  return <LegalPage kind="privacy" />;
}
