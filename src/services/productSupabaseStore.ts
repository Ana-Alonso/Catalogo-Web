import { supabase } from '../utils/supabase';
import type { CatalogItem, EtsyProductMetadata } from '../types/catalog';

const STORAGE_BUCKET = 'products';

const requireClient = () => {
  if (!supabase) {
    throw new Error('Supabase no está configurado.');
  }
  return supabase;
};

export const fetchRemoteProducts = async (): Promise<CatalogItem[]> => {
  const { data, error } = await requireClient()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as CatalogItem[];
};

export const uploadRemoteImage = async (file: File): Promise<string> => {
  const client = requireClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `items/${fileName}`;

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const createRemoteProduct = async (
  product: CatalogItem
): Promise<CatalogItem> => {
  const { data, error } = await requireClient()
    .from('products')
    .insert([
      {
        title: product.title,
        description: product.description,
        category: product.category,
        image: product.image,
        etsyLink: product.etsyLink || null,
        vintedLink: product.vintedLink || null,
        priceCents: product.priceCents ?? null,
        currency: product.currency,
        discountPercent: product.discountPercent ?? null,
        source: 'local',
        isVisible: true,
        status: product.status,
        eventDate: product.eventDate || null,
        eventLocation: product.eventLocation || null,
        cupo: product.cupo ?? null,
        ...(product.category === 'talleres'
          ? { registrationDeadline: product.registrationDeadline ?? null }
          : {})
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CatalogItem;
};

export const updateRemoteProduct = async (
  id: string,
  payload: Record<string, unknown>
): Promise<CatalogItem> => {
  const { data, error } = await requireClient()
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
};

export const setRemoteVisibility = async (
  id: string,
  isVisible: boolean
): Promise<CatalogItem> => {
  const { data, error } = await requireClient()
    .from('products')
    .update({ isVisible })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CatalogItem;
};

export const setRemoteWorkshopCancelled = async (
  id: string,
  isCancelled: boolean
): Promise<CatalogItem> => {
  const { data, error } = await requireClient()
    .from('products')
    .update({ workshopCancelled: isCancelled })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CatalogItem;
};

export const deleteRemoteProduct = async (id: string): Promise<void> => {
  const { data, error } = await requireClient()
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
};

export const updateRemoteEtsyMetadata = async (
  id: string,
  metadata: EtsyProductMetadata
): Promise<CatalogItem> => {
  const { data, error } = await requireClient()
    .from('products')
    .update({
      category: metadata.category,
      etsyOnSale: metadata.etsyOnSale,
    })
    .eq('id', id)
    .eq('source', 'etsy')
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CatalogItem;
};

export const setAllRemoteEtsyOffers = async (onSale: boolean): Promise<number> => {
  const { data, error } = await requireClient()
    .from('products')
    .update({ etsyOnSale: onSale })
    .eq('source', 'etsy')
    .select('id');

  if (error) {
    throw error;
  }

  return (data ?? []).length;
};
