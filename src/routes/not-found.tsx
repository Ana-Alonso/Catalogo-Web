import { data, type MetaArgs } from 'react-router';
import NotFoundPage from '../pages/NotFoundPage';
import { getNotFoundMeta, getRootLanguage } from '../seo/meta';

export function loader() {
  return data(null, { status: 404 });
}

export function meta({ matches }: MetaArgs) {
  return getNotFoundMeta(getRootLanguage(matches));
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
