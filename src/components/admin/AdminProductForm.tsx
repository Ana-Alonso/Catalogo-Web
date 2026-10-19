import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Upload, Plus, Check, X, AlertCircle } from 'lucide-react';
import { Button, Input, Card, Box } from '../ui';
import { theme } from '../../theme';
import type { CategoryType, CatalogItem, ProductFormData, AvailabilityStatus } from '../../types/catalog';

interface AdminProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<boolean>;
  isSubmitting: boolean;
  editingProduct?: CatalogItem | null;
  onCancelEdit?: () => void;
}

const CATEGORY_OPTIONS: { label: string; value: Exclude<CategoryType, 'todas'> }[] = [
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

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  onSubmit,
  isSubmitting,
  editingProduct,
  onCancelEdit
}) => {
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [category, setCategory] = useState<Exclude<CategoryType, 'todas'>>(
    editingProduct && editingProduct.category !== 'todas'
      ? editingProduct.category
      : 'ilustraciones'
  );
  const [price, setPrice] = useState(editingProduct?.price || '');
  const [etsyLink, setEtsyLink] = useState(editingProduct?.etsyLink || '');
  const [vintedLink, setVintedLink] = useState(editingProduct?.vintedLink || '');
  const [status, setStatus] = useState<AvailabilityStatus>(editingProduct?.status || 'disponible');
  const [featured, setFeatured] = useState<boolean>(editingProduct?.featured || false);
  const [eventDate, setEventDate] = useState<string>(editingProduct?.eventDate || '');
  const [eventLocation, setEventLocation] = useState<string>(editingProduct?.eventLocation || '');
  const [cupo, setCupo] = useState<string>(
    editingProduct?.cupo != null ? String(editingProduct.cupo) : ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(editingProduct?.image || '');
  const [externalImageUrl, setExternalImageUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExternalImageUrl('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim()) {
      setFormError('Por favor completa el título y la descripción de la obra.');
      return;
    }

    if (!editingProduct && !imageFile && !externalImageUrl.trim()) {
      setFormError('Por favor sube una imagen para el producto o introduce una URL.');
      return;
    }

    const success = await onSubmit({
      title,
      description,
      category,
      price,
      etsyLink: etsyLink.trim() || undefined,
      vintedLink: vintedLink.trim() || undefined,
      status,
      featured,
      eventDate: category === 'talleres' ? eventDate : undefined,
      eventLocation: category === 'talleres' ? eventLocation : undefined,
      cupo: category === 'talleres' ? cupo : '',
      imageFile,
      imageUrl: externalImageUrl.trim() || (editingProduct ? editingProduct.image : undefined)
    });

    if (success && !editingProduct) {
      setTitle('');
      setDescription('');
      setPrice('');
      setEtsyLink('');
      setVintedLink('');
      setStatus('disponible');
      setFeatured(false);
      setEventDate('');
      setEventLocation('');
      setCupo('');
      setImageFile(null);
      setPreviewUrl('');
      setExternalImageUrl('');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <Box className={`flex items-center justify-between border-b ${theme.colors.border} pb-4`}>
        <Box>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            {editingProduct ? 'Modificar Producto' : 'Añadir Nuevo Producto'}
          </h3>
          <p className={`${theme.colors.textMuted} text-sm`}>
            {editingProduct
              ? `Editando los datos de "${editingProduct.title}"`
              : 'Sube nuevas obras, camisetas o talleres al catálogo.'}
          </p>
        </Box>
        {editingProduct && onCancelEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancelEdit}
          >
            <X className="w-3.5 h-3.5" />
            Cancelar Edición
          </Button>
        )}
      </Box>

      {formError && (
        <Box className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </Box>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="prod-title"
            label="Título de la Obra *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del producto"
          />

          <Box>
            <label htmlFor="prod-category" className={theme.inputs.label}>
              Categoría *
            </label>
            <select
              id="prod-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Exclude<CategoryType, 'todas'>)}
              className={theme.inputs.base}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
              className={theme.inputs.base}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Box>

          <Box className="flex items-center gap-3 pt-6">
            <input
              id="prod-featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-neutral-950 border-neutral-800 rounded focus:ring-orange-600"
            />
            <label htmlFor="prod-featured" className="text-xs uppercase font-semibold text-neutral-300 cursor-pointer">
              Destacar en la parte superior del catálogo
            </label>
          </Box>
        </Box>

        {category === 'talleres' && (
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
            <Box>
              <label htmlFor="prod-event-date" className={theme.inputs.label}>
                Fecha y Hora del Taller
              </label>
              <input
                id="prod-event-date"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={theme.inputs.base}
              />
            </Box>
            <Input
              id="prod-event-loc"
              label="Lugar o Modalidad"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Ej: Presencial (Madrid) u Online"
            />
            <Box>
              <label htmlFor="prod-cupo" className={theme.inputs.label}>
                Cupo (opcional)
              </label>
              <input
                id="prod-cupo"
                type="number"
                min={1}
                step={1}
                value={cupo}
                onChange={(e) => setCupo(e.target.value)}
                className={theme.inputs.base}
                placeholder="Sin límite"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Deja vacío para inscripciones sin límite.
              </p>
            </Box>
          </Box>
        )}

        <Box>
          <label htmlFor="prod-desc" className={theme.inputs.label}>
            Descripción *
          </label>
          <textarea
            id="prod-desc"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción, materiales, dimensiones..."
            className={theme.inputs.base}
          />
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            id="prod-price"
            label="Precio estimado (opcional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
          />

          <Input
            id="prod-etsy"
            label="Enlace de Etsy (opcional)"
            type="url"
            value={etsyLink}
            onChange={(e) => setEtsyLink(e.target.value)}
            placeholder="https://..."
          />

          <Input
            id="prod-vinted"
            label="Enlace de Vinted (opcional)"
            type="url"
            value={vintedLink}
            onChange={(e) => setVintedLink(e.target.value)}
            placeholder="https://..."
          />
        </Box>

        <Box className="space-y-4">
          <label className={theme.inputs.label}>
            Imagen del Producto {editingProduct ? '(opcional si conservas la actual)' : '*'}
          </label>
          
          <Box className="flex flex-col sm:flex-row items-center gap-6">
            <label className="w-full sm:w-auto flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-orange-600 rounded-lg transition-colors bg-neutral-950/60">
              <Upload className="w-8 h-8 text-neutral-500 mb-2 group-hover:text-orange-600" />
              <span className="text-sm text-neutral-300 font-medium">Subir archivo desde el dispositivo</span>
              <span className="text-xs text-neutral-500 mt-1">PNG, JPG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {(previewUrl || externalImageUrl) && (
              <Box className="w-28 h-28 relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0">
                <img src={previewUrl || externalImageUrl} alt="Vista previa" className="w-full h-full object-cover" />
              </Box>
            )}
          </Box>

          <Box>
            <span className="text-xs text-neutral-500 block mb-1">O introduce una URL de imagen:</span>
            <input
              type="url"
              value={externalImageUrl}
              onChange={(e) => {
                setExternalImageUrl(e.target.value);
                setImageFile(null);
              }}
              placeholder="https://..."
              className={theme.inputs.base}
            />
          </Box>
        </Box>

        <Box className={`pt-4 border-t ${theme.colors.border} flex justify-end gap-3`}>
          {editingProduct && onCancelEdit && (
            <Button
              variant="outline"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {editingProduct ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isSubmitting
              ? 'Guardando...'
              : editingProduct
              ? 'Guardar Modificación'
              : 'Publicar Producto'}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default AdminProductForm;
