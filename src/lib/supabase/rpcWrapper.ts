import { supabase } from '@/integrations/supabase/client';

/**
 * Type-safe wrapper for custom RPC functions that aren't in generated types
 */
export async function customRpc<T = any>(
  functionName: string, 
  params?: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  try {
    const { data, error } = await supabase.rpc(functionName as any, params);
    return { data: data as T, error };
  } catch (error) {
    return { data: null, error };
  }
}

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

interface CCIOverviewData {
  balance_score: number | null;
  risk_index: number | null;
  psych_safety: number | null;
  barrett: any;
  cvf: any;
  web: any;
  n: number;
  last_computed_at: string | null;
}

interface AutomationMetrics {
  total_commands: number;
  successful_commands: number;
  automation_rate: number;
  avg_automation_score: number;
  top_automated_actions: string[];
  daily_metrics: any;
}

/**
 * Specific typed RPC calls for common functions
 */
export const typedRpc = {
  // Demo data functions
  devSeedEmployees: (tenantId: string) =>
    customRpc<any>('dev_seed_employees_v1', { p_tenant: tenantId }),
  
  devBackfillKpis: (tenantId: string, days = 365) =>
    customRpc<any>('dev_backfill_kpis_v1', { p_tenant: tenantId, p_days: days }),
  
  devSeedRetention: (tenantId: string) =>
    customRpc<any>('dev_seed_retention_v1', { p_tenant: tenantId }),
  
  devSeedCciQuick: (tenantId: string) =>
    customRpc<any>('dev_seed_cci_quick_v1', { p_tenant: tenantId }),
  
  // Dashboard functions
  dashboardGetSeries: (tenantId: string, days = 365) =>
    customRpc<TimeSeriesData[]>('dashboard_get_series_v1', { p_tenant: tenantId, p_days: days }),
  
  // CCI functions
  cciGetOverview: (tenantId: string, surveyId: string, waveId: string) =>
    customRpc<CCIOverviewData[]>('cci_get_overview_v1', { p_tenant: tenantId, p_survey: surveyId, p_wave: waveId }),
  
  cciComputeScores: (tenantId: string, surveyId: string, waveId: string) =>
    customRpc<any>('cci_compute_scores_v1', { p_tenant: tenantId, p_survey: surveyId, p_wave: waveId }),
  
  // Automation functions
  getAutomationMetrics: (tenantId: string, days = 30) =>
    customRpc<AutomationMetrics[]>('get_automation_metrics_v1', { p_tenant_id: tenantId, p_days: days }),
  
  // Government integration functions
  govGetStatus: (tenantId: string) =>
    customRpc<any>('gov_get_status_v1', { p_tenant_id: tenantId }),
  
  govQueueJob: (tenantId: string, jobType: string, params?: any) =>
    customRpc<any>('gov_queue_job_v1', { p_tenant_id: tenantId, p_job_type: jobType, p_params: params }),
  
  // Other utility functions
  getDemoTenantId: () =>
    customRpc<string>('get_demo_tenant_id'),
  
  bootstrapCurrentUserAsOwner: (companyId?: string) =>
    customRpc<any>('bootstrap_current_user_as_owner', { p_company_id: companyId }),
  
  apiCreateKey: (tenantId: string, name: string, scopes: string[]) =>
    customRpc<any>('api_create_key_v1', { p_tenant_id: tenantId, p_name: name, p_scopes: scopes }),
  
  apiRevokeKey: (keyId: string) =>
    customRpc<any>('api_revoke_key_v1', { p_key_id: keyId }),
  
  syncToolIntegration: (tenantId: string, toolName: string) =>
    customRpc<any>('sync_tool_integration', { p_tenant_id: tenantId, p_tool_name: toolName }),
  
  startTrial: (planId: string) =>
    customRpc<any>('start_trial', { p_plan_id: planId }),
  
  rewGetOverview: (tenantId: string) =>
    customRpc<any>('rew_get_overview_v1', { p_tenant_id: tenantId })
};
