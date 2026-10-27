export type CategoryType = 'todas' | 'personalizados' | 'camisetas' | 'ilustraciones' | 'talleres';

export type AvailabilityStatus = 'disponible' | 'reservado' | 'vendido';

export type ProductSource = 'local' | 'etsy';

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: CategoryType;
  etsyLink?: string | null;
  vintedLink?: string | null;
  priceCents?: number | null;
  currency?: string;
  discountPercent?: number | null;
  etsyOfferPercent?: number | null;
  source?: ProductSource;
  etsyListingId?: number | null;
  etsyState?: string | null;
  etsySyncedAt?: string | null;
  isVisible?: boolean;
  status: AvailabilityStatus;
  eventDate?: string;
  eventLocation?: string;
  cupo?: number | null;
  created_at?: string;
}

export interface NavLinkItem {
  labelKey: string;
  category: CategoryType;
  href: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: Exclude<CategoryType, 'todas'>;
  imageFile?: File | null;
  imageUrl?: string;
  etsyLink?: string;
  vintedLink?: string;
  price?: string;
  discountPercent?: string;
  status: AvailabilityStatus;
  eventDate?: string;
  eventLocation?: string;
  cupo?: string;
}

export interface EtsyProductMetadata {
  category: Exclude<CategoryType, 'todas'>;
  etsyOfferPercent: number | null;
}
