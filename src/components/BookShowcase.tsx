import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Box, Typography } from './ui';
import { theme } from '../theme';
import libro1 from '../assets/book/Libro1.jpeg';
import libro2 from '../assets/book/Libro2.jpeg';
import libro3 from '../assets/book/Libro3.jpeg';
import libro4 from '../assets/book/Libro4.jpeg';

const images = [libro1, libro2, libro3, libro4];

const AMAZON_BOOK_URL = import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

export const BookShowcase: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 bg-neutral-950">
      <Box className="w-full">
        <Box className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="snap-center flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px]"
            >
              <Box className={`relative aspect-[3/4] rounded-lg overflow-hidden ${theme.card.base}`}>
                <img
                  src={img}
                  alt={`${t('book.imageAlt')} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Box>
            </motion.div>
          ))}
        </Box>

        <Box className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-3">
            {t('book.title')}
          </Typography>
          <Box className="h-px w-16 bg-orange-600 mx-auto mb-4" />
          <Typography variant="body" className={`text-base md:text-lg mb-8 leading-relaxed ${theme.colors.textMuted}`}>
            {t('book.description')}
          </Typography>
          <a
            href={AMAZON_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold tracking-wide uppercase rounded-sm transition-colors border border-orange-600/80 text-orange-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t('book.cta')}
          </a>
        </Box>
      </Box>
    </section>
  );
};

export default BookShowcase;
