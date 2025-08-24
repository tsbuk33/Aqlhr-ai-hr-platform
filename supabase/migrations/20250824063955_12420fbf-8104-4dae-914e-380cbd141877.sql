-- Create OSI layers view based on hr_grades
CREATE OR REPLACE VIEW osi_layers_by_grade_v1 AS
WITH grade_layer_mapping AS (
  SELECT 
    'L5' as grade_code, 'exec' as layer_code, 1 as layer_order, 'Executive' as name_en, 'تنفيذي' as name_ar, 30 as target_rate
  UNION ALL SELECT 
    'L4', 'manager', 2, 'Manager', 'مدير', 40
  UNION ALL SELECT 
    'L3', 'supervisor', 3, 'Supervisor', 'مشرف', 50
  UNION ALL SELECT 
    'L2', 'professional', 4, 'Professional', 'محترف', 60
  UNION ALL SELECT 
    'L1', 'staff', 5, 'Staff', 'موظف', 70
),
layer_stats AS (
  SELECT 
    e.company_id,
    COALESCE(g.code, 'L1') as grade_code,
    COUNT(*) as headcount,
    COUNT(*) FILTER (WHERE e.is_saudi = true) as saudi_hc,
    COUNT(*) FILTER (WHERE e.is_saudi = false) as non_saudi_hc,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE e.is_saudi = true)::numeric / COUNT(*)) * 100, 1)
    END as saudization_rate
  FROM hr_employees e
  LEFT JOIN hr_grades g ON e.grade_id = g.id
  WHERE e.employment_status = 'active'
  GROUP BY e.company_id, COALESCE(g.code, 'L1')
)
SELECT 
  ls.company_id,
  glm.layer_code,
  glm.layer_order,
  glm.name_en,
  glm.name_ar,
  ls.headcount,
  ls.saudi_hc,
  ls.non_saudi_hc,
  ls.saudization_rate,
  glm.target_rate
FROM layer_stats ls
JOIN grade_layer_mapping glm ON ls.grade_code = glm.grade_code;

-- Create OSI overview RPC
CREATE OR REPLACE FUNCTION osi_overview_v1(p_tenant uuid)
RETURNS TABLE(
  total_layers integer,
  highest_saudized_layer integer,
  critical_layers_below_target integer,
  layers jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_layers jsonb;
  v_total_layers integer;
  v_highest_saudized integer;
  v_critical_count integer;
BEGIN
  -- Get layer data
  WITH layer_data AS (
    SELECT *
    FROM osi_layers_by_grade_v1
    WHERE company_id = p_tenant
    ORDER BY layer_order
  )
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'layer_code', ld.layer_code,
        'layer_order', ld.layer_order,
        'name_en', ld.name_en,
        'name_ar', ld.name_ar,
        'headcount', ld.headcount,
        'saudi_hc', ld.saudi_hc,
        'non_saudi_hc', ld.non_saudi_hc,
        'saudization_rate', ld.saudization_rate,
        'target_rate', ld.target_rate
      )
    ),
    COUNT(*),
    COALESCE(MAX(ld.layer_order) FILTER (WHERE ld.saudi_hc > 0), 0),
    COUNT(*) FILTER (WHERE ld.saudization_rate < ld.target_rate)
  INTO v_layers, v_total_layers, v_highest_saudized, v_critical_count
  FROM layer_data ld;

  -- Return results
  RETURN QUERY SELECT 
    COALESCE(v_total_layers, 0)::integer,
    COALESCE(v_highest_saudized, 0)::integer,
    COALESCE(v_critical_count, 0)::integer,
    COALESCE(v_layers, '[]'::jsonb);
END;
$function$;

-- Create dev seeding function for OSI
CREATE OR REPLACE FUNCTION dev_seed_osi_v1(p_tenant uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_grade_ids uuid[];
BEGIN
  -- Get available grade IDs for this tenant
  SELECT ARRAY(SELECT id FROM hr_grades WHERE company_id = p_tenant ORDER BY code)
  INTO v_grade_ids;

  -- If no grades exist, skip seeding
  IF array_length(v_grade_ids, 1) IS NULL THEN
    RAISE NOTICE 'No grades found for tenant %, skipping OSI seeding', p_tenant;
    RETURN;
  END IF;

  -- Ensure all employees have grade_ids assigned
  UPDATE hr_employees 
  SET grade_id = CASE 
    WHEN grade_id IS NULL THEN 
      v_grade_ids[(EXTRACT(DAY FROM hire_date)::int % array_length(v_grade_ids, 1)) + 1]
    ELSE grade_id
  END
  WHERE company_id = p_tenant 
    AND employment_status = 'active'
    AND grade_id IS NULL;
    
  -- Log the operation
  RAISE NOTICE 'OSI seeding completed for tenant %', p_tenant;
END;
$function$;