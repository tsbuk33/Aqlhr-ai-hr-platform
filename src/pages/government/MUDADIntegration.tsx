import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Users,
  Building,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';
import { useToast } from '@/hooks/use-toast';

interface MUDADServiceStatus {
  service: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  recordCount: number;
}

interface MUDADComplianceMetric {
  metric: string;
  value: number;
  status: 'compliant' | 'warning' | 'critical';
  requirement: string;
}

const MUDADIntegration = () => {
  const { lang } = useUnifiedLocale();
  const { toast } = useToast();
  const isArabic = lang === 'ar';
  
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState<string>('2025-01-22T10:30:00Z');
  const [syncProgress, setSyncProgress] = useState(0);

  // Dummy data for MUDAD services
  const [mudadServices] = useState<MUDADServiceStatus[]>([
    {
      service: isArabic ? 'تسجيل العقود' : 'Contract Registration',
      status: 'connected',
      lastSync: '2025-01-22T10:30:00Z',
      recordCount: 2847
    },
    {
      service: isArabic ? 'إدارة التصاريح' : 'Permit Management',
      status: 'connected',
      lastSync: '2025-01-22T10:25:00Z',
      recordCount: 156
    },
    {
      service: isArabic ? 'تقارير العمالة' : 'Labor Reports',
      status: 'connected',
      lastSync: '2025-01-22T10:20:00Z',
      recordCount: 24
    },
    {
      service: isArabic ? 'مراقبة الامتثال' : 'Compliance Monitoring',
      status: 'connected',
      lastSync: '2025-01-22T10:15:00Z',
      recordCount: 98
    }
  ]);

  const [complianceMetrics] = useState<MUDADComplianceMetric[]>([
    {
      metric: isArabic ? 'معدل تسجيل العقود' : 'Contract Registration Rate',
      value: 98.5,
      status: 'compliant',
      requirement: isArabic ? 'يجب أن يكون > 95%' : 'Must be > 95%'
    },
    {
      metric: isArabic ? 'صحة بيانات العمالة' : 'Labor Data Accuracy',
      value: 96.8,
      status: 'compliant',
      requirement: isArabic ? 'يجب أن يكون > 95%' : 'Must be > 95%'
    },
    {
      metric: isArabic ? 'التقارير في الوقت المحدد' : 'Timely Reporting',
      value: 89.2,
      status: 'warning',
      requirement: isArabic ? 'يجب أن يكون > 90%' : 'Must be > 90%'
    },
    {
      metric: isArabic ? 'امتثال التصاريح' : 'Permit Compliance',
      value: 94.1,
      status: 'warning',
      requirement: isArabic ? 'يجب أن يكون > 95%' : 'Must be > 95%'
    }
  ]);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setSyncProgress(0);

    try {
      // Simulate API connection test
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setConnectionStatus('connected');
      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "اختبار الاتصال ناجح" : "Connection Test Successful",
        description: isArabic ? "تم الاتصال بمنصة مداد بنجاح" : "Successfully connected to MUDAD Platform",
      });
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: isArabic ? "فشل في اختبار الاتصال" : "Connection Test Failed",
        description: isArabic ? "فشل في الاتصال بمنصة مداد" : "Failed to connect to MUDAD Platform",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    setSyncProgress(0);

    try {
      // Simulate data sync process
      for (let i = 0; i <= 100; i += 5) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "تم تحديث البيانات" : "Data Sync Complete",
        description: isArabic ? "تم تحديث بيانات مداد بنجاح" : "MUDAD data synchronized successfully",
      });
    } catch (error) {
      toast({
        title: isArabic ? "فشل في المزامنة" : "Sync Failed",
        description: isArabic ? "فشل في مزامنة بيانات مداد" : "Failed to synchronize MUDAD data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'testing': return 'bg-yellow-500';
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'تكامل منصة مداد' : 'MUDAD Platform Integration'}
          </h1>
          <div className="flex items-center space-x-2">
            {getStatusIcon(connectionStatus)}
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {isArabic ? 
                (connectionStatus === 'connected' ? 'متصل' : connectionStatus === 'testing' ? 'جاري الاختبار' : 'غير متصل') :
                connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)
              }
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          {isArabic ? 
            'التكامل المباشر مع منصة مداد لخدمات العمل والتنمية الاجتماعية' : 
            'Direct integration with MUDAD platform for labor and social development services'
          }
        </p>
        {lastSyncTime && (
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'آخر مزامنة: ' : 'Last sync: '}
            {new Date(lastSyncTime).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
          </p>
        )}
      </div>

      {/* Sync Progress */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                </span>
                <span className="text-sm text-muted-foreground">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={testConnection} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'} ${isLoading ? 'animate-spin' : ''}`} />
          {isArabic ? 'اختبار الاتصال' : 'Test Connection'}
        </Button>
        <Button onClick={syncData} disabled={isLoading}>
          <TrendingUp className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'مزامنة البيانات' : 'Sync Data'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="services">{isArabic ? 'الخدمات' : 'Services'}</TabsTrigger>
          <TabsTrigger value="compliance">{isArabic ? 'الامتثال' : 'Compliance'}</TabsTrigger>
          <TabsTrigger value="reports">{isArabic ? 'التقارير' : 'Reports'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'العقود المسجلة' : 'Registered Contracts'}
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'جميع العقود مسجلة' : 'all contracts registered'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'التصاريح النشطة' : 'Active Permits'}
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'تصاريح عمل سارية' : 'valid work permits'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'التقارير المقدمة' : 'Reports Submitted'}
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'هذا العام' : 'this year'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'معدل الامتثال' : 'Compliance Rate'}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">94.6%</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'امتثال عام' : 'overall compliance'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-4">
            {mudadServices.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.service}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <Badge variant={service.status === 'connected' ? 'default' : 'destructive'}>
                        {isArabic ? (service.status === 'connected' ? 'متصل' : 'غير متصل') : service.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'آخر مزامنة' : 'Last Sync'}
                      </p>
                      <p className="font-medium">
                        {new Date(service.lastSync).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'عدد السجلات' : 'Record Count'}
                      </p>
                      <p className="font-medium">{service.recordCount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-4">
            {complianceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                    <Badge variant={metric.status === 'compliant' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}>
                      {isArabic ? 
                        (metric.status === 'compliant' ? 'متوافق' : metric.status === 'warning' ? 'تحذير' : 'حرج') :
                        metric.status
                      }
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{metric.requirement}</span>
                      <span className={`font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              {isArabic ? 
                'تقارير مداد متاحة للتحميل. جميع التقارير متوافقة مع معايير وزارة العمل والتنمية الاجتماعية.' :
                'MUDAD reports are available for download. All reports comply with Ministry of Labor and Social Development standards.'
              }
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'تقارير دورية' : 'Periodic Reports'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'التقارير المطلوبة شهرياً وربع سنوياً' : 'Monthly and quarterly required reports'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير العمالة الشهري' : 'Monthly Labor Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير الامتثال الربعي' : 'Quarterly Compliance Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="mudad.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default MUDADIntegration;