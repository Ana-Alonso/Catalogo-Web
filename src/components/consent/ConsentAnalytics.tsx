import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useCookieConsent } from '../../hooks/useCookieConsent';

export const ConsentAnalytics: React.FC = () => {
  const { analyticsEnabled } = useCookieConsent();

  return analyticsEnabled ? <Analytics /> : null;
};

export default ConsentAnalytics;
