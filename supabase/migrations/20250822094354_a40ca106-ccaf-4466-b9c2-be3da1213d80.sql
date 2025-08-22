-- Create API Gateway & Security Framework tables

-- API Keys table
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Scopes reference table
CREATE TABLE public.api_scopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope_key TEXT NOT NULL UNIQUE,
  scope_name TEXT NOT NULL,
  scope_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rate limiting tracking
CREATE TABLE public.api_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  api_key_id UUID,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  call_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Audit logs
CREATE TABLE public.api_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  api_key_id UUID,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_headers JSONB,
  request_body JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PII Catalog for PDPL compliance
CREATE TABLE public.pii_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  data_type TEXT NOT NULL,
  classification TEXT NOT NULL, -- 'public', 'internal', 'confidential', 'restricted'
  retention_days INTEGER NOT NULL DEFAULT 2555, -- 7 years default
  data_residency TEXT NOT NULL DEFAULT 'saudi_arabia',
  processing_purpose TEXT,
  legal_basis TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_catalog ENABLE ROW LEVEL SECURITY;

-- RLS Policies for API Keys
CREATE POLICY "Users can manage API keys from their tenant" 
ON public.api_keys 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- RLS Policies for API Scopes (read-only for authenticated users)
CREATE POLICY "Users can view API scopes" 
ON public.api_scopes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for Rate Limits
CREATE POLICY "Users can view rate limits from their tenant" 
ON public.api_rate_limits 
FOR ALL 
USING (tenant_id = get_user_company_id());

-- RLS Policies for API Audit Logs
CREATE POLICY "Users can view audit logs from their tenant" 
ON public.api_audit_logs 
FOR SELECT 
USING (tenant_id = get_user_company_id());

CREATE POLICY "System can insert audit logs" 
ON public.api_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for PII Catalog
CREATE POLICY "Users can manage PII catalog from their tenant" 
ON public.pii_catalog 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Insert default API scopes
INSERT INTO public.api_scopes (scope_key, scope_name, scope_description) VALUES
('read.kpi', 'Read KPI Data', 'Access to view KPI and analytics data'),
('run.autopilot', 'Run Autopilot', 'Execute autopilot and automated processes'),
('read.diagnostics', 'Read Diagnostics', 'Access to diagnostic tools and reports'),
('write.tasks', 'Write Tasks', 'Create and modify tasks and workflows'),
('read.export', 'Read Export', 'Access to export data and generate reports');

-- Insert sample PII catalog entries
INSERT INTO public.pii_catalog (tenant_id, table_name, column_name, data_type, classification, retention_days, processing_purpose, legal_basis) VALUES
(gen_random_uuid(), 'hr_employees', 'full_name_en', 'text', 'confidential', 2555, 'Employee management', 'Employment contract'),
(gen_random_uuid(), 'hr_employees', 'full_name_ar', 'text', 'confidential', 2555, 'Employee management', 'Employment contract'),
(gen_random_uuid(), 'hr_employees', 'nationality', 'text', 'restricted', 2555, 'Legal compliance', 'Saudi labor law'),
(gen_random_uuid(), 'hr_employees', 'hire_date', 'date', 'internal', 2555, 'HR analytics', 'Business operations'),
(gen_random_uuid(), 'hr_employees', 'base_salary', 'numeric', 'restricted', 2555, 'Payroll processing', 'Employment contract');

-- Functions for API key management
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'aql_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_api_key(
  p_tenant_id UUID,
  p_key_name TEXT,
  p_scopes TEXT[],
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE(api_key TEXT, key_id UUID) AS $$
DECLARE
  v_api_key TEXT;
  v_key_id UUID;
BEGIN
  -- Validate tenant access
  IF p_tenant_id != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant_id;
  END IF;
  
  -- Generate API key
  v_api_key := generate_api_key();
  
  -- Insert API key
  INSERT INTO public.api_keys (
    tenant_id, key_name, api_key, scopes, expires_at, created_by
  ) VALUES (
    p_tenant_id, p_key_name, v_api_key, p_scopes, p_expires_at, auth.uid()
  ) RETURNING id INTO v_key_id;
  
  RETURN QUERY SELECT v_api_key, v_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.revoke_api_key(p_key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Get tenant ID and validate access
  SELECT tenant_id INTO v_tenant_id
  FROM public.api_keys 
  WHERE id = p_key_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'API key not found';
  END IF;
  
  IF v_tenant_id != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Revoke the key
  UPDATE public.api_keys 
  SET is_active = false, updated_at = now()
  WHERE id = p_key_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.validate_api_key(p_api_key TEXT)
RETURNS TABLE(
  key_id UUID,
  tenant_id UUID,
  scopes TEXT[],
  is_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ak.id,
    ak.tenant_id,
    ak.scopes,
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())) as is_valid
  FROM public.api_keys ak
  WHERE ak.api_key = p_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_tenant_id UUID,
  p_api_key_id UUID,
  p_limit INTEGER DEFAULT 600,
  p_window_minutes INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_current_count INTEGER;
BEGIN
  -- Calculate window start (round down to window boundary)
  v_window_start := date_trunc('minute', now()) - 
    (EXTRACT(MINUTE FROM now())::INTEGER % p_window_minutes) * interval '1 minute';
  
  -- Get current count for this window
  SELECT COALESCE(call_count, 0) INTO v_current_count
  FROM public.api_rate_limits
  WHERE tenant_id = p_tenant_id 
    AND api_key_id = p_api_key_id
    AND window_start = v_window_start;
  
  -- Check if limit exceeded
  IF v_current_count >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  INSERT INTO public.api_rate_limits (tenant_id, api_key_id, window_start, call_count)
  VALUES (p_tenant_id, p_api_key_id, v_window_start, 1)
  ON CONFLICT (tenant_id, api_key_id, window_start)
  DO UPDATE SET 
    call_count = api_rate_limits.call_count + 1,
    updated_at = now();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_api_call(
  p_tenant_id UUID,
  p_api_key_id UUID,
  p_endpoint TEXT,
  p_method TEXT,
  p_request_headers JSONB DEFAULT NULL,
  p_request_body JSONB DEFAULT NULL,
  p_response_status INTEGER DEFAULT NULL,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO public.api_audit_logs (
    tenant_id, api_key_id, endpoint, method, request_headers, 
    request_body, response_status, response_time_ms, ip_address, user_agent
  ) VALUES (
    p_tenant_id, p_api_key_id, p_endpoint, p_method, p_request_headers,
    p_request_body, p_response_status, p_response_time_ms, p_ip_address, p_user_agent
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create unique constraints
CREATE UNIQUE INDEX api_rate_limits_tenant_key_window_idx 
ON public.api_rate_limits (tenant_id, api_key_id, window_start);

-- Create indexes for performance
CREATE INDEX api_keys_tenant_active_idx ON public.api_keys (tenant_id, is_active);
CREATE INDEX api_audit_logs_tenant_created_idx ON public.api_audit_logs (tenant_id, created_at DESC);
CREATE INDEX api_rate_limits_window_idx ON public.api_rate_limits (window_start);
CREATE INDEX pii_catalog_tenant_idx ON public.pii_catalog (tenant_id);

-- Update API keys last_used_at
CREATE OR REPLACE FUNCTION public.update_api_key_usage(p_api_key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.api_keys 
  SET last_used_at = now()
  WHERE id = p_api_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;