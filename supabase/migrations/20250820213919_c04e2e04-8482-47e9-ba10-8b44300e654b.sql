-- Add wave_id to cci_playbooks if it doesn't exist
ALTER TABLE public.cci_playbooks 
ADD COLUMN IF NOT EXISTS wave_id uuid;

-- Add other missing columns
ALTER TABLE public.cci_playbooks 
ADD COLUMN IF NOT EXISTS title text DEFAULT 'Change Plan',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS schedule jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS comms_en text,
ADD COLUMN IF NOT EXISTS comms_ar text,
ADD COLUMN IF NOT EXISTS manager_brief text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create agent_actions table
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  action_type text NOT NULL,
  input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  execution_time_ms integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS on agent_actions
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for agent_actions
CREATE POLICY IF NOT EXISTS "agent_actions_tenant_access" ON public.agent_actions
  FOR ALL USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cci_playbooks_tenant_survey_wave 
  ON public.cci_playbooks(tenant_id, survey_id, wave_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_tenant_type 
  ON public.agent_actions(tenant_id, action_type);