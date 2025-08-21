import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveTenantId } from '@/lib/useTenant';

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

export function useDashboardAlerts() {
  const fetchAlerts = async (): Promise<DashboardAlert[]> => {
    const { tenantId } = await resolveTenantId(supabase);
    if (!tenantId) throw new Error('No tenant available');

    const { data: alertsData, error: alertsError } = await supabase
      .rpc('dashboard_rules_v1', { p_tenant: tenantId });

    if (alertsError) throw alertsError;

    return (alertsData || []).map((alert: any) => ({
      ...alert,
      severity: alert.severity as 'High' | 'Medium' | 'Low'
    }));
  };

  const { data: alerts = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: fetchAlerts,
    staleTime: 60_000, // 1 minute
    gcTime: 5 * 60_000, // 5 minutes
  });

  const createTaskFromAlert = async (alert: DashboardAlert) => {
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) throw new Error('No tenant available');

      const taskTitle = `Alert: ${alert.title}`;
      const taskDescription = `${alert.message}\n\nCurrent Value: ${alert.current_value}\nThreshold: ${alert.threshold_value}\nMetric: ${alert.metric}\nSeverity: ${alert.severity}`;

      const { data: taskId, error } = await supabase.rpc('task_create_v1', {
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

  return {
    alerts,
    loading,
    error: error?.message || null,
    refetch,
    createTaskFromAlert
  };
}