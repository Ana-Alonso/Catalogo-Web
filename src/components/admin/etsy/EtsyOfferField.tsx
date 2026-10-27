import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Checkbox, Typography } from '../../ui';

interface EtsyOfferFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const EtsyOfferField: React.FC<EtsyOfferFieldProps> = ({
  checked,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      padding="md"
      rounded="lg"
      border
      background="neutral"
      display="flex"
      direction="column"
      gap="sm"
    >
      <Checkbox
        id="etsy-on-sale"
        checked={checked}
        onChange={onChange}
        label={t('admin.etsyForm.offerLabel')}
      />
      <Typography variant="caption" tone="muted">
        {t('admin.etsyForm.offerHint')}
      </Typography>
    </Box>
  );
};

export default EtsyOfferField;
