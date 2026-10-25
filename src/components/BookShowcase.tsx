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
    <section className="py-12 md:py-16 bg-neutral-950 overflow-hidden">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center mb-12"
        >
          <div className="relative w-full max-w-[900px] h-[380px] sm:h-[460px] md:h-[520px]">
            {images.map((img, index) => {
              const radius = 300;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '180px',
                    height: '252px',
                    marginLeft: '-90px',
                    marginTop: '-126px',
                    transformOrigin: `50% ${radius}px`,
                    animation: 'orbit 36s linear infinite',
                    animationDelay: `-${(36 / images.length) * index}s`,
                  }}
                  className="will-change-transform"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      animation: 'orbit-counter 36s linear infinite',
                      animationDelay: `-${(36 / images.length) * index}s`,
                    }}
                    className="rounded-lg overflow-hidden shadow-2xl shadow-black/60"
                  >
                    <img
                      src={img}
                      alt={`${t('book.imageAlt')} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </motion.div>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[280px] rounded-lg overflow-hidden shadow-[0_0_90px_rgba(234,88,12,0.35)] z-10">
              <img
                src={libro1}
                alt={t('book.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <Box className="max-w-3xl mx-auto text-center">
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
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
};

export default BookShowcase;
