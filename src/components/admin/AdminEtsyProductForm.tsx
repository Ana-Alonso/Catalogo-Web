import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Box, Button, Icon, Image, Select, Typography } from '../ui';
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
    <Box
      background="surface"
      border
      rounded="xl"
      overflow="hidden"
      padding="lg"
      paddingSm="xl"
      display="flex"
      direction="column"
      gap="lg"
    >
      <Box
        display="flex"
        stackBelow="sm"
        alignSm="center"
        justify="between"
        gap="md"
        divider="bottom"
        paddingBottom="md"
      >
        <Box>
          <Typography variant="h3">{t('admin.etsyForm.title')}</Typography>
          <Typography variant="body">{t('admin.etsyForm.subtitle')}</Typography>
        </Box>
        <Button variant="secondary" size="sm" onClick={onCancelEdit}>
          <Icon as={X} size="sm" />
          {t('admin.etsyForm.close')}
        </Button>
      </Box>

      <Box display="flex" stackBelow="sm" gap="lg">
        <Image
          src={product.image}
          alt={product.title}
          block
          widthSm={40}
          displaySm="block"
          height={40}
          rounded="lg"
          background="strong"
          border
        />
        <Box display="flex" direction="column" gap="sm">
          <Typography variant="h4">{product.title}</Typography>
          <Typography variant="body" clamp={3}>
            {product.description}
          </Typography>
          <Typography variant="body">
            {product.priceCents != null
              ? formatPriceForLanguage(
                  product.priceCents,
                  product.currency || 'EUR',
                  language
                )
              : t('admin.etsyForm.priceOnRequest')}
          </Typography>
          <Box display="flex" wrap align="center" gap="sm" tone="subtle" size="xs">
            <Typography as="span" size="xs" tone="subtle" icon>
              <Icon as={RefreshCw} size="xs" />
              {t('admin.etsyForm.listing', {
                id: product.etsyListingId ?? '—',
              })}
            </Typography>
            {product.etsyState && (
              <Typography as="span" size="xs" tone="subtle">
                {t('admin.etsyForm.status', { state: product.etsyState })}
              </Typography>
            )}
            {product.isVisible === false && (
              <Typography as="span" size="xs" tone="danger">{t('admin.etsyForm.hidden')}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box padding="md" background="neutral" border rounded="lg">
        <Typography variant="body" size="xs">{t('admin.etsyForm.offersNote')}</Typography>
      </Box>

      {formError && (
        <Box
          display="flex"
          align="center"
          gap="tight"
          padding="md"
          background="dangerSoft"
          border
          borderTone="danger"
          rounded="lg"
        >
          <Icon as={AlertCircle} size="lg" tone="dangerStrong" shrink={false} />
          <Typography variant="body" size="sm" tone="dangerSoft">{formError}</Typography>
        </Box>
      )}

      <Box as="form" display="flex" direction="column" gap="lg" onSubmit={handleSubmit}>
        <Box display="grid" columns="1" columnsMd="2" gap="lg">
          <Box>
            <Select
              id="etsy-category"
              label={t('admin.etsyForm.categoryLabel')}
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Exclude<CategoryType, 'todas'>)
              }
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t(categoryTranslationKeys[option])}
                </option>
              ))}
            </Select>
          </Box>
        </Box>

        <Box
          display="flex"
          justify="end"
          gap="tight"
          paddingTop="md"
          divider="top"
        >
          <Button variant="outline" onClick={onCancelEdit}>
            {t('admin.etsyForm.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <Icon as={Check} />
            {isSubmitting
              ? t('admin.etsyForm.saving')
              : t('admin.etsyForm.saveChanges')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminEtsyProductForm;
