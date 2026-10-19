import type { CatalogItem } from '../types/catalog';

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export interface WorkshopEventDate {
  start: Date;
  end: Date;
}

export const parseWorkshopDate = (eventDate?: string): WorkshopEventDate | null => {
  if (!eventDate) {
    return null;
  }
  const start = new Date(eventDate);
  if (Number.isNaN(start.getTime())) {
    return null;
  }
  return { start, end: new Date(start.getTime() + DEFAULT_DURATION_MS) };
};

export const hasCalendarDate = (workshop: CatalogItem): boolean =>
  parseWorkshopDate(workshop.eventDate) !== null;

export const formatIcsDate = (date: Date): string =>
  date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

const escapeIcsText = (text: string): string =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

const foldIcsLine = (line: string): string => {
  if (line.length <= 73) {
    return line;
  }
  const segments: string[] = [];
  let remaining = line;
  segments.push(remaining.slice(0, 73));
  remaining = remaining.slice(73);
  while (remaining.length > 0) {
    segments.push(` ${remaining.slice(0, 72)}`);
    remaining = remaining.slice(72);
  }
  return segments.join('\r\n');
};

export const buildWorkshopIcs = (
  workshop: CatalogItem,
  attendee?: { name: string; email: string }
): string => {
  const eventDate = parseWorkshopDate(workshop.eventDate);
  if (!eventDate) {
    return '';
  }

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
  const description = workshop.price
    ? `${workshop.description}\nPrecio: ${workshop.price}`
    : workshop.description;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Laurel en Lienzo//Talleres//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${workshop.id}-${eventDate.start.getTime()}@laurelenlienzo`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(eventDate.start)}`,
    `DTEND:${formatIcsDate(eventDate.end)}`,
    `SUMMARY:${escapeIcsText(workshop.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
  ];

  if (workshop.eventLocation) {
    lines.push(`LOCATION:${escapeIcsText(workshop.eventLocation)}`);
  }
  if (contactEmail) {
    lines.push(`ORGANIZER;CN=Laurel en Lienzo:mailto:${contactEmail}`);
  }
  if (attendee) {
    lines.push(
      `ATTENDEE;CN=${escapeIcsText(attendee.name)};RSVP=TRUE:mailto:${attendee.email}`
    );
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`;
};

export const getGoogleCalendarUrl = (workshop: CatalogItem): string => {
  const eventDate = parseWorkshopDate(workshop.eventDate);
  if (!eventDate) {
    return '';
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: workshop.title,
    dates: `${formatIcsDate(eventDate.start)}/${formatIcsDate(eventDate.end)}`,
    details: workshop.price
      ? `${workshop.description}\nPrecio: ${workshop.price}`
      : workshop.description,
    location: workshop.eventLocation || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getOutlookCalendarUrl = (workshop: CatalogItem): string => {
  const eventDate = parseWorkshopDate(workshop.eventDate);
  if (!eventDate) {
    return '';
  }
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: workshop.title,
    startdt: eventDate.start.toISOString(),
    enddt: eventDate.end.toISOString(),
    body: workshop.price
      ? `${workshop.description}\nPrecio: ${workshop.price}`
      : workshop.description,
    location: workshop.eventLocation || '',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

export const downloadIcsFile = (filename: string, ics: string): void => {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const buildIcsFilename = (title: string): string => {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `laurel-${slug || 'taller'}.ics`;
};
