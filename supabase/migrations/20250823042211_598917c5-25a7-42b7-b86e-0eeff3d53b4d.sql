-- AqlHR Platform Kernel v1 - Core Schema
-- Create aqlhr_core schema for platform control plane

-- Core tenant management
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscription plans and limits
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feature entitlements per tenant
CREATE TABLE IF NOT EXISTS public.entitlements (
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT false,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tenant_id, feature)
);

-- Feature flags for A/B testing and gradual rollouts
CREATE TABLE IF NOT EXISTS public.feature_flags (
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  flag TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT 'false',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tenant_id, flag)
);

-- API tokens for external integrations
CREATE TABLE IF NOT EXISTS public.api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  hashed_secret TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

-- Audit trail (append-only, no PII)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor UUID,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Background job queue
CREATE TABLE IF NOT EXISTS public.job_queue (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'dead')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  run_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Tenant-scoped access
CREATE POLICY "Users can view their tenant data" ON public.tenants
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "Users can view plans" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Users can view their tenant entitlements" ON public.entitlements
  FOR SELECT USING (tenant_id = get_user_company_id());

CREATE POLICY "Users can view their tenant feature flags" ON public.feature_flags
  FOR ALL USING (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage their tenant API tokens" ON public.api_tokens
  FOR ALL USING (tenant_id = get_user_company_id());

CREATE POLICY "Users can view their tenant audit log" ON public.audit_log
  FOR SELECT USING (tenant_id = get_user_company_id());

CREATE POLICY "System can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their tenant jobs" ON public.job_queue
  FOR SELECT USING (tenant_id = get_user_company_id());

CREATE POLICY "System can insert jobs" ON public.job_queue
  FOR INSERT WITH CHECK (true);

-- Core RPC Functions
CREATE OR REPLACE FUNCTION public.core_is_allowed(p_feature TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_allowed BOOLEAN := false;
BEGIN
  v_tenant_id := get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT allowed INTO v_allowed
  FROM public.entitlements
  WHERE tenant_id = v_tenant_id AND feature = p_feature;
  
  RETURN COALESCE(v_allowed, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.core_emit_usage(p_event TEXT, p_meta JSONB DEFAULT '{}')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_dedup_key TEXT;
BEGIN
  v_tenant_id := get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Create dedup key from event + tenant + actor + timestamp (minute precision)
  v_dedup_key := md5(p_event || v_tenant_id::text || auth.uid()::text || date_trunc('minute', now())::text);
  
  INSERT INTO public.audit_log (tenant_id, actor, action, entity, details)
  VALUES (v_tenant_id, auth.uid(), p_event, 'usage', p_meta || jsonb_build_object('dedup_key', v_dedup_key))
  ON CONFLICT DO NOTHING; -- Ignore if duplicate within same minute
END;
$$;

CREATE OR REPLACE FUNCTION public.core_enqueue(p_type TEXT, p_payload JSONB DEFAULT '{}', p_run_at TIMESTAMPTZ DEFAULT now())
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_job_id BIGINT;
BEGIN
  v_tenant_id := get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'No tenant context available';
  END IF;
  
  INSERT INTO public.job_queue (tenant_id, type, payload, run_at)
  VALUES (v_tenant_id, p_type, p_payload, p_run_at)
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id::UUID;
END;
$$;

-- Audit triggers for key tables
CREATE OR REPLACE FUNCTION public.trigger_audit_cci_scores()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_log (tenant_id, actor, action, entity, entity_id, details)
  VALUES (
    NEW.tenant_id,
    auth.uid(),
    TG_OP || '_cci_score',
    'cci_scores',
    NEW.id,
    jsonb_build_object('survey_id', NEW.survey_id, 'wave_id', NEW.wave_id)
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_audit_hr_employees()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_log (tenant_id, actor, action, entity, entity_id, details)
  VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    auth.uid(),
    TG_OP || '_employee',
    'hr_employees',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('employee_no', COALESCE(NEW.employee_no, OLD.employee_no))
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers (check if tables exist first)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cci_scores') THEN
    DROP TRIGGER IF EXISTS audit_cci_scores ON cci_scores;
    CREATE TRIGGER audit_cci_scores
      AFTER INSERT OR UPDATE ON cci_scores
      FOR EACH ROW EXECUTE FUNCTION trigger_audit_cci_scores();
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hr_employees') THEN
    DROP TRIGGER IF EXISTS audit_hr_employees ON hr_employees;
    CREATE TRIGGER audit_hr_employees
      AFTER INSERT OR UPDATE OR DELETE ON hr_employees
      FOR EACH ROW EXECUTE FUNCTION trigger_audit_hr_employees();
  END IF;
END $$;

-- Insert demo data
INSERT INTO public.plans (code, name, limits) VALUES
  ('free', 'Free Plan', '{"users": 5, "storage_gb": 1, "api_calls": 1000}'),
  ('growth', 'Growth Plan', '{"users": 50, "storage_gb": 10, "api_calls": 10000}'),
  ('enterprise', 'Enterprise Plan', '{"users": -1, "storage_gb": 100, "api_calls": -1}')
ON CONFLICT (code) DO NOTHING;

-- Ensure demo tenant exists
INSERT INTO public.tenants (id, name, status) 
VALUES ('00000000-0000-0000-0000-000000000001'::UUID, 'Demo Company', 'active')
ON CONFLICT (id) DO NOTHING;

-- Grant demo tenant all features
INSERT INTO public.entitlements (tenant_id, feature, allowed) VALUES
  ('00000000-0000-0000-0000-000000000001'::UUID, 'cci', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'hr_analytics', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'osi', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'retention', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'hse', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'leo', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'geo', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'smart_reports', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'compliance_autopilot', true),
  ('00000000-0000-0000-0000-000000000001'::UUID, 'api_access', true)
ON CONFLICT (tenant_id, feature) DO NOTHING;