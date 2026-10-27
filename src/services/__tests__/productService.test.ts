import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CatalogItem } from '../../types/catalog';

vi.mock('../../utils/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

const STORAGE_KEY = 'laurel_custom_products_v2';

const loadService = async () => {
  vi.resetModules();
  return await import('../productService');
};

const etsyItem: CatalogItem = {
  id: 'etsy-1',
  title: 'Ilustración de polillas',
  description: 'Arte lineal en blanco y negro.',
  image: 'https://example.com/obra.jpg',
  category: 'ilustraciones',
  status: 'disponible',
  source: 'etsy',
  currency: 'EUR',
  priceCents: 495,
  etsyListingId: 4600096567,
  isVisible: true,
};

const localItem: CatalogItem = {
  ...etsyItem,
  id: 'local-1',
  source: 'local',
  etsyListingId: null,
  discountPercent: 10,
};

describe('productService · metadatos de productos Etsy', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([etsyItem, localItem]));
  });

  it('guarda la oferta de Etsy sin tocar el descuento local', async () => {
    const { updateEtsyProductMetadata, fetchProducts } = await loadService();

    const updated = await updateEtsyProductMetadata('etsy-1', {
      category: 'camisetas',
      etsyOfferPercent: 25,
    });

    expect(updated.category).toBe('camisetas');
    expect(updated.etsyOfferPercent).toBe(25);

    const stored = (await fetchProducts()).find((item) => item.id === 'local-1');
    expect(stored?.discountPercent).toBe(10);
    expect(stored?.etsyOfferPercent ?? null).toBeNull();
  });

  it('permite retirar la oferta dejando el campo en null', async () => {
    const { updateEtsyProductMetadata } = await loadService();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...etsyItem, etsyOfferPercent: 30 }])
    );

    const updated = await updateEtsyProductMetadata('etsy-1', {
      category: 'ilustraciones',
      etsyOfferPercent: null,
    });

    expect(updated.etsyOfferPercent).toBeNull();
  });

  it('rechaza asignar un producto de Etsy a la categoría de talleres', async () => {
    const { updateEtsyProductMetadata } = await loadService();

    await expect(
      updateEtsyProductMetadata('etsy-1', {
        category: 'talleres',
        etsyOfferPercent: 10,
      })
    ).rejects.toThrow();
  });
});
