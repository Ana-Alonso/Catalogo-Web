import React, { useState, type FormEvent } from 'react';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card, Box } from '../ui';
import { theme } from '../../theme';
import { formatPrice } from '../../utils/price';
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

const CATEGORY_OPTIONS: { label: string; value: Exclude<CategoryType, 'todas'> }[] = [
  { label: 'Ilustraciones', value: 'ilustraciones' },
  { label: 'Camisetas', value: 'camisetas' },
  { label: 'Talleres', value: 'talleres' },
  { label: 'Personalizados', value: 'personalizados' },
];

export const AdminEtsyProductForm: React.FC<AdminEtsyProductFormProps> = ({
  product,
  onSubmit,
  isSubmitting,
  onCancelEdit,
}) => {
  const [category, setCategory] = useState<Exclude<CategoryType, 'todas'>>(
    product.category !== 'todas' ? product.category : 'ilustraciones'
  );
  const [featured, setFeatured] = useState(product.featured);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const success = await onSubmit({ category, featured });
    if (!success) {
      setFormError('No se pudieron guardar los cambios. Inténtalo de nuevo.');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <Box className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${theme.colors.border} pb-4`}>
        <Box>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            Producto de Etsy
          </h3>
          <p className={`${theme.colors.textMuted} text-sm`}>
            Título, descripción, imagen, precio y estado se sincronizan desde Etsy.
          </p>
        </Box>
        <Button variant="secondary" size="sm" onClick={onCancelEdit}>
          <X className="w-3.5 h-3.5" />
          Cerrar
        </Button>
      </Box>

      <Box className="flex flex-col sm:flex-row gap-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full sm:w-40 h-40 rounded-lg object-cover bg-neutral-800 border border-neutral-800"
        />
        <Box className="space-y-2">
          <p className="text-lg font-bold text-white">{product.title}</p>
          <p className={`${theme.colors.textMuted} text-sm line-clamp-3`}>
            {product.description}
          </p>
          <p className="text-sm text-neutral-300">
            {product.priceCents != null
              ? formatPrice(product.priceCents, product.currency || 'EUR')
              : 'Precio a consultar'}
          </p>
          <Box className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Listing #{product.etsyListingId ?? '—'}
            </span>
            {product.etsyState && <span>Estado en Etsy: {product.etsyState}</span>}
            {product.isVisible === false && (
              <span className="text-red-400">Oculto en la web</span>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400">
        Las ofertas porcentuales solo están disponibles en productos locales. Para
        cambiar el precio o retirar este producto, hazlo desde Etsy.
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
              Categoría en la web *
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
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Box>

          <Box className="flex items-center gap-3 pt-6">
            <input
              id="etsy-featured"
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
            />
            <label
              htmlFor="etsy-featured"
              className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer"
            >
              Destacar en la parte superior del catálogo
            </label>
          </Box>
        </Box>

        <Box className={`pt-4 border-t ${theme.colors.border} flex justify-end gap-3`}>
          <Button variant="outline" onClick={onCancelEdit}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <Check className="w-4 h-4" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default AdminEtsyProductForm;
