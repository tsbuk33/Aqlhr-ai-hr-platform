import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveTenantId } from '@/lib/useTenant';

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
  const [empty, setEmpty] = useState(false);
  const [mode, setMode] = useState<'auth' | 'demo' | 'impersonated' | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [systemsOperational, setSystemsOperational] = useState<{ connected: number; total: number } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setEmpty(false);

    try {
      const { tenantId: resolvedTenantId, mode: resolvedMode } = await resolveTenantId(supabase);
      setMode(resolvedMode);
      setTenantId(resolvedTenantId);

      const { data: snap, error: e1 } = await supabase.rpc('dashboard_get_v1', { p_tenant: resolvedTenantId });
      if (e1) throw e1;

      const { data: integ, error: e2 } = await supabase.rpc('integrations_status_v1', { p_tenant: resolvedTenantId });
      if (e2) throw e2;

      // Handle array responses from RPCs
      const dashboardSnapshot = Array.isArray(snap) ? snap[0] : snap;
      const integrationsStatus = Array.isArray(integ) ? integ[0] : integ;

      if (dashboardSnapshot) {
        setData({
          snap_date: dashboardSnapshot.snap_date,
          total_employees: dashboardSnapshot.total_employees || 0,
          saudization_rate: dashboardSnapshot.saudization_rate || 0,
          hse_safety_score: dashboardSnapshot.hse_safety_score || 0,
          active_users: dashboardSnapshot.active_users || 0,
          docs_processed: dashboardSnapshot.docs_processed || 0,
          training_hours: dashboardSnapshot.training_hours || 0,
          compliance_score: dashboardSnapshot.compliance_score || 0,
          talent_pipeline_strength: dashboardSnapshot.talent_pipeline_strength || 0,
          predictive_risk_high: dashboardSnapshot.predictive_risk_high || 0,
          employee_experience_10: dashboardSnapshot.employee_experience_10 || 0,
          workforce_forecast_accuracy: dashboardSnapshot.workforce_forecast_accuracy || 0
        });
      } else {
        setData(getDefaultDashboardData());
      }

      setSystemsOperational({
        connected: Number(integrationsStatus?.connected || 0),
        total: Number(integrationsStatus?.total || 0)
      });

    } catch (err: any) {
      if (err.message === 'NO_TENANT_AVAILABLE') {
        setEmpty(true);
      } else {
        setError(err.message || 'Error loading dashboard');
        // Set fallback data on error to prevent crashes
        setData(getDefaultDashboardData());
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDashboardData = (): LiveDashboardData => ({
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

  const computeKPIs = async () => {
    try {
      // In demo mode or authenticated mode, just refresh the data
      // KPI computation would be done server-side in a real implementation
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
    empty,
    demoMode: mode === 'demo',
    isImpersonated: mode === 'impersonated', 
    systemsOperational,
    tenantId,
    mode,
    refetch: fetchDashboardData,
    computeKPIs
  };
}