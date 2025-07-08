import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocalization } from "@/hooks/useLocalization";

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
  default: "bg-surface border-border",
  primary: "bg-gradient-primary text-white border-transparent",
  secondary: "bg-gradient-secondary text-white border-transparent", 
  accent: "bg-gradient-accent text-white border-transparent",
  success: "bg-status-success text-white border-transparent",
  warning: "bg-status-warning text-white border-transparent",
  danger: "bg-status-danger text-white border-transparent",
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
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              isColored ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-2xl font-bold",
              isColored ? "text-white" : "text-foreground"
            )}>
              {formatValue(value)}
            </p>
            {description && (
              <p className={cn(
                "text-xs",
                isColored ? "text-white/70" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive 
                    ? (isColored ? "text-green-200" : "text-status-success")
                    : (isColored ? "text-red-200" : "text-status-danger")
                )}>
                  {trend.isPositive ? "↗" : "↘"} {formatTrendValue(trend.value)}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl",
            isColored 
              ? "bg-white/20 text-white" 
              : "bg-surface-secondary text-muted-foreground"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}