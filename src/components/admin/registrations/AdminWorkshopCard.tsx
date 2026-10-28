import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Archive,
  Ban,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  MapPin,
  RotateCcw,
  Users,
} from 'lucide-react';
import { Badge, Box, Button, Card, Icon, Typography } from '../../ui';
import { AdminWorkshopRegistrations } from './AdminWorkshopRegistrations';
import { useConfirm } from '../../../hooks/useConfirm';
import { formatDateTime } from '../../../utils/dateFormat';
import { isWorkshopRegistrationClosed } from '../../../utils/workshopSignupState';
import {
  getActiveRegistrationCount,
  getRegistrationStats,
} from '../../../utils/workshopSummary';
import type { WorkshopFinishedReason } from '../../../utils/workshopPhase';
import type { CatalogItem } from '../../../types/catalog';
import type { RegistrationStatus, WorkshopRegistration } from '../../../types/registrations';

interface AdminWorkshopCardProps {
  workshop: CatalogItem;
  registrations: WorkshopRegistration[];
  finishedReason: WorkshopFinishedReason | null;
  isExpanded: boolean;
  canToggle: boolean;
  isUpdatingVisibility: boolean;
  nowMs: number;
  onToggle: () => void;
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

export const AdminWorkshopCard: React.FC<AdminWorkshopCardProps> = ({
  workshop,
  registrations,
  finishedReason,
  isExpanded,
  canToggle,
  isUpdatingVisibility,
  nowMs,
  onToggle,
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
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const stats = getRegistrationStats(registrations);
  const activeCount = getActiveRegistrationCount(stats);
  const cupo = workshop.cupo ?? null;
  const isDeadlineClosed = isWorkshopRegistrationClosed(
    workshop.registrationDeadline,
    nowMs
  );
  const eventDate = formatDateTime(workshop.eventDate, language);
  const deadline = formatDateTime(workshop.registrationDeadline, language);

  const capacityText =
    cupo !== null
      ? t('admin.registrations.spots', { active: activeCount, cupo })
      : t('admin.workshops.noCapacity');

  const handleCancelWorkshop = async (): Promise<void> => {
    const isConfirmed = await confirm({
      message: t('admin.workshops.cancelConfirm', { title: workshop.title }),
      confirmLabel: t('admin.workshops.cancelConfirmAction'),
      isDanger: true,
    });

    if (!isConfirmed) {
      return;
    }

    await onCancelWorkshop(workshop);
  };

  return (
    <Card padding="lg">
      <Box display="flex" direction="column" gap="md">
        <Box display="flex" wrap align="start" justify="between" gap="tight">
          <Box minWidth="zero">
            <Box display="flex" wrap align="center" gap="xs">
              <Typography
                as="h4"
                variant="h4"
                clamp={1}
                title={workshop.title}
              >
                {workshop.title}
              </Typography>
              {finishedReason && (
                <Badge variant="outline">
                  {t(`admin.workshops.finishedReasons.${finishedReason}`)}
                </Badge>
              )}
            </Box>
            <Typography size="xs" tone="subtle" marginTop="xs">
              {t('admin.workshops.registrationCount', {
                count: registrations.length,
              })}
            </Typography>
          </Box>

          <Box display="flex" wrap align="center" gap="xs">
            {canToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                aria-expanded={isExpanded}
                aria-label={t(
                  isExpanded
                    ? 'admin.workshops.collapseAria'
                    : 'admin.workshops.expandAria',
                  { title: workshop.title }
                )}
              >
                <Icon as={isExpanded ? ChevronUp : ChevronDown} size="sm" />
                {t(
                  isExpanded
                    ? 'admin.workshops.collapse'
                    : 'admin.workshops.expand'
                )}
              </Button>
            )}
            {finishedReason === null && (
              <Button
                variant="outline"
                size="sm"
                disabled={isCancellingWorkshop}
                onClick={() => void handleCancelWorkshop()}
                aria-label={t('admin.workshops.cancelWorkshopAria', {
                  title: workshop.title,
                })}
              >
                <Icon as={Ban} size="sm" tone="danger" />
                {t('admin.workshops.cancelWorkshop')}
              </Button>
            )}
            {finishedReason === 'cancelado' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isRestoringWorkshop}
                onClick={() => void onRestoreWorkshop(workshop)}
                aria-label={t('admin.workshops.restoreWorkshopAria', {
                  title: workshop.title,
                })}
              >
                <Icon as={RotateCcw} size="sm" tone="accent" />
                {t('admin.workshops.restoreWorkshop')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(workshop)}
              aria-label={t('admin.workshops.editAria', {
                title: workshop.title,
              })}
            >
              <Icon as={Edit3} tone="accent" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdatingVisibility}
              onClick={() => onSetVisibility(String(workshop.id), false)}
              aria-label={t('admin.productTable.archiveAria', {
                title: workshop.title,
              })}
            >
              <Icon as={Archive} tone="muted" />
            </Button>
          </Box>
        </Box>

        <Box display="flex" wrap gap="lg">
          <Box display="flex" align="center" gap="xs">
            <Icon as={CalendarDays} size="sm" tone="muted" />
            <Typography size="xs" tone="subtle">
              {eventDate ?? t('admin.workshops.noDate')}
            </Typography>
          </Box>
          <Box display="flex" align="center" gap="xs">
            <Icon as={MapPin} size="sm" tone="muted" />
            <Typography size="xs" tone="subtle">
              {workshop.eventLocation || t('admin.workshops.noLocation')}
            </Typography>
          </Box>
          <Box display="flex" align="center" gap="xs">
            <Icon as={Clock} size="sm" tone="muted" />
            <Typography size="xs" tone="subtle">
              {deadline
                ? t('admin.workshops.deadlineUntil', { date: deadline })
                : t('admin.workshops.noDeadline')}
            </Typography>
          </Box>
          <Box display="flex" align="center" gap="xs">
            <Icon as={Users} size="sm" tone="muted" />
            <Typography size="xs" tone="subtle">
              {capacityText}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" wrap align="center" gap="xs">
          <Badge variant="neutral">
            {t('admin.workshops.pending', { count: stats.pending })}
          </Badge>
          <Badge variant="primary">
            {t('admin.workshops.confirmed', { count: stats.confirmed })}
          </Badge>
          <Badge variant="outline">
            {t('admin.workshops.cancelled', { count: stats.cancelled })}
          </Badge>
          {stats.marketing > 0 && (
            <Badge variant="outline" size="micro">
              {t('admin.workshops.marketing', { count: stats.marketing })}
            </Badge>
          )}
          {isDeadlineClosed && (
            <Badge variant="outline" size="micro">
              {t('admin.workshops.deadlineClosed')}
            </Badge>
          )}
        </Box>

        {isExpanded && (
          <Box display="flex" direction="column" gap="md">
            <AdminWorkshopRegistrations
              registrations={registrations}
              onSetStatus={onSetStatus}
              onWithdrawMarketingConsent={onWithdrawMarketingConsent}
              onDelete={onDeleteRegistration}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AdminWorkshopCard;
