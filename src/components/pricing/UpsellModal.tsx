import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Shield, ArrowRight, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getSubscriptionTierDisplayName, getRequiredPlanNames } from '@/hooks/useFeatureAccess';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredPlans: string[];
  currentPlan: string;
  onUpgrade?: () => void;
  demoScreenshot?: string;
}

const getPlanIcon = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'growth':
      return <Zap className="h-5 w-5" />;
    case 'enterprise':
      return <Crown className="h-5 w-5" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
};

const getPlanColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'growth':
      return 'from-emerald-500 to-teal-600';
    case 'enterprise':
      return 'from-purple-500 to-indigo-600';
    default:
      return 'from-blue-500 to-cyan-600';
  }
};

export const UpsellModal: React.FC<UpsellModalProps> = ({
  isOpen,
  onClose,
  featureName,
  requiredPlans,
  currentPlan,
  onUpgrade,
  demoScreenshot
}) => {
  const { t } = useTranslation();
  const requiredPlanNames = getRequiredPlanNames(requiredPlans);
  const currentPlanDisplay = getSubscriptionTierDisplayName(currentPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="relative p-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {t('upgrade_to_access')} {featureName}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {t('feature_requires_plan')} {requiredPlanNames}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pt-0">
          {/* Demo Screenshot */}
          <div className="space-y-4">
            <div className="relative rounded-lg border-2 border-dashed border-muted overflow-hidden">
              {demoScreenshot ? (
                <img 
                  src={demoScreenshot} 
                  alt={`${featureName} demo`}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {t('demo_preview_protected')}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                  {t('demo_only')}
                </Badge>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('current_plan')}: <span className="font-medium">{currentPlanDisplay}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t('upgrade_to_unlock')} {featureName}
              </p>
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {t('available_plans')}
            </h3>
            
            <div className="space-y-3">
              {requiredPlans.map((plan) => (
                <Card key={plan} className="relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getPlanColor(plan)} opacity-5`} />
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(plan)}
                        <span>{getSubscriptionTierDisplayName(plan)}</span>
                      </div>
                      <Badge variant="outline" className="border-current">
                        {t('recommended')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-emerald-500" />
                        <span>{t('full_cci_access')}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-emerald-500" />
                        <span>{t('export_capabilities')}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-emerald-500" />
                        <span>{t('advanced_playbooks')}</span>
                      </li>
                      {plan.toLowerCase() === 'enterprise' && (
                        <li className="flex items-center space-x-2">
                          <ArrowRight className="h-3 w-3 text-emerald-500" />
                          <span>{t('white_label')}</span>
                        </li>
                      )}
                    </ul>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${getPlanColor(plan)} hover:opacity-90 text-white`}
                      onClick={onUpgrade}
                    >
                      {t('upgrade_to')} {getSubscriptionTierDisplayName(plan)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                {t('upgrade_benefits_notice')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};