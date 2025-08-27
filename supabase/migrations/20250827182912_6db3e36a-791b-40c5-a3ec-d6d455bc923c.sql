-- Fix critical security issues from linter

-- 1. Add RLS policies for tables that have RLS enabled but no policies
-- Fix leo_paths table
CREATE POLICY "leo_paths_tenant_access" 
ON public.leo_paths FOR ALL
USING (tenant_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Fix geo_pulses table  
CREATE POLICY "geo_pulses_tenant_access" 
ON public.geo_pulses FOR ALL
USING (tenant_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Fix share_links table
CREATE POLICY "share_links_tenant_access" 
ON public.share_links FOR ALL
USING (tenant_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Fix sales_leads policies (update existing)
DROP POLICY IF EXISTS "sales_leads_tenant_update" ON public.sales_leads;
CREATE POLICY "sales_leads_tenant_update" 
ON public.sales_leads FOR UPDATE
USING (tenant_id = get_user_company_id() OR get_user_company_id() IS NULL);

DROP POLICY IF EXISTS "sales_leads_tenant_delete" ON public.sales_leads;
CREATE POLICY "sales_leads_tenant_delete" 
ON public.sales_leads FOR DELETE
USING (tenant_id = get_user_company_id() OR get_user_company_id() IS NULL);

-- Fix cci_invite_tokens policies (more permissive for public access where needed)
DROP POLICY IF EXISTS "cci_invite_tokens_public_access" ON public.cci_invite_tokens;
CREATE POLICY "cci_invite_tokens_public_access" 
ON public.cci_invite_tokens FOR SELECT
USING (expires_at > NOW() OR tenant_id = get_user_company_id());

-- 2. Fix function search paths for security
-- Update functions that don't have SET search_path
CREATE OR REPLACE FUNCTION public.cosine_similarity(vec1 DOUBLE PRECISION[], vec2 DOUBLE PRECISION[])
RETURNS DOUBLE PRECISION
LANGUAGE plpgsql
IMMUTABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    dot_product DOUBLE PRECISION := 0;
    norm_a DOUBLE PRECISION := 0;
    norm_b DOUBLE PRECISION := 0;
    i INTEGER;
BEGIN
    -- Ensure vectors are the same length
    IF array_length(vec1, 1) <> array_length(vec2, 1) THEN
        RETURN 0;
    END IF;
    
    -- Calculate dot product and norms
    FOR i IN 1..array_length(vec1, 1) LOOP
        dot_product := dot_product + (vec1[i] * vec2[i]);
        norm_a := norm_a + (vec1[i] * vec1[i]);
        norm_b := norm_b + (vec2[i] * vec2[i]);
    END LOOP;
    
    -- Avoid division by zero
    IF norm_a = 0 OR norm_b = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
END;
$$;

-- 3. Create essential authentication security audit function
CREATE OR REPLACE FUNCTION audit_auth_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, 
    company_id, 
    event_type, 
    event_details,
    ip_address
  ) VALUES (
    COALESCE(p_user_id, auth.uid()),
    get_user_company_id(),
    p_event_type,
    p_details,
    inet_client_addr()
  );
END;
$$;