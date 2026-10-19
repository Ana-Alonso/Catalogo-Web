import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag, Tag, Calendar, MapPin, Sparkles, Users, UserPlus } from 'lucide-react';
import { Badge, Box, Typography, Button } from './ui';
import { Modal } from './ui/Modal';
import { WorkshopSignupForm } from './WorkshopSignupForm';
import { theme } from '../theme';
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

const statusConfig: Record<AvailabilityStatus, { label: string; badgeVariant: 'primary' | 'neutral' | 'outline' }> = {
  disponible: { label: 'Disponible', badgeVariant: 'primary' },
  reservado: { label: 'Reservado', badgeVariant: 'neutral' },
  vendido: { label: 'Vendido / Finalizado', badgeVariant: 'outline' },
};

export const ProductCard: React.FC<ProductCardProps> = ({ item, spotsCount, onRegister }) => {
  const currentStatus = item.status || 'disponible';
  const statusInfo = statusConfig[currentStatus];
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const isWorkshop = item.category === 'talleres';
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
      className={`group ${theme.colors.surface}/90 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-orange-950/20 transition-all duration-300 border ${
        item.featured ? 'border-orange-500/60 ring-1 ring-orange-500/40' : theme.colors.border
      } hover:border-neutral-700 focus-within:ring-2 ${theme.colors.primaryFocus}`}
    >
      <Box className="relative aspect-square overflow-hidden bg-neutral-800">
        <img 
          src={item.image} 
          alt={`Obra: ${item.title}`} 
          className={`w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out ${
            currentStatus === 'vendido' ? 'opacity-50' : ''
          }`}
          loading="lazy"
        />
        <Box 
          className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" 
          aria-hidden="true"
        />

        {item.featured && (
          <Box className="absolute top-3 left-3 bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Destacado
          </Box>
        )}
        
        {item.price && (
          <span className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-700 text-orange-400 font-bold text-xs uppercase px-2.5 py-1 rounded-sm">
            {item.price}
          </span>
        )}
      </Box>

      <Box className="p-6 flex flex-col flex-grow">
        <Box className="mb-2">
          <Box className="flex items-center gap-2 mb-1">
            <Badge variant="primary">
              {item.category}
            </Badge>
            <Badge variant={statusInfo.badgeVariant}>
              {statusInfo.label}
            </Badge>
          </Box>
          <Typography variant="h4" className="mt-1">{item.title}</Typography>
        </Box>

        {item.category === 'talleres' && (item.eventDate || item.eventLocation) && (
          <Box className="my-2 p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1 text-xs text-neutral-300">
            {item.eventDate && (() => {
              const parsed = new Date(item.eventDate);
              const formatted = isNaN(parsed.getTime())
                ? item.eventDate
                : parsed.toLocaleString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
              return (
                <Box className="flex items-center gap-2 text-orange-400 font-medium capitalize">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formatted}</span>
                </Box>
              );
            })()}
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
                <span className="text-neutral-400">Inscripción abierta</span>
              ) : isFull ? (
                <span className="text-red-400">Completo · no quedan plazas</span>
              ) : (
                <span className="text-green-400">
                  Quedan {spotsLeft} de {cupo} plazas
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
              aria-label={`Apuntarse al taller ${item.title}`}
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              Apuntarse al taller
            </Button>
          )}
          {isWorkshop && isFull && !isFinished && (
            <Box className="text-center py-2.5 text-xs text-red-400 font-semibold uppercase tracking-wider bg-red-950/30 rounded border border-red-900/50">
              Taller completo
            </Box>
          )}
          {item.etsyLink && currentStatus !== 'vendido' && (
            <a 
              href={item.etsyLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex justify-center items-center gap-2 ${theme.colors.primary} font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`}
              aria-label={`Comprar ${item.title} en Etsy`}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {item.category === 'talleres' ? 'Reservar Plaza en Etsy' : 'Comprar en Etsy'}
            </a>
          )}
          {item.vintedLink && currentStatus !== 'vendido' && (
            <a 
              href={item.vintedLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex justify-center items-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white font-semibold py-3 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-sm`}
              aria-label={`Comprar ${item.title} en Vinted`}
            >
              <Tag className="w-4 h-4" aria-hidden="true" />
              Ver en Vinted
            </a>
          )}
          {currentStatus === 'vendido' && (
            <Box className="text-center py-2.5 text-xs text-neutral-500 font-semibold uppercase tracking-wider bg-neutral-950 rounded border border-neutral-800">
              Pieza no disponible
            </Box>
          )}
        </Box>
      </Box>
    </motion.article>

    <Modal
      isOpen={isSignupOpen}
      onClose={() => setIsSignupOpen(false)}
      title="Inscripción al taller"
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
