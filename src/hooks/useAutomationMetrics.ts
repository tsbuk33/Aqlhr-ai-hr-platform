import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AutomationMetrics {
  total_commands: number;
  successful_commands: number;
  automation_rate: number;
  avg_automation_score: number;
  top_automated_actions: string[];
  daily_metrics: any;
}

export const useAutomationMetrics = (tenantId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['automation-metrics', tenantId, days],
    queryFn: async (): Promise<AutomationMetrics> => {
      const { data, error } = await supabase.rpc('get_automation_metrics_v1' as any, {
        p_tenant_id: tenantId,
        p_days: days
      });

      if (error) {
        console.error('Error fetching automation metrics:', error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        return {
          total_commands: 0,
          successful_commands: 0,
          automation_rate: 0,
          avg_automation_score: 0,
          top_automated_actions: [],
          daily_metrics: {}
        };
      }

      return data[0];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAutomationHistory = (tenantId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['automation-history', tenantId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_metrics')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('execution_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching automation history:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};