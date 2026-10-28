import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  cancelWorkshopRegistrations as cancelWorkshopRegistrationsService,
} from '../services/registrationService';
import { logError } from '../utils/logger';
import type { WorkshopRegistration, RegistrationStatus } from '../types/registrations';

interface UseRegistrationsResult {
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  setStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  cancelWorkshopRegistrations: (productId: string) => Promise<boolean>;
  refreshRegistrations: () => Promise<void>;
}

export const useRegistrations = (): UseRegistrationsResult => {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (err) {
      logError('useRegistrations.loadRegistrations', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.loadRegistrations');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        const data = await fetchRegistrations();
        if (!isCancelled) {
          setRegistrations(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          logError('useRegistrations.init', err);
          const msg = err instanceof Error ? err.message : t('admin.errors.loadRegistrations');
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isCancelled = true;
    };
  }, [t]);

  const setStatus = async (id: string, status: RegistrationStatus): Promise<boolean> => {
    try {
      const updated = await updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((registration) => (registration.id === id ? updated : registration))
      );
      return true;
    } catch (err) {
      logError('useRegistrations.setStatus', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.updateRegistration');
      setError(msg);
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((registration) => registration.id !== id));
      return true;
    } catch (err) {
      logError('useRegistrations.remove', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.deleteRegistration');
      setError(msg);
      return false;
    }
  };

  const cancelWorkshopRegistrations = async (
    productId: string
  ): Promise<boolean> => {
    try {
      await cancelWorkshopRegistrationsService(productId);
      setRegistrations((prev) =>
        prev.map((registration) =>
          registration.product_id === productId &&
          registration.status !== 'cancelado'
            ? { ...registration, status: 'cancelado' }
            : registration
        )
      );
      return true;
    } catch (err) {
      logError('useRegistrations.cancelWorkshopRegistrations', err);
      const msg = err instanceof Error ? err.message : t('admin.errors.cancelWorkshop');
      setError(msg);
      return false;
    }
  };

  return {
    registrations,
    isLoading,
    error,
    setStatus,
    remove,
    cancelWorkshopRegistrations,
    refreshRegistrations: loadRegistrations,
  };
};
