import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const PREFIX = 'enc:v1:';
const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;
const IV_BYTES = 12;
const TAG_BYTES = 16;

const decodeKey = (encodedKey: string): Buffer => {
  const key = Buffer.from(encodedKey, 'base64');

  if (key.length !== KEY_BYTES) {
    throw new Error(
      'ETSY_TOKEN_ENCRYPTION_KEY debe ser una clave de 32 bytes codificada en base64.'
    );
  }

  return key;
};

export const isEncryptedToken = (value: string): boolean =>
  value.startsWith(PREFIX);

export const encryptToken = (plaintext: string, encodedKey: string): string => {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, decodeKey(encodedKey), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const payload = Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);

  return `${PREFIX}${payload.toString('base64')}`;
};

export const decryptToken = (value: string, encodedKey: string): string => {
  if (!isEncryptedToken(value)) {
    return value;
  }

  const payload = Buffer.from(value.slice(PREFIX.length), 'base64');

  if (payload.length <= IV_BYTES + TAG_BYTES) {
    throw new Error('El token cifrado de Etsy está incompleto o corrupto.');
  }

  const iv = payload.subarray(0, IV_BYTES);
  const tag = payload.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ciphertext = payload.subarray(IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv(ALGORITHM, decodeKey(encodedKey), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
};

export const encodeStoredToken = (
  plaintext: string | null,
  encodedKey: string
): string | null => (plaintext === null ? null : encryptToken(plaintext, encodedKey));

export const decodeStoredToken = (
  value: string | null,
  encodedKey: string
): string | null => (value === null ? null : decryptToken(value, encodedKey));
