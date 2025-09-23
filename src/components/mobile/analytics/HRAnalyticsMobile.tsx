import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  BarChart3, 
  Users, 
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  GraduationCap,
  Award,
  Briefcase,
  PieChart
} from 'lucide-react';
import { EmployeeLifecycleAnalytics } from './EmployeeLifecycleAnalytics';
import { CompensationAnalysis } from './CompensationAnalysis';
import { TurnoverPredictionDashboard } from './TurnoverPredictionDashboard';
import { ComplianceRiskAnalytics } from './ComplianceRiskAnalytics';
import { TrainingEffectivenessMetrics } from './TrainingEffectivenessMetrics';

interface HRAnalyticsMobileProps {
  user?: any;
}

export const HRAnalyticsMobile: React.FC<HRAnalyticsMobileProps> = ({ user }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [activeTab, setActiveTab] = useState('overview');

  const analyticsModules = [
    {
      key: 'lifecycle',
      icon: <Users className="h-5 w-5" />,
      labelEn: 'Lifecycle Analytics',
      labelAr: 'تحليل دورة الحياة',
      description: isArabic ? 'تحليل مراحل الموظفين' : 'Employee journey analysis'
    },
    {
      key: 'compensation',
      icon: <DollarSign className="h-5 w-5" />,
      labelEn: 'Compensation',
      labelAr: 'التعويضات',
      description: isArabic ? 'تحليل الرواتب والمكافآت' : 'Salary & benefits analysis'
    },
    {
      key: 'recruitment',
      icon: <Briefcase className="h-5 w-5" />,
      labelEn: 'Recruitment',
      labelAr: 'التوظيف',
      description: isArabic ? 'تحليل عمليات التوظيف' : 'Hiring pipeline analytics'
    },
    {
      key: 'performance',
      icon: <Target className="h-5 w-5" />,
      labelEn: 'Performance',
      labelAr: 'الأداء',
      description: isArabic ? 'تحليل أداء الموظفين' : 'Performance distribution'
    },
    {
      key: 'turnover',
      icon: <TrendingUp className="h-5 w-5" />,
      labelEn: 'Turnover',
      labelAr: 'دوران الموظفين',
      description: isArabic ? 'توقع دوران الموظفين' : 'Turnover prediction'
    },
    {
      key: 'compliance',
      icon: <Shield className="h-5 w-5" />,
      labelEn: 'Compliance',
      labelAr: 'الامتثال',
      description: isArabic ? 'تحليل مخاطر الامتثال' : 'Compliance risk analysis'
    },
    {
      key: 'training',
      icon: <GraduationCap className="h-5 w-5" />,
      labelEn: 'Training',
      labelAr: 'التدريب',
      description: isArabic ? 'فعالية التدريب' : 'Training effectiveness'
    },
    {
      key: 'roi',
      icon: <PieChart className="h-5 w-5" />,
      labelEn: 'HR ROI',
      labelAr: 'عائد الاستثمار',
      description: isArabic ? 'عائد استثمار الموارد البشرية' : 'HR return on investment'
    },
    {
      key: 'talent',
      icon: <Award className="h-5 w-5" />,
      labelEn: 'Talent Pipeline',
      labelAr: 'أنابيب المواهب',
      description: isArabic ? 'تقييم أنابيب المواهب' : 'Talent pipeline assessment'
    }
  ];

  const overviewMetrics = [
    {
      label: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: '247',
      trend: 'up',
      change: '+12',
      period: isArabic ? 'هذا الشهر' : 'this month'
    },
    {
      label: isArabic ? 'معدل الاستبقاء' : 'Retention Rate',
      value: '87%',
      trend: 'up',
      change: '+3%',
      period: isArabic ? 'مقارنة بالعام الماضي' : 'vs last year'
    },
    {
      label: isArabic ? 'درجة الرضا' : 'Satisfaction Score',
      value: '4.2',
      trend: 'up',
      change: '+0.3',
      period: isArabic ? 'من 5' : 'out of 5'
    },
    {
      label: isArabic ? 'وقت التوظيف' : 'Time to Hire',
      value: '18',
      trend: 'down',
      change: '-3',
      period: isArabic ? 'يوم' : 'days'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'المؤشرات الرئيسية' : 'Key Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {overviewMetrics.map((metric, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {metric.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 text-green-500" /> :
                    <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                  }
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} {metric.period}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Modules Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'وحدات التحليل' : 'Analytics Modules'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {analyticsModules.map((module) => (
              <Card 
                key={module.key}
                className="cursor-pointer hover:shadow-md transition-shadow border-muted"
                onClick={() => setActiveTab(module.key)}
              >
                <CardContent className="p-3 text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    {React.cloneElement(module.icon, { className: 'h-5 w-5 text-primary' })}
                  </div>
                  <h3 className="font-medium text-sm mb-1">
                    {isArabic ? module.labelAr : module.labelEn}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'رؤى حديثة' : 'Recent Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {isArabic ? 'تحسن في معدل الاستبقاء' : 'Retention Rate Improved'}
                  </p>
                  <p className="text-xs text-green-700">
                    {isArabic ? 
                      'ارتفع معدل استبقاء الموظفين بنسبة 8% هذا الربع' :
                      'Employee retention increased by 8% this quarter'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {isArabic ? 'تحقيق أهداف الأداء' : 'Performance Goals Met'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {isArabic ? 
                      '92% من الموظفين حققوا أهدافهم الربعية' :
                      '92% of employees met their quarterly targets'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {isArabic ? 'تحديث برامج التدريب' : 'Training Program Update'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? 
                      'إكمال 156 موظف للدورات التدريبية هذا الشهر' :
                      '156 employees completed training courses this month'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecruitmentAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {isArabic ? 'تحليل التوظيف' : 'Recruitment Analytics'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pipeline Stages */}
          <div className="space-y-3">
            {[
              { stage: 'Applications', stageAr: 'الطلبات', count: 156, conversion: 45 },
              { stage: 'Screening', stageAr: 'الفرز', count: 71, conversion: 68 },
              { stage: 'Interview', stageAr: 'المقابلة', count: 48, conversion: 75 },
              { stage: 'Offer', stageAr: 'العرض', count: 36, conversion: 89 },
              { stage: 'Hired', stageAr: 'التوظيف', count: 32, conversion: 100 }
            ].map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {isArabic ? stage.stageAr : stage.stage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage.count} {isArabic ? 'مرشح' : 'candidates'}
                  </p>
                </div>
                <Badge variant="secondary">
                  {stage.conversion}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">
              {isArabic ? 'تحليلات الموارد البشرية' : 'HR Analytics'}
            </h2>
            <p className="text-xs opacity-80">
              {isArabic ? 'تحليلات وإحصائيات شاملة' : 'Comprehensive insights & metrics'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-4 text-xs">
            <TabsTrigger value="overview" className="text-xs">
              {isArabic ? 'عام' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="lifecycle" className="text-xs">
              {isArabic ? 'دورة الحياة' : 'Lifecycle'}
            </TabsTrigger>
            <TabsTrigger value="compensation" className="text-xs">
              {isArabic ? 'تعويضات' : 'Pay'}
            </TabsTrigger>
            <TabsTrigger value="turnover" className="text-xs">
              {isArabic ? 'دوران' : 'Turnover'}
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs">
              {isArabic ? 'امتثال' : 'Compliance'}
            </TabsTrigger>
            <TabsTrigger value="training" className="text-xs">
              {isArabic ? 'تدريب' : 'Training'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="lifecycle" className="space-y-4">
            <EmployeeLifecycleAnalytics />
          </TabsContent>

          <TabsContent value="compensation" className="space-y-4">
            <CompensationAnalysis />
          </TabsContent>

          <TabsContent value="turnover" className="space-y-4">
            <TurnoverPredictionDashboard />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <ComplianceRiskAnalytics />
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <TrainingEffectivenessMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};