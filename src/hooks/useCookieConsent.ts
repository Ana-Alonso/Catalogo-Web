import { useContext } from 'react';
import { CookieConsentContext } from '../components/consent/CookieConsentContext';

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent debe usarse dentro de CookieConsentProvider');
  }

  return context;
};
