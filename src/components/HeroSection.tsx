import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Box, Container, Section, Typography } from './ui';
import { theme } from '../theme';
import type { CatalogItem } from '../types/catalog';

interface HeroSectionProps {
  items?: CatalogItem[];
  onShowNew?: () => void;
}

const isWithin24Hours = (dateString?: string, nowMs?: number) => {
  if (!dateString) return false;
  const createdAt = new Date(dateString);
  if (Number.isNaN(createdAt.getTime())) return false;
  const now = nowMs ?? 0;
  const diffMs = now - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 24;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ items = [], onShowNew }) => {
  const { t } = useTranslation();
  const etsyUrl = import.meta.env.VITE_ETSY_SHOP_URL;

  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setNowMs(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  const hasNewItems = useMemo(() => {
    if (!nowMs) return false;
    return items.some((item) => {
      if (item.isVisible === false) return false;
      return isWithin24Hours(item.created_at, nowMs);
    });
  }, [items, nowMs]);

  return (
    <Section paddingY="none" background="neutral" overflow="hidden" className="relative min-h-[90vh] flex items-center justify-center pt-20">
      <Box 
        className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950" 
        aria-hidden="true"
      />
      
      <Container size="md" className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography variant="h1" className="mb-6 font-hero font-bold tracking-normal">
            <Trans
              i18nKey="hero.title"
              components={{ highlight: <span className={theme.colors.primaryText} /> }}
            />
          </Typography>
          <Typography variant="subtitle" className="mt-4 max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </Typography>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <a 
              href="#galeria" 
              className={`px-8 py-4 ${theme.colors.primary} font-bold tracking-widest uppercase rounded-sm transition-colors shadow-lg shadow-orange-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
            >
              {t('hero.catalogCta')}
            </a>
            <a 
              href={etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 bg-transparent border border-neutral-700 hover:border-white text-white font-bold tracking-widest uppercase rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 flex items-center justify-center gap-2`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" /> {t('hero.etsyCta')}
            </a>
          </motion.div>

          {hasNewItems && onShowNew && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={onShowNew}
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide uppercase rounded-sm border border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>
                  {t('gallery.newButton', 'No te pierdas nuestras novedades')}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Section>
  );
};

export default HeroSection;
