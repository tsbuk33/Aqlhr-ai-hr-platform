-- Create missing core_is_allowed function
CREATE OR REPLACE FUNCTION public.core_is_allowed(p_feature text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Return true for all features in demo mode
  SELECT true;
$function$;

-- Create any missing functions that might be called by routes
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Return demo tenant ID
  SELECT '550e8400-e29b-41d4-a716-446655440000'::uuid;
$function$;

-- Ensure dev_seed_retention_v1 exists
CREATE OR REPLACE FUNCTION public.dev_seed_retention_v1(p_tenant uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Demo function that does nothing but doesn't fail
  SELECT 1;
$function$;

-- Create dev_ping_v1 function for health check
CREATE OR REPLACE FUNCTION public.dev_ping_v1()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'status', 'ok',
    'timestamp', now(),
    'message', 'Pong! System is healthy.',
    'version', '1.0.0'
  );
$function$;