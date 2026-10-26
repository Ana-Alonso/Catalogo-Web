import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Select, Textarea } from '../../../ui';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../../../i18n/labels';
import type {
  AvailabilityStatus,
  CategoryType,
} from '../../../../types/catalog';

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
      <Box display="grid" columns={1} columnsMd={2} gap="lg">
        <Input
          id="prod-title"
          label={t('admin.productFields.titleLabel')}
          required
          maxLength={120}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('admin.productFields.titlePlaceholder')}
        />

        <Select
          id="prod-category"
          label={t('admin.productFields.categoryLabel')}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as FormCategory)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(categoryTranslationKeys[option])}
            </option>
          ))}
        </Select>
      </Box>

      <Select
        id="prod-status"
        label={t('admin.productFields.statusLabel')}
        value={status}
        onChange={(event) => onStatusChange(event.target.value as AvailabilityStatus)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(availabilityTranslationKeys[option])}
          </option>
        ))}
      </Select>

      <Textarea
        id="prod-desc"
        label={t('admin.productFields.descriptionLabel')}
        rows={3}
        required
        maxLength={2000}
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder={t('admin.productFields.descriptionPlaceholder')}
      />

      {showLinks && (
        <Box display="grid" columns={1} columnsMd={2} gap="lg">
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
