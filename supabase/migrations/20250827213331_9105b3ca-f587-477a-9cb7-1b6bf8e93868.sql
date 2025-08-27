-- Fix search_path security issues in existing functions without dropping them
-- This preserves RLS policies that depend on these functions

-- Update get_user_company_id function with secure search_path
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

-- Update validate_company_access function with secure search_path (keep original parameter name)
CREATE OR REPLACE FUNCTION public.validate_company_access(company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN company_id = public.get_user_company_id();
END;
$$;

-- Create has_role function if not exists with secure search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = _role
  );
END;
$$;