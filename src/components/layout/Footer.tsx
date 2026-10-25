import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ShoppingBag, Mail } from 'lucide-react';
import { Box, Typography } from '../ui';
import logoImg from '../../assets/Logo.png';
import { theme } from '../../theme';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const etsyUrl = import.meta.env.VITE_ETSY_SHOP_URL;
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const amazonBookUrl = import.meta.env.VITE_AMAZON_BOOK_URL;

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8" aria-labelledby="footer-heading">
      <Typography as="h2" id="footer-heading" className="sr-only">{t('footer.heading')}</Typography>
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Box className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt={t('nav.logoAlt')}
              className="h-11 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105" 
            />
            <Typography variant="h4" className="tracking-widest uppercase">
              <Trans
                i18nKey="brand.name"
                components={{ highlight: <span className={theme.colors.primaryText} /> }}
              />
            </Typography>
          </Box>

          <Box className="flex items-center space-x-6">
            <a 
              href={`mailto:${contactEmail}`}
              className="text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center gap-2 text-sm"
              aria-label={t('footer.emailAria', { email: contactEmail })}
              title={contactEmail}
            >
              <Mail className="h-6 w-6" aria-hidden="true" />
              <span className="hidden sm:inline font-mono text-xs">{contactEmail}</span>
            </a>
            <a 
              href={amazonBookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center"
              aria-label={t('footer.amazonAria', 'Comprar libro en Amazon')}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.24-1.276-1.817-2.108-1.739 1.776-2.97 2.308-5.227 2.308-2.667 0-4.744-1.645-4.744-4.94 0-2.576 1.396-4.329 3.383-5.186 1.722-.754 4.128-.889 5.967-.889v-.411c0-.754.059-1.645-.384-2.296-.384-.579-1.12-.818-1.77-.818-1.202 0-2.274.616-2.537 1.894-.055.283-.26.56-.544.575l-3.056-.333c-.257-.058-.54-.266-.47-.66.705-3.717 4.068-4.838 7.082-4.838 1.542 0 3.558.411 4.778 1.58 1.545 1.496 1.396 3.492 1.396 5.662v5.122c0 1.54.64 2.215 1.24 3.047.211.292.257.644-.005.86-.662.555-1.84 1.58-2.489 2.156l-.009-.006z"/>
              </svg>
            </a>
            <a 
              href={etsyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center"
              aria-label={t('footer.etsyAria')}
            >
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </a>
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center"
              aria-label={t('footer.instagramAria')}
            >
              <svg 
                className="h-6 w-6 fill-none stroke-current stroke-2" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a 
              href={tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm p-1 inline-flex items-center justify-center"
              aria-label={t('footer.tiktokAria')}
            >
              <svg 
                className="h-6 w-6 fill-none stroke-current stroke-2" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </Box>
        </Box>
        
        <Box className="mt-8 border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography variant="body" className="text-neutral-500 text-center md:text-left">
            {t('footer.copyright', { year: currentYear })}
          </Typography>
          <Box className="flex gap-4 text-sm text-neutral-500">
            <Typography as="span" variant="caption" className="hover:text-neutral-300 transition-colors cursor-default">
              {t('footer.accessibility')}
            </Typography>
            <Typography as="span" variant="caption" className="hover:text-neutral-300 transition-colors cursor-default">
              {t('footer.legal')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
