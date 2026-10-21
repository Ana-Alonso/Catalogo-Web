import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Tag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Box, Typography } from './ui';
import { theme } from '../theme';
import { categoryTranslationKeys } from '../i18n/labels';
import { isOfferActive } from '../utils/price';
import type { CatalogItem, CategoryType } from '../types/catalog';
import type { RegistrationFormData } from '../types/registrations';

interface GallerySectionProps {
  items: CatalogItem[];
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  offersOnly?: boolean;
  onToggleOffers?: () => void;
  spotsCounts?: Record<string, number>;
  onRegister?: (item: CatalogItem, data: RegistrationFormData) => Promise<void>;
}

const categories: CategoryType[] = [
  'todas',
  'ilustraciones',
  'camisetas',
  'talleres',
  'personalizados',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  items, 
  activeCategory, 
  onSelectCategory,
  offersOnly = false,
  onToggleOffers,
  spotsCounts,
  onRegister
}) => {
  const { t } = useTranslation();
  const visibleItems = items.filter(item => item.isVisible !== false);
  const offersCount = visibleItems.filter(isOfferActive).length;
  const categoryItems = activeCategory === 'todas'
    ? visibleItems
    : visibleItems.filter(item => item.category === activeCategory);
  const filteredItems = offersOnly
    ? categoryItems.filter(isOfferActive)
    : categoryItems;

  return (
    <section id="galeria" className="py-24 bg-neutral-950 min-h-screen">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Box>
            <Typography variant="h2" className="mb-3">
              {t('catalog.heading')} <span className={theme.colors.textSubtle}>{t('catalog.headingAccent')}</span>
            </Typography>
            <Box className="h-1 w-20 bg-orange-600" />
          </Box>

          <Box 
            className="flex flex-wrap gap-2" 
            role="toolbar" 
            aria-label={t('catalog.filterAria')}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  aria-pressed={isActive}
                >
                  {t(categoryTranslationKeys[category])}
                </button>
              );
            })}
            {onToggleOffers && (
              <button
                type="button"
                onClick={onToggleOffers}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                  offersOnly
                    ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-neutral-900 border-orange-600/60 text-orange-400 hover:bg-orange-600/10'
                }`}
                aria-pressed={offersOnly}
              >
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                {t('catalog.offers')}
                {offersCount > 0 && (
                  <span
                    className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                      offersOnly ? 'bg-neutral-950/40 text-white' : 'bg-orange-600/20 text-orange-300'
                    }`}
                  >
                    {offersCount}
                  </span>
                )}
              </button>
            )}
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div 
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  spotsCount={spotsCounts?.[item.id]}
                  onRegister={
                    onRegister ? (data) => onRegister(item, data) : undefined
                  }
                />
              ))}
            </motion.div>
          ) : (
            <Box className="text-center py-20 bg-neutral-900/50 rounded-lg border border-neutral-800">
              <Typography variant="body" className="text-lg">
                {offersOnly ? t('catalog.emptyOffers') : t('catalog.empty')}
              </Typography>
            </Box>
          )}
        </AnimatePresence>

      </Box>
    </section>
  );
};

export default GallerySection;
