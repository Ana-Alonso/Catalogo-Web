import { describe, expect, it } from 'vitest';
import {
  decodeStoredToken,
  decryptToken,
  encodeStoredToken,
  encryptToken,
  isEncryptedToken,
} from '../tokenCipher';

const KEY = Buffer.alloc(32, 7).toString('base64');
const OTHER_KEY = Buffer.alloc(32, 9).toString('base64');

describe('tokenCipher', () => {
  it('cifra y descifra un token sin perder información', () => {
    const token = 'etsy-refresh-token-1234567890';

    const encrypted = encryptToken(token, KEY);

    expect(encrypted).not.toContain(token);
    expect(decryptToken(encrypted, KEY)).toBe(token);
  });

  it('marca los tokens cifrados con el prefijo de versión', () => {
    expect(isEncryptedToken(encryptToken('token', KEY))).toBe(true);
    expect(isEncryptedToken('token-en-claro')).toBe(false);
  });

  it('genera un cifrado distinto en cada llamada', () => {
    const first = encryptToken('token', KEY);
    const second = encryptToken('token', KEY);

    expect(first).not.toBe(second);
    expect(decryptToken(first, KEY)).toBe('token');
    expect(decryptToken(second, KEY)).toBe('token');
  });

  it('rechaza el descifrado con otra clave', () => {
    const encrypted = encryptToken('token', KEY);

    expect(() => decryptToken(encrypted, OTHER_KEY)).toThrow();
  });

  it('rechaza un token cifrado manipulado', () => {
    const encrypted = encryptToken('token', KEY);
    const payload = encrypted.slice('enc:v1:'.length);
    const tampered = `enc:v1:${payload.slice(0, -4)}AAAA`;

    expect(() => decryptToken(tampered, KEY)).toThrow();
  });

  it('devuelve intacto un token heredado en texto plano', () => {
    expect(decryptToken('texto-plano', KEY)).toBe('texto-plano');
  });

  it('rechaza claves que no miden 32 bytes', () => {
    const shortKey = Buffer.alloc(16, 1).toString('base64');

    expect(() => encryptToken('token', shortKey)).toThrow(
      'ETSY_TOKEN_ENCRYPTION_KEY debe ser una clave de 32 bytes codificada en base64.'
    );
  });

  it('conserva los nulos al codificar y decodificar', () => {
    expect(encodeStoredToken(null, KEY)).toBeNull();
    expect(decodeStoredToken(null, KEY)).toBeNull();
  });

  it('cifra y descifra los valores almacenados', () => {
    const stored = encodeStoredToken('token', KEY);

    expect(stored).not.toBeNull();
    expect(decodeStoredToken(stored, KEY)).toBe('token');
  });
});
