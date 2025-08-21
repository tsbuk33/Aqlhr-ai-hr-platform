-- Create agent_actions table to track all automated actions
CREATE TABLE public.agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'saudization_alert', 'iqama_reminder', 'letter_generated'
  action_description TEXT NOT NULL,
  target_employee_id UUID,
  metadata JSONB DEFAULT '{}',
  task_id UUID, -- Reference to created task
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage agent actions from their company" 
ON public.agent_actions 
FOR ALL 
USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- Add updated_at trigger
CREATE TRIGGER update_agent_actions_updated_at
  BEFORE UPDATE ON public.agent_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_agent_actions_company_id ON public.agent_actions(company_id);
CREATE INDEX idx_agent_actions_type_date ON public.agent_actions(action_type, created_at);
CREATE INDEX idx_agent_actions_target_employee ON public.agent_actions(target_employee_id);