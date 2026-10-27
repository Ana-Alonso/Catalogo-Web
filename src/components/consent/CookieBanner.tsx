import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { LegalLink } from '../legal/LegalLink';
import { Animated, Box, Button, Presence, Typography } from '../ui';

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const { status, acceptAll, rejectAll, openSettings } = useCookieConsent();
  const isVisible = status === 'pending';

  return (
    <Presence>
      {isVisible && (
        <Animated
          role="region"
          aria-label={t('cookie.bannerAria')}
          position="fixed"
          edge="bottom-full"
          zIndex={40}
          paddingX="md"
          paddingBottom="md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
        >
          <Box
            background="card"
            border
            rounded="xl"
            padding="md"
            gap="sm"
            center
            maxWidth="md"
            shadow="dramatic"
            display="flex"
            direction="column"
          >
            <Typography variant="body" size="sm" weight="semibold">
              {t('cookie.title')}
            </Typography>
            <Typography variant="body" size="xs" tone="muted">
              {t('cookie.intro')}
            </Typography>
            <Box display="flex" align="center" gap="sm" wrap>
              <LegalLink kind="cookies">{t('cookie.policyLink')}</LegalLink>
              <LegalLink kind="privacy">{t('cookie.privacyLink')}</LegalLink>
            </Box>
            <Box display="flex" align="center" gap="sm" wrap marginTop="xs">
              <Button size="sm" variant="primary" onClick={acceptAll}>
                {t('cookie.accept')}
              </Button>
              <Button size="sm" variant="accent" onClick={rejectAll}>
                {t('cookie.reject')}
              </Button>
              <Button size="sm" variant="ghost" onClick={openSettings}>
                {t('cookie.configure')}
              </Button>
            </Box>
          </Box>
        </Animated>
      )}
    </Presence>
  );
};

export default CookieBanner;
