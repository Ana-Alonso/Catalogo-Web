import { isSupabaseConfigured, supabase } from '../utils/supabase';
import { validateImageFile } from '../utils/imageValidation';
import { resolvePurchaseLinks } from '../utils/productLinks';
import {
  resolveCancelledReset,
  resolvePriceFields,
  resolveWorkshopFields,
  resolveWorkshopPayload,
} from '../utils/productFormPayload';
import {
  createLocalProduct,
  deleteLocalProduct,
  fetchLocalProducts,
  setAllLocalEtsyOffers,
  setLocalVisibility,
  setLocalWorkshopCancelled,
  updateLocalEtsyMetadata,
  updateLocalProduct,
} from './localProductStore';
import {
  createRemoteProduct,
  deleteRemoteProduct,
  fetchRemoteProducts,
  setAllRemoteEtsyOffers,
  setRemoteVisibility,
  setRemoteWorkshopCancelled,
  uploadRemoteImage,
  updateRemoteEtsyMetadata,
  updateRemoteProduct,
} from './productSupabaseStore';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../types/catalog';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const isRemote = (): boolean =>
  !useMocks && isSupabaseConfigured && supabase !== null;

export const fetchProducts = async (): Promise<CatalogItem[]> => {
  if (!useMocks) {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    return fetchRemoteProducts();
  }

  return fetchLocalProducts();
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (isSupabaseConfigured && supabase) {
    return uploadRemoteImage(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createProduct = async (
  formData: ProductFormData
): Promise<CatalogItem> => {
  let imageUrl = formData.imageUrl || '';
  const priceFields = resolvePriceFields(formData);
  const purchaseLinks = resolvePurchaseLinks(
    formData.category,
    formData.etsyLink,
    formData.vintedLink
  );

  if (formData.imageFile) {
    imageUrl = await uploadProductImage(formData.imageFile);
  }

  const newProduct: CatalogItem = {
    id: isSupabaseConfigured ? (undefined as unknown as string) : `mock-${Date.now()}`,
    title: formData.title.trim(),
    description: formData.description.trim(),
    category: formData.category,
    image: imageUrl,
    ...purchaseLinks,
    ...priceFields,
    source: 'local',
    isVisible: true,
    status: formData.status,
    ...resolveWorkshopFields(formData),
    created_at: new Date().toISOString()
  };

  if (isRemote()) {
    return createRemoteProduct(newProduct);
  }

  return createLocalProduct(newProduct);
};

export const updateProduct = async (
  id: string,
  formData: ProductFormData
): Promise<CatalogItem> => {
  let imageUrl = formData.imageUrl || '';
  const priceFields = resolvePriceFields(formData);
  const purchaseLinks = resolvePurchaseLinks(
    formData.category,
    formData.etsyLink,
    formData.vintedLink
  );

  if (formData.imageFile) {
    imageUrl = await uploadProductImage(formData.imageFile);
  }

  const updates = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    category: formData.category,
    etsyLink: purchaseLinks.etsyLink ?? null,
    vintedLink: purchaseLinks.vintedLink ?? null,
    ...priceFields,
    status: formData.status,
  };

  if (isRemote()) {
    const payload: Record<string, unknown> = {
      ...updates,
      ...resolveWorkshopPayload(formData),
      ...resolveCancelledReset(formData),
    };

    if (imageUrl) {
      payload.image = imageUrl;
    }

    return updateRemoteProduct(id, payload);
  }

  const workshopFields = resolveWorkshopFields(formData);

  return updateLocalProduct(
    id,
    imageUrl,
    { ...updates, ...workshopFields },
    { ...updates, ...workshopFields, ...resolveCancelledReset(formData) }
  );
};

export const setProductVisibility = async (
  id: string,
  isVisible: boolean
): Promise<CatalogItem> => {
  if (isRemote()) {
    return setRemoteVisibility(id, isVisible);
  }

  return setLocalVisibility(id, isVisible);
};

export const setWorkshopCancelled = async (
  id: string,
  isCancelled: boolean
): Promise<CatalogItem> => {
  if (isRemote()) {
    return setRemoteWorkshopCancelled(id, isCancelled);
  }

  return setLocalWorkshopCancelled(id, isCancelled);
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (isRemote()) {
    return deleteRemoteProduct(id);
  }

  return deleteLocalProduct(id);
};

export const updateEtsyProductMetadata = async (
  id: string,
  metadata: EtsyProductMetadata
): Promise<CatalogItem> => {
  if (metadata.category === 'talleres') {
    throw new Error('Los talleres no pueden sincronizarse desde Etsy.');
  }

  if (isRemote()) {
    return updateRemoteEtsyMetadata(id, metadata);
  }

  return updateLocalEtsyMetadata(id, metadata);
};

export const setAllEtsyOffers = async (onSale: boolean): Promise<number> => {
  if (isRemote()) {
    return setAllRemoteEtsyOffers(onSale);
  }

  return setAllLocalEtsyOffers(onSale);
};
