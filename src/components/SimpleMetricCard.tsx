import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

interface SimpleMetricCardProps {
  titleEn: string;
  titleAr: string;
  value: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "default";
  trend?: {
    valueEn: string;
    valueAr: string;
    isPositive: boolean;
  };
}

const getVariantClasses = (variant?: string) => {
  switch (variant) {
    case "primary":
      return "bg-gradient-to-br from-brand-primary to-brand-primary-light text-primary-foreground";
    case "secondary":
      return "bg-gradient-to-br from-brand-secondary to-brand-secondary text-primary-foreground";
    case "accent":
      return "bg-gradient-to-br from-brand-accent to-purple-400 text-primary-foreground";
    case "success":
      return "bg-gradient-to-br from-brand-success to-green-400 text-primary-foreground";
    case "warning":
      return "bg-gradient-to-br from-brand-warning to-orange-400 text-primary-foreground";
    default:
      return "bg-surface border border-border";
  }
};

export function SimpleMetricCard({
  titleEn,
  titleAr,
  value,
  descriptionEn,
  descriptionAr,
  icon,
  variant = "default",
  trend
}: SimpleMetricCardProps) {
  const { isArabic } = useSimpleLanguage();
  const variantClasses = getVariantClasses(variant);
  const isColored = variant !== "default";

  return (
    <Card className={`${variantClasses} ${isColored ? 'border-0' : ''}`}>
      <CardContent className="p-6">
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
            <h3 className={`text-sm font-medium mb-2 ${isColored ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
              {isArabic ? titleAr : titleEn}
            </h3>
            <div className={`text-3xl font-bold mb-1 number-display ${isColored ? 'text-primary-foreground' : 'text-foreground'}`}>
              {value}
            </div>
            <p className={`text-sm mb-2 ${isColored ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
              {isArabic ? descriptionAr : descriptionEn}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm ${isColored ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {isArabic ? trend.valueAr : trend.valueEn}
                </span>
                {trend.isPositive && (
                  <span className={`text-sm ${isColored ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {isArabic ? '↙' : '↗'}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={`text-2xl ${isColored ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}