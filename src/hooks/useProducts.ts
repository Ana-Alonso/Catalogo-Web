import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateEtsyProductMetadata,
  setAllEtsyOffers,
  setProductVisibility,
  setWorkshopCancelled,
} from '../services/productService';
import { logError } from '../utils/logger';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../types/catalog';

interface UseProductsResult {
  products: CatalogItem[];
  isLoading: boolean;
  error: string | null;
  addProduct: (data: ProductFormData) => Promise<boolean>;
  editProduct: (id: string, data: ProductFormData) => Promise<boolean>;
  editEtsyMetadata: (id: string, metadata: EtsyProductMetadata) => Promise<boolean>;
  applyEtsyOffers: (onSale: boolean) => Promise<number | null>;
  removeProduct: (id: string) => Promise<boolean>;
  setVisibility: (id: string, isVisible: boolean) => Promise<boolean>;
  cancelWorkshop: (id: string) => Promise<boolean>;
  restoreWorkshop: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsResult => {
  const { t } = useTranslation();
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
      const msg = err instanceof Error ? err.message : t('admin.errors.loadProducts');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

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
          const msg = err instanceof Error ? err.message : t('admin.errors.loadProducts');
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isCancelled = true;
    };
  }, [t]);

  const addProduct = async (data: ProductFormData): Promise<boolean> => {
    try {
      const created = await createProduct(data);
      setError(null);
      setProducts((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      logError('useProducts.addProduct', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.saveProduct');
      setError(msg);
      return false;
    }
  };

  const editProduct = async (id: string, data: ProductFormData): Promise<boolean> => {
    try {
      const updated = await updateProduct(id, data);
      setError(null);
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (err) {
      logError('useProducts.editProduct', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateProduct');
      setError(msg);
      return false;
    }
  };

  const editEtsyMetadata = async (
    id: string,
    metadata: EtsyProductMetadata
  ): Promise<boolean> => {
    try {
      const updated = await updateEtsyProductMetadata(id, metadata);
      setError(null);
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (err) {
      logError('useProducts.editEtsyMetadata', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateProduct');
      setError(msg);
      return false;
    }
  };

  const applyEtsyOffers = async (onSale: boolean): Promise<number | null> => {
    try {
      const affected = await setAllEtsyOffers(onSale);
      await loadProducts();
      return affected;
    } catch (err) {
      logError('useProducts.applyEtsyOffers', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateProduct');
      setError(msg);
      return null;
    }
  };

  const removeProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteProduct(id);
      setError(null);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      logError('useProducts.removeProduct', err);
      const isProtected =
        err instanceof Error &&
        err.message.includes('marketing_consent_protected');
      const msg = isProtected
        ? t('admin.errors.deleteProductProtected')
        : err instanceof Error
          ? err.message
          : t('admin.errors.deleteProduct');
      setError(msg);
      return false;
    }
  };

  const setVisibility = async (id: string, isVisible: boolean): Promise<boolean> => {
    try {
      const updated = await setProductVisibility(id, isVisible);
      setError(null);
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (err) {
      logError('useProducts.setVisibility', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateProduct');
      setError(msg);
      return false;
    }
  };

  const setWorkshopCancelledState = async (
    id: string,
    isCancelled: boolean
  ): Promise<boolean> => {
    try {
      const updated = await setWorkshopCancelled(id, isCancelled);
      setError(null);
      setProducts((prev) =>
        prev.map((item) => (String(item.id) === id ? updated : item))
      );
      return true;
    } catch (err) {
      logError('useProducts.setWorkshopCancelled', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateWorkshop');
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
    editEtsyMetadata,
    applyEtsyOffers,
    removeProduct,
    setVisibility,
    cancelWorkshop: (id: string) => setWorkshopCancelledState(id, true),
    restoreWorkshop: (id: string) => setWorkshopCancelledState(id, false),
    refreshProducts: loadProducts,
  };
};
