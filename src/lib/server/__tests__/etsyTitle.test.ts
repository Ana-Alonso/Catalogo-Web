import { describe, expect, it } from 'vitest';
import { truncateTitle } from '../etsyTitle';

describe('truncateTitle', () => {
  it('devuelve el título intacto si cabe en el límite', () => {
    expect(truncateTitle('Ilustración original', 120)).toBe('Ilustración original');
  });

  it('devuelve exactamente el límite cuando el texto mide justo el límite', () => {
    const title = 'a'.repeat(120);
    expect(truncateTitle(title, 120)).toHaveLength(120);
    expect(truncateTitle(title, 120)).toBe(title);
  });

  it('recorta en el último espacio antes del límite y añade elipsis', () => {
    const title = `${'palabra '.repeat(20)}final`;
    const truncated = truncateTitle(title, 120);

    expect(truncated.length).toBeLessThanOrEqual(120);
    expect(truncated.endsWith('…')).toBe(true);
    expect(truncated).not.toContain('  ');
    expect(truncated.slice(0, -1)).toBe(title.slice(0, truncated.length - 1));
    expect(title[truncated.length - 1]).toBe(' ');
  });

  it('hace un corte duro cuando no hay espacios disponibles', () => {
    const truncated = truncateTitle('a'.repeat(200), 120);

    expect(truncated).toHaveLength(120);
    expect(truncated.endsWith('…')).toBe(true);
  });

  it('no deja puntuación suelta antes de la elipsis', () => {
    const title = `${'x'.repeat(115)}, ${'y'.repeat(20)}`;

    expect(truncateTitle(title, 120)).toBe(`${'x'.repeat(115).slice(0, 115)}…`);
  });

  it('normaliza espacios antes de medir', () => {
    expect(truncateTitle('  Obra   con    espacios  ', 120)).toBe('Obra con espacios');
  });

  it('devuelve una cadena vacía con límites no positivos', () => {
    expect(truncateTitle('Ilustración', 0)).toBe('');
    expect(truncateTitle('Ilustración', -5)).toBe('');
  });
});
