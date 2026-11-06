-- Renombrar la categoria de productos 'camisetas' por 'textiles'.
-- El UPDATE va antes de revalidar el CHECK: con filas 'camisetas' presentes
-- el ADD CONSTRAINT falla con 23514 (#80). DROP IF EXISTS permite re-ejecutar
-- esta migracion sobre una BD donde un intento anterior quedo a medias.

ALTER TABLE public.products
    DROP CONSTRAINT IF EXISTS products_category_check;

UPDATE public.products
SET category = 'textiles'
WHERE category = 'camisetas';

ALTER TABLE public.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN ('personalizados', 'textiles', 'ilustraciones', 'talleres'));
