import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '../../ui';
import { formatPriceForLanguage } from '../../../i18n/formatters';
import { getDiscountedCents } from '../../../utils/price';
import type { CatalogItem } from '../../../types/catalog';

interface EtsyPricePreviewProps {
  product: CatalogItem;
  offerPercent: number | null;
}

export const EtsyPricePreview: React.FC<EtsyPricePreviewProps> = ({
  product,
  offerPercent,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const currency = product.currency || 'EUR';

  if (product.priceCents == null) {
    return (
      <Typography variant="body">{t('admin.etsyForm.priceOnRequest')}</Typography>
    );
  }

  const finalCents = getDiscountedCents(product.priceCents, offerPercent);

  return (
    <Box display="flex" align="center" gap="xs">
      {offerPercent != null && (
        <Typography as="s" variant="body" tone="muted" strike>
          {formatPriceForLanguage(product.priceCents, currency, language)}
        </Typography>
      )}
      <Typography variant="body" tone={offerPercent != null ? 'warning' : 'main'}>
        {formatPriceForLanguage(finalCents, currency, language)}
      </Typography>
      {offerPercent != null && (
        <Typography variant="body" size="xs" tone="warning">
          -{offerPercent}%
        </Typography>
      )}
    </Box>
  );
};

export default EtsyPricePreview;
