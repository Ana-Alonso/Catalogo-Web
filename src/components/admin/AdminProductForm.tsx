import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Check, X, AlertCircle } from 'lucide-react';
import { Button, Card, Box } from '../ui';
import { theme } from '../../theme';
import { validateImageFile } from '../../utils/imageValidation';
import { resolvePurchaseLinks } from '../../utils/productLinks';
import { validateProductForm } from '../../utils/productFormValidation';
import { ImageField } from './product-form/ImageField';
import { PriceFields } from './product-form/PriceFields';
import { ProductDetailsFields } from './product-form/ProductDetailsFields';
import { WorkshopFields } from './product-form/WorkshopFields';
import type {
  AvailabilityStatus,
  CatalogItem,
  CategoryType,
  ProductFormData,
} from '../../types/catalog';

interface AdminProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<boolean>;
  isSubmitting: boolean;
  editingProduct?: CatalogItem | null;
  onCancelEdit?: () => void;
}

type FormCategory = Exclude<CategoryType, 'todas'>;

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  onSubmit,
  isSubmitting,
  editingProduct,
  onCancelEdit,
}) => {
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [category, setCategory] = useState<FormCategory>(
    editingProduct && editingProduct.category !== 'todas'
      ? editingProduct.category
      : 'ilustraciones'
  );
  const [price, setPrice] = useState(
    editingProduct?.priceCents != null
      ? (editingProduct.priceCents / 100).toFixed(2)
      : ''
  );
  const [priceOnRequest, setPriceOnRequest] = useState(
    editingProduct ? editingProduct.priceCents == null : false
  );
  const [discountPercent, setDiscountPercent] = useState(
    editingProduct?.discountPercent != null
      ? String(editingProduct.discountPercent)
      : ''
  );
  const [etsyLink, setEtsyLink] = useState(editingProduct?.etsyLink || '');
  const [vintedLink, setVintedLink] = useState(editingProduct?.vintedLink || '');
  const [status, setStatus] = useState<AvailabilityStatus>(
    editingProduct?.status || 'disponible'
  );
  const [featured, setFeatured] = useState<boolean>(editingProduct?.featured || false);
  const [eventDate, setEventDate] = useState<string>(editingProduct?.eventDate || '');
  const [eventLocation, setEventLocation] = useState<string>(
    editingProduct?.eventLocation || ''
  );
  const [cupo, setCupo] = useState<string>(
    editingProduct?.cupo != null ? String(editingProduct.cupo) : ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(editingProduct?.image || '');
  const [externalImageUrl, setExternalImageUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageFile(null);
      setPreviewUrl(editingProduct?.image || '');
      setFormError(validationError);
      event.target.value = '';
      return;
    }
    setFormError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setExternalImageUrl('');
  };

  const handlePriceOnRequestChange = (value: boolean) => {
    setPriceOnRequest(value);
    if (value) {
      setPrice('');
      setDiscountPercent('');
    }
  };

  const handleExternalUrlChange = (value: string) => {
    setExternalImageUrl(value);
    setImageFile(null);
  };

  const resetAfterCreate = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setPriceOnRequest(false);
    setDiscountPercent('');
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
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const validationError = validateProductForm({
      isEditing: Boolean(editingProduct),
      title,
      description,
      price,
      priceOnRequest,
      discountPercent,
      imageFile,
      externalImageUrl,
    });

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const purchaseLinks = resolvePurchaseLinks(category, etsyLink, vintedLink);

    const success = await onSubmit({
      title,
      description,
      category,
      price: priceOnRequest ? '' : price,
      discountPercent: priceOnRequest ? '' : discountPercent,
      ...purchaseLinks,
      status,
      featured,
      eventDate: category === 'talleres' ? eventDate : undefined,
      eventLocation: category === 'talleres' ? eventLocation : undefined,
      cupo: category === 'talleres' ? cupo : '',
      imageFile,
      imageUrl: externalImageUrl.trim() || (editingProduct ? editingProduct.image : undefined),
    });

    if (success && !editingProduct) {
      resetAfterCreate();
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
          <Button variant="secondary" size="sm" onClick={onCancelEdit}>
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
        <ProductDetailsFields
          title={title}
          description={description}
          category={category}
          status={status}
          featured={featured}
          etsyLink={etsyLink}
          vintedLink={vintedLink}
          showLinks={category !== 'talleres'}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onFeaturedChange={setFeatured}
          onEtsyLinkChange={setEtsyLink}
          onVintedLinkChange={setVintedLink}
        />

        {category === 'talleres' && (
          <WorkshopFields
            eventDate={eventDate}
            eventLocation={eventLocation}
            cupo={cupo}
            onEventDateChange={setEventDate}
            onEventLocationChange={setEventLocation}
            onCupoChange={setCupo}
          />
        )}

        <PriceFields
          price={price}
          priceOnRequest={priceOnRequest}
          discountPercent={discountPercent}
          onPriceChange={setPrice}
          onPriceOnRequestChange={handlePriceOnRequestChange}
          onDiscountChange={setDiscountPercent}
        />

        <ImageField
          previewUrl={previewUrl}
          externalImageUrl={externalImageUrl}
          isEditing={Boolean(editingProduct)}
          onFileChange={handleFileChange}
          onExternalUrlChange={handleExternalUrlChange}
        />

        <Box className={`pt-4 border-t ${theme.colors.border} flex justify-end gap-3`}>
          {editingProduct && onCancelEdit && (
            <Button variant="outline" onClick={onCancelEdit}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
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
