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
}

const CSV_SEPARATOR = ';';
const CSV_BOM = String.fromCharCode(0xfeff);


const toRowCells = (row: MarketingCsvRow): string[] => [
  row.name,
  row.email,
  row.workshop,
  row.date,
  row.status,
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
): MarketingCsvRow[] =>
  registrations
    .filter((registration) => registration.marketing_consent)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((registration) => ({
      name: registration.name,
      email: registration.email,
      workshop: workshopTitleById[registration.product_id] ?? '',
      date: registration.created_at.slice(0, 10),
      status: translateStatus(registration.status),
    }));

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
