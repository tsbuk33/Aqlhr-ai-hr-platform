-- Update existing gov_adapters table structure
ALTER TABLE public.gov_adapters 
  ADD COLUMN IF NOT EXISTS config jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_error text;

-- Rename last_sync to last_synced_at for consistency
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gov_adapters' AND column_name = 'last_sync') THEN
    ALTER TABLE public.gov_adapters RENAME COLUMN last_sync TO last_synced_at;
  END IF;
END $$;

-- Update system check constraint
ALTER TABLE public.gov_adapters DROP CONSTRAINT IF EXISTS gov_adapters_system_check;
ALTER TABLE public.gov_adapters ADD CONSTRAINT gov_adapters_system_check 
  CHECK (system IN ('qiwa','gosi','absher'));

-- Update status check constraint  
ALTER TABLE public.gov_adapters DROP CONSTRAINT IF EXISTS gov_adapters_status_check;
ALTER TABLE public.gov_adapters ADD CONSTRAINT gov_adapters_status_check 
  CHECK (status IN ('connected','disconnected','demo'));

-- Create remaining tables
CREATE TABLE IF NOT EXISTS public.gov_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text check (system in ('qiwa','gosi','absher')) not null,
  job_type text check (job_type in ('full_sync','delta_sync','validate_iqamas','fetch_contribs','status_check')) not null,
  status text check (status in ('queued','running','success','error')) default 'queued',
  payload jsonb,
  result jsonb,
  created_at timestamptz default now(),
  started_at timestamptz,
  finished_at timestamptz,
  error text
);

CREATE TABLE IF NOT EXISTS public.gov_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text not null,
  event_at timestamptz default now(),
  kind text,
  severity text check (severity in ('info','warn','error')) default 'info',
  message text,
  data jsonb
);

CREATE INDEX IF NOT EXISTS idx_gov_events_tenant_time ON public.gov_events(tenant_id, event_at desc);

CREATE TABLE IF NOT EXISTS public.gov_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  system text not null,
  title text,
  storage_path text,
  meta jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.gov_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_documents ENABLE ROW LEVEL SECURITY;

-- Create/update policies
DROP POLICY IF EXISTS "tenant_rw_jobs" ON public.gov_sync_jobs;
DROP POLICY IF EXISTS "tenant_rw_events" ON public.gov_events;
DROP POLICY IF EXISTS "tenant_rw_docs" ON public.gov_documents;

CREATE POLICY "tenant_rw_jobs" ON public.gov_sync_jobs
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

CREATE POLICY "tenant_rw_events" ON public.gov_events
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

CREATE POLICY "tenant_rw_docs" ON public.gov_documents
  FOR ALL USING (tenant_id = public.get_user_company_id()) 
  WITH CHECK (tenant_id = public.get_user_company_id());

-- Helper functions
CREATE OR REPLACE FUNCTION public.gov_get_status_v1(p_tenant uuid)
RETURNS TABLE(system text, status text, last_synced_at timestamptz, last_error text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT system, status, last_synced_at, last_error
  FROM public.gov_adapters 
  WHERE tenant_id = p_tenant 
  ORDER BY system;
$$;

CREATE OR REPLACE FUNCTION public.gov_queue_job_v1(p_tenant uuid, p_system text, p_job text, p_payload jsonb default '{}'::jsonb)
RETURNS uuid
LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$
  INSERT INTO public.gov_sync_jobs(tenant_id, system, job_type, payload)
  VALUES (p_tenant, p_system, p_job, p_payload)
  RETURNING id;
$$;