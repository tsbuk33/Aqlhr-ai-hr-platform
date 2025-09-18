import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

export interface RetentionOverview {
  total_employees: number;
  avg_risk: number;
  pct_high: number;
  pct_med: number;
  pct_low: number;
  target_turnover: number;
}

/**
 * Get retention overview for a tenant
 */
export async function getOverview(tenantId?: string | null): Promise<RetentionOverview | null> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return null;
    
    const { data, error } = await supabase.rpc('retention_get_overview_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('getOverview', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return data && (data as any[]).length > 0 ? (data as any[])[0] : null;
  } catch (error) {
    console.error('Error getting retention overview:', error);
    return null;
  }
}

/**
 * Seed demo data for retention analysis
 */
export async function seedDemo(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    const { error } = await supabase.rpc('retention_seed_demo_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('seedDemo', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return false;
  }
}

/**
 * Compute retention analysis for current month
 */
export async function computeNow(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    const { error } = await supabase.rpc('retention_compute_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('computeNow', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error computing retention analysis:', error);
    return false;
  }
}

/**
 * Backfill retention analysis for multiple iterations
 */
export async function backfillMonths(tenantId?: string | null, iterations: number = 12): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    let successful = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const success = await computeNow(resolvedTenantId);
        if (success) {
          successful++;
        }
      } catch (error) {
        console.error(`Error computing for iteration ${i}:`, error);
      }
    }

    console.log(`Backfilled ${successful}/${iterations} iterations successfully`);
    
    return successful > 0;
  } catch (error) {
    console.error('Error backfilling:', error);
    return false;
  }
}

/**
 * Clear retention data for a tenant (dev only)
 */
export async function clearData(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    // Clear retention-related tables for this tenant - use specific table names that exist
    const { error: risksError } = await supabase
      .from('retention_risks')
      .delete()
      .eq('tenant_id', resolvedTenantId);

    if (risksError) {
      await logError('clearData', risksError.message, { tenantId: resolvedTenantId, table: 'retention_risks' });
    }

    const { error: actionsError } = await supabase
      .from('retention_actions')
      .delete()
      .eq('tenant_id', resolvedTenantId);

    if (actionsError) {
      await logError('clearData', actionsError.message, { tenantId: resolvedTenantId, table: 'retention_actions' });
    }

    const { error: featuresError } = await supabase
      .from('retention_features')
      .delete()
      .eq('tenant_id', resolvedTenantId);

    if (featuresError) {
      await logError('clearData', featuresError.message, { tenantId: resolvedTenantId, table: 'retention_features' });
    }

    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

/**
 * Log errors to ui_events table
 */
async function logError(operation: string, message: string, details: any = {}): Promise<void> {
  try {
    await supabase.from('ui_events').insert({
      tenant_id: details.tenantId || null,
      event_type: 'error',
      level: 'error',
      page: 'diagnostic/retention',
      message: `Retention API ${operation}: ${message}`,
      metadata: details
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}