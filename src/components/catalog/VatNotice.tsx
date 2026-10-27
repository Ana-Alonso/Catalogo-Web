import React from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Box, Icon, Typography } from '../ui';

export const VatNotice: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      as="p"
      display="flex"
      align="center"
      gap="sm"
      marginBottom="lg"
      padding="md"
      rounded="lg"
      border
      background="surfaceTranslucent"
    >
      <Icon as={Info} size="sm" tone="subtle" shrink={false} />
      <Typography variant="caption" tone="muted">
        {t('catalog.vatNotice')}
      </Typography>
    </Box>
  );
};

export default VatNotice;
