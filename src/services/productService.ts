import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { validateImageFile } from '../utils/imageValidation';
import { parsePriceToCents } from '../utils/price';
import { resolvePurchaseLinks } from '../utils/productLinks';
import { mockCatalogItems } from '../mocks/catalogMocks';
import type {
  CatalogItem,
  EtsyProductMetadata,
  ProductFormData,
} from '../types/catalog';

const STORAGE_BUCKET = 'products';
const LOCAL_STORAGE_KEY = 'laurel_custom_products_v2';
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const parseCupo = (value?: string): number | null => {
  if (!value || !value.trim()) {
    return null;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

interface LocalPriceFields {
  priceCents: number | null;
  currency: string;
  discountPercent: number | null;
}

const resolvePriceFields = (formData: ProductFormData): LocalPriceFields => {
  const priceCents = parsePriceToCents(formData.price);

  if (formData.price?.trim() && priceCents == null) {
    throw new Error('El precio introducido no es válido.');
  }

  if (!formData.discountPercent?.trim()) {
    return { priceCents, currency: 'EUR', discountPercent: null };
  }

  const discountPercent = Number(formData.discountPercent.replace(',', '.'));

  if (
    !Number.isInteger(discountPercent) ||
    discountPercent < 1 ||
    discountPercent > 90
  ) {
    throw new Error('El descuento debe ser un número entero entre 1 y 90.');
  }

  if (priceCents == null) {
    throw new Error('Para aplicar un descuento primero debes indicar un precio.');
  }

  return { priceCents, currency: 'EUR', discountPercent };
};

const getStoredLocalProducts = (): CatalogItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredLocalProducts = (items: CatalogItem[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
};

export const fetchProducts = async (): Promise<CatalogItem[]> => {
  if (!useMocks) {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as CatalogItem[];
  }

  const localItems = getStoredLocalProducts();
  if (localItems.length > 0) {
    return localItems;
  }
  return mockCatalogItems;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createProduct = async (formData: ProductFormData): Promise<CatalogItem> => {
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
    eventDate: formData.eventDate?.trim() || undefined,
    eventLocation: formData.eventLocation?.trim() || undefined,
    cupo: parseCupo(formData.cupo),
    created_at: new Date().toISOString()
  };

  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title: newProduct.title,
          description: newProduct.description,
          category: newProduct.category,
          image: newProduct.image,
          etsyLink: newProduct.etsyLink || null,
          vintedLink: newProduct.vintedLink || null,
          priceCents: newProduct.priceCents ?? null,
          currency: newProduct.currency,
          discountPercent: newProduct.discountPercent ?? null,
          source: 'local',
          isVisible: true,
          status: newProduct.status,
          eventDate: newProduct.eventDate || null,
          eventLocation: newProduct.eventLocation || null,
          cupo: newProduct.cupo ?? null
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as CatalogItem;
  }

  const currentLocals = getStoredLocalProducts();
  const updated = [newProduct, ...currentLocals];
  saveStoredLocalProducts(updated);
  return newProduct;
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

  if (!useMocks && isSupabaseConfigured && supabase) {
    const payload: Partial<CatalogItem> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      etsyLink: purchaseLinks.etsyLink ?? null,
      vintedLink: purchaseLinks.vintedLink ?? null,
      ...priceFields,
      status: formData.status,
      eventDate: formData.eventDate?.trim() || undefined,
      eventLocation: formData.eventLocation?.trim() || undefined,
      cupo: parseCupo(formData.cupo)
    };

    if (imageUrl) {
      payload.image = imageUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .eq('source', 'local')
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Los productos de Etsy se editan desde Etsy.');
      }
      throw error;
    }

    return data as CatalogItem;
  }

  const currentLocals = getStoredLocalProducts();
  const updatedLocals = currentLocals.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        image: imageUrl || item.image,
        etsyLink: purchaseLinks.etsyLink ?? null,
        vintedLink: purchaseLinks.vintedLink ?? null,
        ...priceFields,
        status: formData.status,
        eventDate: formData.eventDate?.trim() || undefined,
        eventLocation: formData.eventLocation?.trim() || undefined,
        cupo: parseCupo(formData.cupo)
      };
    }
    return item;
  });

  saveStoredLocalProducts(updatedLocals);
  const found = updatedLocals.find((item) => item.id === id);
  if (!found) {
    return {
      id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      image: imageUrl,
      etsyLink: purchaseLinks.etsyLink ?? null,
      vintedLink: purchaseLinks.vintedLink ?? null,
      ...priceFields,
      status: formData.status,
      eventDate: formData.eventDate?.trim() || undefined,
      eventLocation: formData.eventLocation?.trim() || undefined,
      cupo: parseCupo(formData.cupo)
    };
  }
  return found;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('source', 'local')
      .select('id');

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Los productos de Etsy se gestionan desde Etsy.');
    }
    return;
  }

  const currentLocals = getStoredLocalProducts();
  const updated = currentLocals.filter((item) => item.id !== id);
  saveStoredLocalProducts(updated);
};

export const updateEtsyProductMetadata = async (
  id: string,
  metadata: EtsyProductMetadata
): Promise<CatalogItem> => {
  if (metadata.category === 'talleres') {
    throw new Error('Los talleres no pueden sincronizarse desde Etsy.');
  }

  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .update({
        category: metadata.category,
      })
      .eq('id', id)
      .eq('source', 'etsy')
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as CatalogItem;
  }

  const currentLocals = getStoredLocalProducts();
  let updatedProduct: CatalogItem | null = null;

  const updatedLocals = currentLocals.map((item) => {
    if (item.id !== id) {
      return item;
    }
    updatedProduct = {
      ...item,
      category: metadata.category,
    };
    return updatedProduct;
  });

  saveStoredLocalProducts(updatedLocals);

  if (!updatedProduct) {
    throw new Error('Producto no encontrado.');
  }

  return updatedProduct;
};
