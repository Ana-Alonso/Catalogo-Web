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
  category?: string;
  eventDate?: string;
  registrationDeadline?: string;
}

export type ProductFormValidationError =
  | 'titleDescription'
  | 'image'
  | 'price'
  | 'discountRange'
  | 'discountRequiresPrice'
  | 'registrationDeadlineAfterEvent';

export const normalizeOfferPercent = (value: string): number | null => {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const percent = Number(trimmed.replace(',', '.'));

  if (!Number.isInteger(percent) || percent < 1 || percent > 90) {
    return null;
  }

  return percent;
};

export const validateOfferPercent = (
  value: string,
  priceCents: number | null
): ProductFormValidationError | null => {
  if (!value.trim()) {
    return null;
  }

  if (normalizeOfferPercent(value) == null) {
    return 'discountRange';
  }

  if (priceCents == null) {
    return 'discountRequiresPrice';
  }

  return null;
};

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

  if (input.category === 'talleres' && input.registrationDeadline && input.eventDate) {
    const deadlineTime = new Date(input.registrationDeadline).getTime();
    const eventTime = new Date(input.eventDate).getTime();
    if (!Number.isNaN(deadlineTime) && !Number.isNaN(eventTime) && deadlineTime > eventTime) {
      return 'registrationDeadlineAfterEvent';
    }
  }

  return validateOfferPercent(input.discountPercent, priceCents);
};
