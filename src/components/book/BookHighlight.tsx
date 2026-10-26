import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Animated, AnimatedImage, AnimatedText, Badge, Box, Button, Container, Dot, IconButton, Image, Presence, Section, Typography, Icon } from '../ui';
import libro1 from '../../assets/book/Libro1.jpeg';
import libro2 from '../../assets/book/Libro2.jpeg';
import libro3 from '../../assets/book/Libro3.jpeg';
import libro4 from '../../assets/book/Libro4.jpeg';

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
    <Section id="libro" paddingY="lg" background="neutral">
      <Container>
        <Animated
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          marginBottom="xl"
        >
          <Typography variant="h2" size="heading-sm" marginBottom="sm">
            {t('book.sectionHeading', 'Libro Destacado')}
          </Typography>
          <Box height={1} width={20} background="primaryFlat" />
        </Animated>

        <Animated
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          display="grid"
          columns={1}
          columnsLg={2}
          gap="xl"
          gapLg="3xl"
          align="center"
        >
          <Box
            position="relative"
            group
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <Box
              position="relative"
              aspect="portrait"
              maxWidth="cover"
              center
              width="full"
              rounded="xl"
              overflow="hidden"
              background="surface"
              border
            >
              <Presence mode="wait">
                <AnimatedImage
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
                  fullWidth
                  height="full"
                  cursor="grab"
                />
              </Presence>

              <Box position="absolute" top="-1/2" left={2} shift="center-y">
                <IconButton
                  variant="overlay"
                  size="lg"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <Icon as={ChevronLeft} size="lg" />
                </IconButton>
              </Box>

              <Box position="absolute" top="-1/2" right={2} shift="center-y">
                <IconButton
                  variant="overlay"
                  size="lg"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <Icon as={ChevronRight} size="lg" />
                </IconButton>
              </Box>

              <Box position="absolute" edge="bottom-center-md" display="flex" gap="sm">
                {images.map((_, index) => (
                  <Dot
                    key={index}
                    onClick={() => goToSlide(index)}
                    active={index === currentIndex}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
                  />
                ))}
              </Box>
            </Box>

            <Box display="flex" gap="sm" marginTop="md" maxWidth="cover" center>
              {images.map((img, index) => (
                <Box
                  key={index}
                  as="button"
                  grow
                  aspect="portrait"
                  rounded="md"
                  overflow="hidden"
                  border
                  borderWidth="thick"
                  cssTransition="all"
                  focusRing="plain"
                  borderTone={index === currentIndex ? 'primary' : 'neutral'}
                  hoverBorder={index === currentIndex ? undefined : 'muted'}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image src={img} alt="" fullWidth height="full" />
                </Box>
              ))}
            </Box>
          </Box>

          <Box textAlign="center" textAlignLg="left">
            {t('book.badge') && (
              <AnimatedText
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                display="inline-block"
                marginBottom="md"
              >
                <Badge variant="primary">{t('book.badge')}</Badge>
              </AnimatedText>
            )}

            <Typography variant="h2" size="heading-lg" marginBottom="md">
              {t('book.title')}
            </Typography>

            <Box height={1} width={20} background="primaryFlat" marginX="auto-start-lg" marginBottom="lg" />

            <Typography variant="body" size="lg" tone="muted" marginBottom="xl">
              {t('book.description')}
            </Typography>

            <Button
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <Icon as={ShoppingBag} size="lg" />
              {t('book.cta')}
            </Button>
          </Box>
        </Animated>
      </Container>
    </Section>
  );
};

export default BookHighlight;
