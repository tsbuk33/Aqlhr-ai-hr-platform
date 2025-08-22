-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily government sync job at 06:00 KSA time (03:00 UTC)
-- This will automatically run the government job runner daily
SELECT cron.schedule(
  'gov-daily-sync',
  '0 3 * * *', -- 06:00 KSA = 03:00 UTC
  $$
  SELECT
    net.http_post(
        url:='https://qcuhjcyjlkfizesndmth.supabase.co/functions/v1/gov_job_runner_v1',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc"}'::jsonb,
        body:='{"tenantId": null, "testMode": false}'::jsonb
    ) as request_id;
  $$
);

-- Function to manually trigger government sync for all tenants
CREATE OR REPLACE FUNCTION public.trigger_gov_sync_all_tenants()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tenant_record RECORD;
BEGIN
  -- Loop through all tenants that have government adapters
  FOR tenant_record IN 
    SELECT DISTINCT tenant_id 
    FROM public.gov_adapters 
    WHERE status IN ('connected', 'demo')
  LOOP
    -- Queue a full sync job for each system
    INSERT INTO public.gov_sync_jobs (tenant_id, system, job_type, payload)
    VALUES 
      (tenant_record.tenant_id, 'qiwa', 'full_sync', '{"auto_scheduled": true}'::jsonb),
      (tenant_record.tenant_id, 'gosi', 'full_sync', '{"auto_scheduled": true}'::jsonb),
      (tenant_record.tenant_id, 'absher', 'full_sync', '{"auto_scheduled": true}'::jsonb);
  END LOOP;
  
  RAISE NOTICE 'Queued government sync jobs for all active tenants';
END;
$$;

-- Function to get cron job status
CREATE OR REPLACE FUNCTION public.get_gov_cron_status()
RETURNS TABLE(
  jobid bigint,
  schedule text,
  command text,
  nodename text,
  nodeport integer,
  database text,
  username text,
  active boolean,
  jobname text
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM cron.job WHERE jobname = 'gov-daily-sync';
$$;