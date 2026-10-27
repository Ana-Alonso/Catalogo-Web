import type { MetaArgs } from 'react-router';
import LegalPage from '../../pages/LegalPage';
import { getLegalMeta, getLegalRouteLanguage } from '../../seo/legal';

export function meta(args: MetaArgs) {
  return getLegalMeta('notice', getLegalRouteLanguage(args));
}

export default function LegalNoticeRoute() {
  return <LegalPage kind="notice" />;
}
