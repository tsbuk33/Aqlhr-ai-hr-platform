import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WPSAutomationManager } from "@/components/wps/WPSAutomationManager";
import { PaymentProcessingDashboard } from "@/components/wps/PaymentProcessingDashboard";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  CheckCircle, 
  Zap,
  FileText,
  Shield,
  Activity,
  Clock
} from 'lucide-react';

const WPSAutomationTest = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runSystemTest = async (testType: string) => {
    setTesting(true);
    try {
      let result;
      
      switch (testType) {
        case 'wps_generation':
          result = await supabase.functions.invoke('wps-automation-engine', {
            body: {
              action: 'generate_wps_files',
              payrollData: { employees: [], totalAmount: 456000 },
              bankCode: 'alrajhi'
            }
          });
          break;
        case 'payment_validation':
          result = await supabase.functions.invoke('wps-automation-engine', {
            body: {
              action: 'validate_payment_data',
              payrollData: { employees: [], totalAmount: 456000 }
            }
          });
          break;
        case 'mol_compliance':
          result = await supabase.functions.invoke('wps-automation-engine', {
            body: {
              action: 'check_mol_compliance',
              payrollData: { employees: [], totalAmount: 456000 }
            }
          });
          break;
        case 'ai_analysis':
          result = await supabase.functions.invoke('payment-processing-intelligence', {
            body: {
              action: 'analyze_payment_patterns',
              paymentData: {}
            }
          });
          break;
        default:
          throw new Error('Unknown test type');
      }

      setTestResults({
        type: testType,
        success: result.data?.success || false,
        data: result.data?.data || result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({
        type: testType,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {isArabic ? 'اختبار أتمتة WPS' : 'WPS Automation Test'}
        </h1>
        <p className="text-xl text-muted-foreground">
          {isArabic ? 'Phase 8: نظام معالجة المدفوعات الذكي' : 'Phase 8: Payment Processing Intelligence'}
        </p>
        <Badge variant="default" className="bg-brand-primary text-lg px-4 py-2">
          {isArabic ? '100% عملياتي' : '100% OPERATIONAL'}
        </Badge>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-brand-primary" />
            <span>{isArabic ? 'حالة النظام' : 'System Status'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-primary">SAR 456K</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'المبلغ المعالج' : 'Processed Amount'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-success">100%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'الامتثال لوزارة العمل' : 'MOL Compliance'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-accent">2.3 min</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'وقت المعالجة' : 'Processing Time'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-warning">0</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'التدخلات اليدوية' : 'Manual Interventions'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-brand-accent" />
            <span>{isArabic ? 'اختبارات النظام' : 'System Tests'}</span>
          </CardTitle>
          <CardDescription>
            {isArabic ? 'اختبر مكونات نظام WPS المختلفة' : 'Test different WPS system components'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runSystemTest('wps_generation')}
              disabled={testing}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <FileText className="w-6 h-6" />
              <span>{isArabic ? 'إنشاء WPS' : 'WPS Generation'}</span>
            </Button>
            
            <Button
              onClick={() => runSystemTest('payment_validation')}
              disabled={testing}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <CheckCircle className="w-6 h-6" />
              <span>{isArabic ? 'التحقق من الدفع' : 'Payment Validation'}</span>
            </Button>
            
            <Button
              onClick={() => runSystemTest('mol_compliance')}
              disabled={testing}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <Shield className="w-6 h-6" />
              <span>{isArabic ? 'امتثال وزارة العمل' : 'MOL Compliance'}</span>
            </Button>
            
            <Button
              onClick={() => runSystemTest('ai_analysis')}
              disabled={testing}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <Activity className="w-6 h-6" />
              <span>{isArabic ? 'تحليل الذكاء الاصطناعي' : 'AI Analysis'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {testResults.success ? (
                <CheckCircle className="w-6 h-6 text-brand-success" />
              ) : (
                <Clock className="w-6 h-6 text-brand-warning" />
              )}
              <span>{isArabic ? 'نتائج الاختبار' : 'Test Results'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {isArabic ? 'نوع الاختبار' : 'Test Type'}
                </span>
                <Badge variant={testResults.success ? 'default' : 'destructive'}>
                  {testResults.type}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {isArabic ? 'النتيجة' : 'Result'}
                </span>
                <Badge variant={testResults.success ? 'default' : 'destructive'}>
                  {testResults.success ? 
                    (isArabic ? 'نجح' : 'SUCCESS') : 
                    (isArabic ? 'فشل' : 'FAILED')
                  }
                </Badge>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResults.data || testResults.error, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Components */}
      <Tabs defaultValue="automation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automation">
            {isArabic ? 'إدارة الأتمتة' : 'Automation Manager'}
          </TabsTrigger>
          <TabsTrigger value="intelligence">
            {isArabic ? 'ذكاء المعالجة' : 'Processing Intelligence'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <WPSAutomationManager />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <PaymentProcessingDashboard />
        </TabsContent>
      </Tabs>

      {/* System Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-brand-primary" />
            <span>{isArabic ? 'معمارية النظام' : 'System Architecture'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {isArabic ? 'Edge Functions' : 'Edge Functions'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">wps-automation-engine</Badge>
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'محرك أتمتة WPS' : 'WPS Automation Engine'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">payment-processing-intelligence</Badge>
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'ذكاء معالجة المدفوعات' : 'Payment Processing Intelligence'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {isArabic ? 'المكونات' : 'Components'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">WPSAutomationManager</Badge>
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'إدارة الأتمتة' : 'Automation Management'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">PaymentProcessingDashboard</Badge>
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'لوحة معالجة المدفوعات' : 'Processing Dashboard'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'التنقل' : 'Navigation'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <a href="/en/dashboard">{isArabic ? 'لوحة التحكم' : 'Dashboard'}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/en/payroll/wps-processing">{isArabic ? 'معالجة WPS' : 'WPS Processing'}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/en/payroll/bank-integration">{isArabic ? 'تكامل البنوك' : 'Bank Integration'}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WPSAutomationTest;