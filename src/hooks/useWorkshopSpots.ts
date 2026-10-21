import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchRegistrationCounts, createRegistration } from '../services/registrationService';
import { logError } from '../utils/logger';
import type { RegistrationFormData } from '../types/registrations';

interface UseWorkshopSpotsResult {
  counts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  register: (
    productId: string,
    data: RegistrationFormData,
    cupo: number | null
  ) => Promise<void>;
  refreshSpots: () => Promise<void>;
}

export const useWorkshopSpots = (): UseWorkshopSpotsResult => {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRegistrationCounts();
      setCounts(data);
    } catch (err) {
      logError('useWorkshopSpots.loadSpots', err);
      setError(t('catalog.spotsError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        const data = await fetchRegistrationCounts();
        if (!isCancelled) {
          setCounts(data);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          logError('useWorkshopSpots.init', err);
          setError(t('catalog.spotsError'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isCancelled = true;
    };
  }, [t]);

  const register = async (
    productId: string,
    data: RegistrationFormData,
    cupo: number | null
  ): Promise<void> => {
    await createRegistration(productId, data, cupo);
    setCounts((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  return {
    counts,
    isLoading,
    error,
    register,
    refreshSpots: loadSpots,
  };
};
