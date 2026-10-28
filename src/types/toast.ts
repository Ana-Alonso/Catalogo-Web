export type ToastKind = 'success' | 'error' | 'info';

export interface ToastOptions {
  durationMs?: number;
}

export interface ToastRecord {
  id: string;
  kind: ToastKind;
  message: string;
  durationMs: number;
  createdAt: number;
}

export interface ToastApi {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}
