import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

interface DemoDataStatus {
  seeded: boolean;
  backfilled: boolean;
  tenantId: string | null;
  error?: string;
  seed?: any;
  backfill?: any;
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
    
    // Check if already seeded (idempotent)
    if (localStorage.getItem(cacheKey) === '1') {
      return { seeded: false, backfilled: false, tenantId };
    }

    await logToUiEvents(tenantId, 'Starting demo data setup...', 'info');

    // 1) Try Edge Function first (non-blocking failure)
    let edgeFunctionWorked = false;
    try {
      await logToUiEvents(tenantId, 'Attempting edge function seeding...', 'info');
      const { error: edgeError } = await supabase.functions.invoke('hr_seed_demo_1000_v1', { 
        body: { tenantId } 
      });
      
      if (!edgeError) {
        edgeFunctionWorked = true;
        await logToUiEvents(tenantId, 'Edge function seeding successful', 'info');
      } else {
        await logToUiEvents(tenantId, `Edge function failed: ${edgeError.message}`, 'error');
      }
    } catch (e: any) {
      await logToUiEvents(tenantId, `Edge function error: ${e.message}`, 'error');
      // Swallow error - we'll use DB fallback
    }

    // 2) DB fallback - seed employees idempotently
    await logToUiEvents(tenantId, 'Running database fallback seeding...', 'info');
    const { data: seedData, error: seedError } = await supabase.rpc('dev_seed_employees_v1', { 
      p_tenant: tenantId,
      p_count: 1000
    });

    if (seedError) {
      const msg = seedError.message || '';
      await logToUiEvents(tenantId, `Database seeding failed: ${msg}`, 'error');
      if (msg.includes('iqama_expiry') || (msg.toLowerCase().includes('column') && msg.toLowerCase().includes('does not exist'))) {
        await logToUiEvents(tenantId, 'Ignoring missing iqama_expiry during seeding; proceeding without demo data', 'info');
        // Mark as seeded to avoid noisy retries; user can force reseed via manualSeedDemo()
        localStorage.setItem(cacheKey, '1');
        return { seeded: false, backfilled: false, tenantId };
      }
      return { seeded: false, backfilled: false, tenantId, error: seedError.message };
    }

    await logToUiEvents(tenantId, `Database seeding completed: ${(seedData as any)?.message || 'Success'}`, 'info');

    // 3) Backfill KPIs idempotently
    await logToUiEvents(tenantId, 'Backfilling KPI snapshots...', 'info');
    const { data: backfillData, error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1', { 
      p_tenant: tenantId, 
      p_days: 365 
    });

    if (backfillError) {
      await logToUiEvents(tenantId, `KPI backfill failed: ${backfillError.message}`, 'error');
      console.warn('Backfill failed:', backfillError);
    } else {
      await logToUiEvents(tenantId, `KPI backfill completed: ${(backfillData as any)?.message || 'Success'}`, 'info');
    }

    // Mark as seeded
    localStorage.setItem(cacheKey, '1');
    await logToUiEvents(tenantId, 'Demo data setup completed successfully', 'info');

    return { 
      seeded: true, 
      backfilled: !backfillError, 
      tenantId,
      seed: seedData,
      backfill: backfillData
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

    await logToUiEvents(targetTenant, 'Manual KPI recomputation started...', 'info');

    // Use the new DB backfill function (idempotent)
    const { data: backfillData, error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1', {
      p_tenant: targetTenant,
      p_days: 365
    });

    if (backfillError) {
      await logToUiEvents(targetTenant, `Manual KPI computation failed: ${backfillError.message}`, 'error');
      return { success: false, error: backfillError.message };
    }

    await logToUiEvents(targetTenant, `Manual KPI recomputation completed: ${(backfillData as any)?.message || 'Success'}`, 'info');
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getDemoDataStatus(tenantId?: string): boolean {
  if (!tenantId) return false;
  return !!localStorage.getItem(`aqlhr.demoSeeded:${tenantId}`);
}