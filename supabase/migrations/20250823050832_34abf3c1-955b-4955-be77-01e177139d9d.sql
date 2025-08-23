-- Create plans and entitlements system
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_monthly numeric DEFAULT 0,
  price_yearly numeric DEFAULT 0,
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active plans
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

-- Tenant plans table
CREATE TABLE IF NOT EXISTS public.tenant_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_code text NOT NULL REFERENCES public.plans(code),
  seats integer DEFAULT 1,
  is_trial boolean DEFAULT false,
  trial_ends_at timestamp with time zone,
  active_from timestamp with time zone DEFAULT now(),
  active_to timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_plans ENABLE ROW LEVEL SECURITY;

-- Tenant can manage their own plans
CREATE POLICY "Tenants can manage their own plans" ON public.tenant_plans
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

-- Insert default plans
INSERT INTO public.plans (code, name, description, price_monthly, price_yearly, features) VALUES
  ('starter', 'Starter', 'Essential HR features for small teams', 0, 0, ARRAY['basic_hr', 'employee_management']),
  ('pro', 'Pro', 'Advanced HR analytics and automation', 99, 990, ARRAY['basic_hr', 'employee_management', 'exports', 'analytics', 'ask_aql']),
  ('enterprise', 'Enterprise', 'Full suite with compliance and governance', 299, 2990, ARRAY['basic_hr', 'employee_management', 'exports', 'analytics', 'ask_aql', 'osi', 'retention', 'compliance', 'advanced_analytics'])
ON CONFLICT (code) DO NOTHING;

-- Core entitlement check function
CREATE OR REPLACE FUNCTION public.core_is_allowed(p_feature text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id uuid;
  v_has_feature boolean := false;
BEGIN
  -- Get current user's tenant
  v_tenant_id := get_user_company_id();
  
  IF v_tenant_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if tenant has active plan with this feature
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_plans tp
    JOIN public.plans p ON tp.plan_code = p.code
    WHERE tp.tenant_id = v_tenant_id
      AND (tp.active_to IS NULL OR tp.active_to > now())
      AND tp.active_from <= now()
      AND p_feature = ANY(p.features)
      AND p.is_active = true
  ) INTO v_has_feature;
  
  RETURN v_has_feature;
END;
$$;

-- Function to enable enterprise trial
CREATE OR REPLACE FUNCTION public.enable_enterprise_trial(p_tenant_id uuid, p_days integer DEFAULT 14)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert or update trial
  INSERT INTO public.tenant_plans (tenant_id, plan_code, is_trial, trial_ends_at, active_from, active_to)
  VALUES (
    p_tenant_id, 
    'enterprise', 
    true, 
    now() + (p_days || ' days')::interval,
    now(),
    now() + (p_days || ' days')::interval
  )
  ON CONFLICT (tenant_id, plan_code) 
  DO UPDATE SET
    is_trial = true,
    trial_ends_at = now() + (p_days || ' days')::interval,
    active_from = now(),
    active_to = now() + (p_days || ' days')::interval,
    updated_at = now();
END;
$$;