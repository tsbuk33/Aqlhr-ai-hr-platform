-- REW v1: Retention Early Warning System
-- Tables for REW-specific computations (RLS enabled)

CREATE TABLE IF NOT EXISTS public.rew_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  scope TEXT NOT NULL, -- 'company' | 'department' | 'division'
  scope_id UUID, -- department_id or NULL for company-wide
  risk_score NUMERIC(5,2) NOT NULL DEFAULT 0, -- 0-100 risk score
  top_drivers JSONB DEFAULT '[]'::jsonb, -- array of risk factors with weights
  n INT DEFAULT 0, -- sample size for statistical significance
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rew_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage REW snapshots from their cases"
ON public.rew_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.dx_cases c 
    WHERE c.id = rew_snapshots.case_id 
    AND c.tenant_id = get_user_company_id()
  )
);

-- REW Computation Function
CREATE OR REPLACE FUNCTION public.rew_compute_case_v1(p_case_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_baseline_date DATE;
  v_risk_score NUMERIC := 0;
  v_top_drivers JSONB := '[]'::jsonb;
  v_total_employees INT;
  v_flags TEXT[] := '{}';
  v_cci_safety_score NUMERIC := 0;
  v_overload_penalty NUMERIC := 0;
  v_attendance_risk NUMERIC := 0;
  v_grievance_risk NUMERIC := 0;
  v_iqama_risk NUMERIC := 0;
  v_pay_risk NUMERIC := 0;
BEGIN
  -- Get case details
  SELECT tenant_id, baseline_date INTO v_tenant_id, v_baseline_date
  FROM public.dx_cases
  WHERE id = p_case_id;
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found: %', p_case_id;
  END IF;
  
  -- Get total employee count
  SELECT COUNT(*) INTO v_total_employees
  FROM public.hr_employees
  WHERE company_id = v_tenant_id AND employment_status = 'active';
  
  -- 1. CCI Psychological Safety Score (if available)
  -- Look for recent CCI survey data with anonymity threshold
  SELECT COALESCE(AVG((response->'psychological_safety')::numeric), 50) INTO v_cci_safety_score
  FROM public.cci_responses cr
  JOIN public.cci_surveys cs ON cr.survey_id = cs.id
  WHERE cs.tenant_id = v_tenant_id
    AND cr.created_at >= CURRENT_DATE - INTERVAL '6 months'
    AND (SELECT COUNT(*) FROM public.cci_responses cr2 WHERE cr2.survey_id = cs.id) >= cs.anonymity_min_n;
  
  -- Convert safety score to risk (inverse relationship)
  v_cci_safety_score := GREATEST(0, 100 - v_cci_safety_score);
  
  -- 2. OSI Overload & Deep Layer Penalties
  SELECT 
    COALESCE(manager_overload_n, 0) * 5 + -- 5 points per overloaded manager
    CASE WHEN layers_depth > 6 THEN (layers_depth - 6) * 10 ELSE 0 END -- 10 points per excess layer
  INTO v_overload_penalty
  FROM public.osi_snapshots
  WHERE case_id = p_case_id AND scope = 'company'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- 3. Attendance Risk (mock calculation - would need actual attendance data)
  -- For now, assume 5% base risk
  v_attendance_risk := 5;
  
  -- 4. Grievances in last 90 days (mock - would need grievance table)
  -- Assume 2 grievances per 100 employees = moderate risk
  v_grievance_risk := (v_total_employees / 100.0) * 2;
  
  -- 5. Iqama expiration risk for non-Saudi employees
  SELECT COUNT(*) * 15 INTO v_iqama_risk -- 15 points per expiring iqama
  FROM public.hr_employees
  WHERE company_id = v_tenant_id
    AND employment_status = 'active'
    AND NOT is_saudi
    AND iqama_expiry IS NOT NULL
    AND iqama_expiry <= CURRENT_DATE + INTERVAL '60 days';
  
  -- 6. Pay percentile vs grade midpoint (simplified)
  -- Assume employees below market rate have higher attrition risk
  SELECT COUNT(*) * 3 INTO v_pay_risk -- 3 points per underpaid employee
  FROM public.hr_employees e
  WHERE e.company_id = v_tenant_id
    AND e.employment_status = 'active'
    AND COALESCE(e.base_salary + e.allowances, 0) > 0
    AND COALESCE(e.base_salary + e.allowances, 0) < 8000; -- Below assumed market rate
  
  -- Calculate overall risk score (weighted average)
  v_risk_score := LEAST(100, (
    v_cci_safety_score * 0.3 +
    v_overload_penalty * 0.2 +
    v_attendance_risk * 0.15 +
    v_grievance_risk * 0.15 +
    v_iqama_risk * 0.1 +
    v_pay_risk * 0.1
  ));
  
  -- Build top drivers
  v_top_drivers := jsonb_build_array(
    jsonb_build_object('driver', 'psychological_safety', 'score', v_cci_safety_score, 'weight', 0.3),
    jsonb_build_object('driver', 'management_overload', 'score', v_overload_penalty, 'weight', 0.2),
    jsonb_build_object('driver', 'attendance_patterns', 'score', v_attendance_risk, 'weight', 0.15),
    jsonb_build_object('driver', 'grievances', 'score', v_grievance_risk, 'weight', 0.15),
    jsonb_build_object('driver', 'contract_expiry', 'score', v_iqama_risk, 'weight', 0.1),
    jsonb_build_object('driver', 'compensation_gap', 'score', v_pay_risk, 'weight', 0.1)
  );
  
  -- Generate flags based on risk levels
  IF v_risk_score > 70 THEN
    v_flags := v_flags || 'HIGH_ATTRITION_RISK_DEPT';
  END IF;
  
  IF v_overload_penalty > 20 THEN
    v_flags := v_flags || 'MANAGER_NEEDS_SUPPORT';
  END IF;
  
  IF v_iqama_risk > 10 THEN
    v_flags := v_flags || 'CONTRACT_RENEWAL_RISK';
  END IF;
  
  -- Insert snapshot
  INSERT INTO public.rew_snapshots (
    case_id, scope, scope_id, risk_score, top_drivers, n
  ) VALUES (
    p_case_id, 'company', NULL, v_risk_score, v_top_drivers, v_total_employees
  );
  
  -- Write dx_scores
  INSERT INTO public.dx_scores (case_id, scope, scope_id, metric, n, last_computed_at)
  VALUES 
    (p_case_id, 'company', NULL, 
     jsonb_build_object(
       'retention_risk_score', v_risk_score,
       'safety_risk', v_cci_safety_score,
       'management_risk', v_overload_penalty,
       'contract_risk', v_iqama_risk
     ), 
     v_total_employees, now());
  
  -- Write dx_flags
  IF array_length(v_flags, 1) > 0 THEN
    INSERT INTO public.dx_flags (case_id, severity, code, scope, scope_id, details)
    SELECT 
      p_case_id,
      CASE 
        WHEN unnest = 'HIGH_ATTRITION_RISK_DEPT' THEN 'high'
        WHEN unnest = 'CONTRACT_RENEWAL_RISK' THEN 'high'
        ELSE 'medium'
      END,
      unnest,
      'company',
      NULL,
      jsonb_build_object(
        'description', CASE unnest
          WHEN 'HIGH_ATTRITION_RISK_DEPT' THEN 'Department shows high attrition risk indicators'
          WHEN 'MANAGER_NEEDS_SUPPORT' THEN 'Managers are overloaded and need immediate support'
          WHEN 'CONTRACT_RENEWAL_RISK' THEN 'Multiple employee contracts expiring soon'
        END,
        'risk_score', v_risk_score
      )
    FROM unnest(v_flags);
  END IF;
END;
$$;

-- REW Data Retrieval Functions
CREATE OR REPLACE FUNCTION public.rew_get_overview_v1(p_case_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
  v_tenant_id UUID;
BEGIN
  -- Validate access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  SELECT jsonb_build_object(
    'risk_score', risk_score,
    'top_drivers', top_drivers,
    'sample_size', n,
    'created_at', created_at
  ) INTO v_result
  FROM public.rew_snapshots
  WHERE case_id = p_case_id AND scope = 'company'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.rew_get_high_risk_managers_v1(p_case_id UUID)
RETURNS TABLE(
  manager_id UUID,
  manager_name TEXT,
  risk_factors TEXT[],
  team_size INT,
  risk_score NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Validate access
  SELECT tenant_id INTO v_tenant_id
  FROM public.dx_cases
  WHERE id = p_case_id AND tenant_id = get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied: %', p_case_id;
  END IF;
  
  -- Return high-risk managers based on span overload and team composition
  RETURN QUERY
  SELECT 
    ms.manager_id,
    ms.full_name_en as manager_name,
    ARRAY[
      CASE WHEN ms.overload THEN 'SPAN_OVERLOAD' END,
      CASE WHEN ms.span > 10 THEN 'EXCESSIVE_SPAN' END
    ] FILTER (WHERE ms.overload OR ms.span > 10) as risk_factors,
    ms.span::INT as team_size,
    CASE 
      WHEN ms.overload AND ms.span > 10 THEN 85.0
      WHEN ms.overload THEN 70.0
      WHEN ms.span > 8 THEN 60.0
      ELSE 40.0
    END as risk_score
  FROM public.v_manager_spans ms
  WHERE ms.span > 0
  ORDER BY risk_score DESC;
END;
$$;