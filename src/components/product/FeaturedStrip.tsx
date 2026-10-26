import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { Animated, AnimatedButton, AnimatedLink, Badge, Box, Container, Image, Section, Stack, Typography, Icon } from '../ui';
import { isOfferActive } from '../../utils/price';
import type { CatalogItem, CategoryType } from '../../types/catalog';
import libro1 from '../assets/book/Libro1.jpeg';

const AMAZON_BOOK_URL = import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

interface FeaturedStripProps {
  items: CatalogItem[];
  onSelectCategory: (category: CategoryType) => void;
  onToggleOffers: () => void;
  offersOnly: boolean;
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

const scrollToGallery = () => {
  const gallery = document.getElementById('galeria');
  if (gallery) {
    const navbarHeight = 80;
    const y = gallery.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export const FeaturedStrip: React.FC<FeaturedStripProps> = ({ 
  items, 
  onSelectCategory, 
  onToggleOffers,
  offersOnly 
}) => {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => item.isVisible !== false);

  const newProducts = useMemo(
    () => visibleItems.filter((item) => isWithin24Hours(item.created_at)),
    [visibleItems]
  );

  const offerProducts = useMemo(
    () => visibleItems.filter((item) => !isWithin24Hours(item.created_at) && isOfferActive(item)),
    [visibleItems]
  );

  const handleViewProduct = (item: CatalogItem) => {
    if (item.category === 'talleres') {
      onSelectCategory('talleres');
      if (offersOnly) {
        onToggleOffers();
      }
    } else if (isOfferActive(item)) {
      onSelectCategory('todas');
      if (!offersOnly) {
        onToggleOffers();
      }
    } else {
      onSelectCategory(item.category);
      if (offersOnly) {
        onToggleOffers();
      }
    }
    scrollToGallery();
  };

  return (
    <Section paddingY="md" background="neutral">
      <Container>
        <Stack direction="column" align="stretch" gap="2xl">
          {newProducts.length > 0 && (
            <Box>
              <Animated
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                marginBottom="lg"
              >
                <Box display="flex" align="center" gap="sm" marginBottom="xs">
                  <Icon as={Sparkles} tone="accent" />
                  <Typography variant="h3">
                    {t('featured.newArrivals', 'Novedades')}
                  </Typography>
                </Box>
                <Box height="hairline" width="full" gradient="accentFadeX" />
              </Animated>

              <Box display="grid" columns={1} columnsMd={2} columnsLg={3} gap="md">
                {newProducts.slice(0, 3).map((item, index) => (
                  <AnimatedButton
                    key={item.id}
                    type="button"
                    onClick={() => handleViewProduct(item)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    group
                    display="flex"
                    gap="md"
                    padding="md"
                    rounded="lg"
                    overflow="hidden"
                    background="surface"
                    border
                    hoverBorder="primarySoft"
                    cssTransition="all"
                    textAlign="left"
                    block
                    focusRing="plain"
                  >
                    <Box width={20} height={20} shrink={false} rounded="md" overflow="hidden">
                      <Image src={item.image} alt={item.title} width="full" height="full" effect="zoom" />
                    </Box>
                    <Box display="flex" direction="column" justify="center" minWidth="zero">
                      <Badge variant="primary" size="micro" fit marginBottom="sm">
                        {t('featured.new', 'Nuevo')}
                      </Badge>
                      <Typography variant="body" tone="main" weight="medium" truncate>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" tone="muted">
                        {t('featured.viewInCatalog', 'Ver en catálogo')}
                      </Typography>
                    </Box>
                  </AnimatedButton>
                ))}
              </Box>
            </Box>
          )}

          {offerProducts.length > 0 && (
            <Box>
              <Animated
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                marginBottom="lg"
              >
                <Box display="flex" align="center" gap="sm" marginBottom="xs">
                  <Icon as={Tag} tone="accent" />
                  <Typography variant="h3">
                    {t('featured.offers', 'Ofertas')}
                  </Typography>
                </Box>
                <Box height="hairline" width="full" gradient="accentFadeX" />
              </Animated>

              <Box display="grid" columns={1} columnsMd={2} columnsLg={3} gap="md">
                {offerProducts.slice(0, 3).map((item, index) => (
                  <AnimatedButton
                    key={item.id}
                    type="button"
                    onClick={() => handleViewProduct(item)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    group
                    display="flex"
                    gap="md"
                    padding="md"
                    rounded="lg"
                    overflow="hidden"
                    background="surface"
                    border
                    hoverBorder="primarySoft"
                    cssTransition="all"
                    textAlign="left"
                    block
                    focusRing="plain"
                  >
                    <Box width={20} height={20} shrink={false} rounded="md" overflow="hidden">
                      <Image src={item.image} alt={item.title} width="full" height="full" effect="zoom" />
                    </Box>
                    <Box display="flex" direction="column" justify="center" minWidth="zero">
                      <Badge variant="primary" size="micro" fit marginBottom="sm">
                        {t('featured.offer', 'Oferta')}
                      </Badge>
                      <Typography variant="body" tone="main" weight="medium" truncate>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" tone="muted">
                        {t('featured.viewInCatalog', 'Ver en catálogo')}
                      </Typography>
                    </Box>
                  </AnimatedButton>
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <AnimatedLink
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              group
              display="flex"
              stackBelow="sm"
              align="center"
              gap="lg"
              padding="lg"
              rounded="lg"
              overflow="hidden"
              background="surface"
              border
              hoverBorder="primarySoft"
              cssTransition="all"
            >
              <Box width={32} height={40} widthSm={28} heightSm={36} shrink={false} rounded="md" overflow="hidden">
                <Image src={libro1} alt={t('book.imageAlt')} width="full" height="full" effect="zoom" />
              </Box>
              <Box flex textAlign="center" textAlignSm="left">
                <Typography variant="h3" marginBottom="sm">
                  {t('book.title')}
                </Typography>
                <Typography variant="body" tone="muted" marginBottom="none" maxWidth="prose">
                  {t('book.description')}
                </Typography>
              </Box>
              <Box display="inline-flex" align="center" justify="center" gap="sm" paddingX="lg" paddingY="md" background="primary" rounded="sm" shrink={false}>
                <Icon as={ShoppingBag} />
                <Typography as="span" variant="plain" weight="semibold" tracking="wide" transform="uppercase">
                  {t('book.cta')}
                </Typography>
              </Box>
            </AnimatedLink>
          </Box>
        </Stack>
      </Container>
    </Section>
  );
};

export default FeaturedStrip;
