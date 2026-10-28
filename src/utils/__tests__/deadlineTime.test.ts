import { describe, expect, it } from 'vitest';
import { toDatetimeLocalValue, toUtcDeadline } from '../deadlineTime';

describe('toUtcDeadline', () => {
  it('devuelve undefined con valores vacíos', () => {
    expect(toUtcDeadline(undefined)).toBeUndefined();
    expect(toUtcDeadline('')).toBeUndefined();
  });

  it('devuelve undefined con texto que no es una fecha', () => {
    expect(toUtcDeadline('mañana al mediodía')).toBeUndefined();
  });

  it('produce un instante ISO con Z', () => {
    const utc = toUtcDeadline('2026-11-10T23:59');
    expect(utc).toMatch(/Z$/);
    expect(new Date(utc ?? '').getTime()).toBe(new Date('2026-11-10T23:59').getTime());
  });
});

describe('toDatetimeLocalValue', () => {
  it('devuelve cadena vacía sin plazo', () => {
    expect(toDatetimeLocalValue(undefined)).toBe('');
    expect(toDatetimeLocalValue(null)).toBe('');
  });

  it('devuelve cadena vacía con texto inválido', () => {
    expect(toDatetimeLocalValue('no-es-fecha')).toBe('');
  });

  it('reconvierte el instante guardado a hora local', () => {
    const utc = toUtcDeadline('2026-11-10T23:59');
    expect(new Date(toDatetimeLocalValue(utc)).getTime()).toBe(new Date(utc ?? '').getTime());
  });
});
