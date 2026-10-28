export interface ConfirmRequest {
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export type ConfirmFn = (request: ConfirmRequest) => Promise<boolean>;
