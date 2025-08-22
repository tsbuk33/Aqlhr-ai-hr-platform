import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { Crown, Check, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PlanUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  skuCode: string;
  featureName: string;
  description: string;
}

export const PlanUpsellModal: React.FC<PlanUpsellModalProps> = ({
  isOpen,
  onClose,
  skuCode,
  featureName,
  description,
}) => {
  const [requestingTrial, setRequestingTrial] = useState<string | null>(null);
  const { companyId } = useUserCompany();

  // Fetch plans that include this SKU
  const { data: eligiblePlans } = useQuery({
    queryKey: ['eligible-plans', skuCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plan_bundles')
        .select('*')
        .contains('included_skus', [skuCode])
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!skuCode
  });

  const requestTrial = async (planCode: string) => {
    if (!companyId || requestingTrial) return;

    setRequestingTrial(planCode);
    try {
      // Start trial
      const { error: trialError } = await supabase.rpc('start_trial', {
        p_tenant_id: companyId,
        p_plan_code: planCode,
        p_requested_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (trialError) throw trialError;

      // Create sales lead
      const { error: leadError } = await supabase
        .from('sales_leads')
        .insert({
          tenant_id: companyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          lead_type: 'trial_request',
          requested_plan: planCode,
          requested_sku: skuCode,
          message: `Trial requested for ${featureName}`,
          status: 'trial_activated'
        });

      if (leadError) {
        console.error('Error creating sales lead:', leadError);
      }

      toast.success('Trial started successfully!');
      onClose();
      
      // Refresh the page to update access
      window.location.reload();
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to start trial');
    } finally {
      setRequestingTrial(null);
    }
  };

  const createSalesLead = async (planCode: string) => {
    if (!companyId) return;

    try {
      const { error } = await supabase
        .from('sales_leads')
        .insert({
          tenant_id: companyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          lead_type: 'upgrade_request',
          requested_plan: planCode,
          requested_sku: skuCode,
          message: `Upgrade requested for ${featureName}`,
          status: 'new'
        });

      if (error) throw error;

      toast.success('Request submitted! Our team will contact you soon.');
      onClose();
    } catch (error) {
      console.error('Error creating sales lead:', error);
      toast.error('Failed to submit request');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <DialogTitle>Upgrade Required</DialogTitle>
          </div>
          <DialogDescription>
            Access to {featureName} requires a premium plan
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">{featureName}</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {eligiblePlans && eligiblePlans.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Available Plans:</h4>
              <div className="grid gap-4">
                {eligiblePlans.map((plan) => (
                  <Card key={plan.id} className={plan.is_popular ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${plan.price_monthly}</div>
                          <div className="text-sm text-muted-foreground">/month</div>
                        </div>
                      </div>
                      {plan.is_popular && (
                        <Badge className="w-fit">Most Popular</Badge>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => requestTrial(plan.plan_code)}
                          disabled={requestingTrial === plan.plan_code}
                          className="flex-1 gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          {requestingTrial === plan.plan_code 
                            ? 'Starting...' 
                            : `Start ${plan.trial_days}-Day Trial`
                          }
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => createSalesLead(plan.plan_code)}
                          className="flex-1"
                        >
                          Contact Sales
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>No credit card required for trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>Cancel anytime during trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>Full access to all features</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};