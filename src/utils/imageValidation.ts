const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_INPUT = ALLOWED_IMAGE_MIME_TYPES.join(',');

export type ImageValidationError = 'format' | 'size';

export const validateImageFile = (file: File): ImageValidationError | null => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return 'format';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'size';
  }
  return null;
};
