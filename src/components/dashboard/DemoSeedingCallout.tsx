import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getTenantIdOrDemo } from "@/lib/tenant/getTenantId";
import { ensureDemoData } from "@/lib/dev/ensureDemoData";

interface DemoSeedingCalloutProps {
  onSeedingComplete?: () => void;
}

export function DemoSeedingCallout({ onSeedingComplete }: DemoSeedingCalloutProps) {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleRunDemoSeeding = async () => {
    setIsSeeding(true);
    
    try {
      const tenantId = await getTenantIdOrDemo();
      if (!tenantId) {
        toast.error('Unable to determine tenant ID');
        return;
      }

      // Clear cache to force real seeding/backfill when needed
      localStorage.removeItem(`aqlhr.demoSeeded:${tenantId}`);
      toast.info('Starting demo seeding process...');

      // Use centralized demo seeding to ensure company_id consistency
      const result = await ensureDemoData();
      if (result.error) {
        throw new Error(result.error);
      }

      // Seed retention exits idempotently for the same tenant
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