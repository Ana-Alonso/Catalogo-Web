import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startAnalytics, stopAnalytics } from '../analytics';

const GA_SCRIPT_ID = 'ga4-loader';
const findScript = (): HTMLScriptElement | null =>
  document.querySelector<HTMLScriptElement>(`#${GA_SCRIPT_ID}`);

beforeEach(() => {
  stopAnalytics();
});

afterEach(() => {
  stopAnalytics();
});

describe('startAnalytics', () => {
  it('inserta el script de gtag y registra la configuración', () => {
    startAnalytics();

    const script = findScript();

    expect(script).not.toBeNull();
    expect(script?.src).toContain('googletagmanager.com/gtag/js');
    expect(typeof window.gtag).toBe('function');
    expect(window.dataLayer).toContainEqual(['config', 'G-L9R421RJQB']);
  });

  it('no duplica el script cuando ya está activa', () => {
    startAnalytics();
    startAnalytics();

    expect(document.querySelectorAll(`#${GA_SCRIPT_ID}`)).toHaveLength(1);
  });

  it('vuelve a crear el script después de haberla detenido', () => {
    startAnalytics();
    stopAnalytics();
    startAnalytics();

    expect(findScript()).not.toBeNull();
  });
});

describe('stopAnalytics', () => {
  it('retira el script y borra gtag y dataLayer', () => {
    startAnalytics();
    stopAnalytics();

    expect(findScript()).toBeNull();
    expect(window.gtag).toBeUndefined();
    expect(window.dataLayer).toEqual([]);
  });

  it('expira las cookies de la analítica', () => {
    document.cookie = '_ga=GS1.1.test';
    expect(document.cookie).toContain('_ga');

    startAnalytics();
    stopAnalytics();

    expect(document.cookie).not.toContain('_ga=');
  });
});
