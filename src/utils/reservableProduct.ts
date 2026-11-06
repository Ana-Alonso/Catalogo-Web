import type { CatalogItem } from '../types/catalog';

export const isReservationCategory = (category?: string): boolean =>
  category === 'talleres' || category === 'especiales';

// «talleres» siempre gestiona reservas; «especiales» es opt-in por producto
// a través de los campos cupo, plazo o fecha.
export const usesReservationFlow = (item: CatalogItem): boolean =>
  item.category === 'talleres' ||
  (item.category === 'especiales' &&
    (item.cupo != null || Boolean(item.registrationDeadline) || Boolean(item.eventDate)));
