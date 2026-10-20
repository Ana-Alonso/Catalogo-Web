import { getServerEnv } from './env';
import {
  EtsyApiError,
  fetchActiveListings,
  fetchListing,
  fetchListingImages,
} from './etsyClient';
import {
  mapEtsyListing,
  pickListingImage,
  type EtsyProductFields,
} from './etsyMapping';
import { markEtsySync } from './etsyAuth';
import { createSupabaseAdmin } from './supabaseAdmin';

type SupabaseAdmin = ReturnType<typeof createSupabaseAdmin>;

interface ExistingProduct {
  id: string;
  etsyListingId: number | null;
  isVisible: boolean | null;
}

export interface SyncResult {
  created: number;
  updated: number;
  hidden: number;
  total: number;
}

const updateListingRow = async (
  supabase: SupabaseAdmin,
  id: string,
  fields: EtsyProductFields,
  isVisible: boolean
): Promise<void> => {
  const { image, ...fieldsWithoutImage } = fields;
  const payload = image
    ? { ...fields, isVisible }
    : { ...fieldsWithoutImage, isVisible };

  const { error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw new Error(`No se pudo actualizar el producto ${fields.etsyListingId}.`);
  }
};

const insertListingRow = async (
  supabase: SupabaseAdmin,
  fields: EtsyProductFields
): Promise<void> => {
  const { error } = await supabase.from('products').insert({
    ...fields,
    category: 'ilustraciones',
    featured: false,
    discountPercent: null,
  });

  if (!error) {
    return;
  }

  if (error.code === '23505') {
    const { error: updateError } = await supabase
      .from('products')
      .update(fields)
      .eq('etsyListingId', fields.etsyListingId);

    if (updateError) {
      throw new Error(`No se pudo guardar el producto ${fields.etsyListingId}.`);
    }
    return;
  }

  throw new Error(`No se pudo crear el producto ${fields.etsyListingId}.`);
};

const hideListingRow = async (
  supabase: SupabaseAdmin,
  listingId: number
): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({
      isVisible: false,
      etsyState: 'inactive',
      etsySyncedAt: new Date().toISOString(),
    })
    .eq('etsyListingId', listingId);

  if (error) {
    throw new Error(`No se pudo ocultar el producto ${listingId}.`);
  }
};

export const syncEtsyListings = async (): Promise<SyncResult> => {
  const env = getServerEnv();
  const supabase = createSupabaseAdmin();
  const listings = await fetchActiveListings(env.etsyShopId);

  const { data, error } = await supabase
    .from('products')
    .select('id, etsyListingId, isVisible')
    .eq('source', 'etsy');

  if (error) {
    throw new Error(`No se pudieron leer los productos de Etsy (${error.message}).`);
  }

  const existingRows = (data ?? []) as unknown as ExistingProduct[];
  const existingByListing = new Map<number, ExistingProduct>();

  for (const row of existingRows) {
    if (row.etsyListingId != null) {
      existingByListing.set(row.etsyListingId, row);
    }
  }

  const activeIds = new Set<number>();
  let created = 0;
  let updated = 0;

  for (const listing of listings) {
    const fields = mapEtsyListing(listing);
    activeIds.add(fields.etsyListingId);

    if (!fields.image) {
      const images = await fetchListingImages(fields.etsyListingId);
      fields.image = pickListingImage(images);
    }

    const existing = existingByListing.get(fields.etsyListingId);

    if (existing) {
      await updateListingRow(supabase, existing.id, fields, true);
      updated += 1;
    } else {
      await insertListingRow(supabase, fields);
      created += 1;
    }
  }

  let hidden = 0;

  for (const row of existingRows) {
    if (row.etsyListingId == null || activeIds.has(row.etsyListingId)) {
      continue;
    }
    await hideListingRow(supabase, row.etsyListingId);
    if (row.isVisible !== false) {
      hidden += 1;
    }
  }

  await markEtsySync();

  return { created, updated, hidden, total: created + updated + hidden };
};

export const syncSingleEtsyListing = async (listingId: number): Promise<void> => {
  const supabase = createSupabaseAdmin();

  let listing;

  try {
    listing = await fetchListing(listingId);
  } catch (error) {
    if (error instanceof EtsyApiError && error.status === 404) {
      await hideListingRow(supabase, listingId);
      return;
    }
    throw error;
  }

  const fields = mapEtsyListing(listing);

  if (!fields.image) {
    const images = await fetchListingImages(listingId);
    fields.image = pickListingImage(images);
  }

  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('etsyListingId', listingId)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer el producto ${listingId}.`);
  }

  if (!fields.isVisible) {
    if (data) {
      await updateListingRow(supabase, String(data.id), fields, false);
    }
    return;
  }

  if (data) {
    await updateListingRow(supabase, String(data.id), fields, true);
    return;
  }

  await insertListingRow(supabase, fields);
};

export const hideEtsyListing = async (listingId: number): Promise<void> => {
  const supabase = createSupabaseAdmin();
  await hideListingRow(supabase, listingId);
};
