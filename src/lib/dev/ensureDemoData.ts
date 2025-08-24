import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

interface DemoDataStatus {
  seeded: boolean;
  backfilled: boolean;
  tenantId: string | null;
  error?: string;
}

async function logToUiEvents(tenantId: string, message: string, level: 'info' | 'error' = 'info') {
  try {
    await supabase.from('ui_events').insert({
      page: 'demo_data_setup',
      tenant_id: tenantId,
      message,
      level,
      details: { 
        event_type: 'demo_data_setup',
        occurred_at: new Date().toISOString() 
      }
    });
  } catch (error) {
    console.warn('Failed to log to ui_events:', error);
  }
}

export async function ensureDemoData(): Promise<DemoDataStatus> {
  try {
    // Get current demo tenant ID
    const tenantId = await getTenantIdOrDemo();
    if (!tenantId) {
      return { seeded: false, backfilled: false, tenantId: null, error: 'No tenant ID available' };
    }

    const cacheKey = `aqlhr.demoSeeded:${tenantId}`;
    
    // Check if already seeded
    if (localStorage.getItem(cacheKey)) {
      return { seeded: true, backfilled: true, tenantId };
    }

    await logToUiEvents(tenantId, 'Checking demo data status...');

    // Check if employees already exist
    const { count, error: countError } = await supabase
      .from('hr_employees')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', tenantId);

    if (countError) {
      await logToUiEvents(tenantId, `Error checking employee count: ${countError.message}`, 'error');
      return { seeded: false, backfilled: false, tenantId, error: countError.message };
    }

    if (count && count > 0) {
      // Data already exists
      localStorage.setItem(cacheKey, '1');
      return { seeded: true, backfilled: true, tenantId };
    }

    await logToUiEvents(tenantId, 'No employees found, seeding demo data...');

    // Seed demo data using edge function
    const { data: seedResult, error: seedError } = await supabase.functions.invoke('hr_seed_demo_1000_v1', {
      body: { tenantId }
    });

    if (seedError) {
      await logToUiEvents(tenantId, `Seeding failed: ${seedError.message}`, 'error');
      return { seeded: false, backfilled: false, tenantId, error: seedError.message };
    }

    await logToUiEvents(tenantId, `Seeded ${seedResult?.recordsInserted || 1000} employees successfully`);

    // Compute current KPIs
    await logToUiEvents(tenantId, 'Computing current KPIs...');
    const { error: kpiError } = await supabase.rpc('dashboard_compute_kpis_v1', {
      p_tenant: tenantId
    });

    if (kpiError) {
      await logToUiEvents(tenantId, `KPI computation failed: ${kpiError.message}`, 'error');
      console.warn('KPI computation failed:', kpiError);
    }

    // Backfill 12 months of historical data
    await logToUiEvents(tenantId, 'Backfilling historical KPI data...');
    const { error: backfillError } = await supabase.rpc('dashboard_backfill_v1', {
      p_tenant: tenantId,
      p_days: 365
    });

    if (backfillError) {
      await logToUiEvents(tenantId, `Backfill failed: ${backfillError.message}`, 'error');
      console.warn('Backfill failed:', backfillError);
    }

    // Mark as seeded
    localStorage.setItem(cacheKey, '1');
    await logToUiEvents(tenantId, 'Demo data setup completed successfully');

    return { 
      seeded: true, 
      backfilled: !backfillError, 
      tenantId 
    };

  } catch (error: any) {
    console.error('ensureDemoData error:', error);
    return { 
      seeded: false, 
      backfilled: false, 
      tenantId: null, 
      error: error.message 
    };
  }
}

export async function manualSeedDemo(tenantId?: string): Promise<DemoDataStatus> {
  const targetTenant = tenantId || await getTenantIdOrDemo();
  if (!targetTenant) {
    return { seeded: false, backfilled: false, tenantId: null, error: 'No tenant ID available' };
  }

  // Clear cache to force re-seeding
  localStorage.removeItem(`aqlhr.demoSeeded:${targetTenant}`);
  
  return ensureDemoData();
}

export async function manualRecomputeKPIs(tenantId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const targetTenant = tenantId || await getTenantIdOrDemo();
    if (!targetTenant) {
      return { success: false, error: 'No tenant ID available' };
    }

    await logToUiEvents(targetTenant, 'Manual KPI recomputation started...');

    // Recompute current KPIs
    const { error: kpiError } = await supabase.rpc('dashboard_compute_kpis_v1', {
      p_tenant: targetTenant
    });

    if (kpiError) {
      await logToUiEvents(targetTenant, `Manual KPI computation failed: ${kpiError.message}`, 'error');
      return { success: false, error: kpiError.message };
    }

    // Backfill historical data
    const { error: backfillError } = await supabase.rpc('dashboard_backfill_v1', {
      p_tenant: targetTenant,
      p_days: 365
    });

    if (backfillError) {
      await logToUiEvents(targetTenant, `Manual backfill failed: ${backfillError.message}`, 'error');
      console.warn('Manual backfill failed:', backfillError);
    }

    await logToUiEvents(targetTenant, 'Manual KPI recomputation completed');
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getDemoDataStatus(tenantId?: string): boolean {
  if (!tenantId) return false;
  return !!localStorage.getItem(`aqlhr.demoSeeded:${tenantId}`);
}