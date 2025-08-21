-- Owner Bootstrap Helper Function (Production Safe)
-- This function helps set up the initial super admin user safely

CREATE OR REPLACE FUNCTION public.bootstrap_owner(
  p_auth_uid uuid,
  p_company_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb := '{}';
  v_existing_role text;
  v_existing_company uuid;
BEGIN
  -- Validate input
  IF p_auth_uid IS NULL THEN
    RAISE EXCEPTION 'Auth UID cannot be null';
  END IF;
  
  -- Check if user already has roles
  SELECT role INTO v_existing_role 
  FROM public.user_roles 
  WHERE user_id = p_auth_uid 
  LIMIT 1;
  
  -- Check existing profile
  SELECT company_id INTO v_existing_company 
  FROM public.profiles 
  WHERE user_id = p_auth_uid;
  
  -- Insert super_admin role if not exists
  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (p_auth_uid, 'super_admin', COALESCE(p_company_id, v_existing_company))
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update or insert profile
  INSERT INTO public.profiles (user_id, company_id, created_at, updated_at)
  VALUES (p_auth_uid, COALESCE(p_company_id, v_existing_company), now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    company_id = COALESCE(EXCLUDED.company_id, profiles.company_id),
    updated_at = now();
  
  -- Build result
  v_result := jsonb_build_object(
    'success', true,
    'auth_uid', p_auth_uid,
    'company_id', COALESCE(p_company_id, v_existing_company),
    'existing_role', v_existing_role,
    'bootstrap_completed', true
  );
  
  RETURN v_result;
END;
$$;

-- Helper function to get current user's auth UID (for convenience)
CREATE OR REPLACE FUNCTION public.get_current_auth_uid()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

-- Helper function to bootstrap current user as owner (dev/preview only)
CREATE OR REPLACE FUNCTION public.bootstrap_current_user_as_owner(p_company_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow in development/preview environments
  -- You can remove this check if needed in production
  IF current_setting('app.environment', true) = 'production' THEN
    RAISE EXCEPTION 'This function is disabled in production for security';
  END IF;
  
  RETURN public.bootstrap_owner(auth.uid(), p_company_id);
END;
$$;