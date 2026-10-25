import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag, Tag, Calendar, MapPin, Users, UserPlus } from 'lucide-react';
import { Badge, Box, Typography, Button } from './ui';
import { Modal } from './ui/Modal';
import { WorkshopSignupForm } from './WorkshopSignupForm';
import { theme } from '../theme';
import {
  formatPriceForLanguage,
  formatWorkshopDateForLanguage,
} from '../i18n/formatters';
import {
  availabilityTranslationKeys,
  categoryTranslationKeys,
} from '../i18n/labels';
import { getDiscountedCents, isOfferActive } from '../utils/price';
import type { CatalogItem, AvailabilityStatus } from '../types/catalog';
import type { RegistrationFormData } from '../types/registrations';

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

  const isWorkshop = item.category === 'talleres';
  const hasOffer = isOfferActive(item);
  const priceCents = item.priceCents ?? null;
  const finalCents = hasOffer
    ? getDiscountedCents(priceCents, item.discountPercent)
    : priceCents;
  const finalPrice = formatPriceForLanguage(finalCents, item.currency, language);
  const originalPrice = formatPriceForLanguage(priceCents, item.currency, language);
  const cupo = item.cupo ?? null;
  const registeredCount = spotsCount ?? 0;
  const spotsLeft = cupo === null ? null : Math.max(cupo - registeredCount, 0);
  const isFull = spotsLeft === 0;
  const isFinished = currentStatus === 'vendido';
  const canSignup = isWorkshop && Boolean(onRegister) && !isFull && !isFinished;

  return (
    <>
    <motion.article 
      variants={itemVariants}
      className={`group ${theme.colors.surface}/90 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-orange-950/20 transition-all duration-300 border ${theme.colors.border} hover:border-neutral-700 focus-within:ring-2 ${theme.colors.primaryFocus}`}
    >
      <Box className="relative aspect-square overflow-hidden bg-neutral-800">
        <img 
          src={item.image} 
          alt={t('product.imageAlt', { title: item.title })}
          className={`w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out ${
            currentStatus === 'vendido' ? 'opacity-50' : ''
          }`}
          loading="lazy"
        />
        <Box 
          className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" 
          aria-hidden="true"
        />


        
        <Box className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {hasOffer && (
            <span className="bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded shadow-md">
              -{item.discountPercent}%
            </span>
          )}
          <span
            className="bg-neutral-950/80 backdrop-blur-sm border border-neutral-700 text-orange-400 font-bold text-xs uppercase px-2.5 py-1 rounded-sm"
            aria-label={
              priceCents == null
                ? t('product.priceOnRequest')
                : hasOffer
                  ? t('product.offerAria', {
                      finalPrice,
                      originalPrice,
                      discount: item.discountPercent,
                    })
                  : t('product.priceAria', { price: finalPrice })
            }
          >
            {priceCents == null ? (
              t('product.consult')
            ) : hasOffer ? (
              <span className="inline-flex items-center gap-1.5">
                <s className="text-neutral-400 font-medium normal-case">{originalPrice}</s>
                <span>{finalPrice}</span>
              </span>
            ) : (
              finalPrice
            )}
          </span>
        </Box>
      </Box>

      <Box className="p-6 flex flex-col flex-grow">
        <Box className="mb-2">
          <Box className="flex items-center gap-2 mb-1">
            <Badge variant="primary">
              {t(categoryTranslationKeys[item.category])}
            </Badge>
            <Badge variant={statusBadgeVariant}>
              {t(availabilityTranslationKeys[currentStatus])}
            </Badge>
          </Box>
          <Typography variant="h4" className="mt-1">{item.title}</Typography>
        </Box>

        {item.category === 'talleres' && (item.eventDate || item.eventLocation) && (
          <Box className="my-2 p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1 text-xs text-neutral-300">
            {item.eventDate && (
              <Box className="flex items-center gap-2 text-orange-400 font-medium capitalize">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formatWorkshopDateForLanguage(item.eventDate, language)}</span>
              </Box>
            )}
            {item.eventLocation && (
              <Box className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{item.eventLocation}</span>
              </Box>
            )}
          </Box>
        )}

        <Typography variant="body" className="mb-6 flex-grow">
          {item.description}
        </Typography>
        
        <Box className="flex flex-col gap-2.5 mt-auto">
          {isWorkshop && !isFinished && (
            <Box className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 flex-shrink-0 text-orange-400" aria-hidden="true" />
              {cupo === null ? (
                <span className="text-neutral-400">{t('product.spotsOpen')}</span>
              ) : isFull ? (
                <span className="text-red-400">{t('product.spotsFull')}</span>
              ) : (
                <span className="text-green-400">
                  {t('product.spotsLeft', { spots: spotsLeft, total: cupo })}
                </span>
              )}
            </Box>
          )}
          {canSignup && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignupOpen(true)}
              aria-label={t('product.signupAria', { title: item.title })}
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              {t('product.signup')}
            </Button>
          )}
          {isWorkshop && isFull && !isFinished && (
            <Box className="text-center py-2.5 text-xs text-red-400 font-semibold uppercase tracking-wider bg-red-950/30 rounded border border-red-900/50">
              {t('product.workshopFull')}
            </Box>
          )}
          {!isWorkshop && item.etsyLink && currentStatus !== 'vendido' && (
            <a 
              href={item.etsyLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex justify-center items-center gap-2 ${theme.colors.primary} font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`}
              aria-label={t('product.buyEtsyAria', { title: item.title })}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {t('product.buyEtsy')}
            </a>
          )}
          {!isWorkshop && item.vintedLink && currentStatus !== 'vendido' && (
            <a 
              href={item.vintedLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex justify-center items-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`}
              aria-label={t('product.viewVintedAria', { title: item.title })}
            >
              <Tag className="w-4 h-4" aria-hidden="true" />
              {t('product.viewVinted')}
            </a>
          )}
          {currentStatus === 'vendido' && (
            <Box className="text-center py-2.5 text-xs text-neutral-500 font-semibold uppercase tracking-wider bg-neutral-950 rounded border border-neutral-800">
              {t('product.unavailable')}
            </Box>
          )}
        </Box>
      </Box>
    </motion.article>

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
