import { MOCK_STORAGE_KEYS } from '../mocks/mockStorage';
import { mockCatalogItems } from '../mocks/catalogMocks';
import { createLocalStore } from './localStore';
import { hasMarketingConsentRegistrations } from './registrationService';
import type { CatalogItem, EtsyProductMetadata } from '../types/catalog';

const localProducts = createLocalStore<CatalogItem>(MOCK_STORAGE_KEYS.products);

export const fetchLocalProducts = async (): Promise<CatalogItem[]> => {
  const stored = localProducts.read();
  return stored.length > 0 ? stored : mockCatalogItems;
};

export const createLocalProduct = async (
  newProduct: CatalogItem
): Promise<CatalogItem> => {
  localProducts.write([newProduct, ...localProducts.read()]);
  return newProduct;
};

export const updateLocalProduct = async (
  id: string,
  image: string,
  updates: Record<string, unknown>,
  storedUpdates: Record<string, unknown>
): Promise<CatalogItem> => {
  const updatedLocals = localProducts.read().map((item) =>
    item.id === id
      ? { ...item, ...storedUpdates, image: image || item.image }
      : item
  );

  localProducts.write(updatedLocals);

  const found = updatedLocals.find((item) => item.id === id);
  if (!found) {
    return { ...updates, image, id } as unknown as CatalogItem;
  }
  return found;
};

export const setLocalVisibility = async (
  id: string,
  isVisible: boolean
): Promise<CatalogItem> => {
  let updatedProduct: CatalogItem | null = null;

  const updatedProducts = localProducts.read().map((item) => {
    if (item.id !== id) {
      return item;
    }
    updatedProduct = { ...item, isVisible };
    return updatedProduct;
  });

  localProducts.write(updatedProducts);

  if (!updatedProduct) {
    throw new Error('Producto no encontrado.');
  }

  return updatedProduct;
};

export const setLocalWorkshopCancelled = async (
  id: string,
  isCancelled: boolean
): Promise<CatalogItem> => {
  let updatedProduct: CatalogItem | null = null;

  const updatedProducts = localProducts.read().map((item) => {
    if (item.id !== id) {
      return item;
    }
    updatedProduct = { ...item, workshopCancelled: isCancelled };
    return updatedProduct;
  });

  localProducts.write(updatedProducts);

  if (!updatedProduct) {
    throw new Error('Producto no encontrado.');
  }

  return updatedProduct;
};

export const deleteLocalProduct = async (id: string): Promise<void> => {
  if (hasMarketingConsentRegistrations(id)) {
    throw new Error('marketing_consent_protected');
  }

  localProducts.write(localProducts.read().filter((item) => item.id !== id));
};

export const updateLocalEtsyMetadata = async (
  id: string,
  metadata: EtsyProductMetadata
): Promise<CatalogItem> => {
  let updatedProduct: CatalogItem | null = null;

  const updatedLocals = localProducts.read().map((item) => {
    if (item.id !== id) {
      return item;
    }
    updatedProduct = {
      ...item,
      category: metadata.category,
      etsyOnSale: metadata.etsyOnSale,
    };
    return updatedProduct;
  });

  localProducts.write(updatedLocals);

  if (!updatedProduct) {
    throw new Error('Producto no encontrado.');
  }

  return updatedProduct;
};

export const setAllLocalEtsyOffers = async (onSale: boolean): Promise<number> => {
  const updatedProducts = localProducts
    .read()
    .map((item) => (item.source === 'etsy' ? { ...item, etsyOnSale: onSale } : item));

  localProducts.write(updatedProducts);

  return updatedProducts.filter(
    (item) => item.source === 'etsy' && item.etsyOnSale === onSale
  ).length;
};
