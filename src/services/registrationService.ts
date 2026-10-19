import { supabase, isSupabaseConfigured } from '../utils/supabase';
import type {
  WorkshopRegistration,
  RegistrationFormData,
  RegistrationStatus,
} from '../types/registrations';

const LOCAL_STORAGE_KEY = 'laurel_workshop_registrations';
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const getStoredLocalRegistrations = (): WorkshopRegistration[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WorkshopRegistration[]) : [];
  } catch {
    return [];
  }
};

const saveStoredLocalRegistrations = (items: WorkshopRegistration[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
};

const mapRegistrationError = (code: string | undefined, message: string): string => {
  if (code === '23505') {
    return 'Ya estás apuntado a este taller con este email.';
  }
  if (message.includes('workshop_full')) {
    return 'El taller está completo: no quedan plazas.';
  }
  return 'No se pudo completar la inscripción. Inténtalo de nuevo.';
};

export const fetchRegistrations = async (): Promise<WorkshopRegistration[]> => {
  if (!useMocks) {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as WorkshopRegistration[];
  }

  return getStoredLocalRegistrations();
};

export const fetchRegistrationCounts = async (): Promise<Record<string, number>> => {
  const registrations = await fetchRegistrations();

  return registrations.reduce<Record<string, number>>((counts, registration) => {
    if (registration.status !== 'cancelado') {
      counts[registration.product_id] = (counts[registration.product_id] || 0) + 1;
    }
    return counts;
  }, {});
};

export const createRegistration = async (
  productId: string,
  formData: RegistrationFormData,
  cupo: number | null
): Promise<WorkshopRegistration> => {
  const name = formData.name.trim();
  const email = formData.email.trim();

  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert([{ product_id: productId, name, email }])
      .select()
      .single();

    if (error) {
      throw new Error(mapRegistrationError(error.code, error.message));
    }

    return data as WorkshopRegistration;
  }

  const localRegistrations = getStoredLocalRegistrations();
  const isActiveForWorkshop = (registration: WorkshopRegistration): boolean =>
    registration.product_id === productId && registration.status !== 'cancelado';

  const alreadyRegistered = localRegistrations.some(
    (registration) =>
      isActiveForWorkshop(registration) &&
      registration.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadyRegistered) {
    throw new Error('Ya estás apuntado a este taller con este email.');
  }

  if (cupo !== null && localRegistrations.filter(isActiveForWorkshop).length >= cupo) {
    throw new Error('El taller está completo: no quedan plazas.');
  }

  const newRegistration: WorkshopRegistration = {
    id: `local-${Date.now()}`,
    product_id: productId,
    name,
    email,
    status: 'pendiente',
    created_at: new Date().toISOString(),
  };

  saveStoredLocalRegistrations([newRegistration, ...localRegistrations]);
  return newRegistration;
};

export const updateRegistrationStatus = async (
  id: string,
  status: RegistrationStatus
): Promise<WorkshopRegistration> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(mapRegistrationError(error.code, error.message));
    }

    return data as WorkshopRegistration;
  }

  const localRegistrations = getStoredLocalRegistrations();
  const updated = localRegistrations.map((registration) =>
    registration.id === id ? { ...registration, status } : registration
  );
  saveStoredLocalRegistrations(updated);

  const found = updated.find((registration) => registration.id === id);
  if (!found) {
    throw new Error('Inscripción no encontrada.');
  }
  return found;
};

export const deleteRegistration = async (id: string): Promise<void> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('workshop_registrations')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(mapRegistrationError(error.code, error.message));
    }
    return;
  }

  saveStoredLocalRegistrations(
    getStoredLocalRegistrations().filter((registration) => registration.id !== id)
  );
};
