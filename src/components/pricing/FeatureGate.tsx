import React, { useState } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { UpsellModal } from './UpsellModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeatureGateProps {
  featureKey: string;
  featureName?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeButton?: boolean;
  demoScreenshot?: string;
  onUpgrade?: () => void;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  featureKey,
  featureName,
  children,
  fallback,
  showUpgradeButton = true,
  demoScreenshot,
  onUpgrade
}) => {
  const { t } = useTranslation();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const { hasAccess, isLoading, subscriptionTier, requiredPlan } = useFeatureAccess(featureKey);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade action - could redirect to pricing page
      window.open('/pricing', '_blank');
    }
    setShowUpsellModal(false);
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked state
  return (
    <>
      <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/20">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 mb-4">
              <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {featureName ? 
              `Premium Feature: ${featureName}` : 
              t('premium_feature_locked')
            }
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t('upgrade_to_access_description')} {requiredPlan.join(' or ')} {t('to_unlock_feature')}
          </p>

          {showUpgradeButton && (
            <div className="space-y-3">
              <Button 
                onClick={() => setShowUpsellModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                size="lg"
              >
                <Crown className="h-4 w-4 mr-2" />
                {t('upgrade_now')}
              </Button>
              
              <div className="text-xs text-muted-foreground">
                {t('current_plan')}: {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        featureName={featureName || t('this_feature')}
        requiredPlans={requiredPlan}
        currentPlan={subscriptionTier}
        onUpgrade={handleUpgrade}
        demoScreenshot={demoScreenshot}
      />
    </>
  );
};