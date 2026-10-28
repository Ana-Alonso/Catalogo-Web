import { useState, useEffect, useCallback, useRef } from 'react';
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
  const requestIdRef = useRef(0);
  const mutationCountRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const loadProducts = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const mutationsAtStart = mutationCountRef.current;
    try {
      const data = await fetchProducts();
      if (requestId === requestIdRef.current) {
        if (mutationCountRef.current === mutationsAtStart) {
          setProducts(data);
          setError(null);
        }
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        if (mutationCountRef.current === mutationsAtStart) {
          logError('useProducts.loadProducts', err);
          const msg = err instanceof Error ? err.message : t('admin.errors.loadProducts');
          setError(msg);
        }
        setIsLoading(false);
        hasLoadedRef.current = false;
      }
    }
  }, [t]);

  const recoverAfterMutation = useCallback(async () => {
    if (hasLoadedRef.current) {
      setError(null);
      return;
    }

    await loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const init = async () => {
      await loadProducts();
    };

    void init();
  }, [loadProducts]);

  const addProduct = async (data: ProductFormData): Promise<boolean> => {
    try {
      const created = await createProduct(data);
      mutationCountRef.current += 1;
      setProducts((prev) => [created, ...prev]);
      await recoverAfterMutation();
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
      mutationCountRef.current += 1;
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      await recoverAfterMutation();
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
      mutationCountRef.current += 1;
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      await recoverAfterMutation();
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
      mutationCountRef.current += 1;
      setProducts((prev) => prev.filter((item) => item.id !== id));
      await recoverAfterMutation();
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
      mutationCountRef.current += 1;
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      await recoverAfterMutation();
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
      mutationCountRef.current += 1;
      setProducts((prev) =>
        prev.map((item) => (String(item.id) === id ? updated : item))
      );
      await recoverAfterMutation();
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
