ALTER TABLE public.workshop_registrations
    ADD COLUMN IF NOT EXISTS privacy_consent_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;
