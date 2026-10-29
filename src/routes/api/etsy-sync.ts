import { timingSafeEqual } from 'node:crypto';
import { getServerEnv, type ServerEnv } from '../../lib/server/env';
import { syncEtsyListings } from '../../lib/server/etsySync';
import { consumeRateLimit } from '../../lib/server/rateLimit';
import { resolveClientIp } from '../../lib/server/registrations';
import { createSupabaseAdmin } from '../../lib/server/supabaseAdmin';
import { isAdminUser } from '../../utils/adminAccess';

const CRON_WINDOW_MS = 15 * 60 * 1000;
const CRON_LIMIT = 20;
const ADMIN_WINDOW_MS = 5 * 60 * 1000;
const ADMIN_LIMIT = 10;

const bearerToken = (headers: Headers): string | null => {
  const header = headers.get('authorization');
  if (!header) {
    return null;
  }
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1] : null;
};

const safeEqual = (provided: string, expected: string): boolean => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

const authorizeUser = async (token: string): Promise<boolean> => {
  const { data, error } = await createSupabaseAdmin().auth.getUser(token);
  return !error && isAdminUser(data.user);
};

const runSync = async (): Promise<Response> => {
  try {
    const result = await syncEtsyListings();
    return Response.json(result);
  } catch (error) {
    console.error(
      '[etsy-sync]',
      error instanceof Error ? error.message : 'Error desconocido'
    );
    return Response.json(
      { error: 'No se pudo sincronizar con Etsy.' },
      { status: 500 }
    );
  }
};

const readEnv = (): ServerEnv | null => {
  try {
    return getServerEnv();
  } catch (error) {
    console.error(
      '[etsy-sync]',
      error instanceof Error ? error.message : 'Configuración incompleta'
    );
    return null;
  }
};

const tooManyRequests = (retryAfterSeconds: number): Response =>
  Response.json(
    { error: 'Demasiadas peticiones.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
  );

export const loader = async ({ request }: { request: Request }) => {
  const env = readEnv();

  if (!env) {
    return Response.json(
      { error: 'Configuración del servidor incompleta.' },
      { status: 500 }
    );
  }

  const cronLimit = await consumeRateLimit(
    `etsy-sync-cron:${resolveClientIp(request.headers)}`,
    CRON_LIMIT,
    CRON_WINDOW_MS
  );

  if (!cronLimit.allowed) {
    return tooManyRequests(cronLimit.retryAfterSeconds);
  }

  const token = bearerToken(request.headers);

  if (!env.cronSecret || !token || !safeEqual(token, env.cronSecret)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  return runSync();
};

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== 'POST') {
    return Response.json(
      { error: 'Método no permitido.' },
      { status: 405, headers: { Allow: 'GET, POST' } }
    );
  }

  const env = readEnv();

  if (!env) {
    return Response.json(
      { error: 'Configuración del servidor incompleta.' },
      { status: 500 }
    );
  }

  const adminLimit = await consumeRateLimit(
    `etsy-sync-admin:${resolveClientIp(request.headers)}`,
    ADMIN_LIMIT,
    ADMIN_WINDOW_MS
  );

  if (!adminLimit.allowed) {
    return tooManyRequests(adminLimit.retryAfterSeconds);
  }

  const token = bearerToken(request.headers);

  if (!token || !(await authorizeUser(token))) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  return runSync();
};
