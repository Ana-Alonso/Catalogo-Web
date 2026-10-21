import productContent from './productContent.en.json';
import type { CatalogItem } from '../types/catalog';
import type { SupportedLanguage } from './languages';

type TranslatableField = 'title' | 'description' | 'eventLocation';

type ProductContentTranslations = Record<
  TranslatableField,
  Record<string, string>
>;

const englishProductContent: ProductContentTranslations = productContent;

const normalizeSourceText = (value: string): string =>
  value.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ').trim();

const translateField = (
  field: TranslatableField,
  value: string | undefined,
  language: SupportedLanguage
): string | undefined => {
  if (!value || language !== 'en') {
    return value;
  }

  const normalizedValue = normalizeSourceText(value);
  const fieldTranslations = englishProductContent[field];

  if (!Object.prototype.hasOwnProperty.call(fieldTranslations, normalizedValue)) {
    return value;
  }

  const translated = fieldTranslations[normalizedValue];

  return translated && translated.trim() ? translated : value;
};

export const localizeCatalogItem = (
  item: CatalogItem,
  language: SupportedLanguage
): CatalogItem => {
  if (language !== 'en') {
    return item;
  }

  return {
    ...item,
    title: translateField('title', item.title, language) ?? item.title,
    description:
      translateField('description', item.description, language) ??
      item.description,
    eventLocation: translateField('eventLocation', item.eventLocation, language),
  };
};

export const localizeCatalogItems = (
  items: CatalogItem[],
  language: SupportedLanguage
): CatalogItem[] =>
  language === 'en'
    ? items.map((item) => localizeCatalogItem(item, language))
    : items;
