-- Create system engineer tables for auto-discovery and monitoring
CREATE TABLE public.system_modules_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  module_path TEXT NOT NULL,
  module_category TEXT NOT NULL,
  discovery_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_health_check TIMESTAMP WITH TIME ZONE,
  health_status TEXT DEFAULT 'unknown',
  performance_score NUMERIC DEFAULT 0,
  security_score NUMERIC DEFAULT 0,
  compliance_score NUMERIC DEFAULT 0,
  auto_discovered BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.system_diagnostics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  module_id UUID REFERENCES public.system_modules_registry(id),
  diagnostic_type TEXT NOT NULL,
  severity_level TEXT NOT NULL DEFAULT 'info',
  issue_description TEXT NOT NULL,
  issue_description_ar TEXT,
  recommended_action TEXT,
  recommended_action_ar TEXT,
  ai_confidence_score NUMERIC DEFAULT 0,
  auto_fixable BOOLEAN DEFAULT false,
  fix_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.system_health_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  report_type TEXT NOT NULL DEFAULT 'comprehensive',
  overall_health_score NUMERIC NOT NULL DEFAULT 0,
  module_scores JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '{}',
  recommendations_ar JSONB NOT NULL DEFAULT '{}',
  critical_issues_count INTEGER DEFAULT 0,
  optimization_opportunities_count INTEGER DEFAULT 0,
  security_alerts_count INTEGER DEFAULT 0,
  compliance_status TEXT DEFAULT 'unknown',
  next_scheduled_check TIMESTAMP WITH TIME ZONE,
  generated_by TEXT DEFAULT 'system_engineer_ai',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.system_adaptive_learning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_category TEXT NOT NULL,
  pattern_detected TEXT NOT NULL,
  pattern_frequency INTEGER DEFAULT 1,
  improvement_suggestion TEXT,
  improvement_suggestion_ar TEXT,
  implementation_status TEXT DEFAULT 'pending',
  success_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_applied TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.system_modules_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_adaptive_learning ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage system modules registry" 
ON public.system_modules_registry 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view system diagnostics from their company" 
ON public.system_diagnostics 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view system health reports from their company" 
ON public.system_health_reports 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage adaptive learning" 
ON public.system_adaptive_learning 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_system_modules_category ON public.system_modules_registry(module_category);
CREATE INDEX idx_system_modules_health ON public.system_modules_registry(health_status, last_health_check);
CREATE INDEX idx_system_diagnostics_company ON public.system_diagnostics(company_id, created_at);
CREATE INDEX idx_system_diagnostics_severity ON public.system_diagnostics(severity_level, created_at);
CREATE INDEX idx_system_health_reports_company ON public.system_health_reports(company_id, created_at);
CREATE INDEX idx_adaptive_learning_category ON public.system_adaptive_learning(learning_category, created_at);

-- Create function for automatic module discovery
CREATE OR REPLACE FUNCTION public.register_discovered_module(
  p_module_name TEXT,
  p_module_path TEXT,
  p_module_category TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Insert or update module
  INSERT INTO public.system_modules_registry (
    module_name,
    module_path,
    module_category,
    metadata,
    auto_discovered
  ) VALUES (
    p_module_name,
    p_module_path,
    p_module_category,
    p_metadata,
    true
  )
  ON CONFLICT (module_name, module_path) 
  DO UPDATE SET
    module_category = EXCLUDED.module_category,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING id INTO v_module_id;
  
  RETURN v_module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_system_modules_registry_updated_at
  BEFORE UPDATE ON public.system_modules_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_adaptive_learning_updated_at
  BEFORE UPDATE ON public.system_adaptive_learning
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();