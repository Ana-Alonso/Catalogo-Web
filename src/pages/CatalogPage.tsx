import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/HeroSection';
import GallerySection from '../components/GallerySection';
import { useProducts } from '../hooks/useProducts';
import { useWorkshopSpots } from '../hooks/useWorkshopSpots';
import type { CategoryType } from '../types/catalog';

export const CatalogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('todas');
  const { products } = useProducts();
  const { counts, register } = useWorkshopSpots();

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-50 selection:bg-orange-600 selection:text-white font-sans overflow-x-hidden">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:p-4 focus:bg-orange-600 focus:text-white focus:top-4 focus:left-4 rounded-md shadow-lg"
      >
        Saltar al contenido principal
      </a>

      <Navbar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
      />
      
      <main id="main-content">
        <HeroSection />
        <GallerySection 
          items={products} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
          spotsCounts={counts}
          onRegister={(item, data) => register(item.id, data, item.cupo ?? null)}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;
