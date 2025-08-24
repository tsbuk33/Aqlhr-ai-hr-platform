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
      
      // Run the three RPCs sequentially
      const { error: seedError } = await supabase.rpc('dev_seed_employees_v1', { 
        p_tenant: tenantId, 
        p_n: 1000 
      });
      
      if (seedError) {
        console.error('Seed error:', seedError);
        throw new Error(`Seeding failed: ${seedError.message}`);
      }
      
      const { error: backfillError } = await supabase.rpc('dev_backfill_kpis_v1', { 
        p_tenant: tenantId, 
        p_days: 365 
      });
      
      if (backfillError) {
        console.error('Backfill error:', backfillError);
        throw new Error(`KPI backfill failed: ${backfillError.message}`);
      }
      
      const { error: retentionError } = await supabase.rpc('dev_seed_retention_v1', { 
        p_tenant: tenantId 
      });
      
      if (retentionError) {
        console.error('Retention error:', retentionError);
        throw new Error(`Retention seeding failed: ${retentionError.message}`);
      }
      
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