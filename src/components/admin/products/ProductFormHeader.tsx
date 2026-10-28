import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Box, Button, Icon, Typography } from '../../ui';

interface ProductFormHeaderProps {
  isEditing: boolean;
  productTitle?: string;
  onCancelEdit?: () => void;
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEditing,
  productTitle,
  onCancelEdit,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      align="center"
      justify="between"
      wrap
      gap="tight"
      divider="bottom"
      paddingBottom="md"
    >
      <Box>
        <Typography variant="h3">
          {t(
            isEditing
              ? 'admin.productForm.editTitle'
              : 'admin.productForm.createTitle'
          )}
        </Typography>
        <Typography variant="body">
          {isEditing
            ? t('admin.productForm.editDescription', {
                title: productTitle ?? '',
              })
            : t('admin.productForm.createDescription')}
        </Typography>
      </Box>
      {isEditing && onCancelEdit && (
        <Button variant="secondary" size="sm" onClick={onCancelEdit}>
          <Icon as={X} size="sm" />
          {t('admin.productForm.cancelEdit')}
        </Button>
      )}
    </Box>
  );
};

export default ProductFormHeader;
