import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, TrendingUp, ArrowUp, ArrowDown, Activity,
  Clock, Sun, MapPin, Thermometer, CloudRain,
  AlertTriangle, CheckCircle, Building2, Target, Shield,
  Zap, RefreshCw, BarChart3
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { useLiveDashboard } from '@/hooks/useLiveDashboard';
import { AqlhrAgentPanel } from './AqlhrAgentPanel';
import { DashboardOperationalTrends } from './DashboardOperationalTrends';
import { AIOrchestrationPanel } from './AIOrchestrationPanel';

interface BudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
}

interface RenewalItem {
  type: string;
  employee: string;
  expiry_date: string;
  status: 'urgent' | 'warning' | 'normal';
  days_remaining: number;
}

interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  fieldWorkStatus: 'safe' | 'caution' | 'dangerous';
}

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  next: string;
}

export function EnhancedDashboard() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const hrData = useEmployeesData();
  const { data: liveData, loading: dashLoading, getMetricWithMoMChange } = useLiveDashboard();

  // Mock data for new components - in real implementation, these would come from APIs
  const budgetData: BudgetData[] = [
    { category: 'Payroll', allocated: 2400000, spent: 1950000, remaining: 450000, utilization: 81.25 },
    { category: 'Training', allocated: 120000, spent: 89000, remaining: 31000, utilization: 74.17 },
    { category: 'Benefits', allocated: 180000, spent: 167000, remaining: 13000, utilization: 92.78 },
    { category: 'Recruitment', allocated: 85000, spent: 45000, remaining: 40000, utilization: 52.94 }
  ];

  const upcomingRenewals: RenewalItem[] = [
    { type: 'Visa', employee: 'Ahmed Al-Rashid', expiry_date: '2024-03-15', status: 'urgent', days_remaining: 7 },
    { type: 'GOSI Certificate', employee: 'Sarah Johnson', expiry_date: '2024-03-20', status: 'warning', days_remaining: 12 },
    { type: 'Medical License', employee: 'Dr. Mohamed Ali', expiry_date: '2024-04-02', status: 'normal', days_remaining: 25 },
    { type: 'Safety Certificate', employee: 'Engineering Dept', expiry_date: '2024-04-10', status: 'normal', days_remaining: 33 }
  ];

  const weatherInfo: WeatherInfo = {
    temperature: 42,
    condition: 'Hot & Sunny',
    humidity: 35,
    fieldWorkStatus: 'caution'
  };

  const prayerTimes: PrayerTimes = {
    fajr: '05:12',
    dhuhr: '12:18',
    asr: '15:42',
    maghrib: '18:05',
    isha: '19:35',
    next: 'Asr'
  };

  const kpiMetrics = [
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: hrData.totalActive || 0,
      change: getMetricWithMoMChange('total_employees').change,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: isArabic ? 'معدل السعودة' : 'Saudization Rate',
      value: `${hrData.saudizationPct || 0}%`,
      change: getMetricWithMoMChange('saudization_rate').change,
      icon: Target,
      color: 'text-green-400'
    },
    {
      title: isArabic ? 'معدل السلامة' : 'Safety Score',
      value: `${liveData?.hse_safety_score || 0}/10`,
      change: getMetricWithMoMChange('hse_safety_score').change,
      icon: Shield,
      color: 'text-yellow-400'
    },
    {
      title: isArabic ? 'تجربة الموظفين' : 'Employee Experience',
      value: `${liveData?.employee_experience_10 || 0}/10`,
      change: getMetricWithMoMChange('employee_experience_10').change,
      icon: Activity,
      color: 'text-rose-400'
    }
  ];

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'warning': return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      default: return 'bg-green-600/20 text-green-400 border-green-600/30';
    }
  };

  const getWeatherStatusColor = (status: string) => {
    switch (status) {
      case 'dangerous': return 'bg-red-600/20 text-red-400';
      case 'caution': return 'bg-orange-600/20 text-orange-400';
      default: return 'bg-green-600/20 text-green-400';
    }
  };

  if (hrData.loading || dashLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{isArabic ? 'جاري تحميل البيانات...' : 'Loading dashboard data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* Executive Summary Panel */}
        <div className="grid grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="aqlhr-card bg-card border-border/30 hover:border-border/50 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  </div>
                  {metric.change && (
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.change.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {metric.change.formatted}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Enhanced Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Budget Utilization Tracker */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CurrencyIcon className="h-5 w-5 text-green-400" />
                {isArabic ? 'استخدام الميزانية' : 'Budget Utilization'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetData.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <span className="text-xs text-muted-foreground">{budget.utilization.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={budget.utilization} 
                    className={`h-2 ${budget.utilization > 90 ? 'bg-red-600/20' : budget.utilization > 75 ? 'bg-orange-600/20' : 'bg-green-600/20'}`}
                  />
                  <div className="text-xs text-muted-foreground">
                    Remaining: ${budget.remaining.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Renewals */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-400" />
                {isArabic ? 'التجديدات القادمة' : 'Upcoming Renewals'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingRenewals.slice(0, 4).map((renewal, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{renewal.type}</div>
                    <div className="text-xs text-muted-foreground truncate">{renewal.employee}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRenewalStatusColor(renewal.status)}>
                      {renewal.days_remaining}d
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weather Integration */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                {isArabic ? 'الطقس وسلامة العمال' : 'Weather & Field Safety'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-400" />
                    <span className="text-sm">{weatherInfo.temperature}°C</span>
                  </div>
                  <Badge className={getWeatherStatusColor(weatherInfo.fieldWorkStatus)}>
                    {weatherInfo.fieldWorkStatus.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {weatherInfo.condition} • {weatherInfo.humidity}% humidity
                </div>

                {weatherInfo.fieldWorkStatus === 'caution' && (
                  <div className="p-2 bg-orange-600/10 border border-orange-600/20 rounded text-xs">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {isArabic ? 'تفعيل بروتوكول الحر للعمال الميدانيين' : 'Heat protocol activated for field workers'}
                  </div>
                )}

                <Button size="sm" variant="outline" className="w-full text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {isArabic ? 'عرض خريطة الطقس' : 'View Weather Map'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times Display */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                {isArabic ? 'مواقيت الصلاة' : 'Prayer Times'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(prayerTimes).filter(([key]) => key !== 'next').map(([prayer, time]) => (
                  <div key={prayer} className={`flex justify-between items-center p-2 rounded ${
                    prayer === prayerTimes.next.toLowerCase() ? 'bg-primary/10 border border-primary/20' : ''
                  }`}>
                    <span className="text-sm capitalize font-medium">
                      {isArabic ? 
                        (prayer === 'fajr' ? 'الفجر' : 
                         prayer === 'dhuhr' ? 'الظهر' : 
                         prayer === 'asr' ? 'العصر' : 
                         prayer === 'maghrib' ? 'المغرب' : 'العشاء') : 
                        prayer}
                    </span>
                    <span className="text-sm font-mono">{time}</span>
                  </div>
                ))}
                
                <div className="pt-2 border-t border-border/20">
                  <div className="text-xs text-muted-foreground text-center">
                    {isArabic ? `القادم: ${prayerTimes.next}` : `Next: ${prayerTimes.next}`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Orchestration Panel - Built-in AqlHR AI Services */}
        <AIOrchestrationPanel />

        {/* AI Agent Panel - Enhanced Intelligence */}
        <AqlhrAgentPanel />

        {/* Operational Trends Chart */}
        <DashboardOperationalTrends />

        {/* Real-time Module Status */}
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {isArabic ? 'حالة الوحدات المتصلة' : 'Connected Modules Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'HR Master Data', status: 'connected', lastSync: '2 min ago' },
                { name: 'Attendance', status: 'connected', lastSync: '1 min ago' },
                { name: 'Payroll', status: 'connected', lastSync: '5 min ago' },
                { name: 'Performance', status: 'syncing', lastSync: 'syncing...' },
                { name: 'Learning', status: 'connected', lastSync: '3 min ago' },
                { name: 'Safety (HSE)', status: 'connected', lastSync: '1 min ago' }
              ].map((module, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-accent/10">
                  <div className="flex items-center justify-center mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className={`w-2 h-2 rounded-full ml-2 ${
                      module.status === 'connected' ? 'bg-green-400' : 
                      module.status === 'syncing' ? 'bg-orange-400 animate-pulse' : 'bg-red-400'
                    }`} />
                  </div>
                  <div className="text-xs font-medium text-foreground">{module.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{module.lastSync}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}