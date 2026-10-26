import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Plus } from 'lucide-react';
import { Button, Box } from '../ui';

interface ProductFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancelEdit?: () => void;
}

export const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancelEdit,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justify="end"
      gap="tight"
      paddingTop="md"
      divider="top"
    >
      {isEditing && onCancelEdit && (
        <Button variant="outline" onClick={onCancelEdit}>
          {t('admin.productForm.cancel')}
        </Button>
      )}
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isEditing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {isSubmitting
          ? t('admin.productForm.saving')
          : isEditing
            ? t('admin.productForm.saveChanges')
            : t('admin.productForm.publish')}
      </Button>
    </Box>
  );
};

export default ProductFormActions;
