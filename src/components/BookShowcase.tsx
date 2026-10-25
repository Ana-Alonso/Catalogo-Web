import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { Box, Container, IconButton, Section, Typography } from './ui';
import { theme } from '../theme';
import libro1 from '../assets/book/Libro1.jpeg';
import libro2 from '../assets/book/Libro2.jpeg';
import libro3 from '../assets/book/Libro3.jpeg';
import libro4 from '../assets/book/Libro4.jpeg';

const images = [libro1, libro2, libro3, libro4];

const AMAZON_BOOK_URL = import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

export const BookShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  return (
    <Section paddingY="lg" background="neutral" overflow="hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="relative w-full max-w-[600px] h-[320px] sm:h-[380px] md:h-[440px] flex items-center justify-center">
            <IconButton
              onClick={goToPrevious}
              className="absolute left-0 sm:-left-12 z-30"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </IconButton>
            <IconButton
              onClick={goToNext}
              className="absolute right-0 sm:-right-12 z-30"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </IconButton>

            <AnimatePresence mode="wait">
              <motion.button
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -40 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[280px] sm:h-[336px] md:h-[392px] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                aria-label={t('book.imageAlt')}
              >
                <Box className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl shadow-black/70">
                  <img
                    src={images[currentIndex]}
                    alt={`${t('book.imageAlt')} ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </Box>
              </motion.button>
            </AnimatePresence>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-orange-600 w-6' : 'bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <Box className="max-w-3xl mx-auto text-center mt-12">
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
      </Container>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <IconButton
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </IconButton>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={`${t('book.imageAlt')} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default BookShowcase;
