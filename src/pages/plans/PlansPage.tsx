import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { Crown, Check, Sparkles, Zap, Shield, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

interface PlanBundle {
  id: string;
  plan_code: string;
  plan_name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  included_skus: string[];
  is_popular: boolean;
  trial_days: number;
}

interface SKU {
  sku_code: string;
  sku_name: string;
  description: string;
  category: string;
  features: string[];
}

interface ActiveTrial {
  id: string;
  plan_code: string;
  expires_at: string;
}

const PlansPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { companyId } = useUserCompany();

  // Fetch plan bundles
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plan-bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plan_bundles')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      return data as PlanBundle[];
    }
  });

  // Fetch SKU catalog
  const { data: skus } = useQuery({
    queryKey: ['sku-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sku_catalog')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as SKU[];
    }
  });

  // Fetch current trials
  const { data: activeTrials } = useQuery({
    queryKey: ['active-trials', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('tenant_trials')
        .select('*')
        .eq('tenant_id', companyId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;

      // Get plan names for each trial
      const trialsWithPlans = await Promise.all(
        data.map(async (trial) => {
          const { data: planBundle } = await supabase
            .from('plan_bundles')
            .select('plan_name')
            .eq('plan_code', trial.plan_code)
            .single();

          return {
            ...trial,
            plan_name: planBundle?.plan_name || trial.plan_code
          };
        })
      );

      return trialsWithPlans;
    },
    enabled: !!companyId
  });

  const requestTrial = async (planCode: string) => {
    if (!companyId) return;

    try {
      const { error: trialError } = await supabase.rpc('start_trial' as any, {
        p_tenant_id: companyId,
        p_plan_code: planCode,
        p_requested_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (trialError) throw trialError;

      const { error: leadError } = await supabase
        .from('sales_leads')
        .insert({
          tenant_id: companyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          lead_type: 'trial_request',
          requested_plan: planCode,
          status: 'trial_activated'
        });

      if (leadError) {
        console.error('Error creating sales lead:', leadError);
      }

      toast.success('Trial started successfully!');
      
      // Refresh trials
      window.location.reload();
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to start trial');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diagnostics': return <Brain className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'ai_insights': return <Sparkles className="h-4 w-4" />;
      case 'executive': return <Crown className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'STARTER': return <Zap className="h-6 w-6" />;
      case 'COMPLIANCE_ESSENTIALS': return <Shield className="h-6 w-6" />;
      case 'INTELLIGENT_HR': return <Brain className="h-6 w-6" />;
      case 'EXECUTIVE_INTELLIGENCE': return <Crown className="h-6 w-6" />;
      default: return <Sparkles className="h-6 w-6" />;
    }
  };

  const hasActiveTrial = (planCode: string) => {
    return activeTrials?.some(trial => trial.plan_code === planCode);
  };

  if (plansLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Unlock the power of AI-driven HR intelligence
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
            Monthly
          </span>
          <Switch
            checked={billingCycle === 'annual'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
          />
          <span className={billingCycle === 'annual' ? 'font-medium' : 'text-muted-foreground'}>
            Annual
          </span>
          {billingCycle === 'annual' && (
            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Plan Bundles</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans?.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.is_popular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getPlanIcon(plan.plan_code)}
                  </div>
                  <CardTitle>{plan.plan_name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${billingCycle === 'monthly' ? plan.price_monthly : Math.floor(plan.price_annual / 12)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-muted-foreground">
                        ${plan.price_annual}/year
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Included Features:</h4>
                    {plan.included_skus.map((skuCode) => {
                      const sku = skus?.find(s => s.sku_code === skuCode);
                      return sku ? (
                        <div key={skuCode} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success" />
                          <span>{sku.sku_name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="pt-4">
                    {hasActiveTrial(plan.plan_code) ? (
                      <Button variant="outline" disabled className="w-full">
                        Trial Active
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => requestTrial(plan.plan_code)}
                        variant={plan.is_popular ? 'default' : 'outline'}
                        className="w-full gap-2"
                      >
                        <Crown className="h-4 w-4" />
                        Start {plan.trial_days}-Day Trial
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skus?.map((sku) => (
              <Card key={sku.sku_code}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {getCategoryIcon(sku.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sku.sku_name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {sku.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{sku.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {sku.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span>{feature.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Trials Section */}
      {activeTrials && activeTrials.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Active Trials
            </CardTitle>
            <CardDescription>
              Your current trial subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTrials.map((trial) => {
                const daysLeft = Math.ceil(
                  (new Date(trial.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={trial.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{trial.plan_name}</h4>
                      <Badge variant={daysLeft > 7 ? 'default' : 'destructive'}>
                        {daysLeft} days left
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {new Date(trial.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* AI Integration for Plans */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="plans-billing" 
        companyId="demo-company" 
        enabledFeatures={['real-time-insights', 'contextual-help', 'strategic-planning']}
      />
    </div>
  );
};

export default PlansPage;