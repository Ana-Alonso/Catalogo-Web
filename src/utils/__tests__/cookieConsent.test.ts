import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CONSENT_POLICY_VERSION,
  clearCookieConsent,
  readCookieConsent,
  readCookieConsentSnapshot,
  readServerConsentSnapshot,
  subscribeToCookieConsent,
  writeCookieConsent,
} from '../cookieConsent';

const CONSENT_STORAGE_KEY = 'laurel_cookie_consent';
const DAY_MS = 24 * 60 * 60 * 1000;

const seedConsent = (consent: Record<string, unknown>): void => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
};

const agedConsent = (daysAgo: number, analytics: boolean): Record<string, unknown> => ({
  analytics,
  updatedAt: new Date(Date.now() - daysAgo * DAY_MS).toISOString(),
  policyVersion: CONSENT_POLICY_VERSION,
});

beforeEach(() => {
  window.localStorage.clear();
});

describe('readCookieConsent', () => {
  it('devuelve null cuando todavía no hay decisión guardada', () => {
    expect(readCookieConsent()).toBeNull();
  });

  it('recupera una decisión recién escrita', () => {
    writeCookieConsent(true);

    const consent = readCookieConsent();

    expect(consent?.analytics).toBe(true);
    expect(consent?.policyVersion).toBe(CONSENT_POLICY_VERSION);
  });

  it('caduca el consentimiento fuera de los 180 días y limpia el almacenamiento', () => {
    seedConsent(agedConsent(181, true));

    expect(readCookieConsent()).toBeNull();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('mantiene el consentimiento dentro del periodo de validez', () => {
    seedConsent(agedConsent(179, true));

    expect(readCookieConsent()?.analytics).toBe(true);
  });

  it('descarta una versión de política antigua', () => {
    seedConsent({ ...agedConsent(1, true), policyVersion: CONSENT_POLICY_VERSION - 1 });

    expect(readCookieConsent()).toBeNull();
  });

  it('descarta una decisión rechazada solo cuando también ha caducado', () => {
    seedConsent(agedConsent(30, false));
    expect(readCookieConsent()?.analytics).toBe(false);

    seedConsent(agedConsent(181, false));
    expect(readCookieConsent()).toBeNull();
  });

  it('devuelve null cuando el valor almacenado no es un consentimiento válido', () => {
    seedConsent({ analytics: 'si' });
    expect(readCookieConsent()).toBeNull();

    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'no-es-json');
    expect(readCookieConsent()).toBeNull();
  });
});

describe('readCookieConsentSnapshot', () => {
  it('marca el estado como pendiente cuando no hay decisión', () => {
    expect(readCookieConsentSnapshot()).toEqual({ status: 'pending', analytics: false });
  });

  it('distingue concedido de rechazado', () => {
    seedConsent(agedConsent(1, true));
    expect(readCookieConsentSnapshot().status).toBe('granted');

    seedConsent(agedConsent(1, false));
    expect(readCookieConsentSnapshot()).toEqual({ status: 'rejected', analytics: false });
  });

  it('devuelve la misma referencia mientras el almacenamiento no cambie', () => {
    seedConsent(agedConsent(1, true));

    expect(readCookieConsentSnapshot()).toBe(readCookieConsentSnapshot());
  });

  it('anuncia un estado desconocido en el servidor', () => {
    seedConsent(agedConsent(1, true));

    expect(readServerConsentSnapshot()).toEqual({ status: 'unknown', analytics: false });
  });
});

describe('subscribeToCookieConsent', () => {
  it('avisa a los suscriptores al escribir y al borrar la decisión', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToCookieConsent(listener);

    writeCookieConsent(true);
    clearCookieConsent();

    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    writeCookieConsent(false);

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
