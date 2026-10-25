import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card, Box } from '../ui';
import { Typography } from '../ui';
import { theme } from '../../theme';
import { formatPriceForLanguage } from '../../i18n/formatters';
import { categoryTranslationKeys } from '../../i18n/labels';
import type {
  CategoryType,
  CatalogItem,
  EtsyProductMetadata,
} from '../../types/catalog';

interface AdminEtsyProductFormProps {
  product: CatalogItem;
  onSubmit: (metadata: EtsyProductMetadata) => Promise<boolean>;
  isSubmitting: boolean;
  onCancelEdit: () => void;
}

const CATEGORY_OPTIONS: Exclude<CategoryType, 'todas'>[] = [
  'ilustraciones',
  'camisetas',
  'personalizados',
];

export const AdminEtsyProductForm: React.FC<AdminEtsyProductFormProps> = ({
  product,
  onSubmit,
  isSubmitting,
  onCancelEdit,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [category, setCategory] = useState<Exclude<CategoryType, 'todas'>>(
    product.category !== 'todas' && product.category !== 'talleres'
      ? product.category
      : 'ilustraciones'
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const success = await onSubmit({ category });
    if (!success) {
      setFormError(t('admin.etsyForm.saveError'));
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <Box className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${theme.colors.border} pb-4`}>
        <Box>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            {t('admin.etsyForm.title')}
          </h3>
          <Typography variant="body" className={`${theme.colors.textMuted} text-sm`}>
            {t('admin.etsyForm.subtitle')}
          </Typography>
        </Box>
        <Button variant="secondary" size="sm" onClick={onCancelEdit}>
          <X className="w-3.5 h-3.5" />
          {t('admin.etsyForm.close')}
        </Button>
      </Box>

      <Box className="flex flex-col sm:flex-row gap-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full sm:w-40 h-40 rounded-lg object-cover bg-neutral-800 border border-neutral-800"
        />
        <Box className="space-y-2">
          <Typography variant="body" className="text-lg font-bold text-white">{product.title}</Typography>
          <Typography variant="body" className={`${theme.colors.textMuted} text-sm line-clamp-3`}>
            {product.description}
          </Typography>
          <Typography variant="body" className="text-sm text-neutral-300">
            {product.priceCents != null
              ? formatPriceForLanguage(
                  product.priceCents,
                  product.currency || 'EUR',
                  language
                )
              : t('admin.etsyForm.priceOnRequest')}
          </Typography>
          <Box className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {t('admin.etsyForm.listing', {
                id: product.etsyListingId ?? '—',
              })}
            </span>
            {product.etsyState && (
              <span>
                {t('admin.etsyForm.status', { state: product.etsyState })}
              </span>
            )}
            {product.isVisible === false && (
              <span className="text-red-400">{t('admin.etsyForm.hidden')}</span>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400">
        {t('admin.etsyForm.offersNote')}
      </Box>

      {formError && (
        <Box className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </Box>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box>
            <label htmlFor="etsy-category" className={theme.inputs.label}>
              {t('admin.etsyForm.categoryLabel')}
            </label>
            <select
              id="etsy-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Exclude<CategoryType, 'todas'>)
              }
              className={theme.inputs.base}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t(categoryTranslationKeys[option])}
                </option>
              ))}
            </select>
          </Box>


        </Box>

        <Box className={`pt-4 border-t ${theme.colors.border} flex justify-end gap-3`}>
          <Button variant="outline" onClick={onCancelEdit}>
            {t('admin.etsyForm.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <Check className="w-4 h-4" />
            {isSubmitting
              ? t('admin.etsyForm.saving')
              : t('admin.etsyForm.saveChanges')}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default AdminEtsyProductForm;
