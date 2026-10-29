import { type RegistrationErrorCode } from '../../errors/registrationError';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

export interface WorkshopRegistrationClaim {
  productId: string;
  name: string;
  email: string;
  privacyConsentAt: string | null;
  marketingConsent: boolean;
}

export type RegistrationClaimResult =
  | { ok: true; claim: WorkshopRegistrationClaim }
  | { ok: false; code: RegistrationErrorCode };

const invalid = (): RegistrationClaimResult => ({
  ok: false,
  code: 'invalidData',
});

const isUuid = (value: string): boolean => UUID_PATTERN.test(value);

const isBoundedText = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;

export const parseRegistrationClaim = (payload: unknown): RegistrationClaimResult => {
  if (typeof payload !== 'object' || payload === null) {
    return invalid();
  }

  const body = payload as Record<string, unknown>;
  const productId = body.productId;
  const name = body.name;
  const email = body.email;

  if (typeof productId !== 'string' || !isUuid(productId)) {
    return invalid();
  }

  if (!isBoundedText(name, MAX_NAME_LENGTH)) {
    return invalid();
  }

  if (!isBoundedText(email, MAX_EMAIL_LENGTH) || !EMAIL_PATTERN.test(email.trim())) {
    return invalid();
  }

  if (body.privacyConsent !== true) {
    return invalid();
  }

  return {
    ok: true,
    claim: {
      productId,
      name: name.trim(),
      email: email.trim(),
      privacyConsentAt: new Date().toISOString(),
      marketingConsent: body.marketingConsent === true,
    },
  };
};

export const readRegistrationClaim = async (
  request: Request
): Promise<RegistrationClaimResult> => {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return invalid();
  }

  if (rawBody.length > 4096) {
    return invalid();
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return invalid();
  }

  return parseRegistrationClaim(payload);
};

const lastForwardedEntry = (forwardedFor: string): string | undefined => {
  const entries = forwardedFor.split(',');

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const trimmed = entries[index]?.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
};

export const resolveClientIp = (headers: Headers): string => {
  const realIp = headers.get('x-real-ip')?.trim();

  if (realIp) {
    return realIp;
  }

  const forwardedFor = headers.get('x-forwarded-for');

  if (forwardedFor) {
    const trustedIp = lastForwardedEntry(forwardedFor);

    if (trustedIp) {
      return trustedIp;
    }
  }

  return headers.get('cf-connecting-ip')?.trim() || 'unknown-ip';
};
