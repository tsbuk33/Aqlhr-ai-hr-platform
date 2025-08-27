-- Critical Security Fix: Protect Employee Medical Data (PHI)
-- This addresses HIPAA/medical privacy compliance requirements

-- 1. Drop overly permissive policy
DROP POLICY IF EXISTS "Users can manage HSE medical surveillance from their company" ON public.hse_medical_surveillance;

-- 2. Create medical data access audit log table
CREATE TABLE IF NOT EXISTS public.medical_data_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  access_type TEXT NOT NULL,
  table_name TEXT NOT NULL DEFAULT 'hse_medical_surveillance',
  data_accessed JSONB,
  justification TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.medical_data_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins and medical officers can view audit logs
CREATE POLICY "medical_audit_restricted_access" 
ON public.medical_data_audit_log FOR SELECT
USING (
  company_id = get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'hr_admin', 'medical_officer', 'hse_manager')
  )
);

-- 3. Create medical data access function with audit trail
CREATE OR REPLACE FUNCTION public.log_medical_access(
  p_employee_id UUID,
  p_access_type TEXT,
  p_data_accessed JSONB DEFAULT NULL,
  p_justification TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.medical_data_audit_log (
    company_id, user_id, employee_id, access_type, 
    data_accessed, justification, ip_address, user_agent
  ) VALUES (
    get_user_company_id(),
    auth.uid(),
    p_employee_id,
    p_access_type,
    p_data_accessed,
    p_justification,
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
END;
$$;

-- 4. Create function to check medical data access permissions
CREATE OR REPLACE FUNCTION public.can_access_medical_data()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only specific roles can access medical data
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.company_id = get_user_company_id()
    AND ur.role IN ('admin', 'super_admin', 'hr_admin', 'medical_officer', 'hse_manager')
  );
END;
$$;

-- 5. Create strict RLS policies for medical data
-- Only authorized medical personnel can SELECT medical data
CREATE POLICY "medical_data_authorized_select" 
ON public.hse_medical_surveillance FOR SELECT
USING (
  company_id = get_user_company_id() AND
  can_access_medical_data() AND
  -- Log every access attempt
  (SELECT public.log_medical_access(employee_id, 'SELECT', to_jsonb(hse_medical_surveillance.*), 'Authorized medical data access') IS NULL)
);

-- Only medical officers and HR admins can INSERT medical data
CREATE POLICY "medical_data_authorized_insert" 
ON public.hse_medical_surveillance FOR INSERT
WITH CHECK (
  company_id = get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin', 'hr_admin', 'medical_officer', 'hse_manager')
  )
);

-- Only medical officers and HR admins can UPDATE medical data
CREATE POLICY "medical_data_authorized_update" 
ON public.hse_medical_surveillance FOR UPDATE
USING (
  company_id = get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin', 'hr_admin', 'medical_officer', 'hse_manager')
  )
) WITH CHECK (
  company_id = get_user_company_id()
);

-- Only super admins can DELETE medical data (for compliance retention)
CREATE POLICY "medical_data_authorized_delete" 
ON public.hse_medical_surveillance FOR DELETE
USING (
  company_id = get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('super_admin')
  )
);

-- 6. Create medical data masking function for unauthorized users
CREATE OR REPLACE FUNCTION public.get_masked_medical_data(p_employee_id UUID)
RETURNS TABLE(
  id UUID,
  employee_id UUID,
  examination_type TEXT,
  examination_date DATE,
  next_examination_date DATE,
  fitness_status TEXT,
  medical_provider TEXT,
  restrictions TEXT,
  recommendations TEXT,
  follow_up_required BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has medical data access
  IF can_access_medical_data() THEN
    -- Return full data for authorized users
    RETURN QUERY
    SELECT 
      hms.id, hms.employee_id, hms.examination_type, hms.examination_date,
      hms.next_examination_date, hms.fitness_status, hms.medical_provider,
      hms.restrictions, hms.recommendations, hms.follow_up_required,
      hms.created_at, hms.updated_at
    FROM public.hse_medical_surveillance hms
    WHERE hms.employee_id = p_employee_id 
    AND hms.company_id = get_user_company_id();
  ELSE
    -- Return masked data for unauthorized users
    RETURN QUERY
    SELECT 
      hms.id, hms.employee_id, 
      '*** CONFIDENTIAL ***'::TEXT as examination_type,
      NULL::DATE as examination_date,
      hms.next_examination_date, -- Keep next exam date for scheduling
      CASE 
        WHEN hms.fitness_status = 'fit' THEN 'fit'
        ELSE '*** RESTRICTED ***'
      END::TEXT as fitness_status,
      '*** CONFIDENTIAL ***'::TEXT as medical_provider,
      '*** CONFIDENTIAL ***'::TEXT as restrictions,
      '*** CONFIDENTIAL ***'::TEXT as recommendations,
      hms.follow_up_required,
      hms.created_at, hms.updated_at
    FROM public.hse_medical_surveillance hms
    WHERE hms.employee_id = p_employee_id 
    AND hms.company_id = get_user_company_id();
  END IF;
END;
$$;

-- 7. Add medical data retention policy (7 years as per regulations)
CREATE OR REPLACE FUNCTION public.cleanup_expired_medical_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Archive medical data older than 7 years
  -- In production, you'd move to archive table instead of delete
  DELETE FROM public.hse_medical_surveillance 
  WHERE created_at < (NOW() - INTERVAL '7 years');
  
  -- Clean old audit logs after 10 years
  DELETE FROM public.medical_data_audit_log 
  WHERE created_at < (NOW() - INTERVAL '10 years');
END;
$$;