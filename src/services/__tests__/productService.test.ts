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

const seed = (items: CatalogItem[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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

const otherEtsyItem: CatalogItem = {
  ...etsyItem,
  id: 'etsy-2',
  title: 'Poster de helechos',
  etsyListingId: 4600096568,
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
    seed([etsyItem, localItem]);
  });

  it('guarda el marcado de oferta sin tocar el descuento local', async () => {
    const { updateEtsyProductMetadata, fetchProducts } = await loadService();

    const updated = await updateEtsyProductMetadata('etsy-1', {
      category: 'camisetas',
      etsyOnSale: true,
    });

    expect(updated.category).toBe('camisetas');
    expect(updated.etsyOnSale).toBe(true);

    const stored = (await fetchProducts()).find((item) => item.id === 'local-1');
    expect(stored?.discountPercent).toBe(10);
    expect(stored?.etsyOnSale ?? false).toBe(false);
  });

  it('permite retirar la oferta de un producto de Etsy', async () => {
    const { updateEtsyProductMetadata } = await loadService();

    seed([{ ...etsyItem, etsyOnSale: true }]);

    const updated = await updateEtsyProductMetadata('etsy-1', {
      category: 'ilustraciones',
      etsyOnSale: false,
    });

    expect(updated.etsyOnSale).toBe(false);
  });

  it('rechaza asignar un producto de Etsy a la categoría de talleres', async () => {
    const { updateEtsyProductMetadata } = await loadService();

    await expect(
      updateEtsyProductMetadata('etsy-1', {
        category: 'talleres',
        etsyOnSale: true,
      })
    ).rejects.toThrow();
  });
});

describe('productService · propagación de ofertas de Etsy', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.clear();
    seed([etsyItem, otherEtsyItem, localItem]);
  });

  it('marca en oferta a todos los productos de Etsy y deja intactos los locales', async () => {
    const { setAllEtsyOffers, fetchProducts } = await loadService();

    const affected = await setAllEtsyOffers(true);

    expect(affected).toBe(2);

    const products = await fetchProducts();
    expect(
      products
        .filter((item) => item.source === 'etsy')
        .every((item) => item.etsyOnSale === true)
    ).toBe(true);

    const local = products.find((item) => item.id === 'local-1');
    expect(local?.etsyOnSale ?? false).toBe(false);
    expect(local?.discountPercent).toBe(10);
  });

  it('quita el marcado de oferta a todos los productos de Etsy', async () => {
    const { setAllEtsyOffers, fetchProducts } = await loadService();

    seed([{ ...etsyItem, etsyOnSale: true }, otherEtsyItem, localItem]);

    const affected = await setAllEtsyOffers(false);

    expect(affected).toBe(2);

    const products = await fetchProducts();
    expect(
      products
        .filter((item) => item.source === 'etsy')
        .every((item) => !item.etsyOnSale)
    ).toBe(true);
  });
});
