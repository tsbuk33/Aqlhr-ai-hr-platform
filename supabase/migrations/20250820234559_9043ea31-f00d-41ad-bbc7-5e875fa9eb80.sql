-- Create features table for plan-based feature gating
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  description TEXT,
  plans TEXT[] NOT NULL DEFAULT ARRAY['growth', 'enterprise'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create plan_features junction table for flexibility
CREATE TABLE public.plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  feature_key TEXT NOT NULL REFERENCES public.features(feature_key),
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plan_name, feature_key)
);

-- Enable RLS
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- RLS policies for features (read-only for all authenticated users)
CREATE POLICY "Anyone can view features"
ON public.features
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS policies for plan_features (read-only for all authenticated users)
CREATE POLICY "Anyone can view plan features"
ON public.plan_features
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Insert CCI features
INSERT INTO public.features (feature_key, feature_name, description, plans) VALUES
  ('cci', 'Corporate Culture Intelligence', 'Full CCI analysis and reporting suite', ARRAY['growth', 'enterprise']),
  ('cci_playbook', 'CCI Playbook', 'Advanced culture transformation playbooks', ARRAY['growth', 'enterprise']),
  ('cci_export', 'CCI Export', 'Export CCI reports and data', ARRAY['growth', 'enterprise']),
  ('cci_analysis', 'CCI Analysis', 'Culture analysis and insights', ARRAY['growth', 'enterprise']),
  ('advanced_analytics', 'Advanced Analytics', 'Premium analytics features', ARRAY['enterprise']),
  ('white_label', 'White Label', 'Remove branding and customize interface', ARRAY['enterprise']);

-- Insert plan-feature mappings
INSERT INTO public.plan_features (plan_name, feature_key, is_enabled) VALUES
  ('free', 'cci', false),
  ('free', 'cci_playbook', false),
  ('free', 'cci_export', false),
  ('free', 'cci_analysis', false),
  ('basic', 'cci', false),
  ('basic', 'cci_playbook', false),
  ('basic', 'cci_export', false),
  ('basic', 'cci_analysis', false),
  ('growth', 'cci', true),
  ('growth', 'cci_playbook', true),
  ('growth', 'cci_export', true),
  ('growth', 'cci_analysis', true),
  ('growth', 'advanced_analytics', false),
  ('growth', 'white_label', false),
  ('enterprise', 'cci', true),
  ('enterprise', 'cci_playbook', true),
  ('enterprise', 'cci_export', true),
  ('enterprise', 'cci_analysis', true),
  ('enterprise', 'advanced_analytics', true),
  ('enterprise', 'white_label', true);

-- Function to check if tenant has feature access
CREATE OR REPLACE FUNCTION public.has_feature(p_tenant_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription_tier TEXT;
  v_has_access BOOLEAN := false;
BEGIN
  -- Get tenant's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM public.subscribers s
  JOIN public.companies c ON c.id = p_tenant_id
  WHERE s.user_id = (
    SELECT user_id FROM public.user_roles 
    WHERE company_id = p_tenant_id 
    AND role IN ('admin', 'super_admin') 
    LIMIT 1
  )
  AND s.subscribed = true;
  
  -- If no subscription found, default to 'free'
  IF v_subscription_tier IS NULL THEN
    v_subscription_tier := 'free';
  END IF;
  
  -- Check if plan has access to feature
  SELECT pf.is_enabled INTO v_has_access
  FROM public.plan_features pf
  WHERE pf.plan_name = LOWER(v_subscription_tier)
  AND pf.feature_key = p_feature_key;
  
  -- If no explicit mapping found, check if feature allows this plan
  IF v_has_access IS NULL THEN
    SELECT CASE 
      WHEN LOWER(v_subscription_tier) = ANY(f.plans) THEN true 
      ELSE false 
    END INTO v_has_access
    FROM public.features f
    WHERE f.feature_key = p_feature_key;
  END IF;
  
  RETURN COALESCE(v_has_access, false);
END;
$$;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription_tier TEXT;
BEGIN
  SELECT COALESCE(subscription_tier, 'free') INTO v_subscription_tier
  FROM public.subscribers
  WHERE user_id = p_user_id
  AND subscribed = true;
  
  RETURN COALESCE(v_subscription_tier, 'free');
END;
$$;