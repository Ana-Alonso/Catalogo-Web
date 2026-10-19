export type RegistrationStatus = 'pendiente' | 'confirmado' | 'cancelado';

export interface WorkshopRegistration {
  id: string;
  product_id: string;
  name: string;
  email: string;
  status: RegistrationStatus;
  created_at: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
}

export interface WorkshopSpotsSummary {
  registered: number;
  cupo: number | null;
}
