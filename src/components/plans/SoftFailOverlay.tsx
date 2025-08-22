import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, ArrowRight } from 'lucide-react';

interface SoftFailOverlayProps {
  title: string;
  description: string;
  requiredPlan: string;
  onUpgrade: () => void;
  onRequestTrial?: () => void;
  children: React.ReactNode;
}

export const SoftFailOverlay: React.FC<SoftFailOverlayProps> = ({
  title,
  description,
  requiredPlan,
  onUpgrade,
  onRequestTrial,
  children
}) => {
  return (
    <div className="relative">
      {/* Content with overlay */}
      <div className="relative">
        <div className="pointer-events-none opacity-50 blur-sm">
          {children}
        </div>
        
        {/* Overlay card */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <Card className="max-w-md mx-auto shadow-lg border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5" />
                Premium Feature
              </CardTitle>
              <CardDescription>
                Upgrade to access {title}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
                <Badge variant="outline" className="mb-4">
                  Requires {requiredPlan}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={onUpgrade} 
                  className="w-full gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                {onRequestTrial && (
                  <Button 
                    variant="outline" 
                    onClick={onRequestTrial}
                    className="w-full"
                  >
                    Start Free Trial
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};