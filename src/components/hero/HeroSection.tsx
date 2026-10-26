import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Animated, Box, Button, Container, Section, Typography, Icon } from '../ui';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import type { CatalogItem } from '../../types/catalog';

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
    <Section paddingY="none" background="neutral" overflow="hidden">
      <Box
        position="relative"
        display="flex"
        align="center"
        justify="center"
        minHeight="hero"
        paddingTop="nav"
      >
        <Box
          aria-hidden="true"
          position="absolute"
          inset
          zIndex={0}
          opacity={25}
          gradient="vignette"
        />

        <Container size="md" position="relative" zIndex={10} textAlign="center">
          <Animated
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography variant="hero" marginBottom="lg">
              <Trans
                i18nKey="hero.title"
                components={{ highlight: <Typography as="span" variant="hero" tone="primary" /> }}
              />
            </Typography>
            <Typography variant="subtitle" marginTop="md" maxWidth="prose" center marginBottom="2xl">
              {t('hero.subtitle')}
            </Typography>

            <Animated
              display="flex"
              stackBelow="sm"
              justify="center"
              gap="md"
              marginBottom="lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button href="#galeria" size="lg">
                {t('hero.catalogCta')}
              </Button>
              <Button
                href={etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                <Icon as={ShoppingBag} size="lg" /> {t('hero.etsyCta')}
              </Button>
            </Animated>

            {hasNewItems && onShowNew && (
              <Animated
                display="flex"
                justify="center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button variant="accent" onClick={onShowNew}>
                  <Icon as={Sparkles} />
                  {t('gallery.newButton', 'No te pierdas nuestras novedades')}
                  <Icon as={ArrowRight} hoverTranslate />
                </Button>
              </Animated>
            )}
          </Animated>
        </Container>
      </Box>
    </Section>
  );
};

export default HeroSection;
