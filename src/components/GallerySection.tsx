import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Box, Typography } from './ui';
import { theme } from '../theme';
import type { CatalogItem, CategoryType } from '../types/catalog';
import type { RegistrationFormData } from '../types/registrations';

interface GallerySectionProps {
  items: CatalogItem[];
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  spotsCounts?: Record<string, number>;
  onRegister?: (item: CatalogItem, data: RegistrationFormData) => Promise<void>;
}

const categories: { label: string; value: CategoryType }[] = [
  { label: 'Todas las obras', value: 'todas' },
  { label: 'Ilustraciones', value: 'ilustraciones' },
  { label: 'Camisetas', value: 'camisetas' },
  { label: 'Talleres', value: 'talleres' },
  { label: 'Personalizados', value: 'personalizados' },
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
  spotsCounts,
  onRegister
}) => {
  const filteredItems = activeCategory === 'todas'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="galeria" className="py-24 bg-neutral-950 min-h-screen">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Box>
            <Typography variant="h2" className="mb-3">
              Catálogo <span className={theme.colors.textSubtle}>Visual</span>
            </Typography>
            <Box className="h-1 w-20 bg-orange-600" />
          </Box>

          <Box 
            className="flex flex-wrap gap-2" 
            role="toolbar" 
            aria-label="Filtro de obras por categoría"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
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
                No hay piezas disponibles en esta categoría por el momento.
              </Typography>
            </Box>
          )}
        </AnimatePresence>

      </Box>
    </section>
  );
};

export default GallerySection;
