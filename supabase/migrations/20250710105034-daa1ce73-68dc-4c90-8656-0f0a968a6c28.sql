-- Create table for tool integrations configuration
CREATE TABLE public.tool_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  tool_name TEXT NOT NULL,
  tool_category TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  api_credentials JSONB DEFAULT '{}',
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, tool_name)
);

-- Enable RLS
ALTER TABLE public.tool_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their company tool integrations" 
ON public.tool_integrations 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create table for tool usage analytics
CREATE TABLE public.tool_usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  tool_name TEXT NOT NULL,
  user_id UUID,
  action_type TEXT NOT NULL, -- 'sync', 'config', 'usage', 'error'
  metadata JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tool_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tool analytics from their company" 
ON public.tool_usage_analytics 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create table for AI-tool recommendations
CREATE TABLE public.ai_tool_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  recommended_tool TEXT NOT NULL,
  tool_category TEXT NOT NULL,
  confidence_score NUMERIC(3,2),
  reasoning TEXT NOT NULL,
  expected_benefits JSONB DEFAULT '[]',
  implementation_complexity TEXT DEFAULT 'medium',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS
ALTER TABLE public.ai_tool_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view AI tool recommendations from their company" 
ON public.ai_tool_recommendations 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert default tool configurations for all companies
INSERT INTO public.tool_integrations (company_id, tool_name, tool_category, is_enabled)
SELECT 
  c.id as company_id,
  tool_data.tool_name,
  tool_data.tool_category,
  false as is_enabled
FROM public.companies c
CROSS JOIN (
  VALUES 
    -- Communication & Collaboration
    ('Microsoft Teams', 'communication_collaboration'),
    ('Slack', 'communication_collaboration'),
    ('WhatsApp Business', 'communication_collaboration'),
    ('Outlook Integration', 'communication_collaboration'),
    ('Gmail Integration', 'communication_collaboration'),
    
    -- Document Management
    ('SharePoint', 'document_management'),
    ('Google Drive', 'document_management'),
    ('OneDrive', 'document_management'),
    ('Dropbox', 'document_management'),
    ('DocuSign', 'document_management'),
    ('Adobe Sign', 'document_management'),
    
    -- Calendar & Scheduling
    ('Google Calendar', 'calendar_scheduling'),
    ('Outlook Calendar', 'calendar_scheduling'),
    ('Calendly', 'calendar_scheduling'),
    ('Room Booking', 'calendar_scheduling'),
    
    -- Analytics & BI
    ('Power BI', 'analytics_bi'),
    ('Tableau', 'analytics_bi'),
    ('Google Analytics', 'analytics_bi'),
    ('Custom Connectors', 'analytics_bi'),
    
    -- Learning & Development
    ('LinkedIn Learning', 'learning_development'),
    ('Coursera Business', 'learning_development'),
    ('Udemy Business', 'learning_development'),
    ('Local Training Platforms', 'learning_development'),
    
    -- Automation Platforms
    ('Zapier', 'automation_platforms'),
    ('Power Automate', 'automation_platforms'),
    ('Custom Workflows', 'automation_platforms')
) AS tool_data(tool_name, tool_category)
ON CONFLICT (company_id, tool_name) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_tool_integrations_updated_at
BEFORE UPDATE ON public.tool_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to sync tool integrations with AI system
CREATE OR REPLACE FUNCTION public.sync_tool_integration(
  p_company_id UUID,
  p_tool_name TEXT,
  p_action TEXT DEFAULT 'enable'
) RETURNS VOID AS $$
BEGIN
  -- Insert sync event for AI processing
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload
  ) VALUES (
    p_company_id,
    'tool_integration_' || p_action,
    'tool_integrations',
    (SELECT id FROM public.tool_integrations WHERE company_id = p_company_id AND tool_name = p_tool_name),
    ARRAY['ai_engine', 'dashboard', 'analytics', 'workflow_automation'],
    jsonb_build_object(
      'tool_name', p_tool_name,
      'action', p_action,
      'timestamp', now(),
      'integration_context', 'sanadhr_platform'
    )
  );
END;
$$ LANGUAGE plpgsql;