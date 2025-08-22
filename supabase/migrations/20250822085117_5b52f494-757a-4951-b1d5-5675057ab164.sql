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