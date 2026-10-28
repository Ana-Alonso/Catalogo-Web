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
});
