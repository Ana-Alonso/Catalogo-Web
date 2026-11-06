import { describe, expect, it } from 'vitest';
import {
  buildCsv,
  buildContactRows,
  buildMarketingContacts,
  buildRegistrationRows,
} from '../registrationsCsv';
import type { RegistrationStatus, WorkshopRegistration } from '../../types/registrations';

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
  amount: null,
  paid: false,
  paid_at: null,
  fulfilled_at: null,
  created_at: '2026-10-20T10:00:00.000Z',
  ...overrides,
});

const BOM = String.fromCharCode(0xfeff);

const translateStatus = (status: RegistrationStatus): string => status;

const titles: Record<string, string> = {
  t1: 'Taller de acuarela',
  e1: 'Edición de temporada',
};

const tallerIds = new Set(['t1']);
const especialIds = new Set(['e1']);

describe('buildMarketingContacts', () => {
  it('solo incluye quien dio consentimiento', () => {
    const contacts = buildMarketingContacts([
      buildRegistration(),
      buildRegistration({ id: 'r2', marketing_consent: false }),
    ]);

    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe('ana@mail.com');
  });

  it('agrupa por email sin duplicados aunque mezclen talleres y productos', () => {
    const contacts = buildMarketingContacts([
      buildRegistration({ id: 'vieja', name: 'Ana', created_at: '2026-09-02T08:00:00.000Z' }),
      buildRegistration({
        id: 'nueva',
        name: 'Ana López',
        email: 'ANA@mail.com',
        product_id: 'e1',
        created_at: '2026-10-18T08:00:00.000Z',
      }),
      buildRegistration({
        id: 'otro',
        name: 'Luis',
        email: 'luis@mail.com',
        created_at: '2026-10-01T08:00:00.000Z',
      }),
    ]);

    expect(contacts).toEqual([
      { name: 'Ana López', email: 'ANA@mail.com', date: '2026-10-18' },
      { name: 'Luis', email: 'luis@mail.com', date: '2026-10-01' },
    ]);
  });
});

describe('buildRegistrationRows', () => {
  it('aisla una categoría y omite las unidades en talleres', () => {
    const rows = buildRegistrationRows(
      [
        buildRegistration(),
        buildRegistration({ id: 'r2', product_id: 'e1', quantity: 4 }),
      ],
      tallerIds,
      titles,
      translateStatus,
      { withQuantity: false }
    );

    expect(rows).toEqual([
      ['Ana', 'ana@mail.com', 'Taller de acuarela', '2026-10-20', 'pendiente'],
    ]);
  });

  it('incluye unidades en las reservas de producto', () => {
    const rows = buildRegistrationRows(
      [buildRegistration({ id: 'r2', product_id: 'e1', quantity: 4 })],
      especialIds,
      titles,
      translateStatus,
      { withQuantity: true }
    );

    expect(rows).toEqual([
      ['Ana', 'ana@mail.com', 'Edición de temporada', '2026-10-20', 'pendiente', '4'],
    ]);
  });

  it('ordena por producto y, dentro del producto, por fecha descendente', () => {
    const rows = buildRegistrationRows(
      [
        buildRegistration({ id: 'a', name: 'Zoe', created_at: '2026-10-05T08:00:00.000Z' }),
        buildRegistration({ id: 'b', name: 'Ana', created_at: '2026-10-20T08:00:00.000Z' }),
        buildRegistration({ id: 'c', name: 'Luis', product_id: 'e1' }),
      ],
      tallerIds,
      titles,
      translateStatus,
      { withQuantity: false }
    );

    expect(rows.map((row) => row[0])).toEqual(['Ana', 'Zoe']);
  });

  it('conserva el estado traducido y la fecha en formato corto', () => {
    const rows = buildRegistrationRows(
      [buildRegistration({ status: 'confirmado' })],
      tallerIds,
      titles,
      (status) => `tr-${status}`,
      { withQuantity: false }
    );

    expect(rows[0][3]).toBe('2026-10-20');
    expect(rows[0][4]).toBe('tr-confirmado');
  });

  it('deja fuera las inscripciones canceladas', () => {
    const rows = buildRegistrationRows(
      [
        buildRegistration(),
        buildRegistration({ id: 'r2', name: 'Borrada', status: 'cancelado' }),
      ],
      tallerIds,
      titles,
      translateStatus,
      { withQuantity: false }
    );

    expect(rows.map((row) => row[0])).toEqual(['Ana']);
  });
});

describe('buildContactRows', () => {
  it('incluye todas las filas del producto, también las canceladas', () => {
    const rows = buildContactRows(
      [
        buildRegistration(),
        buildRegistration({
          id: 'r2',
          name: 'Luis',
          email: 'luis@mail.com',
          status: 'cancelado',
          created_at: '2026-10-22T10:00:00.000Z',
        }),
      ],
      (status) => `tr-${status}`,
      { withQuantity: false }
    );

    expect(rows).toEqual([
      ['Luis', 'luis@mail.com', '2026-10-22', 'tr-cancelado'],
      ['Ana', 'ana@mail.com', '2026-10-20', 'tr-pendiente'],
    ]);
  });

  it('añade las unidades cuando el producto es especial', () => {
    const rows = buildContactRows(
      [buildRegistration({ product_id: 'e1', quantity: 4 })],
      translateStatus,
      { withQuantity: true }
    );

    expect(rows).toEqual([
      ['Ana', 'ana@mail.com', '2026-10-20', 'pendiente', '4'],
    ]);
  });
});

describe('buildCsv', () => {
  const headers = ['Nombre', 'Email', 'Taller', 'Fecha', 'Estado'];

  it('escribe BOM, separador ; y saltos CRLF', () => {
    const csv = buildCsv(headers, [
      ['María', 'maria@mail.com', 'Taller de acuarela', '2026-10-20', 'Confirmado'],
    ]);

    expect(csv.startsWith(BOM)).toBe(true);
    expect(csv).toBe(
      `${BOM}Nombre;Email;Taller;Fecha;Estado\r\nMaría;maria@mail.com;Taller de acuarela;2026-10-20;Confirmado\r\n`
    );
  });

  it('entrecomilla y dobla las comillas de los campos conflictivos', () => {
    const csv = buildCsv(headers, [
      ['Ana "Anita"; López', 'ana@mail.com', 'Acuarela\ny tinta', '2026-10-20', 'Pendiente'],
    ]);

    const [, fila] = csv.slice(BOM.length).split('\r\n');

    expect(fila).toBe(
      '"Ana ""Anita""; López";ana@mail.com;"Acuarela\ny tinta";2026-10-20;Pendiente'
    );
  });
});
