-- Gestion de cobros desde el panel de admin.
--
-- Cada inscripción puede guardar un importe libre (amount, en euros, porque
-- hay ventas en establecimientos locales), si esta pagada (paid/paid_at) y
-- cuando se entrego el producto o la persona asistio al taller
-- (fulfilled_at). Los valores por defecto dejan las filas existentes como
-- "sin cobrar y sin entregar", que es el estado operativo correcto.

ALTER TABLE public.workshop_registrations
    ADD COLUMN IF NOT EXISTS amount NUMERIC(8,2),
    ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMPTZ;

ALTER TABLE public.workshop_registrations
    DROP CONSTRAINT IF EXISTS workshop_registrations_amount_check;

ALTER TABLE public.workshop_registrations
    ADD CONSTRAINT workshop_registrations_amount_check
    CHECK (amount IS NULL OR (amount >= 0 AND amount <= 99999.99));

-- Las columnas nuevas las escribe solo el panel de admin; la politica RLS
-- "Gestion de inscripciones solo a admins" ya cubre la tabla al completo,
-- y el INSERT publico via register_for_workshop usa los defaults.

NOTIFY pgrst, 'reload schema';
