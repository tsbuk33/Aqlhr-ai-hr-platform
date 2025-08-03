-- Add company compliance settings table
CREATE TABLE public.company_compliance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  company_type TEXT NOT NULL DEFAULT 'saudi_local' CHECK (company_type IN ('saudi_local', 'international_saudi', 'multinational')),
  compliance_level TEXT NOT NULL DEFAULT 'SAUDI_STRICT' CHECK (compliance_level IN ('SAUDI_STRICT', 'INTERNATIONAL_SAUDI', 'GLOBAL_STANDARD')),
  allow_external_ai BOOLEAN DEFAULT false,
  allow_cross_border_transfer BOOLEAN DEFAULT false,
  data_classification TEXT DEFAULT 'highly_confidential' CHECK (data_classification IN ('public', 'internal', 'confidential', 'highly_confidential')),
  audit_requirements TEXT DEFAULT 'comprehensive' CHECK (audit_requirements IN ('minimal', 'standard', 'comprehensive')),
  compliance_officer_email TEXT,
  compliance_officer_name TEXT,
  last_compliance_review DATE,
  next_compliance_review DATE,
  regulatory_framework TEXT[] DEFAULT ARRAY['saudi_pdpl', 'gcc_data_protection'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Enable RLS
ALTER TABLE public.company_compliance_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view compliance settings for their company" 
ON public.company_compliance_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update compliance settings for their company" 
ON public.company_compliance_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert compliance settings for their company" 
ON public.company_compliance_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert sample configurations for different company types
INSERT INTO public.company_compliance_settings (
  company_id,
  company_type,
  compliance_level,
  allow_external_ai,
  allow_cross_border_transfer,
  data_classification,
  audit_requirements,
  compliance_officer_email,
  compliance_officer_name,
  regulatory_framework
) VALUES 
-- Saudi local company (strictest)
('demo-company'::uuid, 'saudi_local', 'SAUDI_STRICT', false, false, 'highly_confidential', 'comprehensive', 'compliance@aqlhr.com', 'Ahmed Al-Saudi', ARRAY['saudi_pdpl', 'saudi_labor_law', 'mci_regulations']),

-- International company in Saudi
('international-demo'::uuid, 'international_saudi', 'INTERNATIONAL_SAUDI', true, true, 'confidential', 'standard', 'compliance@intl-company.com', 'Sarah Johnson', ARRAY['saudi_pdpl', 'gdpr', 'gcc_data_protection']),

-- Multinational corporation
('mnc-demo'::uuid, 'multinational', 'GLOBAL_STANDARD', true, true, 'internal', 'standard', 'compliance@mnc-global.com', 'David Chen', ARRAY['gdpr', 'ccpa', 'appi']);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_company_compliance_settings_updated_at
  BEFORE UPDATE ON public.company_compliance_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_company_compliance_company_id 
ON public.company_compliance_settings(company_id);

CREATE INDEX idx_company_compliance_level 
ON public.company_compliance_settings(compliance_level, company_type);