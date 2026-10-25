import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input } from '../../ui';
import { theme } from '../../../theme';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../../i18n/labels';
import type {
  AvailabilityStatus,
  CategoryType,
} from '../../../types/catalog';

type FormCategory = Exclude<CategoryType, 'todas'>;

interface ProductDetailsFieldsProps {
  title: string;
  description: string;
  category: FormCategory;
  status: AvailabilityStatus;
  etsyLink: string;
  vintedLink: string;
  showLinks: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: FormCategory) => void;
  onStatusChange: (value: AvailabilityStatus) => void;
  onEtsyLinkChange: (value: string) => void;
  onVintedLinkChange: (value: string) => void;
}

const CATEGORY_OPTIONS: FormCategory[] = [
  'ilustraciones',
  'camisetas',
  'talleres',
  'personalizados',
];

const STATUS_OPTIONS: AvailabilityStatus[] = [
  'disponible',
  'reservado',
  'vendido',
];

export const ProductDetailsFields: React.FC<ProductDetailsFieldsProps> = ({
  title,
  description,
  category,
  status,
  etsyLink,
  vintedLink,
  showLinks,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onStatusChange,
  onEtsyLinkChange,
  onVintedLinkChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="prod-title"
          label={t('admin.productFields.titleLabel')}
          required
          maxLength={120}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('admin.productFields.titlePlaceholder')}
        />

        <Box>
          <label htmlFor="prod-category" className={theme.inputs.label}>
            {t('admin.productFields.categoryLabel')}
          </label>
          <select
            id="prod-category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as FormCategory)}
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

      <Box>
        <label htmlFor="prod-status" className={theme.inputs.label}>
          {t('admin.productFields.statusLabel')}
        </label>
        <select
          id="prod-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as AvailabilityStatus)}
          className={theme.inputs.base}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(availabilityTranslationKeys[option])}
            </option>
          ))}
        </select>
      </Box>

      <Box>
        <label htmlFor="prod-desc" className={theme.inputs.label}>
          {t('admin.productFields.descriptionLabel')}
        </label>
        <textarea
          id="prod-desc"
          rows={3}
          required
          maxLength={2000}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder={t('admin.productFields.descriptionPlaceholder')}
          className={theme.inputs.base}
        />
      </Box>

      {showLinks && (
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="prod-etsy"
            label={t('admin.productFields.etsyLinkLabel')}
            type="url"
            maxLength={300}
            value={etsyLink}
            onChange={(event) => onEtsyLinkChange(event.target.value)}
            placeholder="https://..."
          />

          <Input
            id="prod-vinted"
            label={t('admin.productFields.vintedLinkLabel')}
            type="url"
            maxLength={300}
            value={vintedLink}
            onChange={(event) => onVintedLinkChange(event.target.value)}
            placeholder="https://..."
          />
        </Box>
      )}
    </>
  );
};

export default ProductDetailsFields;
