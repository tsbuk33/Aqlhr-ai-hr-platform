import React from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  action?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  titleAr,
  description,
  descriptionAr,
  badge,
  badgeVariant = "default",
  action,
  className = ""
}) => {
  const { isArabic } = useSimpleLanguage();

  return (
    <div className={`w-full max-w-6xl mx-auto ${isArabic ? 'rtl-container' : 'ltr-container'} ${className}`}>
      {/* Page Header - Centered */}
      <div className="bg-gradient-to-r from-surface via-surface-raised to-surface-subtle border-b border-border/40 shadow-sm -m-4 sm:-m-6 lg:-m-8 mb-6 sm:mb-8 lg:mb-12 w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8 sm:py-8 w-full max-w-full">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-foreground bg-gradient-to-r from-foreground via-foreground to-foreground-muted bg-clip-text">
                {isArabic && titleAr ? titleAr : title}
              </h1>
              {badge && (
                <Badge variant={badgeVariant} className="text-xs font-medium px-3 py-1 shadow-sm flex-shrink-0">
                  {badge}
                </Badge>
              )}
            </div>
            {(description || descriptionAr) && (
              <p className="text-base sm:text-lg text-foreground-muted dark:text-foreground-muted font-medium max-w-3xl mx-auto leading-relaxed mb-4">
                {isArabic && descriptionAr ? descriptionAr : description}
              </p>
            )}
            {action && (
              <div className="flex justify-center">
                {action}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-6 sm:space-y-8 w-full max-w-full">
        {children}
      </div>
    </div>
  );
};

export const PageSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  className?: string;
}> = ({ children, title, titleAr, description, descriptionAr, className = "" }) => {
  const { isArabic } = useSimpleLanguage();

  return (
    <section className={`space-y-6 ${className}`}>
      {(title || titleAr) && (
        <div className={`space-y-2 ${isArabic ? 'text-right' : ''}`}>
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground">
            {isArabic && titleAr ? titleAr : title}
          </h2>
          {(description || descriptionAr) && (
            <p className="text-foreground-muted dark:text-foreground-muted font-medium">
              {isArabic && descriptionAr ? descriptionAr : description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

export const PageCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ 
  children, 
  title, 
  titleAr, 
  description, 
  descriptionAr, 
  icon, 
  badge, 
  action, 
  className = "", 
  hover = true 
}) => {
  const { isArabic } = useSimpleLanguage();

  return (
    <Card className={`${hover ? 'hover:shadow-lg hover:shadow-border/20 hover:border-border/60' : ''} transition-all duration-300 bg-surface dark:bg-surface backdrop-blur-sm border-border dark:border-border ${className}`}>
      {(title || titleAr || description || descriptionAr || icon || badge || action) && (
        <CardHeader>
          <div className={`flex items-start justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {icon && (
                <div className="p-2 bg-accent dark:bg-accent rounded-lg">
                  {icon}
                </div>
              )}
              <div className={`space-y-1 ${isArabic ? 'text-right' : ''}`}>
                {(title || titleAr) && (
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-xl font-semibold text-foreground dark:text-foreground">
                      {isArabic && titleAr ? titleAr : title}
                    </CardTitle>
                    {badge && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </div>
                )}
                {(description || descriptionAr) && (
                  <CardDescription className="text-foreground-muted dark:text-foreground-muted">
                    {isArabic && descriptionAr ? descriptionAr : description}
                  </CardDescription>
                )}
              </div>
            </div>
            {action && action}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};