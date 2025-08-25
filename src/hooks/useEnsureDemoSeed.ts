import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { resolveTenantId } from '@/lib/useTenant';

/**
 * Ensures demo data (1000 employees + KPIs + retention) exists for the current tenant in dev mode.
 * Idempotent: runs once per tenant per session; uses Edge Functions first, then RPC fallback.
 */
export function useEnsureDemoSeed() {
  const [seeded, setSeeded] = useState(false);
  const ranRef = useRef(false);

  useEffect(() => {
    const isDev = new URLSearchParams(window.location.search).get('dev') === '1';
    if (!isDev || ranRef.current) return;

    (async () => {
      try {
        ranRef.current = true;
        const { tenantId } = await resolveTenantId(supabase);
        if (!tenantId) return;
        const flagKey = `aqlhr.demo.seeded:${tenantId}`;
        if (sessionStorage.getItem(flagKey) === '1') {
          setSeeded(true);
          return;
        }

        // 1) Check headcount via RPC
        let total = 0;
        try {
          const { data } = await supabase.rpc('ask_headcount_v1', { p_tenant: tenantId });
          total = Array.isArray(data) && data[0]?.total ? data[0].total : 0;
        } catch {
          // fallback to table count
          const { count } = await supabase
            .from('hr_employees')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', tenantId);
          total = count || 0;
        }

        if ((total || 0) < 1000) {
          // 2) Seed employees (Edge → RPC fallback)
          try {
            await (supabase.functions as any).invoke('hr_seed_demo_1000_v1', { body: { tenantId } });
          } catch {
            try { await (supabase.functions as any).invoke('dev_seed_employees_v1', { body: { tenantId } }); } catch {}
            try { await (supabase.rpc as any)('dev_seed_employees_v1', { p_tenant: tenantId }); } catch {}
            try { await (supabase.rpc as any)('dev_seed_employees_v1', { p_tenant_id: tenantId }); } catch {}
          }

          // 3) Backfill KPIs
          try {
            await (supabase.functions as any).invoke('dev_backfill_kpis_v1', { body: { tenantId } });
          } catch {
            try { await (supabase.rpc as any)('dev_backfill_kpis_v1', { p_tenant: tenantId }); } catch {}
            try { await (supabase.rpc as any)('dev_backfill_kpis_v1', { p_tenant_id: tenantId }); } catch {}
          }

          // 4) Seed retention
          try {
            await (supabase.functions as any).invoke('dev_seed_retention_v1', { body: { tenantId } });
          } catch {
            try { await (supabase.rpc as any)('dev_seed_retention_v1', { p_tenant: tenantId }); } catch {}
            try { await (supabase.rpc as any)('dev_seed_retention_v1', { p_tenant_id: tenantId }); } catch {}
          }
        }

        sessionStorage.setItem(flagKey, '1');
        setSeeded(true);
        toast.success('Demo data ready');
      } catch (e) {
        // Silent in production; avoid blocking UI
        console.warn('AqlHR: demo seed skipped', e);
      }
    })();
  }, []);

  return seeded;
}
