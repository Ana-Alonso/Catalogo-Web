#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTAINER="laurel-db-test"
IMAGE="postgres:15"
PSQL_USER="postgres"

command -v docker >/dev/null 2>&1 || { echo "ERROR: docker no está disponible"; exit 1; }

cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> Levantando PostgreSQL 15 en Docker..."
docker run -d --name "$CONTAINER" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=laurel "$IMAGE" >/dev/null

for _ in $(seq 1 30); do
  if docker exec "$CONTAINER" pg_isready -U "$PSQL_USER" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

docker exec "$CONTAINER" pg_isready -U "$PSQL_USER" >/dev/null

create_storage_stub() {
  local db="$1"
  docker exec -i "$CONTAINER" psql -U "$PSQL_USER" -d "$db" -v ON_ERROR_STOP=1 -q <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE TABLE IF NOT EXISTS storage.buckets (id TEXT PRIMARY KEY, name TEXT, public BOOLEAN DEFAULT false);
CREATE TABLE IF NOT EXISTS storage.objects (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, bucket_id TEXT, name TEXT);
SQL
}

run_file() {
  local db="$1"
  local file="$2"
  docker exec -i "$CONTAINER" psql -U "$PSQL_USER" -d "$db" -v ON_ERROR_STOP=1 -q < "$file"
}

echo "==> BBDD 1 (laurel): stub storage + migración x2 + endurecimiento x2"
create_storage_stub laurel
run_file laurel "$ROOT_DIR/supabase-migration.sql"
run_file laurel "$ROOT_DIR/supabase-migration.sql"
run_file laurel "$ROOT_DIR/supabase-hardening.sql"
run_file laurel "$ROOT_DIR/supabase-hardening.sql"

echo "==> BBDD 1: suite de aserciones"
run_file laurel "$ROOT_DIR/scripts/test-db.sql"

echo "==> BBDD 2 (laurel_fresh): stub storage + schema.sql + endurecimiento"
docker exec "$CONTAINER" createdb -U "$PSQL_USER" laurel_fresh
create_storage_stub laurel_fresh
run_file laurel_fresh "$ROOT_DIR/supabase-schema.sql"
run_file laurel_fresh "$ROOT_DIR/supabase-hardening.sql"
run_file laurel_fresh "$ROOT_DIR/scripts/test-db.sql"

echo "==> TODO OK: 2 bases de datos y aserciones superadas"
