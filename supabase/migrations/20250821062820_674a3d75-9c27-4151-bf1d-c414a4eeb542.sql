-- Security Hardening v1: Enhanced audit logging and security features (Fixed)

-- Enhance existing audit_logs table with missing columns
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_role TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'data_change';

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON public.audit_logs(session_id);

-- Update RLS policies for stricter admin access
DROP POLICY IF EXISTS "Users can view audit logs from their company" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs from their company" ON public.audit_logs;

CREATE POLICY "Admins can view audit logs from their company"
ON public.audit_logs 
FOR SELECT 
USING (
  company_id = get_user_company_id() 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- System can always insert audit logs
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs"
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Add data retention metadata to key tables
ALTER TABLE public.hr_employees 
ADD COLUMN IF NOT EXISTS data_retention_policy JSONB DEFAULT '{
  "retention_years": 7,
  "purge_after_termination": true,
  "encryption_required": false,
  "pii_fields": ["national_id", "iqama_id", "passport_number"]
}'::jsonb,
ADD COLUMN IF NOT EXISTS audit_metadata JSONB DEFAULT '{
  "created_by": null,
  "last_modified_by": null,
  "modification_count": 0,
  "sensitive_data_access_log": []
}'::jsonb;

ALTER TABLE public.saudi_documents 
ADD COLUMN IF NOT EXISTS data_retention_policy JSONB DEFAULT '{
  "retention_years": 10,
  "auto_purge": true,
  "encryption_required": true
}'::jsonb;

-- Create enhanced audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_company_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'data_change'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_audit_id UUID;
  v_user_email TEXT;
  v_user_role TEXT;
BEGIN
  -- Get user details
  SELECT email INTO v_user_email 
  FROM auth.users 
  WHERE id = p_user_id;
  
  -- Get primary user role
  SELECT role::TEXT INTO v_user_role
  FROM public.user_roles 
  WHERE user_id = p_user_id 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Insert audit log
  INSERT INTO public.audit_logs (
    company_id, user_id, user_email, user_role, action, table_name,
    record_id, old_values, new_values, severity, category,
    ip_address, user_agent, session_id
  ) VALUES (
    p_company_id, p_user_id, v_user_email, v_user_role, p_action, p_table_name,
    p_record_id, p_old_values, p_new_values, p_severity, p_category,
    inet_client_addr(), 
    current_setting('request.headers', true)::jsonb->>'user-agent',
    current_setting('request.jwt.claims', true)::jsonb->>'session_id'
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$;

-- Create audit trigger function for employee changes
CREATE OR REPLACE FUNCTION public.audit_employee_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
  v_action TEXT;
  v_old_values JSONB;
  v_new_values JSONB;
BEGIN
  -- Get current user and company
  v_user_id := auth.uid();
  v_company_id := get_user_company_id();
  
  -- Skip if no authenticated user (system operations)
  IF v_user_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Determine action and values
  IF TG_OP = 'INSERT' THEN
    v_action := 'employee_created';
    v_new_values := to_jsonb(NEW);
    v_old_values := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'employee_updated';
    v_old_values := to_jsonb(OLD);
    v_new_values := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'employee_deleted';
    v_old_values := to_jsonb(OLD);
    v_new_values := NULL;
  END IF;
  
  -- Log the audit event
  PERFORM public.log_audit_event(
    v_company_id,
    v_user_id,
    v_action,
    'hr_employees',
    COALESCE(NEW.id, OLD.id),
    v_old_values,
    v_new_values,
    'info',
    'employee_management'
  );
  
  -- Update audit metadata for updates
  IF TG_OP = 'UPDATE' THEN
    NEW.audit_metadata := jsonb_set(
      COALESCE(NEW.audit_metadata, '{}'::jsonb),
      '{last_modified_by}',
      to_jsonb(v_user_id::text)
    );
    NEW.audit_metadata := jsonb_set(
      NEW.audit_metadata,
      '{modification_count}',
      to_jsonb((COALESCE(OLD.audit_metadata->>'modification_count', '0'))::integer + 1)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit trigger function for task changes
CREATE OR REPLACE FUNCTION public.audit_task_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tenant_id UUID;
BEGIN
  v_user_id := auth.uid();
  v_tenant_id := get_user_company_id();
  
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Log task completion specifically
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'completed' THEN
    PERFORM public.log_audit_event(
      v_tenant_id,
      v_user_id,
      'task_completed',
      'tasks',
      NEW.id,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status, 'completed_at', NEW.closed_at),
      'info',
      'task_management'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add audit triggers
DROP TRIGGER IF EXISTS audit_employee_changes_trigger ON public.hr_employees;
CREATE TRIGGER audit_employee_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.hr_employees
  FOR EACH ROW EXECUTE FUNCTION public.audit_employee_changes();

DROP TRIGGER IF EXISTS audit_task_changes_trigger ON public.tasks;
CREATE TRIGGER audit_task_changes_trigger
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.audit_task_changes();

-- Create session security configuration table
CREATE TABLE IF NOT EXISTS public.security_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  session_idle_timeout_minutes INTEGER NOT NULL DEFAULT 30,
  session_max_duration_hours INTEGER NOT NULL DEFAULT 24,
  require_2fa_for_admins BOOLEAN NOT NULL DEFAULT true,
  password_min_length INTEGER NOT NULL DEFAULT 12,
  password_require_special BOOLEAN NOT NULL DEFAULT true,
  login_attempt_limit INTEGER NOT NULL DEFAULT 5,
  lockout_duration_minutes INTEGER NOT NULL DEFAULT 30,
  audit_retention_days INTEGER NOT NULL DEFAULT 2555, -- 7 years
  data_encryption_at_rest BOOLEAN NOT NULL DEFAULT true,
  require_session_confirmation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

-- Enable RLS on security config
ALTER TABLE public.security_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage security config for their tenant"
ON public.security_config 
FOR ALL 
USING (
  tenant_id = get_user_company_id() 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('admin', 'super_admin')
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_security_config_updated_at
BEFORE UPDATE ON public.security_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default security config for existing tenants (only where company_id is not null)
INSERT INTO public.security_config (tenant_id)
SELECT DISTINCT company_id 
FROM public.user_roles ur
WHERE company_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.security_config sc 
    WHERE sc.tenant_id = ur.company_id
  )
ON CONFLICT (tenant_id) DO NOTHING;