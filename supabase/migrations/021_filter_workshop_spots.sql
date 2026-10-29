CREATE OR REPLACE FUNCTION public.workshop_spots()
RETURNS TABLE (product_id UUID, taken BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.product_id AS product_id, count(*)::BIGINT AS taken
    FROM public.workshop_registrations r
    JOIN public.products p ON p.id = r.product_id
    WHERE r.status <> 'cancelado'
      AND (
        public.is_admin()
        OR (
          p.category = 'talleres'
          AND p."isVisible"
          AND NOT p."workshopCancelled"
        )
      )
    GROUP BY r.product_id;
$$;

REVOKE ALL ON FUNCTION public.workshop_spots() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.workshop_spots() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
