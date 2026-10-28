import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Typography } from '../../ui';
import { RegistrationRowActions } from './RegistrationRowActions';
import { registrationStatusTranslationKeys } from '../../../i18n/labels';
import { formatDateTime } from '../../../utils/dateFormat';
import type { RegistrationStatus, WorkshopRegistration } from '../../../types/registrations';

interface AdminWorkshopRegistrationsProps {
  registrations: WorkshopRegistration[];
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onWithdrawMarketingConsent: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const statusBadgeVariant: Record<
  RegistrationStatus,
  'primary' | 'neutral' | 'outline'
> = {
  pendiente: 'neutral',
  confirmado: 'primary',
  cancelado: 'outline',
};

export const AdminWorkshopRegistrations: React.FC<
  AdminWorkshopRegistrationsProps
> = ({ registrations, onSetStatus, onWithdrawMarketingConsent, onDelete }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return (
    <Box rounded="lg" border divide="neutral">
      {registrations.length === 0 && (
        <Box padding="md">
          <Typography variant="body">{t('admin.registrations.empty')}</Typography>
        </Box>
      )}

      {registrations.map((registration) => (
        <Box
          key={registration.id}
          padding="md"
          display="flex"
          wrap
          align="center"
          justify="between"
          gap="tight"
        >
          <Box minWidth="zero">
            <Typography
              variant="body"
              size="sm"
              tone="main"
              weight="semibold"
              display="block"
              clamp={1}
              title={registration.name}
            >
              {registration.name}
            </Typography>
            <Typography
              variant="body"
              size="xs"
              clamp={1}
              title={registration.email}
            >
              {registration.email}
            </Typography>
          </Box>

          <Box display="flex" wrap align="center" gap="sm">
            <Typography variant="body" size="xs" tone="subtle">
              {formatDateTime(registration.created_at, language)}
            </Typography>
            <Badge variant={statusBadgeVariant[registration.status]}>
              {t(registrationStatusTranslationKeys[registration.status])}
            </Badge>
            {registration.marketing_consent && (
              <Badge variant="outline" size="micro">
                {t('admin.registrations.marketingBadge')}
              </Badge>
            )}
            <RegistrationRowActions
              registration={registration}
              onSetStatus={onSetStatus}
              onWithdrawMarketingConsent={onWithdrawMarketingConsent}
              onDelete={onDelete}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AdminWorkshopRegistrations;
