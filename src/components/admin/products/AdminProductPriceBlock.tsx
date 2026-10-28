import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '../../ui';
import { formatPriceForLanguage } from '../../../i18n/formatters';
import {
  getDiscountedCents,
  getOfferPercent,
  isEtsyOffer,
} from '../../../utils/price';
import type { CatalogItem } from '../../../types/catalog';

interface AdminProductPriceBlockProps {
  item: CatalogItem;
}

export const AdminProductPriceBlock: React.FC<AdminProductPriceBlockProps> = ({
  item,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const currency = item.currency || 'EUR';
  const offerPercent = getOfferPercent(item);
  const isOnSale = isEtsyOffer(item);
  const displayCents =
    offerPercent != null && item.priceCents != null
      ? getDiscountedCents(item.priceCents, offerPercent)
      : item.priceCents;

  if (displayCents == null) {
    return <>{t('admin.productTable.consult')}</>;
  }

  return (
    <Box display="flex" direction="column" gap="xs">
      <Typography>
        {formatPriceForLanguage(displayCents, currency, language)}
      </Typography>
      {offerPercent != null && item.priceCents != null && (
        <Typography as="span" size="xs" tone="subtle">
          <Typography as="span" size="xs" tone="subtle" strike>
            {formatPriceForLanguage(item.priceCents, currency, language)}
          </Typography>
          <Typography as="span" size="xs" tone="warning" marginLeft="sm">
            -{offerPercent}%
          </Typography>
          <Typography as="span" size="xs" tone="subtle" marginLeft="sm">
            {t('admin.productTable.offerManual')}
          </Typography>
        </Typography>
      )}
      {isOnSale && (
        <Typography as="span" size="xs" tone="warning">
          {t('admin.productTable.offerFromEtsy')}
        </Typography>
      )}
    </Box>
  );
};

export default AdminProductPriceBlock;
