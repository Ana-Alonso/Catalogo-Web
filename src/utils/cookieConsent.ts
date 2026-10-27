import type { ConsentStatus, CookieConsent } from '../types/consent';

const CONSENT_STORAGE_KEY = 'laurel_cookie_consent';
const CONSENT_MAX_AGE_DAYS = 180;

export const CONSENT_POLICY_VERSION = 1;
export const OPEN_COOKIE_SETTINGS_EVENT = 'laurel:open-cookie-settings';

const readStoredConsent = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
};

const storeConsent = (value: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (value === null) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    }
  } catch {
    console.warn('[cookieConsent] localStorage no disponible');
  }
};

const isCookieConsent = (value: unknown): value is CookieConsent => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const consent = value as Record<string, unknown>;

  return (
    typeof consent.analytics === 'boolean' &&
    typeof consent.updatedAt === 'string' &&
    typeof consent.policyVersion === 'number'
  );
};

const isWithinLifetime = (updatedAt: string): boolean => {
  const updatedMs = new Date(updatedAt).getTime();

  if (!Number.isFinite(updatedMs)) {
    return false;
  }

  const maxAgeMs = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - updatedMs <= maxAgeMs;
};

export const readCookieConsent = (): CookieConsent | null => {
  const stored = readStoredConsent();

  if (!stored) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(stored);
  } catch {
    return null;
  }

  if (!isCookieConsent(parsed)) {
    return null;
  }

  if (parsed.policyVersion !== CONSENT_POLICY_VERSION || !isWithinLifetime(parsed.updatedAt)) {
    storeConsent(null);
    return null;
  }

  return parsed;
};

type ConsentListener = () => void;

const consentListeners = new Set<ConsentListener>();

const notifyConsentListeners = (): void => {
  consentListeners.forEach((listener) => listener());
};

export const subscribeToCookieConsent = (listener: ConsentListener): (() => void) => {
  consentListeners.add(listener);

  return () => {
    consentListeners.delete(listener);
  };
};

export interface CookieConsentSnapshot {
  status: ConsentStatus;
  analytics: boolean;
}

const UNKNOWN_SNAPSHOT: CookieConsentSnapshot = { status: 'unknown', analytics: false };

let cachedRaw: string | null = null;
let cachedSnapshot: CookieConsentSnapshot | null = null;

export const readCookieConsentSnapshot = (): CookieConsentSnapshot => {
  const raw = readStoredConsent();

  if (cachedSnapshot !== null && raw === cachedRaw) {
    return cachedSnapshot;
  }

  const consent = readCookieConsent();

  cachedRaw = readStoredConsent();
  cachedSnapshot = consent
    ? {
        status: consent.analytics ? 'granted' : 'rejected',
        analytics: consent.analytics,
      }
    : { status: 'pending', analytics: false };

  return cachedSnapshot;
};

export const readServerConsentSnapshot = (): CookieConsentSnapshot => UNKNOWN_SNAPSHOT;

export const writeCookieConsent = (analytics: boolean): CookieConsent => {
  const consent: CookieConsent = {
    analytics,
    updatedAt: new Date().toISOString(),
    policyVersion: CONSENT_POLICY_VERSION,
  };

  storeConsent(JSON.stringify(consent));
  notifyConsentListeners();
  return consent;
};

export const clearCookieConsent = (): void => {
  storeConsent(null);
  notifyConsentListeners();
};
