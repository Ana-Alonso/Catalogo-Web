import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/HeroSection';
import BookShowcase from '../components/BookShowcase';
import GallerySection from '../components/GallerySection';
import JsonLd from '../components/seo/JsonLd';
import { Container } from '../components/ui';
import { useProducts } from '../hooks/useProducts';
import { useWorkshopSpots } from '../hooks/useWorkshopSpots';
import { normalizeLanguage } from '../i18n/languages';
import { buildHomeStructuredData, getSocialLinks } from '../seo/jsonLd';
import { getSiteUrl } from '../seo/site';
import type { CategoryType } from '../types/catalog';

export const CatalogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const structuredData = useMemo(
    () =>
      buildHomeStructuredData(language, t('meta.description'), {
        siteUrl: getSiteUrl(),
        socialLinks: getSocialLinks(),
      }),
    [language, t]
  );
  const [activeCategory, setActiveCategory] = useState<CategoryType>('todas');
  const [offersOnly, setOffersOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setNowMs(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);
  const {
    products,
    isLoading,
    error,
    refreshProducts,
  } = useProducts();
  const {
    counts,
    register,
    error: spotsError,
    refreshSpots,
  } = useWorkshopSpots();

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-50 selection:bg-orange-600 selection:text-white font-sans overflow-x-hidden">
      <JsonLd data={structuredData} />
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:p-4 focus:bg-orange-600 focus:text-white focus:top-4 focus:left-4 rounded-md shadow-lg"
      >
        {t('a11y.skipToContent')}
      </a>

      <Navbar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
      />
      
      <main id="main-content">
        <HeroSection 
          items={products}
          onShowNew={() => {
            setNewOnly(true);
            setActiveCategory('todas');
            setOffersOnly(false);
            const gallery = document.getElementById('galeria');
            if (gallery) {
              const navbarHeight = 80;
              const y = gallery.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
        />
        <BookShowcase />
        <Container>
        <GallerySection 
          items={products} 
          activeCategory={activeCategory} 
          onSelectCategory={(cat) => {
            setNewOnly(false);
            setActiveCategory(cat);
          }} 
          offersOnly={offersOnly}
          onToggleOffers={() => setOffersOnly((prev) => !prev)}
          newOnly={newOnly}
          onToggleNew={() => {
            setNewOnly((prev) => !prev);
            if (!newOnly) {
              setActiveCategory('todas');
              setOffersOnly(false);
            }
          }}
          hasNewItems={useMemo(() => {
            if (!nowMs) return false;
            return products.some((item) => {
              if (item.isVisible === false) return false;
              if (!item.created_at) return false;
              const createdAt = new Date(item.created_at);
              if (Number.isNaN(createdAt.getTime())) return false;
              const diffHours = (nowMs - createdAt.getTime()) / (1000 * 60 * 60);
              return diffHours >= 0 && diffHours <= 24;
            });
          }, [products, nowMs])}
          spotsCounts={counts}
          onRegister={(item, data) => register(item.id, data, item.cupo ?? null)}
          isLoading={isLoading}
          error={error}
          onRetry={refreshProducts}
          spotsError={spotsError}
          onRetrySpots={refreshSpots}
        />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;
