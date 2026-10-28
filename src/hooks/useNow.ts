import { useEffect, useState } from 'react';

const DEFAULT_INTERVAL_MS = 30_000;

const getCurrentTime = (): number => Date.now();

export const useNow = (intervalMs: number = DEFAULT_INTERVAL_MS): number => {
  const [nowMs, setNowMs] = useState(getCurrentTime);

  useEffect(() => {
    const refresh = (): void => setNowMs(getCurrentTime());
    const timer = window.setInterval(refresh, intervalMs);

    document.addEventListener('visibilitychange', refresh);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [intervalMs]);

  return nowMs;
};
