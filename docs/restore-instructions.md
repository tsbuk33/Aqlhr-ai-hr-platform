# Retention v1 Dashboard Restore Instructions

This document provides step-by-step instructions for restoring the Retention v1 dashboard system from the savepoint created on 2025-08-23.

## Prerequisites

- PostgreSQL database access with `SUPERUSER` or `CREATE FUNCTION` privileges
- Supabase project with edge functions enabled
- Node.js/TypeScript frontend environment
- Required environment variables configured

## Restore Order (Critical)

**⚠️ IMPORTANT:** Follow this exact order to avoid dependency issues.

### Step 1: Database Functions (DB First)

Restore database functions in dependency order:

```sql
-- 1. Core utility functions (if missing)
-- These may already exist and should not be recreated

-- 2. Dashboard support functions
\i docs/savepoints/2025-08-23-retention-v1/sql/dashboard_get_series_v1.sql
\i docs/savepoints/2025-08-23-retention-v1/sql/dashboard_alerts_v1.sql
\i docs/savepoints/2025-08-23-retention-v1/sql/dev_backfill_kpis_v1.sql

-- 3. Employee seeding (if available)
-- Note: dev_seed_employees_v1 definition needs to be restored from migration history

-- 4. Retention core functions
-- Note: These functions were not found in current schema and need restoration:
-- - retention_overview_v1
-- - retention_drivers_v1  
-- - retention_watchlist_v1
-- - dev_seed_retention_v1
-- Refer to retention module migration files for complete definitions
```

#### Missing Functions Recovery

Several retention functions were not found in the current database. Restore from:
1. Check `supabase/migrations/` folder for retention-related SQL files
2. Look for migration files containing `retention_overview_v1`, etc.
3. Execute the CREATE FUNCTION statements from those files

### Step 2: Verify Database Schema

Ensure required tables exist:

```sql
-- Check critical tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'retention_risks',
    'retention_actions', 
    'retention_features',
    'kpi_snapshots',
    'hr_employees',
    'tasks'
);

-- Verify RLS policies are enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'retention_%';
```

### Step 3: Edge Functions

Deploy edge functions to Supabase:

```bash
# 1. Copy function files to supabase/functions/
cp docs/savepoints/2025-08-23-retention-v1/edge-functions/agent-retention-plan-v1.ts \
   supabase/functions/agent-retention-plan-v1/index.ts

cp docs/savepoints/2025-08-23-retention-v1/edge-functions/ask-aql-router-v1.ts \
   supabase/functions/ask-aql-router-v1/index.ts

# 2. Deploy functions
supabase functions deploy agent-retention-plan-v1
supabase functions deploy ask-aql-router-v1

# 3. Verify deployment
supabase functions list
```

#### Edge Function Configuration

Ensure environment variables are set:

```bash
# Set required secrets
supabase secrets set OPENAI_API_KEY=your_openai_key

# Verify secrets
supabase secrets list
```

### Step 4: Frontend Files

Restore key frontend components:

```bash
# Core hooks
cp docs/savepoints/2025-08-23-retention-v1/frontend/useRetention.ts \
   src/hooks/useRetention.ts

cp docs/savepoints/2025-08-23-retention-v1/frontend/useDashboardData.ts \
   src/hooks/useDashboardData.ts

# System components  
cp docs/savepoints/2025-08-23-retention-v1/frontend/AppProviders.tsx \
   src/components/providers/AppProviders.tsx

cp docs/savepoints/2025-08-23-retention-v1/frontend/RootErrorBoundary.tsx \
   src/components/system/RootErrorBoundary.tsx

cp docs/savepoints/2025-08-23-retention-v1/frontend/LanguageRouter.tsx \
   src/components/routing/LanguageRouter.tsx
```

### Step 5: Verification & Testing

#### Database Verification

```sql
-- Test core retention functions
SELECT retention_overview_v1('00000000-0000-0000-0000-000000000000'::uuid);
SELECT retention_drivers_v1('00000000-0000-0000-0000-000000000000'::uuid);
SELECT retention_watchlist_v1('00000000-0000-0000-0000-000000000000'::uuid);

-- Test dashboard functions
SELECT dashboard_get_series_v1('00000000-0000-0000-0000-000000000000'::uuid, 30);
SELECT dashboard_alerts_v1('00000000-0000-0000-0000-000000000000'::uuid);
```

#### Edge Function Testing

```bash
# Test agent retention plan
curl -X POST https://your-project.supabase.co/functions/v1/agent-retention-plan-v1 \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"test-tenant-id"}'

# Test AI router
curl -X POST https://your-project.supabase.co/functions/v1/ask-aql-router-v1 \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test retention query"}]}'
```

#### Frontend Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Navigate to retention module
# Visit: http://localhost:5173/en/diagnostic/retention
```

## Troubleshooting

### Common Issues

1. **Function Dependencies**: Ensure utility functions like `get_user_company_id()` exist before creating retention functions.

2. **Missing Migrations**: If retention functions are missing, they need to be recreated from the original migration files in `supabase/migrations/`.

3. **RLS Policies**: Verify that Row Level Security policies are properly configured for all retention tables.

4. **Edge Function Secrets**: Ensure `OPENAI_API_KEY` is set for AI action generation to work.

5. **Frontend Dependencies**: Check that all required npm packages are installed and UI components exist.

### Rollback Procedure

If restore fails:

```sql
-- Remove restored functions
DROP FUNCTION IF EXISTS retention_overview_v1(uuid);
DROP FUNCTION IF EXISTS retention_drivers_v1(uuid);
DROP FUNCTION IF EXISTS retention_watchlist_v1(uuid);
DROP FUNCTION IF EXISTS dev_seed_retention_v1(uuid);

-- Edge functions
supabase functions delete agent-retention-plan-v1
supabase functions delete ask-aql-router-v1
```

## Success Criteria

After successful restore:

✅ All 8 database functions execute without errors  
✅ Edge functions deploy and respond to test requests  
✅ Frontend loads retention pages without errors  
✅ Data seeding works (`dev_seed_retention_v1`)  
✅ AI action generation creates tasks successfully  
✅ Multi-language support functions properly  
✅ Error boundaries handle failures gracefully  

## Support

For issues during restore:
1. Check the original `CHANGELOG.md` for context
2. Review migration files in `supabase/migrations/`
3. Verify all environment variables are set
4. Test each component independently before integration

---

**Last Updated:** 2025-08-23  
**Tested On:** Supabase v2.50.3, Node.js v18+, React v18+