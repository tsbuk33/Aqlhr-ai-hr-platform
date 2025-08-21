-- Create AgentOS v1 Tables

-- Agent skills master table
CREATE TABLE public.agent_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT 'general',
  execution_type TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, manual, triggered
  default_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agent skill bindings per tenant
CREATE TABLE public.agent_skill_bindings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  skill_code TEXT NOT NULL REFERENCES public.agent_skills(code) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_run_status TEXT, -- success, error, running
  last_run_metrics JSONB DEFAULT '{}',
  next_run_at TIMESTAMP WITH TIME ZONE,
  run_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, skill_code)
);

-- Agent skill execution logs
CREATE TABLE public.agent_skill_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  skill_code TEXT NOT NULL,
  execution_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running', -- running, success, error, cancelled
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  error_message TEXT,
  dry_run BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skill_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skill_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view agent skills" ON public.agent_skills
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage skill bindings for their company" ON public.agent_skill_bindings
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

CREATE POLICY "Users can view skill executions for their company" ON public.agent_skill_executions
  FOR SELECT USING (tenant_id = get_user_company_id());

CREATE POLICY "System can manage skill executions" ON public.agent_skill_executions
  FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_agent_skill_bindings_tenant_enabled ON public.agent_skill_bindings(tenant_id, enabled);
CREATE INDEX idx_agent_skill_executions_tenant_skill ON public.agent_skill_executions(tenant_id, skill_code);
CREATE INDEX idx_agent_skill_executions_status ON public.agent_skill_executions(status, started_at);

-- Seed initial skills
INSERT INTO public.agent_skills (code, name, description, category, execution_type, default_config) VALUES
('cci_change_plan', 'CCI Culture Change Plan', 'Automatically suggests culture change initiatives based on CCI survey results', 'culture_intelligence', 'triggered', '{"threshold": 0.7, "auto_approve": false}'),
('compliance_nitaqat_watch', 'Nitaqat Compliance Monitor', 'Monitors Saudization ratios and alerts before compliance issues', 'compliance', 'scheduled', '{"check_frequency": "daily", "alert_threshold": 5}'),
('work_permit_watch', 'Work Permit Expiry Watch', 'Tracks work permit and visa expiries for proactive renewal', 'compliance', 'scheduled', '{"alert_days": [90, 60, 30, 7], "auto_renew": false}'),
('docs_ingest_ocr', 'Document OCR Processing', 'Automatically processes uploaded documents with OCR and extracts key data', 'document_processing', 'triggered', '{"confidence_threshold": 0.8, "languages": ["ar", "en"]}'),
('pulse_survey_send', 'Pulse Survey Automation', 'Sends periodic pulse surveys to employees and analyzes responses', 'engagement', 'scheduled', '{"frequency": "monthly", "reminder_days": [7, 3, 1]}');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_skills_updated_at
  BEFORE UPDATE ON public.agent_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_skill_bindings_updated_at
  BEFORE UPDATE ON public.agent_skill_bindings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();