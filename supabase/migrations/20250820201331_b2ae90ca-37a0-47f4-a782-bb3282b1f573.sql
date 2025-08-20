-- Corporate Culture Intelligence (CCI) Database Schema - Final Fix
-- Full PDPL-compliant schema with RLS and anonymity enforcement

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Main CCI Tables

-- CCI Surveys table
CREATE TABLE public.cci_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  name text NOT NULL,
  language text CHECK (language IN ('en', 'ar')) DEFAULT 'en',
  status text CHECK (status IN ('draft', 'active', 'closed')) DEFAULT 'draft',
  anonymity_min_n int NOT NULL DEFAULT 7,
  description text,
  wave_count int DEFAULT 0
);

-- CCI Survey Items table
CREATE TABLE public.cci_survey_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid NOT NULL REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  framework text CHECK (framework IN ('cvf', 'web', 'barrett', 'psych_safety', 'custom')),
  dimension text,
  text_en text NOT NULL,
  text_ar text NOT NULL,
  scale_min int DEFAULT 1,
  scale_max int DEFAULT 5,
  reverse_scored boolean DEFAULT false,
  order_no int
);

-- CCI Responses table (NO PII)
CREATE TABLE public.cci_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid NOT NULL REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  respondent_hash text NOT NULL,
  department_id uuid,
  project_id uuid,
  grade_id uuid,
  nationality text,
  gender text CHECK (gender IN ('M', 'F', 'Other')),
  submitted_at timestamptz DEFAULT now(),
  answers jsonb NOT NULL,
  duration_seconds int,
  is_flagged boolean DEFAULT false,
  flag_reason text
);

-- CCI Waves table
CREATE TABLE public.cci_waves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid NOT NULL REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  wave_no int NOT NULL,
  period_start date,
  period_end date,
  is_baseline boolean DEFAULT false
);

-- CCI Scores table
CREATE TABLE public.cci_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid NOT NULL REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  wave_id uuid REFERENCES public.cci_waves(id) ON DELETE CASCADE,
  scope text CHECK (scope IN ('overall', 'dept', 'project', 'grade')),
  scope_id uuid,
  cvf jsonb,
  web jsonb,
  barrett jsonb,
  psych_safety numeric,
  risk_index numeric,
  balance_score numeric,
  values_tags text[],
  n int NOT NULL,
  last_computed_at timestamptz DEFAULT now()
);

-- CCI Evidence table
CREATE TABLE public.cci_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  type text CHECK (type IN ('doc', 'image', 'link', 'note')),
  title text,
  description text,
  storage_path text,
  tags text[],
  ai_tags text[],
  uploaded_by uuid,
  uploaded_at timestamptz DEFAULT now()
);

-- CCI Evidence Vectors table (for AI similarity search)
CREATE TABLE public.cci_evidence_vectors (
  evidence_id uuid PRIMARY KEY REFERENCES public.cci_evidence(id) ON DELETE CASCADE,
  embedding vector(1536)
);

-- CCI Playbooks table
CREATE TABLE public.cci_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  survey_id uuid REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  ai_summary text,
  top_risks jsonb,
  initiatives jsonb,
  owner_id uuid,
  status text DEFAULT 'draft'
);

-- CCI Benchmarks table (industry reference data)
CREATE TABLE public.cci_benchmarks (
  industry text,
  country text,
  metric text,
  p50 numeric,
  p75 numeric,
  p90 numeric,
  PRIMARY KEY (industry, country, metric)
);

-- Agent Actions table (if doesn't exist)
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  action_type text,
  payload jsonb,
  status text DEFAULT 'started',
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  error text
);

-- 2. Indexes for Performance

-- Composite indexes on major tables
CREATE INDEX idx_cci_surveys_tenant ON public.cci_surveys(tenant_id);
CREATE INDEX idx_cci_survey_items_tenant_survey ON public.cci_survey_items(tenant_id, survey_id);
CREATE INDEX idx_cci_responses_tenant_survey_submitted ON public.cci_responses(tenant_id, survey_id, submitted_at);
CREATE INDEX idx_cci_waves_tenant_survey ON public.cci_waves(tenant_id, survey_id);
CREATE INDEX idx_cci_scores_tenant_survey_wave_scope ON public.cci_scores(tenant_id, survey_id, wave_id, scope, scope_id);
CREATE INDEX idx_cci_evidence_tenant_survey ON public.cci_evidence(tenant_id, survey_id);
CREATE INDEX idx_cci_playbooks_tenant_survey ON public.cci_playbooks(tenant_id, survey_id);
CREATE INDEX idx_agent_actions_tenant ON public.agent_actions(tenant_id);

-- Vector index for similarity search
CREATE INDEX idx_evidence_vectors_embedding ON public.cci_evidence_vectors 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. Helper Functions

-- Response validation function
CREATE OR REPLACE FUNCTION public.cci_is_response_valid(answers jsonb, duration_seconds int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for too-short completion time
  IF duration_seconds < 120 THEN
    RETURN false;
  END IF;
  
  -- Check for straight-lining (all same values)
  -- This is a simplified check - in practice you'd want more sophisticated detection
  DECLARE
    answer_values int[];
    unique_count int;
  BEGIN
    SELECT array_agg(DISTINCT (value::text)::int) INTO answer_values
    FROM jsonb_each_text(answers) 
    WHERE value ~ '^[0-9]+$';
    
    SELECT array_length(answer_values, 1) INTO unique_count;
    
    -- If only 1-2 unique values across many questions, likely straight-lining
    IF unique_count <= 2 AND jsonb_object_keys(answers) IS NOT NULL THEN
      RETURN false;
    END IF;
  END;
  
  RETURN true;
END;
$$;

-- Trigger function for quality control
CREATE OR REPLACE FUNCTION public.cci_response_quality_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check response quality and flag if invalid
  IF NOT public.cci_is_response_valid(NEW.answers, NEW.duration_seconds) THEN
    NEW.is_flagged = true;
    NEW.flag_reason = 'Quality check failed - too fast or straight-lining detected';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Enable RLS on all tables
ALTER TABLE public.cci_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_survey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_evidence_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cci_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Deny-by-default)

-- CCI Surveys policies
CREATE POLICY "cci_surveys_tenant_access" ON public.cci_surveys
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Survey Items policies  
CREATE POLICY "cci_survey_items_tenant_access" ON public.cci_survey_items
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Responses policies (restricted access - admin/hr_manager only)
CREATE POLICY "cci_responses_admin_only" ON public.cci_responses
  FOR SELECT USING (
    tenant_id = public.get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'hr_manager', 'super_admin')
    )
  );

CREATE POLICY "cci_responses_insert" ON public.cci_responses
  FOR INSERT WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Waves policies
CREATE POLICY "cci_waves_tenant_access" ON public.cci_waves
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Scores policies (read access for all tenant members)
CREATE POLICY "cci_scores_tenant_read" ON public.cci_scores
  FOR SELECT USING (tenant_id = public.get_user_company_id());

CREATE POLICY "cci_scores_admin_write" ON public.cci_scores
  FOR INSERT WITH CHECK (
    tenant_id = public.get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'hr_manager', 'super_admin')
    )
  );

-- CCI Evidence policies
CREATE POLICY "cci_evidence_tenant_access" ON public.cci_evidence
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Evidence Vectors policies
CREATE POLICY "cci_evidence_vectors_tenant_access" ON public.cci_evidence_vectors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.cci_evidence e 
      WHERE e.id = evidence_id 
      AND e.tenant_id = public.get_user_company_id()
    )
  );

-- CCI Playbooks policies
CREATE POLICY "cci_playbooks_tenant_access" ON public.cci_playbooks
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- CCI Benchmarks policies (public read)
CREATE POLICY "cci_benchmarks_public_read" ON public.cci_benchmarks
  FOR SELECT USING (true);

-- Agent Actions policies
CREATE POLICY "agent_actions_tenant_access" ON public.agent_actions
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

-- 6. Anonymity-Safe Public View (FIXED - qualified column names)
CREATE VIEW public.cci_scores_public_v1 AS
SELECT 
  cci_scores.id,
  cci_scores.tenant_id, 
  cci_scores.survey_id,
  cci_scores.wave_id,
  cci_scores.scope,
  cci_scores.scope_id,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.cvf ELSE NULL 
  END as cvf,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.web ELSE NULL 
  END as web,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.barrett ELSE NULL 
  END as barrett,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.psych_safety ELSE NULL 
  END as psych_safety,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.risk_index ELSE NULL 
  END as risk_index,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.balance_score ELSE NULL 
  END as balance_score,
  CASE 
    WHEN s.anonymity_min_n IS NULL OR cci_scores.n >= s.anonymity_min_n 
    THEN cci_scores.values_tags ELSE NULL 
  END as values_tags,
  cci_scores.n,
  cci_scores.last_computed_at,
  cci_scores.created_at
FROM public.cci_scores
LEFT JOIN public.cci_surveys s ON s.id = cci_scores.survey_id;

-- 7. Quality Control Materialized View
CREATE MATERIALIZED VIEW public.cci_response_quality_v1 AS
SELECT 
  survey_id,
  wave_id,
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE is_flagged = true) as flagged_responses,
  ROUND(
    COUNT(*) FILTER (WHERE is_flagged = true)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as flagged_percentage,
  COUNT(*) FILTER (WHERE duration_seconds < 120) as too_fast_responses,
  AVG(duration_seconds) as avg_duration_seconds
FROM public.cci_responses 
LEFT JOIN public.cci_waves w ON w.survey_id = cci_responses.survey_id
GROUP BY survey_id, wave_id;

-- Create index on materialized view
CREATE INDEX idx_response_quality_survey_wave ON public.cci_response_quality_v1(survey_id, wave_id);

-- 8. Seed Benchmarks (KSA Contracting)
INSERT INTO public.cci_benchmarks (industry, country, metric, p50, p75, p90) VALUES
  ('Contracting', 'SA', 'psych_safety', 72, 78, 85),
  ('Contracting', 'SA', 'balance_score', 75, 82, 88),
  ('Contracting', 'SA', 'risk_index', 30, 25, 20),
  ('Contracting', 'SA', 'cvf_clan', 25, 30, 35),
  ('Contracting', 'SA', 'cvf_adhocracy', 20, 25, 30),
  ('Contracting', 'SA', 'cvf_market', 35, 40, 45),
  ('Contracting', 'SA', 'cvf_hierarchy', 40, 45, 50);

-- 9. Triggers for Quality Control
CREATE TRIGGER cci_response_quality_check
  BEFORE INSERT ON public.cci_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.cci_response_quality_trigger();

-- Function to refresh quality materialized view
CREATE OR REPLACE FUNCTION public.refresh_cci_quality_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.cci_response_quality_v1;
END;
$$;