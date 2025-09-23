import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3
} from 'lucide-react';

interface LifecycleStage {
  stage: string;
  stageAr: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  avgDuration: number;
}

interface EmployeeLifecycleAnalyticsProps {
  companyId?: string;
}

export const EmployeeLifecycleAnalytics: React.FC<EmployeeLifecycleAnalyticsProps> = ({ companyId }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const lifecycleStages: LifecycleStage[] = [
    {
      stage: 'Onboarding',
      stageAr: 'التأهيل',
      count: 12,
      percentage: 15,
      trend: 'up',
      avgDuration: 14
    },
    {
      stage: 'Probation',
      stageAr: 'فترة التجربة',
      count: 8,
      percentage: 10,
      trend: 'stable',
      avgDuration: 90
    },
    {
      stage: 'Active',
      stageAr: 'نشط',
      count: 145,
      percentage: 72,
      trend: 'up',
      avgDuration: 365
    },
    {
      stage: 'Performance Review',
      stageAr: 'مراجعة الأداء',
      count: 6,
      percentage: 3,
      trend: 'down',
      avgDuration: 30
    }
  ];

  const metrics = [
    {
      label: isArabic ? 'متوسط مدة التوظيف' : 'Avg Employment Duration',
      value: '2.3',
      unit: isArabic ? 'سنة' : 'years',
      trend: 'up',
      change: '+0.3'
    },
    {
      label: isArabic ? 'معدل الاستبقاء' : 'Retention Rate',
      value: '87',
      unit: '%',
      trend: 'up',
      change: '+5%'
    },
    {
      label: isArabic ? 'وقت التوظيف' : 'Time to Hire',
      value: '18',
      unit: isArabic ? 'يوم' : 'days',
      trend: 'down',
      change: '-3'
    },
    {
      label: isArabic ? 'تكلفة التوظيف' : 'Cost per Hire',
      value: '12,500',
      unit: isArabic ? 'ريال' : 'SAR',
      trend: 'down',
      change: '-8%'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isArabic ? 'تحليل دورة حياة الموظف' : 'Employee Lifecycle Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {isArabic ? 
                  (period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : period === 'quarter' ? 'ربع' : 'سنة') :
                  period.charAt(0).toUpperCase() + period.slice(1)
                }
              </Button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'مراحل دورة الحياة' : 'Lifecycle Stages'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lifecycleStages.map((stage, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedStage === stage.stage ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isArabic ? stage.stageAr : stage.stage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stage.count} {isArabic ? 'موظف' : 'employees'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stage.trend)}
                    <span className="text-lg font-bold">{stage.percentage}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? `${stage.avgDuration} يوم متوسط` : `${stage.avgDuration} days avg`}
                  </p>
                </div>
              </div>
              
              <Progress value={stage.percentage} className="h-2" />

              {selectedStage === stage.stage && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">
                        {isArabic ? 'المدة المتوقعة:' : 'Expected Duration:'}
                      </span>
                      <p className="font-medium">
                        {stage.avgDuration} {isArabic ? 'يوم' : 'days'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {isArabic ? 'معدل النجاح:' : 'Success Rate:'}
                      </span>
                      <p className="font-medium text-green-600">92%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'hire',
                employee: 'أحمد محمد',
                action: isArabic ? 'انضم للشركة' : 'Joined company',
                time: isArabic ? 'منذ ساعة' : '1 hour ago',
                stage: isArabic ? 'التأهيل' : 'Onboarding'
              },
              {
                type: 'promotion',
                employee: 'سارة أحمد',
                action: isArabic ? 'تمت ترقيتها' : 'Got promoted',
                time: isArabic ? 'منذ 3 ساعات' : '3 hours ago',
                stage: isArabic ? 'نشط' : 'Active'
              },
              {
                type: 'review',
                employee: 'محمد علي',
                action: isArabic ? 'مراجعة أداء' : 'Performance review',
                time: isArabic ? 'منذ يوم' : '1 day ago',
                stage: isArabic ? 'مراجعة الأداء' : 'Performance Review'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {activity.type === 'hire' && <UserPlus className="h-4 w-4 text-green-500" />}
                  {activity.type === 'promotion' && <Award className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'review' && <BarChart3 className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.employee}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {activity.stage}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};