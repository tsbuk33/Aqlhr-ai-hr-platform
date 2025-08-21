import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveDashboardData {
  snap_date: string;
  total_employees: number;
  saudization_rate: number;
  hse_safety_score: number;
  active_users: number;
  docs_processed: number;
  training_hours: number;
  compliance_score: number;
  talent_pipeline_strength: number;
  predictive_risk_high: number;
  employee_experience_10: number;
  workforce_forecast_accuracy: number;
}

export function useLiveDashboard() {
  const [data, setData] = useState<LiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user's tenant/company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call the dashboard RPC function  
      const { data: dashboardData, error: rpcError } = await supabase
        .from('kpi_snapshots')
        .select('*')
        .eq('company_id', user.id)
        .order('snap_date', { ascending: false })
        .limit(1);

      if (rpcError) {
        throw rpcError;
      }

      if (dashboardData && dashboardData.length > 0) {
        setData(dashboardData[0]);
      } else {
        // No data available, set defaults
        setData({
          snap_date: new Date().toISOString().split('T')[0],
          total_employees: 0,
          saudization_rate: 0,
          hse_safety_score: 0,
          active_users: 0,
          docs_processed: 0,
          training_hours: 0,
          compliance_score: 0,
          talent_pipeline_strength: 0,
          predictive_risk_high: 0,
          employee_experience_10: 0,
          workforce_forecast_accuracy: 0
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const computeKPIs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For demo, just refresh the data - KPI computation would be done server-side
      // In a real implementation, this would call a server-side function
      // const { error: computeError } = await supabase.rpc('compute_dashboard_kpis', { company_id: user.id });
      
      // if (computeError) throw computeError;
      
      // Refresh data after computation
      await fetchDashboardData();
      
      return { success: true };
    } catch (err) {
      console.error('Error computing KPIs:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    computeKPIs
  };
}