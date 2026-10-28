import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archive } from 'lucide-react';
import { Box, Button, Card, ErrorState, Icon, Typography } from '../../ui';
import { AdminProductActions } from './AdminProductActions';
import { AdminProductCategoryBadge } from './AdminProductBadges';
import { AdminProductIdentity } from './AdminProductIdentity';
import { AdminProductTableSkeleton } from './AdminProductTableSkeleton';
import { AdminWorkshopRegistrations } from '../registrations/AdminWorkshopRegistrations';
import { formatDate } from '../../../utils/dateFormat';
import { sortRegistrationsByDate } from '../../../utils/workshopSummary';
import type { CatalogItem } from '../../../types/catalog';
import type { RegistrationStatus, WorkshopRegistration } from '../../../types/registrations';

interface AdminArchivedPanelProps {
  products: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  isUpdatingVisibility: boolean;
  protectedProductIds: Set<string>;
  onRetry: () => void | Promise<void>;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  onSetVisibility: (id: string, isVisible: boolean) => void;
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onDeleteRegistration: (id: string) => Promise<boolean>;
}

export const AdminArchivedPanel: React.FC<AdminArchivedPanelProps> = ({
  products,
  registrations,
  isLoading,
  error,
  isDeleting,
  isUpdatingVisibility,
  protectedProductIds,
  onRetry,
  onDelete,
  onEdit,
  onSetVisibility,
  onSetStatus,
  onDeleteRegistration,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <Box padding="lg" divider="bottom">
        <Box display="flex" align="center" gap="tight">
          <Icon as={Archive} size="lg" tone="accent" />
          <Box>
            <Typography variant="h3">
              {t('admin.archived.title', { count: products.length })}
            </Typography>
            <Typography variant="body">
              {t('admin.archived.subtitle')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box padding="lg" display="flex" direction="column" gap="lg">
        {isLoading && (
          <Box role="status" aria-label={t('admin.productTable.loading')}>
            <AdminProductTableSkeleton />
          </Box>
        )}

        {!isLoading && error && (
          <ErrorState
            title={t('admin.archived.errorTitle')}
            description={error}
            onRetry={onRetry}
            retryLabel={t('common.retry')}
          />
        )}

        {!isLoading && !error && products.length === 0 && (
          <Box paddingY="xl" textAlign="center">
            <Typography variant="body">{t('admin.archived.empty')}</Typography>
          </Box>
        )}

        {!isLoading && !error && products.length > 0 && (
          <Box rounded="lg" border divide="neutral">
            {products.map((item) => {
              const id = String(item.id);
              const isWorkshop = item.category === 'talleres';
              const isExpanded = expandedId === id;
              const workshopRegistrations = sortRegistrationsByDate(
                registrations.filter(
                  (registration) => registration.product_id === id
                )
              );
              const createdAt = formatDate(item.created_at, language);

              return (
                <Box
                  key={id}
                  padding="lg"
                  display="flex"
                  direction="column"
                  gap="md"
                >
                  <Box
                    display="flex"
                    wrap
                    align="center"
                    justify="between"
                    gap="tight"
                  >
                    <AdminProductIdentity item={item} />

                    <Box display="flex" wrap align="center" gap="sm">
                      <AdminProductCategoryBadge item={item} />
                      <Typography size="xs" tone="subtle">
                        {t('admin.archived.createdAt', {
                          date: createdAt ?? t('admin.archived.unknownDate'),
                        })}
                      </Typography>
                      {isWorkshop && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedId((previous) =>
                              previous === id ? null : id
                            )
                          }
                          aria-expanded={isExpanded}
                          aria-label={t(
                            isExpanded
                              ? 'admin.archived.hideRegistrationsAria'
                              : 'admin.archived.viewRegistrationsAria',
                            { title: item.title }
                          )}
                        >
                          {t(
                            isExpanded
                              ? 'admin.archived.hideRegistrations'
                              : 'admin.archived.viewRegistrations'
                          )}
                        </Button>
                      )}
                      <AdminProductActions
                        item={item}
                        isDeleting={isDeleting}
                        isUpdatingVisibility={isUpdatingVisibility}
                        isDeleteBlocked={protectedProductIds.has(id)}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onSetVisibility={onSetVisibility}
                      />
                    </Box>
                  </Box>

                  {isWorkshop && isExpanded && (
                    <AdminWorkshopRegistrations
                      registrations={workshopRegistrations}
                      onSetStatus={onSetStatus}
                      onDelete={onDeleteRegistration}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        {!isLoading && !error && products.length > 0 && (
          <Typography size="xs" tone="subtle">
            {t('admin.archived.deleteHint')}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default AdminArchivedPanel;
