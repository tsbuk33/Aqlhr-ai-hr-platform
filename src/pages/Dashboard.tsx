import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, CheckCircle, AlertCircle, FileText, Clock, Shield, ExternalLink, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpsellModal } from "@/components/ui/upsell-modal";
import { DashboardErrorBoundary, DashboardSkeleton } from "@/components/dashboard/DashboardErrorBoundary";
import { DemoSeedingCallout } from "@/components/dashboard/DemoSeedingCallout";
import { EnhancedDashboardAlertsPanel } from "@/components/dashboard/EnhancedDashboardAlertsPanel";
import { DashboardOperationalTrends } from "@/components/dashboard/DashboardOperationalTrends";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLocale } from "@/i18n/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { resolveTenantId } from "@/lib/useTenant";
import { localePath, resolveLang } from "@/lib/i18n/localePath";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function Dashboard() {
  const { t, locale } = useLocale();
  const isArabic = locale === 'ar';
  const language = locale;
  const { hasAccess: hasGrowthAccess, showUpsell, hideUpsell, upsellOpen } = useFeatureGating('self_sell_growth');
  
  const { 
    data, 
    series,
    alerts,
    integrations,
    loading, 
    error, 
    isDemoMode,
    systemsOperational, 
    getMoMChange,
    getSparklineData,
    createTaskFromAlert,
    refetch
  } = useDashboardData();

  // Share dashboard functionality
  const handleShareDashboard = async () => {
    if (!hasGrowthAccess) {
      showUpsell();
      return;
    }
    
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(t('dashboard', 'unable_to_determine_company'));
        return;
      }

      const { data: shareData, error } = await supabase.functions.invoke('share_link_sign_v1', {
        body: {
          tenantId,
          kind: 'dashboard_snapshot',
          ttlHours: 72,
          payload: {
            dashboard_data: data,
            kpi_summary: {
              total_employees: data?.totalEmployees || 0,
              saudization_rate: data?.saudizationRate || 0,
              compliance_score: data?.complianceScore || 0,
              hse_safety_score: data?.hseSafetyScore || 0,
              employee_experience_10: data?.employeeExperience || 0
            },
            generated_at: new Date().toISOString()
          }
        }
      });

      if (error) throw error;
      
      navigator.clipboard.writeText(shareData.url);
      toast.success(t('dashboard', 'dashboard_share_link_copied'));
    } catch (err) {
      console.error('Share error:', err);
      toast.error(t('dashboard', 'failed_to_create_share_link'));
    }
  };

  // Helper functions for UI
  const getChangeIcon = (change: number | null) => {
    if (change === null) return null;
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getChangeClass = (change: number | null) => {
    if (change === null) return "text-muted-foreground";
    return change >= 0 ? "text-success" : "text-destructive";
  };

  // Clickable drill-down handlers
  const handleDrillDown = (path: string) => {
    const href = localePath(path, resolveLang());
    window.location.href = href;
  };

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <DashboardErrorBoundary>
      <div className={`space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DashboardSkeleton />
        </div>
      </DashboardErrorBoundary>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardErrorBoundary>
        <div className={`space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold">{t('dashboard', 'dashboard_error')}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                {t('dashboard', 'retry_loading')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardErrorBoundary>
    );
  }

  // Dev callout when no employees
  const isDev = new URLSearchParams(window.location.search).get('dev') === '1';
  const hasNoEmployees = data?.totalEmployees === 0;

  return (
    <DashboardErrorBoundary>
      <div className={`space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Dev Callout */}
        {(isDev || isDemoMode) && hasNoEmployees && (
          <DemoSeedingCallout onSeedingComplete={refetch} />
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {t('dashboard', 'title')}
              </h1>
              {isDemoMode && (
                <Badge variant="outline" className="text-xs">
                  {t('dashboard', 'demo_mode')}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 ${systemsOperational ? 'text-success' : 'text-warning'}`}>
                {systemsOperational ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {t('dashboard', 'all_systems_operational')}
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    {t('dashboard', 'system_issues_detected')}
                    {integrations.length > 0 && (
                      <span className="text-xs">
                        ({integrations.map(int => `${int.integration_group}: ${int.connected}/${int.total}`).join(", ")})
                      </span>
                    )}
                  </>
                )}
              </span>
            </p>
          </div>
          
          {/* Share Dashboard Button */}
          <Button onClick={handleShareDashboard} disabled={loading}>
            <Share2 className="h-4 w-4 mr-2" />
            {t('dashboard', 'share_dashboard')}
          </Button>
        </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/people/employees')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              {(() => {
                const change = getMoMChange(data?.totalEmployees || 0, series, 'total_employees');
                return (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(change)}`}>
                    {getChangeIcon(change)}
                    {change ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : 'N/A'}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold">{data?.totalEmployees.toLocaleString() || 0}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard', 'total_employees')}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData('total_employees')}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Saudization Rate */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/compliance/autopilot')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              {(() => {
                const change = getMoMChange(data?.saudizationRate || 0, series, 'saudization_rate');
                return (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(change)}`}>
                    {getChangeIcon(change)}
                    {change ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : 'N/A'}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold">{data?.saudizationRate?.toFixed(1) || 0}%</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard', 'saudization_rate')}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData('saudization_rate')}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* HSE Safety Score */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/hse/incidents?range=90d')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              {(() => {
                const change = getMoMChange(data?.hseSafetyScore || 0, series, 'hse_safety_score');
                return (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(change)}`}>
                    {getChangeIcon(change)}
                    {change ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : 'N/A'}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold">{data?.hseSafetyScore?.toFixed(1) || 0}/10</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard', 'hse_safety_score')}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData('hse_safety_score')}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Employee Experience */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/cci/overview')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              {(() => {
                const change = getMoMChange(data?.employeeExperience || 0, series, 'employee_experience_10');
                return (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(change)}`}>
                    {getChangeIcon(change)}
                    {change ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : 'N/A'}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold">{data?.employeeExperience?.toFixed(1) || 0}/10</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard', 'employee_experience')}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData('employee_experience_10')}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--info))" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardOperationalTrends />
        <EnhancedDashboardAlertsPanel 
          alerts={alerts}
          onCreateTask={createTaskFromAlert}
          loading={loading}
        />
      </div>

      {/* Secondary KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/documents/activity?range=30d')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {t('dashboard', 'docs_processed')}
                </h3>
                <p className="text-2xl font-bold">{data?.docsProcessed?.toLocaleString() || 0}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleDrillDown('/learning/completions?range=90d')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {t('dashboard', 'training_hours')}
                </h3>
                <p className="text-2xl font-bold">{data?.trainingHours?.toFixed(1) || 0}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {t('dashboard', 'compliance_score')}
                </h3>
                <p className="text-2xl font-bold">{data?.complianceScore?.toFixed(1) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* Upsell Modal */}
      <UpsellModal 
        open={upsellOpen}
        onOpenChange={hideUpsell}
        title={t('dashboard', 'unlock_growth_features')}
        description={t('dashboard', 'growth_features_description')}
        features={[
          t('dashboard', 'show_roi_automatically'),
          t('dashboard', 'weekly_exec_pdfs'),
          t('dashboard', 'readonly_snapshot_links')
        ]}
      />
      
      {/* AI Integration */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="dashboard" 
        companyId="demo-company" 
        enabledFeatures={['real-time-insights', 'predictive-analytics', 'executive-intelligence']}
        position="static"
      />
    </DashboardErrorBoundary>
  );
}