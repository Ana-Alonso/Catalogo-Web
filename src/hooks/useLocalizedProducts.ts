import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../i18n/languages';
import { localizeCatalogItems } from '../i18n/productContent';
import type { CatalogItem } from '../types/catalog';

export const useLocalizedProducts = (products: CatalogItem[]): CatalogItem[] => {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  return useMemo(
    () => localizeCatalogItems(products, language),
    [products, language]
  );
};
