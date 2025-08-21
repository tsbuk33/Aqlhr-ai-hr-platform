-- Create plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_mo NUMERIC NOT NULL DEFAULT 0,
  features TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tenant_plans table
CREATE TABLE public.tenant_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  plan_code TEXT NOT NULL REFERENCES public.plans(code),
  seats INTEGER NOT NULL DEFAULT 1,
  active_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  active_to TIMESTAMP WITH TIME ZONE,
  is_trial BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, plan_code, active_from)
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for plans (public read)
CREATE POLICY "Anyone can view active plans" 
ON public.plans 
FOR SELECT 
USING (is_active = true);

-- RLS policies for tenant_plans (company access)
CREATE POLICY "Users can view their company's plans" 
ON public.tenant_plans 
FOR SELECT 
USING (tenant_id = get_user_company_id());

CREATE POLICY "Users can manage their company's plans" 
ON public.tenant_plans 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Add triggers for updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_plans_updated_at
  BEFORE UPDATE ON public.tenant_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.plans (code, name, price_mo, features, description, sort_order) VALUES
('starter', 'Starter', 0, ARRAY['core_hr', 'basic_reports', 'employee_management'], 'Perfect for getting started', 1),
('growth', 'Growth', 99, ARRAY['core_hr', 'basic_reports', 'employee_management', 'cci_playbook', 'cci_exports', 'compliance_autopilot', 'advanced_analytics'], 'Scale your HR operations', 2),
('enterprise', 'Enterprise', 299, ARRAY['core_hr', 'basic_reports', 'employee_management', 'cci_playbook', 'cci_exports', 'compliance_autopilot', 'advanced_analytics', 'executive_intelligence', 'api_access', 'custom_integrations', 'dedicated_support'], 'Full enterprise capabilities', 3);

-- Create indexes
CREATE INDEX idx_tenant_plans_tenant_id ON public.tenant_plans(tenant_id);
CREATE INDEX idx_tenant_plans_active ON public.tenant_plans(tenant_id, active_from, active_to);
CREATE INDEX idx_plans_code ON public.plans(code);
CREATE INDEX idx_plans_active ON public.plans(is_active);