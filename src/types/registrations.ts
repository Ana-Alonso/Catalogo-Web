export type RegistrationStatus = 'pendiente' | 'confirmado' | 'cancelado';

export interface WorkshopRegistration {
  id: string;
  product_id: string;
  name: string;
  email: string;
  status: RegistrationStatus;
  privacy_consent_at: string | null;
  marketing_consent: boolean;
  quantity: number;
  amount: number | null;
  paid: boolean;
  paid_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
}

// Parche de la gestion de cobros del panel de admin.
export interface RegistrationPaymentPatch {
  amount?: number | null;
  paid?: boolean;
  fulfilled?: boolean;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  quantity?: number;
}

export interface WorkshopSpotsSummary {
  registered: number;
  cupo: number | null;
}
