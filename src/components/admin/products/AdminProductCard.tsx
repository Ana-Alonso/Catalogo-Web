import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '../../ui';
import { AdminProductActions } from './AdminProductActions';
import {
  AdminProductCategoryBadge,
  AdminProductStatusBadge,
} from './AdminProductBadges';
import { AdminProductIdentity } from './AdminProductIdentity';
import { AdminProductLinks } from './AdminProductLinks';
import { AdminProductPriceBlock } from './AdminProductPriceBlock';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductCardProps {
  item: CatalogItem;
  isDeleting: boolean;
  isUpdatingVisibility: boolean;
  isDeleteBlocked: boolean;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  onSetVisibility: (id: string, isVisible: boolean) => void;
}

export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  item,
  isDeleting,
  isUpdatingVisibility,
  isDeleteBlocked,
  onDelete,
  onEdit,
  onSetVisibility,
}) => {
  const { t } = useTranslation();
  const currentStatus = item.status || 'disponible';

  return (
    <Box
      as="article"
      border
      rounded="xl"
      padding="md"
      display="flex"
      direction="column"
      gap="md"
    >
      <AdminProductIdentity item={item} isImageLazy />
      <Box stackBelow="sm" align="start" display="flex" gap="xs">
        <AdminProductCategoryBadge item={item} />
        <AdminProductStatusBadge status={currentStatus} />
      </Box>
      <Box display="flex" align="center" justify="between" gap="tight" wrap>
        <Typography size="xs" tone="subtle" transform="uppercase" tracking="wider">
          {t('admin.productTable.columns.price')}
        </Typography>
        <Box textAlign="right">
          <AdminProductPriceBlock item={item} />
        </Box>
      </Box>
      <AdminProductLinks item={item} isTouch />
      <AdminProductActions
        item={item}
        isDeleting={isDeleting}
        isUpdatingVisibility={isUpdatingVisibility}
        isDeleteBlocked={isDeleteBlocked}
        onDelete={onDelete}
        onEdit={onEdit}
        onSetVisibility={onSetVisibility}
      />
    </Box>
  );
};

export default AdminProductCard;
