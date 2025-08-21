-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- On-demand trigger function from UI
CREATE OR REPLACE FUNCTION public.compliance_run_now_v1(p_tenant uuid, p_dry boolean DEFAULT false)
RETURNS jsonb 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  v_response_id bigint;
  v_project_url text;
BEGIN
  -- Get the project URL from settings or construct it
  SELECT current_setting('app.supabase_url', true) INTO v_project_url;
  
  -- If not set, construct from environment
  IF v_project_url IS NULL OR v_project_url = '' THEN
    v_project_url := 'https://qcuhjcyjlkfizesndmth.supabase.co';
  END IF;

  -- Call the edge function via HTTP
  SELECT net.http_post(
    url := v_project_url || '/functions/v1/compliance-autopilot-daily-v1',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'tenantId', p_tenant::text, 
      'dryRun', p_dry,
      'runDate', CURRENT_DATE::text
    )::text
  ) INTO v_response_id;
  
  -- Log the compliance run request
  INSERT INTO public.compliance_runs (
    tenant_id,
    run_date,
    iqama_tasks,
    saudization_tasks,
    total_employees_checked,
    status,
    metadata
  ) VALUES (
    p_tenant,
    CURRENT_DATE,
    0,
    0,
    0,
    CASE WHEN p_dry THEN 'manual_dry_run_requested' ELSE 'manual_run_requested' END,
    jsonb_build_object(
      'triggered_by', 'manual',
      'http_request_id', v_response_id,
      'requested_at', now()
    )
  );
  
  RETURN jsonb_build_object(
    'status', 'queued',
    'tenant_id', p_tenant,
    'dry_run', p_dry,
    'request_id', v_response_id,
    'message', 'Compliance run has been queued for processing'
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO public.compliance_runs (
    tenant_id,
    run_date,
    iqama_tasks,
    saudization_tasks,
    total_employees_checked,
    status,
    metadata
  ) VALUES (
    p_tenant,
    CURRENT_DATE,
    0,
    0,
    0,
    'error',
    jsonb_build_object(
      'triggered_by', 'manual',
      'error_message', SQLERRM,
      'error_at', now()
    )
  );
  
  RETURN jsonb_build_object(
    'status', 'error',
    'error', SQLERRM,
    'message', 'Failed to queue compliance run'
  );
END;
$$;

-- Scheduled cron job for daily compliance runs at 02:00 KSA (23:00 UTC)
-- Run for all active companies
SELECT cron.schedule(
  'daily-compliance-autopilot',
  '0 23 * * *', -- Daily at 23:00 UTC (02:00 KSA)
  $$
  DO $$
  DECLARE
    company_record RECORD;
    v_project_url text := 'https://qcuhjcyjlkfizesndmth.supabase.co';
    v_response_id bigint;
  BEGIN
    -- Loop through all active companies
    FOR company_record IN 
      SELECT DISTINCT id 
      FROM public.companies 
      WHERE created_at IS NOT NULL 
      LIMIT 50 -- Safety limit
    LOOP
      BEGIN
        -- Call compliance autopilot for each company
        SELECT net.http_post(
          url := v_project_url || '/functions/v1/compliance-autopilot-daily-v1',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
          ),
          body := jsonb_build_object(
            'tenantId', company_record.id::text,
            'dryRun', false,
            'runDate', CURRENT_DATE::text
          )::text
        ) INTO v_response_id;
        
        -- Log the scheduled run
        INSERT INTO public.compliance_runs (
          tenant_id,
          run_date,
          iqama_tasks,
          saudization_tasks,
          total_employees_checked,
          status,
          metadata
        ) VALUES (
          company_record.id,
          CURRENT_DATE,
          0,
          0,
          0,
          'scheduled_run_requested',
          jsonb_build_object(
            'triggered_by', 'cron',
            'http_request_id', v_response_id,
            'scheduled_at', now()
          )
        );
        
      EXCEPTION WHEN OTHERS THEN
        -- Log cron job errors
        INSERT INTO public.compliance_runs (
          tenant_id,
          run_date,
          iqama_tasks,
          saudization_tasks,
          total_employees_checked,
          status,
          metadata
        ) VALUES (
          company_record.id,
          CURRENT_DATE,
          0,
          0,
          0,
          'cron_error',
          jsonb_build_object(
            'triggered_by', 'cron',
            'error_message', SQLERRM,
            'error_at', now()
          )
        );
      END;
    END LOOP;
  END $$;
  $$
);

-- Helper function to get demo tenant ID for testing
CREATE OR REPLACE FUNCTION public.get_demo_tenant_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id 
  FROM public.companies 
  WHERE name ILIKE '%demo%' OR name ILIKE '%test%'
  ORDER BY created_at DESC 
  LIMIT 1;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.compliance_run_now_v1(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_demo_tenant_id() TO authenticated, anon;