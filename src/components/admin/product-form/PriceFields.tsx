import React from 'react';
import { Box, Input } from '../../ui';
import { theme } from '../../../theme';
import {
  formatPrice,
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
          label="Precio estimado en € (opcional)"
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={priceOnRequest ? '' : price}
          disabled={priceOnRequest}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder="25,00"
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
            Precio a consultar
          </label>
        </Box>
      </Box>

      <Box>
        <Input
          id="prod-discount"
          label="Descuento % (opcional)"
          type="number"
          min={1}
          max={90}
          step={1}
          value={discountPercent}
          disabled={priceOnRequest}
          onChange={(event) => onDiscountChange(event.target.value)}
          placeholder="20"
        />
        <p className={`mt-2 text-xs ${theme.colors.textMuted}`}>
          Se aplica solo a productos locales. Entre 1 % y 90 %.
        </p>
      </Box>

      <Box className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
        <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Vista previa
        </span>
        {finalCents == null ? (
          <p className="mt-2 text-sm text-neutral-300">Precio a consultar</p>
        ) : (
          <Box className="mt-2 space-y-1">
            <p className="text-lg font-bold text-orange-400">
              {formatPrice(finalCents, 'EUR')}
            </p>
            {hasValidDiscount && priceCents != null && (
              <p className="text-xs text-neutral-400">
                antes{' '}
                <s className="text-neutral-500">{formatPrice(priceCents, 'EUR')}</s>{' '}
                · -{parsedDiscount}%
              </p>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PriceFields;
