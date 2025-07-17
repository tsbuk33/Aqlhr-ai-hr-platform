import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  action?: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  border?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  title,
  description,
  icon,
  badge,
  badgeVariant = "secondary",
  action,
  className = "",
  hover = true,
  gradient = false,
  border = true
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-border/10 hover:-translate-y-1 hover:border-border/60",
        gradient && "bg-gradient-to-br from-surface via-surface-raised to-surface-subtle",
        !border && "border-0 shadow-lg",
        "backdrop-blur-sm border-border/40",
        className
      )}
    >
      {(title || description || icon || badge || action) && (
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {icon && (
                <div className="p-3 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-xl border border-brand-primary/20">
                  {icon}
                </div>
              )}
              <div className="space-y-2">
                {title && (
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text">
                      {title}
                    </CardTitle>
                    {badge && (
                      <Badge variant={badgeVariant} className="text-xs px-2 py-1 shadow-sm">
                        {badge}
                      </Badge>
                    )}
                  </div>
                )}
                {description && (
                  <CardDescription className="text-foreground-muted leading-relaxed">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  trend?: React.ReactNode;
  className?: string;
}> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description, 
  trend,
  className 
}) => {
  return (
    <EnhancedCard 
      className={cn("group", className)}
      hover={true}
      gradient={true}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-foreground-muted">
              {title}
            </h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {description && (
              <p className="text-xs text-foreground-subtle">
                {description}
              </p>
            )}
          </div>
          
          {change && (
            <div className="flex items-center gap-2">
              <Badge 
                variant={changeType === 'positive' ? 'default' : changeType === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs px-2 py-0.5"
              >
                {change}
              </Badge>
              <span className="text-xs text-foreground-muted">vs last period</span>
            </div>
          )}
        </div>
        
        {trend && (
          <div className="h-16 w-24 opacity-60 group-hover:opacity-100 transition-opacity">
            {trend}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  action?: React.ReactNode;
  status?: 'available' | 'coming-soon' | 'beta';
  className?: string;
}> = ({ title, description, icon, features, action, status = 'available', className }) => {
  return (
    <EnhancedCard
      title={title}
      description={description}
      icon={icon}
      badge={status === 'available' ? 'Available' : status === 'beta' ? 'Beta' : 'Coming Soon'}
      badgeVariant={status === 'available' ? 'default' : status === 'beta' ? 'secondary' : 'outline'}
      action={action}
      className={className}
      hover={true}
    >
      <div className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground-muted">
              <div className="w-1.5 h-1.5 bg-brand-success rounded-full"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </EnhancedCard>
  );
};