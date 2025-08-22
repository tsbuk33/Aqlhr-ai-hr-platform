import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useFeatureGating } from '@/hooks/useFeatureGating';
import { UpsellModal } from '@/components/ui/upsell-modal';

interface FeatureGatedRouteProps {
  children: ReactNode;
  featureCode: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  upsellTitle?: string;
  upsellDescription?: string;
  upsellFeatures?: string[];
}

export function FeatureGatedRoute({
  children,
  featureCode,
  fallbackTitle = "Upgrade Required",
  fallbackDescription = "This feature requires a premium plan.",
  upsellTitle = "Unlock Premium Features",
  upsellDescription = "Get access to advanced capabilities with our Growth plan.",
  upsellFeatures = [
    "Show ROI automatically",
    "Weekly exec pdfs",
    "Read-only snapshot links (PDPL-safe)"
  ]
}: FeatureGatedRouteProps) {
  const { hasAccess, loading, showUpsell, hideUpsell, upsellOpen } = useFeatureGating(featureCode);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-lg w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{fallbackTitle}</h2>
            <p className="text-muted-foreground mb-6">
              {fallbackDescription}
            </p>
            <Button size="lg" onClick={showUpsell}>
              View Plans & Pricing
            </Button>
          </CardContent>
        </Card>
        
        <UpsellModal 
          open={upsellOpen}
          onOpenChange={hideUpsell}
          title={upsellTitle}
          description={upsellDescription}
          features={upsellFeatures}
        />
      </div>
    );
  }

  return <>{children}</>;
}