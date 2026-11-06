import type { CatalogItem } from '../types/catalog';

export const isReservationCategory = (category?: string): boolean =>
  category === 'talleres' || category === 'especiales';

// «talleres» siempre gestiona reservas; «especiales» es opt-in por producto
// a través de los campos cupo o plazo. Si no se indica ni cupo ni plazo, una
// edición especial disponible sigue aceptando reservas sin límite de unidades
// y sin fecha de cierre (la base de datos ya permite cupo nulo como ilimitado).
export const usesReservationFlow = (item: CatalogItem): boolean =>
  item.category === 'talleres' ||
  (item.category === 'especiales' &&
    (item.cupo != null || Boolean(item.registrationDeadline) || item.status === 'disponible'));
