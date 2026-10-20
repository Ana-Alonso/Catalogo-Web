import { supabase } from '../utils/supabase';

export interface EtsySyncResult {
  created: number;
  updated: number;
  hidden: number;
  total: number;
}

const isEtsySyncResult = (value: unknown): value is EtsySyncResult => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.created === 'number' &&
    typeof record.updated === 'number' &&
    typeof record.hidden === 'number' &&
    typeof record.total === 'number'
  );
};

const readErrorMessage = (value: unknown): string => {
  if (typeof value !== 'object' || value === null) {
    return 'No se pudo sincronizar con Etsy.';
  }
  const record = value as Record<string, unknown>;
  return typeof record.error === 'string'
    ? record.error
    : 'No se pudo sincronizar con Etsy.';
};

export const triggerEtsySync = async (): Promise<EtsySyncResult> => {
  if (!supabase) {
    throw new Error('Supabase no está configurado.');
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('Debes iniciar sesión para sincronizar con Etsy.');
  }

  const response = await fetch('/api/etsy-sync', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
    },
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(readErrorMessage(payload));
  }

  if (!isEtsySyncResult(payload)) {
    throw new Error('Respuesta inesperada del servidor.');
  }

  return payload;
};
