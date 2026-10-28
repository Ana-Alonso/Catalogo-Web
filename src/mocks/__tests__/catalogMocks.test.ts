import { describe, expect, it } from 'vitest';
import { mockCatalogItems } from '../catalogMocks';
import { isEtsyOffer, isOfferActive } from '../../utils/price';
import type { CategoryType } from '../../types/catalog';

const categories: Exclude<CategoryType, 'todas'>[] = [
  'personalizados',
  'camisetas',
  'ilustraciones',
  'talleres',
];

describe('mocks de ofertas', () => {
  it('tiene ids únicos', () => {
    const ids = mockCatalogItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ofrece al menos una oferta activa en cada categoría', () => {
    categories.forEach((category) => {
      const offers = mockCatalogItems.filter(
        (item) => item.category === category && item.isVisible && isOfferActive(item)
      );
      expect(offers.length, `sin ofertas en ${category}`).toBeGreaterThan(0);
    });
  });

  it('cubre los dos tipos de oferta: descuento local y marcado de Etsy', () => {
    expect(
      mockCatalogItems.some((item) => item.source === 'etsy' && isEtsyOffer(item))
    ).toBe(true);
    expect(
      mockCatalogItems.some(
        (item) => item.source !== 'etsy' && isOfferActive(item)
      )
    ).toBe(true);
  });
});
