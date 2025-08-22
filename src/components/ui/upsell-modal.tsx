import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";

interface UpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  features?: string[];
  planName?: string;
  price?: number;
  onUpgrade?: () => void;
}

export function UpsellModal({
  open,
  onOpenChange,
  title = "Upgrade Required",
  description = "This feature is available in our Growth plan and higher.",
  features = [
    "Show ROI automatically",
    "Weekly exec pdfs", 
    "Read-only snapshot links (PDPL-safe)"
  ],
  planName = "Growth Plan",
  price = 299,
  onUpgrade
}: UpsellModalProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default to external pricing page
      window.open('https://aqlhr.com/pricing', '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features List */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              What you get:
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Info */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{planName}</h3>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">{price} SAR</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Billed monthly • Cancel anytime
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              Upgrade Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ✨ 14-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}