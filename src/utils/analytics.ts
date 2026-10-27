const GA_MEASUREMENT_ID = 'G-L9R421RJQB';
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const GA_SCRIPT_ID = 'ga4-loader';
const GA_COOKIE_NAMES = ['_ga', '_gid', '_gat', `_ga_${GA_MEASUREMENT_ID}`];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: [string, ...unknown[]]) => void;
  }
}

let isAnalyticsRunning = false;

const domainSuffixes = (): string[] => {
  const parts = window.location.hostname.split('.');
  const suffixes: string[] = [];

  for (let index = 0; index < parts.length - 1; index += 1) {
    suffixes.push(`.${parts.slice(index).join('.')}`);
  }

  return suffixes;
};

const expireAnalyticsCookies = (): void => {
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';

  for (const name of GA_COOKIE_NAMES) {
    document.cookie = `${name}=; path=/; expires=${expires}`;

    for (const suffix of domainSuffixes()) {
      document.cookie = `${name}=; path=/; domain=${suffix}; expires=${expires}`;
    }
  }
};

const findScript = (): HTMLScriptElement | null =>
  document.querySelector<HTMLScriptElement>(`#${GA_SCRIPT_ID}`);

export const startAnalytics = (): void => {
  if (typeof window === 'undefined' || isAnalyticsRunning) {
    return;
  }

  const dataLayer = window.dataLayer ?? [];
  window.dataLayer = dataLayer;

  const gtag = (...args: [string, ...unknown[]]): void => {
    dataLayer.push(args);
  };

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  if (!findScript()) {
    const script = document.createElement('script');
    script.async = true;
    script.id = GA_SCRIPT_ID;
    script.src = GA_SCRIPT_SRC;
    document.head.appendChild(script);
  }

  isAnalyticsRunning = true;
};

export const stopAnalytics = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  findScript()?.remove();
  window.dataLayer = [];
  window.gtag = undefined;
  expireAnalyticsCookies();
  isAnalyticsRunning = false;
};
