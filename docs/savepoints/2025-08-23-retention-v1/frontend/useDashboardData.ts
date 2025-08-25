// useDashboardData.ts Hook Snapshot
// Date: 2025-08-23  
// Dashboard data management with tenant resolution and fallback logic

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

interface DashboardData {
  totalEmployees: number;
  saudizationRate: number;
  hseSafetyScore: number;
  docsProcessed: number;
  trainingHours: number;
  complianceScore: number;
  employeeExperience: number;
  predictiveRisk: number;
}

export interface DashboardSeriesItem {
  d: string;
  total_employees: number;
  saudization_rate: number;
  hse_safety_score: number;
  docs_processed: number;
  training_hours: number;
  compliance_score: number;
  employee_experience_10: number;
  predictive_risk_high: number;
}

export interface DashboardAlertItem {
  severity: string;
  metric: string;
  message_en: string;
  message_ar: string;
  current_value: number;
  delta_30: number | null;
  recommendation_en: string;
  recommendation_ar: string;
}

interface IntegrationStatusRow {
  integration_group: string;
  connected: number;
  total: number;
}

export function useDashboardData() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [series, setSeries] = useState<DashboardSeriesItem[]>([]);
  const [alerts, setAlerts] = useState<DashboardAlertItem[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve tenant using dev-aware helper to avoid mismatches
  useEffect(() => {
    let mounted = true;
    (async () => {
      setTenantLoading(true);
      try {
        const id = await getTenantIdOrDemo();
        if (mounted) setTenantId(id);
        const { data: userRes } = await supabase.auth.getUser();
        if (mounted) setIsDemoMode(!userRes?.user);
      } catch {
        // no-op
      } finally {
        if (mounted) setTenantLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const logUIEvent = async (level: 'info' | 'warn' | 'error', message: string, details?: any) => {
    if (!tenantId) return;
    try {
      const { data: userRes } = await supabase.auth.getUser();
      await supabase.from('ui_events').insert({
        tenant_id: tenantId,
        page: '/dashboard',
        level,
        message,
        details,
        user_id: userRes?.user?.id || null,
      });
    } catch (e) {
      console.warn('Failed to log UI event', e);
    }
  };

  const fetchDashboardData = async () => {
    if (!tenantId || tenantLoading) return;

    try {
      setLoading(true);
      setError(null);

      // Current snapshot
      const { data: snapshot, error: snapErr } = await supabase
        .rpc('dashboard_get_v1', { p_tenant: tenantId });
      if (snapErr) throw snapErr;

      const latest = Array.isArray(snapshot) ? snapshot[0] : snapshot;

      // Prepare initial mapped data from snapshot (may be empty/zero)
      let mapped: DashboardData = latest ? {
        totalEmployees: latest.total_employees || 0,
        saudizationRate: latest.saudization_rate || 0,
        hseSafetyScore: latest.hse_safety_score || 0,
        docsProcessed: latest.docs_processed || 0,
        trainingHours: latest.training_hours || 0,
        complianceScore: latest.compliance_score || 0,
        employeeExperience: latest.employee_experience_10 || 0,
        predictiveRisk: latest.predictive_risk_high || 0,
      } : {
        totalEmployees: 0,
        saudizationRate: 0,
        hseSafetyScore: 0,
        docsProcessed: 0,
        trainingHours: 0,
        complianceScore: 0,
        employeeExperience: 0,
        predictiveRisk: 0,
      };

      // Fallback: if snapshot says 0 employees, fetch headcount directly via a secure RPC
      if ((mapped.totalEmployees ?? 0) === 0) {
        console.log('[Dashboard] Snapshot total is 0 — attempting headcount fallback via ask_headcount_v1');
        const { data: headcountData, error: hcErr } = await supabase.rpc('ask_headcount_v1', { p_tenant: tenantId });
        if (!hcErr && headcountData) {
          const row = Array.isArray(headcountData) ? headcountData[0] : headcountData;
          const fallbackTotal = Number(row?.total ?? 0);
          if (fallbackTotal > 0) {
            const fallbackSaudization = Number(row?.saudization_rate ?? 0);
            const updated: DashboardData = { ...mapped, totalEmployees: fallbackTotal };
            if ((mapped.saudizationRate ?? 0) === 0 && fallbackSaudization > 0) {
              updated.saudizationRate = fallbackSaudization;
            }
            mapped = updated;
            await logUIEvent('info', 'Dashboard headcount fallback used', { fallbackTotal, fallbackSaudization });
            console.log('[Dashboard] Headcount fallback succeeded:', fallbackTotal, 'Saudization:', fallbackSaudization);
          } else {
            console.log('[Dashboard] Headcount fallback returned 0');
          }
        } else {
          console.warn('[Dashboard] Headcount fallback failed', hcErr);
          await logUIEvent('warn', 'Headcount fallback failed', { error: hcErr?.message });
        }
      }

      setData(mapped);

      // Series
      const { data: seriesData, error: seriesErr } = await supabase
        .rpc('dashboard_get_series_v1', { p_tenant: tenantId, p_days: 365 });
      if (seriesErr) throw seriesErr;
      setSeries(seriesData || []);

      // Alerts
      const { data: alertsData, error: alertsErr } = await supabase
        .rpc('dashboard_alerts_v1', { p_tenant: tenantId });
      if (alertsErr) throw alertsErr;
      setAlerts(alertsData || []);

      // Integrations banner
      const { data: integData, error: integErr } = await supabase
        .rpc('integrations_overview_v2', { p_tenant: tenantId });
      if (integErr) throw integErr;
      setIntegrations(integData || []);

    } catch (e: any) {
      const msg = e?.message || 'Failed to load dashboard data';
      setError(msg);
      await logUIEvent('error', msg, { error: e?.toString?.() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, tenantLoading]);

  const getMoMChange = (current: number, s: DashboardSeriesItem[], field: keyof DashboardSeriesItem): number | null => {
    if (!s || s.length < 30) return null;
    const prevIdx = Math.max(0, s.length - 30);
    const prev = s[prevIdx]?.[field];
    if (typeof prev === 'number' && prev !== 0) {
      return ((current - prev) / prev) * 100;
    }
    return null;
  };

  const getSparklineData = (field: keyof DashboardSeriesItem) => {
    return series.map((row) => ({ date: row.d, value: Number(row[field] || 0) }));
  };

  const createTaskFromAlert = async (alert: DashboardAlertItem) => {
    if (!tenantId) return null;
    const priority = alert.severity === 'high' ? 'urgent' : alert.severity === 'medium' ? 'high' : 'medium';
    const { data: taskId, error } = await supabase.rpc('task_create_v1', {
      p_tenant_id: tenantId,
      p_module: 'dashboard',
      p_title: `Alert: ${alert.message_en}`,
      p_description: `${alert.recommendation_en}\n\nCurrent Value: ${alert.current_value}\n30-Day Change: ${alert.delta_30}`,
      p_priority: priority,
      p_metadata: {
        alert_metric: alert.metric,
        alert_severity: alert.severity,
        created_from_dashboard: true,
      },
    });
    if (error) throw error;
    return taskId;
  };

  const systemsOperational = integrations.length > 0 && integrations.every(i => i.connected === i.total && i.total > 0);

  return {
    data,
    series,
    alerts,
    integrations,
    loading: loading || tenantLoading,
    error,
    isDemoMode,
    systemsOperational,
    getMoMChange,
    getSparklineData,
    createTaskFromAlert,
    refetch: fetchDashboardData,
  };
}