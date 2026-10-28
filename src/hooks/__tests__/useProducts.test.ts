import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import {
  fetchProducts,
  createProduct,
  updateProduct,
} from '../../services/productService';
import type { CatalogItem, ProductFormData } from '../../types/catalog';

vi.mock('../../services/productService', () => ({
  fetchProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  updateEtsyProductMetadata: vi.fn(),
  setAllEtsyOffers: vi.fn(),
  setProductVisibility: vi.fn(),
  setWorkshopCancelled: vi.fn(),
}));

const producto: CatalogItem = {
  id: '1',
  title: 'Ilustración en acuarela',
  description: 'Pintura de un paisaje',
  image: '/img/obra.jpg',
  category: 'ilustraciones',
  source: 'etsy',
  priceCents: 10000,
  currency: 'EUR',
  etsyLink: 'https://www.etsy.com/listing/1',
  isVisible: true,
  status: 'disponible',
};

const formData: ProductFormData = {
  title: 'Ilustración en acuarela',
  description: 'Pintura de un paisaje',
  category: 'ilustraciones',
  price: '100',
  status: 'disponible',
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockResolvedValue([producto]);
    vi.mocked(createProduct).mockResolvedValue(producto);
    vi.mocked(updateProduct).mockResolvedValue(producto);
  });

  it('limpia el error tras una acción correcta', async () => {
    vi.mocked(updateProduct).mockRejectedValueOnce(new Error('guardado rechazado'));

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const edited = await act(async () => result.current.editProduct('1', formData));
    expect(edited).toBe(false);
    expect(result.current.error).toBe('guardado rechazado');

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('recarga el catalogo tras una accion correcta cuando la carga inicial fallo', async () => {
    vi.mocked(fetchProducts)
      .mockRejectedValueOnce(new Error('sin conexion'))
      .mockResolvedValue([producto]);

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('sin conexion');

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.products.map((item) => item.id)).toEqual(['1']);
  });

  it('mantiene el error de carga si la recarga tambien falla', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('sin conexion'));

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('sin conexion');

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);
    expect(result.current.error).toBe('sin conexion');
  });

  it('descarta un refresco en vuelo cuando hay una mutación más reciente', async () => {
    const otro: CatalogItem = { ...producto, id: '2', title: 'Otra obra' };
    let resolveStale: ((value: CatalogItem[]) => void) | null = null;

    vi.mocked(fetchProducts)
      .mockResolvedValueOnce([producto])
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveStale = resolve;
          })
      )
      .mockResolvedValueOnce([otro, producto]);
    vi.mocked(createProduct).mockResolvedValueOnce(otro);

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      void result.current.refreshProducts();
    });

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);
    expect(result.current.products.map((item) => item.id)).toEqual(['2', '1']);

    await act(async () => {
      resolveStale?.([]);
      await Promise.resolve();
    });

    expect(result.current.products.map((item) => item.id)).toEqual(['2', '1']);

    await waitFor(() => expect(fetchProducts).toHaveBeenCalledTimes(3));
    await waitFor(() => {
      expect(result.current.products.map((item) => item.id)).toEqual(['2', '1']);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('no restaura el error de un refresco obsoleto tras una mutación correcta', async () => {
    const otro: CatalogItem = { ...producto, id: '2', title: 'Otra obra' };
    let rejectStale: ((reason: unknown) => void) | null = null;

    vi.mocked(fetchProducts)
      .mockResolvedValueOnce([producto])
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectStale = reject;
          })
      )
      .mockResolvedValueOnce([otro, producto]);
    vi.mocked(createProduct).mockResolvedValueOnce(otro);

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      void result.current.refreshProducts();
    });

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      rejectStale?.(new Error('sin conexion'));
      await Promise.resolve();
    });

    expect(result.current.error).toBeNull();

    await waitFor(() => expect(fetchProducts).toHaveBeenCalledTimes(3));
    await waitFor(() => {
      expect(result.current.products.map((item) => item.id)).toEqual(['2', '1']);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('libera la carga cuando la respuesta inicial llega tarde tras una mutación', async () => {
    const otro: CatalogItem = { ...producto, id: '2', title: 'Otra obra' };
    let resolveInitial: ((value: CatalogItem[]) => void) | null = null;

    vi.mocked(fetchProducts)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveInitial = resolve;
          })
      )
      .mockResolvedValueOnce([otro, producto]);
    vi.mocked(createProduct).mockResolvedValueOnce(otro);

    const { result } = renderHook(() => useProducts());
    expect(result.current.isLoading).toBe(true);

    const added = await act(async () => result.current.addProduct(formData));
    expect(added).toBe(true);

    await act(async () => {
      resolveInitial?.([producto]);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.products.map((item) => item.id)).toEqual(['2', '1']);
    });
  });
});
