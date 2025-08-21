import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { UpsellModal } from './UpsellModal';
import { usePlans } from '@/hooks/usePlans';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpsell?: boolean;
  upsellTitle?: string;
  upsellDescription?: string;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpsell = true,
  upsellTitle,
  upsellDescription
}: FeatureGateProps) {
  const { hasFeature } = usePlans();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        const access = await hasFeature(feature);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureAccess();
  }, [feature, hasFeature]);

  if (loading) {
    return (
      <div className="animate-pulse bg-muted rounded-lg p-4">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Crown className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Premium Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This feature requires a higher plan
            </p>
            {showUpsell && (
              <Button onClick={() => setShowUpsellModal(true)} size="sm" className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        requiredFeature={feature}
        title={upsellTitle}
        description={upsellDescription}
      />
    </>
  );
}

// Convenience component for locked buttons
interface LockedButtonProps {
  feature: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: any;
  size?: any;
}

export function LockedButton({ feature, children, onClick, ...buttonProps }: LockedButtonProps) {
  const { hasFeature } = usePlans();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        const access = await hasFeature(feature);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureAccess();
  }, [feature, hasFeature]);

  const handleClick = () => {
    if (hasAccess) {
      onClick?.();
    } else {
      setShowUpsellModal(true);
    }
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={handleClick}
        disabled={loading}
      >
        {!hasAccess && <Lock className="h-4 w-4 mr-2" />}
        {children}
      </Button>

      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        requiredFeature={feature}
      />
    </>
  );
}