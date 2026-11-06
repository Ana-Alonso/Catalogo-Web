import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Typography } from '../../ui';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../../i18n/labels';
import { usesReservationFlow } from '../../../utils/reservableProduct';
import type { AvailabilityStatus, CatalogItem } from '../../../types/catalog';

const statusBadgeVariant: Record<
  AvailabilityStatus,
  'primary' | 'neutral' | 'outline'
> = {
  disponible: 'primary',
  reservado: 'neutral',
  vendido: 'outline',
};

export const AdminProductStatusBadge: React.FC<{ status: AvailabilityStatus }> =
  ({ status }) => {
    const { t } = useTranslation();

    return (
      <Badge variant={statusBadgeVariant[status]}>
        {t(availabilityTranslationKeys[status])}
      </Badge>
    );
  };

export const AdminProductCategoryBadge: React.FC<{ item: CatalogItem }> = ({
  item,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Badge variant="outline">{t(categoryTranslationKeys[item.category])}</Badge>
      {usesReservationFlow(item) && (
        <Typography size="xs" tone="subtle" marginTop="tight">
          {item.cupo != null
            ? t('admin.productTable.capacity', { count: item.cupo })
            : t('admin.productTable.noCapacity')}
        </Typography>
      )}
    </>
  );
};
