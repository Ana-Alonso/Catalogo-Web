import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useWindowScroll } from '../../hooks/useWindowScroll';
import { Box, Typography } from '../ui';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { theme } from '../../theme';
import type { CategoryType, NavLinkItem } from '../../types/catalog';
import logoImg from '../../assets/Logo.png';

interface NavbarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const navLinks = [
  { labelKey: 'nav.links.all', category: 'todas', href: '#galeria' },
  { labelKey: 'nav.links.custom', category: 'personalizados', href: '#galeria' },
  { labelKey: 'nav.links.tshirts', category: 'camisetas', href: '#galeria' },
  { labelKey: 'nav.links.illustrations', category: 'ilustraciones', href: '#galeria' },
  { labelKey: 'nav.links.workshops', category: 'talleres', href: '#galeria' },
] as const satisfies readonly NavLinkItem[];

export const Navbar: React.FC<NavbarProps> = ({ 
  activeCategory, 
  onSelectCategory
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useWindowScroll(20);

  const handleLinkClick = (category: CategoryType) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-neutral-950/90 backdrop-blur-md shadow-lg shadow-black/50 border-b border-neutral-800' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={t('nav.ariaLabel')}>
        <Box className="flex justify-between items-center h-20">
          <a 
            href="#" 
            onClick={() => handleLinkClick('todas')}
            className={`flex-shrink-0 flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} rounded-sm group`}
            aria-label={t('nav.homeAria')}
          >
            <img 
              src={logoImg} 
              alt={t('nav.logoAlt')}
              className="h-11 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105" 
            />
            <Typography variant="h4" as="span" className="tracking-widest uppercase hidden sm:inline">
              <Trans
                i18nKey="brand.name"
                components={{ highlight: <span className={theme.colors.primaryText} /> }}
              />
            </Typography>
          </a>

          <Box className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.category;
              return (
                <a
                  key={link.category}
                  href={link.href}
                  onClick={() => handleLinkClick(link.category)}
                  className={`text-sm font-medium tracking-wide uppercase px-3 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                    isActive 
                      ? 'text-orange-500 font-semibold' 
                      : 'text-neutral-300 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(link.labelKey)}
                </a>
              );
            })}
            <LanguageSwitcher />
          </Box>

          <Box className="md:hidden flex items-center gap-2">
            <LanguageSwitcher onSelect={() => setIsOpen(false)} />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`text-neutral-300 hover:text-white p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus}`}
              aria-expanded={isOpen}
              aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </Box>
        </Box>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-neutral-900 border-b border-neutral-800 rounded-b-lg overflow-hidden"
            >
              <Box className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                {navLinks.map((link) => {
                  const isActive = activeCategory === link.category;
                  return (
                    <a
                      key={link.category}
                      href={link.href}
                      onClick={() => handleLinkClick(link.category)}
                      className={`block px-3 py-3 text-base font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme.colors.primaryFocus} ${
                        isActive
                          ? 'text-orange-500 bg-neutral-800/80 font-semibold'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t(link.labelKey)}
                    </a>
                  );
                })}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
