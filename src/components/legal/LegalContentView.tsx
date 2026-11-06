import React from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '../../i18n/languages';
import type { LegalBlock, LegalDocument, LegalSection } from '../../data/legal/types';
import { ContentBlockView } from '../content/ContentBlockView';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '../ui';

const LegalBlockView: React.FC<{ block: LegalBlock }> = ({ block }) => {
  if (block.kind !== 'table') {
    return <ContentBlockView block={block} />;
  }

  return (
    <Box overflow="xAuto">
      <Table fullWidth>
        <caption className="sr-only">{block.table.caption}</caption>
        <TableHead>
          <TableRow head>
            {block.table.columns.map((column) => (
              <TableHeader key={column}>{column}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {block.table.rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell) => (
                <TableCell key={cell}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

const LegalSectionView: React.FC<{ section: LegalSection }> = ({ section }) => (
  <Box as="section" display="flex" direction="column" gap="sm" marginTop="xl">
    <Typography as="h2" variant="h3">
      {section.title}
    </Typography>
    {section.blocks.map((block, index) => (
      <LegalBlockView key={`${section.id}-${index}`} block={block} />
    ))}
  </Box>
);

export const LegalContentView: React.FC<{ content: LegalDocument; language: string }> = ({
  content,
  language,
}) => {
  const { t } = useTranslation();

  const updatedLabel = new Intl.DateTimeFormat(getIntlLocale(language), {
    dateStyle: 'long',
  }).format(new Date(content.updatedAt));

  return (
    <Container size="sm" as="main">
      <Box as="article" display="flex" direction="column" gap="sm" paddingY="lg">
        <Typography variant="h1" size="3xl">
          {content.title}
        </Typography>
        <Typography variant="body" size="xs" tone="subtle">
          {t('legal.updatedAt', { date: updatedLabel })}
        </Typography>
        <Typography variant="body" size="sm" marginTop="sm">
          {content.intro}
        </Typography>

        {content.sections.map((section) => (
          <LegalSectionView key={section.id} section={section} />
        ))}
      </Box>
    </Container>
  );
};

export default LegalContentView;
