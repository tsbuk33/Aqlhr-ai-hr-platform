import React, { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Network } from '@capacitor/network';
import { Storage } from '@capacitor/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Crown, TrendingUp, Users, DollarSign, AlertTriangle, Target, Globe, Wifi, WifiOff, Bell, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KPI {
  id: string;
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  resolved: boolean;
}

interface DashboardMetrics {
  totalEmployees: number;
  saudizationRate: number;
  monthlyPayroll: number;
  activeProjects: number;
  governmentCompliance: number;
  vision2030Progress: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export const ExecutiveMobileApp: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [isOnline, setIsOnline] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEmployees: 0,
    saudizationRate: 0,
    monthlyPayroll: 0,
    activeProjects: 0,
    governmentCompliance: 0,
    vision2030Progress: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    initializeApp();
    setupNetworkListener();
    setupPushNotifications();
    loadDashboardData();
  }, []);

  const initializeApp = async () => {
    // Load cached data first
    await loadCachedData();
  };

  const setupNetworkListener = async () => {
    const status = await Network.getStatus();
    setIsOnline(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      if (status.connected) {
        loadDashboardData();
      }
    });
  };

  const setupPushNotifications = async () => {
    const permissionStatus = await PushNotifications.checkPermissions();
    
    if (permissionStatus.receive === 'prompt') {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        title: notification.title || 'Executive Alert',
        message: notification.body || '',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      toast(notification.title || 'Executive Alert', {
        description: notification.body
      });
    });
  };

  const loadDashboardData = async () => {
    if (!isOnline) {
      await loadCachedData();
      return;
    }

    try {
      // Mock KPI data for demo
      const kpiData = [
        { id: '1', kpi_name: 'Saudization Rate', current_value: 65, target_value: 70, unit: '%', trend: 'up', change_percentage: 5 },
        { id: '2', kpi_name: 'Employee Satisfaction', current_value: 85, target_value: 90, unit: '%', trend: 'up', change_percentage: 3 }
      ];

      // Mock employee data
      const employeeData = Array.from({ length: 150 }, (_, i) => ({
        nationality_group: i % 3 === 0 ? 'saudi' : 'non_saudi',
        employment_status: 'active',
        salary: 5000 + Math.random() * 10000
      }));

      // Process metrics
      const totalEmployees = employeeData?.length || 0;
      const saudiEmployees = employeeData?.filter(emp => emp.nationality_group === 'saudi').length || 0;
      const saudizationRate = totalEmployees > 0 ? (saudiEmployees / totalEmployees) * 100 : 0;
      const monthlyPayroll = employeeData?.reduce((sum, emp) => sum + (emp.salary || 0), 0) || 0;

      // Fetch government compliance data
      const { data: complianceData } = await supabase
        .from('government_compliance_status')
        .select('*')
        .eq('is_compliant', true);

      const governmentCompliance = ((complianceData?.length || 0) / 21) * 100; // 21 total government portals

      const processedKpis: KPI[] = kpiData?.map(kpi => ({
        id: kpi.id,
        name: kpi.kpi_name,
        current_value: kpi.current_value || 0,
        target_value: kpi.target_value || 100,
        unit: kpi.unit || '%',
        trend: kpi.trend || 'stable' as const,
        change_percentage: kpi.change_percentage || 0
      })) || [];

      const dashboardMetrics: DashboardMetrics = {
        totalEmployees,
        saudizationRate,
        monthlyPayroll,
        activeProjects: 12, // This should come from your project data
        governmentCompliance,
        vision2030Progress: processedKpis.reduce((avg, kpi) => 
          avg + (kpi.current_value / kpi.target_value * 100), 0) / (processedKpis.length || 1)
      };

      setKpis(processedKpis);
      setMetrics(dashboardMetrics);
      setLastUpdate(new Date());

      // Cache the data
      await Storage.set({ 
        key: 'executive_dashboard_data', 
        value: JSON.stringify({ 
          kpis: processedKpis, 
          metrics: dashboardMetrics, 
          lastUpdate: new Date().toISOString() 
        }) 
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error(isArabic ? 'فشل في تحميل بيانات لوحة التحكم' : 'Failed to load dashboard data');
    }
  };

  const loadCachedData = async () => {
    const cached = await Storage.get({ key: 'executive_dashboard_data' });
    if (cached.value) {
      const data = JSON.parse(cached.value);
      setKpis(data.kpis || []);
      setMetrics(data.metrics || {});
      setLastUpdate(data.lastUpdate ? new Date(data.lastUpdate) : null);
    }
  };

  const getKPIChartData = () => {
    return kpis.slice(0, 6).map(kpi => ({
      name: kpi.name.substring(0, 15) + (kpi.name.length > 15 ? '...' : ''),
      current: kpi.current_value,
      target: kpi.target_value,
      progress: (kpi.current_value / kpi.target_value) * 100
    }));
  };

  const getComplianceData = () => [
    { name: isArabic ? 'متوافق' : 'Compliant', value: metrics.governmentCompliance },
    { name: isArabic ? 'غير متوافق' : 'Non-Compliant', value: 100 - metrics.governmentCompliance }
  ];

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {isArabic ? 'تطبيق تنفيذي' : 'Executive App'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lastUpdate ? (
                isArabic ? 
                  `آخر تحديث: ${format(lastUpdate, 'HH:mm')}` :
                  `Last updated: ${format(lastUpdate, 'HH:mm')}`
              ) : (
                isArabic ? 'لا يوجد تحديث' : 'No updates'
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Network Status */}
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          
          {/* Critical Alerts */}
          {alerts.filter(a => a.severity === 'high' && !a.resolved).length > 0 && (
            <div className="relative">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Notifications */}
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'إجمالي الموظفين' : 'Total Employees'}
                </p>
                <p className="text-2xl font-bold">{metrics.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'نسبة السعودة' : 'Saudization Rate'}
                </p>
                <p className="text-2xl font-bold">{metrics.saudizationRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vision 2030 Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {isArabic ? 'تقدم رؤية 2030' : 'Vision 2030 Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {isArabic ? 'التقدم الإجمالي' : 'Overall Progress'}
              </span>
              <span className="text-sm font-bold">
                {metrics.vision2030Progress.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.vision2030Progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="kpis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kpis">
            {isArabic ? 'المؤشرات' : 'KPIs'}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isArabic ? 'التوافق' : 'Compliance'}
          </TabsTrigger>
          <TabsTrigger value="alerts">
            {isArabic ? 'التنبيهات' : 'Alerts'}
          </TabsTrigger>
        </TabsList>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {isArabic ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getKPIChartData()}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Bar dataKey="current" fill="#8884d8" name={isArabic ? 'الحالي' : 'Current'} />
                    <Bar dataKey="target" fill="#82ca9d" name={isArabic ? 'المستهدف' : 'Target'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Individual KPI Cards */}
          <div className="space-y-3">
            {kpis.slice(0, 5).map((kpi) => (
              <Card key={kpi.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{kpi.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={(kpi.current_value / kpi.target_value) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm font-medium">
                          {kpi.current_value}{kpi.unit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`flex items-center gap-1 ${
                        kpi.trend === 'up' ? 'text-green-600' : 
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <TrendingUp className={`h-4 w-4 ${
                          kpi.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        <span className="text-sm font-medium">
                          {Math.abs(kpi.change_percentage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {isArabic ? 'الامتثال الحكومي' : 'Government Compliance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getComplianceData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {getComplianceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {isArabic ? 'إجمالي المعدل' : 'Overall Rate'}
                    </span>
                    <Badge variant={metrics.governmentCompliance > 80 ? 'default' : 'destructive'}>
                      {metrics.governmentCompliance.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <p><strong>{isArabic ? 'البوابات المتوافقة:' : 'Compliant Portals:'}</strong> {Math.round((metrics.governmentCompliance / 100) * 21)}/21</p>
                    <p><strong>{isArabic ? 'آخر مراجعة:' : 'Last Review:'}</strong> {format(new Date(), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'الإجراءات المطلوبة' : 'Required Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  {isArabic ? 'مراجعة بيانات قوى' : 'Review Qiwa Data'}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {isArabic ? 'يجب تحديث بيانات الموظفين' : 'Employee data needs updating'}
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
                <p className="font-medium text-red-800 dark:text-red-200">
                  {isArabic ? 'تجديد شهادة أبشر' : 'Renew Absher Certificate'}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {isArabic ? 'تنتهي صلاحيتها خلال 30 يوم' : 'Expires in 30 days'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {isArabic ? 'التنبيهات التنفيذية' : 'Executive Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    alert.resolved ? 'opacity-50' : ''
                  } ${
                    alert.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-950' :
                    alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950' :
                    'border-blue-200 bg-blue-50 dark:bg-blue-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' :
                          alert.severity === 'medium' ? 'secondary' : 'default'
                        }>
                          {isArabic ? 
                            (alert.severity === 'high' ? 'عالي' :
                             alert.severity === 'medium' ? 'متوسط' : 'منخفض') :
                            alert.severity
                          }
                        </Badge>
                        <p className="font-medium">{alert.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        {isArabic ? 'حل' : 'Resolve'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {isArabic ? 'لا توجد تنبيهات' : 'No alerts'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="fixed bottom-4 right-4">
        <Button 
          onClick={loadDashboardData}
          disabled={!isOnline}
          className="rounded-full h-12 w-12 p-0"
        >
          <TrendingUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};