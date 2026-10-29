import {
  mapRegistrationDatabaseError,
  type RegistrationErrorCode,
} from '../../errors/registrationError';
import { consumeRateLimit } from '../../lib/server/rateLimit';
import {
  readRegistrationClaim,
  resolveClientIp,
  type WorkshopRegistrationClaim,
} from '../../lib/server/registrations';
import { createSupabaseAdmin } from '../../lib/server/supabaseAdmin';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REGISTRATIONS_PER_WINDOW = 5;

const CONFLICT_CODES: RegistrationErrorCode[] = [
  'alreadyRegistered',
  'workshopFull',
  'registrationClosed',
];

const statusForErrorCode = (code: RegistrationErrorCode): number => {
  if (code === 'invalidData') {
    return 400;
  }
  return CONFLICT_CODES.includes(code) ? 409 : 500;
};

const jsonError = (
  status: number,
  code: RegistrationErrorCode,
  headers?: HeadersInit
): Response => Response.json({ error: code }, { status, headers });

export const loader = () =>
  jsonError(405, 'invalidData', { Allow: 'POST' });

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  if (request.method !== 'POST') {
    return jsonError(405, 'invalidData', { Allow: 'POST' });
  }

  const clientIp = resolveClientIp(request.headers);
  const rateLimit = await consumeRateLimit(
    `workshop-registration:${clientIp}`,
    MAX_REGISTRATIONS_PER_WINDOW,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimit.allowed) {
    return jsonError(429, 'rateLimited', {
      'Retry-After': String(rateLimit.retryAfterSeconds),
    });
  }

  const parsed = await readRegistrationClaim(request);

  if (!parsed.ok) {
    return jsonError(400, parsed.code);
  }

  const claim: WorkshopRegistrationClaim = parsed.claim;

  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin.rpc('register_for_workshop', {
      p_product_id: claim.productId,
      p_name: claim.name,
      p_email: claim.email,
      p_privacy_consent_at: claim.privacyConsentAt,
      p_marketing_consent: claim.marketingConsent,
    });

    if (error) {
      const code = mapRegistrationDatabaseError(error.code, error.message);
      return jsonError(statusForErrorCode(code), code);
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    console.error(
      '[api/registrations]',
      err instanceof Error ? err.message : 'Error desconocido'
    );
    return jsonError(500, 'unknown');
  }
};
