import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, ChevronDown, ClipboardList } from 'lucide-react';
import { Box, Card, ErrorState, Icon, Typography } from '../../ui';
import { AdminRegistrationsExportButton } from './AdminRegistrationsExportButton';
import { AdminRegistrationsSkeleton } from './AdminRegistrationsSkeleton';
import { AdminWorkshopCard } from './AdminWorkshopCard';
import { useNow } from '../../../hooks/useNow';
import {
  getWorkshopFinishedReason,
  groupWorkshops,
  type WorkshopFinishedReason,
} from '../../../utils/workshopPhase';
import {
  groupRegistrationsByWorkshop,
  sortRegistrationsByDate,
} from '../../../utils/workshopSummary';
import type { CatalogItem } from '../../../types/catalog';
import type { RegistrationStatus, WorkshopRegistration } from '../../../types/registrations';

interface AdminWorkshopsPanelProps {
  workshops: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  isUpdatingVisibility: boolean;
  onRetry: () => void | Promise<void>;
  onEdit: (product: CatalogItem) => void;
  onSetVisibility: (id: string, isVisible: boolean) => void;
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onWithdrawMarketingConsent: (id: string) => Promise<boolean>;
  onDeleteRegistration: (id: string) => Promise<boolean>;
  onCancelWorkshop: (workshop: CatalogItem) => Promise<void>;
  isCancellingWorkshop: boolean;
  onRestoreWorkshop: (workshop: CatalogItem) => Promise<void>;
  isRestoringWorkshop: boolean;
}

export const AdminWorkshopsPanel: React.FC<AdminWorkshopsPanelProps> = ({
  workshops,
  registrations,
  isLoading,
  error,
  isUpdatingVisibility,
  onRetry,
  onEdit,
  onSetVisibility,
  onSetStatus,
  onWithdrawMarketingConsent,
  onDeleteRegistration,
  onCancelWorkshop,
  isCancellingWorkshop,
  onRestoreWorkshop,
  isRestoringWorkshop,
}) => {
  const { t } = useTranslation();
  const nowMs = useNow();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groups = useMemo(
    () => groupWorkshops(workshops, nowMs),
    [workshops, nowMs]
  );

  const registrationsByWorkshop = useMemo(() => {
    const grouped = groupRegistrationsByWorkshop(registrations);

    return Object.fromEntries(
      Object.entries(grouped).map(([id, list]) => [
        id,
        sortRegistrationsByDate(list),
      ])
    );
  }, [registrations]);

  const renderWorkshop = (
    workshop: CatalogItem,
    finishedReason: WorkshopFinishedReason | null,
    canToggle: boolean
  ) => {
    const id = String(workshop.id);
    const isOnlyActive = groups.active.length === 1 && finishedReason === null;

    return (
      <AdminWorkshopCard
        key={id}
        workshop={workshop}
        registrations={registrationsByWorkshop[id] ?? []}
        finishedReason={finishedReason}
        isExpanded={isOnlyActive || expandedId === id}
        canToggle={canToggle}
        isUpdatingVisibility={isUpdatingVisibility}
        nowMs={nowMs}
        onToggle={() =>
          setExpandedId((previous) => (previous === id ? null : id))
        }
        onEdit={onEdit}
        onSetVisibility={onSetVisibility}
        onSetStatus={onSetStatus}
        onWithdrawMarketingConsent={onWithdrawMarketingConsent}
        onDeleteRegistration={onDeleteRegistration}
        onCancelWorkshop={onCancelWorkshop}
        isCancellingWorkshop={isCancellingWorkshop}
        onRestoreWorkshop={onRestoreWorkshop}
        isRestoringWorkshop={isRestoringWorkshop}
      />
    );
  };

  return (
    <Card>
      <Box
        padding="lg"
        divider="bottom"
        display="flex"
        wrap
        align="center"
        justify="between"
        gap="tight"
      >
        <Box display="flex" align="center" gap="tight">
          <Icon as={ClipboardList} size="lg" tone="accent" />
          <Box>
            <Typography variant="h3">
              {t('admin.workshops.title', {
                count: groups.active.length + groups.finished.length,
              })}
            </Typography>
            <Typography variant="body">
              {t('admin.workshops.subtitle')}
            </Typography>
          </Box>
        </Box>
        <AdminRegistrationsExportButton workshops={workshops} />
      </Box>

      <Box padding="lg" display="flex" direction="column" gap="xl">
        {isLoading && (
          <Box role="status" aria-label={t('admin.registrations.loading')}>
            <AdminRegistrationsSkeleton />
          </Box>
        )}

        {!isLoading && error && (
          <ErrorState
            title={t('admin.registrations.errorTitle')}
            description={error}
            onRetry={onRetry}
            retryLabel={t('common.retry')}
          />
        )}

        {!isLoading && !error && (
          <>
            <Box display="flex" direction="column" gap="md">
              <Box display="flex" wrap align="center" justify="between" gap="tight">
                <Typography as="h4" variant="h4">
                  {t('admin.workshops.activeTitle', {
                    count: groups.active.length,
                  })}
                </Typography>
                <Icon as={CalendarDays} size="sm" tone="subtle" />
              </Box>

              {groups.active.length === 0 ? (
                <Typography variant="body">
                  {t('admin.workshops.activeEmpty')}
                </Typography>
              ) : (
                <Box display="grid" columns={1} columnsMd={2} gap="md">
                  {groups.active.map((workshop) =>
                    renderWorkshop(
                      workshop,
                      getWorkshopFinishedReason(workshop, nowMs),
                      groups.active.length > 1
                    )
                  )}
                </Box>
              )}
            </Box>

            <Box as="details">
              <Box
                as="summary"
                display="flex"
                wrap
                align="center"
                justify="between"
                gap="tight"
                cursor="pointer"
              >
                <Box display="flex" wrap align="center" gap="tight">
                  <Typography as="h4" variant="h4">
                    {t('admin.workshops.finishedTitle', {
                      count: groups.finished.length,
                    })}
                  </Typography>
                  <Icon as={ChevronDown} size="sm" tone="subtle" />
                </Box>
                <Typography size="xs" tone="subtle">
                  {t('admin.workshops.finishedHint')}
                </Typography>
              </Box>

              <Box marginTop="md" display="flex" direction="column" gap="md">
                {groups.finished.length === 0 ? (
                  <Typography variant="body">
                    {t('admin.workshops.finishedEmpty')}
                  </Typography>
                ) : (
                  <Box display="grid" columns={1} columnsMd={2} gap="md">
                    {groups.finished.map((workshop) =>
                      renderWorkshop(
                        workshop,
                        getWorkshopFinishedReason(workshop, nowMs),
                        true
                      )
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
};

export default AdminWorkshopsPanel;
