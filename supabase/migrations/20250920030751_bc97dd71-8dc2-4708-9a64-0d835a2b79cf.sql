-- Enhanced Employee PII Security Implementation (Corrected Column Names)
-- This migration adds stronger security controls for employee personal data

-- 1. Create a secure view that excludes most sensitive PII for general access
CREATE OR REPLACE VIEW public.employees_safe AS
SELECT 
  id,
  employee_number,
  first_name,
  last_name,
  first_name_ar,
  last_name_ar,
  -- Mask sensitive fields with partial visibility
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN national_id
    ELSE CASE 
      WHEN national_id IS NOT NULL THEN '****' || RIGHT(national_id, 4)
      ELSE NULL
    END
  END AS national_id_masked,
  
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN iqama_number
    ELSE CASE 
      WHEN iqama_number IS NOT NULL THEN '****' || RIGHT(iqama_number, 4)
      ELSE NULL
    END
  END AS iqama_number_masked,
  
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN phone
    ELSE CASE 
      WHEN phone IS NOT NULL THEN '****' || RIGHT(phone, 4)
      ELSE NULL
    END
  END AS phone_masked,
  
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN passport_number
    ELSE CASE 
      WHEN passport_number IS NOT NULL THEN '****' || RIGHT(passport_number, 4)
      ELSE NULL
    END
  END AS passport_number_masked,
  
  -- Show company email but mask personal email
  company_email,
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN personal_email
    ELSE CASE 
      WHEN personal_email IS NOT NULL THEN '****@' || SPLIT_PART(personal_email, '@', 2)
      ELSE NULL
    END
  END AS personal_email_masked,
  
  -- Hide salary information from general access
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN salary
    ELSE NULL
  END AS salary_info,
  
  CASE 
    WHEN is_super_admin() OR is_admin() OR is_hr_manager() THEN basic_salary
    ELSE NULL
  END AS basic_salary_info,
  
  department,
  position,
  position_ar,
  hire_date,
  status,
  is_saudi,
  nationality,
  company_id,
  created_at,
  updated_at
FROM public.employees
WHERE 
  -- Apply same access restrictions as main table
  (is_super_admin()) OR
  (is_admin() AND company_id = get_current_user_company_id()) OR
  (is_hr_manager() AND company_id = get_current_user_company_id()) OR
  (id = get_current_user_employee_id() AND company_id = get_current_user_company_id());

-- 2. Create a highly restricted view for full PII access (admin/HR only)
CREATE OR REPLACE VIEW public.employees_full_pii AS
SELECT *
FROM public.employees
WHERE 
  -- Only super admins, company admins, and HR managers can see full PII
  (is_super_admin()) OR
  (is_admin() AND company_id = get_current_user_company_id()) OR
  (is_hr_manager() AND company_id = get_current_user_company_id());

-- 3. Create audit function for PII access logging
CREATE OR REPLACE FUNCTION public.log_employee_pii_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Log PII access for UPDATE, INSERT, DELETE operations
  INSERT INTO public.audit_log (
    tenant_id,
    user_id,
    action,
    entity,
    entity_id,
    details
  ) VALUES (
    COALESCE(get_current_user_company_id(), '00000000-0000-0000-0000-000000000000'::uuid),
    auth.uid(),
    CASE TG_OP 
      WHEN 'UPDATE' THEN 'PII_UPDATE'
      WHEN 'INSERT' THEN 'PII_CREATE'
      WHEN 'DELETE' THEN 'PII_DELETE'
    END,
    'employees',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'employee_number', COALESCE(NEW.employee_number, OLD.employee_number),
      'access_type', 'sensitive_employee_data_modification',
      'user_role', CASE 
        WHEN is_super_admin() THEN 'super_admin'
        WHEN is_admin() THEN 'admin'
        WHEN is_hr_manager() THEN 'hr_manager'
        ELSE 'employee'
      END,
      'timestamp', now(),
      'operation', TG_OP,
      'sensitive_fields_modified', CASE 
        WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
          'national_id_changed', (OLD.national_id IS DISTINCT FROM NEW.national_id),
          'iqama_number_changed', (OLD.iqama_number IS DISTINCT FROM NEW.iqama_number),
          'passport_number_changed', (OLD.passport_number IS DISTINCT FROM NEW.passport_number),
          'phone_changed', (OLD.phone IS DISTINCT FROM NEW.phone),
          'personal_email_changed', (OLD.personal_email IS DISTINCT FROM NEW.personal_email),
          'salary_changed', (OLD.salary IS DISTINCT FROM NEW.salary),
          'basic_salary_changed', (OLD.basic_salary IS DISTINCT FROM NEW.basic_salary)
        )
        ELSE jsonb_build_object('operation', TG_OP)
      END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply audit trigger to employees table for data modification operations
DROP TRIGGER IF EXISTS employee_pii_access_audit ON public.employees;
CREATE TRIGGER employee_pii_modification_audit
  AFTER UPDATE OR INSERT OR DELETE ON public.employees
  FOR EACH ROW 
  EXECUTE FUNCTION public.log_employee_pii_modification();

-- 4. Create a function to check if user can access full PII
CREATE OR REPLACE FUNCTION public.can_access_employee_pii(employee_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins can access all PII
  IF is_super_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Admins and HR managers can access PII for their company employees
  IF (is_admin() OR is_hr_manager()) AND 
     (employee_id IS NULL OR EXISTS(
       SELECT 1 FROM public.employees 
       WHERE id = employee_id AND company_id = get_current_user_company_id()
     )) THEN
    RETURN TRUE;
  END IF;
  
  -- Employees can only access their own basic info (not full PII)
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Grant appropriate permissions on the new views
GRANT SELECT ON public.employees_safe TO authenticated;
GRANT SELECT ON public.employees_full_pii TO authenticated;

-- 6. Add documentation comments
COMMENT ON VIEW public.employees_safe IS 'Safe employee view with masked PII for general access - masks sensitive fields like national_id, iqama_number, passport_number, personal_email, phone, and salary for unauthorized users';
COMMENT ON VIEW public.employees_full_pii IS 'Full employee PII view restricted to super_admin, admin, and hr_manager roles only';
COMMENT ON FUNCTION public.can_access_employee_pii IS 'Security function to check if current user can access full employee PII data';
COMMENT ON FUNCTION public.log_employee_pii_modification IS 'Audit trigger function that logs all modifications to employee PII data for compliance';
COMMENT ON TRIGGER employee_pii_modification_audit ON public.employees IS 'Audit trigger that logs all modifications to employee PII data including which sensitive fields were changed';