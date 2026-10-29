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
import { isSupabaseConfigured } from '../../utils/supabase';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';

export interface AdminDashboardProps {
  products: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoadingProducts: boolean;
  productsError: string | null;
  isLoadingRegistrations: boolean;
  registrationsError: string | null;
  onAddProduct: (data: ProductFormData) => Promise<boolean>;
  onEditProduct: (id: string, data: ProductFormData) => Promise<boolean>;
  onEditEtsyMetadata: (id: string, metadata: EtsyProductMetadata) => Promise<boolean>;
  onApplyEtsyOffers: (onSale: boolean) => Promise<number | null>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onSetProductVisibility: (id: string, isVisible: boolean) => Promise<boolean>;
  onRefreshProducts: () => Promise<void>;
  onRefreshRegistrations: () => Promise<void>;
  onSetRegistrationStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onWithdrawMarketingConsent: (id: string) => Promise<boolean>;
  onDeleteRegistration: (id: string) => Promise<boolean>;
  onCancelWorkshop: (id: string) => Promise<boolean>;
  onRestoreWorkshop: (id: string) => Promise<boolean>;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboardContent: React.FC<AdminDashboardProps> = ({
  products,
  registrations,
  isLoadingProducts,
  productsError,
  isLoadingRegistrations,
  registrationsError,
  onAddProduct,
  onEditProduct,
  onEditEtsyMetadata,
  onApplyEtsyOffers,
  onDeleteProduct,
  onSetProductVisibility,
  onRefreshProducts,
  onRefreshRegistrations,
  onSetRegistrationStatus,
  onWithdrawMarketingConsent,
  onDeleteRegistration,
  onCancelWorkshop,
  onRestoreWorkshop,
  onClose,
  onLogout
}) => {
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
    onAddProduct,
    onEditProduct,
    onEditEtsyMetadata,
    onDeleteProduct,
    onSetProductVisibility,
    onCancelWorkshop,
    onRestoreWorkshop,
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
              <AdminEtsySyncPanel onSynced={onRefreshProducts} />
            )}

            <AdminEtsyOffersPanel
              products={products}
              onApply={onApplyEtsyOffers}
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
            onRetry={onRefreshProducts}
          />
        )}

        {activeTab === 'talleres' && (
          <AdminWorkshopsPanel
            workshops={workshops}
            registrations={registrations}
            isLoading={isLoadingRegistrations}
            error={registrationsError}
            isUpdatingVisibility={isUpdatingVisibility}
            onRetry={onRefreshRegistrations}
            onEdit={handleEditProduct}
            onSetVisibility={handleSetVisibility}
            onSetStatus={onSetRegistrationStatus}
            onWithdrawMarketingConsent={onWithdrawMarketingConsent}
            onDeleteRegistration={onDeleteRegistration}
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
            onRetry={onRefreshProducts}
            onDelete={handleDelete}
            onEdit={handleEditProduct}
            onSetVisibility={handleSetVisibility}
            onSetStatus={onSetRegistrationStatus}
            onWithdrawMarketingConsent={onWithdrawMarketingConsent}
            onDeleteRegistration={onDeleteRegistration}
          />
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboardContent;
