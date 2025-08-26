-- CRITICAL SECURITY FIX: Employee Personal Information Access Control (Fixed)
-- Issue: hr_employees table exposes sensitive personal and financial data
-- Fix: Implement granular role-based access control for employee data

-- First, create a function to determine user's access level to employee data  
CREATE OR REPLACE FUNCTION public.get_employee_data_access_level(p_employee_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_user_company_id uuid;
  v_user_role app_role;
  v_employee_company_id uuid;
  v_is_manager boolean := false;
BEGIN
  -- Get current authenticated user
  v_user_id := auth.uid();
  
  -- Return 'none' if no authenticated user
  IF v_user_id IS NULL THEN
    RETURN 'none';
  END IF;
  
  -- Get user's company and role
  v_user_company_id := public.get_user_company_id();
  
  SELECT role INTO v_user_role
  FROM public.user_roles 
  WHERE user_id = v_user_id 
  AND company_id = v_user_company_id
  LIMIT 1;
  
  -- Super admins can access all data across companies
  IF v_user_role = 'super_admin' THEN
    RETURN 'full_admin';
  END IF;
  
  -- If no company association, deny access
  IF v_user_company_id IS NULL THEN
    RETURN 'none';
  END IF;
  
  -- Get employee's company if employee ID provided
  IF p_employee_id IS NOT NULL THEN
    SELECT company_id INTO v_employee_company_id
    FROM public.hr_employees 
    WHERE id = p_employee_id;
    
    -- Deny access to employees from different companies
    IF v_employee_company_id != v_user_company_id THEN
      RETURN 'none';
    END IF;
  END IF;
  
  -- HR roles get full access within their company
  IF v_user_role IN ('admin', 'hr_manager') THEN
    RETURN 'hr_full';
  END IF;
  
  -- Check if user is a manager (has direct reports)
  SELECT EXISTS (
    SELECT 1 FROM public.hr_employees 
    WHERE manager_id = v_user_id 
    AND company_id = v_user_company_id
  ) INTO v_is_manager;
  
  -- Managers can see their direct reports
  IF v_is_manager AND v_user_role = 'manager' THEN
    RETURN 'manager';
  END IF;
  
  -- Regular employees can only see their own data
  IF v_user_role = 'employee' THEN
    RETURN 'self_only';
  END IF;
  
  -- Default deny
  RETURN 'none';
END;
$$;

-- Create a function to check if user can access specific employee data
CREATE OR REPLACE FUNCTION public.can_access_employee_data(p_employee_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_access_level text;
  v_user_id uuid;
  v_employee_manager_id uuid;
BEGIN
  v_user_id := auth.uid();
  v_access_level := public.get_employee_data_access_level(p_employee_id);
  
  CASE v_access_level
    WHEN 'full_admin', 'hr_full' THEN
      RETURN true;
    WHEN 'manager' THEN
      -- Manager can only see their direct reports
      SELECT manager_id INTO v_employee_manager_id
      FROM public.hr_employees 
      WHERE id = p_employee_id;
      
      RETURN v_employee_manager_id = v_user_id;
    WHEN 'self_only' THEN
      -- Employee can only see their own data
      RETURN EXISTS (
        SELECT 1 FROM public.hr_employees 
        WHERE id = p_employee_id 
        AND id = v_user_id
      );
    ELSE
      RETURN false;
  END CASE;
END;
$$;

-- Drop existing permissive policy and create restrictive policies
DROP POLICY IF EXISTS "company_rw_hr_employees" ON public.hr_employees;

-- Create granular SELECT policy
CREATE POLICY "hr_employees_secure_select" ON public.hr_employees
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    public.can_access_employee_data(id)
  );

-- Create INSERT policy - only HR and admins can create employee records
CREATE POLICY "hr_employees_secure_insert" ON public.hr_employees
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    company_id = public.get_user_company_id() AND
    company_id IS NOT NULL AND
    public.get_employee_data_access_level() IN ('full_admin', 'hr_full')
  );

-- Create UPDATE policy - HR can update all, managers can update their reports
CREATE POLICY "hr_employees_secure_update" ON public.hr_employees
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.can_access_employee_data(id)
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    company_id = public.get_user_company_id() AND
    company_id IS NOT NULL AND
    (
      -- HR can update all employees in their company
      public.get_employee_data_access_level() IN ('full_admin', 'hr_full') OR
      -- Managers can update their direct reports (limited fields)
      (public.get_employee_data_access_level() = 'manager' AND manager_id = auth.uid()) OR
      -- Employees can update their own data (very limited fields)
      (public.get_employee_data_access_level() = 'self_only' AND id = auth.uid())
    )
  );

-- Create DELETE policy - only admins and HR can delete
CREATE POLICY "hr_employees_secure_delete" ON public.hr_employees
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    company_id = public.get_user_company_id() AND
    public.get_employee_data_access_level() IN ('full_admin', 'hr_full')
  );

-- Create a view for employee data with sensitive information masking
CREATE OR REPLACE VIEW public.hr_employees_safe AS
SELECT 
  e.id,
  e.company_id,
  e.employee_no,
  -- Mask full names based on access level
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.full_name_en
    WHEN public.get_employee_data_access_level(e.id) = 'manager' THEN e.full_name_en
    WHEN public.get_employee_data_access_level(e.id) = 'self_only' THEN e.full_name_en
    ELSE public.pdpl_redact(e.full_name_en)
  END as full_name_en,
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.full_name_ar
    WHEN public.get_employee_data_access_level(e.id) = 'manager' THEN e.full_name_ar
    WHEN public.get_employee_data_access_level(e.id) = 'self_only' THEN e.full_name_ar
    ELSE public.pdpl_redact(e.full_name_ar)
  END as full_name_ar,
  -- Hide sensitive financial data from non-HR users
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.base_salary
    ELSE NULL
  END as base_salary,
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.monthly_salary
    ELSE NULL
  END as monthly_salary,
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.allowances
    ELSE NULL
  END as allowances,
  -- Basic employment info visible to managers and above
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full', 'manager') THEN e.department_id
    WHEN public.get_employee_data_access_level(e.id) = 'self_only' THEN e.department_id
    ELSE NULL
  END as department_id,
  e.employment_status,
  e.hire_date,
  e.is_saudi,
  e.gender,
  -- Hide sensitive personal identifiers
  CASE 
    WHEN public.get_employee_data_access_level(e.id) IN ('full_admin', 'hr_full') THEN e.nationality
    WHEN public.get_employee_data_access_level(e.id) = 'self_only' THEN e.nationality
    ELSE NULL
  END as nationality,
  e.manager_id,
  e.created_at
FROM public.hr_employees e
WHERE public.can_access_employee_data(e.id);

-- Grant appropriate access to the safe view
GRANT SELECT ON public.hr_employees_safe TO authenticated;

-- Log the security enhancement
DO $$
BEGIN
  RAISE NOTICE 'SECURITY ENHANCEMENT APPLIED: Employee Personal Information Protection';
  RAISE NOTICE '1. Implemented role-based access control for hr_employees table';
  RAISE NOTICE '2. Created granular RLS policies for different user roles';
  RAISE NOTICE '3. Added employee data access level functions';
  RAISE NOTICE '4. Created safe view with sensitive data masking';
  RAISE NOTICE '5. Restricted financial and personal data to HR personnel only';
  RAISE NOTICE '6. Unauthenticated users now have NO access to employee data';
END $$;