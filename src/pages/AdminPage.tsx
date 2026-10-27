import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProducts } from '../hooks/useProducts';
import { useRegistrations } from '../hooks/useRegistrations';
import { SITE_NAME } from '../seo/site';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(`${t('admin.title')} | ${SITE_NAME}`);
  const navigate = useNavigate();
  const {
    products,
    isLoading: isLoadingProducts,
    error: productsError,
    addProduct,
    editProduct,
    editEtsyMetadata,
    applyEtsyOffers,
    removeProduct,
    refreshProducts,
  } = useProducts();
  const {
    registrations,
    isLoading: isLoadingRegistrations,
    error: registrationsError,
    setStatus,
    remove,
    refreshRegistrations,
  } = useRegistrations();

  return (
    <AdminDashboard
      products={products}
      registrations={registrations}
      isLoadingProducts={isLoadingProducts}
      productsError={productsError}
      isLoadingRegistrations={isLoadingRegistrations}
      registrationsError={registrationsError}
      onAddProduct={addProduct}
      onEditProduct={editProduct}
      onEditEtsyMetadata={editEtsyMetadata}
      onApplyEtsyOffers={applyEtsyOffers}
      onDeleteProduct={removeProduct}
      onRefreshProducts={refreshProducts}
      onRefreshRegistrations={refreshRegistrations}
      onSetRegistrationStatus={setStatus}
      onDeleteRegistration={remove}
      onClose={() => navigate('/')}
    />
  );
};

export default AdminPage;
