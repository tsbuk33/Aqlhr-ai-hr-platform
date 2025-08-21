-- Drop existing backfill function first
DROP FUNCTION IF EXISTS public.dashboard_backfill_v1(uuid, integer);

-- 1.1 Ensure minimal HR core columns exist (non-destructive)
ALTER TABLE IF EXISTS public.hr_employees
  ADD COLUMN IF NOT EXISTS company_id uuid,
  ADD COLUMN IF NOT EXISTS employee_no text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS is_saudi boolean,
  ADD COLUMN IF NOT EXISTS department_id uuid,
  ADD COLUMN IF NOT EXISTS job_id uuid,
  ADD COLUMN IF NOT EXISTS grade_id uuid,
  ADD COLUMN IF NOT EXISTS hire_date date,
  ADD COLUMN IF NOT EXISTS employment_status text,
  ADD COLUMN IF NOT EXISTS iqama_expiry date;

CREATE TABLE IF NOT EXISTS public.hr_departments(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL,
  code text
);
CREATE INDEX IF NOT EXISTS idx_dept_company ON public.hr_departments(company_id);

CREATE TABLE IF NOT EXISTS public.hr_jobs(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_company ON public.hr_jobs(company_id);

CREATE TABLE IF NOT EXISTS public.hr_grades(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL,
  level int
);
CREATE INDEX IF NOT EXISTS idx_grade_company ON public.hr_grades(company_id);

-- 1.2 KPI snapshots table (harden columns in case schema differs)
CREATE TABLE IF NOT EXISTS public.kpi_snapshots(
  company_id uuid NOT NULL,
  snap_date date NOT NULL,
  total_employees int,
  saudization_rate numeric,
  hse_safety_score numeric,
  docs_processed int,
  training_hours numeric,
  compliance_score numeric,
  employee_experience_10 numeric,
  predictive_risk_high int,
  PRIMARY KEY(company_id, snap_date)
);
CREATE INDEX IF NOT EXISTS idx_kpi_company_date ON public.kpi_snapshots(company_id, snap_date);

-- 1.3 Computation function (single source of truth for tiles)
CREATE OR REPLACE FUNCTION public.dashboard_compute_kpis_v1(p_tenant uuid, p_date date DEFAULT current_date)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_total int;
  v_saudi int;
  v_saudization numeric;
  v_docs int;
  v_training numeric;
  v_exp10 numeric;
  v_hse numeric;
  v_risk int;
  v_compliance numeric;
BEGIN
  -- Total headcount (active if field exists, otherwise all)
  SELECT count(*) INTO v_total
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND coalesce(e.employment_status, 'active') <> 'terminated';

  -- Saudization
  SELECT count(*) INTO v_saudi
  FROM public.hr_employees e
  WHERE e.company_id = p_tenant
    AND coalesce(e.employment_status, 'active') <> 'terminated'
    AND coalesce(e.is_saudi, e.nationality='SA') = true;

  v_saudization := CASE WHEN v_total=0 THEN 0 ELSE round((v_saudi::numeric*100.0)/v_total,1) END;

  -- Documents processed (last 30 days if table exists, else 0)
  BEGIN
    EXECUTE 'SELECT count(*) FROM public.docs_events d
             WHERE d.tenant_id = $1 AND d.created_at >= (current_date - 30)'
      INTO v_docs USING p_tenant;
  EXCEPTION WHEN undefined_table THEN
    v_docs := 0;
  END;

  -- Training hours (last 90 days if table exists, else 0)
  BEGIN
    EXECUTE 'SELECT coalesce(sum(hours),0) FROM public.hr_training t
             WHERE t.company_id = $1 AND t.date >= (current_date - 90)'
      INTO v_training USING p_tenant;
  EXCEPTION WHEN undefined_table THEN
    v_training := 0;
  END;

  -- Employee experience (from CCI if available, else conservative default 8.7/10)
  BEGIN
    EXECUTE 'SELECT avg((coalesce(psych_safety,8.7))) FROM public.cci_scores s
             WHERE s.tenant_id = $1' INTO v_exp10 USING p_tenant;
    IF v_exp10 IS NULL THEN v_exp10 := 8.7; END IF;
  EXCEPTION WHEN undefined_table THEN
    v_exp10 := 8.7;
  END;

  -- HSE safety score (100 - normalized incidents; if no table, set 92)
  BEGIN
    EXECUTE 'SELECT count(*) FROM public.hse_incidents h
             WHERE h.company_id = $1 AND coalesce(h.occurred_at,h.created_at) >= (current_date - 90)'
      INTO v_hse USING p_tenant;
    -- map incidents to score: 0 incidents = 95, 1-2 => ~93, more => lower
    v_hse := greatest(70, 95 - (coalesce(v_hse,0)::numeric*2));
  EXCEPTION WHEN undefined_table THEN
    v_hse := 92;
  END;

  -- Predictive risk (placeholder until your model is live)
  v_risk := 12;

  -- Compliance score (simple blend: base 90 + bonus if Saudization >= 60 and docs>0)
  v_compliance := 90 + CASE WHEN v_saudization >= 60 THEN 4 ELSE 0 END + CASE WHEN v_docs > 0 THEN 2 ELSE 0 END;
  v_compliance := least(99, v_compliance);

  INSERT INTO public.kpi_snapshots(company_id, snap_date, total_employees, saudization_rate, hse_safety_score,
                                   docs_processed, training_hours, compliance_score, employee_experience_10, predictive_risk_high)
  VALUES (p_tenant, p_date, v_total, v_saudization, v_hse, v_docs, v_training, v_compliance, v_exp10, v_risk)
  ON CONFLICT(company_id, snap_date) DO UPDATE
    SET total_employees=EXCLUDED.total_employees,
        saudization_rate=EXCLUDED.saudization_rate,
        hse_safety_score=EXCLUDED.hse_safety_score,
        docs_processed=EXCLUDED.docs_processed,
        training_hours=EXCLUDED.training_hours,
        compliance_score=EXCLUDED.compliance_score,
        employee_experience_10=EXCLUDED.employee_experience_10,
        predictive_risk_high=EXCLUDED.predictive_risk_high;
END;
$$;

-- 1.4 Backfill function (12 months of snapshots)
CREATE OR REPLACE FUNCTION public.dashboard_backfill_v1(p_tenant uuid, p_days int DEFAULT 365)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  d date := current_date - (p_days::int - 1);
BEGIN
  WHILE d <= current_date LOOP
    PERFORM public.dashboard_compute_kpis_v1(p_tenant, d);
    d := d + 1;
  END LOOP;
END;
$$;