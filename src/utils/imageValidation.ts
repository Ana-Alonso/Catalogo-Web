const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_INPUT = ALLOWED_IMAGE_MIME_TYPES.join(',');

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa PNG, JPG, WEBP o GIF.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'La imagen supera los 5 MB.';
  }
  return null;
};
