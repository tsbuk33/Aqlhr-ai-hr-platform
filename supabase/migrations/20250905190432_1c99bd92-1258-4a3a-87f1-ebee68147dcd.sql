-- Check if automation_metrics table exists, create only if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'automation_metrics') THEN
        -- Create automation metrics tracking table
        CREATE TABLE public.automation_metrics (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          tenant_id UUID NOT NULL,
          command_type TEXT NOT NULL,
          action TEXT NOT NULL,
          success BOOLEAN NOT NULL DEFAULT false,
          automation_score INTEGER NOT NULL DEFAULT 0,
          tasks_completed TEXT[] NOT NULL DEFAULT '{}',
          execution_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          complexity TEXT NOT NULL DEFAULT 'simple' CHECK (complexity IN ('simple', 'medium', 'complex')),
          autonomy_level INTEGER NOT NULL DEFAULT 0 CHECK (autonomy_level >= 0 AND autonomy_level <= 100),
          user_id UUID,
          module TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        -- Enable RLS on automation_metrics
        ALTER TABLE public.automation_metrics ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for automation_metrics
        CREATE POLICY "Users can view their company's automation metrics" 
        ON public.automation_metrics 
        FOR SELECT 
        USING (tenant_id = get_user_company_id());

        CREATE POLICY "System can insert automation metrics" 
        ON public.automation_metrics 
        FOR INSERT 
        WITH CHECK (true); -- Allow system inserts from edge functions

        -- Create index for performance
        CREATE INDEX idx_automation_metrics_tenant_time 
        ON public.automation_metrics(tenant_id, execution_time DESC);

        CREATE INDEX idx_automation_metrics_success 
        ON public.automation_metrics(tenant_id, success, execution_time DESC);
    END IF;
END
$$;

-- Create function to get automation metrics overview (replace if exists)
CREATE OR REPLACE FUNCTION public.get_automation_metrics_v1(p_tenant_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  total_commands INTEGER,
  successful_commands INTEGER,
  automation_rate NUMERIC,
  avg_automation_score NUMERIC,
  top_automated_actions TEXT[],
  daily_metrics JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH metrics AS (
    SELECT 
      COUNT(*)::INTEGER as total,
      COUNT(*) FILTER (WHERE success = true)::INTEGER as successful,
      AVG(automation_score) as avg_score,
      array_agg(DISTINCT action ORDER BY action) FILTER (WHERE success = true) as actions
    FROM public.automation_metrics 
    WHERE tenant_id = p_tenant_id 
      AND execution_time >= (now() - (p_days || ' days')::INTERVAL)
  ),
  daily_data AS (
    SELECT jsonb_object_agg(
      date_trunc('day', execution_time)::DATE,
      jsonb_build_object(
        'total', COUNT(*),
        'successful', COUNT(*) FILTER (WHERE success = true),
        'avg_score', AVG(automation_score)
      )
    ) as daily_json
    FROM public.automation_metrics 
    WHERE tenant_id = p_tenant_id 
      AND execution_time >= (now() - (p_days || ' days')::INTERVAL)
    GROUP BY date_trunc('day', execution_time)
  )
  SELECT 
    COALESCE(m.total, 0),
    COALESCE(m.successful, 0),
    CASE WHEN COALESCE(m.total, 0) > 0 THEN ROUND((COALESCE(m.successful, 0)::NUMERIC / m.total::NUMERIC) * 100, 2) ELSE 0 END,
    COALESCE(ROUND(m.avg_score, 2), 0),
    COALESCE(m.actions[1:5], '{}'), -- Top 5 actions
    COALESCE(d.daily_json, '{}')
  FROM metrics m
  CROSS JOIN daily_data d;
END;
$$;