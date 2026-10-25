import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Box, Typography } from './ui';
import { theme } from '../theme';
import { isOfferActive } from '../utils/price';
import type { CatalogItem } from '../types/catalog';
import libro1 from '../assets/book/Libro1.jpeg';

const AMAZON_BOOK_URL = import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

interface FeaturedStripProps {
  items: CatalogItem[];
}

const isWithin24Hours = (dateString?: string) => {
  if (!dateString) return false;
  const createdAt = new Date(dateString);
  if (Number.isNaN(createdAt.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 24;
};

export const FeaturedStrip: React.FC<FeaturedStripProps> = ({ items }) => {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => item.isVisible !== false);

  const newProducts = useMemo(
    () => visibleItems.filter((item) => isWithin24Hours(item.created_at)),
    [visibleItems]
  );

  const newOffers = useMemo(
    () => visibleItems.filter((item) => !isWithin24Hours(item.created_at) && isOfferActive(item)),
    [visibleItems]
  );

  if (newProducts.length > 0) {
    const itemsToShow = newProducts.slice(0, 3);
    return (
      <section className="py-10 md:py-12 bg-neutral-950">
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-6"
          >
            <Box className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <Typography variant="h3" className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                {t('featured.newArrivals', 'Novedades')}
              </Typography>
            </Box>
            <Box className="h-px w-full bg-gradient-to-r from-orange-600/60 to-transparent" />
          </motion.div>

          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsToShow.map((item, index) => (
              <motion.a
                key={item.id}
                href="#galeria"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group flex gap-4 p-4 rounded-lg ${theme.card.base} hover:border-orange-600/60 transition-all`}
              >
                <Box className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Box>
                <Box className="flex flex-col justify-center min-w-0">
                  <span className={`inline-block w-fit px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm mb-1.5 ${theme.colors.primaryBadge}`}>
                    {t('featured.new', 'Nuevo')}
                  </span>
                  <Typography variant="body" className="text-white font-medium truncate">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" className={theme.colors.textMuted}>
                    {t('featured.viewInCatalog', 'Ver en catálogo')}
                  </Typography>
                </Box>
              </motion.a>
            ))}
          </Box>
        </Box>
      </section>
    );
  }

  if (newOffers.length > 0) {
    const itemsToShow = newOffers.slice(0, 3);
    return (
      <section className="py-10 md:py-12 bg-neutral-950">
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-6"
          >
            <Typography variant="h3" className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-2">
              {t('featured.newOffers', 'Nuevas ofertas')}
            </Typography>
            <Box className="h-px w-full bg-gradient-to-r from-orange-600/60 to-transparent" />
          </motion.div>

          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsToShow.map((item, index) => (
              <motion.a
                key={item.id}
                href="#galeria"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group flex gap-4 p-4 rounded-lg ${theme.card.base} hover:border-orange-600/60 transition-all`}
              >
                <Box className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Box>
                <Box className="flex flex-col justify-center min-w-0">
                  <span className={`inline-block w-fit px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm mb-1.5 ${theme.colors.primaryBadge}`}>
                    {t('featured.offer', 'Oferta')}
                  </span>
                  <Typography variant="body" className="text-white font-medium truncate">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" className={theme.colors.textMuted}>
                    {t('featured.viewInCatalog', 'Ver en catálogo')}
                  </Typography>
                </Box>
              </motion.a>
            ))}
          </Box>
        </Box>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-12 bg-neutral-950">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.a
          href={AMAZON_BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`group flex flex-col sm:flex-row items-center gap-6 p-6 rounded-lg ${theme.card.base} hover:border-orange-600/60 transition-all`}
        >
          <Box className="w-32 h-40 sm:w-28 sm:h-36 flex-shrink-0 rounded-md overflow-hidden">
            <img src={libro1} alt={t('book.imageAlt')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </Box>
          <Box className="flex-1 text-center sm:text-left">
            <Typography variant="h3" className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-2">
              {t('book.title')}
            </Typography>
            <Typography variant="body" className={`${theme.colors.textMuted} mb-0 max-w-2xl`}>
              {t('book.description')}
            </Typography>
          </Box>
          <Box className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold tracking-wide uppercase rounded-sm transition-colors ${theme.colors.primary} flex-shrink-0`}>
            <ShoppingBag className="w-4 h-4" />
            {t('book.cta')}
          </Box>
        </motion.a>
      </Box>
    </section>
  );
};

export default FeaturedStrip;
