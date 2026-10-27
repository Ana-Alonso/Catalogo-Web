export interface CookieConsent {
  analytics: boolean;
  updatedAt: string;
  policyVersion: number;
}

export type ConsentStatus = 'unknown' | 'pending' | 'granted' | 'rejected';
