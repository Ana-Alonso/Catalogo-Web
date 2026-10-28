import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, Box, ErrorState, Icon, Typography, Table, TableHead, TableBody, TableRow, TableHeader } from '../../ui';
import { AdminProductCard } from './AdminProductCard';
import { AdminProductTableRow } from './AdminProductTableRow';
import { AdminProductTableSkeleton } from './AdminProductTableSkeleton';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductTableProps {
  products: CatalogItem[];
  blockedDeletionIds: Set<string>;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  onSetVisibility: (id: string, isVisible: boolean) => void;
  isDeleting: boolean;
  isUpdatingVisibility: boolean;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
}

const PAGE_SIZE = 10;

export const AdminProductTable: React.FC<AdminProductTableProps> = ({
  products,
  blockedDeletionIds,
  onDelete,
  onEdit,
  onSetVisibility,
  isDeleting,
  isUpdatingVisibility,
  isLoading,
  error,
  onRetry,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

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
            {pagedProducts.map((item) => (
              <AdminProductTableRow
                key={item.id}
                item={item}
                isDeleting={isDeleting}
                isUpdatingVisibility={isUpdatingVisibility}
                isDeleteBlocked={blockedDeletionIds.has(String(item.id))}
                onDelete={onDelete}
                onEdit={onEdit}
                onSetVisibility={onSetVisibility}
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
        {pagedProducts.map((item) => (
          <AdminProductCard
            key={item.id}
            item={item}
            isDeleting={isDeleting}
            isUpdatingVisibility={isUpdatingVisibility}
            isDeleteBlocked={blockedDeletionIds.has(String(item.id))}
            onDelete={onDelete}
            onEdit={onEdit}
            onSetVisibility={onSetVisibility}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box
          as="nav"
          aria-label={t('admin.productTable.pagination.label')}
          display="flex"
          wrap
          align="center"
          justify="between"
          gap="tight"
          padding="md"
          divider="top"
        >
          <Typography size="xs" tone="subtle">
            {t('admin.productTable.pagination.summary', {
              page: currentPage,
              pages: totalPages,
            })}
          </Typography>
          <Box display="flex" align="center" gap="xs">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <Icon as={ChevronLeft} size="sm" />
              {t('admin.productTable.pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              {t('admin.productTable.pagination.next')}
              <Icon as={ChevronRight} size="sm" />
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default AdminProductTable;
