import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Variants } from 'framer-motion';
import { ShoppingBag, Tag, Calendar, MapPin, Users, UserPlus } from 'lucide-react';
import { AnimatedCard, Badge, Box, Button, Image, Typography, Icon } from '../ui';
import { Modal } from '../ui/Modal';
import { WorkshopSignupForm } from '../workshop/WorkshopSignupForm';
import { ProductDescription } from './ProductDescription';
import {
  formatPriceForLanguage,
  formatRegistrationDeadlineForLanguage,
  formatWorkshopDateForLanguage,
} from '../../i18n/formatters';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../../i18n/labels';
import { getDiscountedCents, getOfferPercent, isOfferActive } from '../../utils/price';
import { getDaysUntilRegistrationDeadline } from '../../utils/registrationDeadline';
import { getWorkshopSignupState } from '../../utils/workshopSignupState';
import { useNow } from '../../hooks/useNow';
import type { CatalogItem, AvailabilityStatus } from '../../types/catalog';
import type { RegistrationFormData } from '../../types/registrations';

interface ProductCardProps {
  item: CatalogItem;
  spotsCount?: number;
  onRegister?: (data: RegistrationFormData) => Promise<void>;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const statusBadgeVariants: Record<AvailabilityStatus, 'primary' | 'neutral' | 'outline'> = {
  disponible: 'primary',
  reservado: 'neutral',
  vendido: 'outline',
};

export const ProductCard: React.FC<ProductCardProps> = ({ item, spotsCount, onRegister }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const currentStatus = item.status || 'disponible';
  const statusBadgeVariant = statusBadgeVariants[currentStatus];
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const descriptionId = `product-description-${item.id}`;

  const isWorkshop = item.category === 'talleres';
  const nowMs = useNow();
  const hasOffer = isOfferActive(item);
  const priceCents = item.priceCents ?? null;
  const finalCents = getDiscountedCents(priceCents, getOfferPercent(item));
  const finalPrice = formatPriceForLanguage(finalCents, item.currency, language);
  const cupo = item.cupo ?? null;
  const registeredCount = spotsCount ?? 0;
  const spotsLeft = cupo === null ? null : Math.max(cupo - registeredCount, 0);
  const isFull = spotsLeft === 0;
  const isFinished = currentStatus === 'vendido';
  const signupState = isWorkshop ? getWorkshopSignupState(item, registeredCount, nowMs) : null;
  const canSignup = signupState === 'abierto' && Boolean(onRegister);
  const daysLeft = getDaysUntilRegistrationDeadline(item.registrationDeadline, nowMs);
  const registrationDeadlineLabel = item.registrationDeadline
    ? formatRegistrationDeadlineForLanguage(item.registrationDeadline, language)
    : null;

  return (
    <>
    <AnimatedCard
      variants={itemVariants}
      group
      background="card"
      rounded="lg"
      overflow="hidden"
      display="flex"
      direction="column"
      hoverShadow="spotlight"
      cssTransition="allSlow"
      border
      hoverBorder="muted"
      focusRing="withinPrimary"
    >
      <Box position="relative" aspect="square" overflow="hidden" background="strong">
        <Image
          src={item.image}
          alt={t('product.imageAlt', { title: item.title })}
          fullWidth
          height="full"
          position="center"
          effect="gallery"
          opacity={currentStatus === 'vendido' ? 50 : undefined}
          loading="lazy"
        />
        <Box position="absolute" inset gradient="fadeUp" opacity={80} aria-hidden="true" />

        <Box position="absolute" corner="top-right" display="flex" direction="column" align="end" gap="xs">
          {hasOffer && (
            <Badge variant="solid">{t('product.offerBadge')}</Badge>
          )}
          <Badge
            variant="glass"
            aria-label={
              priceCents == null
                ? t('product.priceOnRequest')
                : hasOffer
                  ? t('product.offerAria', { finalPrice })
                  : t('product.priceAria', { price: finalPrice })
            }
          >
            {priceCents == null ? (
              t('product.consult')
            ) : hasOffer ? (
              <Typography as="span" size="xs" tone="warning" weight="medium" transform="none">
                {finalPrice}
              </Typography>
            ) : (
              finalPrice
            )}
          </Badge>
        </Box>
      </Box>

      <Box padding="lg" display="flex" direction="column" grow>
        <Box marginBottom="sm">
          <Box display="flex" align="center" gap="sm" marginBottom="xs">
            <Badge variant="primary">
              {t(categoryTranslationKeys[item.category])}
            </Badge>
            <Badge variant={statusBadgeVariant}>
              {t(availabilityTranslationKeys[currentStatus])}
            </Badge>
          </Box>
          <Typography variant="h4" marginTop="xs" clamp={2} title={item.title}>
            {item.title}
          </Typography>
        </Box>

        {item.category === 'talleres' && (item.eventDate || item.eventLocation) && (
          <Box marginY="sm" padding="sm" rounded="sm" background="neutral" border>
            {item.eventDate && (
              <Box display="flex" align="center" gap="sm" marginBottom="xs">
                <Icon as={Calendar} size="sm" tone="warning" shrink={false} />
                <Typography
                  as="span"
                  variant="body"
                  size="xs"
                  tone="warning"
                  weight="medium"
                  transform="capitalize"
                >
                  {formatWorkshopDateForLanguage(item.eventDate, language)}
                </Typography>
              </Box>
            )}
            {item.eventLocation && (
              <Box display="flex" align="center" gap="sm">
                <Icon as={MapPin} size="sm" tone="muted" shrink={false} />
                <Typography as="span" variant="body" size="xs" tone="muted">
                  {item.eventLocation}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <ProductDescription id={descriptionId} text={item.description} />
        
        <Box display="flex" direction="column" gap="sm" marginTop="auto">
          {isWorkshop && !isFinished && (signupState === 'abierto' || signupState === 'lleno') && (
            <Box display="flex" align="center" gap="sm">
              <Icon as={Users} size="sm" tone="warning" shrink={false} />
              <Box display="flex" direction="column" gap="xs">
                {cupo === null ? (
                  <Typography variant="caption" tone="muted">{t('product.spotsOpen')}</Typography>
                ) : isFull ? (
                  <Typography variant="caption" tone="danger">{t('product.spotsFull')}</Typography>
                ) : (
                  <Typography variant="caption" tone="success">
                    {t('product.spotsLeft', { spots: spotsLeft, total: cupo })}
                  </Typography>
                )}
                {registrationDeadlineLabel && signupState === 'abierto' && (
                  <Typography variant="caption" tone="muted">
                    {t('product.registrationDeadline', { date: registrationDeadlineLabel })}
                  </Typography>
                )}
                {signupState === 'abierto' && daysLeft !== null && daysLeft > 0 && (
                  <Typography variant="caption" tone="muted">
                    {daysLeft === 1
                      ? t('product.registrationDayLeft')
                      : t('product.registrationDaysLeft', { days: daysLeft })}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          {isWorkshop && !isFinished && signupState === 'cerrado' && (
            <Box textAlign="center" paddingY="sm" background="neutral" border rounded="sm">
              <Typography variant="caption" tone="muted">
                {registrationDeadlineLabel
                  ? t('product.registrationClosed', { date: registrationDeadlineLabel })
                  : t('product.registrationClosedNoDate')}
              </Typography>
            </Box>
          )}
          {isWorkshop && !isFinished && signupState === 'terminado' && (
            <Box textAlign="center" paddingY="sm" background="neutral" border rounded="sm">
              <Typography variant="caption" tone="muted">{t('product.workshopPassed')}</Typography>
            </Box>
          )}
          {canSignup && (
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsSignupOpen(true)}
              aria-label={t('product.signupAria', { title: item.title })}
            >
              <Icon as={UserPlus} />
              {t('product.signup')}
            </Button>
          )}
          {isWorkshop && !isFinished && signupState === 'lleno' && (
            <Box textAlign="center" paddingY="sm" background="dangerSoft" border borderTone="danger" rounded="sm">
              <Typography variant="caption" tone="danger">{t('product.workshopFull')}</Typography>
            </Box>
          )}
          {!isWorkshop && item.etsyLink && currentStatus !== 'vendido' && (
            <Button
              href={item.etsyLink}
              target="_blank"
              rel="noopener noreferrer"
              size="card"
              fullWidth
              aria-label={t('product.buyEtsyAria', { title: item.title })}
            >
              <Icon as={ShoppingBag} />
              {t('product.buyEtsy')}
            </Button>
          )}
          {!isWorkshop && item.vintedLink && currentStatus !== 'vendido' && (
            <Button
              href={item.vintedLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="card"
              fullWidth
              aria-label={t('product.viewVintedAria', { title: item.title })}
            >
              <Icon as={Tag} />
              {t('product.viewVinted')}
            </Button>
          )}
          {currentStatus === 'vendido' && (
            <Box textAlign="center" paddingY="sm" background="neutral" border rounded="sm">
              <Typography variant="caption" tone="subtle">{t('product.unavailable')}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </AnimatedCard>

    <Modal
      isOpen={isSignupOpen}
      onClose={() => setIsSignupOpen(false)}
      title={t('product.signupModalTitle')}
    >
      {onRegister && (
        <WorkshopSignupForm
          workshop={item}
          onRegister={onRegister}
          onClose={() => setIsSignupOpen(false)}
        />
      )}
    </Modal>
    </>
  );
};

export default ProductCard;
