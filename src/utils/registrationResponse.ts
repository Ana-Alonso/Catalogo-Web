import {
  isRegistrationErrorCode,
  type RegistrationErrorCode,
} from '../errors/registrationError';
import type { WorkshopRegistration } from '../types/registrations';

export const readApiErrorCode = (payload: unknown): RegistrationErrorCode => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    isRegistrationErrorCode((payload as Record<string, unknown>).error)
  ) {
    return (payload as { error: RegistrationErrorCode }).error;
  }
  return 'unknown';
};

const isRegistrationRow = (value: unknown): value is WorkshopRegistration => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row.id === 'string' &&
    typeof row.product_id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.email === 'string' &&
    typeof row.status === 'string' &&
    typeof row.created_at === 'string' &&
    typeof row.marketing_consent === 'boolean' &&
    (row.privacy_consent_at === null ||
      typeof row.privacy_consent_at === 'string')
  );
};

export const readRegistrationRow = (payload: unknown): WorkshopRegistration => {
  if (!isRegistrationRow(payload)) {
    throw new Error('Respuesta de inscripción no válida.');
  }
  return payload;
};
