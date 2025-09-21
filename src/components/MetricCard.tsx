import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocalization } from "@/hooks/useLocalization";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  className?: string;
  type?: 'currency' | 'number' | 'percentage' | 'days' | 'hours' | 'text';
  currency?: 'SAR' | 'USD';
}

const variantStyles = {
  default: "bg-card border-border text-card-foreground",
  primary: "bg-brand-primary text-primary-foreground border-transparent",
  secondary: "bg-brand-secondary text-primary-foreground border-transparent", 
  accent: "bg-brand-accent text-primary-foreground border-transparent",
  success: "bg-status-success text-primary-foreground border-transparent",
  warning: "bg-status-warning text-primary-foreground border-transparent",
  danger: "bg-status-danger text-primary-foreground border-transparent",
};

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  variant = "default",
  className,
  type = 'text',
  currency = 'SAR'
}: MetricCardProps) {
  const isColored = variant !== "default";
  const { currency: formatCurrency, number, percentage, days, hours } = useLocalization();
  const { isArabic } = useSimpleLanguage();
  const isRTL = isArabic;
  
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (type) {
      case 'currency':
        return formatCurrency(val, currency);
      case 'number':
        return number(val);
      case 'percentage':
        return percentage(val);
      case 'days':
        return days(val).toString();
      case 'hours':
        return hours(val).toString();
      default:
        return val.toString();
    }
  };

  const formatTrendValue = (trendVal: string | number): string => {
    if (typeof trendVal === 'string') return trendVal;
    
    switch (type) {
      case 'percentage':
        return percentage(trendVal);
      case 'number':
        return number(trendVal);
      default:
        return trendVal.toString();
    }
  };
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className={cn(
          "flex items-center justify-between gap-4",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <div className="space-y-2 flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              isColored ? "text-primary-foreground/90" : "text-muted-foreground",
              isRTL ? "text-right" : "text-left"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-2xl font-bold",
              isColored ? "text-primary-foreground" : "text-foreground",
              isRTL ? "text-right" : "text-left"
            )}>
              {formatValue(value)}
            </p>
            {description && (
              <p className={cn(
                "text-xs text-ellipsis overflow-hidden",
                isColored ? "text-primary-foreground/80" : "text-muted-foreground",
                isRTL ? "text-right" : "text-left"
              )}>
                {description}
              </p>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1",
                isRTL ? "justify-end" : "justify-start"
              )}>
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive 
                    ? (isColored ? "text-primary-foreground/90" : "text-status-success")
                    : (isColored ? "text-primary-foreground/90" : "text-status-danger")
                )}>
                  {trend.isPositive ? "↗" : "↘"} {formatTrendValue(trend.value)}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl flex-shrink-0",
            isColored 
              ? "bg-primary-foreground/20 text-primary-foreground" 
              : "bg-surface-subtle text-muted-foreground"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}