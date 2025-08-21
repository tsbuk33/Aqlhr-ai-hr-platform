-- Create has_feature RPC function
CREATE OR REPLACE FUNCTION public.has_feature(p_tenant_id UUID, p_feature_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_has_feature BOOLEAN := false;
BEGIN
  -- Check if tenant has an active plan with the requested feature
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_plans tp
    JOIN public.plans p ON tp.plan_code = p.code
    WHERE tp.tenant_id = p_tenant_id
      AND (tp.active_to IS NULL OR tp.active_to > now())
      AND tp.active_from <= now()
      AND p_feature_code = ANY(p.features)
      AND p.is_active = true
  ) INTO v_has_feature;
  
  RETURN v_has_feature;
END;
$$;

-- Create get_tenant_plan RPC function
CREATE OR REPLACE FUNCTION public.get_tenant_plan(p_tenant_id UUID DEFAULT NULL)
RETURNS TABLE(
  plan_code TEXT,
  plan_name TEXT,
  price_mo NUMERIC,
  features TEXT[],
  seats INTEGER,
  is_trial BOOLEAN,
  trial_ends_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Use provided tenant_id or get current user's company
  v_tenant_id := COALESCE(p_tenant_id, get_user_company_id());
  
  RETURN QUERY
  SELECT 
    p.code,
    p.name,
    p.price_mo,
    p.features,
    tp.seats,
    tp.is_trial,
    tp.trial_ends_at
  FROM public.tenant_plans tp
  JOIN public.plans p ON tp.plan_code = p.code
  WHERE tp.tenant_id = v_tenant_id
    AND (tp.active_to IS NULL OR tp.active_to > now())
    AND tp.active_from <= now()
    AND p.is_active = true
  ORDER BY tp.active_from DESC
  LIMIT 1;
END;
$$;

-- Insert default starter plan for all existing companies
INSERT INTO public.tenant_plans (tenant_id, plan_code, seats)
SELECT id, 'starter', 1
FROM public.companies
WHERE NOT EXISTS (
  SELECT 1 FROM public.tenant_plans 
  WHERE tenant_id = companies.id
);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_feature(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tenant_plan(UUID) TO authenticated;