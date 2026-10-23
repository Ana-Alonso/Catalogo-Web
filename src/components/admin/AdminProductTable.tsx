import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Box, ErrorState } from '../ui';
import { AdminProductTableRow } from './AdminProductTableRow';
import { AdminProductTableSkeleton } from './AdminProductTableSkeleton';
import { theme } from '../../theme';
import type { CatalogItem } from '../../types/catalog';

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
      <div role="status" aria-label={t('admin.productTable.loading')}>
        <AdminProductTableSkeleton />
      </div>
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
      <Card className="text-center py-12">
        <p className={theme.colors.textMuted}>{t('admin.productTable.empty')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <Box className={`p-6 border-b ${theme.colors.border}`}>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          {t('admin.productTable.title', { count: products.length })}
        </h3>
        <p className={`${theme.colors.textMuted} text-sm`}>
          {t('admin.productTable.subtitle')}
        </p>
      </Box>

      <Box className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme.colors.border} bg-neutral-950/60 text-xs font-semibold uppercase tracking-wider text-neutral-400`}>
              <th className="py-4 px-6">{t('admin.productTable.columns.artwork')}</th>
              <th className="py-4 px-6">{t('admin.productTable.columns.category')}</th>
              <th className="py-4 px-6">
                {t('admin.productTable.columns.availability')}
              </th>
              <th className="py-4 px-6">{t('admin.productTable.columns.price')}</th>
              <th className="py-4 px-6">{t('admin.productTable.columns.links')}</th>
              <th className="py-4 px-6 text-right">
                {t('admin.productTable.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.colors.borderSubtle} text-sm`}>
            {products.map((item) => (
              <AdminProductTableRow
                key={item.id}
                item={item}
                isDeleting={isDeleting}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </Box>
    </Card>
  );
};

export default AdminProductTable;
