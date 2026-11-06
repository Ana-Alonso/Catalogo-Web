import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentHeader from '../components/layout/ContentHeader';
import Footer from '../components/layout/Footer';
import { LegalContentView } from '../components/legal/LegalContentView';
import { getLegalDocument } from '../data/legal/documents';
import type { LegalDocumentKind } from '../data/legal/paths';
import { normalizeLanguage } from '../i18n/languages';
import { Box } from '../components/ui';

interface LegalPageProps {
  kind: LegalDocumentKind;
}

export const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const { i18n } = useTranslation();
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
      <ContentHeader />

      <LegalContentView content={getLegalDocument(language, kind)} language={language} />

      <Footer />
    </Box>
  );
};

export default LegalPage;
