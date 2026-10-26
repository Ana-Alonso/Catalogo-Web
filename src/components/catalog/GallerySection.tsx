import React from 'react';
import { useTranslation } from 'react-i18next';
import { type Variants } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { ProductCardSkeleton } from '../product/ProductCardSkeleton';
import { Animated, Box, Button, Chip, Container, ErrorState, Presence, Section, Typography, Icon } from '../ui';
import { categoryTranslationKeys } from '../../i18n/labels';
import { isOfferActive } from '../../utils/price';
import type { CatalogItem, CategoryType } from '../../types/catalog';
import type { RegistrationFormData } from '../../types/registrations';

export interface GallerySectionProps {
  items: CatalogItem[];
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  offersOnly?: boolean;
  onToggleOffers?: () => void;
  newOnly?: boolean;
  onToggleNew?: () => void;
  hasNewItems?: boolean;
  spotsCounts?: Record<string, number>;
  onRegister?: (item: CatalogItem, data: RegistrationFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
  spotsError?: string | null;
  onRetrySpots?: () => void | Promise<void>;
}

const categories: CategoryType[] = [
  'todas',
  'ilustraciones',
  'camisetas',
  'talleres',
  'personalizados',
];

const SKELETON_ITEMS = 6;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const isWithin24Hours = (dateString?: string) => {
  if (!dateString) return false;
  const createdAt = new Date(dateString);
  if (Number.isNaN(createdAt.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 24;
};

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  items, 
  activeCategory, 
  onSelectCategory,
  offersOnly = false,
  onToggleOffers,
  newOnly = false,
  onToggleNew,
  hasNewItems = false,
  spotsCounts,
  onRegister,
  isLoading,
  error,
  onRetry,
  spotsError,
  onRetrySpots,
}) => {
  const { t } = useTranslation();
  const visibleItems = items.filter(item => item.isVisible !== false);
  const offersCount = visibleItems.filter(isOfferActive).length;
  const categoryItems = activeCategory === 'todas'
    ? visibleItems
    : visibleItems.filter(item => item.category === activeCategory);
  const afterOffers = offersOnly
    ? categoryItems.filter(isOfferActive)
    : categoryItems;
  const filteredItems = newOnly
    ? afterOffers.filter((item) => isWithin24Hours(item.created_at))
    : afterOffers;

  return (
    <Section id="galeria" paddingY="xl" background="neutral" overflow="visible" minHeight="screen">
      <Container>
        <Box display="flex" stackBelow="md" justify="between" alignMd="end" marginBottom="xl" gap="lg">
          <Box>
            <Typography variant="h2" marginBottom="sm">
              {t('catalog.heading')}{' '}
              <Typography as="span" variant="h2" tone="subtle">{t('catalog.headingAccent')}</Typography>
            </Typography>
            <Box height={1} width={20} background="primaryFlat" />
          </Box>

          <Box
            display="flex"
            wrap
            gap="sm"
            role="toolbar"
            aria-label={t('catalog.filterAria')}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <Chip
                  key={category}
                  active={isActive}
                  onClick={() => {
                    if (newOnly && onToggleNew) {
                      onToggleNew();
                    }
                    onSelectCategory(category);
                  }}
                >
                  {t(categoryTranslationKeys[category])}
                </Chip>
              );
            })}
            {onToggleOffers && (
              <Chip
                tone="accent"
                active={offersOnly}
                count={offersCount}
                onClick={() => {
                  if (newOnly && onToggleNew) {
                    onToggleNew();
                  }
                  onToggleOffers();
                }}
              >
                <Icon as={Tag} size="sm" />
                {t('catalog.offers')}
              </Chip>
            )}
          </Box>
        </Box>

        {hasNewItems && onToggleNew && (
          <Box marginBottom="xl">
            <Chip tone="text" active={newOnly} onClick={onToggleNew}>
              <Typography as="span" variant="caption" tracking="widest">
                {t('gallery.newButton', 'No te pierdas nuestras novedades')}
              </Typography>
              <Icon as={ArrowRight} hoverTranslate />
            </Chip>
          </Box>
        )}

        {spotsError && (
          <Box
            role="alert"
            marginBottom="xl"
            display="flex"
            wrap
            align="center"
            justify="between"
            gap="md"
            rounded="lg"
            border
            borderTone="warning"
            background="warningSoft"
            padding="md"
          >
            <Typography as="span" variant="body" size="sm" tone="warningSoft">
              {spotsError}
            </Typography>
            {onRetrySpots && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void onRetrySpots()}
              >
                {t('common.retry')}
              </Button>
            )}
          </Box>
        )}

        <Presence mode="wait">
          {isLoading ? (
            <Animated
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              display="grid"
              columns={1}
              columnsMd={2}
              columnsLg={3}
              gap="xl"
              role="status"
              aria-label={t('catalog.loading')}
            >
              <Box srOnly>{t('catalog.loading')}</Box>
              {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </Animated>
          ) : error ? (
            <Animated
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState
                title={t('catalog.errorTitle')}
                description={t('catalog.errorDescription')}
                onRetry={onRetry}
                retryLabel={t('common.retry')}
              />
            </Animated>
          ) : filteredItems.length > 0 ? (
            <Animated
              key={activeCategory}
              display="grid"
              columns={1}
              columnsMd={2}
              columnsLg={3}
              gap="xl"
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
            </Animated>
          ) : (
            <Animated
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box textAlign="center" paddingY="nav" background="surfaceTranslucent" rounded="lg" border>
                <Typography variant="body" size="lg">
                  {offersOnly ? t('catalog.emptyOffers') : t('catalog.empty')}
                </Typography>
              </Box>
            </Animated>
          )}
        </Presence>

      </Container>
    </Section>
  );
};

export default GallerySection;
