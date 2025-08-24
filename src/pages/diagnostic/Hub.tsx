import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDemoDataStatus } from '@/lib/dev/ensureDemoData';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { supabase } from '@/integrations/supabase/client';

export default function DiagnosticHub() {
  const params = new URLSearchParams(window.location.search);
  const dev = params.get('dev') === '1';
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      const tenant = await getTenantIdOrDemo();
      setTenantId(tenant);
      if (tenant) {
        setIsSeeded(getDemoDataStatus(tenant));
      }
    }
    checkStatus();
  }, []);

  const handleSeedDemo = async () => {
    if (!tenantId) return;
    
    setIsSeeding(true);
    toast({
      title: "Seeding Demo Data",
      description: "Using DB fallback seeding with ~1,000 employees...",
    });

    try {
      // Clear cache to force re-seeding
      localStorage.removeItem(`aqlhr.demoSeeded:${tenantId}`);
      
      // Use the new DB RPC directly for manual seeding
      const { data: seedData, error: seedError } = await supabase.rpc('dev_seed_employees_v1', {
        p_tenant: tenantId,
        p_n: 1000
      });

      if (seedError) {
        toast({
          title: "Seeding Failed", 
          description: seedError.message,
          variant: "destructive"
        });
        return;
      }

      setIsSeeded(true);
      localStorage.setItem(`aqlhr.demoSeeded:${tenantId}`, '1');
      
      toast({
        title: "Demo Data Seeded",
        description: (seedData as any)?.message || `Successfully seeded employees for tenant ${tenantId}`,
      });
    } catch (error: any) {
      toast({
        title: "Seeding Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRecomputeKPIs = async () => {
    if (!tenantId) return;
    
    setIsRecomputing(true);
    toast({
      title: "Recomputing KPIs",
      description: "Using DB fallback to generate 365 days of KPI snapshots...",
    });

    try {
      // Use the new DB RPC directly
      const { data: backfillData, error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1', {
        p_tenant: tenantId,
        p_days: 365
      });

      if (backfillError) {
        toast({
          title: "KPI Computation Failed",
          description: backfillError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "KPIs Recomputed",
        description: (backfillData as any)?.message || "Successfully updated all KPI metrics and historical data",
      });
    } catch (error: any) {
      toast({
        title: "KPI Computation Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRecomputing(false);
    }
  };

  // Minimal, always-visible content so we can verify rendering
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Diagnostic Hub</h1>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isSeeded 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {isSeeded ? 'Seeded ✓' : 'Not seeded'}
          </span>
        </div>
      </div>

      {dev && (
        <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg space-y-4">
          <div>
            <strong className="text-sm">Dev mode:</strong>
            <span className="text-sm text-muted-foreground ml-2">
              Rendering without auth/tenant validation
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link 
              to="../osi?dev=1" 
              relative="path"
              className="text-sm text-primary hover:underline"
            >
              Organization Structure Intelligence (OSI)
            </Link>
            <Link 
              to="../retention?dev=1" 
              relative="path"
              className="text-sm text-primary hover:underline"
            >
              Retention Strategy
            </Link>
            <Link 
              to="../org-structure-intelligence?dev=1" 
              relative="path"
              className="text-sm text-primary hover:underline"
            >
              Org Structure Intelligence (legacy)
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Demo Data Management</h3>
          <div className="flex gap-2">
            <Button 
              onClick={handleSeedDemo}
              disabled={isSeeding || !tenantId}
              variant="default"
            >
              {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
            </Button>
            <Button 
              onClick={handleRecomputeKPIs}
              disabled={isRecomputing || !tenantId}
              variant="outline"
            >
              {isRecomputing ? 'Computing...' : 'Recompute KPIs'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Seeds ~1,000 employees with realistic Saudization mix and iqama expiries. KPI recomputation generates 365 days of historical snapshots. Both operations use database fallbacks for reliability.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Routing Status</h3>
          <p className="text-sm">If you can read this, the Hub outlet is rendering.</p>
          <p className="text-sm text-muted-foreground">
            Try adding <code className="bg-muted px-1 py-0.5 rounded">?debug=1</code> to the URL to show the route debug overlay.
          </p>
        </div>
      </div>
    </div>
  );
}