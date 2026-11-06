import { describe, expect, it } from 'vitest';
import type { CatalogItem } from '../../types/catalog';
import { isReservationCategory, usesReservationFlow } from '../reservableProduct';

const item = (overrides: Partial<CatalogItem>): CatalogItem => ({
  id: 'p-1',
  title: 'Producto',
  description: 'Descripción',
  image: '/p.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  ...overrides,
});

describe('isReservationCategory', () => {
  it('incluye talleres y especiales', () => {
    expect(isReservationCategory('talleres')).toBe(true);
    expect(isReservationCategory('especiales')).toBe(true);
  });

  it('excluye el resto de categorías', () => {
    for (const category of ['todas', 'personalizados', 'textiles', 'ilustraciones']) {
      expect(isReservationCategory(category)).toBe(false);
    }
  });
});

describe('usesReservationFlow', () => {
  it('activa el flujo en talleres aunque no tenga campos de reserva', () => {
    expect(usesReservationFlow(item({ category: 'talleres' }))).toBe(true);
  });

  it('activa el flujo en especiales por cupo o plazo', () => {
    expect(usesReservationFlow(item({ category: 'especiales', cupo: 8 }))).toBe(true);
    expect(
      usesReservationFlow(
        item({ category: 'especiales', registrationDeadline: '2026-12-01T00:00:00.000Z' })
      )
    ).toBe(true);
  });

  it('la fecha ya no activa el flujo en especiales', () => {
    expect(
      usesReservationFlow(
        item({
          category: 'especiales',
          eventDate: '2026-12-01T00:00:00.000Z',
          status: 'reservado',
        })
      )
    ).toBe(false);
  });

  it('activa el flujo en especiales disponibles aunque no tengan cupo ni plazo', () => {
    expect(usesReservationFlow(item({ category: 'especiales' }))).toBe(true);
  });

  it('no activa el flujo en especiales vendidos sin campos de reserva', () => {
    expect(
      usesReservationFlow(item({ category: 'especiales', status: 'vendido' }))
    ).toBe(false);
  });

  it('no activa el flujo en otras categorías aunque tengan cupo', () => {
    expect(usesReservationFlow(item({ category: 'ilustraciones', cupo: 5 }))).toBe(false);
  });
});
