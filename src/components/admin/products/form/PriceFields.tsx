import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Checkbox, Typography } from '../../../ui';
import { formatPriceForLanguage } from '../../../../i18n/formatters';
import {
  getDiscountedCents,
  parsePriceToCents,
} from '../../../../utils/price';

interface PriceFieldsProps {
  price: string;
  priceOnRequest: boolean;
  discountPercent: string;
  onPriceChange: (value: string) => void;
  onPriceOnRequestChange: (value: boolean) => void;
  onDiscountChange: (value: string) => void;
}

export const PriceFields: React.FC<PriceFieldsProps> = ({
  price,
  priceOnRequest,
  discountPercent,
  onPriceChange,
  onPriceOnRequestChange,
  onDiscountChange,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const priceCents = priceOnRequest ? null : parsePriceToCents(price);
  const parsedDiscount = Number(discountPercent.replace(',', '.'));
  const hasValidDiscount =
    Number.isInteger(parsedDiscount) &&
    parsedDiscount >= 1 &&
    parsedDiscount <= 90 &&
    priceCents != null;
  const finalCents = hasValidDiscount
    ? getDiscountedCents(priceCents, parsedDiscount)
    : priceCents;

  return (
    <Box display="grid" columns={1} columnsMd={3} gap="lg">
      <Box>
        <Input
          id="prod-price"
          label={t('admin.priceFields.priceLabel')}
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={priceOnRequest ? '' : price}
          disabled={priceOnRequest}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder={t('admin.priceFields.pricePlaceholder')}
        />
        <Box marginTop="tight">
          <Checkbox
            id="prod-price-on-request"
            checked={priceOnRequest}
            onChange={onPriceOnRequestChange}
            label={t('admin.priceFields.onRequest')}
          />
        </Box>
      </Box>

      <Box>
        <Input
          id="prod-discount"
          label={t('admin.priceFields.discountLabel')}
          type="number"
          min={1}
          max={90}
          step={1}
          value={discountPercent}
          disabled={priceOnRequest}
          onChange={(event) => onDiscountChange(event.target.value)}
          placeholder={t('admin.priceFields.discountPlaceholder')}
        />
        <Typography variant="caption" tone="muted" marginTop="sm">
          {t('admin.priceFields.discountHint')}
        </Typography>
      </Box>

      <Box rounded="lg" border background="subtle" padding="md">
        <Typography variant="caption" tone="muted" display="block">
          {t('admin.priceFields.preview')}
        </Typography>
        {finalCents == null ? (
          <Typography variant="body" tone="main" marginTop="sm">
            {t('admin.priceFields.onRequest')}
          </Typography>
        ) : (
          <Box marginTop="sm" display="flex" direction="column" gap="xs">
            <Typography variant="h4" tone="warning">
              {formatPriceForLanguage(finalCents, 'EUR', language)}
            </Typography>
            {hasValidDiscount && priceCents != null && (
              <Typography variant="caption" tone="muted">
                {t('admin.priceFields.before')}{' '}
                <Typography as="span" size="xs" tone="subtle" strike>
                  {formatPriceForLanguage(priceCents, 'EUR', language)}
                </Typography>{' '}
                · -{parsedDiscount}%
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PriceFields;
