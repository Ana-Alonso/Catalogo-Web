import { describe, it, expect } from 'vitest';
import { consumeRateLimit } from '../rateLimit';

describe('consumeRateLimit', () => {
  it('permite las peticiones dentro del límite y bloquea la siguiente', () => {
    const now = 1_000_000;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect(consumeRateLimit('ip-1', 3, 60_000, now)).toEqual({
        allowed: true,
        retryAfterSeconds: 0,
      });
    }

    expect(consumeRateLimit('ip-1', 3, 60_000, now)).toEqual({
      allowed: false,
      retryAfterSeconds: 60,
    });
  });

  it('reinicia la ventana cuando expira', () => {
    const start = 2_000_000;
    consumeRateLimit('ip-2', 1, 10_000, start);

    expect(consumeRateLimit('ip-2', 1, 10_000, start + 5_000).allowed).toBe(false);
    expect(consumeRateLimit('ip-2', 1, 10_000, start + 10_000).allowed).toBe(true);
  });

  it('no comparte contador entre claves distintas', () => {
    const now = 3_000_000;
    consumeRateLimit('ip-3', 1, 10_000, now);

    expect(consumeRateLimit('ip-3', 1, 10_000, now).allowed).toBe(false);
    expect(consumeRateLimit('ip-4', 1, 10_000, now).allowed).toBe(true);
  });
});
