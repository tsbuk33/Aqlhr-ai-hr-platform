import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Building,
  Award,
  Clock,
  TrendingUp,
  Search,
  Verified
} from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';
import { useToast } from '@/hooks/use-toast';

interface ETIMADContractor {
  id: string;
  contractor_name: string;
  registration_number: string;
  verification_status: 'verified' | 'pending' | 'rejected' | 'expired';
  certification_level: string;
  expiry_date: string;
  last_verified: string;
}

interface ETIMADVerification {
  id: string;
  contractor_id: string;
  verification_type: string;
  status: 'completed' | 'in_progress' | 'failed';
  verification_date: string;
  validity_period: number;
}

const ETIMADIntegration = () => {
  const { lang } = useUnifiedLocale();
  const { toast } = useToast();
  const isArabic = lang === 'ar';
  
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState<string>('2025-01-22T10:30:00Z');
  const [syncProgress, setSyncProgress] = useState(0);

  // Dummy data for ETIMAD contractors
  const [contractors] = useState<ETIMADContractor[]>([
    {
      id: '1',
      contractor_name: isArabic ? 'شركة البناء المتقدم' : 'Advanced Construction Co.',
      registration_number: 'CR-2024-001',
      verification_status: 'verified',
      certification_level: 'Grade A',
      expiry_date: '2025-12-31',
      last_verified: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',  
      contractor_name: isArabic ? 'مؤسسة الهندسة الحديثة' : 'Modern Engineering Est.',
      registration_number: 'CR-2024-002',
      verification_status: 'verified',
      certification_level: 'Grade B',
      expiry_date: '2025-11-30',
      last_verified: '2025-01-20T14:30:00Z'
    },
    {
      id: '3',
      contractor_name: isArabic ? 'شركة المقاولات الشاملة' : 'Comprehensive Contracting Co.',
      registration_number: 'CR-2024-003',
      verification_status: 'pending',
      certification_level: 'Grade C',
      expiry_date: '2025-06-30',
      last_verified: '2024-12-01T09:00:00Z'
    }
  ]);

  const [verifications] = useState<ETIMADVerification[]>([
    {
      id: '1',
      contractor_id: '1',
      verification_type: 'Financial Standing',
      status: 'completed',
      verification_date: '2025-01-15T10:00:00Z',
      validity_period: 365
    },
    {
      id: '2',
      contractor_id: '2',
      verification_type: 'Technical Capability',
      status: 'completed',
      verification_date: '2025-01-20T14:30:00Z',
      validity_period: 180
    },
    {
      id: '3',
      contractor_id: '3',
      verification_type: 'Legal Compliance',
      status: 'in_progress',
      verification_date: '2025-01-22T08:00:00Z',
      validity_period: 365
    }
  ]);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setSyncProgress(0);

    try {
      // Simulate ETIMAD API connection test
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setConnectionStatus('connected');
      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "اختبار الاتصال ناجح" : "Connection Test Successful",
        description: isArabic ? "تم الاتصال بمنصة اعتماد بنجاح" : "Successfully connected to ETIMAD Platform",
      });
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: isArabic ? "فشل في اختبار الاتصال" : "Connection Test Failed",
        description: isArabic ? "فشل في الاتصال بمنصة اعتماد" : "Failed to connect to ETIMAD Platform",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const syncContractors = async () => {
    setIsLoading(true);
    setSyncProgress(0);

    try {
      // Simulate contractor verification sync
      for (let i = 0; i <= 100; i += 5) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setLastSyncTime(new Date().toISOString());
      
      toast({
        title: isArabic ? "تم تحديث بيانات المقاولين" : "Contractor Data Updated",
        description: isArabic ? "تم تحديث بيانات اعتماد المقاولين بنجاح" : "ETIMAD contractor data synchronized successfully",
      });
    } catch (error) {
      toast({
        title: isArabic ? "فشل في المزامنة" : "Sync Failed",
        description: isArabic ? "فشل في مزامنة بيانات اعتماد" : "Failed to synchronize ETIMAD data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSyncProgress(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'connected':
      case 'completed': return 'text-green-600';
      case 'pending':
      case 'in_progress': return 'text-yellow-600';
      case 'rejected':
      case 'failed':
      case 'disconnected': return 'text-red-600';
      case 'expired': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'connected':
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'rejected':
      case 'failed':
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'تكامل منصة اعتماد' : 'ETIMAD Platform Integration'}
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
            'نظام التحقق من اعتماد المقاولين والموردين في المملكة العربية السعودية' : 
            'Contractor and supplier verification system for Saudi Arabia'
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
                  {isArabic ? 'جاري التحقق من بيانات المقاولين...' : 'Verifying contractor data...'}
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
        <Button onClick={syncContractors} disabled={isLoading}>
          <TrendingUp className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'مزامنة المقاولين' : 'Sync Contractors'}
        </Button>
        <Button variant="outline" disabled={isLoading}>
          <Search className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {isArabic ? 'البحث عن مقاول' : 'Search Contractor'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="contractors">{isArabic ? 'المقاولين' : 'Contractors'}</TabsTrigger>
          <TabsTrigger value="verifications">{isArabic ? 'التحقق' : 'Verifications'}</TabsTrigger>
          <TabsTrigger value="reports">{isArabic ? 'التقارير' : 'Reports'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'المقاولين المعتمدين' : 'Verified Contractors'}
                </CardTitle>
                <Verified className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">127</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'مقاولين معتمدين' : 'active verified contractors'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'طلبات التحقق' : 'Verification Requests'}
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">23</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'قيد المراجعة' : 'pending review'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'الاعتمادات الجديدة' : 'New Certifications'}
                </CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">8</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'هذا الشهر' : 'this month'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'معدل الموافقة' : 'Approval Rate'}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">89.3%</div>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'متوسط الموافقات' : 'average approval rate'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {isArabic ? 
                'منصة اعتماد متصلة ومتزامنة. جميع عمليات التحقق من المقاولين تتم وفقاً لمعايير وزارة التجارة.' :
                'ETIMAD platform is connected and synchronized. All contractor verifications are processed according to Ministry of Commerce standards.'
              }
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-6">
          <div className="grid gap-4">
            {contractors.map((contractor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{contractor.contractor_name}</CardTitle>
                      <CardDescription>{contractor.registration_number}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(contractor.verification_status)}
                      <Badge variant={contractor.verification_status === 'verified' ? 'default' : 
                                   contractor.verification_status === 'pending' ? 'secondary' : 'destructive'}>
                        {isArabic ? 
                          (contractor.verification_status === 'verified' ? 'معتمد' : 
                           contractor.verification_status === 'pending' ? 'قيد المراجعة' : 'مرفوض') :
                          contractor.verification_status
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'مستوى الاعتماد' : 'Certification Level'}
                      </p>
                      <p className="font-medium">{contractor.certification_level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </p>
                      <p className="font-medium">
                        {new Date(contractor.expiry_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'آخر تحقق' : 'Last Verified'}
                      </p>
                      <p className="font-medium">
                        {new Date(contractor.last_verified).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <Button size="sm" variant="outline">
                        <FileText className={`h-3 w-3 ${isArabic ? 'ml-1' : 'mr-1'}`} />
                        {isArabic ? 'التفاصيل' : 'Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <div className="grid gap-4">
            {verifications.map((verification, index) => {
              const contractor = contractors.find(c => c.id === verification.contractor_id);
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{verification.verification_type}</CardTitle>
                        <CardDescription>{contractor?.contractor_name}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(verification.status)}
                        <Badge variant={verification.status === 'completed' ? 'default' : 
                                       verification.status === 'in_progress' ? 'secondary' : 'destructive'}>
                          {isArabic ? 
                            (verification.status === 'completed' ? 'مكتمل' : 
                             verification.status === 'in_progress' ? 'جاري' : 'فاشل') :
                            verification.status
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? 'تاريخ التحقق' : 'Verification Date'}
                        </p>
                        <p className="font-medium">
                          {new Date(verification.verification_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? 'فترة الصلاحية' : 'Validity Period'}
                        </p>
                        <p className="font-medium">{verification.validity_period} {isArabic ? 'يوم' : 'days'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              {isArabic ? 
                'تقارير اعتماد المقاولين متاحة للتحميل. جميع التقارير متوافقة مع معايير وزارة التجارة.' :
                'ETIMAD contractor reports are available for download. All reports comply with Ministry of Commerce standards.'
              }
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'تقارير الاعتماد' : 'Certification Reports'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'تقارير حالة اعتماد المقاولين' : 'Contractor certification status reports'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير المقاولين المعتمدين' : 'Verified Contractors Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير طلبات التحقق' : 'Verification Requests Report'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {isArabic ? 'تقرير الامتثال الشهري' : 'Monthly Compliance Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="etimad.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ETIMADIntegration;