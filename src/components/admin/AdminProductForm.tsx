import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Box, Icon, Typography } from '../ui';
import {
  validateImageFile,
  type ImageValidationError,
} from '../../utils/imageValidation';
import { resolvePurchaseLinks } from '../../utils/productLinks';
import {
  validateProductForm,
  type ProductFormValidationError,
} from '../../utils/productFormValidation';
import { ImageField } from './product-form/ImageField';
import { PriceFields } from './product-form/PriceFields';
import { ProductDetailsFields } from './product-form/ProductDetailsFields';
import { WorkshopFields } from './product-form/WorkshopFields';
import { ProductFormHeader } from './ProductFormHeader';
import { ProductFormActions } from './ProductFormActions';
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

const validationErrorKeys = {
  titleDescription: 'validation.titleDescription',
  image: 'validation.image',
  price: 'validation.price',
  discountRange: 'validation.discountRange',
  discountRequiresPrice: 'validation.discountRequiresPrice',
} as const satisfies Record<ProductFormValidationError, string>;

const imageValidationKeys = {
  format: 'admin.productForm.imageFormatError',
  size: 'admin.productForm.imageSizeError',
} as const satisfies Record<ImageValidationError, string>;

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  onSubmit,
  isSubmitting,
  editingProduct,
  onCancelEdit,
}) => {
  const { t } = useTranslation();
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
      setFormError(t(imageValidationKeys[validationError]));
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
      setFormError(t(validationErrorKeys[validationError]));
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
      <ProductFormHeader
        isEditing={Boolean(editingProduct)}
        productTitle={editingProduct?.title}
        onCancelEdit={onCancelEdit}
      />

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
        <ProductDetailsFields
          title={title}
          description={description}
          category={category}
          status={status}
          etsyLink={etsyLink}
          vintedLink={vintedLink}
          showLinks={category !== 'talleres'}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
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

        <ProductFormActions
          isEditing={Boolean(editingProduct)}
          isSubmitting={isSubmitting}
          onCancelEdit={onCancelEdit}
        />
      </Box>
    </Box>
  );
};

export default AdminProductForm;
