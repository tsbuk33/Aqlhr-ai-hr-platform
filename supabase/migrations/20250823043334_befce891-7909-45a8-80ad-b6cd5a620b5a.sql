-- AqlHR Platform Kernel v1
-- Schema: aqlhr_core
-- NOTE: We reuse public.get_user_company_id() and user_roles(role in 'admin','hr_manager','super_admin')

BEGIN;

CREATE SCHEMA IF NOT EXISTS aqlhr_core;

-- ========== TABLES ==========
-- Tenants registry (optional if already elsewhere; keep a mirror for kernel-level config)
CREATE TABLE IF NOT EXISTS aqlhr_core.tenants (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  status text CHECK (status IN ('active','suspended','trial')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Commercial plans
CREATE TABLE IF NOT EXISTS aqlhr_core.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  limits jsonb DEFAULT '{}'::jsonb
);

-- Entitlements: feature switches per tenant
CREATE TABLE IF NOT EXISTS aqlhr_core.entitlements (
  tenant_id uuid NOT NULL,
  feature text NOT NULL,
  allowed boolean NOT NULL DEFAULT false,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY(tenant_id, feature)
);

-- Feature flags (fine-grained)
CREATE TABLE IF NOT EXISTS aqlhr_core.feature_flags (
  tenant_id uuid NOT NULL,
  flag text NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY(tenant_id, flag)
);

-- API tokens (for future external integrations)
CREATE TABLE IF NOT EXISTS aqlhr_core.api_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  hashed_secret text NOT NULL,
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz
);

-- Audit log (append-only)
CREATE TABLE IF NOT EXISTS aqlhr_core.audit_log (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  actor uuid,
  action text NOT NULL,
  entity text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Job queue (reliable background work)
CREATE TABLE IF NOT EXISTS aqlhr_core.job_queue (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  type text NOT NULL,
  payload jsonb NOT NULL,
  status text CHECK (status IN ('queued','processing','completed','failed','dead')) DEFAULT 'queued',
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  run_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_core_entitlements_tenant ON aqlhr_core.entitlements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_core_flags_tenant ON aqlhr_core.feature_flags(tenant_id);
CREATE INDEX IF NOT EXISTS idx_core_audit_tenant_time ON aqlhr_core.audit_log(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_core_jobq_status_runat ON aqlhr_core.job_queue(status, run_at);
CREATE INDEX IF NOT EXISTS idx_core_jobq_tenant_status ON aqlhr_core.job_queue(tenant_id, status);

-- ========== RLS ==========
ALTER TABLE aqlhr_core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqlhr_core.job_queue ENABLE ROW LEVEL SECURITY;

-- Helper: is admin?
CREATE OR REPLACE FUNCTION aqlhr_core.core_user_is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin','hr_manager','super_admin')
  );
$$;

-- Tenant scoping predicate
CREATE OR REPLACE FUNCTION aqlhr_core.core_user_tenant()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
  SELECT public.get_user_company_id();
$$;

-- RLS policies (tenant members read their tenant; admins write; service role bypasses RLS as usual)
DO $$
BEGIN
  -- Tenants
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='tenants' AND policyname='tenant_read_tenants'
  ) THEN
    CREATE POLICY tenant_read_tenants ON aqlhr_core.tenants
      FOR SELECT USING (id = aqlhr_core.core_user_tenant());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='tenants' AND policyname='tenant_admin_write_tenants'
  ) THEN
    CREATE POLICY tenant_admin_write_tenants ON aqlhr_core.tenants
      FOR ALL USING (id = aqlhr_core.core_user_tenant())
      WITH CHECK (aqlhr_core.core_user_is_admin());
  END IF;

  -- Entitlements
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='entitlements' AND policyname='ent_read'
  ) THEN
    CREATE POLICY ent_read ON aqlhr_core.entitlements
      FOR SELECT USING (tenant_id = aqlhr_core.core_user_tenant());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='entitlements' AND policyname='ent_admin_write'
  ) THEN
    CREATE POLICY ent_admin_write ON aqlhr_core.entitlements
      FOR ALL USING (tenant_id = aqlhr_core.core_user_tenant())
      WITH CHECK (aqlhr_core.core_user_is_admin());
  END IF;

  -- Flags
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='feature_flags' AND policyname='flags_read'
  ) THEN
    CREATE POLICY flags_read ON aqlhr_core.feature_flags
      FOR SELECT USING (tenant_id = aqlhr_core.core_user_tenant());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='feature_flags' AND policyname='flags_admin_write'
  ) THEN
    CREATE POLICY flags_admin_write ON aqlhr_core.feature_flags
      FOR ALL USING (tenant_id = aqlhr_core.core_user_tenant())
      WITH CHECK (aqlhr_core.core_user_is_admin());
  END IF;

  -- API tokens (read masked; writes admin only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='api_tokens' AND policyname='tokens_read'
  ) THEN
    CREATE POLICY tokens_read ON aqlhr_core.api_tokens
      FOR SELECT USING (tenant_id = aqlhr_core.core_user_tenant());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='api_tokens' AND policyname='tokens_admin_write'
  ) THEN
    CREATE POLICY tokens_admin_write ON aqlhr_core.api_tokens
      FOR ALL USING (tenant_id = aqlhr_core.core_user_tenant())
      WITH CHECK (aqlhr_core.core_user_is_admin());
  END IF;

  -- Audit log: tenant read; INSERT via function only (see below)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='audit_log' AND policyname='audit_read'
  ) THEN
    CREATE POLICY audit_read ON aqlhr_core.audit_log
      FOR SELECT USING (tenant_id = aqlhr_core.core_user_tenant());
  END IF;

  -- Job queue: tenant read; INSERT via function; UPDATE/DELETE by worker only (function)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='aqlhr_core' AND tablename='job_queue' AND policyname='jobq_read'
  ) THEN
    CREATE POLICY jobq_read ON aqlhr_core.job_queue
      FOR SELECT USING (tenant_id = aqlhr_core.core_user_tenant());
  END IF;
END $$;

-- ========== FUNCTIONS / RPCs ==========
-- Check entitlement
CREATE OR REPLACE FUNCTION aqlhr_core.core_is_allowed(p_feature text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
  SELECT COALESCE( (SELECT allowed FROM aqlhr_core.entitlements
                    WHERE tenant_id = public.get_user_company_id()
                      AND feature = p_feature), false );
$$;

-- Emit audit usage (PDPL-safe; no PII)
CREATE OR REPLACE FUNCTION aqlhr_core.core_emit_usage(p_action text, p_entity text, p_entity_id uuid, p_details jsonb)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
  INSERT INTO aqlhr_core.audit_log (tenant_id, actor, action, entity, entity_id, details)
  VALUES (public.get_user_company_id(), auth.uid(), p_action, p_entity, p_entity_id, p_details);
$$;

-- Enqueue job (any tenant member may enqueue)
CREATE OR REPLACE FUNCTION aqlhr_core.core_enqueue(p_type text, p_payload jsonb, p_run_at timestamptz DEFAULT now())
RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
DECLARE v_id bigint;
BEGIN
  INSERT INTO aqlhr_core.job_queue (tenant_id, type, payload, run_at)
  VALUES (public.get_user_company_id(), p_type, p_payload, p_run_at)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Worker-only: claim jobs (service role uses this)
CREATE OR REPLACE FUNCTION aqlhr_core.core_claim_jobs(p_limit int, p_now timestamptz DEFAULT now())
RETURNS SETOF aqlhr_core.job_queue
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
BEGIN
  RETURN QUERY
  WITH c AS (
    SELECT id FROM aqlhr_core.job_queue
    WHERE status = 'queued' AND run_at <= p_now
    ORDER BY run_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  UPDATE aqlhr_core.job_queue q
     SET status='processing'
  FROM c WHERE q.id = c.id
  RETURNING q.*;
END;
$$;

-- Worker-only: complete/fail
CREATE OR REPLACE FUNCTION aqlhr_core.core_complete_job(p_id bigint, p_status text DEFAULT 'completed', p_error text DEFAULT NULL)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
  UPDATE aqlhr_core.job_queue
     SET status = CASE WHEN p_status IN ('completed','failed','dead') THEN p_status ELSE 'completed' END,
         attempts = CASE WHEN p_status='failed' THEN attempts+1 ELSE attempts END,
         last_error = p_error
   WHERE id = p_id;
$$;

-- Health snapshot (for /_/health)
CREATE OR REPLACE VIEW aqlhr_core.core_health_v1 AS
SELECT
  (SELECT COUNT(*) FROM aqlhr_core.job_queue WHERE status='queued') AS queued,
  (SELECT COUNT(*) FROM aqlhr_core.job_queue WHERE status='processing') AS processing,
  (SELECT COUNT(*) FROM aqlhr_core.job_queue WHERE status='failed') AS failed,
  (SELECT MAX(created_at) FROM aqlhr_core.audit_log) AS last_audit_at;

-- Example audit triggers (optional; keep lean)
CREATE OR REPLACE FUNCTION aqlhr_core.audit_touch()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, aqlhr_core
AS $$
BEGIN
  PERFORM aqlhr_core.core_emit_usage(
    TG_OP, TG_TABLE_NAME, COALESCE(NEW.id, OLD.id),
    jsonb_build_object('schema', TG_TABLE_SCHEMA)
  );
  RETURN NEW;
END; $$;

-- Attach to key tables (safe, no PII):
DROP TRIGGER IF EXISTS trg_audit_hr_employees ON public.hr_employees;
DROP TRIGGER IF EXISTS trg_audit_cci_scores ON public.cci_scores;

-- Only create triggers if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_employees') THEN
    CREATE TRIGGER trg_audit_hr_employees
    AFTER INSERT OR UPDATE OR DELETE ON public.hr_employees
    FOR EACH ROW EXECUTE FUNCTION aqlhr_core.audit_touch();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cci_scores') THEN
    CREATE TRIGGER trg_audit_cci_scores
    AFTER INSERT OR UPDATE OR DELETE ON public.cci_scores
    FOR EACH ROW EXECUTE FUNCTION aqlhr_core.audit_touch();
  END IF;
END $$;

-- Demo entitlements for current demo tenant
INSERT INTO aqlhr_core.entitlements(tenant_id, feature, allowed)
SELECT public.get_user_company_id(), f, true
FROM unnest(ARRAY['cci','osi','retention','compliance','ask_aql','exports','evidence_ai','autopilot']) AS f
ON CONFLICT (tenant_id, feature) DO UPDATE SET allowed = EXCLUDED.allowed;

COMMIT;