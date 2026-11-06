import type {
  RegistrationStatus,
  WorkshopRegistration,
} from '../types/registrations';

const CSV_SEPARATOR = ';';
const CSV_BOM = String.fromCharCode(0xfeff);

export interface MarketingContactRow {
  name: string;
  email: string;
  date: string;
}

const escapeCell = (value: string): string => {
  const normalized = value.replace(/\r\n?/g, ' ').trim();
  return /[",;\n]/.test(normalized)
    ? `"${normalized.replace(/"/g, '""')}"`
    : normalized;
};

export const buildCsv = (headers: string[], rows: string[][]): string => {
  const lines = [headers, ...rows].map((cells) =>
    cells.map(escapeCell).join(CSV_SEPARATOR)
  );

  return `${CSV_BOM}${lines.join('\r\n')}\r\n`;
};

// Lista de novedades: una sola fila por persona, aunque se haya apuntado a
// talleres y reservado productos. La inscripción más reciente aporta nombre,
// correo y fecha.
export const buildMarketingContacts = (
  registrations: WorkshopRegistration[]
): MarketingContactRow[] => {
  const contactsByEmail = new Map<string, MarketingContactRow>();

  registrations
    .filter((registration) => registration.marketing_consent)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .forEach((registration) => {
      const key = registration.email.toLowerCase();

      if (!contactsByEmail.has(key)) {
        contactsByEmail.set(key, {
          name: registration.name,
          email: registration.email,
          date: registration.created_at.slice(0, 10),
        });
      }
    });

  return Array.from(contactsByEmail.values());
};

// Listas de gestión: una fila por inscripción, sin mezclar talleres y productos.
export const buildRegistrationRows = (
  registrations: WorkshopRegistration[],
  productIds: Set<string>,
  productTitleById: Record<string, string>,
  translateStatus: (status: RegistrationStatus) => string,
  options: { withQuantity: boolean }
): string[][] =>
  registrations
    .filter((registration) => productIds.has(registration.product_id))
    .sort(
      (a, b) =>
        (productTitleById[a.product_id] ?? '').localeCompare(
          productTitleById[b.product_id] ?? '',
          'es'
        ) || b.created_at.localeCompare(a.created_at)
    )
    .map((registration) => [
      registration.name,
      registration.email,
      productTitleById[registration.product_id] ?? '',
      registration.created_at.slice(0, 10),
      translateStatus(registration.status),
      ...(options.withQuantity ? [String(registration.quantity ?? 1)] : []),
    ]);

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
