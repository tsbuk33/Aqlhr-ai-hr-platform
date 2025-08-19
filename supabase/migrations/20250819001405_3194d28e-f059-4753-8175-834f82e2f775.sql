-- Create a retention policy function: delete logs older than 90 days
CREATE OR REPLACE FUNCTION public.purge_old_auth_email_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.auth_email_events
  WHERE sent_at < now() - interval '90 days';
  
  -- Log how many records were purged
  RAISE NOTICE 'Purged old auth_email_events records older than 90 days';
END;
$$;

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup to run daily at midnight UTC (much more efficient than trigger)
SELECT cron.schedule(
  'purge-old-auth-email-events',
  '0 0 * * *', -- Daily at midnight UTC
  'SELECT public.purge_old_auth_email_events();'
);