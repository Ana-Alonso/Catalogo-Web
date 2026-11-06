import type {
  RegistrationStatus,
  WorkshopRegistration,
} from '../types/registrations';

export interface MarketingCsvRow {
  name: string;
  email: string;
  workshop: string;
  date: string;
  status: string;
  quantity: string;
}

const CSV_SEPARATOR = ';';
const CSV_BOM = String.fromCharCode(0xfeff);


const toRowCells = (row: MarketingCsvRow): string[] => [
  row.name,
  row.email,
  row.workshop,
  row.date,
  row.status,
  row.quantity,
];

const escapeCell = (value: string): string => {
  const normalized = value.replace(/\r\n?/g, ' ').trim();
  return /[",;\n]/.test(normalized)
    ? `"${normalized.replace(/"/g, '""')}"`
    : normalized;
};

export const buildMarketingCsvRows = (
  registrations: WorkshopRegistration[],
  workshopTitleById: Record<string, string>,
  translateStatus: (status: RegistrationStatus) => string
): MarketingCsvRow[] => {
  const contactsByEmail = new Map<string, MarketingCsvRow & { units: number }>();

  registrations
    .filter((registration) => registration.marketing_consent)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .forEach((registration) => {
      const key = registration.email.toLowerCase();
      const units = registration.quantity ?? 1;
      const title = workshopTitleById[registration.product_id] ?? '';
      const existing = contactsByEmail.get(key);

      if (existing) {
        // Lista de novedades: una sola fila por correo. La más reciente
        // aporta nombre, fecha y estado; el resto se acumula.
        if (title && !existing.workshop.split(', ').includes(title)) {
          existing.workshop = `${existing.workshop}, ${title}`;
        }
        existing.units += units;
        return;
      }

      contactsByEmail.set(key, {
        name: registration.name,
        email: registration.email,
        workshop: title,
        date: registration.created_at.slice(0, 10),
        status: translateStatus(registration.status),
        quantity: '0',
        units,
      });
    });

  return Array.from(contactsByEmail.values()).map(({ units, ...row }) => ({
    ...row,
    quantity: String(units),
  }));
};

export const buildCsv = (
  headers: string[],
  rows: MarketingCsvRow[]
): string => {
  const lines = [headers, ...rows.map(toRowCells)].map((cells) =>
    cells.map(escapeCell).join(CSV_SEPARATOR)
  );

  return `${CSV_BOM}${lines.join('\r\n')}\r\n`;
};

export const downloadCsvFile = (filename: string, csv: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
