import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit3, Trash2 } from 'lucide-react';
import { Box, Button, Icon } from '../../ui';
import { useConfirm } from '../../../hooks/useConfirm';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductActionsProps {
  item: CatalogItem;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
}

export const AdminProductActions: React.FC<AdminProductActionsProps> = ({
  item,
  isDeleting,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const isFromEtsy = item.source === 'etsy';

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      message: t('admin.productTable.deleteConfirm', { title: item.title }),
      confirmLabel: t('common.delete'),
      isDanger: true,
    });

    if (isConfirmed) {
      onDelete(String(item.id));
    }
  };

  return (
    <Box display="flex" align="center" justify="end" gap="xs">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(item)}
        aria-label={t('admin.productTable.editAria', { title: item.title })}
      >
        <Icon as={Edit3} tone="accent" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isDeleting || isFromEtsy}
        title={isFromEtsy ? t('admin.productTable.etsyDeleteHint') : undefined}
        onClick={handleDelete}
        aria-label={
          isFromEtsy
            ? t('admin.productTable.etsyDeleteAria', { title: item.title })
            : t('admin.productTable.deleteAria', { title: item.title })
        }
      >
        <Icon as={Trash2} tone="danger" />
      </Button>
    </Box>
  );
};

export default AdminProductActions;
