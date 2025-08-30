import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { ensureDevTenant } from '@/lib/dev/DevModeGuard';

export interface UiEventOptions {
  tenantId?: string;
  page: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: Record<string, any>;
}

/**
 * Log UI event to ui_events table with proper tenant handling
 */
export async function logUiEvent(options: UiEventOptions): Promise<void> {
  try {
    let tenantId = options.tenantId;
    
    if (!tenantId) {
      const isDevMode = new URLSearchParams(window.location.search).get('dev') === '1';
      if (isDevMode) {
        await ensureDevTenant();
        tenantId = await getTenantIdOrDemo();
      }
    }

    await supabase.from('ui_events').insert({
      tenant_id: tenantId,
      page: options.page,
      level: options.level,
      message: options.message,
      details: options.details || {}
    });
  } catch (error) {
    console.warn('Failed to log UI event:', error);
  }
}