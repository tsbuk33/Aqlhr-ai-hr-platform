import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Settings, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Building2,
  CreditCard,
  Banknote,
  Timer,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { PayrollCalculator } from './PayrollCalculator';
import { AllowanceManager } from './AllowanceManager';

export const AdvancedPayrollDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    payrollRuns,
    payrollRunsLoading,
    allowanceDefinitions,
    isCalculatingPayroll,
    isSyncingGOSI,
    isGeneratingWPS
  } = useAdvancedPayroll();

  // Calculate dashboard metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthRuns = payrollRuns?.filter(run => {
    const runDate = new Date(run.created_at);
    return runDate.getMonth() === currentMonth && runDate.getFullYear() === currentYear;
  }) || [];

  const totalEmployeesProcessed = currentMonthRuns.reduce((sum, run) => sum + run.total_employees, 0);
  const totalGrossPay = currentMonthRuns.reduce((sum, run) => sum + run.total_gross_pay, 0);
  const totalNetPay = currentMonthRuns.reduce((sum, run) => sum + run.total_net_pay, 0);
  const totalDeductions = currentMonthRuns.reduce((sum, run) => sum + run.total_deductions, 0);

  const pendingRuns = payrollRuns?.filter(run => ['draft', 'calculated'].includes(run.status)).length || 0;
  const completedRuns = payrollRuns?.filter(run => run.status === 'paid').length || 0;

  if (payrollRunsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isArabic ? 'جاري تحميل نظام الرواتب المتقدم...' : 'Loading Advanced Payroll System...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'نظام الرواتب المتقدم' : 'Advanced Payroll Engine'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 
              'نظام شامل لإدارة الرواتب مع الامتثال لقوانين العمل السعودية' :
              'Comprehensive payroll management with Saudi Labor Law compliance'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {format(new Date(), isArabic ? 'MMMM yyyy' : 'MMMM yyyy', { 
              locale: isArabic ? ar : undefined 
            })}
          </Badge>
          <Button 
            onClick={() => setActiveTab('calculator')}
            className="bg-primary hover:bg-primary/90"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isArabic ? 'حساب الراتب' : 'Calculate Payroll'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {isArabic ? 'إجمالي الموظفين' : 'Total Employees'}
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {totalEmployeesProcessed.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {isArabic ? 'هذا الشهر' : 'This month'}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {isArabic ? 'إجمالي الراتب الأساسي' : 'Total Gross Pay'}
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {(totalGrossPay / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {isArabic ? 'ريال سعودي' : 'SAR'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {isArabic ? 'إجمالي الاستقطاعات' : 'Total Deductions'}
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {(totalDeductions / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {((totalDeductions / totalGrossPay) * 100).toFixed(1)}%
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {isArabic ? 'الصافي المدفوع' : 'Net Pay'}
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {(totalNetPay / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  {isArabic ? 'ريال سعودي' : 'SAR'}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              {isArabic ? 'حالة الرواتب' : 'Payroll Status'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'في انتظار المعالجة' : 'Pending Processing'}
              </span>
              <Badge variant="destructive">{pendingRuns}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'مكتملة' : 'Completed'}
              </span>
              <Badge variant="default">{completedRuns}</Badge>
            </div>
            <Progress 
              value={completedRuns / (completedRuns + pendingRuns) * 100} 
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {isArabic ? 'تكامل GOSI' : 'GOSI Integration'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'آخر مزامنة' : 'Last Sync'}
              </span>
              <Badge variant="outline">
                {format(new Date(), 'MMM dd, HH:mm')}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={isSyncingGOSI}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingGOSI ? 'animate-spin' : ''}`} />
              {isArabic ? 'مزامنة الآن' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isArabic ? 'نظام WPS' : 'WPS System'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'ملفات جاهزة' : 'Files Ready'}
              </span>
              <Badge variant="secondary">3</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={isGeneratingWPS}
            >
              <Download className="h-4 w-4 mr-2" />
              {isArabic ? 'إنشاء ملف WPS' : 'Generate WPS'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="dashboard">
            {isArabic ? 'لوحة التحكم' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="calculator">
            {isArabic ? 'حاسبة الرواتب' : 'Calculator'}
          </TabsTrigger>
          <TabsTrigger value="allowances">
            {isArabic ? 'البدلات' : 'Allowances'}
          </TabsTrigger>
          <TabsTrigger value="loans">
            {isArabic ? 'القروض' : 'Loans'}
          </TabsTrigger>
          <TabsTrigger value="leaves">
            {isArabic ? 'الإجازات' : 'Leaves'}
          </TabsTrigger>
          <TabsTrigger value="eos">
            {isArabic ? 'نهاية الخدمة' : 'End of Service'}
          </TabsTrigger>
          <TabsTrigger value="wps">
            {isArabic ? 'WPS' : 'WPS'}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            {isArabic ? 'التكاملات' : 'Integrations'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Payroll Runs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {isArabic ? 'آخر عمليات الرواتب' : 'Recent Payroll Runs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollRuns?.slice(0, 5).map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{run.run_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(run.pay_period_start), 'MMM dd')} - {format(new Date(run.pay_period_end), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {run.is_ramadan_period && (
                        <Badge variant="secondary">
                          {isArabic ? 'رمضان' : 'Ramadan'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {run.total_employees} {isArabic ? 'موظف' : 'employees'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(run.total_net_pay / 1000000).toFixed(2)}M SAR
                        </p>
                      </div>
                      
                      <Badge 
                        variant={
                          run.status === 'paid' ? 'default' :
                          run.status === 'approved' ? 'secondary' :
                          run.status === 'calculated' ? 'outline' : 'destructive'
                        }
                      >
                        {isArabic ? 
                          (run.status === 'paid' ? 'مدفوع' :
                           run.status === 'approved' ? 'معتمد' :
                           run.status === 'calculated' ? 'محسوب' :
                           run.status === 'draft' ? 'مسودة' : run.status) :
                          run.status
                        }
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <PayrollCalculator />
        </TabsContent>

        <TabsContent value="allowances">
          <AllowanceManager />
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'إدارة القروض والسلف' : 'Loans & Advances Management'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'قريباً...' : 'Coming soon...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'حاسبة الإجازات' : 'Leave Calculator'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'قريباً...' : 'Coming soon...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eos">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'حاسبة نهاية الخدمة' : 'End of Service Calculator'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'قريباً...' : 'Coming soon...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wps">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'إدارة WPS' : 'WPS Management'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'قريباً...' : 'Coming soon...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'قريباً...' : 'Coming soon...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          onClick={() => setActiveTab('calculator')}
          size="lg"
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
          disabled={isCalculatingPayroll}
        >
          <Calculator className={`h-5 w-5 ${isCalculatingPayroll ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};