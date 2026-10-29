import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { RegistrationError, mapRegistrationDatabaseError } from '../errors/registrationError';
import {
  readApiErrorCode,
  readRegistrationRow,
} from '../utils/registrationResponse';
import { MOCK_STORAGE_KEYS } from '../mocks/mockStorage';
import { createLocalStore } from './localStore';
import type {
  WorkshopRegistration,
  RegistrationFormData,
  RegistrationStatus,
} from '../types/registrations';

const LOCAL_STORAGE_KEY = MOCK_STORAGE_KEYS.registrations;
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
const registrationStore = createLocalStore<WorkshopRegistration>(LOCAL_STORAGE_KEY);

const mapRegistrationError = (
  code: string | undefined,
  message: string
): RegistrationError => new RegistrationError(mapRegistrationDatabaseError(code, message));

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

  return registrationStore.read();
};

export const hasMarketingConsentRegistrations = (productId: string): boolean =>
  registrationStore.read().some(
    (registration) =>
      registration.product_id === productId && registration.marketing_consent
  );

export const fetchMarketingRegistrations = async (): Promise<
  WorkshopRegistration[]
> => {
  if (!useMocks) {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('marketing_consent', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as WorkshopRegistration[];
  }

  return registrationStore.read()
    .filter((registration) => registration.marketing_consent)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
};

export const fetchRegistrationCounts = async (): Promise<Record<string, number>> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('workshop_spots');

    if (error) {
      throw error;
    }

    return ((data ?? []) as Array<{ product_id: string; taken: number }>).reduce<
      Record<string, number>
    >((counts, row) => {
      counts[row.product_id] = Number(row.taken) || 0;
      return counts;
    }, {});
  }

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
  const privacyConsentAt = formData.privacyConsent ? new Date().toISOString() : null;

  if (!useMocks) {
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        name,
        email,
        privacyConsent: formData.privacyConsent,
        marketingConsent: formData.marketingConsent,
      }),
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new RegistrationError(readApiErrorCode(payload));
    }

    return readRegistrationRow(payload);
  }

  const localRegistrations = registrationStore.read();
  const isActiveForWorkshop = (registration: WorkshopRegistration): boolean =>
    registration.product_id === productId && registration.status !== 'cancelado';

  const alreadyRegistered = localRegistrations.some(
    (registration) =>
      isActiveForWorkshop(registration) &&
      registration.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadyRegistered) {
    throw new RegistrationError('alreadyRegistered');
  }

  if (cupo !== null && localRegistrations.filter(isActiveForWorkshop).length >= cupo) {
    throw new RegistrationError('workshopFull');
  }

  const newRegistration: WorkshopRegistration = {
    id: `local-${crypto.randomUUID()}`,
    product_id: productId,
    name,
    email,
    status: 'pendiente',
    privacy_consent_at: privacyConsentAt,
    marketing_consent: formData.marketingConsent,
    created_at: new Date().toISOString(),
  };

  registrationStore.write([newRegistration, ...localRegistrations]);
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
      throw mapRegistrationError(error.code, error.message);
    }

    return data as WorkshopRegistration;
  }

  const localRegistrations = registrationStore.read();
  const updated = localRegistrations.map((registration) =>
    registration.id === id ? { ...registration, status } : registration
  );
  registrationStore.write(updated);

  const found = updated.find((registration) => registration.id === id);
  if (!found) {
    throw new RegistrationError('notFound');
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
      throw mapRegistrationError(error.code, error.message);
    }
    return;
  }

  const localRegistrations = registrationStore.read();
  const registration = localRegistrations.find((item) => item.id === id);

  if (!registration) {
    throw new RegistrationError('notFound');
  }

  if (registration.marketing_consent) {
    throw new RegistrationError('marketingConsentProtected');
  }

  registrationStore.write(
    localRegistrations.filter((item) => item.id !== id)
  );
};

export const withdrawMarketingConsent = async (
  id: string
): Promise<WorkshopRegistration> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update({ marketing_consent: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw mapRegistrationError(error.code, error.message);
    }

    return data as WorkshopRegistration;
  }

  const localRegistrations = registrationStore.read();
  const registration = localRegistrations.find((item) => item.id === id);

  if (!registration) {
    throw new RegistrationError('notFound');
  }

  const updated: WorkshopRegistration = {
    ...registration,
    marketing_consent: false,
  };

  registrationStore.write(
    localRegistrations.map((item) => (item.id === id ? updated : item))
  );

  return updated;
};

export const cancelWorkshopRegistrations = async (
  productId: string
): Promise<number> => {
  if (!useMocks && isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update({ status: 'cancelado' })
      .eq('product_id', productId)
      .neq('status', 'cancelado')
      .select('id');

    if (error) {
      throw mapRegistrationError(error.code, error.message);
    }

    return (data || []).length;
  }

  const localRegistrations = registrationStore.read();
  let cancelledCount = 0;

  const updated = localRegistrations.map((registration) => {
    if (
      registration.product_id !== productId ||
      registration.status === 'cancelado'
    ) {
      return registration;
    }

    cancelledCount += 1;
    return { ...registration, status: 'cancelado' as RegistrationStatus };
  });

  registrationStore.write(updated);
  return cancelledCount;
};
