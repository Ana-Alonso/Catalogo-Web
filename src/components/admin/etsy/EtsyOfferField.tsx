import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Typography } from '../../ui';

interface EtsyOfferFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const EtsyOfferField: React.FC<EtsyOfferFieldProps> = ({
  value,
  error,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Input
        id="etsy-offer-percent"
        label={t('admin.etsyForm.offerLabel')}
        type="number"
        min={1}
        max={90}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('admin.etsyForm.offerPlaceholder')}
        error={error}
        aria-invalid={error ? true : undefined}
      />
      {!error && (
        <Typography variant="caption" tone="muted" marginTop="sm" display="block">
          {t('admin.etsyForm.offerHint')}
        </Typography>
      )}
    </Box>
  );
};

export default EtsyOfferField;
