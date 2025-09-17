import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveTenantId } from '@/lib/useTenant';

interface TimeSeriesData {
  d: string;
  total_employees: number;
  saudization_rate: number;
  hse_safety_score: number;
  compliance_score: number;
  employee_experience_10: number;
  predictive_risk_high: number;
  docs_processed: number;
  training_hours: number;
}

interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  metric: string;
  current_value: number;
  threshold_value: number;
  created_at: string;
}

interface TrendsData {
  series: TimeSeriesData[];
  alerts: DashboardAlert[];
  loading: boolean;
  error: string | null;
}

interface ActionableAlert extends DashboardAlert {
  canCreateTask: boolean;
  taskTitle?: string;
  taskDescription?: string;
}

export function useDashboardTrends(days = 365) {
  const fetchTrendsData = async () => {
    const { tenantId } = await resolveTenantId(supabase);
    if (!tenantId) throw new Error('No tenant available');

    // Fetch time series data
    const { data: seriesData, error: seriesError } = await supabase
      .rpc('dashboard_get_series_v1' as any, { 
        p_tenant: tenantId,
        p_days: days 
      });

    if (seriesError) throw seriesError;
    return seriesData || [];
  };

  const { data: series = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dashboard-trends', days],
    queryFn: fetchTrendsData,
    staleTime: 60_000, // 1 minute
    gcTime: 5 * 60_000, // 5 minutes
  });

  const createTaskFromAlert = async (alert: DashboardAlert, assignedTo?: string) => {
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) throw new Error('No tenant available');

      const taskTitle = `Alert: ${alert.title}`;
      const taskDescription = `${alert.message}\n\nCurrent Value: ${alert.current_value}\nThreshold: ${alert.threshold_value}\nMetric: ${alert.metric}\nSeverity: ${alert.severity}`;

      const { data: taskId, error } = await supabase.rpc('task_create_v1' as any, {
        p_tenant_id: tenantId,
        p_module: 'dashboard',
        p_title: taskTitle,
        p_description: taskDescription,
        p_priority: alert.severity === 'High' ? 'urgent' : alert.severity === 'Medium' ? 'high' : 'medium',
        p_metadata: {
          alert_id: alert.id,
          metric: alert.metric,
          severity: alert.severity,
          created_from_dashboard: true
        }
      });

      if (error) throw error;
      return taskId;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create task from alert');
    }
  };

  const backfillHistoricalData = async (days = 365) => {
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) throw new Error('No tenant available');

      await supabase.rpc('dashboard_backfill_v1' as any, {
        p_tenant: tenantId,
        p_days: days
      });

      // Refresh data after backfill
      await refetch();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to backfill historical data');
    }
  };

  const getMoMChange = (metric: keyof TimeSeriesData) => {
    if (!Array.isArray(series) || series.length < 2) return null;
    
    const latest = series[series.length - 1];
    const previous = series[series.length - 2];
    
    if (!latest || !previous || typeof latest[metric] !== 'number' || typeof previous[metric] !== 'number') {
      return null;
    }

    const change = ((latest[metric] as number) - (previous[metric] as number)) / (previous[metric] as number) * 100;
    return {
      value: change,
      isPositive: change >= 0,
      formatted: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    };
  };

  const getSparklineData = (metric: keyof TimeSeriesData) => {
    return Array.isArray(series) ? series.map(item => ({
      date: item.d,
      value: Number(item[metric] || 0)
    })) : [];
  };

  return {
    series,
    loading,
    error: error?.message || null,
    refetch,
    backfillHistoricalData,
    getMoMChange,
    getSparklineData,
    createTaskFromAlert
  };
}