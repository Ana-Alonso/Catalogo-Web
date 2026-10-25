import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminProductForm } from './AdminProductForm';
import { AdminEtsyProductForm } from './AdminEtsyProductForm';
import { AdminEtsySyncPanel } from './AdminEtsySyncPanel';
import { AdminProductTable } from './AdminProductTable';
import { AdminRegistrationsPanel } from './AdminRegistrationsPanel';
import { AdminWorkshopCalendarPanel } from './AdminWorkshopCalendarPanel';
import { AdminLoginForm } from './AdminLoginForm';
import { AdminDashboardHeader } from './AdminDashboardHeader';
import { Container } from '../ui';
import { theme } from '../../theme';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { isSupabaseConfigured } from '../../utils/supabase';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';
import { AlertCircle, CheckCircle, LoaderCircle } from 'lucide-react';

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
  onDeleteProduct: (id: string) => Promise<boolean>;
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
  onDeleteProduct,
  onRefreshProducts,
  onRefreshRegistrations,
  onSetRegistrationStatus,
  onDeleteRegistration,
  onClose
}) => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading, signIn, signOut } = useAdminAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [createdWorkshop, setCreatedWorkshop] = useState<ProductFormData | null>(null);

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
    setFeedbackMsg(null);
    setCreatedWorkshop(null);

    const isEdit = Boolean(editingProduct);
    const success = isEdit && editingProduct
      ? await onEditProduct(String(editingProduct.id), data)
      : await onAddProduct(data);

    setIsSubmitting(false);

    if (success) {
      setFeedbackMsg({
        text: t(
          isEdit
            ? 'admin.feedback.productUpdated'
            : 'admin.feedback.productCreated'
        ),
        type: 'success'
      });
      setEditingProduct(null);

      if (!isEdit && data.category === 'talleres' && data.eventDate) {
        setCreatedWorkshop(data);
      }

      setTimeout(() => setFeedbackMsg(null), 3500);
      return true;
    }

    setFeedbackMsg({ text: t('admin.feedback.productOperationError'), type: 'error' });
    return false;
  };

  const handleEtsySubmit = async (metadata: EtsyProductMetadata): Promise<boolean> => {
    if (!editingProduct) {
      return false;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const success = await onEditEtsyMetadata(String(editingProduct.id), metadata);
    setIsSubmitting(false);

    if (success) {
      setFeedbackMsg({
        text: t('admin.feedback.etsyUpdated'),
        type: 'success',
      });
      setEditingProduct(null);
      setTimeout(() => setFeedbackMsg(null), 3500);
      return true;
    }

    setFeedbackMsg({ text: t('admin.feedback.etsyUpdateError'), type: 'error' });
    return false;
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setFeedbackMsg(null);
    const success = await onDeleteProduct(id);
    setIsDeleting(false);

    if (success) {
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
      setFeedbackMsg({ text: t('admin.feedback.productDeleted'), type: 'success' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg({ text: t('admin.feedback.productDeleteError'), type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 ${theme.colors.background} flex flex-col justify-center items-center gap-3`}
        role="status"
      >
        <LoaderCircle className="w-6 h-6 text-orange-500 animate-spin" aria-hidden="true" />
        <p className={`${theme.colors.textMuted} text-sm`}>{t('admin.loadingSession')}</p>
      </div>
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
    <div className={`fixed inset-0 z-50 ${theme.colors.background} overflow-y-auto`}>
      <AdminDashboardHeader onClose={onClose} onLogout={handleLogout} />

      <Container as="main" className="py-10 space-y-8">
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
              feedbackMsg.type === 'success'
                ? 'bg-green-950/40 border-green-800 text-green-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {createdWorkshop && (
          <AdminWorkshopCalendarPanel workshopData={createdWorkshop} />
        )}

        {isSupabaseConfigured && <AdminEtsySyncPanel onSynced={onRefreshProducts} />}

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

        <AdminProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={(prod) => {
            setEditingProduct(prod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDeleting={isDeleting}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={onRefreshProducts}
        />

        <AdminRegistrationsPanel
          workshops={products}
          registrations={registrations}
          isLoading={isLoadingRegistrations}
          error={registrationsError}
          onRetry={onRefreshRegistrations}
          onSetStatus={onSetRegistrationStatus}
          onDelete={onDeleteRegistration}
        />
      </Container>
    </div>
  );
};

export default AdminDashboard;
