# Migraciones SQL

Orden de ejecución:

**Base de datos nueva (desde cero):**
1. `001_initial_schema.sql`
2. `002_hardening.sql`
3. `003_offers_etsy.sql`
4. `004_workshop_links.sql`
5. `005_rls_hardening.sql`

**Base de datos existente / legacy:**
1. `legacy/000_upgrade_existing.sql`
2. `002_hardening.sql`
3. `003_offers_etsy.sql`
4. `004_workshop_links.sql`
5. `005_rls_hardening.sql`

Las migraciones están pensadas para ser re-ejecutables cuando sea posible. `scripts/test-db.sql` contiene las aserciones usadas por `npm run test:db`.
