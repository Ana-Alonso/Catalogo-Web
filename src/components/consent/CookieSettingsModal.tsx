import React, { useState, type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { LegalLink } from '../legal/LegalLink';
import { Badge, Box, Button, Checkbox, Typography } from '../ui';
import { Modal } from '../ui/Modal';

interface CookiePreferencesProps {
  initialAnalytics: boolean;
  onSave: (analytics: boolean) => void;
}

const CookiePreferences: React.FC<CookiePreferencesProps> = ({ initialAnalytics, onSave }) => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(initialAnalytics);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSave(analytics);
  };

  return (
    <Box as="form" display="flex" direction="column" gap="md" onSubmit={handleSubmit}>
      <Box display="flex" direction="column" gap="xs">
        <Box display="flex" align="center" gap="sm">
          <Typography as="span" variant="body" size="sm" weight="semibold">
            {t('cookie.requiredTitle')}
          </Typography>
          <Badge variant="neutral" fit>
            {t('cookie.alwaysActive')}
          </Badge>
        </Box>
        <Typography variant="body" size="xs" tone="muted">
          {t('cookie.requiredDescription')}
        </Typography>
      </Box>

      <Box display="flex" direction="column" gap="xs" divider="top" paddingTop="md">
        <Checkbox
          id="cookie-analytics-preference"
          checked={analytics}
          onChange={setAnalytics}
          label={t('cookie.analyticsLabel')}
        />
        <Typography variant="body" size="xs" tone="muted">
          {t('cookie.analyticsDescription')}
        </Typography>
      </Box>

      <Box display="flex" align="center" gap="md" wrap>
        <LegalLink kind="cookies">{t('cookie.policyLink')}</LegalLink>
        <LegalLink kind="privacy">{t('cookie.privacyLink')}</LegalLink>
      </Box>

      <Button type="submit" variant="primary" fullWidth>
        {t('cookie.save')}
      </Button>
    </Box>
  );
};

export const CookieSettingsModal: React.FC = () => {
  const { t } = useTranslation();
  const { isSettingsOpen, closeSettings, analyticsEnabled, savePreferences } = useCookieConsent();

  return (
    <Modal isOpen={isSettingsOpen} onClose={closeSettings} title={t('cookie.settingsTitle')}>
      <CookiePreferences initialAnalytics={analyticsEnabled} onSave={savePreferences} />
    </Modal>
  );
};

export default CookieSettingsModal;
