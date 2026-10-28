const ELLIPSIS = '…';
const TRAILING_PUNCTUATION = /[\s,;:.\-–—]+$/;

export const truncateTitle = (value: string, limit: number): string => {
  const normalized = value.trim().replace(/\s+/g, ' ');

  if (limit <= 0) {
    return '';
  }

  if (normalized.length <= limit) {
    return normalized;
  }

  if (limit <= ELLIPSIS.length) {
    return ELLIPSIS.slice(0, limit);
  }

  const available = limit - ELLIPSIS.length;
  const slice = normalized.slice(0, available);
  const lastSpace = slice.lastIndexOf(' ');
  const clipped = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;

  return `${clipped.replace(TRAILING_PUNCTUATION, '')}${ELLIPSIS}`;
};
