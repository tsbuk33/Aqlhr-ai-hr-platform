import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Mail } from 'lucide-react';
import { usePlans, Plan } from '@/hooks/usePlans';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredFeature: string;
  title?: string;
  description?: string;
}

export function UpsellModal({ isOpen, onClose, requiredFeature, title, description }: UpsellModalProps) {
  const { availablePlans, currentPlan, upgradePlan } = usePlans();

  const getFeatureDescription = (feature: string) => {
    const descriptions: Record<string, string> = {
      'cci_playbook': 'Culture Change Intelligence Playbook',
      'cci_exports': 'CCI Export Capabilities',
      'compliance_autopilot': 'Automated Compliance Monitoring',
      'executive_intelligence': 'Executive Intelligence Center',
      'advanced_analytics': 'Advanced Analytics & Reports',
      'api_access': 'API Access & Integrations',
      'custom_integrations': 'Custom Integrations',
      'dedicated_support': '24/7 Dedicated Support'
    };
    return descriptions[feature] || feature;
  };

  const getRecommendedPlans = () => {
    return availablePlans.filter(plan => 
      plan.features.includes(requiredFeature) && 
      plan.code !== currentPlan?.plan_code
    );
  };

  const recommendedPlans = getRecommendedPlans();

  const handleUpgrade = async (planCode: string) => {
    await upgradePlan(planCode);
    onClose();
  };

  const handleContactSales = () => {
    const subject = encodeURIComponent('Enterprise Plan Inquiry');
    const body = encodeURIComponent(
      `Hi there,\n\nI'm interested in learning more about the Enterprise plan and its features.\n\nSpecifically, I need access to: ${getFeatureDescription(requiredFeature)}\n\nCould you please provide more information about pricing and implementation?\n\nThank you!`
    );
    window.open(`mailto:sales@aqlhr.com?subject=${subject}&body=${body}`, '_blank');
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'growth':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'enterprise':
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            {title || 'Upgrade Required'}
          </DialogTitle>
          <DialogDescription>
            {description || `To access ${getFeatureDescription(requiredFeature)}, please upgrade to a plan that includes this feature.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Display */}
          {currentPlan && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">{currentPlan.plan_name}</p>
                </div>
                <Badge variant="outline">
                  ${currentPlan.price_mo}/month
                </Badge>
              </div>
            </div>
          )}

          {/* Recommended Plans */}
          <div className="grid gap-4 md:grid-cols-2">
            {recommendedPlans.map((plan) => (
              <div key={plan.code} className="border rounded-lg p-6 relative">
                {plan.code === 'enterprise' && (
                  <Badge className="absolute -top-2 left-4 bg-purple-500">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  {getPlanIcon(plan.code)}
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold">
                    ${plan.price_mo}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">Key Features:</h4>
                  {plan.features.slice(0, 6).map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{getFeatureDescription(feature)}</span>
                      {feature === requiredFeature && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <p className="text-sm text-muted-foreground">
                      + {plan.features.length - 6} more features
                    </p>
                  )}
                </div>

                {plan.code === 'enterprise' ? (
                  <Button onClick={handleContactSales} className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Sales
                  </Button>
                ) : (
                  <Button onClick={() => handleUpgrade(plan.code)} className="w-full">
                    Upgrade to {plan.name}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {recommendedPlans.length === 0 && (
            <div className="text-center py-8">
              <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Feature Available in Higher Plans</h3>
              <p className="text-muted-foreground mb-4">
                The {getFeatureDescription(requiredFeature)} feature is available in our premium plans.
              </p>
              <Button onClick={handleContactSales} className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Sales for Details
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}