import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Edit3, ExternalLink, Sparkles } from 'lucide-react';
import { Card, Badge, Button, Box } from '../ui';
import { theme } from '../../theme';
import { formatPriceForLanguage } from '../../i18n/formatters';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../i18n/labels';
import { getDiscountedCents, isOfferActive } from '../../utils/price';
import type { CatalogItem, AvailabilityStatus } from '../../types/catalog';

interface AdminProductTableProps {
  products: CatalogItem[];
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  isDeleting: boolean;
}

const statusBadgeVariant: Record<AvailabilityStatus, 'primary' | 'neutral' | 'outline'> = {
  disponible: 'primary',
  reservado: 'neutral',
  vendido: 'outline',
};

export const AdminProductTable: React.FC<AdminProductTableProps> = ({ 
  products, 
  onDelete, 
  onEdit,
  isDeleting 
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className={theme.colors.textMuted}>{t('admin.productTable.empty')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <Box className={`p-6 border-b ${theme.colors.border}`}>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          {t('admin.productTable.title', { count: products.length })}
        </h3>
        <p className={`${theme.colors.textMuted} text-sm`}>
          {t('admin.productTable.subtitle')}
        </p>
      </Box>

      <Box className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme.colors.border} bg-neutral-950/60 text-xs font-semibold uppercase tracking-wider text-neutral-400`}>
              <th className="py-4 px-6">{t('admin.productTable.columns.artwork')}</th>
              <th className="py-4 px-6">{t('admin.productTable.columns.category')}</th>
              <th className="py-4 px-6">
                {t('admin.productTable.columns.availability')}
              </th>
              <th className="py-4 px-6">{t('admin.productTable.columns.price')}</th>
              <th className="py-4 px-6">{t('admin.productTable.columns.links')}</th>
              <th className="py-4 px-6 text-right">
                {t('admin.productTable.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.colors.borderSubtle} text-sm`}>
            {products.map((item) => {
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
                <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <Box className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt="" 
                        className="w-12 h-12 rounded object-cover bg-neutral-800 flex-shrink-0"
                      />
                      <Box>
                        <Box className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-white">{item.title}</span>
                          {item.featured && (
                            <span title={t('admin.productTable.featuredTitle')}>
                              <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                            </span>
                          )}
                          {item.source === 'etsy' && (
                            <Badge variant="neutral">{t('admin.productTable.etsy')}</Badge>
                          )}
                          {item.isVisible === false && (
                            <Badge variant="outline">{t('admin.productTable.hidden')}</Badge>
                          )}
                        </Box>
                        <Box className={`${theme.colors.textMuted} text-xs line-clamp-1 max-w-xs`}>
                          {item.description}
                        </Box>
                      </Box>
                    </Box>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline">
                      {t(categoryTranslationKeys[item.category])}
                    </Badge>
                    {item.category === 'talleres' && (
                      <div className="mt-1.5 text-xs text-neutral-500">
                        {item.cupo != null
                          ? t('admin.productTable.capacity', { count: item.cupo })
                          : t('admin.productTable.noCapacity')}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={statusBadgeVariant[currentStatus]}>
                      {t(availabilityTranslationKeys[currentStatus])}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 font-medium text-neutral-300">
                    {displayCents != null ? (
                      <Box className="space-y-1">
                        <span>
                          {formatPriceForLanguage(displayCents, currency, language)}
                        </span>
                        {offerPercent != null && item.priceCents != null && (
                          <Box className="text-xs text-neutral-500">
                            <s>
                              {formatPriceForLanguage(
                                item.priceCents,
                                currency,
                                language
                              )}
                            </s>
                            <span className="ml-2 text-orange-400">-{offerPercent}%</span>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      t('admin.productTable.consult')
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Box className="flex items-center gap-3">
                      {item.category !== 'talleres' && item.etsyLink && (
                        <a 
                          href={item.etsyLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`text-xs ${theme.colors.primaryText} hover:underline inline-flex items-center gap-1`}
                        >
                          Etsy <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.category !== 'talleres' && item.vintedLink && (
                        <a 
                          href={item.vintedLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1"
                        >
                          Vinted <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </Box>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Box className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        aria-label={t('admin.productTable.editAria', {
                          title: item.title,
                        })}
                      >
                        <Edit3 className="w-4 h-4 text-orange-500" />
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
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Card>
  );
};

export default AdminProductTable;
