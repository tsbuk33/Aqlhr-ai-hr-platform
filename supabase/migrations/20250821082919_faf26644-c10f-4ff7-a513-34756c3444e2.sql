-- Government Adapter Layer v1 - Database Schema

-- Adapter configs (do NOT store secrets here; only meta + status)
CREATE TABLE IF NOT EXISTS public.gov_adapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  system text CHECK (system IN ('MOL','QIWA','GOSI','ABSHER')) NOT NULL,
  mode text CHECK (mode IN ('test','live')) DEFAULT 'test',
  status text CHECK (status IN ('connected','pending','error')) DEFAULT 'pending',
  last_sync timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_gov_adapters_tenant_system ON public.gov_adapters(tenant_id, system);

-- Sync logs (sanitized; no PII)
CREATE TABLE IF NOT EXISTS public.gov_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  system text CHECK (system IN ('MOL','QIWA','GOSI','ABSHER')) NOT NULL,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  status text CHECK (status IN ('ok','partial','error')) DEFAULT 'ok',
  request jsonb,
  result jsonb,
  error text
);

CREATE INDEX IF NOT EXISTS idx_gov_logs_tenant_system ON public.gov_sync_logs(tenant_id, system, started_at);

-- Change set table (what the adapter says changed)
CREATE TABLE IF NOT EXISTS public.gov_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  system text NOT NULL,
  change_type text CHECK (change_type IN ('new_hire','termination','iqama_update','saudization_rate','contract_update')) NOT NULL,
  reference text,               -- external ref or employee_no (not iqama #)
  effective_date date,
  payload jsonb,                -- redacted details
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gov_changes_tenant_processed ON public.gov_changes(tenant_id, processed);

-- Enable RLS
ALTER TABLE public.gov_adapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_changes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "tenant_rw_gov_adapters" ON public.gov_adapters
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

CREATE POLICY "tenant_rw_gov_sync_logs" ON public.gov_sync_logs
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

CREATE POLICY "tenant_rw_gov_changes" ON public.gov_changes
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

-- RPC functions for UI
CREATE OR REPLACE FUNCTION public.gov_get_status_v1(p_tenant uuid)
RETURNS TABLE(system text, mode text, status text, last_sync timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT system, mode, status, last_sync
  FROM public.gov_adapters
  WHERE tenant_id = p_tenant
  ORDER BY system;
$$;

CREATE OR REPLACE FUNCTION public.gov_get_changes_v1(p_tenant uuid, p_limit int DEFAULT 50)
RETURNS TABLE(id uuid, system text, change_type text, reference text, effective_date date, processed boolean, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT id, system, change_type, reference, effective_date, processed, created_at
  FROM public.gov_changes
  WHERE tenant_id = p_tenant
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION public.gov_mark_change_processed_v1(p_tenant uuid, p_change_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  UPDATE public.gov_changes SET processed = true
  WHERE id = p_change_id AND tenant_id = p_tenant;
END;
$$;