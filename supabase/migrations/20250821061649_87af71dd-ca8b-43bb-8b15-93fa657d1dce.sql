-- Create agent_actions table for logging Ask Aql interactions
CREATE TABLE public.agent_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  tool_name TEXT,
  prompt TEXT NOT NULL,
  tool_payload JSONB,
  response_data JSONB,
  execution_time_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage agent actions from their company"
ON public.agent_actions 
FOR ALL 
USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Add indexes for performance
CREATE INDEX idx_agent_actions_tenant_id ON public.agent_actions(tenant_id);
CREATE INDEX idx_agent_actions_user_id ON public.agent_actions(user_id);
CREATE INDEX idx_agent_actions_created_at ON public.agent_actions(created_at DESC);
CREATE INDEX idx_agent_actions_tool_name ON public.agent_actions(tool_name);

-- Add trigger for updated_at
CREATE TRIGGER update_agent_actions_updated_at
BEFORE UPDATE ON public.agent_actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();