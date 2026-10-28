import React from 'react';
import { TableCell, TableRow } from '../../ui';
import { AdminProductActions } from './AdminProductActions';
import {
  AdminProductCategoryBadge,
  AdminProductStatusBadge,
} from './AdminProductBadges';
import { AdminProductIdentity } from './AdminProductIdentity';
import { AdminProductLinks } from './AdminProductLinks';
import { AdminProductPriceBlock } from './AdminProductPriceBlock';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductTableRowProps {
  item: CatalogItem;
  isDeleting: boolean;
  isUpdatingVisibility: boolean;
  isDeleteBlocked: boolean;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  onSetVisibility: (id: string, isVisible: boolean) => void;
}

export const AdminProductTableRow: React.FC<AdminProductTableRowProps> = ({
  item,
  isDeleting,
  isUpdatingVisibility,
  isDeleteBlocked,
  onDelete,
  onEdit,
  onSetVisibility,
}) => (
  <TableRow hoverable>
    <TableCell>
      <AdminProductIdentity item={item} />
    </TableCell>
    <TableCell>
      <AdminProductCategoryBadge item={item} />
    </TableCell>
    <TableCell>
      <AdminProductStatusBadge status={item.status || 'disponible'} />
    </TableCell>
    <TableCell weight="medium" tone="muted">
      <AdminProductPriceBlock item={item} />
    </TableCell>
    <TableCell>
      <AdminProductLinks item={item} />
    </TableCell>
    <TableCell align="right">
      <AdminProductActions
        item={item}
        isDeleting={isDeleting}
        isUpdatingVisibility={isUpdatingVisibility}
        isDeleteBlocked={isDeleteBlocked}
        onDelete={onDelete}
        onEdit={onEdit}
        onSetVisibility={onSetVisibility}
      />
    </TableCell>
  </TableRow>
);

export default AdminProductTableRow;
