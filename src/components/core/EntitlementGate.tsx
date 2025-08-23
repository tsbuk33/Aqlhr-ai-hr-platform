import React from 'react';
import { useEntitlement } from '@/lib/core/useEntitlement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Zap } from 'lucide-react';

interface EntitlementGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
  description?: string;
}

export const EntitlementGate: React.FC<EntitlementGateProps> = ({ 
  feature, 
  children, 
  fallback,
  featureName = feature,
  description = "This feature requires additional permissions"
}) => {
  const { allowed, loading } = useEntitlement(feature);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">{featureName} Locked</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};