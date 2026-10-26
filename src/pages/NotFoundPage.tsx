import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { normalizeLanguage } from '../i18n/languages';
import { SITE_NAME } from '../seo/site';
import { Box, NavLink, Typography } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  );

  useDocumentTitle(`${t('errors.notFound.title')} | ${SITE_NAME}`);

  return (
    <Box
      as="main"
      minHeight="screen"
      background="neutral"
      tone="bright"
      display="flex"
      align="center"
      justify="center"
      paddingX="md"
    >
      <Box maxWidth="xl" textAlign="center">
        <Typography as="p" variant="plain" tone="primary" size="display" weight="bold">
          404
        </Typography>
        <Typography
          as="h1"
          variant="plain"
          marginTop="md"
          size="3xl"
          weight="bold"
          tracking="wide"
          transform="uppercase"
        >
          {t('errors.notFound.title')}
        </Typography>
        <Typography variant="body" size="base" tone="muted" marginTop="md">
          {t('errors.notFound.description')}
        </Typography>
        <Box marginTop="xl">
          <NavLink to={`/${language}`} variant="cta">
            {t('errors.notFound.backHome')}
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
