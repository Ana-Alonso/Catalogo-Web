import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from './useToast';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../types/catalog';

interface AdminMutations {
  onAddProduct: (data: ProductFormData) => Promise<boolean>;
  onEditProduct: (id: string, data: ProductFormData) => Promise<boolean>;
  onEditEtsyMetadata: (id: string, metadata: EtsyProductMetadata) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onSetProductVisibility: (id: string, isVisible: boolean) => Promise<boolean>;
  onCancelWorkshop: (id: string) => Promise<boolean>;
  onRestoreWorkshop: (id: string) => Promise<boolean>;
}

export const useAdminMutations = ({
  onAddProduct,
  onEditProduct,
  onEditEtsyMetadata,
  onDeleteProduct,
  onSetProductVisibility,
  onCancelWorkshop,
  onRestoreWorkshop,
}: AdminMutations) => {
  const { t } = useTranslation();
  const { success: notifySuccess, error: notifyError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isCancellingWorkshop, setIsCancellingWorkshop] = useState(false);
  const [isRestoringWorkshop, setIsRestoringWorkshop] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [createdWorkshop, setCreatedWorkshop] = useState<ProductFormData | null>(null);

  useEffect(() => {
    if (!editingProduct) return;
    document
      .getElementById('admin-product-form')
      ?.scrollIntoView({ block: 'start' });
  }, [editingProduct]);

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

  const handleEtsySubmit = async (
    metadata: EtsyProductMetadata
  ): Promise<boolean> => {
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

  const handleCancelWorkshop = async (workshop: CatalogItem) => {
    setIsCancellingWorkshop(true);
    const isCancelled = await onCancelWorkshop(String(workshop.id));
    setIsCancellingWorkshop(false);

    if (isCancelled) {
      notifySuccess(
        t('admin.feedback.workshopCancelled', { title: workshop.title })
      );
      return;
    }

    notifyError(t('admin.feedback.workshopCancelError'));
  };

  const handleRestoreWorkshop = async (workshop: CatalogItem) => {
    setIsRestoringWorkshop(true);
    const isRestored = await onRestoreWorkshop(String(workshop.id));
    setIsRestoringWorkshop(false);

    if (isRestored) {
      notifySuccess(
        t('admin.feedback.workshopRestored', { title: workshop.title })
      );
      return;
    }

    notifyError(t('admin.feedback.workshopRestoreError'));
  };

  return {
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
  };
};
