import type { CatalogItem } from '../types/catalog';

const now = new Date();
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

export const mockCatalogItems: CatalogItem[] = [
  {
    id: "mock-1",
    title: "Ilustración en Acuarela - Oferta",
    description: "Pieza original en acuarela con descuento para ver el bloque de ofertas.",
    category: "ilustraciones",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800",
    etsyLink: "https://www.etsy.com",
    vintedLink: "https://www.vinted.es",
    priceCents: 2500,
    currency: "EUR",
    discountPercent: 20,
    source: "local",
    isVisible: true,
    status: "disponible",
    featured: false,
    created_at: twoDaysAgo
  },
  {
    id: "mock-2",
    title: "Camiseta de Prueba",
    description: "Diseño estampado de prueba sobre prenda textil orgánica.",
    category: "camisetas",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    etsyLink: "https://www.etsy.com",
    vintedLink: "https://www.vinted.es",
    priceCents: 3500,
    currency: "EUR",
    source: "local",
    isVisible: true,
    status: "disponible",
    featured: false
  },
  {
    id: "mock-3",
    title: "Taller Creativo de Pintura",
    description: "Sesión presencial de técnicas mixtas y expresión artística.",
    category: "talleres",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    priceCents: 4500,
    currency: "EUR",
    source: "local",
    isVisible: true,
    status: "disponible",
    featured: false,
    eventDate: "15 Nov 2026 - 18:00h",
    eventLocation: "Estudio Laurel / Presencial",
    created_at: twoDaysAgo
  },
  {
    id: "mock-4",
    title: "Diseño Personalizado Ejemplo",
    description: "Ilustración personalizada de encargo de muestra.",
    category: "personalizados",
    image: "https://images.unsplash.com/photo-1687360441387-9118e47856b4?auto=format&fit=crop&q=80&w=800",
    etsyLink: "https://www.etsy.com",
    priceCents: null,
    currency: "EUR",
    source: "local",
    isVisible: true,
    status: "reservado",
    featured: false
  },
  {
    id: "mock-5",
    title: "Novedad - Ilustración Botánica",
    description: "Acaba de llegar al catálogo. Nueva pieza ilustrada a mano.",
    category: "ilustraciones",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800",
    etsyLink: "https://www.etsy.com",
    vintedLink: "https://www.vinted.es",
    priceCents: 2200,
    currency: "EUR",
    source: "local",
    isVisible: true,
    status: "disponible",
    featured: false,
    created_at: oneHourAgo
  }
];
