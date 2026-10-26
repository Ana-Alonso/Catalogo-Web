import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Trash2, Users, ClipboardList } from 'lucide-react';
import { Badge, Box, Button, Card, ErrorState, Icon, Typography } from '../ui';
import { AdminRegistrationsSkeleton } from './AdminRegistrationsSkeleton';
import { getIntlLocale } from '../../i18n/languages';
import { registrationStatusTranslationKeys } from '../../i18n/labels';
import type { CatalogItem } from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';

interface AdminRegistrationsPanelProps {
  workshops: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const statusBadgeVariant: Record<RegistrationStatus, 'primary' | 'neutral' | 'outline'> = {
  pendiente: 'neutral',
  confirmado: 'primary',
  cancelado: 'outline',
};

const formatRegistrationDate = (value: string, language: string): string => {
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(getIntlLocale(language), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const AdminRegistrationsPanel: React.FC<AdminRegistrationsPanelProps> = ({
  workshops,
  registrations,
  isLoading,
  error,
  onRetry,
  onSetStatus,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const workshopsWithRegistrations = workshops
    .filter((workshop) => workshop.category === 'talleres')
    .map((workshop) => ({
      workshop,
      list: registrations
        .filter((registration) => registration.product_id === workshop.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }));

  return (
    <Card>
      <Box padding="lg" divider="bottom" display="flex" align="center" gap="tight">
        <Icon as={ClipboardList} size="lg" tone="accent" />
        <Box>
          <Typography variant="h3">
            {t('admin.registrations.title', { count: registrations.length })}
          </Typography>
          <Typography variant="body">
            {t('admin.registrations.subtitle')}
          </Typography>
        </Box>
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

        {!isLoading && !error && workshopsWithRegistrations.length === 0 && (
          <Box paddingY="xs" textAlign="center">
            <Typography variant="body">
              {t('admin.registrations.emptyWorkshops')}
            </Typography>
          </Box>
        )}

        {!isLoading && !error &&
          workshopsWithRegistrations.map(({ workshop, list }) => {
            const activeCount = list.filter(
              (registration) => registration.status !== 'cancelado'
            ).length;
            const cupo = workshop.cupo ?? null;

            return (
              <Box key={workshop.id}>
                <Box display="flex" wrap align="center" justify="between" gap="tight" marginBottom="md">
                  <Typography
                    as="h4"
                    variant="body"
                    size="sm"
                    tone="main"
                    weight="bold"
                    transform="uppercase"
                    tracking="wider"
                  >
                    {workshop.title}
                  </Typography>
                  <Badge variant={cupo !== null && activeCount >= cupo ? 'outline' : 'primary'}>
                    <Icon as={Users} size="xs" marginRight="xs" />
                    {cupo !== null
                      ? t('admin.registrations.spots', {
                          active: activeCount,
                          cupo,
                        })
                      : activeCount === 1
                        ? t('admin.registrations.attendee', { count: activeCount })
                        : t('admin.registrations.attendees', { count: activeCount })}
                  </Badge>
                </Box>

                <Box rounded="lg" border divide="neutral">
                  {list.length === 0 && (
                    <Box padding="md">
                      <Typography variant="body">{t('admin.registrations.empty')}</Typography>
                    </Box>
                  )}

                  {list.map((registration) => (
                    <Box
                      key={registration.id}
                      padding="md"
                      display="flex"
                      wrap
                      align="center"
                      justify="between"
                      gap="tight"
                    >
                      <Box>
                        <Typography variant="body" size="sm" tone="main" weight="semibold" display="block">
                          {registration.name}
                        </Typography>
                        <Typography variant="body" size="xs">
                          {registration.email}
                        </Typography>
                      </Box>

                      <Box display="flex" wrap align="center" gap="sm">
                        <Typography variant="body" size="xs" tone="subtle">
                          {formatRegistrationDate(registration.created_at, language)}
                        </Typography>
                        <Badge variant={statusBadgeVariant[registration.status]}>
                          {t(registrationStatusTranslationKeys[registration.status])}
                        </Badge>
                        {registration.status !== 'confirmado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void onSetStatus(registration.id, 'confirmado')}
                            aria-label={t('admin.registrations.confirmAria', {
                              name: registration.name,
                            })}
                          >
                            <Icon as={Check} tone="success" />
                          </Button>
                        )}
                        {registration.status !== 'cancelado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void onSetStatus(registration.id, 'cancelado')}
                            aria-label={t('admin.registrations.cancelAria', {
                              name: registration.name,
                            })}
                          >
                            <Icon as={X} tone="warning" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                t('admin.registrations.deleteConfirm', {
                                  name: registration.name,
                                })
                              )
                            ) {
                              void onDelete(registration.id);
                            }
                          }}
                          aria-label={t('admin.registrations.deleteAria', {
                            name: registration.name,
                          })}
                        >
                          <Icon as={Trash2} tone="danger" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Card>
  );
};

export default AdminRegistrationsPanel;
