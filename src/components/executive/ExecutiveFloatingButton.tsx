import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  X, 
  Brain,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ExecutiveFloatingButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isArabic } = useSimpleLanguage();
  const navigate = useNavigate();

  const quickStats = [
    {
      icon: Users,
      label: isArabic ? 'الموظفين النشطين' : 'Active Employees',
      value: '1,247',
      trend: '+12%'
    },
    {
      icon: TrendingUp,
      label: isArabic ? 'الأداء العام' : 'Overall Performance',
      value: '94.2%',
      trend: '+5.3%'
    },
    {
      icon: Target,
      label: isArabic ? 'أهداف مكتملة' : 'Goals Completed',
      value: '87%',
      trend: '+8%'
    }
  ];

  const quickActions = [
    {
      icon: BarChart3,
      label: isArabic ? 'لوحة التحكم التنفيذية' : 'Executive Dashboard',
      action: () => navigate('/executive-center')
    },
    {
      icon: Brain,
      label: isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights',
      action: () => navigate('/executive-center')
    },
    {
      icon: Zap,
      label: isArabic ? 'التحليلات المتقدمة' : 'Advanced Analytics',
      action: () => navigate('/executive-center')
    }
  ];

  if (isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <Card className="w-80 shadow-2xl border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">
                  {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence'}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              {isArabic ? 'نظرة سريعة على أهم المؤشرات' : 'Quick overview of key metrics'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Stats */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {isArabic ? 'المؤشرات الرئيسية' : 'Key Metrics'}
              </h4>
              <div className="space-y-2">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{stat.value}</span>
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
              </h4>
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="w-full justify-start h-8 px-2 hover:bg-primary/10"
                  >
                    <action.icon className="h-3 w-3 mr-2" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => navigate('/executive-center')}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="sm"
            >
              <Crown className="h-3 w-3 mr-2" />
              {isArabic ? 'فتح المركز التنفيذي' : 'Open Executive Center'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsExpanded(true)}
        className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        size="icon"
      >
        <Crown className="h-6 w-6" />
      </Button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
    </div>
  );
};