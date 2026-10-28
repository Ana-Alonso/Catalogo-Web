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
        buildRegistration({ id: 'vieja', created_at: '2026-09-02T08:00:00.000Z' }),
        buildRegistration({ id: 'nueva', created_at: '2026-10-18T08:00:00.000Z' }),
      ],
      titles,
      translateStatus
    );

    expect(rows.map((row) => row.date)).toEqual(['2026-10-18', '2026-09-02']);
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
      },
    ]);
  });
});

describe('buildCsv', () => {
  const headers = ['Nombre', 'Email', 'Taller', 'Fecha', 'Estado'];

  it('escribe BOM, separador ; y saltos CRLF', () => {
    const csv = buildCsv(headers, [
      {
        name: 'María',
        email: 'maria@mail.com',
        workshop: 'Taller de acuarela',
        date: '2026-10-20',
        status: 'Confirmado',
      },
    ]);

    expect(csv.startsWith(BOM)).toBe(true);
    expect(csv).toBe(
      `${BOM}Nombre;Email;Taller;Fecha;Estado\r\nMaría;maria@mail.com;Taller de acuarela;2026-10-20;Confirmado\r\n`
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
      },
    ]);

    const [, fila] = csv.slice(BOM.length).split('\r\n');

    expect(fila).toBe(
      '"Ana ""Anita""; López";ana@mail.com;"Acuarela\ny tinta";2026-10-20;Pendiente'
    );
  });
});
