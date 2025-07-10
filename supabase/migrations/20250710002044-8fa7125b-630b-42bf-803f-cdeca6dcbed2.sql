-- Comprehensive AI Sync Engine & Admin Reporting Enhancement

-- 1. Add missing indexes on ai_sync_events for performance
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_company_event_type ON public.ai_sync_events(company_id, event_type);
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_status_created ON public.ai_sync_events(sync_status, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_sync_events_source_table ON public.ai_sync_events(source_table, created_at);

-- 2. Add additional_attributes JSONB column to employees for flexible data storage
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS additional_attributes JSONB DEFAULT '{}'::jsonb;

-- 3. Create comprehensive employee_reports table if not exists
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

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS enhanced_employee_ai_sync_trigger ON public.employees;
CREATE TRIGGER enhanced_employee_ai_sync_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_employee_ai_sync();

-- 5. Enhanced employee master report generation function
CREATE OR REPLACE FUNCTION public.generate_comprehensive_employee_report(
  _company_id uuid DEFAULT NULL,
  _filters jsonb DEFAULT '{}'::jsonb,
  _report_name text DEFAULT 'Comprehensive Employee Report'
)
RETURNS uuid AS $$
DECLARE
  v_report_id uuid;
  v_employee_data jsonb;
  v_summary_stats jsonb;
  v_filter_conditions text := '';
  v_query text;
  v_employee_count integer;
BEGIN
  -- Build dynamic filter conditions
  IF _filters ? 'department' THEN
    v_filter_conditions := v_filter_conditions || ' AND department = ' || quote_literal(_filters->>'department');
  END IF;
  
  IF _filters ? 'status' THEN
    v_filter_conditions := v_filter_conditions || ' AND status = ' || quote_literal(_filters->>'status');
  END IF;
  
  IF _filters ? 'is_saudi' THEN
    v_filter_conditions := v_filter_conditions || ' AND is_saudi = ' || (_filters->>'is_saudi')::boolean;
  END IF;
  
  IF _filters ? 'gender' THEN
    v_filter_conditions := v_filter_conditions || ' AND gender = ' || quote_literal(_filters->>'gender');
  END IF;
  
  IF _filters ? 'nationality' THEN
    v_filter_conditions := v_filter_conditions || ' AND nationality = ' || quote_literal(_filters->>'nationality');
  END IF;
  
  IF _filters ? 'job_level' THEN
    v_filter_conditions := v_filter_conditions || ' AND job_level = ' || quote_literal(_filters->>'job_level');
  END IF;
  
  -- Build and execute dynamic query for employee data
  v_query := 'SELECT jsonb_agg(to_jsonb(e.*)) FROM public.employees e WHERE 1=1';
  
  IF _company_id IS NOT NULL THEN
    v_query := v_query || ' AND company_id = ' || quote_literal(_company_id);
  END IF;
  
  v_query := v_query || v_filter_conditions;
  
  EXECUTE v_query INTO v_employee_data;
  
  -- Generate comprehensive summary statistics
  v_query := 'SELECT jsonb_build_object(
    ''total_employees'', COUNT(*),
    ''active_employees'', COUNT(*) FILTER (WHERE status = ''active''),
    ''saudi_nationals'', COUNT(*) FILTER (WHERE is_saudi = true),
    ''non_saudi_nationals'', COUNT(*) FILTER (WHERE is_saudi = false),
    ''by_department'', jsonb_object_agg(COALESCE(department, ''Unknown''), dept_count),
    ''by_gender'', jsonb_build_object(
      ''male'', COUNT(*) FILTER (WHERE gender = ''male''),
      ''female'', COUNT(*) FILTER (WHERE gender = ''female''),
      ''not_specified'', COUNT(*) FILTER (WHERE gender IS NULL)
    ),
    ''by_job_level'', jsonb_object_agg(COALESCE(job_level, ''Unknown''), level_count),
    ''average_experience'', ROUND(AVG(COALESCE(experience_years, 0)), 2),
    ''salary_ranges'', jsonb_build_object(
      ''min_salary'', MIN(basic_salary),
      ''max_salary'', MAX(basic_salary),
      ''avg_salary'', ROUND(AVG(basic_salary), 2)
    ),
    ''benefits_summary'', jsonb_build_object(
      ''company_housing'', COUNT(*) FILTER (WHERE company_housing = true),
      ''company_transportation'', COUNT(*) FILTER (WHERE company_provides_transportation = true),
      ''company_sim_card'', COUNT(*) FILTER (WHERE company_sim_card = true),
      ''medical_insurance_parents'', COUNT(*) FILTER (WHERE parents_medical_insurance = true)
    )
  )
  FROM (
    SELECT e.*, 
           COUNT(*) OVER (PARTITION BY department) as dept_count,
           COUNT(*) OVER (PARTITION BY job_level) as level_count
    FROM public.employees e 
    WHERE 1=1';
  
  IF _company_id IS NOT NULL THEN
    v_query := v_query || ' AND company_id = ' || quote_literal(_company_id);
  END IF;
  
  v_query := v_query || v_filter_conditions || ') subq';
  
  EXECUTE v_query INTO v_summary_stats;
  
  -- Insert comprehensive report
  INSERT INTO public.employee_reports (
    company_id,
    report_name,
    report_description,
    filters,
    report_data,
    generated_by
  ) VALUES (
    _company_id,
    _report_name,
    'Comprehensive employee report with full field coverage and analytics',
    _filters,
    jsonb_build_object(
      'summary_statistics', v_summary_stats,
      'employee_details', COALESCE(v_employee_data, '[]'::jsonb),
      'report_metadata', jsonb_build_object(
        'generated_at', now(),
        'filter_criteria', _filters,
        'total_records', jsonb_array_length(COALESCE(v_employee_data, '[]'::jsonb))
      )
    ),
    auth.uid()
  ) RETURNING id INTO v_report_id;
  
  RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create user roles enum and table if not exists for admin access control
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'hr_manager', 'employee', 'viewer');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  company_id uuid REFERENCES public.companies(id),
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role, company_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policy for user roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Update or create the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;