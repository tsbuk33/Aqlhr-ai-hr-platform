import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { DashboardOperationalTrends } from "@/components/dashboard/DashboardOperationalTrends";
import { DashboardAlertsPanel } from "@/components/dashboard/DashboardAlertsPanel";
import { DashboardSparkline } from "@/components/dashboard/DashboardSparkline";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Shield, FileText, Clock } from "lucide-react";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const Dashboard = () => {
  const { 
    data, 
    loading, 
    systemsOperational,
    mode,
    getMetricWithMoMChange
  } = useLiveDashboard();
  
  const { getSparklineData } = useDashboardTrends(365);
  const { t } = useAPITranslations();

  const getChangeIcon = (change: number | null) => {
    if (!change) return null;
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getChangeClass = (change: number | null) => {
    if (!change) return "text-muted-foreground";
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights and trend analysis for strategic decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={mode === 'demo' ? 'secondary' : 'default'}>
            {mode === 'demo' ? t('dashboard.demo_mode') : 'Live Data'}
          </Badge>
          {systemsOperational && systemsOperational.connected > 0 && (
            <Badge variant="outline" className="text-green-600">
              {systemsOperational.connected}/{systemsOperational.total} Systems Online
            </Badge>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.total_employees || 0}</div>
              {(() => {
                const metric = getMetricWithMoMChange('total_employees');
                return metric.change && (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(metric.change.value)}`}>
                    {getChangeIcon(metric.change.value)}
                    {metric.change.formatted}
                  </div>
                );
              })()}
            </div>
            <DashboardSparkline 
              data={getSparklineData('total_employees')} 
              color="hsl(var(--primary))"
            />
            <p className="text-xs text-muted-foreground">
              {t('dashboard.sparklines.12_month_trend')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saudization Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.saudization_rate?.toFixed(1) || 0}%</div>
              {(() => {
                const metric = getMetricWithMoMChange('saudization_rate');
                return metric.change && (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(metric.change.value)}`}>
                    {getChangeIcon(metric.change.value)}
                    {metric.change.formatted}
                  </div>
                );
              })()}
            </div>
            <DashboardSparkline 
              data={getSparklineData('saudization_rate')} 
              color="hsl(var(--destructive))"
            />
            <p className="text-xs text-muted-foreground">
              {t('dashboard.sparklines.12_month_trend')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HSE Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.hse_safety_score?.toFixed(1) || 0}</div>
              {(() => {
                const metric = getMetricWithMoMChange('hse_safety_score');
                return metric.change && (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(metric.change.value)}`}>
                    {getChangeIcon(metric.change.value)}
                    {metric.change.formatted}
                  </div>
                );
              })()}
            </div>
            <DashboardSparkline 
              data={getSparklineData('hse_safety_score')} 
              color="hsl(var(--secondary))"
            />
            <p className="text-xs text-muted-foreground">
              {t('dashboard.sparklines.12_month_trend')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Experience</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.employee_experience_10?.toFixed(1) || 0}/10</div>
              {(() => {
                const metric = getMetricWithMoMChange('employee_experience_10');
                return metric.change && (
                  <div className={`flex items-center gap-1 text-sm ${getChangeClass(metric.change.value)}`}>
                    {getChangeIcon(metric.change.value)}
                    {metric.change.formatted}
                  </div>
                );
              })()}
            </div>
            <DashboardSparkline 
              data={getSparklineData('employee_experience_10')} 
              color="hsl(var(--accent))"
            />
            <p className="text-xs text-muted-foreground">
              {t('dashboard.sparklines.12_month_trend')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Trends Chart */}
        <DashboardOperationalTrends />
        
        {/* Alerts Panel */}
        <DashboardAlertsPanel />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.docs_processed || 0}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Training Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.training_hours?.toFixed(0) || 0}</div>
            <p className="text-xs text-muted-foreground">Completed this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.compliance_score?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">Overall compliance rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;