import React, { useState, type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { useToast } from '../../hooks/useToast';
import { LegalLink } from '../legal/LegalLink';
import { Box, Button, Checkbox, Typography } from '../ui';
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
  const { success } = useToast();

  const handleSave = (analytics: boolean): void => {
    savePreferences(analytics);
    closeSettings();
    success(t('cookie.saved'));
  };

  return (
    <Modal isOpen={isSettingsOpen} onClose={closeSettings} title={t('cookie.settingsTitle')}>
      <CookiePreferences initialAnalytics={analyticsEnabled} onSave={handleSave} />
    </Modal>
  );
};

export default CookieSettingsModal;
