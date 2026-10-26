import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Plus } from 'lucide-react';
import { Box, Button, Icon } from '../ui';

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
        {isEditing ? <Icon as={Check} /> : <Icon as={Plus} />}
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
