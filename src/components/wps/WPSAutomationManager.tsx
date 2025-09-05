import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Download,
  CreditCard,
  Activity
} from 'lucide-react';

interface WPSStatus {
  currentMonth: any;
  compliance: any;
  automation: any;
  banks: any[];
}

export const WPSAutomationManager = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [wpsStatus, setWpsStatus] = useState<WPSStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWPSStatus();
  }, []);

  const loadWPSStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('wps-automation-engine', {
        body: {
          action: 'get_wps_status',
          companyId: 'demo-company'
        }
      });

      if (error) throw error;
      setWpsStatus(data.data);
    } catch (error) {
      console.error('Error loading WPS status:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWPSFiles = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('wps-automation-engine', {
        body: {
          action: 'generate_wps_files',
          payrollData: { employees: [], totalAmount: 456000 },
          bankCode: 'alrajhi'
        }
      });

      if (error) throw error;
      await loadWPSStatus();
    } catch (error) {
      console.error('Error generating WPS files:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!wpsStatus) return null;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isArabic ? 'نظام أتمتة WPS' : 'WPS Automation System'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'معالجة المدفوعات الذكية والامتثال التلقائي' : 'Intelligent Payment Processing & Automated Compliance'}
          </p>
        </div>
        <Button 
          onClick={generateWPSFiles}
          disabled={processing}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          {processing ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              {isArabic ? 'جاري المعالجة...' : 'Processing...'}
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              {isArabic ? 'إنشاء ملفات WPS' : 'Generate WPS Files'}
            </>
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-primary" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'المبلغ المعالج' : 'Processed Amount'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              SAR {wpsStatus.currentMonth.processedAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-brand-success" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'عدد الموظفين' : 'Employee Count'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {wpsStatus.currentMonth.employeeCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand-accent" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'معدل النجاح' : 'Success Rate'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {wpsStatus.automation.successRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-brand-warning" />
              <div className="text-sm font-medium text-muted-foreground">
                {isArabic ? 'وقت المعالجة' : 'Processing Time'}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {wpsStatus.automation.avgProcessingTime}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="automation" className="w-full">
        <TabsList>
          <TabsTrigger value="automation">
            {isArabic ? 'الأتمتة' : 'Automation'}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isArabic ? 'الامتثال' : 'Compliance'}
          </TabsTrigger>
          <TabsTrigger value="banks">
            {isArabic ? 'البنوك' : 'Banks'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>{isArabic ? 'حالة الأتمتة' : 'Automation Status'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {isArabic ? 'معدل الأتمتة' : 'Automation Rate'}
                </span>
                <span className="text-2xl font-bold text-brand-primary">
                  {wpsStatus.automation.automationRate}%
                </span>
              </div>
              <Progress value={wpsStatus.automation.automationRate} className="w-full" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-success">
                    {wpsStatus.automation.manualInterventions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'تدخلات يدوية' : 'Manual Interventions'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-accent">
                    {wpsStatus.currentMonth.bankFiles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'ملفات البنك' : 'Bank Files'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{isArabic ? 'امتثال وزارة العمل' : 'MOL Compliance'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {isArabic ? 'حالة الامتثال' : 'Compliance Status'}
                </span>
                <Badge variant="default" className="bg-brand-success">
                  {wpsStatus.compliance.molStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'آخر تدقيق' : 'Last Audit'}
                  </div>
                  <div className="font-medium">
                    {new Date(wpsStatus.compliance.lastAudit).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'المراجعة التالية' : 'Next Review'}
                  </div>
                  <div className="font-medium">
                    {new Date(wpsStatus.compliance.nextReview).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center p-6 bg-brand-success/10 rounded-lg">
                <CheckCircle className="w-8 h-8 text-brand-success mr-3" />
                <div>
                  <div className="font-semibold text-brand-success">
                    {isArabic ? 'صفر مخالفات' : 'Zero Violations'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'امتثال تام لمتطلبات وزارة العمل' : 'Full compliance with MOL requirements'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wpsStatus.banks.map((bank, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{bank.name}</h3>
                    <Badge 
                      variant={bank.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={bank.status === 'ACTIVE' ? 'bg-brand-success' : ''}
                    >
                      {bank.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isArabic ? 'آخر مزامنة' : 'Last Sync'}
                      </span>
                      <span>{new Date(bank.lastSync).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    {isArabic ? 'تحميل الملف' : 'Download File'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};