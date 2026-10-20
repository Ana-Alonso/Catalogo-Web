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

export const validateProductForm = (
  input: ProductFormValidationInput
): string | null => {
  if (!input.title.trim() || !input.description.trim()) {
    return 'Por favor completa el título y la descripción de la obra.';
  }

  if (!input.isEditing && !input.imageFile && !input.externalImageUrl.trim()) {
    return 'Por favor sube una imagen para el producto o introduce una URL.';
  }

  const priceCents = input.priceOnRequest ? null : parsePriceToCents(input.price);

  if (!input.priceOnRequest && input.price.trim() && priceCents == null) {
    return 'El precio introducido no es válido.';
  }

  if (!input.discountPercent.trim()) {
    return null;
  }

  const discount = Number(input.discountPercent.replace(',', '.'));

  if (!Number.isInteger(discount) || discount < 1 || discount > 90) {
    return 'El descuento debe ser un número entero entre 1 % y 90 %.';
  }

  if (priceCents == null) {
    return 'Para aplicar un descuento primero debes indicar un precio.';
  }

  return null;
};
