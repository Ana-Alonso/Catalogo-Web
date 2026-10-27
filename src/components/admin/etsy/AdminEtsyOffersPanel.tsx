import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Tag, X } from 'lucide-react';
import { Box, Button, Card, Icon, Typography } from '../../ui';
import { isEtsyOffer } from '../../../utils/price';
import type { CatalogItem } from '../../../types/catalog';

interface AdminEtsyOffersPanelProps {
  products: CatalogItem[];
  onApply: (onSale: boolean) => Promise<number | null>;
}

interface OfferFeedback {
  type: 'success' | 'error';
  text: string;
}

export const AdminEtsyOffersPanel: React.FC<AdminEtsyOffersPanelProps> = ({
  products,
  onApply,
}) => {
  const { t } = useTranslation();
  const [isApplying, setIsApplying] = useState(false);
  const [feedback, setFeedback] = useState<OfferFeedback | null>(null);

  const etsyProducts = products.filter((item) => item.source === 'etsy');
  const onSaleCount = etsyProducts.filter(isEtsyOffer).length;

  const handleApply = async (onSale: boolean) => {
    setIsApplying(true);
    setFeedback(null);

    const affected = await onApply(onSale);
    setIsApplying(false);

    setFeedback(
      affected === null
        ? { type: 'error', text: t('admin.etsyOffers.error') }
        : {
            type: 'success',
            text: t('admin.etsyOffers.applied', {
              affected,
              state: t(
                onSale
                  ? 'admin.etsyOffers.stateOn'
                  : 'admin.etsyOffers.stateOff'
              ),
            }),
          }
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

        {feedback && (
          <Box
            padding="tight"
            rounded="lg"
            border
            display="flex"
            align="center"
            gap="sm"
            background={feedback.type === 'success' ? 'successSoft' : 'dangerSoft'}
            borderTone={feedback.type === 'success' ? 'success' : 'danger'}
          >
            {feedback.type === 'success' ? (
              <Icon as={CheckCircle} tone="success" shrink={false} />
            ) : (
              <Icon as={AlertCircle} tone="danger" shrink={false} />
            )}
            <Typography
              variant="body"
              size="sm"
              tone={feedback.type === 'success' ? 'successSoft' : 'dangerSoft'}
            >
              {feedback.text}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AdminEtsyOffersPanel;
