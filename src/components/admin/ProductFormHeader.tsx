import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button, Box } from '../ui';
import { theme } from '../../theme';

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
      className={`flex items-center justify-between border-b ${theme.colors.border} pb-4`}
    >
      <Box>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          {t(
            isEditing
              ? 'admin.productForm.editTitle'
              : 'admin.productForm.createTitle'
          )}
        </h3>
        <p className={`${theme.colors.textMuted} text-sm`}>
          {isEditing
            ? t('admin.productForm.editDescription', {
                title: productTitle ?? '',
              })
            : t('admin.productForm.createDescription')}
        </p>
      </Box>
      {isEditing && onCancelEdit && (
        <Button variant="secondary" size="sm" onClick={onCancelEdit}>
          <X className="w-3.5 h-3.5" />
          {t('admin.productForm.cancelEdit')}
        </Button>
      )}
    </Box>
  );
};

export default ProductFormHeader;
