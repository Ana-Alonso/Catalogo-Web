import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Footer from '../components/layout/Footer';
import { LanguageSwitcher } from '../components/i18n/LanguageSwitcher';
import { LegalContentView } from '../components/legal/LegalContentView';
import { getLegalDocument } from '../data/legal/documents';
import type { LegalDocumentKind } from '../data/legal/paths';
import { normalizeLanguage } from '../i18n/languages';
import { Box, Container, Image, NavLink, Typography } from '../components/ui';
import logoImg from '../assets/Logo.png';

interface LegalPageProps {
  kind: LegalDocumentKind;
}

export const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  return (
    <Box
      background="neutral"
      minHeight="screen"
      tone="bright"
      selection="primary"
      font="sans"
      overflow="xHidden"
    >
      <Container size="sm" padding="md" display="flex" align="center" justify="between" gap="md">
        <Box display="flex" align="center" gap="sm">
          <NavLink to={`/${language}`} aria-label={t('nav.logoAlt')}>
            <Image src={logoImg} alt={t('nav.logoAlt')} height={11} width="auto" fit="contain" />
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

      <LegalContentView content={getLegalDocument(language, kind)} language={language} />

      <Footer />
    </Box>
  );
};

export default LegalPage;
