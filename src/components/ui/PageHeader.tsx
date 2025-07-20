import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, HelpCircle, Bell, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAqlHRLocalization from '@/hooks/useAqlHRLocalization';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSettings?: boolean;
  showHelp?: boolean;
  showNotifications?: boolean;
  isPremium?: boolean;
  badges?: string[];
  customBadges?: Array<{ text: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' }>;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  showBackButton = false,
  backUrl = '/',
  showSettings = false,
  showHelp = false,
  showNotifications = false,
  isPremium = false,
  badges = [],
  customBadges = [],
  children,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isArabic, platformBranding, dir, textAlign } = useAqlHRLocalization();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`space-y-4 ${className}`} dir={dir}>
      {/* Main Header */}
      <Card className="border-brand-primary/20 bg-gradient-to-r from-background via-background to-brand-primary/5">
        <CardHeader className="pb-4">
          <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="hover:bg-brand-primary/10"
                >
                  <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                </Button>
              )}
              
              <div className={textAlign}>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isPremium && (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  )}
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {title || (isArabic ? 'صفحة عقل HR' : 'AqlHR Page')}
                  </CardTitle>
                </div>
                
                {subtitle && (
                  <p className="text-lg text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
                
                {description && (
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                    {description}
                  </p>
                )}
                
                {/* Badges */}
                {(badges.length > 0 || customBadges.length > 0) && (
                  <div className={`flex flex-wrap gap-2 mt-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-brand-primary/10 text-brand-primary">
                        {badge}
                      </Badge>
                    ))}
                    
                    {customBadges.map((badge, index) => {
                      const variantClasses = {
                        default: 'bg-primary/10 text-primary',
                        secondary: 'bg-secondary/10 text-secondary',
                        success: 'bg-brand-success/10 text-brand-success',
                        warning: 'bg-brand-warning/10 text-brand-warning',
                        danger: 'bg-status-danger/10 text-status-danger'
                      };
                      
                      return (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className={variantClasses[badge.variant] || variantClasses.default}
                        >
                          {badge.text}
                        </Badge>
                      );
                    })}
                    
                    {/* AqlHR Platform Badge */}
                    <Badge variant="outline" className="border-brand-accent text-brand-accent">
                      {platformBranding.name}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {showNotifications && (
                <Button variant="ghost" size="sm" className="hover:bg-brand-primary/10">
                  <Bell className="h-4 w-4" />
                </Button>
              )}
              
              {showSettings && (
                <Button variant="ghost" size="sm" className="hover:bg-brand-primary/10">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              
              {showHelp && (
                <Button variant="ghost" size="sm" className="hover:bg-brand-primary/10">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {children && (
          <CardContent className="pt-0">
            {children}
          </CardContent>
        )}
      </Card>
      
      {/* Platform Status Banner */}
      <div className={`flex items-center justify-between p-3 bg-brand-success/10 border border-brand-success/20 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 text-sm ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="w-2 h-2 bg-brand-success rounded-full animate-pulse"></div>
          <span className="text-brand-success font-medium">
            {isArabic ? 'جميع أنظمة عقل HR تعمل بشكل طبيعي' : 'All AqlHR systems operational'}
          </span>
        </div>
        
        <div className={`flex items-center gap-3 text-xs text-muted-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>
            {isArabic ? 'وقت التشغيل: 99.9%' : 'Uptime: 99.9%'}
          </span>
          <span>|</span>
          <span>
            {isArabic ? '105+ وحدة نشطة' : '105+ Active Modules'}
          </span>
          <span>|</span>
          <span>
            {isArabic ? 'ذكاء عقل HR نشط' : 'AqlHR AI Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;