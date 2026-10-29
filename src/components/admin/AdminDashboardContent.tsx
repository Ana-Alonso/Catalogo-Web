import React from 'react';
import { AdminProductForm } from './products/AdminProductForm';
import { AdminEtsyProductForm } from './etsy/AdminEtsyProductForm';
import { AdminEtsySyncPanel } from './etsy/AdminEtsySyncPanel';
import { AdminEtsyOffersPanel } from './etsy/AdminEtsyOffersPanel';
import { AdminProductTable } from './products/AdminProductTable';
import { AdminArchivedPanel } from './products/AdminArchivedPanel';
import { AdminWorkshopsPanel } from './registrations/AdminWorkshopsPanel';
import { AdminWorkshopCalendarPanel } from './workshops/AdminWorkshopCalendarPanel';
import { AdminDashboardTabs } from './AdminDashboardTabs';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { Box, Container } from '../ui';
import { useAdminTab } from '../../hooks/useAdminTab';
import { useAdminCollections } from '../../hooks/useAdminCollections';
import { useAdminMutations } from '../../hooks/useAdminMutations';
import { useProducts } from '../../hooks/useProducts';
import { useRegistrations } from '../../hooks/useRegistrations';
import { isSupabaseConfigured } from '../../utils/supabase';
import type { CatalogItem } from '../../types/catalog';

export interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboardContent: React.FC<AdminDashboardProps> = ({
  onClose,
  onLogout
}) => {
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
    withdrawMarketingConsent,
    cancelWorkshopRegistrations,
    refreshRegistrations,
  } = useRegistrations();
  const { activeTab, setTab } = useAdminTab();
  const {
    visibleProducts,
    archivedProducts,
    protectedProductIds,
    workshops,
    tabCounts,
  } = useAdminCollections(products, registrations);
  const {
    editingProduct,
    setEditingProduct,
    createdWorkshop,
    isSubmitting,
    isDeleting,
    isUpdatingVisibility,
    isCancellingWorkshop,
    isRestoringWorkshop,
    handleFormSubmit,
    handleEtsySubmit,
    handleDelete,
    handleSetVisibility,
    handleCancelWorkshop,
    handleRestoreWorkshop,
  } = useAdminMutations({
    onAddProduct: addProduct,
    onEditProduct: editProduct,
    onEditEtsyMetadata: editEtsyMetadata,
    onDeleteProduct: removeProduct,
    onSetProductVisibility: setVisibility,
    onCancelWorkshop: cancelWorkshop,
    onRestoreWorkshop: restoreWorkshop,
    onCancelWorkshopRegistrations: cancelWorkshopRegistrations,
    onRefreshRegistrations: refreshRegistrations,
  });

  const handleEditProduct = (product: CatalogItem) => {
    setEditingProduct(product);
    setTab('productos');
  };

  return (
    <Box
      position="fixed"
      inset
      zIndex={50}
      background="neutral"
      overflow="yAuto"
    >
      <AdminDashboardHeader onClose={onClose} onLogout={onLogout} />

      <Container
        as="main"
        paddingY="2xl"
        display="flex"
        direction="column"
        gap="xl"
      >
        <AdminDashboardTabs activeTab={activeTab} counts={tabCounts} />

        {activeTab === 'productos' && (
          <>
            {createdWorkshop && (
              <AdminWorkshopCalendarPanel workshopData={createdWorkshop} />
            )}

            {isSupabaseConfigured && (
              <AdminEtsySyncPanel onSynced={refreshProducts} />
            )}

            <AdminEtsyOffersPanel
              products={products}
              onApply={applyEtsyOffers}
            />

            <Box id="admin-product-form" className="scroll-mt-24">
              {editingProduct?.source === 'etsy' ? (
                <AdminEtsyProductForm
                  key={editingProduct.id}
                  product={editingProduct}
                  onSubmit={handleEtsySubmit}
                  isSubmitting={isSubmitting}
                  onCancelEdit={() => setEditingProduct(null)}
                />
              ) : (
                <AdminProductForm
                  key={editingProduct ? editingProduct.id : 'new-product-form'}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  editingProduct={editingProduct}
                  onCancelEdit={() => setEditingProduct(null)}
                />
              )}
            </Box>
          </>
        )}

        {activeTab === 'catalogo' && (
          <AdminProductTable
            products={visibleProducts}
            blockedDeletionIds={protectedProductIds}
            onDelete={handleDelete}
            onEdit={handleEditProduct}
            onSetVisibility={handleSetVisibility}
            isDeleting={isDeleting}
            isUpdatingVisibility={isUpdatingVisibility}
            isLoading={isLoadingProducts}
            error={productsError}
            onRetry={refreshProducts}
          />
        )}

        {activeTab === 'talleres' && (
          <AdminWorkshopsPanel
            workshops={workshops}
            registrations={registrations}
            isLoading={isLoadingRegistrations}
            error={registrationsError}
            isUpdatingVisibility={isUpdatingVisibility}
            onRetry={refreshRegistrations}
            onEdit={handleEditProduct}
            onSetVisibility={handleSetVisibility}
            onSetStatus={setStatus}
            onWithdrawMarketingConsent={withdrawMarketingConsent}
            onDeleteRegistration={remove}
            onCancelWorkshop={handleCancelWorkshop}
            isCancellingWorkshop={isCancellingWorkshop}
            onRestoreWorkshop={handleRestoreWorkshop}
            isRestoringWorkshop={isRestoringWorkshop}
          />
        )}

        {activeTab === 'archivados' && (
          <AdminArchivedPanel
            products={archivedProducts}
            registrations={registrations}
            isLoading={isLoadingProducts}
            error={productsError}
            isDeleting={isDeleting}
            isUpdatingVisibility={isUpdatingVisibility}
            protectedProductIds={protectedProductIds}
            onRetry={refreshProducts}
            onDelete={handleDelete}
            onEdit={handleEditProduct}
            onSetVisibility={handleSetVisibility}
            onSetStatus={setStatus}
            onWithdrawMarketingConsent={withdrawMarketingConsent}
            onDeleteRegistration={remove}
          />
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboardContent;
