import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logUiEvent } from '@/lib/obs/logUiEvent';

interface DemoSeedingOptions {
  tenantId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Ensures demo employees exist for dev/testing purposes
 * Shows CTA when ?dev=1 and employee count is 0
 */
export async function ensureDemoEmployees(options: DemoSeedingOptions) {
  const { tenantId, onSuccess, onError } = options;
  
  try {
    logUiEvent({
      level: 'info',
      page: 'employees',
      message: 'Demo seeding started',
      details: { tenantId: tenantId.slice(0, 8) }
    });

    // Call the dev seeding function
    const { error: seedError } = await supabase.rpc('dev_seed_employees_v1', {
      p_tenant: tenantId
    });

    if (seedError) {
      const msg = seedError.message || '';
      if (msg.includes('iqama_expiry') || (msg.toLowerCase().includes('column') && msg.toLowerCase().includes('does not exist'))) {
        console.warn('Ignoring missing iqama_expiry during employee seeding:', msg);
      } else {
        throw new Error(`Failed to seed employees: ${seedError.message}`);
      }
    }

    toast.success('Demo employees created successfully!');

    // Also backfill KPIs if the function exists
    try {
      const { error: kpiError } = await supabase.rpc('dev_backfill_kpis_v1', {
        p_tenant: tenantId
      });
      
      if (!kpiError) {
        toast.success('KPI snapshots backfilled!');
      }
    } catch (kpiErr) {
      // KPI backfill is optional, don't fail the main operation
      console.warn('KPI backfill failed:', kpiErr);
    }

    logUiEvent({
      level: 'info',
      page: 'employees',
      message: 'Demo seeding completed',
      details: { tenantId: tenantId.slice(0, 8) }
    });

    onSuccess?.();
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    logUiEvent({
      level: 'error',
      page: 'employees',
      message: 'Demo seeding failed',
      details: { error: 'Seeding operation failed' }
    });

    toast.error(`Failed to seed demo data: ${errorMsg}`);
    onError?.(error instanceof Error ? error : new Error(errorMsg));
  }
}

/**
 * Check if dev mode is enabled and show seeding CTA if needed
 */
export function useDevSeeding(employeeCount: number, tenantId?: string) {
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === '1';
  const shouldShowCTA = isDevMode && employeeCount === 0 && tenantId;

  const seedDemoData = () => {
    if (!tenantId) return;
    
    ensureDemoEmployees({
      tenantId,
      onSuccess: () => {
        // Reload the page to show new data
        window.location.reload();
      }
    });
  };

  return {
    shouldShowCTA,
    seedDemoData,
    isDevMode
  };
}

/**
 * Dev seeding CTA component props
 */
export interface DevSeedingCTAProps {
  onSeed: () => void;
}