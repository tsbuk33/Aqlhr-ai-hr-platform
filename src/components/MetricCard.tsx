import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  className?: string;
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
  className 
}: MetricCardProps) {
  const isColored = variant !== "default";
  
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
              {value}
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
                  {trend.isPositive ? "↗" : "↘"} {trend.value}
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