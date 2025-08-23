-- Government Integration Console & Tenant Localization Preferences

-- Create tenant localization preferences table
CREATE TABLE IF NOT EXISTS public.tenant_localization_prefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  default_language TEXT NOT NULL DEFAULT 'en' CHECK (default_language IN ('en', 'ar')),
  numeral_system TEXT NOT NULL DEFAULT 'western' CHECK (numeral_system IN ('western', 'arabic_indic')),
  default_calendar TEXT NOT NULL DEFAULT 'gregorian' CHECK (default_calendar IN ('gregorian', 'hijri')),
  
  -- Per-module calendar preferences
  module_calendar_prefs JSONB DEFAULT '{}',
  
  -- Date and time format preferences
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  time_format TEXT DEFAULT '24h' CHECK (time_format IN ('12h', '24h')),
  
  -- Currency and number formatting
  currency_symbol TEXT DEFAULT 'SAR',
  decimal_separator TEXT DEFAULT '.' CHECK (decimal_separator IN ('.', ',')),
  thousands_separator TEXT DEFAULT ',' CHECK (thousands_separator IN (',', ' ', '')),
  
  -- Timezone preference
  timezone TEXT DEFAULT 'Asia/Riyadh',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(tenant_id)
);

-- Create government integration simulator configs
CREATE TABLE IF NOT EXISTS public.gov_simulator_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  system TEXT NOT NULL, -- qiwa, gosi, absher
  
  -- Simulator settings
  enabled BOOLEAN DEFAULT true,
  response_delay_ms INTEGER DEFAULT 1000,
  success_rate NUMERIC DEFAULT 0.95 CHECK (success_rate >= 0 AND success_rate <= 1),
  
  -- Mock data configuration
  mock_data_config JSONB DEFAULT '{}',
  
  -- Simulation scenarios
  scenarios JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(tenant_id, system)
);

-- Create integration orchestration workflows
CREATE TABLE IF NOT EXISTS public.gov_integration_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  workflow_name TEXT NOT NULL,
  description TEXT,
  
  -- Workflow definition
  steps JSONB NOT NULL DEFAULT '[]',
  triggers JSONB DEFAULT '{}',
  
  -- Status and execution
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  -- Metrics
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.tenant_localization_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_simulator_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gov_integration_workflows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "tenant_rw_localization_prefs" ON public.tenant_localization_prefs
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "tenant_rw_simulator_configs" ON public.gov_simulator_configs
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "tenant_rw_workflows" ON public.gov_integration_workflows
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

-- Function to get tenant localization preferences
CREATE OR REPLACE FUNCTION public.get_tenant_localization_prefs(p_tenant_id UUID DEFAULT NULL)
RETURNS TABLE(
  default_language TEXT,
  numeral_system TEXT,
  default_calendar TEXT,
  module_calendar_prefs JSONB,
  date_format TEXT,
  time_format TEXT,
  currency_symbol TEXT,
  decimal_separator TEXT,
  thousands_separator TEXT,
  timezone TEXT
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(tlp.default_language, 'en') as default_language,
    COALESCE(tlp.numeral_system, 'western') as numeral_system,
    COALESCE(tlp.default_calendar, 'gregorian') as default_calendar,
    COALESCE(tlp.module_calendar_prefs, '{}') as module_calendar_prefs,
    COALESCE(tlp.date_format, 'DD/MM/YYYY') as date_format,
    COALESCE(tlp.time_format, '24h') as time_format,
    COALESCE(tlp.currency_symbol, 'SAR') as currency_symbol,
    COALESCE(tlp.decimal_separator, '.') as decimal_separator,
    COALESCE(tlp.thousands_separator, ',') as thousands_separator,
    COALESCE(tlp.timezone, 'Asia/Riyadh') as timezone
  FROM public.tenant_localization_prefs tlp
  WHERE tlp.tenant_id = COALESCE(p_tenant_id, get_user_company_id())
  
  UNION ALL
  
  -- Return defaults if no preferences exist
  SELECT 
    'en'::TEXT, 'western'::TEXT, 'gregorian'::TEXT, '{}'::JSONB,
    'DD/MM/YYYY'::TEXT, '24h'::TEXT, 'SAR'::TEXT, '.'::TEXT, ','::TEXT, 'Asia/Riyadh'::TEXT
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tenant_localization_prefs 
    WHERE tenant_id = COALESCE(p_tenant_id, get_user_company_id())
  )
  LIMIT 1;
$$;

-- Function to update localization preferences
CREATE OR REPLACE FUNCTION public.update_localization_prefs(
  p_tenant_id UUID,
  p_preferences JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate tenant access
  IF p_tenant_id != get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant_id;
  END IF;

  -- Upsert preferences
  INSERT INTO public.tenant_localization_prefs (
    tenant_id, default_language, numeral_system, default_calendar,
    module_calendar_prefs, date_format, time_format, currency_symbol,
    decimal_separator, thousands_separator, timezone
  ) VALUES (
    p_tenant_id,
    COALESCE(p_preferences->>'default_language', 'en'),
    COALESCE(p_preferences->>'numeral_system', 'western'),
    COALESCE(p_preferences->>'default_calendar', 'gregorian'),
    COALESCE(p_preferences->'module_calendar_prefs', '{}'),
    COALESCE(p_preferences->>'date_format', 'DD/MM/YYYY'),
    COALESCE(p_preferences->>'time_format', '24h'),
    COALESCE(p_preferences->>'currency_symbol', 'SAR'),
    COALESCE(p_preferences->>'decimal_separator', '.'),
    COALESCE(p_preferences->>'thousands_separator', ','),
    COALESCE(p_preferences->>'timezone', 'Asia/Riyadh')
  )
  ON CONFLICT (tenant_id)
  DO UPDATE SET
    default_language = EXCLUDED.default_language,
    numeral_system = EXCLUDED.numeral_system,
    default_calendar = EXCLUDED.default_calendar,
    module_calendar_prefs = EXCLUDED.module_calendar_prefs,
    date_format = EXCLUDED.date_format,
    time_format = EXCLUDED.time_format,
    currency_symbol = EXCLUDED.currency_symbol,
    decimal_separator = EXCLUDED.decimal_separator,
    thousands_separator = EXCLUDED.thousands_separator,
    timezone = EXCLUDED.timezone,
    updated_at = now();

  RETURN TRUE;
END;
$$;

-- Function to simulate government API responses
CREATE OR REPLACE FUNCTION public.simulate_gov_api_call(
  p_tenant_id UUID,
  p_system TEXT,
  p_endpoint TEXT,
  p_payload JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_config RECORD;
  v_success BOOLEAN;
  v_response JSONB;
BEGIN
  -- Get simulator configuration
  SELECT * INTO v_config 
  FROM public.gov_simulator_configs 
  WHERE tenant_id = p_tenant_id AND system = p_system;
  
  -- Use defaults if no config exists
  IF NOT FOUND THEN
    v_config.success_rate := 0.95;
    v_config.response_delay_ms := 1000;
    v_config.mock_data_config := '{}';
  END IF;
  
  -- Simulate success/failure based on success rate
  v_success := random() < v_config.success_rate;
  
  -- Generate mock response based on system and endpoint
  IF v_success THEN
    v_response := CASE p_system
      WHEN 'qiwa' THEN jsonb_build_object(
        'status', 'success',
        'data', CASE p_endpoint
          WHEN 'employee_status' THEN jsonb_build_object(
            'employees', jsonb_build_array(
              jsonb_build_object(
                'iqama_no', '1234567890',
                'status', 'active',
                'contract_type', 'unlimited',
                'position', 'Software Engineer',
                'salary', 8000
              )
            )
          )
          WHEN 'visa_status' THEN jsonb_build_object(
            'visas', jsonb_build_array(
              jsonb_build_object(
                'visa_no', 'V123456789',
                'status', 'approved',
                'expiry_date', '2025-12-31',
                'profession', 'Engineer'
              )
            )
          )
          ELSE jsonb_build_object('message', 'Mock Qiwa response')
        END,
        'timestamp', now(),
        'simulated', true
      )
      WHEN 'gosi' THEN jsonb_build_object(
        'status', 'success',
        'data', CASE p_endpoint
          WHEN 'contribution_status' THEN jsonb_build_object(
            'contributions', jsonb_build_array(
              jsonb_build_object(
                'employee_id', '1234567890',
                'month', '2024-08',
                'employee_contribution', 450.00,
                'employer_contribution', 900.00,
                'total_contribution', 1350.00,
                'status', 'paid'
              )
            )
          )
          ELSE jsonb_build_object('message', 'Mock GOSI response')
        END,
        'timestamp', now(),
        'simulated', true
      )
      WHEN 'absher' THEN jsonb_build_object(
        'status', 'success',
        'data', CASE p_endpoint
          WHEN 'iqama_verification' THEN jsonb_build_object(
            'verification_results', jsonb_build_array(
              jsonb_build_object(
                'iqama_no', '1234567890',
                'name_arabic', 'أحمد محمد علي',
                'name_english', 'Ahmed Mohammed Ali',
                'nationality', 'Pakistani',
                'expiry_date', '2025-06-15',
                'status', 'valid'
              )
            )
          )
          ELSE jsonb_build_object('message', 'Mock Absher response')
        END,
        'timestamp', now(),
        'simulated', true
      )
      ELSE jsonb_build_object('status', 'success', 'message', 'Generic mock response', 'simulated', true)
    END;
  ELSE
    v_response := jsonb_build_object(
      'status', 'error',
      'error', jsonb_build_object(
        'code', 'SIMULATION_ERROR',
        'message', 'Simulated API failure'
      ),
      'timestamp', now(),
      'simulated', true
    );
  END IF;
  
  -- Log the simulation
  INSERT INTO public.gov_sync_logs (
    tenant_id, system, sync_type, status, 
    payload, response_data, test_mode
  ) VALUES (
    p_tenant_id, p_system, 'simulation', 
    CASE WHEN v_success THEN 'completed' ELSE 'failed' END,
    p_payload, v_response, true
  );
  
  RETURN v_response;
END;
$$;