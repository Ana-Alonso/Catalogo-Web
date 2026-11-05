-- Renombrar la categoria de productos 'camisetas' por 'textiles'.

ALTER TABLE public.products
    DROP CONSTRAINT products_category_check;

ALTER TABLE public.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN ('personalizados', 'textiles', 'ilustraciones', 'talleres'));
