import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { normalizeLanguage } from '../../i18n/languages';
import { Box, Container, Image, NavLink, Typography } from '../ui';
import logoImg from '../../assets/Logo.png';

export const ContentHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  return (
    <Container size="sm" padding="md" display="flex" align="center" justify="between" gap="md">
      <Box display="flex" align="center" gap="sm">
        <NavLink to={`/${language}`} aria-label={t('nav.logoAlt')}>
          <Image src={logoImg} alt={t('nav.logoAlt')} height={11} width="auto" fit="contain" intrinsicWidth={2048} intrinsicHeight={2048} />
        </NavLink>
        <Typography variant="h4" transform="uppercase" tracking="wider">
          <Trans
            i18nKey="brand.name"
            components={{ highlight: <Typography as="span" tone="accent" /> }}
          />
        </Typography>
      </Box>
      <LanguageSwitcher />
    </Container>
  );
};

export default ContentHeader;
