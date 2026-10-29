import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { Animated, AnimatedButton, AnimatedImage, Box, Button, Container, Dot, IconButton, Image, Presence, Section, Typography, Icon } from '../ui';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import libro1 from '../../assets/book/Libro1.jpeg';
import libro2 from '../../assets/book/Libro2.jpeg';
import libro3 from '../../assets/book/Libro3.jpeg';
import libro4 from '../../assets/book/Libro4.jpeg';

const images = [libro1, libro2, libro3, libro4];

const AUTO_ADVANCE_INTERVAL_MS = 4_000;

const AMAZON_BOOK_URL =
  import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

export const BookShowcase: React.FC = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoAdvancePaused, setIsAutoAdvancePaused] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  const lightboxRef = useRef<HTMLDivElement>(null);

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  useFocusTrap(lightboxRef, isLightboxOpen, closeLightbox);

  const pauseAutoAdvance = () => {
    setIsAutoAdvancePaused(true);
  };

  const resumeAutoAdvance = () => {
    setIsAutoAdvancePaused(false);
  };

  const isAutoAdvanceBlocked =
    prefersReducedMotion || isAutoAdvancePaused || isLightboxOpen;

  useEffect(() => {
    if (isAutoAdvanceBlocked) {
      return;
    }

    const timer = setInterval(goToNext, AUTO_ADVANCE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isAutoAdvanceBlocked, goToNext]);

  return (
    <Section paddingY="lg" background="neutral" overflow="hidden">
      <Container>
        <Animated
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          display="flex"
          direction="column"
          align="center"
          justify="center"
          marginBottom="xl"
        >
          <Box
            position="relative"
            width="full"
            maxWidth="showcase"
            height={80}
            heightSm={95}
            heightMd={110}
            display="flex"
            align="center"
            justify="center"
            onPointerEnter={pauseAutoAdvance}
            onPointerLeave={resumeAutoAdvance}
            onFocus={pauseAutoAdvance}
            onBlur={resumeAutoAdvance}
          >
            <Box position="absolute" edge="left-out" zIndex={30}>
              <IconButton onClick={goToPrevious} aria-label={t('a11y.previousImage')}>
                <Icon as={ChevronLeft} size="lg" />
              </IconButton>
            </Box>
            <Box position="absolute" edge="right-out" zIndex={30}>
              <IconButton onClick={goToNext} aria-label={t('a11y.nextImage')}>
                <Icon as={ChevronRight} size="lg" />
              </IconButton>
            </Box>

            <Presence mode="wait">
              <AnimatedButton
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -40 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                position="relative"
                width={50}
                widthSm={60}
                widthMd={70}
                height={70}
                heightSm={84}
                heightMd={98}
                cursor="zoom"
                focusRing="visiblePrimary"
                aria-label={t('book.imageAlt')}
              >
                <Box
                  position="relative"
                  width="full"
                  height="full"
                  rounded="lg"
                  overflow="hidden"
                  shadow="dramatic"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${t('book.imageAlt')} ${currentIndex + 1}`}
                    fullWidth
                    height="full"
                    loading="eager"
                  />
                </Box>
              </AnimatedButton>
            </Presence>

            <Box
              position="absolute"
              edge="bottom-center-out"
              display="flex"
              gap="sm"
            >
              {images.map((src, index) => (
                <Dot
                  key={src}
                  onClick={() => setCurrentIndex(index)}
                  active={index === currentIndex}
                  aria-label={t('a11y.goToImage', { number: index + 1 })}
                />
              ))}
            </Box>
          </Box>
        </Animated>

        <Box maxWidth="md" center textAlign="center" marginTop="3xl">
          <Typography variant="h2" size="heading-sm" marginBottom="sm">
            {t('book.title')}
          </Typography>
          <Box height="hairline" width={16} background="primaryFlat" center marginBottom="md" />
          <Typography variant="body" size="reading" tone="muted" marginBottom="xl">
            {t('book.description')}
          </Typography>
          <Button
            href={AMAZON_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
            size="md"
          >
            <Icon as={ShoppingBag} />
            {t('book.cta')}
          </Button>
        </Box>
      </Container>

      <Presence>
        {isLightboxOpen && (
          <Animated
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            position="fixed"
            inset
            zIndex={50}
            background="overlayStrong"
            display="flex"
            align="center"
            justify="center"
            padding="md"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              tabIndex={-1}
              onClick={closeLightbox}
              aria-label={t('a11y.closeDialog')}
            />
            <Box
              ref={lightboxRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('book.imageAlt')}
              tabIndex={-1}
              position="relative"
              zIndex={10}
              width="full"
              height="full"
              display="flex"
              align="center"
              justify="center"
              className="outline-none"
            >
              <Box position="absolute" corner="top-right-md">
                <IconButton onClick={closeLightbox} aria-label={t('common.close')}>
                  <Icon as={X} size="xl" />
                </IconButton>
              </Box>
              <Box position="absolute" edge="left-md">
                <IconButton onClick={goToPrevious} aria-label={t('a11y.previousImage')}>
                  <Icon as={ChevronLeft} size="xl" />
                </IconButton>
              </Box>
              <Box position="absolute" edge="right-md">
                <IconButton onClick={goToNext} aria-label={t('a11y.nextImage')}>
                  <Icon as={ChevronRight} size="xl" />
                </IconButton>
              </Box>
              <AnimatedImage
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={images[currentIndex]}
                alt={`${t('book.imageAlt')} ${currentIndex + 1}`}
                maxWidth="full"
                maxHeight="full"
                fit="contain"
              />
            </Box>
          </Animated>
        )}
      </Presence>
    </Section>
  );
};

export default BookShowcase;
