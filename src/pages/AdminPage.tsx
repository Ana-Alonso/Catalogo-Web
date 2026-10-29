import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SITE_NAME } from '../seo/site';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(`${t('admin.title')} | ${SITE_NAME}`);
  const navigate = useNavigate();

  return <AdminDashboard onClose={() => navigate('/')} />;
};

export default AdminPage;
