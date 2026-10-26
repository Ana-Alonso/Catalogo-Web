import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Trash2, Edit3 } from 'lucide-react';
import { Badge, Box, Button, Icon, Image, TableCell, TableRow, TextLink, Typography } from '../ui';
import { formatPriceForLanguage } from '../../i18n/formatters';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../i18n/labels';
import { getDiscountedCents, isOfferActive } from '../../utils/price';
import type { CatalogItem, AvailabilityStatus } from '../../types/catalog';

interface AdminProductTableRowProps {
  item: CatalogItem;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
}

const statusBadgeVariant: Record<AvailabilityStatus, 'primary' | 'neutral' | 'outline'> = {
  disponible: 'primary',
  reservado: 'neutral',
  vendido: 'outline',
};

export const AdminProductTableRow: React.FC<AdminProductTableRowProps> = ({
  item,
  isDeleting,
  onDelete,
  onEdit,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const currentStatus = item.status || 'disponible';
  const currency = item.currency || 'EUR';
  const offerPercent =
    item.priceCents != null && item.discountPercent != null && isOfferActive(item)
      ? item.discountPercent
      : null;
  const displayCents =
    offerPercent != null && item.priceCents != null
      ? getDiscountedCents(item.priceCents, offerPercent)
      : item.priceCents;

  return (
    <TableRow hoverable>
      <TableCell>
        <Box display="flex" align="center" gap="tight">
          <Image
            src={item.image}
            alt=""
            width={12}
            height={12}
            rounded="md"
            background="strong"
            shrink={false}
          />
          <Box>
            <Box display="flex" wrap align="center" gap="xs">
              <Typography size="sm" tone="main" weight="semibold">
                {item.title}
              </Typography>
              {item.source === 'etsy' && (
                <Badge variant="neutral">{t('admin.productTable.etsy')}</Badge>
              )}
              {item.isVisible === false && (
                <Badge variant="outline">{t('admin.productTable.hidden')}</Badge>
              )}
            </Box>
            <Typography variant="body" size="xs" clamp={1} maxWidth="xs">
              {item.description}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {t(categoryTranslationKeys[item.category])}
        </Badge>
        {item.category === 'talleres' && (
          <Typography size="xs" tone="subtle" marginTop="tight">
            {item.cupo != null
              ? t('admin.productTable.capacity', { count: item.cupo })
              : t('admin.productTable.noCapacity')}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={statusBadgeVariant[currentStatus]}>
          {t(availabilityTranslationKeys[currentStatus])}
        </Badge>
      </TableCell>
      <TableCell weight="medium" tone="muted">
        {displayCents != null ? (
          <Box display="flex" direction="column" gap="xs">
            <Typography>{formatPriceForLanguage(displayCents, currency, language)}</Typography>
            {offerPercent != null && item.priceCents != null && (
              <Typography as="span" size="xs" tone="subtle">
                <Typography as="span" size="xs" tone="subtle" strike>
                  {formatPriceForLanguage(
                    item.priceCents,
                    currency,
                    language
                  )}
                </Typography>
                <Typography as="span" size="xs" tone="warning" marginLeft="sm">
                  -{offerPercent}%
                </Typography>
              </Typography>
            )}
          </Box>
        ) : (
          t('admin.productTable.consult')
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" align="center" gap="tight">
          {item.category !== 'talleres' && item.etsyLink && (
            <TextLink
              href={item.etsyLink}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              hover="underline"
            >
              Etsy <Icon as={ExternalLink} size="xs" />
            </TextLink>
          )}
          {item.category !== 'talleres' && item.vintedLink && (
            <TextLink
              href={item.vintedLink}
              target="_blank"
              rel="noopener noreferrer"
              tone="muted"
              size="xs"
              hover="bright"
            >
              Vinted <Icon as={ExternalLink} size="xs" />
            </TextLink>
          )}
        </Box>
      </TableCell>
      <TableCell align="right">
        <Box display="flex" align="center" justify="end" gap="xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            aria-label={t('admin.productTable.editAria', {
              title: item.title,
            })}
          >
            <Icon as={Edit3} tone="accent" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDeleting || item.source === 'etsy'}
            title={
              item.source === 'etsy'
                ? t('admin.productTable.etsyDeleteHint')
                : undefined
            }
            onClick={() => {
              if (
                window.confirm(
                  t('admin.productTable.deleteConfirm', {
                    title: item.title,
                  })
                )
              ) {
                onDelete(String(item.id));
              }
            }}
            aria-label={
              item.source === 'etsy'
                ? t('admin.productTable.etsyDeleteAria', {
                    title: item.title,
                  })
                : t('admin.productTable.deleteAria', {
                    title: item.title,
                  })
            }
          >
            <Icon as={Trash2} tone="danger" />
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AdminProductTableRow;
