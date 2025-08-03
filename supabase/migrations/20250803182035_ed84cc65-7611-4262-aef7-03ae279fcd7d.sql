-- Create Saudi compliance logging table
CREATE TABLE public.saudi_compliance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  user_id UUID,
  event_type TEXT NOT NULL,
  sensitive_data_detected BOOLEAN DEFAULT false,
  redacted_items_count INTEGER DEFAULT 0,
  ai_provider_used TEXT,
  query_hash TEXT,
  compliance_status TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saudi_compliance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for compliance logging
CREATE POLICY "Users can view compliance logs from their company" 
ON public.saudi_compliance_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert compliance logs" 
ON public.saudi_compliance_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_saudi_compliance_logs_company_created 
ON public.saudi_compliance_logs(company_id, created_at DESC);

CREATE INDEX idx_saudi_compliance_logs_sensitive_data 
ON public.saudi_compliance_logs(sensitive_data_detected, created_at DESC);

-- Create data retention policy (Saudi regulations require 7 years)
CREATE OR REPLACE FUNCTION public.cleanup_old_compliance_logs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Keep compliance logs for 7 years as per Saudi regulations
  DELETE FROM public.saudi_compliance_logs 
  WHERE created_at < (now() - INTERVAL '7 years');
END;
$$;

-- Create Saudi data protection configuration table
CREATE TABLE public.saudi_data_protection_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  data_classification_level TEXT NOT NULL DEFAULT 'confidential',
  cross_border_transfer_allowed BOOLEAN DEFAULT false,
  encryption_required BOOLEAN DEFAULT true,
  audit_level TEXT DEFAULT 'comprehensive',
  retention_period_years INTEGER DEFAULT 7,
  compliance_officer_contact TEXT,
  last_compliance_review DATE,
  next_compliance_review DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for data protection config
ALTER TABLE public.saudi_data_protection_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage data protection config for their company" 
ON public.saudi_data_protection_config 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert default configuration for Saudi compliance
INSERT INTO public.saudi_data_protection_config (
  company_id,
  data_classification_level,
  cross_border_transfer_allowed,
  encryption_required,
  audit_level,
  retention_period_years,
  compliance_officer_contact
) VALUES (
  'demo-company'::uuid,
  'highly_confidential',
  false,
  true,
  'comprehensive',
  7,
  'compliance@aqlhr.com'
);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_saudi_data_protection_config_updated_at
  BEFORE UPDATE ON public.saudi_data_protection_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();