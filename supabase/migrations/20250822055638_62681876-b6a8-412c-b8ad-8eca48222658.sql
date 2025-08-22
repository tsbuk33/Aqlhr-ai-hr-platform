-- Create features table
CREATE TABLE IF NOT EXISTS public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  created_at timestamp with time zone DEFAULT now()
);

-- Create plans table if not exists
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_mo numeric DEFAULT 0,
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create tenant_plans table to track which plan each tenant has
CREATE TABLE IF NOT EXISTS public.tenant_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_code text NOT NULL REFERENCES public.plans(code),
  active_from timestamp with time zone DEFAULT now(),
  active_to timestamp with time zone,
  seats integer DEFAULT 1,
  is_trial boolean DEFAULT false,
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view features" ON public.features FOR SELECT USING (true);
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Users can view their tenant plans" ON public.tenant_plans 
  FOR SELECT USING (tenant_id = get_user_company_id());