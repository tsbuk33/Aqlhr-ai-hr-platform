-- Step 2: Complete AI Sync Engine & Admin Reporting Enhancement

-- 1. Add missing indexes on ai_sync_events for performance
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_company_event_type ON public.ai_sync_events(company_id, event_type);
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_status_created ON public.ai_sync_events(sync_status, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_source_table ON public.ai_sync_events(source_table, created_at);

-- 2. Add additional_attributes JSONB column to employees for flexible data storage
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS additional_attributes JSONB DEFAULT '{}'::jsonb;

-- 3. Create comprehensive employee_reports table
CREATE TABLE IF NOT EXISTS public.employee_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  report_name text NOT NULL,
  report_description text,
  filters JSONB DEFAULT '{}'::jsonb,
  report_data JSONB NOT NULL,
  generated_by uuid NOT NULL,
  generated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on employee_reports
ALTER TABLE public.employee_reports ENABLE ROW LEVEL SECURITY;

-- RLS policy for admin-only access to employee reports
DROP POLICY IF EXISTS "Admin users can manage employee reports" ON public.employee_reports;
CREATE POLICY "Admin users can manage employee reports" 
ON public.employee_reports 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Enhanced AI Sync trigger function with comprehensive employee data capture
CREATE OR REPLACE FUNCTION public.enhanced_employee_ai_sync()
RETURNS TRIGGER AS $$
DECLARE
  v_affected_modules text[];
  v_comprehensive_payload jsonb;
BEGIN
  -- Determine affected modules based on changed fields
  v_affected_modules := ARRAY['core_hr', 'payroll', 'performance', 'compliance'];
  
  -- Add specific modules based on data changes
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.salary IS DISTINCT FROM NEW.salary OR OLD.basic_salary IS DISTINCT FROM NEW.basic_salary) THEN
      v_affected_modules := v_affected_modules || ARRAY['payroll', 'gosi', 'benefits'];
    END IF;
    
    IF (OLD.department IS DISTINCT FROM NEW.department OR OLD.position IS DISTINCT FROM NEW.position) THEN
      v_affected_modules := v_affected_modules || ARRAY['org_chart', 'succession_planning'];
    END IF;
    
    IF (OLD.is_saudi IS DISTINCT FROM NEW.is_saudi OR OLD.nationality IS DISTINCT FROM NEW.nationality) THEN
      v_affected_modules := v_affected_modules || ARRAY['qiwa', 'nitaqat', 'government_compliance'];
    END IF;
    
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
      v_affected_modules := v_affected_modules || ARRAY['attendance', 'leave_management', 'performance'];
    END IF;
  END IF;
  
  -- Create comprehensive payload with all employee data
  v_comprehensive_payload := jsonb_build_object(
    'employee_data', to_jsonb(COALESCE(NEW, OLD)),
    'change_metadata', jsonb_build_object(
      'operation', TG_OP,
      'timestamp', now(),
      'table_name', TG_TABLE_NAME,
      'changed_fields', CASE 
        WHEN TG_OP = 'UPDATE' THEN (
          SELECT jsonb_object_agg(key, jsonb_build_object('old', old_value, 'new', new_value))
          FROM (
            SELECT key, 
                   old_row.value as old_value, 
                   new_row.value as new_value
            FROM jsonb_each(to_jsonb(OLD)) old_row
            JOIN jsonb_each(to_jsonb(NEW)) new_row ON old_row.key = new_row.key
            WHERE old_row.value IS DISTINCT FROM new_row.value
          ) changes
        )
        ELSE NULL
      END
    ),
    'data_categories', ARRAY[
      'personal_info',
      'employment_details', 
      'compensation',
      'benefits',
      'compliance',
      'performance',
      'documents'
    ]
  );
  
  -- Insert comprehensive sync event
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload,
    sync_status
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    TG_OP || '_employee_comprehensive',
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_affected_modules,
    v_comprehensive_payload,
    'pending'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers and create new comprehensive one
DROP TRIGGER IF EXISTS trigger_ai_sync ON public.employees;
DROP TRIGGER IF EXISTS transportation_allowance_trigger ON public.employees;
DROP TRIGGER IF EXISTS update_housing_transportation_allowance_trigger ON public.employees;
DROP TRIGGER IF EXISTS enhanced_employee_ai_sync_trigger ON public.employees;

CREATE TRIGGER enhanced_employee_ai_sync_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_employee_ai_sync();

-- Keep the housing/transportation allowance trigger for business logic
CREATE TRIGGER update_housing_transportation_allowance_trigger
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_housing_transportation_allowance();