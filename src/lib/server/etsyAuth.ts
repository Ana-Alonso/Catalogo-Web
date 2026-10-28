import { getServerEnv } from './env';
import { createSupabaseAdmin } from './supabaseAdmin';
import {
  decodeStoredToken,
  encodeStoredToken,
  encryptToken,
  isEncryptedToken,
} from './tokenCipher';

const TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token';
const EXPIRY_MARGIN_MS = 60_000;

interface StoredCredentials {
  access_token: string | null;
  refresh_token: string;
  access_token_expires_at: string | null;
}

interface EtsyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const isTokenResponse = (value: unknown): value is EtsyTokenResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.access_token === 'string' &&
    typeof record.refresh_token === 'string' &&
    typeof record.expires_in === 'number'
  );
};

const isFresh = (expiresAt: string | null): boolean => {
  if (!expiresAt) {
    return false;
  }
  const expiresAtMs = new Date(expiresAt).getTime();
  return Number.isFinite(expiresAtMs) && expiresAtMs - Date.now() > EXPIRY_MARGIN_MS;
};

const storeCredentials = async (
  credentials: StoredCredentials,
  encodedKey: string
): Promise<void> => {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('etsy_credentials').upsert(
    {
      id: 1,
      access_token: encodeStoredToken(credentials.access_token, encodedKey),
      refresh_token: encryptToken(credentials.refresh_token, encodedKey),
      access_token_expires_at: credentials.access_token_expires_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw new Error(
      `No se pudieron guardar las credenciales de Etsy (${error.message}).`
    );
  }
};

const needsEncryption = (credentials: StoredCredentials): boolean =>
  [credentials.access_token, credentials.refresh_token].some(
    (token) => token !== null && !isEncryptedToken(token)
  );

const readCredentials = async (): Promise<StoredCredentials> => {
  const env = getServerEnv();
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('etsy_credentials')
    .select('access_token, refresh_token, access_token_expires_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudieron leer las credenciales de Etsy. ¿Has aplicado supabase/migrations/003_offers_etsy.sql? (${error.message})`
    );
  }

  if (!data) {
    if (!env.etsyRefreshToken) {
      throw new Error(
        'No hay credenciales de Etsy. Ejecuta scripts/etsy-oauth.mjs o define ETSY_REFRESH_TOKEN.'
      );
    }

    return {
      access_token: null,
      refresh_token: env.etsyRefreshToken,
      access_token_expires_at: null,
    };
  }

  const stored = data as StoredCredentials;

  if (needsEncryption(stored)) {
    await storeCredentials(stored, env.etsyTokenEncryptionKey);
  }

  return {
    access_token: decodeStoredToken(
      stored.access_token,
      env.etsyTokenEncryptionKey
    ),
    refresh_token: decodeStoredToken(
      stored.refresh_token,
      env.etsyTokenEncryptionKey
    ) ?? '',
    access_token_expires_at: stored.access_token_expires_at,
  };
};

const refreshAccessToken = async (
  credentials: StoredCredentials
): Promise<string> => {
  const env = getServerEnv();
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-api-key': `${env.etsyKeyString}:${env.etsySharedSecret}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.etsyKeyString,
      refresh_token: credentials.refresh_token,
    }),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Etsy rechazó el refresh token (${response.status}).`);
  }

  if (!isTokenResponse(payload)) {
    throw new Error('Respuesta inesperada al renovar el token de Etsy.');
  }

  const expiresAt = new Date(Date.now() + payload.expires_in * 1000);

  await storeCredentials(
    {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      access_token_expires_at: expiresAt.toISOString(),
    },
    env.etsyTokenEncryptionKey
  );

  return payload.access_token;
};

let inFlightRefresh: Promise<string> | null = null;

export const getEtsyAccessToken = async (
  forceRefresh = false
): Promise<string> => {
  const credentials = await readCredentials();

  if (!forceRefresh && credentials.access_token && isFresh(credentials.access_token_expires_at)) {
    return credentials.access_token;
  }

  if (!inFlightRefresh) {
    inFlightRefresh = refreshAccessToken(credentials).finally(() => {
      inFlightRefresh = null;
    });
  }

  return inFlightRefresh;
};

export const markEtsySync = async (): Promise<void> => {
  const supabase = createSupabaseAdmin();
  await supabase
    .from('etsy_credentials')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', 1);
};
