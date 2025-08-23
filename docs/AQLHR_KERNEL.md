# AqlHR Platform Kernel v1

A lightweight control plane for corporate readiness, tenant management, and feature gating.

## Overview

The AqlHR Kernel provides:
- **Tenant Management**: Multi-tenant isolation with plans and entitlements
- **Feature Gating**: Server-side feature access control 
- **Audit Trail**: Comprehensive activity logging (PDPL compliant)
- **Job Queue**: Background task processing with retry logic
- **Health Monitoring**: System status and performance metrics

## Database Schema

### Core Tables

- `tenants` - Company/organization records
- `plans` - Subscription plans with feature limits
- `entitlements` - Feature access per tenant
- `feature_flags` - A/B testing and gradual rollouts
- `api_tokens` - External integration tokens
- `audit_log` - Activity trail (append-only)
- `job_queue` - Background task queue

### Security

All tables use Row-Level Security (RLS) with tenant-scoped policies. Audit logs are append-only and contain no PII.

## Core Functions

### Feature Access

```sql
SELECT core_is_allowed('cci') -- Returns boolean
```

Checks if current tenant has access to specified feature.

### Usage Tracking

```sql
SELECT core_emit_usage('dashboard_view', '{"page": "analytics"}')
```

Records usage events with deduplication (1-minute window).

### Job Scheduling

```sql
SELECT core_enqueue('recompute_kpis', '{"module": "cci"}', now() + interval '5 minutes')
```

Schedules background jobs with delayed execution.

## Frontend Integration

### Feature Gating Hook

```typescript
import { useEntitlement } from '@/lib/core/useEntitlement';

function MyComponent() {
  const { allowed, loading } = useEntitlement('cci');
  
  if (!allowed) return <UpgradePrompt />;
  return <CCIModule />;
}
```

### Entitlement Gate Component

```typescript
import { EntitlementGate } from '@/components/core/EntitlementGate';

<EntitlementGate feature="cci" featureName="Culture Intelligence">
  <CCIModule />
</EntitlementGate>
```

## Job Processing

The `kernel-worker-v1` Edge Function processes queued jobs:

- **recompute_kpis**: Refresh dashboard metrics
- **refresh_materialized_views**: Update cached data
- **send_export**: Generate and deliver exports
- **pulse_schedule**: Send scheduled notifications
- **evidence_embed**: Process AI embeddings
- **compliance_run**: Execute compliance checks

### Job Handlers

Jobs execute with exponential backoff on failure (2^attempts minutes). After 3 failures, jobs move to "dead" status for manual review.

## Demo Setup

### 1. Seed Demo Tenant

```sql
-- Already created in migration
-- Demo tenant ID: 00000000-0000-0000-0000-000000000001
```

### 2. Grant Feature Access

```sql
INSERT INTO entitlements (tenant_id, feature, allowed) VALUES
  ('00000000-0000-0000-0000-000000000001', 'cci', true),
  ('00000000-0000-0000-0000-000000000001', 'osi', true);
```

### 3. Test Feature Access

```sql
SELECT core_is_allowed('cci'); -- Should return true
```

### 4. Enqueue Test Job

```sql
SELECT core_enqueue('recompute_kpis', '{"test": true}');
```

### 5. Process Jobs

The worker runs automatically, or trigger manually:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/kernel-worker-v1
```

## Health Monitoring

Visit `/_/health` for system status:

- **Job Queue**: Queued, processing, failed, and dead job counts
- **Performance**: Database latency and response times  
- **Activity**: Recent audit events and system activity

Green status indicates healthy operation. Yellow/red indicate issues requiring attention.

## API Integration

Generate API tokens for external systems:

```sql
INSERT INTO api_tokens (tenant_id, name, scopes, hashed_secret)
VALUES (
  get_user_company_id(),
  'External Dashboard',
  ARRAY['read_analytics', 'write_jobs'],
  crypt('your-secret-key', gen_salt('bf'))
);
```

## Security Considerations

- All functions use `SECURITY DEFINER` with `SET search_path = 'public'`
- RLS policies enforce tenant isolation
- Audit logs contain no PII (use entity IDs only)
- API tokens use bcrypt hashing
- Feature checks default to `false` (fail-safe)

## Troubleshooting

### Feature Always Returns False

Check entitlements table:
```sql
SELECT * FROM entitlements WHERE tenant_id = get_user_company_id();
```

### Jobs Not Processing

Check job queue:
```sql
SELECT * FROM job_queue WHERE status != 'completed' ORDER BY created_at DESC;
```

Trigger worker manually:
```sql
SELECT net.http_post(url := 'https://your-project.supabase.co/functions/v1/kernel-worker-v1');
```

### High Error Rates

Check audit log for patterns:
```sql
SELECT action, count(*) FROM audit_log 
WHERE created_at > now() - interval '1 hour'
GROUP BY action ORDER BY count DESC;
```

## Extending the Kernel

### Adding New Features

1. Insert feature definition:
```sql
INSERT INTO entitlements (tenant_id, feature, allowed) 
VALUES (tenant_id, 'new_feature', false);
```

2. Create gated component:
```typescript
<EntitlementGate feature="new_feature">
  <NewFeatureComponent />
</EntitlementGate>
```

### Adding Job Types

1. Add handler to `kernel-worker-v1/index.ts`
2. Enqueue jobs using `core_enqueue()`
3. Monitor via health dashboard

### Custom Audit Events

Use `core_emit_usage()` to track custom events:
```sql
SELECT core_emit_usage('custom_action', jsonb_build_object('key', 'value'));
```