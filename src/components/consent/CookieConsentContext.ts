import { createContext } from 'react';
import type { ConsentStatus } from '../../types/consent';

export interface CookieConsentContextValue {
  status: ConsentStatus;
  analyticsEnabled: boolean;
  isSettingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);
