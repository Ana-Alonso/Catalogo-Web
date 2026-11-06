-- Añadir la categoria 'especiales' (Ocasionales o de Temporada) al CHECK de products.

ALTER TABLE public.products
    DROP CONSTRAINT IF EXISTS products_category_check;

ALTER TABLE public.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN ('personalizados', 'textiles', 'ilustraciones', 'talleres', 'especiales'));
