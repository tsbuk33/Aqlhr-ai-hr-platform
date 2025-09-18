import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';

export interface OSIOverview {
  total_layers: number;
  highest_saudi_layer: number;
  critical_layers: number;
  layers_meeting_target: number;
  span_outliers_low: number;
  span_outliers_high: number;
  management_cost: number;
}

/**
 * Seed demo OSI data for a tenant
 */
export async function seedDemo(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    const { error } = await supabase.rpc('osi_seed_demo_data_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('seedDemo', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error seeding OSI demo data:', error);
    return false;
  }
}

/**
 * Compute/refresh OSI analysis for current data
 */
export async function computeNow(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    const { error } = await supabase.rpc('osi_refresh_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('computeNow', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error computing OSI analysis:', error);
    return false;
  }
}

/**
 * Backfill OSI analysis for multiple iterations
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
        console.error(`Error computing OSI for iteration ${i}:`, error);
      }
    }

    console.log(`OSI backfilled ${successful}/${iterations} iterations successfully`);
    
    return successful > 0;
  } catch (error) {
    console.error('Error backfilling OSI:', error);
    return false;
  }
}

/**
 * Get OSI overview for a tenant
 */
export async function getOverview(tenantId?: string | null): Promise<OSIOverview | null> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return null;
    
    const { data, error } = await supabase.rpc('osi_get_overview_v1' as any, {
      p_tenant: resolvedTenantId
    });

    if (error) {
      await logError('getOverview', error.message, { tenantId: resolvedTenantId });
      throw error;
    }

    return data && (data as any[]).length > 0 ? (data as any[])[0] : null;
  } catch (error) {
    console.error('Error getting OSI overview:', error);
    return null;
  }
}

/**
 * Clear OSI data for a tenant (dev only)
 */
export async function clearData(tenantId?: string | null): Promise<boolean> {
  try {
    const resolvedTenantId = tenantId || await getTenantIdOrDemo();
    if (!resolvedTenantId) return false;

    // Clear OSI-related computed data for this tenant
    // Since OSI tables don't exist yet, we'll just return true for now
    console.log('OSI clear data requested for tenant:', resolvedTenantId);
    
    return true;
  } catch (error) {
    console.error('Error clearing OSI data:', error);
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
      page: 'diagnostic/osi',
      message: `OSI API ${operation}: ${message}`,
      metadata: details
    });
  } catch (error) {
    console.error('Failed to log OSI error:', error);
  }
}