const pad = (value: number): string => String(value).padStart(2, '0');

export const toUtcDeadline = (naiveLocal: string | undefined): string | undefined => {
  if (!naiveLocal) {
    return undefined;
  }
  const timestamp = new Date(naiveLocal).getTime();
  if (Number.isNaN(timestamp)) {
    return undefined;
  }
  return new Date(timestamp).toISOString();
};

export const toDatetimeLocalValue = (utcIso: string | null | undefined): string => {
  if (!utcIso) {
    return '';
  }
  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};
