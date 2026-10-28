import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, X } from 'lucide-react';
import { Box, Button, Card, Icon, Typography } from '../../ui';
import { useToast } from '../../../hooks/useToast';
import { isEtsyOffer } from '../../../utils/price';
import type { CatalogItem } from '../../../types/catalog';

interface AdminEtsyOffersPanelProps {
  products: CatalogItem[];
  onApply: (onSale: boolean) => Promise<number | null>;
}

export const AdminEtsyOffersPanel: React.FC<AdminEtsyOffersPanelProps> = ({
  products,
  onApply,
}) => {
  const { t } = useTranslation();
  const { success, error: notifyError } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const etsyProducts = products.filter((item) => item.source === 'etsy');
  const onSaleCount = etsyProducts.filter(isEtsyOffer).length;

  const handleApply = async (onSale: boolean) => {
    setIsApplying(true);

    const affected = await onApply(onSale);
    setIsApplying(false);

    if (affected === null) {
      notifyError(t('admin.etsyOffers.error'));
      return;
    }

    success(
      t('admin.etsyOffers.applied', {
        affected,
        state: t(
          onSale
            ? 'admin.etsyOffers.stateOn'
            : 'admin.etsyOffers.stateOff'
        ),
      })
    );
  };

  return (
    <Card padding="lg">
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Typography variant="h4" transform="uppercase" tracking="wider">
            {t('admin.etsyOffers.title')}
          </Typography>
          <Typography variant="body">
            {t('admin.etsyOffers.description')}
          </Typography>
          <Typography variant="body" size="sm" tone="muted" marginTop="tight">
            {t('admin.etsyOffers.summary', {
              onSale: onSaleCount,
              total: etsyProducts.length,
            })}
          </Typography>
        </Box>

        <Box
          display="flex"
          stackBelow="sm"
          gap="tight"
          wrap
        >
          <Button
            variant="accent"
            onClick={() => void handleApply(true)}
            disabled={isApplying || etsyProducts.length === 0}
          >
            <Icon as={Tag} size="sm" />
            {t('admin.etsyOffers.markAll')}
          </Button>
          <Button
            variant="outline"
            onClick={() => void handleApply(false)}
            disabled={isApplying || etsyProducts.length === 0}
          >
            <Icon as={X} size="sm" />
            {t('admin.etsyOffers.clearAll')}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default AdminEtsyOffersPanel;
