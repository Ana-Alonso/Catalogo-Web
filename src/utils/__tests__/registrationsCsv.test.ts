import { describe, expect, it } from 'vitest';
import {
  buildCsv,
  buildMarketingCsvRows,
} from '../registrationsCsv';
import type { WorkshopRegistration } from '../../types/registrations';

const buildRegistration = (
  overrides: Partial<WorkshopRegistration> = {}
): WorkshopRegistration => ({
  id: 'r1',
  product_id: 't1',
  name: 'Ana',
  email: 'ana@mail.com',
  status: 'pendiente',
  privacy_consent_at: '2026-10-20T10:00:00.000Z',
  marketing_consent: true,
  quantity: 1,
  created_at: '2026-10-20T10:00:00.000Z',
  ...overrides,
});

const BOM = String.fromCharCode(0xfeff);

const translateStatus = (status: string): string => status;

const titles: Record<string, string> = { t1: 'Taller de acuarela' };

describe('buildMarketingCsvRows', () => {
  it('solo incluye quien dio consentimiento y ignora el resto', () => {
    const rows = buildMarketingCsvRows(
      [buildRegistration(), buildRegistration({ id: 'r2', marketing_consent: false })],
      titles,
      translateStatus
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe('ana@mail.com');
  });

  it('ordena por fecha descendente y pasa la fecha a YYYY-MM-DD', () => {
    const rows = buildMarketingCsvRows(
      [
        buildRegistration({
          id: 'vieja',
          email: 'luis@mail.com',
          created_at: '2026-09-02T08:00:00.000Z',
        }),
        buildRegistration({
          id: 'nueva',
          email: 'ana@mail.com',
          created_at: '2026-10-18T08:00:00.000Z',
        }),
      ],
      titles,
      translateStatus
    );

    expect(rows.map((row) => row.date)).toEqual(['2026-10-18', '2026-09-02']);
  });

  it('agrupa por email sin duplicados, aunque cambien las mayúsculas', () => {
    const rows = buildMarketingCsvRows(
      [
        buildRegistration({
          id: 'nueva',
          email: 'ANA@mail.com',
          name: 'Ana López',
          product_id: 'e1',
          quantity: 2,
          created_at: '2026-10-18T08:00:00.000Z',
        }),
        buildRegistration({
          id: 'vieja',
          email: 'ana@mail.com',
          name: 'Ana',
          quantity: 3,
          created_at: '2026-09-02T08:00:00.000Z',
        }),
      ],
      { ...titles, e1: 'Edición de temporada' },
      translateStatus
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('Ana López');
    expect(rows[0].email).toBe('ANA@mail.com');
    expect(rows[0].workshop).toBe('Edición de temporada, Taller de acuarela');
    expect(rows[0].date).toBe('2026-10-18');
    expect(rows[0].quantity).toBe('5');
  });

  it('conserva la fila aunque el taller ya no exista y mantiene los cancelados', () => {
    const rows = buildMarketingCsvRows(
      [buildRegistration({ product_id: 'borrado', status: 'cancelado' })],
      titles,
      translateStatus
    );

    expect(rows).toEqual([
      {
        name: 'Ana',
        email: 'ana@mail.com',
        workshop: '',
        date: '2026-10-20',
        status: 'cancelado',
        quantity: '1',
      },
    ]);
  });

  it('exporta la cantidad reservada en unidades', () => {
    const rows = buildMarketingCsvRows(
      [buildRegistration({ quantity: 3 })],
      titles,
      translateStatus
    );

    expect(rows[0].quantity).toBe('3');
  });
});

describe('buildCsv', () => {
  const headers = ['Nombre', 'Email', 'Taller', 'Fecha', 'Estado', 'Unidades'];

  it('escribe BOM, separador ; y saltos CRLF', () => {
    const csv = buildCsv(headers, [
      {
        name: 'María',
        email: 'maria@mail.com',
        workshop: 'Taller de acuarela',
        date: '2026-10-20',
        status: 'Confirmado',
        quantity: '1',
      },
    ]);

    expect(csv.startsWith(BOM)).toBe(true);
    expect(csv).toBe(
      `${BOM}Nombre;Email;Taller;Fecha;Estado;Unidades\r\nMaría;maria@mail.com;Taller de acuarela;2026-10-20;Confirmado;1\r\n`
    );
  });

  it('entrecomilla y dobla las comillas de los campos conflictivos', () => {
    const csv = buildCsv(headers, [
      {
        name: 'Ana "Anita"; López',
        email: 'ana@mail.com',
        workshop: 'Acuarela\ny tinta',
        date: '2026-10-20',
        status: 'Pendiente',
        quantity: '3',
      },
    ]);

    const [, fila] = csv.slice(BOM.length).split('\r\n');

    expect(fila).toBe(
      '"Ana ""Anita""; López";ana@mail.com;"Acuarela\ny tinta";2026-10-20;Pendiente;3'
    );
  });
});
