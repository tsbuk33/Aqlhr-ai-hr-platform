-- CRITICAL SECURITY FIX: Employee Salary Information Exposed to Public Access
-- Issue: get_user_company_id() returns hardcoded demo value, making RLS ineffective
-- Fix: Implement proper company isolation based on authenticated user's company

-- First, create a proper get_user_company_id function that respects authentication
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_company_id uuid;
BEGIN
  -- Get current authenticated user
  v_user_id := auth.uid();
  
  -- Return null if no authenticated user
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- First try to get company_id from user_roles table
  SELECT company_id INTO v_company_id
  FROM public.user_roles 
  WHERE user_id = v_user_id 
  AND company_id IS NOT NULL
  LIMIT 1;
  
  -- If not found in user_roles, try profiles table
  IF v_company_id IS NULL THEN
    SELECT company_id INTO v_company_id
    FROM public.profiles 
    WHERE user_id = v_user_id 
    AND company_id IS NOT NULL;
  END IF;
  
  -- If still no company found, check user metadata for demo/dev mode
  IF v_company_id IS NULL THEN
    -- Check if user has company_id in metadata (for demo/dev purposes)
    SELECT (auth.jwt() ->> 'user_metadata' ->> 'company_id')::uuid INTO v_company_id;
  END IF;
  
  -- Final fallback for development/demo mode only
  -- This should be removed in production
  IF v_company_id IS NULL AND current_setting('app.environment', true) = 'development' THEN
    -- Return demo tenant ID only in development mode
    v_company_id := '550e8400-e29b-41d4-a716-446655440000'::uuid;
  END IF;
  
  RETURN v_company_id;
END;
$$;

-- Create a demo tenant ID getter for development/seeding purposes
CREATE OR REPLACE FUNCTION public.get_demo_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT '550e8400-e29b-41d4-a716-446655440000'::uuid;
$$;

-- Create a function to validate user access to company data
CREATE OR REPLACE FUNCTION public.validate_company_access(p_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_company_id uuid;
BEGIN
  v_user_company_id := public.get_user_company_id();
  
  -- Allow access if user's company matches requested company
  -- OR if user is super admin (can access all company data)
  RETURN (
    v_user_company_id = p_company_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'::app_role
    )
  );
END;
$$;

-- Update RLS policy on kpi_snapshots to be more explicit and secure
DROP POLICY IF EXISTS "company_rw_kpis" ON public.kpi_snapshots;

-- Create more restrictive policies
CREATE POLICY "kpi_snapshots_company_select" ON public.kpi_snapshots
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    public.validate_company_access(company_id)
  );

CREATE POLICY "kpi_snapshots_company_insert" ON public.kpi_snapshots
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    company_id = public.get_user_company_id() AND
    company_id IS NOT NULL
  );

CREATE POLICY "kpi_snapshots_company_update" ON public.kpi_snapshots
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.validate_company_access(company_id)
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    company_id = public.get_user_company_id() AND
    company_id IS NOT NULL
  );

CREATE POLICY "kpi_snapshots_company_delete" ON public.kpi_snapshots
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.validate_company_access(company_id) AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin'::app_role, 'super_admin'::app_role)
    )
  );

-- Create an audit function to check data exposure risks
CREATE OR REPLACE FUNCTION public.audit_data_exposure_risk()
RETURNS TABLE(
  table_name text,
  risk_level text,
  issue_description text,
  recommendation text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'kpi_snapshots'::text,
    'MEDIUM'::text as risk_level,
    'Contains sensitive financial metrics - ensure proper company isolation'::text,
    'Verify get_user_company_id() returns correct company for authenticated users'::text
  
  UNION ALL
  
  SELECT 
    t.tablename::text,
    CASE 
      WHEN NOT t.rowsecurity THEN 'HIGH'
      WHEN p.policy_count = 0 THEN 'HIGH'
      ELSE 'LOW'
    END::text as risk_level,
    CASE 
      WHEN NOT t.rowsecurity THEN 'RLS disabled on table with potential sensitive data'
      WHEN p.policy_count = 0 THEN 'RLS enabled but no policies defined'
      ELSE 'Properly secured with RLS policies'
    END::text,
    CASE 
      WHEN NOT t.rowsecurity THEN 'Enable RLS and create appropriate policies'
      WHEN p.policy_count = 0 THEN 'Create RLS policies to restrict data access'
      ELSE 'Regularly audit policies for effectiveness'
    END::text
  FROM pg_tables t
  LEFT JOIN (
    SELECT 
      schemaname, 
      tablename, 
      COUNT(*) as policy_count
    FROM pg_policies 
    WHERE schemaname = 'public'
    GROUP BY schemaname, tablename
  ) p ON t.schemaname = p.schemaname AND t.tablename = p.tablename
  WHERE t.schemaname = 'public'
  AND t.tablename IN ('hr_employees', 'payroll_data', 'salary_data', 'employee_salaries')
  ORDER BY 
    CASE risk_level
      WHEN 'HIGH' THEN 1
      WHEN 'MEDIUM' THEN 2
      ELSE 3
    END;
END;
$$;

-- Log the security fix
DO $$
BEGIN
  RAISE NOTICE 'SECURITY FIX APPLIED: Employee Salary Information Access Control';
  RAISE NOTICE '1. Fixed get_user_company_id() to properly authenticate users';
  RAISE NOTICE '2. Implemented company-based data isolation';
  RAISE NOTICE '3. Added granular RLS policies for kpi_snapshots';
  RAISE NOTICE '4. Added audit function for ongoing security monitoring';
  RAISE NOTICE '5. Unauthenticated users now have NO access to sensitive data';
END $$;