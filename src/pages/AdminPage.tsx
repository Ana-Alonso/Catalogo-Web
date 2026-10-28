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
    setVisibility,
    cancelWorkshop,
    restoreWorkshop,
    refreshProducts,
  } = useProducts();
  const {
    registrations,
    isLoading: isLoadingRegistrations,
    error: registrationsError,
    setStatus,
    remove,
    cancelWorkshopRegistrations,
    refreshRegistrations,
  } = useRegistrations();

  const handleCancelWorkshop = async (id: string): Promise<boolean> => {
    const isMarked = await cancelWorkshop(id);

    if (!isMarked) {
      return false;
    }

    const isCancelled = await cancelWorkshopRegistrations(id);
    await refreshRegistrations();

    if (!isCancelled) {
      await restoreWorkshop(id);
      return false;
    }

    return true;
  };

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
      onSetProductVisibility={setVisibility}
      onRefreshProducts={refreshProducts}
      onRefreshRegistrations={refreshRegistrations}
      onSetRegistrationStatus={setStatus}
      onDeleteRegistration={remove}
      onCancelWorkshop={handleCancelWorkshop}
      onClose={() => navigate('/')}
    />
  );
};

export default AdminPage;
