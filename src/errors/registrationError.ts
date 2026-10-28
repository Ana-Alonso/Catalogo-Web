export type RegistrationErrorCode =
  | 'alreadyRegistered'
  | 'workshopFull'
  | 'registrationClosed'
  | 'notFound'
  | 'unknown';

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
