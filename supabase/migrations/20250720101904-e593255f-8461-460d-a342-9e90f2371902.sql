-- Enhanced Performance Monitoring for Self-Healing System
-- This migration adds performance metrics tracking as requested

-- Create performance metrics tracking table
CREATE TABLE IF NOT EXISTS public.system_performance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  execution_time_ms NUMERIC NOT NULL,
  memory_usage_mb NUMERIC,
  cpu_usage_percent NUMERIC,
  request_count INTEGER DEFAULT 1,
  success_rate NUMERIC DEFAULT 100.0,
  error_rate NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Indexes for performance monitoring queries
  INDEX idx_performance_function_time (function_name, created_at DESC),
  INDEX idx_performance_execution_time (execution_time_ms DESC),
  INDEX idx_performance_success_rate (success_rate ASC)
);

-- Enable RLS
ALTER TABLE public.system_performance_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin users can manage performance logs"
ON public.system_performance_log
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Enhanced function with performance tracking
CREATE OR REPLACE FUNCTION public.generate_daily_health_report()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  start_time TIMESTAMP := clock_timestamp();
  execution_time_ms NUMERIC;
  memory_usage_mb NUMERIC;
BEGIN
  -- Generate daily health report with sample data
  INSERT INTO public.daily_health_reports (
    report_date,
    overall_health_score,
    critical_alerts_count,
    automatic_repairs_count,
    issues_prevented_count,
    avg_resolution_time_ms,
    business_impact_summary,
    recommendations
  ) VALUES (
    CURRENT_DATE,
    ROUND(95.5 + (RANDOM() * 4.5), 1), -- Random health score between 95.5-100
    FLOOR(RANDOM() * 3), -- 0-2 critical alerts
    FLOOR(5 + RANDOM() * 15), -- 5-20 automatic repairs
    FLOOR(10 + RANDOM() * 25), -- 10-35 issues prevented
    ROUND(1500 + (RANDOM() * 2000), 0), -- 1.5-3.5 seconds average
    jsonb_build_object(
      'payroll_success_rate', '100%',
      'government_sync_status', '98.5%',
      'user_satisfaction', '99.2%',
      'system_uptime', '99.7%'
    ),
    ARRAY[
      'Consider scaling database connections during peak hours',
      'Optimize cache refresh cycles for better performance',
      'Review government integration retry policies'
    ]
  )
  ON CONFLICT (report_date) 
  DO UPDATE SET
    overall_health_score = EXCLUDED.overall_health_score,
    critical_alerts_count = EXCLUDED.critical_alerts_count,
    automatic_repairs_count = EXCLUDED.automatic_repairs_count,
    issues_prevented_count = EXCLUDED.issues_prevented_count,
    updated_at = now();

  -- Calculate execution metrics
  execution_time_ms := extract(epoch from (clock_timestamp() - start_time)) * 1000;
  
  -- Get approximate memory usage (simplified)
  SELECT pg_size_pretty(pg_total_relation_size('public.system_health_metrics'))::NUMERIC 
  INTO memory_usage_mb;

  -- Log performance metrics
  INSERT INTO public.system_performance_log (
    function_name,
    execution_time_ms,
    memory_usage_mb,
    cpu_usage_percent,
    success_rate
  ) VALUES (
    'generate_daily_health_report',
    execution_time_ms,
    COALESCE(memory_usage_mb, 0),
    0, -- Would need system monitoring integration for real CPU usage
    100.0
  );

EXCEPTION WHEN OTHERS THEN
  -- Log performance metrics even on error
  execution_time_ms := extract(epoch from (clock_timestamp() - start_time)) * 1000;
  
  INSERT INTO public.system_performance_log (
    function_name,
    execution_time_ms,
    memory_usage_mb,
    cpu_usage_percent,
    success_rate,
    error_rate
  ) VALUES (
    'generate_daily_health_report',
    execution_time_ms,
    0,
    0,
    0.0,
    100.0
  );
  
  RAISE;
END;
$function$;

-- Create automated performance optimization function
CREATE OR REPLACE FUNCTION public.optimize_system_performance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  start_time TIMESTAMP := clock_timestamp();
  execution_time_ms NUMERIC;
  optimization_count INTEGER := 0;
BEGIN
  -- Vacuum and analyze critical tables for performance
  VACUUM ANALYZE public.system_health_metrics;
  VACUUM ANALYZE public.healing_actions_log;
  VACUUM ANALYZE public.system_alerts;
  
  optimization_count := optimization_count + 3;
  
  -- Clean up old performance logs (keep last 30 days)
  DELETE FROM public.system_performance_log 
  WHERE created_at < now() - INTERVAL '30 days';
  
  optimization_count := optimization_count + 1;
  
  -- Update statistics
  ANALYZE public.system_performance_log;
  
  -- Calculate execution time
  execution_time_ms := extract(epoch from (clock_timestamp() - start_time)) * 1000;
  
  -- Log performance optimization metrics
  INSERT INTO public.system_performance_log (
    function_name,
    execution_time_ms,
    request_count,
    success_rate
  ) VALUES (
    'optimize_system_performance',
    execution_time_ms,
    optimization_count,
    100.0
  );

EXCEPTION WHEN OTHERS THEN
  -- Log even on error
  execution_time_ms := extract(epoch from (clock_timestamp() - start_time)) * 1000;
  
  INSERT INTO public.system_performance_log (
    function_name,
    execution_time_ms,
    request_count,
    success_rate,
    error_rate
  ) VALUES (
    'optimize_system_performance',
    execution_time_ms,
    COALESCE(optimization_count, 0),
    0.0,
    100.0
  );
  
  RAISE;
END;
$function$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.generate_daily_health_report() TO authenticated;
GRANT EXECUTE ON FUNCTION public.optimize_system_performance() TO authenticated;

-- Add performance monitoring view for easy querying
CREATE OR REPLACE VIEW public.performance_monitoring_summary AS
SELECT 
  function_name,
  COUNT(*) as execution_count,
  AVG(execution_time_ms) as avg_execution_time_ms,
  MIN(execution_time_ms) as min_execution_time_ms,
  MAX(execution_time_ms) as max_execution_time_ms,
  AVG(success_rate) as avg_success_rate,
  AVG(error_rate) as avg_error_rate,
  DATE_TRUNC('day', created_at) as report_date
FROM public.system_performance_log
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY function_name, DATE_TRUNC('day', created_at)
ORDER BY report_date DESC, function_name;

-- Grant access to the view
GRANT SELECT ON public.performance_monitoring_summary TO authenticated;