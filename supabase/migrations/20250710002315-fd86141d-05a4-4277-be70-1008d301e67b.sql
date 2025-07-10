-- Step 3: Create comprehensive report generation function

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
  
  -- Generate comprehensive summary statistics using a single aggregation query
  SELECT jsonb_build_object(
    'total_employees', COUNT(*),
    'active_employees', COUNT(*) FILTER (WHERE status = 'active'),
    'saudi_nationals', COUNT(*) FILTER (WHERE is_saudi = true),
    'non_saudi_nationals', COUNT(*) FILTER (WHERE is_saudi = false),
    'by_gender', jsonb_build_object(
      'male', COUNT(*) FILTER (WHERE gender = 'male'),
      'female', COUNT(*) FILTER (WHERE gender = 'female'),
      'not_specified', COUNT(*) FILTER (WHERE gender IS NULL)
    ),
    'average_experience', ROUND(AVG(COALESCE(experience_years, 0)), 2),
    'salary_ranges', jsonb_build_object(
      'min_salary', MIN(basic_salary),
      'max_salary', MAX(basic_salary),
      'avg_salary', ROUND(AVG(basic_salary), 2)
    ),
    'benefits_summary', jsonb_build_object(
      'company_housing', COUNT(*) FILTER (WHERE company_housing = true),
      'company_transportation', COUNT(*) FILTER (WHERE company_provides_transportation = true),
      'company_sim_card', COUNT(*) FILTER (WHERE company_sim_card = true),
      'medical_insurance_parents', COUNT(*) FILTER (WHERE parents_medical_insurance = true)
    ),
    'department_breakdown', jsonb_object_agg(
      COALESCE(department, 'Unknown'), 
      COUNT(*) FILTER (WHERE department IS NOT DISTINCT FROM e.department)
    ),
    'job_level_breakdown', jsonb_object_agg(
      COALESCE(job_level, 'Unknown'), 
      COUNT(*) FILTER (WHERE job_level IS NOT DISTINCT FROM e.job_level)
    )
  ) INTO v_summary_stats
  FROM public.employees e 
  WHERE (_company_id IS NULL OR company_id = _company_id)
  AND (v_filter_conditions = '' OR true); -- Apply filters in subquery if needed
  
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