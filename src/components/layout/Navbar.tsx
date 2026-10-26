import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Animated, Box, Container, Header as UIHeader, IconButton, Image, NavLink, Presence, Typography } from '../ui';
import { Menu, X } from 'lucide-react';
import { useWindowScroll } from '../../hooks/useWindowScroll';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
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
    <UIHeader
      variant={isScrolled ? 'default' : 'transparent'}
      position="fixed"
      elevated={isScrolled}
    >
      <Container as="nav" aria-label={t('nav.ariaLabel')}>
        <Box display="flex" justify="between" align="center" height="nav">
          <Box
            as="a"
            href="#"
            onClick={() => handleLinkClick('todas')}
            shrink={false}
            display="flex"
            align="center"
            gap="tight"
            cursor="pointer"
            focusRing="plain"
            rounded="sm"
            group
            aria-label={t('nav.homeAria')}
          >
            <Image
              src={logoImg}
              alt={t('nav.logoAlt')}
              height={11}
              width="auto"
              maxWidth="logo"
              fit="contain"
              effect="zoomFast"
            />
            <Typography
              variant="h4"
              as="span"
              tracking="widest"
              transform="uppercase"
              display="inline"
              hideBelow="sm"
            >
              <Trans
                i18nKey="brand.name"
                components={{ highlight: <Typography as="span" variant="plain" tone="primary" /> }}
              />
            </Typography>
          </Box>

          <Box display="flex" align="center" gap="lg" hideBelow="md">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.category;
              return (
                <NavLink
                  key={link.category}
                  href={link.href}
                  onClick={() => handleLinkClick(link.category)}
                  active={isActive}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(link.labelKey)}
                </NavLink>
              );
            })}
            <LanguageSwitcher />
          </Box>

          <Box display="flex" align="center" gap="sm" showBelow="md">
            <LanguageSwitcher onSelect={() => setIsOpen(false)} />
            <IconButton
              variant="ghost"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </IconButton>
          </Box>
        </Box>

        <Presence>
          {isOpen && (
            <Animated
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              hideFrom="md"
              background="surface"
              divider="bottom"
              rounded="bottom-lg"
              overflow="hidden"
            >
              <Box
                display="flex"
                direction="column"
                align="stretch"
                gap="xs"
                paddingX="sm"
                paddingTop="sm"
                paddingBottom="md"
              >
                {navLinks.map((link) => {
                  const isActive = activeCategory === link.category;
                  return (
                    <NavLink
                      key={link.category}
                      variant="mobile"
                      href={link.href}
                      onClick={() => handleLinkClick(link.category)}
                      active={isActive}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t(link.labelKey)}
                    </NavLink>
                  );
                })}
              </Box>
            </Animated>
          )}
        </Presence>
      </Container>
    </UIHeader>
  );
};

export default Navbar;
