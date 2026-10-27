interface LegalEnv {
  VITE_CONTACT_EMAIL?: string;
  VITE_LEGAL_HOLDER_NAME?: string;
  VITE_LEGAL_LOCALITY?: string;
  VITE_LEGAL_TAX_ID?: string;
  VITE_LEGAL_DOMICILE?: string;
}

const legalEnv = import.meta.env as unknown as LegalEnv;

const readEnv = (value: string | undefined): string => (value ?? '').trim();

export interface ResponsibleInfo {
  brand: string;
  name: string;
  locality: string;
  taxId: string;
  domicile: string;
  email: string;
}

export const RESPONSIBLE: ResponsibleInfo = {
  brand: 'Laurel en Lienzo',
  name: readEnv(legalEnv.VITE_LEGAL_HOLDER_NAME),
  locality: readEnv(legalEnv.VITE_LEGAL_LOCALITY),
  taxId: readEnv(legalEnv.VITE_LEGAL_TAX_ID),
  domicile: readEnv(legalEnv.VITE_LEGAL_DOMICILE),
  email: readEnv(legalEnv.VITE_CONTACT_EMAIL),
};

export const AEPD_URL = 'https://www.aepd.es';
