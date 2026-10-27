import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { CookieConsentContext, type CookieConsentContextValue } from './CookieConsentContext';
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsentSnapshot,
  readServerConsentSnapshot,
  subscribeToCookieConsent,
  writeCookieConsent,
} from '../../utils/cookieConsent';
import { startAnalytics, stopAnalytics } from '../../utils/analytics';

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const snapshot = useSyncExternalStore(
    subscribeToCookieConsent,
    readCookieConsentSnapshot,
    readServerConsentSnapshot
  );

  useEffect(() => {
    if (snapshot.analytics) {
      startAnalytics();
    }
  }, [snapshot.analytics]);

  useEffect(() => {
    const handleOpenSettings = (): void => setSettingsOpen(true);

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);

    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    };
  }, []);

  const applyDecision = useCallback((analytics: boolean): void => {
    writeCookieConsent(analytics);

    if (analytics) {
      startAnalytics();
      return;
    }

    stopAnalytics();
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      status: snapshot.status,
      analyticsEnabled: snapshot.analytics,
      isSettingsOpen,
      acceptAll: () => applyDecision(true),
      rejectAll: () => applyDecision(false),
      savePreferences: applyDecision,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [snapshot, isSettingsOpen, applyDecision]
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
};
