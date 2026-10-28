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

describe('productService · borrado protegido por consentimiento de marketing', () => {
  const registration = {
    id: 'reg-1',
    product_id: 'local-1',
    name: 'Ana',
    email: 'ana@example.com',
    status: 'pendiente',
    privacy_consent_at: '2026-10-01T10:00:00.000Z',
    marketing_consent: false,
    created_at: '2026-10-01T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.clear();
    seed([localItem]);
  });

  it('bloquea el borrado de un producto con contactos protegidos', async () => {
    localStorage.setItem(
      'laurel_workshop_registrations',
      JSON.stringify([{ ...registration, marketing_consent: true }])
    );
    const { deleteProduct, fetchProducts } = await loadService();

    await expect(deleteProduct('local-1')).rejects.toThrow(
      'marketing_consent_protected'
    );
    const products = await fetchProducts();
    expect(products.some((item) => item.id === 'local-1')).toBe(true);
  });

  it('borra el producto cuando ningún contacto pidió avisos', async () => {
    localStorage.setItem(
      'laurel_workshop_registrations',
      JSON.stringify([registration])
    );
    const { deleteProduct, fetchProducts } = await loadService();

    await deleteProduct('local-1');

    const products = await fetchProducts();
    expect(products.some((item) => item.id === 'local-1')).toBe(false);
  });

  it('ignora las inscripciones protegidas de otros talleres', async () => {
    localStorage.setItem(
      'laurel_workshop_registrations',
      JSON.stringify([
        {
          ...registration,
          id: 'reg-2',
          product_id: 'otro-taller',
          marketing_consent: true,
        },
      ])
    );
    const { deleteProduct, fetchProducts } = await loadService();

    await deleteProduct('local-1');

    const products = await fetchProducts();
    expect(products.some((item) => item.id === 'local-1')).toBe(false);
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

describe('productService · cancelación de talleres', () => {
  const workshopItem: CatalogItem = {
    ...localItem,
    id: 'workshop-1',
    title: 'Taller de cerámica',
    category: 'talleres',
    discountPercent: null,
    etsyOnSale: false,
  };

  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    localStorage.clear();
    seed([workshopItem]);
  });

  it('marca y desmarca un taller como cancelado', async () => {
    const { setWorkshopCancelled, fetchProducts } = await loadService();

    const cancelled = await setWorkshopCancelled('workshop-1', true);
    expect(cancelled.workshopCancelled).toBe(true);
    expect((await fetchProducts())[0].workshopCancelled).toBe(true);

    const restored = await setWorkshopCancelled('workshop-1', false);
    expect(restored.workshopCancelled).toBe(false);
    expect((await fetchProducts())[0].workshopCancelled).toBe(false);
  });

  it('lanza error al cancelar un taller inexistente', async () => {
    const { setWorkshopCancelled } = await loadService();

    await expect(setWorkshopCancelled('desconocido', true)).rejects.toThrow(
      'Producto no encontrado.'
    );
  });

  it('limpia la marca de cancelado cuando el producto deja de ser taller', async () => {
    seed([{ ...workshopItem, workshopCancelled: true }]);
    const { updateProduct } = await loadService();

    const updated = await updateProduct('workshop-1', {
      title: 'Ilustración de helechos',
      description: 'Obra original',
      category: 'ilustraciones',
      status: 'disponible',
    });

    expect(updated.workshopCancelled).toBe(false);
  });

  it('mantiene la marca de cancelado al editar un taller', async () => {
    seed([{ ...workshopItem, workshopCancelled: true }]);
    const { updateProduct } = await loadService();

    const updated = await updateProduct('workshop-1', {
      title: 'Taller de cerámica avanzada',
      description: 'Nivel intermedio',
      category: 'talleres',
      status: 'disponible',
    });

    expect(updated.workshopCancelled).toBe(true);
  });
});
