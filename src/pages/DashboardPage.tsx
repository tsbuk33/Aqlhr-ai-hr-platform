import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, TrendingUp, Shield, DollarSign, AlertTriangle, CheckCircle, Building2, Activity, FileText, Target, Brain, BarChart } from 'lucide-react';
import { AqlHRAIAssistant } from '@/components/ai';
import { AIToolsTester } from '@/components/ai/AIToolsTester';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useLiveDashboard } from '@/hooks/useLiveDashboard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { HijriCalendarWidget } from '@/components/calendar/HijriCalendarWidget';
import { toast } from 'sonner';
import { DeveloperTools } from '@/components/dev/DeveloperTools';

export default function DashboardPage() {
  const { isArabic } = useSimpleLanguage();
  const { 
    data: dashboardData, 
    loading, 
    error, 
    demoMode,
    isImpersonated,
    systemsOperational,
    tenantId,
    mode,
    refetch
  } = useLiveDashboard();

  const getSaudizationBadge = (rate: number) => {
    if (rate >= 60) return { variant: 'secondary' as const, text: isArabic ? 'أخضر' : 'Green' };
    if (rate >= 40) return { variant: 'outline' as const, text: isArabic ? 'أصفر' : 'Yellow' };
    return { variant: 'destructive' as const, text: isArabic ? 'أحمر' : 'Red' };
  };

  const getStatData = () => {
    if (!dashboardData) return [];
    
    const saudizationBadge = getSaudizationBadge(dashboardData.saudization_rate || 0);
    
    return [
      {
        title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
        value: dashboardData.total_employees?.toLocaleString() || '—',
        description: isArabic ? 'الموظفون النشطون' : 'Active employees',
        icon: Users,
        clickable: true,
        href: '/people/employees'
      },
      {
        title: isArabic ? 'نسبة السعودة' : 'Saudization Rate',
        value: dashboardData.saudization_rate ? `${dashboardData.saudization_rate.toFixed(1)}%` : '—',
        description: saudizationBadge.text,
        icon: Target,
        badge: saudizationBadge,
        clickable: true,
        href: '/compliance/nitaqat'
      },
      {
        title: isArabic ? 'نقاط السلامة' : 'HSE Safety Score',
        value: dashboardData.hse_safety_score ? `${dashboardData.hse_safety_score.toFixed(1)}` : '—',
        description: isArabic ? 'مؤشر السلامة (90 يوم)' : 'Safety index (90d)',
        icon: Shield,
        clickable: true,
        href: '/safety/incidents'
      },
      {
        title: isArabic ? 'نقاط الامتثال' : 'Compliance Score',
        value: dashboardData.compliance_score ? `${dashboardData.compliance_score.toFixed(1)}` : '—',
        description: isArabic ? 'التكامل والأتمتة' : 'Integrations & automation',
        icon: CheckCircle,
        clickable: true,
        href: '/compliance'
      },
      {
        title: isArabic ? 'تجربة الموظف' : 'Employee Experience',
        value: dashboardData.employee_experience_10 ? `${dashboardData.employee_experience_10.toFixed(1)}/10` : '—',
        description: isArabic ? 'من بيانات الثقافة المؤسسية' : 'From CCI data blend',
        icon: Brain,
        clickable: true,
        href: '/cci'
      },
      {
        title: isArabic ? 'المخاطر التنبؤية' : 'Predictive Risk',
        value: dashboardData.predictive_risk_high?.toString() || '—',
        description: isArabic ? 'موظفون عالي المخاطر' : 'High-risk employees',
        icon: AlertTriangle,
        clickable: true,
        href: '/people/risk'
      },
      {
        title: isArabic ? 'قوة خط المواهب' : 'Talent Pipeline',
        value: dashboardData.talent_pipeline_strength?.toString() || '—',
        description: isArabic ? 'نقاط قوة التوظيف' : 'Recruiting strength',
        icon: TrendingUp,
        clickable: true,
        href: '/recruiting'
      },
      {
        title: isArabic ? 'المستندات المعالجة' : 'Documents Processed',
        value: dashboardData.docs_processed?.toLocaleString() || '—',
        description: isArabic ? '30 يوم الماضية' : 'Last 30 days',
        icon: FileText,
        clickable: true,
        href: '/docs'
      },
      {
        title: isArabic ? 'ساعات التدريب' : 'Training Hours',
        value: dashboardData.training_hours ? `${Math.round(dashboardData.training_hours)}h` : '—',
        description: isArabic ? '90 يوم الماضية' : 'Last 90 days',
        icon: Activity,
        clickable: true,
        href: '/learning'
      },
      {
        title: isArabic ? 'دقة التنبؤ' : 'Forecast Accuracy',
        value: dashboardData.workforce_forecast_accuracy ? `${dashboardData.workforce_forecast_accuracy.toFixed(1)}%` : 'TBD',
        description: isArabic ? 'التنبؤ بالقوى العاملة' : 'Workforce forecasting',
        icon: BarChart,
        clickable: false
      }
    ];
  };

  const getSystemStatus = () => {
    if (!systemsOperational) {
      return {
        status: 'checking',
        title: isArabic ? 'جاري فحص الأنظمة...' : 'Checking Systems...',
        message: isArabic ? 'يتم فحص حالة الأنظمة' : 'System status check in progress',
        variant: 'warning'
      };
    }

    const { connected, total } = systemsOperational;
    const allSystemsOperational = connected === total && total > 0;
    
    return {
      status: allSystemsOperational ? 'operational' : 'attention',
      title: isArabic 
        ? (allSystemsOperational ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'تحتاج الأنظمة إلى انتباه')
        : (allSystemsOperational ? 'All Systems Operational' : 'Systems Need Attention'),
      message: isArabic
        ? `${connected} من ${total} أنظمة متصلة`
        : `${connected} of ${total} systems connected`,
      variant: allSystemsOperational ? 'success' : 'warning'
    };
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'success': return 'bg-status-success/10 border-l-status-success text-status-success';
      case 'warning': return 'bg-status-warning/10 border-l-status-warning text-status-warning';
      case 'critical': return 'bg-status-danger/10 border-l-status-danger text-status-danger';
      default: return 'bg-muted border-l-muted-foreground text-muted-foreground';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Array(10).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${isArabic ? 'rtl' : 'ltr'}`}>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">
              {isArabic ? 'خطأ في تحميل البيانات' : 'Error Loading Dashboard'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {isArabic 
                ? 'يرجى الذهاب إلى صفحة البيانات التجريبية لتحميل البيانات أولاً'
                : 'Please go to the Demo Data page to seed data first'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const systemStatus = getSystemStatus();
  const statData = getStatData();

  return (
    <div className={`space-y-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {isArabic ? 'لوحة التحكم التنفيذية' : 'Executive Dashboard'}
              </h1>
              {demoMode && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-200 dark:border-yellow-800">
                  {isArabic ? 'وضع التجربة' : 'Demo Mode'}
                </Badge>
              )}
              {isImpersonated && (
                <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/30 dark:text-purple-200 dark:border-purple-800">
                  {isArabic ? 'وضع المطور' : 'Dev Mode'}
                </Badge>
              )}
            </div>
            <p className="text-foreground-muted mt-2 text-lg">
              {isArabic ? 'عقل للموارد البشرية - منصة ذكية لإدارة المواهب' : 'AqlHR - Intelligent Talent Management Platform'}
              {tenantId && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({mode}: {tenantId.slice(0, 8)}...)
                </span>
              )}
            </p>
          </div>
          <div className="hidden lg:block">
            <HijriCalendarWidget />
          </div>
        </div>
      </div>

      {/* System Status */}
      {systemStatus && (
        <div className="space-y-4">
          <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Building2 className="h-5 w-5 text-brand-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {isArabic ? 'حالة النظام' : 'System Status'}
            </h2>
          </div>
          <Card className={`border-l-4 ${systemStatus.variant === 'success' ? 'bg-status-success/10 border-l-status-success text-status-success' : 'bg-status-warning/10 border-l-status-warning text-status-warning'} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-3 text-sm font-medium ${isArabic ? 'flex-row-reverse' : ''}`}>
                {systemStatus.variant === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {systemStatus.title}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {isArabic ? 'مباشر' : 'Live'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
                {systemStatus.message}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Executive KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statData.map((stat, index) => {
          const CardComponent = stat.clickable ? 'button' : 'div';
          return (
            <Card 
              key={index} 
              className={`relative overflow-hidden bg-gradient-to-br from-surface to-surface-subtle border border-border-subtle transition-all duration-300 ${stat.clickable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : ''}`}
              onClick={stat.clickable ? () => {
                // In a real app, you'd use router navigation
                toast.info(isArabic ? `الانتقال إلى ${stat.title}` : `Navigate to ${stat.title}`);
              } : undefined}
            >
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <CardTitle className={`text-xs font-medium text-foreground-muted ${isArabic ? 'text-right' : 'text-left'} leading-tight`}>
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-brand-primary/10 flex-shrink-0">
                  <stat.icon className="h-4 w-4 text-brand-primary" />
                </div>
              </CardHeader>
              <CardContent className={isArabic ? 'text-right' : 'text-left'}>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <p className="text-xs text-foreground-subtle">
                    {stat.description}
                  </p>
                  {stat.badge && (
                    <Badge variant={stat.badge.variant} className="text-xs">
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      {dashboardData && (
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold text-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
            {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <Brain className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {isArabic 
                      ? `نسبة السعودة ${dashboardData.saudization_rate?.toFixed(1)}% تتماشى مع أهداف رؤية 2030`
                      : `Saudization rate of ${dashboardData.saudization_rate?.toFixed(1)}% aligns with Vision 2030 goals`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <Shield className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {isArabic 
                      ? `مؤشر السلامة ${dashboardData.hse_safety_score?.toFixed(1)} يُظهر بيئة عمل آمنة`
                      : `Safety score of ${dashboardData.hse_safety_score?.toFixed(1)} indicates a secure work environment`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    {isArabic 
                      ? `تجربة الموظف ${dashboardData.employee_experience_10?.toFixed(1)}/10 تشير إلى مستوى رضا عالي`
                      : `Employee experience of ${dashboardData.employee_experience_10?.toFixed(1)}/10 shows high satisfaction`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AqlHRAIAssistant moduleContext="dashboard.executive" />

      {/* Developer Tools (shows in dev mode or demo/impersonation) */}
      <DeveloperTools onRefresh={refetch} />
    </div>
  );
}