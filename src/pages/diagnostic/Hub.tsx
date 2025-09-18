import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDemoDataStatus, ensureDemoData } from '@/lib/dev/ensureDemoData';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function DiagnosticHub() {
  const params = new URLSearchParams(window.location.search);
  const dev = params.get('dev') === '1';
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [isSeedingRetention, setIsSeedingRetention] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantSummary, setTenantSummary] = useState<{employees: number, kpiDays: number, exits: number} | null>(null);

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

  const fetchTenantSummary = async () => {
    if (!tenantId) return;
    
    try {
      // Get employee count
      const { count: empCount, error: empError } = await supabase
        .from('hr_employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', tenantId);
      
      // Get KPI snapshots count
      const { count: kpiCount, error: kpiError } = await supabase
        .from('kpi_snapshots')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', tenantId);
      
      // Get exits count from last 12 months
      const { count: exitsCount, error: exitsError } = await supabase
        .from('hr_employee_exits')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', tenantId)
        .gte('exit_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      setTenantSummary({
        employees: empCount || 0,
        kpiDays: kpiCount || 0,
        exits: exitsCount || 0
      });
    } catch (error) {
      console.warn('Failed to fetch tenant summary:', error);
    }
  };

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

      const result = await ensureDemoData();
      if (result.error) {
        toast({ title: "Seeding Failed", description: result.error, variant: "destructive" });
        return;
      }

      setIsSeeded(true);
      toast({
        title: "Demo Data Seeded",
        description: `Seeded and backfilled for tenant ${result.tenantId}`,
      });

      // Update summary
      await fetchTenantSummary();
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
      const { data: backfillData, error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1' as any, {
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
      
      // Update summary
      await fetchTenantSummary();
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

  const handleSeedRetention = async () => {
    if (!tenantId) return;
    
    setIsSeedingRetention(true);
    try {
      const { error: seedError } = await supabase.rpc('dev_seed_retention_v1' as any, {
        p_tenant: tenantId
      });
      
      if (seedError) throw seedError;
      
      const { error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1' as any, {
        p_tenant: tenantId,
        p_days: 365
      });
      
      if (backfillError) throw backfillError;
      
      toast({
        title: "Success",
        description: "Retention data seeded successfully with exits and analytics",
      });
      
      // Update summary
      await fetchTenantSummary();
    } catch (error: any) {
      console.error('Error seeding retention:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSeedingRetention(false);
    }
  };

  // Load tenant summary on mount and when tenant changes
  useEffect(() => {
    if (tenantId) {
      fetchTenantSummary();
    }
  }, [tenantId]);

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
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Demo Data'
              )}
            </Button>
            <Button 
              onClick={handleRecomputeKPIs}
              disabled={isRecomputing || !tenantId}
              variant="outline"
            >
              {isRecomputing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Computing...
                </>
              ) : (
                'Recompute KPIs'
              )}
            </Button>
            <Button 
              onClick={handleSeedRetention}
              disabled={isSeedingRetention || !tenantId}
              variant="secondary"
            >
              {isSeedingRetention ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Retention (exits)'
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Seeds ~1,000 employees with realistic Saudization mix and iqama expiries. KPI recomputation generates 365 days of historical snapshots. Both operations use database fallbacks for reliability.
          </p>
          
          {/* Tenant Summary */}
          {tenantSummary && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-xs font-medium mb-2">Tenant Summary (ID: {tenantId?.slice(0, 8)}...)</div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Employees:</span>
                  <div className="font-mono">{tenantSummary.employees.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">KPI Days:</span>
                  <div className="font-mono">{tenantSummary.kpiDays}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Exits (12M):</span>
                  <div className="font-mono">{tenantSummary.exits}</div>
                </div>
              </div>
            </div>
          )}
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