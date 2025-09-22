import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Users,
  Activity,
  Clock,
  TrendingUp,
  Scan,
  UserCheck,
  Stethoscope,
  AlertTriangle
} from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';
import { useToast } from '@/hooks/use-toast';

interface TAWAKKALNAHealthRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  health_status: 'green' | 'yellow' | 'red' | 'unknown';
  vaccination_status: 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated' | 'boosted' | 'exempt';
  last_test_date: string;
  test_result: 'negative' | 'positive' | 'pending' | 'none';
  clearance_expiry: string;
  last_updated: string;
}

interface TAWAKKALNACompliance {
  id: string;
  compliance_type: 'health_screening' | 'vaccination_proof' | 'test_results' | 'visitor_registration';
  status: 'compliant' | 'non_compliant' | 'pending' | 'expired';
  compliance_date: string;
  expiry_date: string;
  requirements_met: number;
  total_requirements: number;
}

interface TAWAKKALNAVisitor {
  id: string;
  visitor_name: string;
  national_id: string;
  health_status: 'green' | 'yellow' | 'red';
  visit_date: string;
  visit_purpose: string;
  host_employee: string;
  clearance_code: string;
}

const TAWAKKALNAIntegration = () => {
  const { lang } = useUnifiedLocale();
  const { toast } = useToast();
  const isArabic = lang === 'ar';
  
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState<string>('2025-01-22T10:30:00Z');
  const [syncProgress, setSyncProgress] = useState(0);

  // Dummy data for TAWAKKALNA health records
  const [healthRecords] = useState<TAWAKKALNAHealthRecord[]>([
    {
      id: '1',
      employee_id: 'emp_001',
      employee_name: isArabic ? 'أحمد محمد الأحمد' : 'Ahmed Mohammed Al-Ahmed',
      health_status: 'green',
      vaccination_status: 'fully_vaccinated',
      last_test_date: '2025-01-20T09:00:00Z',
      test_result: 'negative',
      clearance_expiry: '2025-01-27T23:59:59Z',
      last_updated: '2025-01-20T09:30:00Z'
    },
    {
      id: '2',
      employee_id: 'emp_002', 
      employee_name: isArabic ? 'فاطمة علي السعد' : 'Fatima Ali Al-Saad',
      health_status: 'green',
      vaccination_status: 'fully_vaccinated',
      last_test_date: '2025-01-19T14:00:00Z',
      test_result: 'negative',
      clearance_expiry: '2025-01-26T23:59:59Z',
      last_updated: '2025-01-19T14:15:00Z'
    },
    {
      id: '3',
      employee_id: 'emp_003',
      employee_name: isArabic ? 'محمد سعد الغامدي' : 'Mohammed Saad Al-Ghamdi',
      health_status: 'yellow',
      vaccination_status: 'partially_vaccinated',
      last_test_date: '2025-01-18T11:00:00Z',
      test_result: 'pending',
      clearance_expiry: '2025-01-23T23:59:59Z',
      last_updated: '2025-01-18T11:30:00Z'
    }
  ]);

  const [complianceRecords] = useState<TAWAKKALNACompliance[]>([
    {
      id: '1',
      compliance_type: 'health_screening',
      status: 'compliant',
      compliance_date: '2025-01-22T08:00:00Z',
      expiry_date: '2025-01-29T23:59:59Z',
      requirements_met: 5,
      total_requirements: 5
    },
    {
      id: '2',
      compliance_type: 'vaccination_proof',
      status: 'compliant',
      compliance_date: '2025-01-20T10:00:00Z',
      expiry_date: '2025-07-20T23:59:59Z',
      requirements_met: 3,
      total_requirements: 3
    },
    {
      id: '3',
      compliance_type: 'visitor_registration',
      status: 'pending',
      compliance_date: '2025-01-22T12:00:00Z',
      expiry_date: '2025-01-22T18:00:00Z',
      requirements_met: 2,
      total_requirements: 4
    }
  ]);

  const [visitors] = useState<TAWAKKALNAVisitor[]>([
    {
      id: '1',
      visitor_name: isArabic ? 'خالد أحمد البراك' : 'Khalid Ahmed Al-Barrak',
      national_id: '1*********',
      health_status: 'green',
      visit_date: '2025-01-22T10:00:00Z',
      visit_purpose: isArabic ? 'اجتماع عمل' : 'Business Meeting',
      host_employee: isArabic ? 'أحمد محمد الأحمد' : 'Ahmed Mohammed Al-Ahmed',
      clearance_code: 'TAW-001-2025'
    },
    {
      id: '2',
      visitor_name: isArabic ? 'نورا سعد المطيري' : 'Nora Saad Al-Mutairi',
      national_id: '2*********',
      health_status: 'green',
      visit_date: '2025-01-22T14:00:00Z',
      visit_purpose: isArabic ? 'مقابلة توظيف' : 'Job Interview',
      host_employee: isArabic ? 'فاطمة علي السعد' : 'Fatima Ali Al-Saad',
      clearance_code: 'TAW-002-2025'
    }
  ]);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setSyncProgress(0);

    try {
      // Simulate TAWAKKALNA API connection test
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setConnectionStatus('connected');
      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "اختبار الاتصال ناجح" : "Connection Test Successful",
        description: isArabic ? "تم الاتصال بتطبيق توكلنا بنجاح" : "Successfully connected to TAWAKKALNA Platform",
      });
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: isArabic ? "فشل في اختبار الاتصال" : "Connection Test Failed",
        description: isArabic ? "فشل في الاتصال بتطبيق توكلنا" : "Failed to connect to TAWAKKALNA Platform",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const syncHealthData = async () => {
    setIsLoading(true);
    setSyncProgress(0);

    try {
      // Simulate health data sync process
      for (let i = 0; i <= 100; i += 5) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "تم تحديث البيانات الصحية" : "Health Data Updated",
        description: isArabic ? "تم تحديث بيانات توكلنا الصحية بنجاح" : "TAWAKKALNA health data synchronized successfully",
      });
    } catch (error) {
      toast({
        title: isArabic ? "فشل في المزامنة" : "Sync Failed",
        description: isArabic ? "فشل في مزامنة بيانات توكلنا" : "Failed to synchronize TAWAKKALNA data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-600 bg-green-50';
      case 'yellow': return 'text-yellow-600 bg-yellow-50';
      case 'red': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'compliant':
      case 'green': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'yellow':
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'red':
      case 'non_compliant':
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVaccinationIcon = (status: string) => {
    switch (status) {
      case 'fully_vaccinated': return <Shield className="h-4 w-4 text-green-500" />;
      case 'partially_vaccinated': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'exempt': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'تكامل تطبيق توكلنا' : 'TAWAKKALNA Integration'}
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
            'التطبيق الرسمي للحالة الصحية والامتثال الصحي في المملكة العربية السعودية' : 
            'Official health status and compliance platform for Saudi Arabia'
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
                  {isArabic ? 'جاري مزامنة البيانات الصحية...' : 'Synchronizing health data...'}
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
        <Button onClick={syncHealthData} disabled={isLoading}>
          <TrendingUp className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'مزامنة البيانات الصحية' : 'Sync Health Data'}
        </Button>
        <Button variant="outline" disabled={isLoading}>
          <Scan className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'مسح رمز الاستجابة' : 'Scan QR Code'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="health">{isArabic ? 'الحالة الصحية' : 'Health Status'}</TabsTrigger>
          <TabsTrigger value="compliance">{isArabic ? 'الامتثال' : 'Compliance'}</TabsTrigger>
          <TabsTrigger value="visitors">{isArabic ? 'الزوار' : 'Visitors'}</TabsTrigger>
          <TabsTrigger value="reports">{isArabic ? 'التقارير' : 'Reports'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'الموظفين المتوافقين' : 'Compliant Employees'}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">284</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'موظف متوافق صحياً' : 'health compliant employees'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'معدل التطعيم' : 'Vaccination Rate'}
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">96.8%</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'مطعمين بالكامل' : 'fully vaccinated'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'زيارات اليوم' : "Today's Visits"}
                </CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">47</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'زائر تم فحصه' : 'visitors screened'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'الحالات النشطة' : 'Active Cases'}
                </CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'تحت المراقبة' : 'under monitoring'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              {isArabic ? 
                'تطبيق توكلنا متصل ومتزامن. جميع عمليات التحقق الصحي تتم وفقاً لبروتوكولات وزارة الصحة السعودية.' :
                'TAWAKKALNA platform is connected and synchronized. All health verifications are processed according to Saudi Ministry of Health protocols.'
              }
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isArabic ? 'سجلات الحالة الصحية للموظفين' : 'Employee Health Status Records'}
              </h3>
              <Badge variant="outline">
                {healthRecords.length} {isArabic ? 'موظف' : 'employees'}
              </Badge>
            </div>
            
            {healthRecords.map((record, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{record.employee_name}</CardTitle>
                      <CardDescription>ID: {record.employee_id}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getHealthStatusColor(record.health_status)}>
                        {record.health_status.toUpperCase()}
                      </Badge>
                      {getVaccinationIcon(record.vaccination_status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'حالة التطعيم' : 'Vaccination Status'}
                      </p>
                      <p className="font-medium">
                        {isArabic ? 
                          (record.vaccination_status === 'fully_vaccinated' ? 'مطعم بالكامل' :
                           record.vaccination_status === 'partially_vaccinated' ? 'مطعم جزئياً' :
                           record.vaccination_status === 'exempt' ? 'معفى' : 'غير مطعم') :
                          record.vaccination_status.replace('_', ' ')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'آخر فحص' : 'Last Test'}
                      </p>
                      <p className="font-medium">
                        {new Date(record.last_test_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'نتيجة الفحص' : 'Test Result'}
                      </p>
                      <p className={`font-medium ${record.test_result === 'negative' ? 'text-green-600' : 
                                                  record.test_result === 'positive' ? 'text-red-600' : 
                                                  'text-yellow-600'}`}>
                        {isArabic ? 
                          (record.test_result === 'negative' ? 'سالب' :
                           record.test_result === 'positive' ? 'موجب' :
                           record.test_result === 'pending' ? 'قيد الانتظار' : 'لا يوجد') :
                          record.test_result
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'انتهاء التصريح' : 'Clearance Expires'}
                      </p>
                      <p className="font-medium">
                        {new Date(record.clearance_expiry).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">
              {isArabic ? 'سجلات الامتثال الصحي' : 'Health Compliance Records'}
            </h3>
            
            {complianceRecords.map((compliance, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {isArabic ? 
                          (compliance.compliance_type === 'health_screening' ? 'الفحص الصحي' :
                           compliance.compliance_type === 'vaccination_proof' ? 'إثبات التطعيم' :
                           compliance.compliance_type === 'test_results' ? 'نتائج الفحص' :
                           'تسجيل الزوار') :
                          compliance.compliance_type.replace('_', ' ')
                        }
                      </CardTitle>
                      <CardDescription>
                        {isArabic ? 'نوع الامتثال' : 'Compliance Type'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(compliance.status)}
                      <Badge variant={compliance.status === 'compliant' ? 'default' : 
                                     compliance.status === 'pending' ? 'secondary' : 'destructive'}>
                        {isArabic ? 
                          (compliance.status === 'compliant' ? 'متوافق' :
                           compliance.status === 'pending' ? 'قيد المراجعة' :
                           compliance.status === 'expired' ? 'منتهي الصلاحية' : 'غير متوافق') :
                          compliance.status.replace('_', ' ')
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'تاريخ الامتثال' : 'Compliance Date'}
                      </p>
                      <p className="font-medium">
                        {new Date(compliance.compliance_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </p>
                      <p className="font-medium">
                        {new Date(compliance.expiry_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'المتطلبات المكتملة' : 'Requirements Met'}
                      </p>
                      <p className="font-medium">
                        {compliance.requirements_met}/{compliance.total_requirements}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'معدل الإنجاز' : 'Completion Rate'}
                      </p>
                      <p className="font-medium">
                        {Math.round((compliance.requirements_met / compliance.total_requirements) * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress 
                      value={(compliance.requirements_met / compliance.total_requirements) * 100} 
                      className="w-full" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isArabic ? 'سجل الزوار' : 'Visitor Registry'}
              </h3>
              <Button size="sm">
                <Users className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'تسجيل زائر جديد' : 'Register New Visitor'}
              </Button>
            </div>
            
            {visitors.map((visitor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{visitor.visitor_name}</CardTitle>
                      <CardDescription>{visitor.clearance_code}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getHealthStatusColor(visitor.health_status)}>
                        {visitor.health_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'الهوية الوطنية' : 'National ID'}
                      </p>
                      <p className="font-medium">{visitor.national_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'تاريخ الزيارة' : 'Visit Date'}
                      </p>
                      <p className="font-medium">
                        {new Date(visitor.visit_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'الغرض من الزيارة' : 'Visit Purpose'}
                      </p>
                      <p className="font-medium">{visitor.visit_purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'الموظف المضيف' : 'Host Employee'}
                      </p>
                      <p className="font-medium">{visitor.host_employee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Alert>
            <Stethoscope className="h-4 w-4" />
            <AlertDescription>
              {isArabic ? 
                'تقارير توكلنا الصحية متاحة للتحميل. جميع التقارير متوافقة مع بروتوكولات وزارة الصحة السعودية.' :
                'TAWAKKALNA health reports are available for download. All reports comply with Saudi Ministry of Health protocols.'
              }
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'التقارير الصحية' : 'Health Reports'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'تقارير شاملة عن الحالة الصحية والامتثال' : 'Comprehensive health status and compliance reports'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير الحالة الصحية اليومي' : 'Daily Health Status Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير معدلات التطعيم' : 'Vaccination Rates Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير سجل الزوار' : 'Visitor Registry Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير الامتثال الصحي الشهري' : 'Monthly Health Compliance Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="tawakkalna.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default TAWAKKALNAIntegration;