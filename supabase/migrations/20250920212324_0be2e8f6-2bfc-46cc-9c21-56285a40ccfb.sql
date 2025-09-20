-- Complete Government Integration Infrastructure for 21+ KSA Portals
-- This creates the foundation for all Saudi government portal integrations

-- Core government portals registry
CREATE TABLE IF NOT EXISTS public.government_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_code TEXT UNIQUE NOT NULL,
  portal_name_en TEXT NOT NULL,
  portal_name_ar TEXT NOT NULL,
  portal_category TEXT NOT NULL, -- 'labor', 'health', 'education', 'interior', 'justice', 'commerce'
  api_base_url TEXT,
  documentation_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'deprecated')),
  supported_operations JSONB DEFAULT '[]'::jsonb,
  rate_limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Government portal connections per company
CREATE TABLE IF NOT EXISTS public.company_gov_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  portal_code TEXT NOT NULL REFERENCES public.government_portals(portal_code),
  connection_status TEXT DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error', 'demo', 'testing')),
  credentials_configured BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  auto_sync_enabled BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, portal_code)
);

-- Government API transaction logs
CREATE TABLE IF NOT EXISTS public.government_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  portal_code TEXT NOT NULL,
  operation_type TEXT NOT NULL, -- 'query', 'submit', 'update', 'delete', 'verify'
  request_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  http_method TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Government compliance tracking
CREATE TABLE IF NOT EXISTS public.government_compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  portal_code TEXT NOT NULL,
  compliance_type TEXT NOT NULL, -- 'nitaqat', 'wps', 'gosi', 'mol_permits', etc.
  status TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'pending', 'warning')),
  details JSONB DEFAULT '{}'::jsonb,
  last_checked_at TIMESTAMPTZ DEFAULT now(),
  next_check_due TIMESTAMPTZ,
  auto_remediation_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, portal_code, compliance_type)
);

-- Enable RLS
ALTER TABLE public.government_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_gov_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_compliance_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Government portals are readable by all authenticated users
CREATE POLICY "Government portals viewable by all authenticated users" 
ON public.government_portals FOR SELECT 
USING (auth.role() = 'authenticated');

-- Company government connections
CREATE POLICY "Company government connections by same company" 
ON public.company_gov_connections FOR ALL 
USING (company_id = get_current_user_company_id());

-- API logs restricted to same company
CREATE POLICY "Government API logs by same company" 
ON public.government_api_logs FOR ALL 
USING (company_id = get_current_user_company_id());

-- Compliance status restricted to same company
CREATE POLICY "Government compliance status by same company" 
ON public.government_compliance_status FOR ALL 
USING (company_id = get_current_user_company_id());

-- Insert all 21+ Saudi government portals
INSERT INTO public.government_portals (portal_code, portal_name_en, portal_name_ar, portal_category, supported_operations, rate_limits) VALUES
-- Labor & Employment (7 portals)
('qiwa', 'Qiwa Platform', 'منصة قوى', 'labor', '["employee_verification", "work_permits", "job_posting", "compliance_check", "visa_services"]', '{"requests_per_minute": 60, "daily_limit": 5000}'),
('mol', 'Ministry of Labor', 'وزارة العمل', 'labor', '["labor_office_services", "work_permits", "violations", "inspections"]', '{"requests_per_minute": 30, "daily_limit": 2000}'),
('mudad', 'Mudad Platform', 'منصة مداد', 'labor', '["labor_services", "worker_complaints", "mediation", "arbitration"]', '{"requests_per_minute": 40, "daily_limit": 3000}'),
('tvtc', 'TVTC Integration', 'المؤسسة العامة للتدريب التقني والمهني', 'education', '["training_programs", "certifications", "skills_assessment"]', '{"requests_per_minute": 20, "daily_limit": 1000}'),
('ncei', 'NCEI Employment', 'المركز الوطني للتنمية المهنية', 'labor', '["employment_services", "career_development", "job_matching"]', '{"requests_per_minute": 30, "daily_limit": 1500}'),
('taqat', 'Taqat HRDF', 'تقات صندوق تنمية الموارد البشرية', 'labor', '["funding_programs", "training_support", "employment_incentives"]', '{"requests_per_minute": 25, "daily_limit": 1200}'),
('nitaqat', 'Nitaqat Compliance', 'برنامج نطاقات', 'labor', '["saudization_status", "compliance_tracking", "color_classification"]', '{"requests_per_minute": 50, "daily_limit": 4000}'),

-- Health & Insurance (3 portals)
('chi', 'CHI Platform', 'مجلس الضمان الصحي', 'health', '["health_insurance", "claims_processing", "provider_network"]', '{"requests_per_minute": 40, "daily_limit": 2500}'),
('seha', 'Seha Platform', 'منصة صحة', 'health', '["medical_services", "appointments", "health_records"]', '{"requests_per_minute": 30, "daily_limit": 2000}'),
('gosi', 'GOSI Integration', 'التأمينات الاجتماعية', 'labor', '["social_insurance", "benefits", "contributions", "claims"]', '{"requests_per_minute": 60, "daily_limit": 5000}'),

-- Government Services (4 portals)
('absher', 'Absher Platform', 'منصة أبشر', 'interior', '["identity_verification", "government_services", "permits", "certificates"]', '{"requests_per_minute": 80, "daily_limit": 6000}'),
('interior', 'Interior Ministry', 'وزارة الداخلية', 'interior', '["security_clearance", "permits", "civil_status"]', '{"requests_per_minute": 20, "daily_limit": 1000}'),
('tawakkalna', 'Tawakkalna Compliance', 'توكلنا', 'health', '["covid_compliance", "health_status", "movement_permits"]', '{"requests_per_minute": 100, "daily_limit": 8000}'),
('elm', 'ELM Platform', 'منصة علم', 'education', '["educational_services", "student_records", "certifications"]', '{"requests_per_minute": 30, "daily_limit": 1800}'),

-- Justice & Documentation (3 portals)
('esnad', 'ESNAD Notarization', 'إسناد للتوثيق', 'justice', '["document_authentication", "notarization", "legal_verification"]', '{"requests_per_minute": 25, "daily_limit": 1200}'),
('saudi_post', 'Saudi Post Verification', 'البريد السعودي', 'commerce', '["postal_services", "address_verification", "delivery_tracking"]', '{"requests_per_minute": 50, "daily_limit": 3000}'),
('etimad', 'ETIMAD Platform', 'اعتماد', 'commerce', '["contractor_verification", "business_registration", "compliance_check"]', '{"requests_per_minute": 30, "daily_limit": 1500}'),

-- Professional Bodies (2 portals)
('saudi_engineering', 'Saudi Engineering Body', 'الهيئة السعودية للمهندسين', 'professional', '["engineer_verification", "licenses", "professional_development"]', '{"requests_per_minute": 20, "daily_limit": 800}'),
('qiyas', 'Qiyas Assessment', 'قياس', 'education', '["skills_assessment", "professional_tests", "certification_verification"]', '{"requests_per_minute": 25, "daily_limit": 1000}'),

-- Education (1 additional portal)
('education_ministry', 'Education Ministry', 'وزارة التعليم', 'education', '["educational_verification", "degree_authentication", "academic_records"]', '{"requests_per_minute": 30, "daily_limit": 1500}');

-- Functions for government portal management
CREATE OR REPLACE FUNCTION public.get_government_portals_status(p_company_id UUID)
RETURNS TABLE (
  portal_code TEXT,
  portal_name_en TEXT,
  portal_name_ar TEXT,
  category TEXT,
  connection_status TEXT,
  last_sync_at TIMESTAMPTZ,
  compliance_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gp.portal_code,
    gp.portal_name_en,
    gp.portal_name_ar,
    gp.portal_category,
    COALESCE(cgc.connection_status, 'disconnected') as connection_status,
    cgc.last_sync_at,
    COALESCE(compliance_counts.count, 0)::INTEGER as compliance_count
  FROM public.government_portals gp
  LEFT JOIN public.company_gov_connections cgc 
    ON gp.portal_code = cgc.portal_code AND cgc.company_id = p_company_id
  LEFT JOIN (
    SELECT portal_code, COUNT(*) as count
    FROM public.government_compliance_status 
    WHERE company_id = p_company_id AND status = 'compliant'
    GROUP BY portal_code
  ) compliance_counts ON gp.portal_code = compliance_counts.portal_code
  ORDER BY gp.portal_category, gp.portal_name_en;
END;
$$;

-- Function to initialize company government connections
CREATE OR REPLACE FUNCTION public.initialize_company_gov_portals(p_company_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_count INTEGER := 0;
  portal_record RECORD;
BEGIN
  FOR portal_record IN 
    SELECT portal_code FROM public.government_portals WHERE status = 'active'
  LOOP
    INSERT INTO public.company_gov_connections (company_id, portal_code, connection_status)
    VALUES (p_company_id, portal_record.portal_code, 'disconnected')
    ON CONFLICT (company_id, portal_code) DO NOTHING;
    
    IF FOUND THEN
      inserted_count := inserted_count + 1;
    END IF;
  END LOOP;
  
  RETURN inserted_count;
END;
$$;