import type { CategoryType } from '../types/catalog';

export interface PurchaseLinks {
  etsyLink?: string;
  vintedLink?: string;
}

export const resolvePurchaseLinks = (
  category: CategoryType,
  etsyLink?: string,
  vintedLink?: string
): PurchaseLinks => {
  if (category === 'talleres') {
    return {};
  }

  return {
    etsyLink: etsyLink?.trim() || undefined,
    vintedLink: vintedLink?.trim() || undefined,
  };
};
