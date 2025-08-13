-- Continue fixing remaining functions with search_path issues

CREATE OR REPLACE FUNCTION public.register_discovered_module(p_module_name text, p_module_path text, p_module_category text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Insert or update module
  INSERT INTO public.system_modules_registry (
    module_name,
    module_path,
    module_category,
    metadata,
    auto_discovered
  ) VALUES (
    p_module_name,
    p_module_path,
    p_module_category,
    p_metadata,
    true
  )
  ON CONFLICT (module_name, module_path) 
  DO UPDATE SET
    module_category = EXCLUDED.module_category,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING id INTO v_module_id;
  
  RETURN v_module_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_rls_policies()
RETURNS TABLE(table_name text, policy_count bigint, rls_enabled boolean)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    t.schemaname || '.' || t.tablename           AS table_name,
    COUNT(p.policyname)                          AS policy_count,
    bool_and(t.rowsecurity)                      AS rls_enabled
  FROM pg_tables AS t
  LEFT JOIN pg_policies AS p
    ON p.schemaname = t.schemaname
   AND p.tablename  = t.tablename
  WHERE t.schemaname = 'public'
  GROUP BY t.schemaname, t.tablename, t.rowsecurity
  ORDER BY table_name;
$$;

CREATE OR REPLACE FUNCTION public.register_translation_key(p_key text, p_source_file text, p_source_line integer DEFAULT NULL::integer, p_context text DEFAULT NULL::text, p_english_text text DEFAULT NULL::text, p_arabic_text text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_registry_id UUID;
BEGIN
  -- Insert or update translation key
  INSERT INTO public.translation_registry (
    translation_key,
    source_file,
    source_line,
    context_info,
    english_text,
    arabic_text,
    needs_review
  ) VALUES (
    p_key,
    p_source_file,
    p_source_line,
    p_context,
    p_english_text,
    p_arabic_text,
    CASE WHEN p_arabic_text IS NULL THEN true ELSE false END
  )
  ON CONFLICT (translation_key) 
  DO UPDATE SET
    source_file = EXCLUDED.source_file,
    source_line = EXCLUDED.source_line,
    context_info = EXCLUDED.context_info,
    english_text = COALESCE(EXCLUDED.english_text, translation_registry.english_text),
    arabic_text = COALESCE(EXCLUDED.arabic_text, translation_registry.arabic_text),
    updated_at = now()
  RETURNING id INTO v_registry_id;
  
  RETURN v_registry_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_translation_patch(p_key text, p_language text, p_text text, p_confidence numeric DEFAULT 0.8)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_patch_id UUID;
BEGIN
  -- Insert the patch
  INSERT INTO public.translation_patches (
    translation_key,
    patched_text,
    language,
    confidence_score
  ) VALUES (
    p_key,
    p_text,
    p_language,
    p_confidence
  )
  RETURNING id INTO v_patch_id;
  
  -- Update the registry with the patch
  UPDATE public.translation_registry
  SET 
    arabic_text = CASE WHEN p_language = 'ar' THEN p_text ELSE arabic_text END,
    english_text = CASE WHEN p_language = 'en' THEN p_text ELSE english_text END,
    is_ai_generated = true,
    needs_review = true,
    last_updated_ar = CASE WHEN p_language = 'ar' THEN now() ELSE last_updated_ar END,
    last_updated_en = CASE WHEN p_language = 'en' THEN now() ELSE last_updated_en END
  WHERE translation_key = p_key;
  
  RETURN v_patch_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_comprehensive_employee_report(_company_id uuid DEFAULT NULL::uuid, _filters jsonb DEFAULT '{}'::jsonb, _report_name text DEFAULT 'Comprehensive Employee Report'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;