import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Sparkles } from 'lucide-react';

interface UpsellRibbonProps {
  title: string;
  description: string;
  onRequestTrial: () => void;
  isTrialAccess?: boolean;
  trialExpiresAt?: string;
  loading?: boolean;
}

export const UpsellRibbon: React.FC<UpsellRibbonProps> = ({
  title,
  description,
  onRequestTrial,
  isTrialAccess = false,
  trialExpiresAt,
  loading = false
}) => {
  const daysLeft = trialExpiresAt ? 
    Math.ceil((new Date(trialExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (isTrialAccess) {
    return (
      <Alert className="mb-6 border-warning bg-warning/5">
        <Clock className="h-4 w-4 text-warning" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <span className="font-medium">Trial Active:</span> {title} - {daysLeft} days remaining
          </div>
          <Button size="sm" variant="outline">
            Upgrade Now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 border-primary bg-primary/5">
      <Sparkles className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">{title}:</span> {description}
        </div>
        <Button 
          size="sm" 
          onClick={onRequestTrial}
          disabled={loading}
          className="gap-2"
        >
          <Crown className="h-4 w-4" />
          {loading ? 'Starting...' : 'Request Trial'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};