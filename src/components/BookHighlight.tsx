import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Box, Typography } from './ui';
import { theme } from '../theme';
import libro1 from '../assets/book/Libro1.jpeg';
import libro2 from '../assets/book/Libro2.jpeg';
import libro3 from '../assets/book/Libro3.jpeg';
import libro4 from '../assets/book/Libro4.jpeg';

const images = [libro1, libro2, libro3, libro4];

const AMAZON_BOOK_URL = import.meta.env.VITE_AMAZON_BOOK_URL;

export const BookHighlight: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  return (
    <section id="libro" className="py-12 md:py-16 bg-neutral-950">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <Typography variant="h2" className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-3">
            {t('book.sectionHeading', 'Libro Destacado')}
          </Typography>
          <Box className="h-1 w-20 bg-orange-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <Box 
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <Box className={`relative aspect-[3/4] max-w-md mx-auto w-full rounded-lg overflow-hidden ${theme.card.base}`}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={t('book.imageAlt')}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={goToPrevious}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/90 hover:bg-neutral-950 text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} shadow-lg`}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/90 hover:bg-neutral-950 text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} shadow-lg`}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <Box className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                      index === currentIndex
                        ? 'bg-orange-600 w-8'
                        : 'bg-neutral-400/70 hover:bg-neutral-300 w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
                  />
                ))}
              </Box>
            </Box>

            <Box className="flex gap-2 mt-4 max-w-md mx-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`flex-1 aspect-[3/4] rounded-md overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                    index === currentIndex
                      ? 'border-orange-600'
                      : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                </button>
              ))}
            </Box>
          </Box>

          <Box className="text-center lg:text-left">
            {t('book.badge') && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm mb-4 ${theme.colors.primaryBadge}`}
              >
                {t('book.badge')}
              </motion.span>
            )}

            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-wider mb-4">
              {t('book.title')}
            </Typography>

            <Box className="h-1 w-20 bg-orange-600 mb-6 mx-auto lg:mx-0" />

            <Typography variant="body" className={`text-lg mb-8 leading-relaxed ${theme.colors.textMuted}`}>
              {t('book.description')}
            </Typography>

            <a
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-bold tracking-widest uppercase rounded-sm transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${theme.colors.primary}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {t('book.cta')}
            </a>
          </Box>
        </motion.div>
      </Box>
    </section>
  );
};

export default BookHighlight;
