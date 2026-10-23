UPDATE public.products
SET "etsyLink" = NULL,
    "vintedLink" = NULL
WHERE category = 'talleres'
  AND ("etsyLink" IS NOT NULL OR "vintedLink" IS NOT NULL);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_workshop_links_check'
    ) THEN
        ALTER TABLE public.products
            ADD CONSTRAINT products_workshop_links_check
            CHECK (
                category <> 'talleres'
                OR ("etsyLink" IS NULL AND "vintedLink" IS NULL)
            )
            NOT VALID;
    END IF;
END $$;

ALTER TABLE public.products VALIDATE CONSTRAINT products_workshop_links_check;
