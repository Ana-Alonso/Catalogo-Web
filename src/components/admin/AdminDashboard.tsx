import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminProductForm } from './products/AdminProductForm';
import { AdminEtsyProductForm } from './etsy/AdminEtsyProductForm';
import { AdminEtsySyncPanel } from './etsy/AdminEtsySyncPanel';
import { AdminEtsyOffersPanel } from './etsy/AdminEtsyOffersPanel';
import { AdminProductTable } from './products/AdminProductTable';
import { AdminArchivedPanel } from './products/AdminArchivedPanel';
import { AdminWorkshopsPanel } from './registrations/AdminWorkshopsPanel';
import { AdminWorkshopCalendarPanel } from './workshops/AdminWorkshopCalendarPanel';
import { AdminDashboardTabs } from './AdminDashboardTabs';
import { AdminLoginForm } from './auth/AdminLoginForm';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { Box, Container, Icon, Typography } from '../ui';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminTab } from '../../hooks/useAdminTab';
import { useNow } from '../../hooks/useNow';
import { useToast } from '../../hooks/useToast';
import { isSupabaseConfigured } from '../../utils/supabase';
import { getProtectedWorkshopIds } from '../../utils/workshopSummary';
import { groupWorkshops } from '../../utils/workshopPhase';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';
import { LoaderCircle } from 'lucide-react';

interface AdminDashboardProps {
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
  onDeleteRegistration: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
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
  onDeleteRegistration,
  onClose
}) => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading, signIn, signOut } = useAdminAuth();
  const { success: notifySuccess, error: notifyError } = useToast();
  const { activeTab, setTab } = useAdminTab();
  const nowMs = useNow();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [createdWorkshop, setCreatedWorkshop] = useState<ProductFormData | null>(null);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.isVisible !== false),
    [products]
  );

  const archivedProducts = useMemo(
    () => products.filter((product) => product.isVisible === false),
    [products]
  );

  const protectedProductIds = useMemo(
    () => getProtectedWorkshopIds(registrations),
    [registrations]
  );

  const workshops = useMemo(
    () => products.filter((product) => product.category === 'talleres'),
    [products]
  );

  const workshopGroups = useMemo(
    () => groupWorkshops(products, nowMs),
    [products, nowMs]
  );

  const tabCounts = {
    productos: visibleProducts.length,
    talleres: workshopGroups.active.length,
    archivados: archivedProducts.length,
  };

  useEffect(() => {
    if (!editingProduct) return;
    document
      .getElementById('admin-product-form')
      ?.scrollIntoView({ block: 'start' });
  }, [editingProduct]);

  const handleEditProduct = (product: CatalogItem) => {
    setEditingProduct(product);
    setTab('productos');
  };

  const isAuthDegraded = !isSupabaseConfigured;
  const isAuthenticated = isAuthDegraded || (user !== null && isAdmin);

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    setAuthError(
      result.success
        ? null
        : t(result.errorKey ?? 'admin.login.unknownError')
    );
  };

  const handleLogout = () => {
    void signOut();
  };

  const handleFormSubmit = async (data: ProductFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setCreatedWorkshop(null);

    const isEdit = Boolean(editingProduct);
    const success = isEdit && editingProduct
      ? await onEditProduct(String(editingProduct.id), data)
      : await onAddProduct(data);

    setIsSubmitting(false);

    if (success) {
      notifySuccess(
        t(
          isEdit
            ? 'admin.feedback.productUpdated'
            : 'admin.feedback.productCreated'
        )
      );
      setEditingProduct(null);

      if (!isEdit && data.category === 'talleres' && data.eventDate) {
        setCreatedWorkshop(data);
      }

      return true;
    }

    notifyError(t('admin.feedback.productOperationError'));
    return false;
  };

  const handleEtsySubmit = async (metadata: EtsyProductMetadata): Promise<boolean> => {
    if (!editingProduct) {
      return false;
    }

    setIsSubmitting(true);

    const isSaved = await onEditEtsyMetadata(String(editingProduct.id), metadata);
    setIsSubmitting(false);

    if (isSaved) {
      notifySuccess(t('admin.feedback.etsyUpdated'));
      setEditingProduct(null);
      return true;
    }

    return false;
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const isDeleted = await onDeleteProduct(id);
    setIsDeleting(false);

    if (isDeleted) {
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
      notifySuccess(t('admin.feedback.productDeleted'));
    } else {
      notifyError(t('admin.feedback.productDeleteError'));
    }
  };

  const handleSetVisibility = async (id: string, isVisible: boolean) => {
    setIsUpdatingVisibility(true);
    const isSaved = await onSetProductVisibility(id, isVisible);
    setIsUpdatingVisibility(false);

    if (isSaved) {
      notifySuccess(
        t(
          isVisible
            ? 'admin.feedback.productRestored'
            : 'admin.feedback.productArchived'
        )
      );
      return;
    }

    notifyError(t('admin.feedback.productVisibilityError'));
  };

  if (isLoading) {
    return (
      <Box
        position="fixed"
        inset
        zIndex={50}
        background="neutral"
        display="flex"
        direction="column"
        justify="center"
        align="center"
        gap="tight"
        role="status"
      >
        <Icon as={LoaderCircle} size="xl" tone="accent" spin />
        <Typography variant="body">{t('admin.loadingSession')}</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onLogin={handleLogin}
        onClose={onClose}
        errorMessage={authError}
      />
    );
  }

  return (
    <Box
      position="fixed"
      inset
      zIndex={50}
      background="neutral"
      overflow="yAuto"
    >
      <AdminDashboardHeader onClose={onClose} onLogout={handleLogout} />

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
          </>
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
            onDeleteRegistration={onDeleteRegistration}
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
            onDeleteRegistration={onDeleteRegistration}
          />
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
