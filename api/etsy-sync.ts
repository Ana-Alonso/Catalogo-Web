import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import { getServerEnv, type ServerEnv } from './_lib/env';
import type { ApiRequest, ApiResponse } from './_lib/http';
import { getHeader } from './_lib/http';
import { syncEtsyListings } from './_lib/etsySync';

const bearerToken = (req: ApiRequest): string | null => {
  const header = getHeader(req, 'authorization');
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

const authorizeCron = (req: ApiRequest, secret: string | null): boolean => {
  if (!secret) {
    return false;
  }
  const token = bearerToken(req);
  return token !== null && safeEqual(token, secret);
};

const authorizeUser = async (token: string): Promise<boolean> => {
  const env = getServerEnv();
  const client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  return !error && Boolean(data.user);
};

export default async function handler(
  req: ApiRequest,
  res: ApiResponse
): Promise<void> {
  const method = req.method ?? 'GET';
  const token = bearerToken(req);

  let env: ServerEnv;

  try {
    env = getServerEnv();
  } catch (error) {
    console.error(
      '[etsy-sync]',
      error instanceof Error ? error.message : 'Configuración incompleta'
    );
    res.status(500).json({ error: 'Configuración del servidor incompleta.' });
    return;
  }

  if (method === 'GET') {
    if (!authorizeCron(req, env.cronSecret)) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
  } else if (method === 'POST') {
    if (!token || !(await authorizeUser(token))) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
  } else {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  try {
    const result = await syncEtsyListings();
    res.status(200).json(result);
  } catch (error) {
    console.error(
      '[etsy-sync]',
      error instanceof Error ? error.message : 'Error desconocido'
    );
    res.status(500).json({ error: 'No se pudo sincronizar con Etsy.' });
  }
}
