-- Retention Strategy tables and functions
CREATE TABLE IF NOT EXISTS public.retention_config (
  tenant_id uuid PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  min_group_n int DEFAULT 7,
  band_thresholds jsonb DEFAULT '{"low": 0, "med": 40, "high": 70}'::jsonb,
  target_turnover numeric DEFAULT 12
);

CREATE TABLE IF NOT EXISTS public.retention_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  period_month date NOT NULL,
  features jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, employee_id, period_month)
);

CREATE TABLE IF NOT EXISTS public.retention_risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  period_month date NOT NULL,
  risk_score numeric NOT NULL,
  band text CHECK (band IN ('low','med','high')) NOT NULL,
  top_factors jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, employee_id, period_month)
);

CREATE TABLE IF NOT EXISTS public.retention_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  period_month date NOT NULL,
  scope text CHECK (scope IN ('overall','dept','project','grade','employee')) NOT NULL,
  scope_id uuid,
  title text,
  description text,
  owner_id uuid,
  status text DEFAULT 'open',
  priority text CHECK (priority IN ('low','med','high')) DEFAULT 'med',
  evidence jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.retention_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage retention config from their tenant"
ON public.retention_config FOR ALL
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can view retention features from their tenant"
ON public.retention_features FOR SELECT
USING (tenant_id = get_user_company_id());

CREATE POLICY "Admins can manage retention features"
ON public.retention_features FOR INSERT
WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Admins can view retention risks from their tenant"
ON public.retention_risks FOR SELECT
USING (tenant_id = get_user_company_id());

CREATE POLICY "System can insert retention risks"
ON public.retention_risks FOR INSERT
WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage retention actions from their tenant"
ON public.retention_actions FOR ALL
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Aggregated view for hot-spots
CREATE OR REPLACE VIEW public.retention_overview_v1 AS
SELECT 
  rr.tenant_id,
  rr.period_month,
  e.dept_id as department_id,
  COALESCE(d.name_en, 'Unknown') as dept_name_en,
  COALESCE(d.name_ar, 'غير معروف') as dept_name_ar,
  COUNT(*) AS n,
  ROUND(AVG(rr.risk_score), 1) AS avg_risk,
  ROUND(AVG(CASE WHEN rr.band='high' THEN 1 ELSE 0 END)*100, 1) AS pct_high
FROM public.retention_risks rr
JOIN public.hr_employees e ON e.id = rr.employee_id AND e.company_id = rr.tenant_id
LEFT JOIN public.hr_departments d ON d.id = e.dept_id
WHERE e.employment_status = 'active'
GROUP BY rr.tenant_id, rr.period_month, e.dept_id, d.name_en, d.name_ar;

-- RPC: Get retention overview
CREATE OR REPLACE FUNCTION public.retention_get_overview_v1(p_tenant uuid)
RETURNS TABLE(
  avg_risk numeric,
  pct_high numeric,
  pct_med numeric,
  pct_low numeric,
  total_employees integer,
  target_turnover numeric
) 
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH current_risks AS (
    SELECT risk_score, band
    FROM public.retention_risks rr
    WHERE rr.tenant_id = p_tenant 
      AND rr.period_month = date_trunc('month', now())
  ),
  config AS (
    SELECT COALESCE(target_turnover, 12) as target
    FROM public.retention_config 
    WHERE tenant_id = p_tenant
  )
  SELECT 
    COALESCE(ROUND(AVG(risk_score), 1), 0) as avg_risk,
    COALESCE(ROUND(AVG(CASE WHEN band='high' THEN 1 ELSE 0 END)*100, 1), 0) as pct_high,
    COALESCE(ROUND(AVG(CASE WHEN band='med' THEN 1 ELSE 0 END)*100, 1), 0) as pct_med,
    COALESCE(ROUND(AVG(CASE WHEN band='low' THEN 1 ELSE 0 END)*100, 1), 0) as pct_low,
    COUNT(*)::int as total_employees,
    COALESCE((SELECT target FROM config), 12) as target_turnover
  FROM current_risks;
$$;

-- RPC: Get hot-spots (department breakdown)
CREATE OR REPLACE FUNCTION public.retention_get_hotspots_v1(p_tenant uuid)
RETURNS TABLE(
  department_id uuid,
  dept_name_en text,
  dept_name_ar text,
  n integer,
  avg_risk numeric,
  pct_high numeric
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH config AS (
    SELECT COALESCE(min_group_n, 7) as min_n
    FROM public.retention_config 
    WHERE tenant_id = p_tenant
  )
  SELECT 
    ov.department_id,
    ov.dept_name_en,
    ov.dept_name_ar,
    ov.n::int,
    ov.avg_risk,
    ov.pct_high
  FROM public.retention_overview_v1 ov, config
  WHERE ov.tenant_id = p_tenant 
    AND ov.period_month = date_trunc('month', now())
    AND ov.n >= config.min_n
  ORDER BY ov.avg_risk DESC;
$$;

-- RPC: Get top risk factors (drivers)
CREATE OR REPLACE FUNCTION public.retention_get_drivers_v1(p_tenant uuid)
RETURNS TABLE(
  factor_name text,
  avg_impact numeric,
  frequency integer
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH factors AS (
    SELECT jsonb_array_elements(top_factors) as factor
    FROM public.retention_risks
    WHERE tenant_id = p_tenant 
      AND period_month = date_trunc('month', now())
      AND top_factors IS NOT NULL
  )
  SELECT 
    factor->>'name' as factor_name,
    ROUND(AVG((factor->>'impact')::numeric), 2) as avg_impact,
    COUNT(*)::int as frequency
  FROM factors
  WHERE factor->>'name' IS NOT NULL
  GROUP BY factor->>'name'
  ORDER BY avg_impact DESC, frequency DESC;
$$;

-- RPC: Get watchlist (high-risk employees, admin-only)
CREATE OR REPLACE FUNCTION public.retention_get_watchlist_v1(p_tenant uuid)
RETURNS TABLE(
  employee_id uuid,
  employee_name_en text,
  employee_name_ar text,
  dept_name_en text,
  dept_name_ar text,
  manager_name text,
  risk_score numeric,
  band text,
  top_factors jsonb
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'hr_manager', 'super_admin')
  ) THEN
    -- Return empty result for non-admins
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    rr.employee_id,
    e.full_name_en,
    e.full_name_ar,
    COALESCE(d.name_en, 'Unknown') as dept_name_en,
    COALESCE(d.name_ar, 'غير معروف') as dept_name_ar,
    COALESCE(m.full_name_en, 'No Manager') as manager_name,
    rr.risk_score,
    rr.band,
    rr.top_factors
  FROM public.retention_risks rr
  JOIN public.hr_employees e ON e.id = rr.employee_id AND e.company_id = rr.tenant_id
  LEFT JOIN public.hr_departments d ON d.id = e.dept_id
  LEFT JOIN public.hr_employees m ON m.id = e.manager_id AND m.company_id = e.company_id
  WHERE rr.tenant_id = p_tenant 
    AND rr.period_month = date_trunc('month', now())
    AND rr.band = 'high'
    AND e.employment_status = 'active'
  ORDER BY rr.risk_score DESC;
END;
$$;

-- RPC: Compute retention features and risks (simplified heuristic)
CREATE OR REPLACE FUNCTION public.retention_compute_v1(p_tenant uuid, p_month date DEFAULT date_trunc('month', now()))
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  emp_record RECORD;
  features_json jsonb;
  risk_score numeric;
  risk_band text;
  factors jsonb;
BEGIN
  -- Delete existing data for this month
  DELETE FROM public.retention_features WHERE tenant_id = p_tenant AND period_month = p_month;
  DELETE FROM public.retention_risks WHERE tenant_id = p_tenant AND period_month = p_month;
  
  -- Process each active employee
  FOR emp_record IN 
    SELECT id, hire_date, basic_salary, is_saudi, manager_id,
           EXTRACT(YEAR FROM AGE(p_month, hire_date)) * 12 + 
           EXTRACT(MONTH FROM AGE(p_month, hire_date)) as tenure_months
    FROM public.hr_employees 
    WHERE company_id = p_tenant AND employment_status = 'active'
  LOOP
    -- Build features
    features_json := jsonb_build_object(
      'tenure_months', COALESCE(emp_record.tenure_months, 0),
      'salary', COALESCE(emp_record.basic_salary, 5000),
      'is_saudi', COALESCE(emp_record.is_saudi, false),
      'has_manager', emp_record.manager_id IS NOT NULL
    );
    
    -- Simple risk scoring heuristic
    risk_score := 0;
    factors := '[]'::jsonb;
    
    -- Low tenure risk (+30 points if < 6 months)
    IF COALESCE(emp_record.tenure_months, 0) < 6 THEN
      risk_score := risk_score + 30;
      factors := factors || '[{"name": "low_tenure", "impact": 0.30}]'::jsonb;
    END IF;
    
    -- Salary below median (+20 points if < 7000 SAR)
    IF COALESCE(emp_record.basic_salary, 5000) < 7000 THEN
      risk_score := risk_score + 20;
      factors := factors || '[{"name": "below_median_salary", "impact": 0.20}]'::jsonb;
    END IF;
    
    -- No manager (+15 points)
    IF emp_record.manager_id IS NULL THEN
      risk_score := risk_score + 15;
      factors := factors || '[{"name": "no_manager", "impact": 0.15}]'::jsonb;
    END IF;
    
    -- Random variation for demo (±10 points)
    risk_score := risk_score + (random() * 20 - 10);
    
    -- Cap at 0-100
    risk_score := GREATEST(0, LEAST(100, risk_score));
    
    -- Determine band
    IF risk_score >= 70 THEN
      risk_band := 'high';
    ELSIF risk_score >= 40 THEN
      risk_band := 'med';
    ELSE
      risk_band := 'low';
    END IF;
    
    -- Insert features
    INSERT INTO public.retention_features (tenant_id, employee_id, period_month, features)
    VALUES (p_tenant, emp_record.id, p_month, features_json);
    
    -- Insert risks
    INSERT INTO public.retention_risks (tenant_id, employee_id, period_month, risk_score, band, top_factors)
    VALUES (p_tenant, emp_record.id, p_month, risk_score, risk_band, factors);
  END LOOP;
  
  -- Insert/update config if not exists
  INSERT INTO public.retention_config (tenant_id) 
  VALUES (p_tenant) 
  ON CONFLICT (tenant_id) DO NOTHING;
END;
$$;

-- RPC: Seed demo data
CREATE OR REPLACE FUNCTION public.retention_seed_demo_v1(p_tenant uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  month_date date;
BEGIN
  -- Seed last 6 months
  FOR i IN 0..5 LOOP
    month_date := date_trunc('month', now()) - (i || ' months')::interval;
    PERFORM public.retention_compute_v1(p_tenant, month_date);
  END LOOP;
  
  RAISE NOTICE 'Seeded retention demo data for tenant % (6 months)', p_tenant;
END;
$$;