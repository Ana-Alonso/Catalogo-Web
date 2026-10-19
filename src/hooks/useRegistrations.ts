import { useState, useEffect, useCallback } from 'react';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from '../services/registrationService';
import type { WorkshopRegistration, RegistrationStatus } from '../types/registrations';

interface UseRegistrationsResult {
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  setStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  refreshRegistrations: () => Promise<void>;
}

export const useRegistrations = (): UseRegistrationsResult => {
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
      const msg = err instanceof Error ? err.message : 'Error desconocido al cargar inscripciones';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          const msg = err instanceof Error ? err.message : 'Error desconocido al cargar inscripciones';
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isCancelled = true;
    };
  }, []);

  const setStatus = async (id: string, status: RegistrationStatus): Promise<boolean> => {
    try {
      const updated = await updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((registration) => (registration.id === id ? updated : registration))
      );
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar la inscripción';
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
      const msg = err instanceof Error ? err.message : 'Error al eliminar la inscripción';
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
    refreshRegistrations: loadRegistrations,
  };
};
