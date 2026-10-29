import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const readPreference = (): boolean =>
  typeof window === 'undefined'
    ? false
    : window.matchMedia(REDUCED_MOTION_QUERY).matches;

export const usePrefersReducedMotion = (): boolean => {
  const [isReduced, setIsReduced] = useState(readPreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const handleChange = (): void => {
      setIsReduced(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isReduced;
};

export default usePrefersReducedMotion;
