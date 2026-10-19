export type CategoryType = 'todas' | 'personalizados' | 'camisetas' | 'ilustraciones' | 'talleres';

export type AvailabilityStatus = 'disponible' | 'reservado' | 'vendido';

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: CategoryType;
  etsyLink?: string;
  vintedLink?: string;
  price?: string;
  status: AvailabilityStatus;
  featured: boolean;
  eventDate?: string;
  eventLocation?: string;
  cupo?: number | null;
  created_at?: string;
}

export interface NavLinkItem {
  name: string;
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
  status: AvailabilityStatus;
  featured: boolean;
  eventDate?: string;
  eventLocation?: string;
  cupo?: string;
}
