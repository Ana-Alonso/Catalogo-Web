import { consumeRateLimit } from '../../lib/server/rateLimit';
import { resolveClientIp } from '../../lib/server/registrations';
import { getSupabaseEnv } from '../../lib/server/env';
import { createSupabaseAnon } from '../../lib/server/supabaseAnon';
import { isAdminUser } from '../../utils/adminAccess';

const MAX_BODY_LENGTH = 4096;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 256;
const IP_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 10;
const EMAIL_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_EMAIL = 5;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NO_STORE = { 'Cache-Control': 'no-store' };

const jsonError = (
  status: number,
  error: string,
  headers?: HeadersInit
): Response =>
  Response.json({ error }, { status, headers: { ...NO_STORE, ...headers } });

const tooManyRequests = (retryAfterSeconds: number): Response =>
  jsonError(429, 'rateLimited', {
    'Retry-After': String(Math.max(1, retryAfterSeconds)),
  });

interface Credentials {
  email: string;
  password: string;
}

const readCredentials = (raw: string): Credentials | null => {
  if (raw.length > MAX_BODY_LENGTH) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  const { email, password } = parsed as Record<string, unknown>;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail.length === 0 ||
    normalizedEmail.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(normalizedEmail) ||
    password.length === 0 ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return null;
  }

  return { email: normalizedEmail, password };
};

export const loader = (): Response => jsonError(405, 'invalid', { Allow: 'POST' });

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  if (request.method !== 'POST') {
    return jsonError(405, 'invalid', { Allow: 'POST' });
  }

  try {
    getSupabaseEnv();
  } catch {
    return jsonError(503, 'unavailable');
  }

  const clientIp = resolveClientIp(request.headers);

  const ipLimit = await consumeRateLimit(
    `admin-session-ip:${clientIp}`,
    MAX_ATTEMPTS_PER_IP,
    IP_WINDOW_MS
  );

  if (!ipLimit.allowed) {
    return tooManyRequests(ipLimit.retryAfterSeconds);
  }

  let raw: string;

  try {
    raw = await request.text();
  } catch {
    return jsonError(400, 'invalid');
  }

  const credentials = readCredentials(raw);

  if (!credentials) {
    return jsonError(400, 'invalid');
  }

  const emailLimit = await consumeRateLimit(
    `admin-session-email:${credentials.email}`,
    MAX_ATTEMPTS_PER_EMAIL,
    EMAIL_WINDOW_MS
  );

  if (!emailLimit.allowed) {
    return tooManyRequests(emailLimit.retryAfterSeconds);
  }

  const { data, error } = await createSupabaseAnon().auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error || !data.session) {
    return jsonError(401, 'invalid');
  }

  if (!isAdminUser(data.user)) {
    return jsonError(403, 'notAdmin');
  }

  return Response.json(
    {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
    { status: 200, headers: NO_STORE }
  );
};
