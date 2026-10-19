import { describe, it, expect } from 'vitest';
import {
  parseWorkshopDate,
  hasCalendarDate,
  formatIcsDate,
  buildWorkshopIcs,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  buildIcsFilename,
} from '../calendar';
import type { CatalogItem } from '../../types/catalog';

const workshop: CatalogItem = {
  id: 'w-1',
  title: 'Taller de acuarela, nivel 1',
  description: 'Aprende técnicas básicas de acuarela.',
  category: 'talleres',
  image: 'https://example.com/img.png',
  status: 'disponible',
  featured: false,
  eventDate: '2026-11-20T10:00',
  eventLocation: 'Madrid, Plaza Mayor 1',
  price: '25,00 €',
};

describe('parseWorkshopDate', () => {
  it('devuelve null con fecha vacía', () => {
    expect(parseWorkshopDate(undefined)).toBeNull();
    expect(parseWorkshopDate('')).toBeNull();
  });

  it('devuelve null con fecha inválida', () => {
    expect(parseWorkshopDate('no-fecha')).toBeNull();
    expect(parseWorkshopDate('2026-13-45')).toBeNull();
  });

  it('devuelve start y end con duración de 2 horas', () => {
    const result = parseWorkshopDate('2026-11-20T10:00');
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.end.getTime() - result.start.getTime()).toBe(2 * 60 * 60 * 1000);
  });
});

describe('hasCalendarDate', () => {
  it('true cuando hay fecha válida', () => {
    expect(hasCalendarDate(workshop)).toBe(true);
  });

  it('false cuando no hay fecha', () => {
    expect(hasCalendarDate({ ...workshop, eventDate: undefined })).toBe(false);
    expect(hasCalendarDate({ ...workshop, eventDate: 'basura' })).toBe(false);
  });
});

describe('formatIcsDate', () => {
  it('genera formato UTC básico sin guiones ni dos puntos', () => {
    const date = new Date(Date.UTC(2026, 10, 20, 10, 0, 0));
    expect(formatIcsDate(date)).toBe('20261120T100000Z');
  });

  it('elimina los milisegundos', () => {
    const date = new Date(Date.UTC(2026, 10, 20, 10, 0, 0, 250));
    expect(formatIcsDate(date)).toBe('20261120T100000Z');
  });
});

describe('buildWorkshopIcs', () => {
  it('devuelve cadena vacía sin fecha válida', () => {
    expect(buildWorkshopIcs({ ...workshop, eventDate: undefined })).toBe('');
  });

  it('contiene estructura VCALENDAR/VEVENT con fechas en UTC', () => {
    const ics = buildWorkshopIcs(workshop);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}Z/);
  });

  it('termina con CRLF y usa solo CRLF como separador', () => {
    const ics = buildWorkshopIcs(workshop);
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\r|\n/);
  });

  it('escapa comas, punto y coma y saltos de línea', () => {
    const ics = buildWorkshopIcs({
      ...workshop,
      title: 'Taller; nivel, avanzado',
      description: 'Línea uno\nLínea dos',
    });
    expect(ics).toContain('SUMMARY:Taller\\; nivel\\, avanzado');
    expect(ics).toContain('Línea uno\\nLínea dos');
  });

  it('incluye LOCATION solo si hay ubicación', () => {
    expect(buildWorkshopIcs(workshop)).toContain('LOCATION:Madrid\\, Plaza Mayor 1');
    expect(buildWorkshopIcs({ ...workshop, eventLocation: undefined })).not.toContain('LOCATION:');
  });

  it('añade ATTENDEE con nombre escapado cuando se pasa asistente', () => {
    const ics = buildWorkshopIcs(workshop, { name: 'Ana; María', email: 'ana@example.com' });
    expect(ics).toContain('ATTENDEE;CN=Ana\\; María;RSVP=TRUE:mailto:ana@example.com');
  });

  it('incluye Precio en DESCRIPTION cuando hay price', () => {
    expect(buildWorkshopIcs(workshop)).toContain('Precio: 25\\,00 €');
    expect(buildWorkshopIcs({ ...workshop, price: undefined })).not.toContain('Precio:');
  });

  it('pliega líneas largas con CRLF y espacio inicial', () => {
    const longTitle = 'x'.repeat(100);
    const ics = buildWorkshopIcs({ ...workshop, title: longTitle });
    const summaryLine = ics.split('\r\n').find((line) => line.startsWith('SUMMARY:'));
    expect(summaryLine).toBeDefined();
    expect(summaryLine!.length).toBeLessThanOrEqual(73);
    expect(ics).toContain(`SUMMARY:${'x'.repeat(65)}\r\n ${'x'.repeat(35)}`);
  });

  it('incluye UID estable con id del taller', () => {
    const ics = buildWorkshopIcs(workshop);
    expect(ics).toContain('UID:w-1-');
  });
});

describe('getGoogleCalendarUrl', () => {
  it('devuelve vacío sin fecha', () => {
    expect(getGoogleCalendarUrl({ ...workshop, eventDate: undefined })).toBe('');
  });

  it('construye URL con action, text y dates', () => {
    const url = getGoogleCalendarUrl(workshop);
    expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    const params = new URL(url).searchParams;
    expect(params.get('action')).toBe('TEMPLATE');
    expect(params.get('text')).toBe('Taller de acuarela, nivel 1');
    expect(params.get('dates')).toMatch(/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
    expect(params.get('location')).toBe('Madrid, Plaza Mayor 1');
  });
});

describe('getOutlookCalendarUrl', () => {
  it('devuelve vacío sin fecha', () => {
    expect(getOutlookCalendarUrl({ ...workshop, eventDate: undefined })).toBe('');
  });

  it('construye URL con subject y startdt ISO', () => {
    const url = getOutlookCalendarUrl(workshop);
    expect(url.startsWith('https://outlook.live.com/calendar/0/deeplink/compose?')).toBe(true);
    const params = new URL(url).searchParams;
    expect(params.get('subject')).toBe('Taller de acuarela, nivel 1');
    expect(params.get('startdt')).toBe(new Date(workshop.eventDate!).toISOString());
  });
});

describe('buildIcsFilename', () => {
  it('slugifica títulos con acentos y espacios', () => {
    expect(buildIcsFilename('Taller de acuarela')).toBe('laurel-taller-de-acuarela.ics');
  });

  it('sustituye caracteres no alfanuméricos por guiones', () => {
    expect(buildIcsFilename('Acuarela: nivel 2 (inv.)')).toBe('laurel-acuarela-nivel-2-inv.ics');
  });

  it('usa fallback taller con título vacío', () => {
    expect(buildIcsFilename('   ')).toBe('laurel-taller.ics');
  });
});
