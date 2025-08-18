import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, TrendingUp, Shield, DollarSign, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';
import { AqlHRAIAssistant } from '@/components/ai';
import { AIToolsTester } from '@/components/ai/AIToolsTester';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { isArabic } = useSimpleLanguage();
  const { stats, alerts, loading } = useDashboardData();

  const getStatData = () => [
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: stats.totalEmployees.toString(),
      description: isArabic 
        ? `${stats.saudiEmployees} سعودي، ${stats.nonSaudiEmployees} غير سعودي`
        : `${stats.saudiEmployees} Saudi, ${stats.nonSaudiEmployees} Non-Saudi`,
      icon: Users,
    },
    {
      title: isArabic ? 'الحاضرون اليوم' : 'Present Today',
      value: stats.presentToday.toString(),
      description: isArabic 
        ? `معدل الحضور: ${stats.attendanceRate.toFixed(1)}%`
        : `Attendance rate: ${stats.attendanceRate.toFixed(1)}%`,
      icon: Clock,
    },
    {
      title: isArabic ? 'الإجازات المعلقة' : 'Pending Leaves',
      value: stats.pendingLeaves.toString(),
      description: isArabic ? 'في انتظار الموافقة' : 'Awaiting approval',
      icon: Calendar,
    },
    {
      title: isArabic ? 'مراجعات الأداء' : 'Performance Reviews',
      value: stats.performanceReviews.toString(),
      description: isArabic ? 'مستحقة هذا الشهر' : 'Due this month',
      icon: TrendingUp,
    }
  ];

  const getQuickActions = () => [
    {
      title: isArabic ? 'إدارة الموظفين' : 'Employee Management',
      description: isArabic ? 'إضافة وإدارة القوى العاملة' : 'Add and manage your workforce',
      content: isArabic 
        ? 'ابدأ بإضافة الموظفين إلى نظامك لفتح ميزات الحضور والرواتب والأداء.'
        : 'Start by adding employees to your system to unlock attendance, payroll, and performance features.',
      icon: Users,
    },
    {
      title: isArabic ? 'الصحة والسلامة' : 'Health & Safety',
      description: isArabic ? 'امتثال الصحة والسلامة وتتبع الحوادث' : 'HSE compliance and incident tracking',
      content: isArabic 
        ? 'إدارة سلامة مكان العمل وتتبع الحوادث وضمان الامتثال التنظيمي.'
        : 'Manage workplace safety, track incidents, and ensure regulatory compliance.',
      icon: Shield,
    },
    {
      title: isArabic ? 'الرواتب والتأمينات' : 'Payroll & GOSI',
      description: isArabic ? 'الامتثال السعودي والمزايا' : 'Saudi compliance and benefits',
      content: isArabic 
        ? 'التعامل مع حسابات الرواتب وتسجيل التأمينات والامتثال الحكومي.'
        : 'Handle payroll calculations, GOSI registration, and government compliance.',
      icon: DollarSign,
    }
  ];

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
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

  return (
    <div className={`space-y-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
          {isArabic ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-foreground-muted mt-2 text-lg">
          {isArabic ? 'مرحباً بك في منصة إدارة الموارد البشرية' : 'Welcome to your HR management platform'}
        </p>
      </div>

      {/* System Status */}
      <div className="space-y-4">
        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <Building2 className="h-5 w-5 text-brand-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {isArabic ? 'حالة النظام' : 'System Status'}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type);
            return (
              <Card key={alert.id} className={`border-l-4 ${getAlertVariant(alert.type)} transition-all duration-200 hover:shadow-md`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-3 text-sm font-medium ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <IconComponent className="h-4 w-4" />
                    {isArabic ? alert.titleAr : alert.title}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {isArabic ? 'نشط' : 'Active'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
                    {isArabic ? alert.messageAr : alert.message}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getStatData().map((stat, index) => (
          <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-surface to-surface-subtle border border-border-subtle hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <CardTitle className={`text-sm font-medium text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-brand-primary/10">
                <stat.icon className="h-5 w-5 text-brand-primary" />
              </div>
            </CardHeader>
            <CardContent className={isArabic ? 'text-right' : 'text-left'}>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-foreground-subtle">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className={`text-xl font-semibold text-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getQuickActions().map((action, index) => (
            <Card key={index} className="group relative overflow-hidden bg-gradient-to-br from-surface to-surface-raised border border-border-subtle hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <CardHeader className={isArabic ? 'text-right' : 'text-left'}>
                <CardTitle className={`flex items-center gap-3 text-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-brand-secondary/10 group-hover:bg-brand-secondary/20 transition-colors">
                    <action.icon className="h-5 w-5 text-brand-secondary" />
                  </div>
                  {action.title}
                </CardTitle>
                <CardDescription className={`text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-sm text-foreground-subtle leading-relaxed">
                  {action.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Tools Testing Suite - for development/testing purposes */}
      <AIToolsTester moduleContext="dashboard.overview" />

      {/* AI Assistant */}
      <AqlHRAIAssistant moduleContext="dashboard.overview" />
    </div>
  );
}