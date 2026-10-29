-- Almacén durable de cubos de limitación de peticiones.
-- Las instancias serverless no comparten memoria, así que el límite se guarda
-- en la base de datos y se consume de forma atómica mediante una función.

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
    bucket_key text PRIMARY KEY,
    attempts integer NOT NULL DEFAULT 1,
    window_started_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS rate_limit_buckets_window_started_at_idx
    ON public.rate_limit_buckets (window_started_at);

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.rate_limit_buckets FROM anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
    p_bucket_key text,
    p_limit integer,
    p_window_ms integer
)
RETURNS TABLE (allowed boolean, retry_after_seconds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_now_ms bigint := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
BEGIN
    IF random() < 0.02 THEN
        DELETE FROM public.rate_limit_buckets
        WHERE window_started_at < v_now_ms - (p_window_ms * 10);
    END IF;

    RETURN QUERY
    WITH upserted AS (
        INSERT INTO public.rate_limit_buckets (bucket_key, attempts, window_started_at)
        VALUES (p_bucket_key, 1, v_now_ms)
        ON CONFLICT (bucket_key) DO UPDATE SET
            attempts = CASE
                WHEN public.rate_limit_buckets.window_started_at + p_window_ms <= v_now_ms THEN 1
                WHEN public.rate_limit_buckets.attempts >= p_limit THEN p_limit + 1
                ELSE public.rate_limit_buckets.attempts + 1
            END,
            window_started_at = CASE
                WHEN public.rate_limit_buckets.window_started_at + p_window_ms <= v_now_ms THEN v_now_ms
                ELSE public.rate_limit_buckets.window_started_at
            END
        RETURNING
            public.rate_limit_buckets.attempts AS attempts,
            public.rate_limit_buckets.window_started_at AS window_started_at
    )
    SELECT
        (u.attempts <= p_limit) AS allowed,
        CASE
            WHEN u.attempts <= p_limit THEN 0
            ELSE ceil((u.window_started_at + p_window_ms - v_now_ms) / 1000.0)::integer
        END AS retry_after_seconds
    FROM upserted u;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;

NOTIFY pgrst, 'reload schema';
