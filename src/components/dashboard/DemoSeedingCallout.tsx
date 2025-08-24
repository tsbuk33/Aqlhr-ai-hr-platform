import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { resolveTenantId } from "@/lib/useTenant";

interface DemoSeedingCalloutProps {
  onSeedingComplete?: () => void;
}

export function DemoSeedingCallout({ onSeedingComplete }: DemoSeedingCalloutProps) {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleRunDemoSeeding = async () => {
    setIsSeeding(true);
    
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error('Unable to determine tenant ID');
        return;
      }

      toast.info('Starting demo seeding process...');
      
      // Try Edge Function first (service role); fallback to DB RPCs
      const edgeRes = await supabase.functions.invoke('hr_seed_demo_1000_v1', { body: { tenantId } });
      if (edgeRes.error) {
        console.warn('Edge seeding failed, falling back to RPC:', edgeRes.error);
        const { error: seedError } = await supabase.rpc('dev_seed_employees_v1', { 
          p_tenant: tenantId, 
          p_n: 1000 
        });
        if (seedError) throw new Error(`Seeding failed: ${seedError.message}`);
      }

      // Recompute 365 days of KPIs
      const { error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1', { 
        p_tenant: tenantId, 
        p_days: 365 
      });
      if (backfillError) throw new Error(`KPI backfill failed: ${backfillError.message}`);

      // Seed retention exits idempotently
      const { error: retentionError } = await supabase.rpc('dev_seed_retention_v1', { p_tenant: tenantId });
      if (retentionError) console.warn('Retention seeding warning:', retentionError.message);

      localStorage.setItem(`aqlhr.demoSeeded:${tenantId}`, '1');
      
      toast.success('Demo seeding completed successfully!');
      onSeedingComplete?.();
      
    } catch (error: any) {
      console.error('Demo seeding error:', error);
      toast.error(error.message || 'Demo seeding failed');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="border-warning bg-warning/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning-foreground">No Demo Data Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Total employees is 0. Run demo seeding to populate the dashboard with ~1,000 employees, KPIs, and sample data.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleRunDemoSeeding} 
            size="sm"
            disabled={isSeeding}
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              'Run Demo Seeding Now'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}