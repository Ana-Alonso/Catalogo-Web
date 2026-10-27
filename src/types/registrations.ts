export type RegistrationStatus = 'pendiente' | 'confirmado' | 'cancelado';

export interface WorkshopRegistration {
  id: string;
  product_id: string;
  name: string;
  email: string;
  status: RegistrationStatus;
  privacy_consent_at: string | null;
  marketing_consent: boolean;
  created_at: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

export interface WorkshopSpotsSummary {
  registered: number;
  cupo: number | null;
}
