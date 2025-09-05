import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, CheckCircle, BarChart3, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAutomationMetrics } from '@/hooks/useAutomationMetrics';

interface AutomationMetricsDashboardProps {
  tenantId: string;
  days?: number;
  className?: string;
}

export const AutomationMetricsDashboard = ({ 
  tenantId, 
  days = 30,
  className = "" 
}: AutomationMetricsDashboardProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const { data: metrics, isLoading: loading, error } = useAutomationMetrics(tenantId, days);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-muted-foreground">
          {isArabic ? 'خطأ في تحميل البيانات' : 'Error loading metrics'}
        </div>
      </Card>
    );
  }

  const getAutomationBadgeVariant = (rate: number) => {
    if (rate >= 80) return "default";
    if (rate >= 60) return "secondary";
    return "outline";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {isArabic ? 'مقاييس الأتمتة' : 'Automation Metrics'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? `آخر ${days} يوم` : `Last ${days} days`}
            </p>
          </div>
          <Badge variant={getAutomationBadgeVariant(metrics.automation_rate)}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {metrics.automation_rate}% {isArabic ? 'معدل الأتمتة' : 'Automation Rate'}
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {isArabic ? 'إجمالي الأوامر' : 'Total Commands'}
            </div>
            <div className="text-2xl font-bold">{metrics.total_commands}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              {isArabic ? 'أوامر ناجحة' : 'Successful'}
            </div>
            <div className="text-2xl font-bold text-green-600">{metrics.successful_commands}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              {isArabic ? 'معدل النجاح' : 'Success Rate'}
            </div>
            <div className="text-2xl font-bold">
              {metrics.total_commands > 0 
                ? Math.round((metrics.successful_commands / metrics.total_commands) * 100)
                : 0}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              {isArabic ? 'متوسط النقاط' : 'Avg Score'}
            </div>
            <div className="text-2xl font-bold">
              <Badge variant={getScoreBadgeVariant(metrics.avg_automation_score)}>
                {metrics.avg_automation_score}
              </Badge>
            </div>
          </div>
        </div>

        {/* Top Automated Actions */}
        {metrics.top_automated_actions?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {isArabic ? 'أهم الإجراءات المؤتمتة' : 'Top Automated Actions'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {metrics.top_automated_actions.slice(0, 5).map((action, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Daily Metrics Preview */}
        {metrics.daily_metrics && Object.keys(metrics.daily_metrics).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {isArabic ? 'الاتجاه اليومي' : 'Daily Trend'}
            </h4>
            <div className="text-xs text-muted-foreground">
              {Object.keys(metrics.daily_metrics).length} {isArabic ? 'أيام من البيانات' : 'days of data available'}
            </div>
          </div>
        )}

        {/* Empty State */}
        {metrics.total_commands === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              {isArabic ? 'لا توجد بيانات أتمتة متاحة بعد' : 'No automation data available yet'}
            </p>
            <p className="text-xs mt-1">
              {isArabic ? 'استخدم مساعد الذكي الاصطناعي لبدء جمع البيانات' : 'Use the AI assistant to start collecting data'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};