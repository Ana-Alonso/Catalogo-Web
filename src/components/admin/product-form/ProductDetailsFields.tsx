import React from 'react';
import { Box, Input } from '../../ui';
import { theme } from '../../../theme';
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
  featured: boolean;
  etsyLink: string;
  vintedLink: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: FormCategory) => void;
  onStatusChange: (value: AvailabilityStatus) => void;
  onFeaturedChange: (value: boolean) => void;
  onEtsyLinkChange: (value: string) => void;
  onVintedLinkChange: (value: string) => void;
}

const CATEGORY_OPTIONS: { label: string; value: FormCategory }[] = [
  { label: 'Ilustraciones', value: 'ilustraciones' },
  { label: 'Camisetas', value: 'camisetas' },
  { label: 'Talleres', value: 'talleres' },
  { label: 'Personalizados', value: 'personalizados' },
];

const STATUS_OPTIONS: { label: string; value: AvailabilityStatus }[] = [
  { label: 'Disponible', value: 'disponible' },
  { label: 'Reservado', value: 'reservado' },
  { label: 'Vendido / Agotado', value: 'vendido' },
];

export const ProductDetailsFields: React.FC<ProductDetailsFieldsProps> = ({
  title,
  description,
  category,
  status,
  featured,
  etsyLink,
  vintedLink,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onStatusChange,
  onFeaturedChange,
  onEtsyLinkChange,
  onVintedLinkChange,
}) => {
  return (
    <>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="prod-title"
          label="Título de la Obra *"
          required
          maxLength={120}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Título del producto"
        />

        <Box>
          <label htmlFor="prod-category" className={theme.inputs.label}>
            Categoría *
          </label>
          <select
            id="prod-category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as FormCategory)}
            className={theme.inputs.base}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box>
          <label htmlFor="prod-status" className={theme.inputs.label}>
            Estado / Disponibilidad *
          </label>
          <select
            id="prod-status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value as AvailabilityStatus)}
            className={theme.inputs.base}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Box>

        <Box className="flex items-center gap-3 pt-6">
          <input
            id="prod-featured"
            type="checkbox"
            checked={featured}
            onChange={(event) => onFeaturedChange(event.target.checked)}
            className="w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
          />
          <label
            htmlFor="prod-featured"
            className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer"
          >
            Destacar en la parte superior del catálogo
          </label>
        </Box>
      </Box>

      <Box>
        <label htmlFor="prod-desc" className={theme.inputs.label}>
          Descripción *
        </label>
        <textarea
          id="prod-desc"
          rows={3}
          required
          maxLength={2000}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Descripción, materiales, dimensiones..."
          className={theme.inputs.base}
        />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="prod-etsy"
          label="Enlace de Etsy (opcional)"
          type="url"
          maxLength={300}
          value={etsyLink}
          onChange={(event) => onEtsyLinkChange(event.target.value)}
          placeholder="https://..."
        />

        <Input
          id="prod-vinted"
          label="Enlace de Vinted (opcional)"
          type="url"
          maxLength={300}
          value={vintedLink}
          onChange={(event) => onVintedLinkChange(event.target.value)}
          placeholder="https://..."
        />
      </Box>
    </>
  );
};

export default ProductDetailsFields;
