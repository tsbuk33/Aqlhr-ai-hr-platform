import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Mail } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';

export default function PlansPage() {
  const { availablePlans, currentPlan, loading, upgradePlan } = usePlans();

  const getFeatureDescription = (feature: string) => {
    const descriptions: Record<string, string> = {
      'core_hr': 'Core HR Management',
      'basic_reports': 'Basic Reports & Analytics',
      'employee_management': 'Employee Management',
      'cci_playbook': 'Culture Change Intelligence Playbook',
      'cci_exports': 'CCI Export Capabilities',
      'compliance_autopilot': 'Automated Compliance Monitoring',
      'advanced_analytics': 'Advanced Analytics & Reports',
      'executive_intelligence': 'Executive Intelligence Center',
      'api_access': 'API Access & Integrations',
      'custom_integrations': 'Custom Integrations',
      'dedicated_support': '24/7 Dedicated Support'
    };
    return descriptions[feature] || feature;
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'starter':
        return <Star className="h-6 w-6 text-green-500" />;
      case 'growth':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'enterprise':
        return <Crown className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const handleContactSales = (planName: string) => {
    const subject = encodeURIComponent(`${planName} Plan Inquiry`);
    const body = encodeURIComponent(
      `Hi there,\n\nI'm interested in learning more about the ${planName} plan.\n\nCould you please provide more information about pricing and implementation?\n\nThank you!`
    );
    window.open(`mailto:sales@aqlhr.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleUpgrade = async (planCode: string) => {
    await upgradePlan(planCode);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scale your HR operations with the right plan for your organization. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Current Plan Display */}
      {currentPlan && (
        <Card className="max-w-md mx-auto bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{currentPlan.plan_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentPlan.seats} seat{currentPlan.seats !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">${currentPlan.price_mo}/mo</div>
                {currentPlan.is_trial && (
                  <Badge variant="outline" className="text-xs">
                    Trial {currentPlan.trial_ends_at ? `until ${new Date(currentPlan.trial_ends_at).toLocaleDateString()}` : ''}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {availablePlans.map((plan) => {
          const isCurrentPlan = currentPlan?.plan_code === plan.code;
          const isRecommended = plan.code === 'growth';

          return (
            <Card key={plan.code} className={`relative ${isRecommended ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'border-green-500 bg-green-50/50' : ''}`}>
              {isRecommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.code)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="pt-4">
                  <div className="text-4xl font-bold">
                    ${plan.price_mo}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  {plan.price_mo === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Forever free</p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{getFeatureDescription(feature)}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.code === 'enterprise' ? (
                    <Button 
                      onClick={() => handleContactSales(plan.name)} 
                      className="w-full gap-2"
                      variant={isRecommended ? 'default' : 'outline'}
                    >
                      <Mail className="h-4 w-4" />
                      Contact Sales
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleUpgrade(plan.code)} 
                      className="w-full"
                      variant={isRecommended ? 'default' : 'outline'}
                    >
                      {currentPlan && plan.price_mo > currentPlan.price_mo ? 'Upgrade' : 'Choose'} Plan
                    </Button>
                  )}
                </div>

                {/* Additional Info */}
                {plan.code === 'enterprise' && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Custom pricing available for large organizations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ/Additional Info */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-2 text-left">
          <details className="bg-muted/30 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">Can I change my plan at any time?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </details>
          <details className="bg-muted/30 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">What happens to my data if I downgrade?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Your data is always safe. Some features may become unavailable, but your data remains intact.
            </p>
          </details>
          <details className="bg-muted/30 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">Do you offer custom Enterprise solutions?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes! Contact our sales team to discuss custom pricing and features for large organizations.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}