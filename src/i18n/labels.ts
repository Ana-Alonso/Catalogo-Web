import type { AvailabilityStatus, CategoryType } from '../types/catalog';
import type { RegistrationStatus } from '../types/registrations';

export const categoryTranslationKeys = {
  todas: 'catalog.categories.all',
  personalizados: 'catalog.categories.custom',
  camisetas: 'catalog.categories.tshirts',
  ilustraciones: 'catalog.categories.illustrations',
  talleres: 'catalog.categories.workshops',
} as const satisfies Record<CategoryType, string>;

export const availabilityTranslationKeys = {
  disponible: 'product.status.available',
  reservado: 'product.status.reserved',
  vendido: 'product.status.sold',
} as const satisfies Record<AvailabilityStatus, string>;

export const registrationStatusTranslationKeys = {
  pendiente: 'admin.registrations.status.pending',
  confirmado: 'admin.registrations.status.confirmed',
  cancelado: 'admin.registrations.status.cancelled',
} as const satisfies Record<RegistrationStatus, string>;
