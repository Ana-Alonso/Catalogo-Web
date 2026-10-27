import React, { type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LegalLink } from '../legal/LegalLink';
import { Box, Checkbox, Typography } from '../ui';

interface WorkshopConsentFieldsProps {
  privacyConsent: boolean;
  marketingConsent: boolean;
  hasPrivacyError: boolean;
  onPrivacyConsentChange: (checked: boolean) => void;
  onMarketingConsentChange: (checked: boolean) => void;
}

const SentenceLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Box as="span" className="normal-case font-medium tracking-normal leading-relaxed">
    {children}
  </Box>
);

export const WorkshopConsentFields: React.FC<WorkshopConsentFieldsProps> = ({
  privacyConsent,
  marketingConsent,
  hasPrivacyError,
  onPrivacyConsentChange,
  onMarketingConsentChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      direction="column"
      gap="sm"
      padding="tight"
      rounded="lg"
      border
      background="subtle"
      divider="top"
      paddingTop="md"
    >
      <Checkbox
        id="signup-privacy-consent"
        checked={privacyConsent}
        onChange={onPrivacyConsentChange}
        label={
          <SentenceLabel>
            <Trans
              i18nKey="workshop.form.privacyLabel"
              components={{ privacy: <LegalLink kind="privacy" /> }}
            />
          </SentenceLabel>
        }
      />

      {hasPrivacyError && (
        <Typography as="span" variant="body" size="xs" tone="danger" role="alert">
          {t('workshop.form.errors.privacyRequired')}
        </Typography>
      )}

      <Checkbox
        id="signup-marketing-consent"
        checked={marketingConsent}
        onChange={onMarketingConsentChange}
        label={<SentenceLabel>{t('workshop.form.marketingLabel')}</SentenceLabel>}
      />

      <Typography as="span" variant="body" size="xs" tone="muted">
        {t('workshop.form.consentNote')}
      </Typography>
    </Box>
  );
};

export default WorkshopConsentFields;
