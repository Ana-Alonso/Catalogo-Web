import { parsePriceToCents } from './price';

export interface ProductFormValidationInput {
  isEditing: boolean;
  title: string;
  description: string;
  price: string;
  priceOnRequest: boolean;
  discountPercent: string;
  imageFile: File | null;
  externalImageUrl: string;
}

export type ProductFormValidationError =
  | 'titleDescription'
  | 'image'
  | 'price'
  | 'discountRange'
  | 'discountRequiresPrice';

export const validateProductForm = (
  input: ProductFormValidationInput
): ProductFormValidationError | null => {
  if (!input.title.trim() || !input.description.trim()) {
    return 'titleDescription';
  }

  if (!input.isEditing && !input.imageFile && !input.externalImageUrl.trim()) {
    return 'image';
  }

  const priceCents = input.priceOnRequest ? null : parsePriceToCents(input.price);

  if (!input.priceOnRequest && input.price.trim() && priceCents == null) {
    return 'price';
  }

  if (!input.discountPercent.trim()) {
    return null;
  }

  const discount = Number(input.discountPercent.replace(',', '.'));

  if (!Number.isInteger(discount) || discount < 1 || discount > 90) {
    return 'discountRange';
  }

  if (priceCents == null) {
    return 'discountRequiresPrice';
  }

  return null;
};
