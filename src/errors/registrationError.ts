const REGISTRATION_ERROR_CODES = [
  'invalidData',
  'rateLimited',
  'alreadyRegistered',
  'workshopFull',
  'registrationClosed',
  'marketingConsentProtected',
  'notFound',
  'unknown',
] as const;

export type RegistrationErrorCode = (typeof REGISTRATION_ERROR_CODES)[number];

export class RegistrationError extends Error {
  readonly code: RegistrationErrorCode;

  constructor(code: RegistrationErrorCode) {
    super(code);
    this.name = 'RegistrationError';
    this.code = code;
  }
}

export const getRegistrationErrorCode = (
  error: unknown
): RegistrationErrorCode =>
  error instanceof RegistrationError ? error.code : 'unknown';

export const isRegistrationErrorCode = (
  value: unknown
): value is RegistrationErrorCode =>
  typeof value === 'string' &&
  (REGISTRATION_ERROR_CODES as readonly string[]).includes(value);

export const mapRegistrationDatabaseError = (
  code: string | undefined,
  message: string
): RegistrationErrorCode => {
  if (code === '23505') {
    return 'alreadyRegistered';
  }
  if (code === '23503') {
    return 'invalidData';
  }
  if (message.includes('registration_closed')) {
    return 'registrationClosed';
  }
  if (message.includes('workshop_full')) {
    return 'workshopFull';
  }
  if (message.includes('marketing_consent_protected')) {
    return 'marketingConsentProtected';
  }
  return 'unknown';
};
