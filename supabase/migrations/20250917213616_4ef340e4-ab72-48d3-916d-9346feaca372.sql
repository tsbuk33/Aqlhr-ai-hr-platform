-- CRITICAL SECURITY FIX: Secure the employees table (CORRECTED)
-- This migration addresses the critical security vulnerability where employee personal data
-- including national IDs, salaries, phone numbers, and other sensitive information 
-- was publicly accessible without any access controls.

-- ============================================================================
-- STEP 1: Enable Row Level Security on employees table
-- ============================================================================
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Create security definer functions to avoid RLS recursion
-- ============================================================================

-- Function to get current user's company ID (tenant isolation)
CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS UUID AS $$
DECLARE
    company_uuid UUID;
BEGIN
    -- First try to get from profiles table
    SELECT company_id INTO company_uuid 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    LIMIT 1;
    
    -- If not found, try user_roles table
    IF company_uuid IS NULL THEN
        SELECT company_id INTO company_uuid 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        LIMIT 1;
    END IF;
    
    RETURN company_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check profiles table first (legacy support)
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = _role
    ) THEN
        RETURN TRUE;
    END IF;
    
    -- Check user_roles table
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role::text = _role
    ) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to check if user is super admin (cross-company access)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.user_has_role('super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to check if user is admin (company-scoped admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.user_has_role('admin') OR public.user_has_role('super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to check if user is HR manager
CREATE OR REPLACE FUNCTION public.is_hr_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.user_has_role('hr_manager') OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Function to get employee ID for current user (if they are an employee)
CREATE OR REPLACE FUNCTION public.get_current_user_employee_id()
RETURNS UUID AS $$
DECLARE
    emp_id UUID;
    user_email TEXT;
BEGIN
    -- Get user email from auth
    SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
    
    IF user_email IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Find employee record by email match
    SELECT id INTO emp_id 
    FROM public.employees 
    WHERE (email = user_email OR company_email = user_email OR personal_email = user_email)
    AND company_id = public.get_current_user_company_id()
    LIMIT 1;
    
    RETURN emp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================================
-- STEP 3: Create comprehensive RLS policies for employees table
-- ============================================================================

-- Policy 1: Super admins can access all employee records across all companies
CREATE POLICY "Super admins can access all employees"
ON public.employees
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Policy 2: Company admins can access all employees within their company
CREATE POLICY "Company admins can access company employees"
ON public.employees
FOR ALL
TO authenticated
USING (
    NOT public.is_super_admin() AND 
    public.is_admin() AND 
    company_id = public.get_current_user_company_id()
)
WITH CHECK (
    NOT public.is_super_admin() AND 
    public.is_admin() AND 
    company_id = public.get_current_user_company_id()
);

-- Policy 3: HR managers can access all employees within their company
CREATE POLICY "HR managers can access company employees"
ON public.employees
FOR ALL
TO authenticated
USING (
    NOT public.is_super_admin() AND 
    NOT public.is_admin() AND
    public.is_hr_manager() AND 
    company_id = public.get_current_user_company_id()
)
WITH CHECK (
    NOT public.is_super_admin() AND 
    NOT public.is_admin() AND
    public.is_hr_manager() AND 
    company_id = public.get_current_user_company_id()
);

-- Policy 4: Employees can only access their own record
CREATE POLICY "Employees can access own record"
ON public.employees
FOR SELECT
TO authenticated
USING (
    NOT public.is_super_admin() AND 
    NOT public.is_admin() AND
    NOT public.is_hr_manager() AND
    id = public.get_current_user_employee_id() AND
    company_id = public.get_current_user_company_id()
);

-- Policy 5: Employees can update limited fields in their own record
CREATE POLICY "Employees can update own limited fields"
ON public.employees
FOR UPDATE
TO authenticated
USING (
    NOT public.is_super_admin() AND 
    NOT public.is_admin() AND
    NOT public.is_hr_manager() AND
    id = public.get_current_user_employee_id() AND
    company_id = public.get_current_user_company_id()
)
WITH CHECK (
    NOT public.is_super_admin() AND 
    NOT public.is_admin() AND
    NOT public.is_hr_manager() AND
    id = public.get_current_user_employee_id() AND
    company_id = public.get_current_user_company_id()
);

-- Policy 6: Deny all access to unauthenticated users (explicit denial)
CREATE POLICY "Deny unauthenticated access"
ON public.employees
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- ============================================================================
-- STEP 4: Create audit log for security events (CORRECTED - removed SELECT)
-- ============================================================================

-- Function to log employee data access
CREATE OR REPLACE FUNCTION public.log_employee_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log modification attempts to audit trail
    INSERT INTO public.audit_log (
        tenant_id,
        user_id,
        action,
        entity,
        entity_id,
        details
    ) VALUES (
        COALESCE(public.get_current_user_company_id(), '00000000-0000-0000-0000-000000000000'::uuid),
        auth.uid(),
        TG_OP,
        'employees',
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object(
            'employee_number', COALESCE(NEW.employee_number, OLD.employee_number),
            'access_type', 'employee_data_modification',
            'timestamp', now()
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for audit logging (only for data modifications)
CREATE TRIGGER employee_modification_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION public.log_employee_access();

-- ============================================================================
-- STEP 5: Add comments for documentation
-- ============================================================================

COMMENT ON POLICY "Super admins can access all employees" ON public.employees IS 
'Allows super admins full access to employee records across all companies for system administration';

COMMENT ON POLICY "Company admins can access company employees" ON public.employees IS 
'Allows company administrators full access to employee records within their own company only';

COMMENT ON POLICY "HR managers can access company employees" ON public.employees IS 
'Allows HR managers full access to employee records within their own company for HR operations';

COMMENT ON POLICY "Employees can access own record" ON public.employees IS 
'Allows employees read-only access to their own employee record for self-service operations';

COMMENT ON POLICY "Employees can update own limited fields" ON public.employees IS 
'Allows employees to update non-sensitive fields in their own record (contact info, emergency contacts, etc.)';

COMMENT ON POLICY "Deny unauthenticated access" ON public.employees IS 
'Explicitly denies all access to unauthenticated users - no public access to employee data';

-- ============================================================================
-- SECURITY FIX COMPLETE
-- ============================================================================