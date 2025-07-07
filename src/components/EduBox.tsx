import React, { useState } from 'react';
import { HelpCircle, BookOpen, PlayCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface EduBoxProps {
  title: string;
  description: string;
  howToUse: string;
  linkedFeatures: string[];
  userLevel: 'employee' | 'manager' | 'hr_admin' | 'system_admin';
  hasVideo?: boolean;
  hasPdf?: boolean;
  children: React.ReactNode;
}

const EduBox: React.FC<EduBoxProps> = ({
  title,
  description,
  howToUse,
  linkedFeatures,
  userLevel,
  hasVideo = false,
  hasPdf = false,
  children
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t, isRTL } = useLanguage();

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'employee': return 'bg-status-info';
      case 'manager': return 'bg-primary';
      case 'hr_admin': return 'bg-accent';
      case 'system_admin': return 'bg-status-danger';
      default: return 'bg-muted';
    }
  };

  const getUserLevelText = (level: string) => {
    const levels = {
      employee: isRTL ? 'موظف' : 'Employee',
      manager: isRTL ? 'مدير' : 'Manager', 
      hr_admin: isRTL ? 'مدير موارد بشرية' : 'HR Admin',
      system_admin: isRTL ? 'مدير نظام' : 'System Admin'
    };
    return levels[level as keyof typeof levels] || level;
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
        <HelpCircle className={`h-4 w-4 text-muted-foreground absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} opacity-50 hover:opacity-100 transition-opacity`} />
      </div>

      {showTooltip && (
        <Card className={`absolute z-50 w-80 shadow-lg border ${isRTL ? 'right-0' : 'left-0'} top-full mt-2`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              <Badge 
                variant="secondary" 
                className={`${getUserLevelColor(userLevel)} text-white text-xs`}
              >
                {getUserLevelText(userLevel)}
              </Badge>
            </div>
            <CardDescription className="text-xs">{description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-foreground mb-1">
                {isRTL ? 'كيفية الاستخدام:' : 'How to use:'}
              </h4>
              <p className="text-xs text-muted-foreground">{howToUse}</p>
            </div>

            {linkedFeatures.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">
                  {isRTL ? 'مرتبط بـ:' : 'Linked to:'}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {linkedFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {hasVideo && (
                <Button size="sm" variant="outline" className="text-xs h-7">
                  <PlayCircle className="h-3 w-3 mr-1" />
                  {isRTL ? 'فيديو' : 'Video'}
                </Button>
              )}
              {hasPdf && (
                <Button size="sm" variant="outline" className="text-xs h-7">
                  <FileText className="h-3 w-3 mr-1" />
                  {isRTL ? 'دليل' : 'Guide'}
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs h-7">
                <BookOpen className="h-3 w-3 mr-1" />
                {isRTL ? 'تعلم المزيد' : 'Learn More'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EduBox;