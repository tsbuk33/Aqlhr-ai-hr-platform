-- Create agent_actions table for observability
CREATE TABLE public.agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  action_type TEXT NOT NULL,
  function_name TEXT,
  request_id TEXT,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  status TEXT CHECK (status IN ('pending', 'success', 'error', 'timeout')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rate_limits table for compute runs
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  survey_id UUID,
  wave_id UUID,
  action_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, survey_id, wave_id, action_type, window_start)
);

-- Enable RLS
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for agent_actions
CREATE POLICY "Users can view their company's agent actions"
ON public.agent_actions
FOR SELECT
USING (tenant_id = public.get_user_company_id());

CREATE POLICY "System can insert agent actions"
ON public.agent_actions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update agent actions"
ON public.agent_actions
FOR UPDATE
USING (true);

-- RLS policies for rate_limits
CREATE POLICY "Users can view their company's rate limits"
ON public.rate_limits
FOR SELECT
USING (tenant_id = public.get_user_company_id());

CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_tenant_id UUID,
  p_survey_id UUID,
  p_wave_id UUID,
  p_action_type TEXT,
  p_max_per_minute INTEGER DEFAULT 3
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate current minute window
  v_window_start := date_trunc('minute', now());
  
  -- Get current count for this window
  SELECT COALESCE(SUM(count), 0) INTO v_current_count
  FROM public.rate_limits
  WHERE tenant_id = p_tenant_id
    AND survey_id = p_survey_id
    AND wave_id = p_wave_id
    AND action_type = p_action_type
    AND window_start = v_window_start;
  
  -- Check if limit exceeded
  IF v_current_count >= p_max_per_minute THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  INSERT INTO public.rate_limits (
    tenant_id, survey_id, wave_id, action_type, window_start
  ) VALUES (
    p_tenant_id, p_survey_id, p_wave_id, p_action_type, v_window_start
  )
  ON CONFLICT (tenant_id, survey_id, wave_id, action_type, window_start)
  DO UPDATE SET count = rate_limits.count + 1;
  
  RETURN TRUE;
END;
$$;

-- Function to log agent action
CREATE OR REPLACE FUNCTION public.log_agent_action(
  p_tenant_id UUID,
  p_action_type TEXT,
  p_function_name TEXT DEFAULT NULL,
  p_request_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action_id UUID;
BEGIN
  INSERT INTO public.agent_actions (
    tenant_id, action_type, function_name, request_id, status, metadata
  ) VALUES (
    p_tenant_id, p_action_type, p_function_name, p_request_id, 'pending', p_metadata
  ) RETURNING id INTO v_action_id;
  
  RETURN v_action_id;
END;
$$;

-- Function to complete agent action
CREATE OR REPLACE FUNCTION public.complete_agent_action(
  p_action_id UUID,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.agent_actions
  SET 
    end_time = now(),
    duration_ms = EXTRACT(EPOCH FROM (now() - start_time)) * 1000,
    status = p_status,
    error_message = p_error_message,
    metadata = COALESCE(p_metadata, metadata)
  WHERE id = p_action_id;
END;
$$;

-- Cleanup old rate limits (keep only last hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < now() - INTERVAL '1 hour';
END;
$$;