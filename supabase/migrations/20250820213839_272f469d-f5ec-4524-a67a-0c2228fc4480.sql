-- Create cci_playbooks table (skip if exists)
DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS public.cci_playbooks (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      tenant_id uuid NOT NULL,
      survey_id uuid NOT NULL,
      wave_id uuid NOT NULL,
      title text NOT NULL,
      description text,
      status text NOT NULL DEFAULT 'draft',
      initiatives jsonb NOT NULL DEFAULT '[]'::jsonb,
      schedule jsonb NOT NULL DEFAULT '{}'::jsonb,
      ai_summary text,
      comms_en text,
      comms_ar text,
      manager_brief text,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      created_by uuid
    );
EXCEPTION WHEN duplicate_table THEN
    -- Table already exists, skip
END $$;

-- Create agent_actions table (skip if exists)
DO $$ BEGIN
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
EXCEPTION WHEN duplicate_table THEN
    -- Table already exists, skip
END $$;

-- Enable RLS only if not already enabled
DO $$ BEGIN
    ALTER TABLE public.cci_playbooks ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN
    -- RLS already enabled or other issue, skip
END $$;

DO $$ BEGIN
    ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN
    -- RLS already enabled or other issue, skip
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_cci_playbooks_tenant_survey_wave 
  ON public.cci_playbooks(tenant_id, survey_id, wave_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_tenant_type 
  ON public.agent_actions(tenant_id, action_type);