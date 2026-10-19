import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { logError } from '../utils/logger';
import type { CatalogItem, ProductFormData } from '../types/catalog';

interface UseProductsResult {
  products: CatalogItem[];
  isLoading: boolean;
  error: string | null;
  addProduct: (data: ProductFormData) => Promise<boolean>;
  editProduct: (id: string, data: ProductFormData) => Promise<boolean>;
  removeProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      logError('useProducts.loadProducts', err);
      const msg = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        const data = await fetchProducts();
        if (!isCancelled) {
          setProducts(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          logError('useProducts.init', err);
          const msg = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isCancelled = true;
    };
  }, []);

  const addProduct = async (data: ProductFormData): Promise<boolean> => {
    try {
      const created = await createProduct(data);
      setProducts((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      logError('useProducts.addProduct', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar el producto';
      setError(msg);
      return false;
    }
  };

  const editProduct = async (id: string, data: ProductFormData): Promise<boolean> => {
    try {
      const updated = await updateProduct(id, data);
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (err) {
      logError('useProducts.editProduct', err);
      const msg = err instanceof Error ? err.message : 'Error al actualizar el producto';
      setError(msg);
      return false;
    }
  };

  const removeProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      logError('useProducts.removeProduct', err);
      const msg = err instanceof Error ? err.message : 'Error al eliminar el producto';
      setError(msg);
      return false;
    }
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    editProduct,
    removeProduct,
    refreshProducts: loadProducts,
  };
};
