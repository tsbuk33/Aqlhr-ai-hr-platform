import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveTenantId } from '@/lib/useTenant';

interface TimeSeriesData {
  snap_date: string;
  total_employees: number;
  saudization_rate: number;
  hse_safety_score: number;
  compliance_score: number;
  employee_experience_10: number;
  predictive_risk_high: number;
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

export function useDashboardTrends() {
  const [data, setData] = useState<TrendsData>({
    series: [],
    alerts: [],
    loading: true,
    error: null
  });

  const fetchTrendsData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) throw new Error('No tenant available');

      // Fetch time series data (last 30 days)
      const { data: seriesData, error: seriesError } = await supabase
        .rpc('dashboard_get_series_v1', { 
          p_tenant: tenantId,
          days: 30 
        });

      if (seriesError) throw seriesError;

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .rpc('dashboard_rules_v1', { p_tenant: tenantId });

      if (alertsError) throw alertsError;

      setData({
        series: seriesData || [],
        alerts: (alertsData || []).map((alert: any) => ({
          ...alert,
          severity: alert.severity as 'High' | 'Medium' | 'Low'
        })),
        loading: false,
        error: null
      });

    } catch (err: any) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to load trends data'
      }));
    }
  };

  const backfillHistoricalData = async (days = 365) => {
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) throw new Error('No tenant available');

      await supabase.rpc('dashboard_backfill_v1', {
        p_tenant: tenantId,
        days
      });

      // Refresh data after backfill
      await fetchTrendsData();
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to backfill historical data');
    }
  };

  const getMoMChange = (metric: keyof TimeSeriesData) => {
    if (data.series.length < 2) return null;
    
    const latest = data.series[data.series.length - 1];
    const previous = data.series[data.series.length - 2];
    
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
    return data.series.map(item => ({
      date: item.snap_date,
      value: Number(item[metric] || 0)
    }));
  };

  useEffect(() => {
    fetchTrendsData();
  }, []);

  return {
    ...data,
    refetch: fetchTrendsData,
    backfillHistoricalData,
    getMoMChange,
    getSparklineData
  };
}