-- Create SKU catalog table
CREATE TABLE IF NOT EXISTS public.sku_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku_code TEXT NOT NULL UNIQUE,
  sku_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  price_annual NUMERIC NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales leads table for upsell requests
CREATE TABLE IF NOT EXISTS public.sales_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID,
  lead_type TEXT NOT NULL DEFAULT 'trial_request',
  requested_sku TEXT,
  requested_plan TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  contact_email TEXT,
  contact_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create plan bundles table
CREATE TABLE IF NOT EXISTS public.plan_bundles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_code TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  price_annual NUMERIC NOT NULL DEFAULT 0,
  included_skus TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  trial_days INTEGER NOT NULL DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenant trials table
CREATE TABLE IF NOT EXISTS public.tenant_trials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  plan_code TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  requested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, plan_code)
);

-- Enable RLS
ALTER TABLE public.sku_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_trials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view SKU catalog"
  ON public.sku_catalog FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create sales leads for their tenant"
  ON public.sales_leads FOR INSERT
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can view their tenant's sales leads"
  ON public.sales_leads FOR SELECT
  USING (tenant_id = get_user_company_id());

CREATE POLICY "Anyone can view active plan bundles"
  ON public.plan_bundles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their tenant's trials"
  ON public.tenant_trials FOR SELECT
  USING (tenant_id = get_user_company_id());

CREATE POLICY "Users can create trials for their tenant"
  ON public.tenant_trials FOR INSERT
  WITH CHECK (tenant_id = get_user_company_id());

-- Seed SKU catalog
INSERT INTO public.sku_catalog (sku_code, sku_name, description, category, price_monthly, price_annual, features) VALUES
('SKU_CCI', 'Culture & Climate Intelligence', 'AI-powered culture and climate diagnostics with psychological safety insights', 'diagnostics', 299, 2990, '["cci_surveys", "psych_safety", "anonymity_protection", "dept_insights"]'::jsonb),
('SKU_OSI', 'Organizational Structural Intelligence', 'Smart organizational design and span optimization', 'diagnostics', 199, 1990, '["span_analysis", "structural_optimization", "manager_insights", "cost_analysis"]'::jsonb),
('SKU_REW', 'Retention Early Warning', 'Predictive attrition risk analysis and intervention recommendations', 'diagnostics', 249, 2490, '["attrition_prediction", "risk_scoring", "intervention_playbooks", "manager_alerts"]'::jsonb),
('SKU_COMPLIANCE_AUTOPILOT', 'Compliance Autopilot', 'Automated compliance monitoring and document generation', 'compliance', 399, 3990, '["automated_monitoring", "document_generation", "gov_integration", "audit_trails"]'::jsonb),
('SKU_API_GATEWAY', 'API Gateway & Integrations', 'Enterprise API access and third-party integrations', 'platform', 149, 1490, '["api_access", "webhooks", "third_party_sync", "data_export"]'::jsonb),
('SKU_LEO', 'Learning Experience Optimization', 'AI-powered skill gap analysis and personalized learning paths', 'ai_insights', 199, 1990, '["skill_gap_analysis", "learning_paths", "training_optimization", "performance_correlation"]'::jsonb),
('SKU_GEO', 'Generative Engagement Optimization', 'Automated engagement pulses and targeted interventions', 'ai_insights', 179, 1790, '["engagement_pulses", "manager_nudges", "intervention_automation", "reaction_tracking"]'::jsonb),
('SKU_EXECUTIVE_INTELLIGENCE', 'Executive Intelligence Dashboard', 'C-level insights and predictive analytics', 'executive', 599, 5990, '["executive_dashboard", "predictive_analytics", "roi_tracking", "strategic_insights"]'::jsonb)
ON CONFLICT (sku_code) DO UPDATE SET
  sku_name = EXCLUDED.sku_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  features = EXCLUDED.features,
  updated_at = now();

-- Seed plan bundles
INSERT INTO public.plan_bundles (plan_code, plan_name, description, price_monthly, price_annual, included_skus, is_popular, trial_days) VALUES
('STARTER', 'Starter Plan', 'Essential HR tools with basic insights', 199, 1990, ARRAY['SKU_API_GATEWAY'], false, 7),
('COMPLIANCE_ESSENTIALS', 'Compliance Essentials', 'Complete compliance automation and monitoring', 599, 5990, ARRAY['SKU_COMPLIANCE_AUTOPILOT', 'SKU_API_GATEWAY'], false, 14),
('INTELLIGENT_HR', 'Intelligent HR', 'Advanced diagnostics with AI-powered insights', 899, 8990, ARRAY['SKU_CCI', 'SKU_OSI', 'SKU_REW', 'SKU_LEO', 'SKU_GEO', 'SKU_API_GATEWAY'], true, 14),
('EXECUTIVE_INTELLIGENCE', 'Executive Intelligence', 'Complete platform with executive-level insights', 1299, 12990, ARRAY['SKU_CCI', 'SKU_OSI', 'SKU_REW', 'SKU_COMPLIANCE_AUTOPILOT', 'SKU_API_GATEWAY', 'SKU_LEO', 'SKU_GEO', 'SKU_EXECUTIVE_INTELLIGENCE'], false, 21)
ON CONFLICT (plan_code) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  included_skus = EXCLUDED.included_skus,
  is_popular = EXCLUDED.is_popular,
  trial_days = EXCLUDED.trial_days,
  updated_at = now();

-- Create function to check if tenant has active trial
CREATE OR REPLACE FUNCTION public.has_active_trial(p_tenant_id UUID, p_plan_code TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.tenant_trials tt
    WHERE tt.tenant_id = p_tenant_id
      AND (p_plan_code IS NULL OR tt.plan_code = p_plan_code)
      AND tt.status = 'active'
      AND tt.expires_at > now()
  );
END;
$$;

-- Create function to check SKU access including trials
CREATE OR REPLACE FUNCTION public.has_sku_access(p_tenant_id UUID, p_sku_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'  
AS $$
DECLARE
  v_has_entitlement BOOLEAN := false;
  v_has_trial BOOLEAN := false;
BEGIN
  -- Check direct entitlement
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_entitlements te
    WHERE te.tenant_id = p_tenant_id
      AND te.sku_code = p_sku_code
      AND te.active = true
      AND (te.ends_at IS NULL OR te.ends_at > now())
  ) INTO v_has_entitlement;
  
  IF v_has_entitlement THEN
    RETURN true;
  END IF;
  
  -- Check trial access
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_trials tt
    JOIN public.plan_bundles pb ON pb.plan_code = tt.plan_code
    WHERE tt.tenant_id = p_tenant_id
      AND tt.status = 'active'
      AND tt.expires_at > now()
      AND p_sku_code = ANY(pb.included_skus)
  ) INTO v_has_trial;
  
  RETURN v_has_trial;
END;
$$;

-- Create function to start trial
CREATE OR REPLACE FUNCTION public.start_trial(p_tenant_id UUID, p_plan_code TEXT, p_requested_by UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_trial_id UUID;
  v_trial_days INTEGER;
BEGIN
  -- Get trial duration for plan
  SELECT trial_days INTO v_trial_days
  FROM public.plan_bundles
  WHERE plan_code = p_plan_code AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid plan code: %', p_plan_code;
  END IF;
  
  -- Insert trial
  INSERT INTO public.tenant_trials (
    tenant_id, plan_code, expires_at, requested_by
  ) VALUES (
    p_tenant_id, p_plan_code, 
    now() + (v_trial_days || ' days')::interval,
    p_requested_by
  ) 
  ON CONFLICT (tenant_id, plan_code) 
  DO UPDATE SET
    expires_at = now() + (v_trial_days || ' days')::interval,
    status = 'active',
    updated_at = now()
  RETURNING id INTO v_trial_id;
  
  RETURN v_trial_id;
END;
$$;