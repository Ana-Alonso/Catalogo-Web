import { parsePriceToCents } from './price';
import { toUtcDeadline } from './deadlineTime';
import type { ProductFormData } from '../types/catalog';

const parseCupo = (value?: string): number | null => {
  if (!value || !value.trim()) {
    return null;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export interface WorkshopFields {
  eventDate?: string;
  eventLocation?: string;
  cupo: number | null;
  registrationDeadline: string | null;
}

export const resolveWorkshopFields = (formData: ProductFormData): WorkshopFields => ({
  eventDate: formData.eventDate?.trim() || undefined,
  eventLocation: formData.eventLocation?.trim() || undefined,
  cupo: parseCupo(formData.cupo),
  registrationDeadline: toUtcDeadline(formData.registrationDeadline) ?? null,
});

export const resolveWorkshopPayload = (
  formData: ProductFormData
): Record<string, unknown> => {
  if (formData.category !== 'talleres') {
    return {};
  }

  const fields = resolveWorkshopFields(formData);

  return {
    eventDate: fields.eventDate ?? null,
    eventLocation: fields.eventLocation ?? null,
    cupo: fields.cupo,
    registrationDeadline: fields.registrationDeadline,
  };
};

export const resolveCancelledReset = (
  formData: ProductFormData
): Record<string, unknown> =>
  formData.category === 'talleres' ? {} : { workshopCancelled: false };

export interface LocalPriceFields {
  priceCents: number | null;
  currency: string;
  discountPercent: number | null;
}

export const resolvePriceFields = (formData: ProductFormData): LocalPriceFields => {
  const priceCents = parsePriceToCents(formData.price);

  if (formData.price?.trim() && priceCents == null) {
    throw new Error('El precio introducido no es válido.');
  }

  if (!formData.discountPercent?.trim()) {
    return { priceCents, currency: 'EUR', discountPercent: null };
  }

  const discountPercent = Number(formData.discountPercent.replace(',', '.'));

  if (
    !Number.isInteger(discountPercent) ||
    discountPercent < 1 ||
    discountPercent > 90
  ) {
    throw new Error('El descuento debe ser un número entero entre 1 y 90.');
  }

  if (priceCents == null) {
    throw new Error('Para aplicar un descuento primero debes indicar un precio.');
  }

  return { priceCents, currency: 'EUR', discountPercent };
};
