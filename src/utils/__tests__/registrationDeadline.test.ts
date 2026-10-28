import { describe, expect, it } from 'vitest';
import { getDaysUntilRegistrationDeadline } from '../registrationDeadline';

const NOW = Date.parse('2026-11-01T12:00:00.000Z');

describe('getDaysUntilRegistrationDeadline', () => {
  it('devuelve null sin plazo o con plazo inválido', () => {
    expect(getDaysUntilRegistrationDeadline(undefined, NOW)).toBeNull();
    expect(getDaysUntilRegistrationDeadline(null, NOW)).toBeNull();
    expect(getDaysUntilRegistrationDeadline('', NOW)).toBeNull();
    expect(getDaysUntilRegistrationDeadline('no-es-fecha', NOW)).toBeNull();
  });

  it('devuelve 0 cuando el plazo ya pasó o es ahora', () => {
    expect(getDaysUntilRegistrationDeadline('2026-10-31T12:00:00.000Z', NOW)).toBe(0);
    expect(getDaysUntilRegistrationDeadline('2026-11-01T12:00:00.000Z', NOW)).toBe(0);
  });

  it('devuelve 1 cuando falta menos de un día completo', () => {
    expect(getDaysUntilRegistrationDeadline('2026-11-01T23:00:00.000Z', NOW)).toBe(1);
  });

  it('redondea hacia arriba los días restantes', () => {
    expect(getDaysUntilRegistrationDeadline('2026-11-06T13:00:00.000Z', NOW)).toBe(6);
  });

  it('devuelve el número exacto de días cuando coincide la hora', () => {
    expect(getDaysUntilRegistrationDeadline('2026-11-11T12:00:00.000Z', NOW)).toBe(10);
    expect(getDaysUntilRegistrationDeadline('2026-12-01T12:00:00.000Z', NOW)).toBe(30);
  });
});
