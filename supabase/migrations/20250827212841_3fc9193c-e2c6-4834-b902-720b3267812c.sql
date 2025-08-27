-- Fix search_path security issues in functions
-- Update functions to use secure search_path configuration

-- Fix get_user_company_id function
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  company_uuid uuid;
BEGIN
  SELECT company_id INTO company_uuid
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN company_uuid;
END;
$$;

-- Fix validate_company_access function  
CREATE OR REPLACE FUNCTION public.validate_company_access(target_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN target_company_id = public.get_user_company_id();
END;
$$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, target_role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = target_role
    AND company_id = public.get_user_company_id()
  );
END;
$$;

-- Add audit trail for security-sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    company_id,
    user_id,
    action,
    table_name,
    details,
    severity,
    category
  ) VALUES (
    public.get_user_company_id(),
    auth.uid(),
    p_event_type,
    'security_events',
    p_details,
    'warning',
    'security'
  );
END;
$$;