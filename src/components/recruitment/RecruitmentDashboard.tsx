/**
 * AQLHR Recruitment Dashboard Component
 * Expert-level React component with advanced features and optimizations
 * @author AQLHR Development Team
 * @version 2.0.0
 */

import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useRecruitmentData } from '@/hooks/useRecruitmentData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Globe, 
  Shield, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  isLoading?: boolean;
}

interface PlatformStatusProps {
  platforms: any[];
  isLoading?: boolean;
}

interface ComplianceOverviewProps {
  services: any[];
  isLoading?: boolean;
}

interface InternationalAgentsProps {
  agents: any[];
  isLoading?: boolean;
}

/**
 * Metric Card Component with loading states and animations
 */
const MetricCard = memo<MetricCardProps>(({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  isLoading = false 
}) => {
  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/20 bg-primary/5',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    destructive: 'border-red-200 bg-red-50',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    destructive: 'text-red-600',
  };

  if (isLoading) {
    return (
      <Card className={cn('transition-all duration-200', variantStyles[variant])}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md cursor-pointer',
      variantStyles[variant]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            'text-xs flex items-center gap-1',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <TrendingUp className={cn(
              'h-3 w-3',
              !trend.isPositive && 'rotate-180'
            )} />
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

/**
 * Platform Status Overview Component
 */
const PlatformStatus = memo<PlatformStatusProps>(({ platforms, isLoading }) => {
  const { language } = useLanguage();
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const statusCounts = useMemo(() => {
    if (!platforms.length) return { active: 0, maintenance: 0, error: 0 };
    
    return platforms.reduce((acc, platform) => {
      acc[platform.status] = (acc[platform.status] || 0) + 1;
      return acc;
    }, { active: 0, maintenance: 0, error: 0 });
  }, [platforms]);

  const totalPlatforms = platforms.length;
  const activePercentage = totalPlatforms > 0 ? (statusCounts.active / totalPlatforms) * 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('حالة المنصات', 'Platform Status')}
        </CardTitle>
        <CardDescription>
          {t('مراقبة حالة جميع منصات التوظيف', 'Monitor all recruitment platform status')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('المنصات النشطة', 'Active Platforms')}</span>
            <span className="font-medium">{statusCounts.active}/{totalPlatforms}</span>
          </div>
          <Progress value={activePercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
            <div className="text-xs text-muted-foreground">
              {t('نشط', 'Active')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance}</div>
            <div className="text-xs text-muted-foreground">
              {t('صيانة', 'Maintenance')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">{statusCounts.error}</div>
            <div className="text-xs text-muted-foreground">
              {t('خطأ', 'Error')}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {platforms.slice(0, 5).map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  platform.status === 'active' ? 'bg-green-500' :
                  platform.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                )} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? platform.nameAr : platform.name}
                </span>
              </div>
              <Badge variant={
                platform.status === 'active' ? 'default' :
                platform.status === 'maintenance' ? 'secondary' : 'destructive'
              }>
                {platform.status === 'active' ? t('نشط', 'Active') :
                 platform.status === 'maintenance' ? t('صيانة', 'Maintenance') : t('خطأ', 'Error')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

PlatformStatus.displayName = 'PlatformStatus';

/**
 * Compliance Overview Component
 */
const ComplianceOverview = memo<ComplianceOverviewProps>(({ services, isLoading }) => {
  const { language } = useLanguage();
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const complianceStats = useMemo(() => {
    if (!services.length) return { averageScore: 0, compliant: 0, warning: 0, critical: 0 };

    const averageScore = services.reduce((sum, service) => sum + service.score, 0) / services.length;
    const statusCounts = services.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, { compliant: 0, warning: 0, critical: 0 });

    return { averageScore: Math.round(averageScore * 10) / 10, ...statusCounts };
  }, [services]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('نظرة عامة على الامتثال', 'Compliance Overview')}
        </CardTitle>
        <CardDescription>
          {t('مراقبة الامتثال للخدمات السعودية', 'Monitor Saudi services compliance')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{complianceStats.averageScore}%</div>
          <div className="text-sm text-muted-foreground">
            {t('نقاط الامتثال الإجمالية', 'Overall Compliance Score')}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xl font-bold text-green-600">{complianceStats.compliant}</div>
            <div className="text-xs text-muted-foreground">
              {t('متوافق', 'Compliant')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-yellow-600">{complianceStats.warning}</div>
            <div className="text-xs text-muted-foreground">
              {t('تحذير', 'Warning')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-red-600">{complianceStats.critical}</div>
            <div className="text-xs text-muted-foreground">
              {t('حرج', 'Critical')}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {services.slice(0, 4).map((service) => (
            <div key={service.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  service.status === 'compliant' ? 'bg-green-500' :
                  service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                )} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? service.nameAr : service.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{service.score}%</span>
                <Badge variant={
                  service.status === 'compliant' ? 'default' :
                  service.status === 'warning' ? 'secondary' : 'destructive'
                }>
                  {service.status === 'compliant' ? t('متوافق', 'Compliant') :
                   service.status === 'warning' ? t('تحذير', 'Warning') : t('حرج', 'Critical')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ComplianceOverview.displayName = 'ComplianceOverview';

/**
 * International Agents Component
 */
const InternationalAgents = memo<InternationalAgentsProps>(({ agents, isLoading }) => {
  const { language } = useLanguage();
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const agentStats = useMemo(() => {
    if (!agents.length) return { totalAgents: 0, totalCandidates: 0, averageRating: 0 };

    return {
      totalAgents: agents.reduce((sum, agent) => sum + agent.agents, 0),
      totalCandidates: agents.reduce((sum, agent) => sum + agent.activeCandidates, 0),
      averageRating: agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length,
    };
  }, [agents]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('الوكلاء الدوليون', 'International Agents')}
        </CardTitle>
        <CardDescription>
          {t('شبكة الوكلاء الدوليين للتوظيف', 'Global recruitment agent network')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xl font-bold text-primary">{agentStats.totalAgents}</div>
            <div className="text-xs text-muted-foreground">
              {t('إجمالي الوكلاء', 'Total Agents')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-green-600">{agentStats.totalCandidates.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {t('المرشحين', 'Candidates')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-yellow-600">{agentStats.averageRating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">
              {t('متوسط التقييم', 'Avg Rating')}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? agent.nameAr : agent.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{agent.agents} agents</span>
                <Badge variant="outline">
                  ⭐ {agent.rating}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

InternationalAgents.displayName = 'InternationalAgents';

/**
 * Main Recruitment Dashboard Component
 */
export const RecruitmentDashboard = memo(() => {
  const { language } = useLanguage();
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;
  
  const {
    platforms,
    internationalAgents,
    complianceServices,
    stats,
    isLoading,
    error,
    syncInProgress,
    lastSync,
    refreshData,
    syncAllPlatforms,
    checkCompliance,
    clearError,
  } = useRecruitmentData({
    autoSync: true,
    syncInterval: 5 * 60 * 1000, // 5 minutes
    enableRealTime: true,
  });

  // Memoized metrics for performance
  const metrics = useMemo(() => [
    {
      title: t('المرشحون النشطون', 'Active Candidates'),
      value: stats?.totalCandidates?.toLocaleString() || '0',
      icon: Users,
      trend: { value: '+12%', isPositive: true },
      variant: 'primary' as const,
    },
    {
      title: t('الوظائف المفتوحة', 'Open Positions'),
      value: stats?.totalJobs?.toLocaleString() || '0',
      icon: Briefcase,
      trend: { value: '+5', isPositive: true },
      variant: 'success' as const,
    },
    {
      title: t('المنصات النشطة', 'Active Platforms'),
      value: `${stats?.activePlatforms || 0}/${stats?.totalPlatforms || 0}`,
      icon: Activity,
      trend: { value: '85.7%', isPositive: true },
      variant: 'default' as const,
    },
    {
      title: t('نقاط الامتثال', 'Compliance Score'),
      value: `${stats?.complianceScore || 0}%`,
      icon: Shield,
      trend: { value: '+2.3%', isPositive: true },
      variant: stats?.complianceScore && stats.complianceScore > 90 ? 'success' : 'warning' as const,
    },
  ], [stats, t]);

  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [refreshData]);

  // Handle sync all platforms
  const handleSyncAll = useCallback(async () => {
    try {
      await syncAllPlatforms();
    } catch (error) {
      console.error('Failed to sync platforms:', error);
    }
  }, [syncAllPlatforms]);

  // Handle compliance check
  const handleComplianceCheck = useCallback(async () => {
    try {
      await checkCompliance();
    } catch (error) {
      console.error('Failed to check compliance:', error);
    }
  }, [checkCompliance]);

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('لوحة تحكم التوظيف', 'Recruitment Dashboard')}
          </h2>
          <p className="text-muted-foreground">
            {t('نظرة شاملة على جميع عمليات التوظيف والمنصات', 'Comprehensive overview of all recruitment operations and platforms')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {lastSync && (
            <span className="text-xs text-muted-foreground">
              {t('آخر تحديث', 'Last updated')}: {lastSync.toLocaleTimeString()}
            </span>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || syncInProgress}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', (isLoading || syncInProgress) && 'animate-spin')} />
            {t('تحديث', 'Refresh')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            disabled={syncInProgress}
          >
            <Zap className="h-4 w-4 mr-2" />
            {t('مزامنة الكل', 'Sync All')}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              {t('إغلاق', 'Dismiss')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Progress */}
      {syncInProgress && (
        <Alert>
          <Activity className="h-4 w-4 animate-pulse" />
          <AlertDescription>
            {t('جاري مزامنة البيانات من جميع المنصات...', 'Syncing data from all platforms...')}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            {...metric}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Platform Status */}
        <PlatformStatus platforms={platforms} isLoading={isLoading} />
        
        {/* Compliance Overview */}
        <ComplianceOverview services={complianceServices} isLoading={isLoading} />
        
        {/* International Agents */}
        <InternationalAgents agents={internationalAgents} isLoading={isLoading} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('الإجراءات السريعة', 'Quick Actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              {t('إضافة وظيفة', 'Add Position')}
            </Button>
            <Button className="h-16 flex flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              {t('عرض التقارير', 'View Reports')}
            </Button>
            <Button 
              className="h-16 flex flex-col gap-2" 
              variant="outline"
              onClick={handleComplianceCheck}
              disabled={syncInProgress}
            >
              <Shield className="h-6 w-6" />
              {t('فحص الامتثال', 'Check Compliance')}
            </Button>
            <Button className="h-16 flex flex-col gap-2" variant="outline">
              <Globe className="h-6 w-6" />
              {t('إدارة الوكلاء', 'Manage Agents')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RecruitmentDashboard.displayName = 'RecruitmentDashboard';

export default RecruitmentDashboard;

