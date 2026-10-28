import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Box, ErrorState, Typography, Table, TableHead, TableBody, TableRow, TableHeader } from '../../ui';
import { AdminProductCard } from './AdminProductCard';
import { AdminProductTableRow } from './AdminProductTableRow';
import { AdminProductTableSkeleton } from './AdminProductTableSkeleton';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductTableProps {
  products: CatalogItem[];
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  isDeleting: boolean;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
}

export const AdminProductTable: React.FC<AdminProductTableProps> = ({
  products,
  onDelete,
  onEdit,
  isDeleting,
  isLoading,
  error,
  onRetry,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box role="status" aria-label={t('admin.productTable.loading')}>
        <AdminProductTableSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('admin.productTable.errorTitle')}
        description={error}
        onRetry={onRetry}
        retryLabel={t('common.retry')}
      />
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <Box textAlign="center" paddingY="3xl">
          <Typography variant="body">{t('admin.productTable.empty')}</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box padding="lg" divider="bottom">
        <Typography variant="h3">
          {t('admin.productTable.title', { count: products.length })}
        </Typography>
        <Typography variant="body">
          {t('admin.productTable.subtitle')}
        </Typography>
      </Box>

      <Box overflow="xAuto" hideBelow="md" display="block">
        <Table fullWidth>
          <TableHead>
            <TableRow head>
              <TableHeader>{t('admin.productTable.columns.artwork')}</TableHeader>
              <TableHeader>{t('admin.productTable.columns.category')}</TableHeader>
              <TableHeader>
                {t('admin.productTable.columns.availability')}
              </TableHeader>
              <TableHeader>{t('admin.productTable.columns.price')}</TableHeader>
              <TableHeader>{t('admin.productTable.columns.links')}</TableHeader>
              <TableHeader align="right">
                {t('admin.productTable.columns.actions')}
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <AdminProductTableRow
                key={item.id}
                item={item}
                isDeleting={isDeleting}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box
        showBelow="md"
        display="flex"
        direction="column"
        gap="md"
        padding="md"
      >
        {products.map((item) => (
          <AdminProductCard
            key={item.id}
            item={item}
            isDeleting={isDeleting}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </Box>
    </Card>
  );
};

export default AdminProductTable;
