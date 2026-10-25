import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Typography } from '../../ui';
import { theme } from '../../../theme';
import { formatPriceForLanguage } from '../../../i18n/formatters';
import {
  getDiscountedCents,
  parsePriceToCents,
} from '../../../utils/price';

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
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <Box className="mt-3 flex items-center gap-2">
          <input
            id="prod-price-on-request"
            type="checkbox"
            checked={priceOnRequest}
            onChange={(event) => onPriceOnRequestChange(event.target.checked)}
            className="w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
          />
          <label
            htmlFor="prod-price-on-request"
            className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer"
          >
            {t('admin.priceFields.onRequest')}
          </label>
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
        <Typography variant="caption" className={`mt-2 ${theme.colors.textMuted}`}>
          {t('admin.priceFields.discountHint')}
        </Typography>
      </Box>

      <Box className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
        <Typography as="span" variant="caption" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {t('admin.priceFields.preview')}
        </Typography>
        {finalCents == null ? (
          <Typography variant="body" className="mt-2 text-sm text-neutral-300">{t('admin.priceFields.onRequest')}</Typography>
        ) : (
          <Box className="mt-2 space-y-1">
            <Typography variant="body" className="text-lg font-bold text-orange-400">
              {formatPriceForLanguage(finalCents, 'EUR', language)}
            </Typography>
            {hasValidDiscount && priceCents != null && (
              <Typography variant="caption" className="text-xs text-neutral-400">
                {t('admin.priceFields.before')}{' '}
                <s className="text-neutral-500">
                  {formatPriceForLanguage(priceCents, 'EUR', language)}
                </s>{' '}
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
