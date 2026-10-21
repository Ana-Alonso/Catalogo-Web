import type { MetaArgs } from 'react-router';
import AdminPage from '../pages/AdminPage';
import { getAdminMeta, getRootLanguage } from '../seo/meta';

export function meta({ matches }: MetaArgs) {
  return getAdminMeta(getRootLanguage(matches));
}

export default function AdminRoute() {
  return <AdminPage />;
}
