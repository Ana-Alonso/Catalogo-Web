import { supabase } from '../utils/supabase';

export interface EtsySyncResult {
  created: number;
  updated: number;
  hidden: number;
  total: number;
}

export type EtsySyncErrorCode =
  | 'notConfigured'
  | 'unauthorized'
  | 'unexpectedResponse'
  | 'unknown';

export class EtsySyncError extends Error {
  readonly code: EtsySyncErrorCode;

  constructor(code: EtsySyncErrorCode) {
    super(code);
    this.name = 'EtsySyncError';
    this.code = code;
  }
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

const readErrorMessage = (value: unknown): string | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  return typeof record.error === 'string' ? record.error : null;
};

export const triggerEtsySync = async (): Promise<EtsySyncResult> => {
  if (!supabase) {
    throw new EtsySyncError('notConfigured');
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new EtsySyncError('unauthorized');
  }

  const response = await fetch('/api/etsy-sync', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
    },
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = readErrorMessage(payload);
    throw message ? new Error(message) : new EtsySyncError('unknown');
  }

  if (!isEtsySyncResult(payload)) {
    throw new EtsySyncError('unexpectedResponse');
  }

  return payload;
};
