-- AqlHR Backbone & Security v1 - Comprehensive Platform Foundation
-- This migration is idempotent and safe to re-run

-- ============================================================================
-- DIAGNOSTIC CASE GRAPH (Tenant-scoped, PDPL-safe)
-- ============================================================================

-- Cases table for diagnostic workflows
CREATE TABLE IF NOT EXISTS public.dx_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  module TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  baseline_date DATE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT dx_cases_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Enable RLS on dx_cases
ALTER TABLE public.dx_cases ENABLE ROW LEVEL SECURITY;

-- RLS Policy for dx_cases
DROP POLICY IF EXISTS "Users can manage diagnostic cases from their tenant" ON public.dx_cases;
CREATE POLICY "Users can manage diagnostic cases from their tenant" 
ON public.dx_cases 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Diagnostic inputs
CREATE TABLE IF NOT EXISTS public.dx_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  ref TEXT,
  snap_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dx_inputs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage diagnostic inputs from their tenant" ON public.dx_inputs;
CREATE POLICY "Users can manage diagnostic inputs from their tenant" 
ON public.dx_inputs 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()))
WITH CHECK (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()));

-- Diagnostic scores
CREATE TABLE IF NOT EXISTS public.dx_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,
  scope_id UUID,
  metric JSONB NOT NULL DEFAULT '{}',
  n INTEGER DEFAULT 0,
  last_computed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dx_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage diagnostic scores from their tenant" ON public.dx_scores;
CREATE POLICY "Users can manage diagnostic scores from their tenant" 
ON public.dx_scores 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()))
WITH CHECK (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()));

-- Diagnostic flags
CREATE TABLE IF NOT EXISTS public.dx_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  severity TEXT NOT NULL DEFAULT 'info',
  code TEXT NOT NULL,
  scope TEXT,
  scope_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dx_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage diagnostic flags from their tenant" ON public.dx_flags;
CREATE POLICY "Users can manage diagnostic flags from their tenant" 
ON public.dx_flags 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()))
WITH CHECK (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()));

-- Diagnostic playbooks
CREATE TABLE IF NOT EXISTS public.dx_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.dx_cases(id) ON DELETE CASCADE,
  ai_summary TEXT,
  initiatives JSONB DEFAULT '[]',
  owner_id UUID,
  status TEXT DEFAULT 'draft',
  confidence NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dx_playbooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage diagnostic playbooks from their tenant" ON public.dx_playbooks;
CREATE POLICY "Users can manage diagnostic playbooks from their tenant" 
ON public.dx_playbooks 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()))
WITH CHECK (EXISTS (SELECT 1 FROM public.dx_cases c WHERE c.id = case_id AND c.tenant_id = get_user_company_id()));

-- ============================================================================
-- VALUE EVENTS (Enhanced ROI tracking)
-- ============================================================================

-- Drop existing value_events if it exists and recreate with enhanced schema
DROP TABLE IF EXISTS public.value_events CASCADE;

CREATE TABLE public.value_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  payload JSONB DEFAULT '{}',
  hours_saved NUMERIC DEFAULT 0,
  sar_saved NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT value_events_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE public.value_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage value events from their tenant" ON public.value_events;
CREATE POLICY "Users can manage value events from their tenant" 
ON public.value_events 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- ============================================================================
-- AGENT & TOOL REGISTRY
-- ============================================================================

-- Agent tools catalog
CREATE TABLE IF NOT EXISTS public.agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  input_schema JSONB DEFAULT '{}',
  output_schema JSONB DEFAULT '{}',
  auth_type TEXT DEFAULT 'authenticated',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view agent tools" ON public.agent_tools;
CREATE POLICY "Anyone can view agent tools" 
ON public.agent_tools 
FOR SELECT 
USING (enabled = true);

-- Agent tool usage tracking
CREATE TABLE IF NOT EXISTS public.agent_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  tool_id UUID NOT NULL REFERENCES public.agent_tools(id) ON DELETE CASCADE,
  user_id UUID,
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT agent_tool_usage_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE public.agent_tool_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage tool usage from their tenant" ON public.agent_tool_usage;
CREATE POLICY "Users can manage tool usage from their tenant" 
ON public.agent_tool_usage 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- ============================================================================
-- ENTITLEMENTS & PLANS
-- ============================================================================

-- SKU catalog for selling modules
CREATE TABLE IF NOT EXISTS public.sku_catalog (
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'module',
  module_group TEXT,
  monthly_sar NUMERIC DEFAULT 0,
  yearly_sar NUMERIC DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sku_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view SKU catalog" ON public.sku_catalog;
CREATE POLICY "Anyone can view SKU catalog" 
ON public.sku_catalog 
FOR SELECT 
USING (true);

-- Tenant entitlements
CREATE TABLE IF NOT EXISTS public.tenant_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  sku_code TEXT NOT NULL REFERENCES public.sku_catalog(code) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  seats INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT tenant_entitlements_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, sku_code)
);

ALTER TABLE public.tenant_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view entitlements from their tenant" ON public.tenant_entitlements;
CREATE POLICY "Users can view entitlements from their tenant" 
ON public.tenant_entitlements 
FOR SELECT 
USING (tenant_id = get_user_company_id());

-- Feature flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  feature_code TEXT PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view feature flags" ON public.feature_flags;
CREATE POLICY "Anyone can view feature flags" 
ON public.feature_flags 
FOR SELECT 
USING (true);

-- Tenant features
CREATE TABLE IF NOT EXISTS public.tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  feature_code TEXT NOT NULL REFERENCES public.feature_flags(feature_code) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT tenant_features_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, feature_code)
);

ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tenant features from their tenant" ON public.tenant_features;
CREATE POLICY "Users can view tenant features from their tenant" 
ON public.tenant_features 
FOR SELECT 
USING (tenant_id = get_user_company_id());

-- ============================================================================
-- API GATEWAY & SECURITY
-- ============================================================================

-- API keys for external access
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  CONSTRAINT api_keys_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage API keys from their tenant" ON public.api_keys;
CREATE POLICY "Users can manage API keys from their tenant" 
ON public.api_keys 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Rate limiting buckets
CREATE TABLE IF NOT EXISTS public.api_rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  bucket TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  counter INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT api_rate_limit_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, bucket, window_start)
);

ALTER TABLE public.api_rate_limit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can manage rate limits" ON public.api_rate_limit;
CREATE POLICY "System can manage rate limits" 
ON public.api_rate_limit 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Enhanced audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT audit_log_tenant_fk FOREIGN KEY (tenant_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit log from their tenant" ON public.audit_log;
CREATE POLICY "Admins can view audit log from their tenant" 
ON public.audit_log 
FOR SELECT 
USING (tenant_id = get_user_company_id() AND EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role IN ('admin', 'super_admin')
));

DROP POLICY IF EXISTS "System can insert audit log" ON public.audit_log;
CREATE POLICY "System can insert audit log" 
ON public.audit_log 
FOR INSERT 
WITH CHECK (true);

-- ============================================================================
-- PDPL/PII INVENTORY
-- ============================================================================

-- PII catalog for compliance
CREATE TABLE IF NOT EXISTS public.pii_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  pii_type TEXT NOT NULL,
  purpose TEXT,
  retention_days INTEGER DEFAULT 2555, -- 7 years default
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(table_name, column_name)
);

ALTER TABLE public.pii_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage PII catalog" ON public.pii_catalog;
CREATE POLICY "Admins can manage PII catalog" 
ON public.pii_catalog 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role IN ('admin', 'super_admin')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role IN ('admin', 'super_admin')
));

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if tenant has specific entitlement
CREATE OR REPLACE FUNCTION public.has_entitlement(p_tenant UUID, p_sku TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.tenant_entitlements te
    WHERE te.tenant_id = p_tenant
      AND te.sku_code = p_sku
      AND te.active = true
      AND (te.ends_at IS NULL OR te.ends_at > now())
  );
$$;

-- API key creation with hashing
CREATE OR REPLACE FUNCTION public.api_create_key_v1(
  p_tenant_id UUID,
  p_name TEXT,
  p_scopes TEXT[] DEFAULT '{}'
)
RETURNS TABLE(key_id UUID, api_key TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id UUID;
  v_api_key TEXT;
  v_key_hash TEXT;
BEGIN
  -- Generate API key
  v_api_key := 'ak_' || encode(gen_random_bytes(32), 'hex');
  v_key_hash := encode(digest(v_api_key, 'sha256'), 'hex');
  
  -- Insert API key
  INSERT INTO public.api_keys (tenant_id, name, key_hash, scopes)
  VALUES (p_tenant_id, p_name, v_key_hash, p_scopes)
  RETURNING id INTO v_key_id;
  
  -- Return key ID and plaintext key (only time it's visible)
  RETURN QUERY SELECT v_key_id, v_api_key;
END;
$$;

-- API key revocation
CREATE OR REPLACE FUNCTION public.api_revoke_key_v1(p_key_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.api_keys 
  SET active = false 
  WHERE id = p_key_id 
    AND tenant_id = get_user_company_id();
  
  RETURN FOUND;
END;
$$;

-- PDPL redaction function
CREATE OR REPLACE FUNCTION public.pdpl_redact(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Simple redaction - replace with asterisks, keeping first/last chars
  IF length(input_text) <= 3 THEN
    RETURN repeat('*', length(input_text));
  ELSE
    RETURN left(input_text, 1) || repeat('*', length(input_text) - 2) || right(input_text, 1);
  END IF;
END;
$$;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default SKUs
INSERT INTO public.sku_catalog (code, title, kind, module_group, monthly_sar, yearly_sar, meta)
VALUES 
  ('core_hr', 'Core HR Management', 'module', 'hr', 299, 2988, '{"features": ["employee_management", "payroll", "attendance"]}'),
  ('advanced_analytics', 'Advanced Analytics', 'module', 'analytics', 499, 4988, '{"features": ["dashboards", "reports", "ai_insights"]}'),
  ('government_integration', 'Government Integration', 'module', 'compliance', 399, 3988, '{"features": ["qiwa_sync", "gosi_sync", "mol_integration"]}'),
  ('api_access', 'API Access', 'feature', 'platform', 199, 1988, '{"rate_limits": {"requests_per_hour": 1000}}')
ON CONFLICT (code) DO NOTHING;

-- Insert default feature flags
INSERT INTO public.feature_flags (feature_code, description)
VALUES 
  ('api_gateway', 'API Gateway Access'),
  ('advanced_diagnostics', 'Advanced Diagnostic Tools'),
  ('ai_recommendations', 'AI-Powered Recommendations'),
  ('bulk_operations', 'Bulk Data Operations'),
  ('custom_reports', 'Custom Report Builder')
ON CONFLICT (feature_code) DO NOTHING;

-- Insert default agent tools
INSERT INTO public.agent_tools (code, title, description, input_schema, output_schema, auth_type, enabled)
VALUES 
  ('nitaqat_status', 'Nitaqat Status Check', 'Check current Nitaqat band and compliance status', 
   '{"type": "object", "properties": {"tenant_id": {"type": "string"}}}',
   '{"type": "object", "properties": {"band": {"type": "string"}, "percentage": {"type": "number"}}}',
   'authenticated', true),
  ('gosi_sync', 'GOSI Data Sync', 'Synchronize employee data with GOSI systems',
   '{"type": "object", "properties": {"tenant_id": {"type": "string"}, "sync_type": {"type": "string"}}}',
   '{"type": "object", "properties": {"status": {"type": "string"}, "records_synced": {"type": "number"}}}',
   'authenticated', true),
  ('iqama_validation', 'Iqama Validation', 'Validate employee Iqama documents and expiry dates',
   '{"type": "object", "properties": {"tenant_id": {"type": "string"}, "employee_ids": {"type": "array"}}}',
   '{"type": "object", "properties": {"valid_count": {"type": "number"}, "expired_count": {"type": "number"}}}',
   'authenticated', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample PII catalog entries
INSERT INTO public.pii_catalog (table_name, column_name, pii_type, purpose, retention_days)
VALUES 
  ('hr_employees', 'full_name_en', 'name', 'Employee identification', 2555),
  ('hr_employees', 'full_name_ar', 'name', 'Employee identification', 2555),
  ('hr_employees', 'nationality_code', 'nationality', 'Compliance reporting', 2555),
  ('hr_employees', 'dob', 'date_of_birth', 'Age verification', 2555),
  ('saudi_documents', 'document_number', 'government_id', 'Document verification', 3650)
ON CONFLICT (table_name, column_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dx_cases_tenant ON public.dx_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dx_inputs_case ON public.dx_inputs(case_id);
CREATE INDEX IF NOT EXISTS idx_dx_scores_case ON public.dx_scores(case_id);
CREATE INDEX IF NOT EXISTS idx_dx_flags_case ON public.dx_flags(case_id);
CREATE INDEX IF NOT EXISTS idx_dx_playbooks_case ON public.dx_playbooks(case_id);
CREATE INDEX IF NOT EXISTS idx_value_events_tenant ON public.value_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_tool_usage_tenant ON public.agent_tool_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_entitlements_tenant ON public.tenant_entitlements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON public.api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant ON public.audit_log(tenant_id);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS update_dx_playbooks_updated_at ON public.dx_playbooks;
CREATE TRIGGER update_dx_playbooks_updated_at
  BEFORE UPDATE ON public.dx_playbooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_tools_updated_at ON public.agent_tools;
CREATE TRIGGER update_agent_tools_updated_at
  BEFORE UPDATE ON public.agent_tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sku_catalog_updated_at ON public.sku_catalog;
CREATE TRIGGER update_sku_catalog_updated_at
  BEFORE UPDATE ON public.sku_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();