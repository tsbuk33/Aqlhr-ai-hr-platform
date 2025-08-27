-- Fix search_path security issues in functions (corrected)
-- Drop and recreate functions to avoid parameter name conflicts

DROP FUNCTION IF EXISTS public.validate_company_access(uuid);
DROP FUNCTION IF EXISTS public.get_user_company_id();
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Recreate get_user_company_id function with secure search_path
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

-- Recreate validate_company_access function with secure search_path
CREATE OR REPLACE FUNCTION public.validate_company_access(p_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN p_company_id = public.get_user_company_id();
END;
$$;

-- Recreate has_role function with secure search_path
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = p_user_id 
    AND role = p_role
    AND company_id = public.get_user_company_id()
  );
END;
$$;