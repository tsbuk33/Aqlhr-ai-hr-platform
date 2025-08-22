-- LEO v1 Tables
CREATE TABLE public.leo_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  skill TEXT NOT NULL,
  grade TEXT NOT NULL,
  path JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.leo_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  skill TEXT NOT NULL,
  hours NUMERIC NOT NULL DEFAULT 0,
  last_event_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, employee_id, skill)
);

-- GEO v1 Tables
CREATE TABLE public.geo_pulses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  topic TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
  channel TEXT NOT NULL DEFAULT 'email',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  target_audience JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE public.geo_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pulse_id UUID NOT NULL REFERENCES public.geo_pulses(id) ON DELETE CASCADE,
  user_id UUID,
  n_ok INTEGER NOT NULL DEFAULT 0,
  n_issue INTEGER NOT NULL DEFAULT 0,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reaction_type TEXT NOT NULL DEFAULT 'neutral'
);

-- Enable RLS
ALTER TABLE public.leo_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leo_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage LEO paths from their tenant"
  ON public.leo_paths FOR ALL
  USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage LEO progress from their tenant"
  ON public.leo_progress FOR ALL
  USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage GEO pulses from their tenant"
  ON public.geo_pulses FOR ALL
  USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage GEO reactions from their tenant"
  ON public.geo_reactions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.geo_pulses gp 
    WHERE gp.id = geo_reactions.pulse_id 
    AND gp.tenant_id = get_user_company_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.geo_pulses gp 
    WHERE gp.id = geo_reactions.pulse_id 
    AND gp.tenant_id = get_user_company_id()
  ));

-- LEO Compute Functions
CREATE OR REPLACE FUNCTION public.leo_compute_case_v1(p_case_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_skill_gaps JSONB;
  v_performance_data JSONB;
  v_training_data JSONB;
  v_risk_score NUMERIC := 0;
BEGIN
  -- Get tenant from case
  SELECT c.tenant_id INTO v_tenant_id
  FROM public.dx_cases c
  WHERE c.id = p_case_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Case not found: %', p_case_id;
  END IF;
  
  -- Analyze skill gaps from training hours and performance
  SELECT jsonb_agg(
    jsonb_build_object(
      'skill', tp.course_name,
      'grade', he.grade_id,
      'hours_needed', GREATEST(40 - COALESCE(lp.hours, 0), 0),
      'last_training', tp.completion_date
    )
  ) INTO v_skill_gaps
  FROM public.hr_employees he
  LEFT JOIN public.training_participation tp ON tp.employee_id = he.id
  LEFT JOIN public.leo_progress lp ON lp.employee_id = he.id AND lp.skill = tp.course_name
  WHERE he.company_id = v_tenant_id
    AND he.employment_status = 'active'
    AND (lp.hours IS NULL OR lp.hours < 40);
  
  -- Calculate risk based on skill gaps
  v_risk_score := CASE 
    WHEN jsonb_array_length(COALESCE(v_skill_gaps, '[]'::jsonb)) > 10 THEN 85
    WHEN jsonb_array_length(COALESCE(v_skill_gaps, '[]'::jsonb)) > 5 THEN 65
    ELSE 30
  END;
  
  -- Insert/update dx_scores
  INSERT INTO public.dx_scores (
    case_id, module, score, details, computed_at
  ) VALUES (
    p_case_id, 'LEO_SKILLS', v_risk_score, 
    jsonb_build_object('skill_gaps', v_skill_gaps),
    now()
  ) ON CONFLICT (case_id, module) DO UPDATE SET
    score = EXCLUDED.score,
    details = EXCLUDED.details,
    computed_at = EXCLUDED.computed_at;
  
  -- Generate flags if high risk
  IF v_risk_score > 70 THEN
    INSERT INTO public.dx_flags (case_id, flag_type, severity, details, created_at)
    VALUES (
      p_case_id, 'CRITICAL_SKILL_GAP', 'high',
      jsonb_build_object(
        'message', 'Critical skill gaps detected across multiple grades',
        'skill_gaps_count', jsonb_array_length(COALESCE(v_skill_gaps, '[]'::jsonb))
      ),
      now()
    );
  END IF;
  
  -- Create micro-learning paths
  INSERT INTO public.leo_paths (tenant_id, skill, grade, path)
  SELECT 
    v_tenant_id,
    gap->>'skill',
    gap->>'grade',
    jsonb_build_array(
      jsonb_build_object('type', 'video', 'title', 'Fundamentals', 'duration', 15),
      jsonb_build_object('type', 'practice', 'title', 'Hands-on Exercise', 'duration', 30),
      jsonb_build_object('type', 'assessment', 'title', 'Knowledge Check', 'duration', 10)
    )
  FROM jsonb_array_elements(COALESCE(v_skill_gaps, '[]'::jsonb)) AS gap
  ON CONFLICT DO NOTHING;
  
END;
$$;

-- GEO Compute Functions
CREATE OR REPLACE FUNCTION public.geo_compute_case_v1(p_case_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
  v_flags_data JSONB;
  v_manager_spans JSONB;
  v_engagement_score NUMERIC := 0;
BEGIN
  -- Get tenant from case
  SELECT c.tenant_id INTO v_tenant_id
  FROM public.dx_cases c
  WHERE c.id = p_case_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Case not found: %', p_case_id;
  END IF;
  
  -- Collect flags from CCI/REW/OSI
  SELECT jsonb_agg(
    jsonb_build_object(
      'module', df.flag_type,
      'severity', df.severity,
      'created_at', df.created_at
    )
  ) INTO v_flags_data
  FROM public.dx_flags df
  JOIN public.dx_cases dc ON dc.id = df.case_id
  WHERE dc.tenant_id = v_tenant_id
    AND df.created_at > now() - INTERVAL '30 days'
    AND df.flag_type IN ('HIGH_ATTRITION_RISK_DEPT', 'MANAGER_NEEDS_SUPPORT', 'LOW_PSYCH_SAFETY');
  
  -- Get manager span data
  SELECT jsonb_agg(
    jsonb_build_object(
      'manager_id', vms.manager_id,
      'span', vms.span,
      'target_span', vms.target_span,
      'overload', vms.overload,
      'manager_name', vms.full_name_en
    )
  ) INTO v_manager_spans
  FROM public.v_manager_spans vms
  WHERE vms.overload = true;
  
  -- Calculate engagement score based on flags
  v_engagement_score := GREATEST(0, 100 - (jsonb_array_length(COALESCE(v_flags_data, '[]'::jsonb)) * 15));
  
  -- Insert/update dx_scores
  INSERT INTO public.dx_scores (
    case_id, module, score, details, computed_at
  ) VALUES (
    p_case_id, 'GEO_ENGAGEMENT', v_engagement_score,
    jsonb_build_object(
      'flags', v_flags_data,
      'manager_spans', v_manager_spans
    ),
    now()
  ) ON CONFLICT (case_id, module) DO UPDATE SET
    score = EXCLUDED.score,
    details = EXCLUDED.details,
    computed_at = EXCLUDED.computed_at;
  
  -- Generate targeted pulses for high-risk managers
  INSERT INTO public.geo_pulses (tenant_id, topic, content, target_audience, status)
  SELECT 
    v_tenant_id,
    'MANAGER_SUPPORT_NEEDED',
    jsonb_build_object(
      'title', 'Manager Support Required',
      'message', 'Your team span exceeds optimal limits. Consider delegation strategies.',
      'action_items', jsonb_build_array(
        'Review current team structure',
        'Identify delegation opportunities',
        'Schedule 1:1s with direct reports'
      )
    ),
    jsonb_build_object(
      'manager_ids', jsonb_agg((span_data->>'manager_id')::uuid)
    ),
    'ready'
  FROM jsonb_array_elements(COALESCE(v_manager_spans, '[]'::jsonb)) AS span_data
  WHERE jsonb_array_length(COALESCE(v_manager_spans, '[]'::jsonb)) > 0;
  
END;
$$;

-- Add new SKUs to features table
INSERT INTO public.features (feature_key, feature_name, description, plans, is_active) VALUES
('SKU_LEO', 'Learning Experience Optimization', 'AI-powered learning path optimization and skill gap analysis', ARRAY['growth', 'enterprise'], true),
('SKU_GEO', 'Generative Engagement Optimization', 'Automated engagement pulses and targeted interventions', ARRAY['growth', 'enterprise'], true)
ON CONFLICT (feature_key) DO NOTHING;