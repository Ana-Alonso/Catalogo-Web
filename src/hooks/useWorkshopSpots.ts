import { useState, useEffect } from 'react';
import { fetchRegistrationCounts, createRegistration } from '../services/registrationService';
import type { RegistrationFormData } from '../types/registrations';

interface UseWorkshopSpotsResult {
  counts: Record<string, number>;
  isLoading: boolean;
  register: (
    productId: string,
    data: RegistrationFormData,
    cupo: number | null
  ) => Promise<void>;
}

export const useWorkshopSpots = (): UseWorkshopSpotsResult => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        const data = await fetchRegistrationCounts();
        if (!isCancelled) {
          setCounts(data);
        }
      } catch {
        if (!isCancelled) {
          setCounts({});
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
  }, []);

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
    register,
  };
};
