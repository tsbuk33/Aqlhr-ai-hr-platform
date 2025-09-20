import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// DatePicker component will be implemented later
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, Calendar, Users, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { toast } from 'sonner';

export const PayrollCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { calculatePayroll, isCalculatingPayroll } = useAdvancedPayroll();

  const [formData, setFormData] = useState({
    company_id: '',
    pay_period_start: '',
    pay_period_end: '',
    pay_date: '',
    is_ramadan_period: false,
    employee_ids: [] as string[]
  });

  const [calculationStep, setCalculationStep] = useState(0);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const calculationSteps = [
    { key: 'employees', label: isArabic ? 'جلب بيانات الموظفين' : 'Fetching Employee Data' },
    { key: 'basic', label: isArabic ? 'حساب الراتب الأساسي' : 'Calculating Basic Salary' },
    { key: 'allowances', label: isArabic ? 'حساب البدلات' : 'Calculating Allowances' },
    { key: 'overtime', label: isArabic ? 'حساب العمل الإضافي' : 'Calculating Overtime' },
    { key: 'deductions', label: isArabic ? 'حساب الاستقطاعات' : 'Calculating Deductions' },
    { key: 'gosi', label: isArabic ? 'حساب GOSI' : 'Calculating GOSI' },
    { key: 'loans', label: isArabic ? 'حساب القروض' : 'Calculating Loans' },
    { key: 'final', label: isArabic ? 'إنهاء الحسابات' : 'Finalizing Calculations' }
  ];

  const handleCalculatePayroll = async () => {
    if (!formData.company_id || !formData.pay_period_start || !formData.pay_period_end || !formData.pay_date) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      setCalculationStep(0);
      
      // Simulate progress steps
      const interval = setInterval(() => {
        setCalculationStep(prev => {
          if (prev < calculationSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1000);

      const result = await new Promise((resolve) => {
        calculatePayroll(formData);
        // Mock result for demo
        setTimeout(() => {
          resolve({
            payroll_run_id: 'run-123',
            summary: {
              total_employees: 150,
              total_gross_pay: 2500000,
              total_deductions: 375000,
              total_net_pay: 2125000
            }
          });
        }, 8000);
      });

      setCalculationResult(result);
      clearInterval(interval);
    } catch (error) {
      console.error('Payroll calculation error:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isCalculatingPayroll || calculationStep > 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 animate-pulse" />
              {isArabic ? 'جاري حساب الرواتب...' : 'Calculating Payroll...'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary">
                  {Math.round((calculationStep / calculationSteps.length) * 100)}%
                </div>
                <p className="text-muted-foreground">
                  {isArabic ? 'مكتمل' : 'Complete'}
                </p>
              </div>
              
              <Progress 
                value={(calculationStep / calculationSteps.length) * 100} 
                className="w-full mb-6"
              />
              
              <div className="space-y-3">
                {calculationSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className={`text-sm ${index <= calculationStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                    {index < calculationStep ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : index === calculationStep ? (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {calculationResult && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                {isArabic ? 'تم حساب الرواتب بنجاح!' : 'Payroll Calculated Successfully!'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {calculationResult.summary.total_employees}
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {isArabic ? 'موظف' : 'Employees'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {(calculationResult.summary.total_gross_pay / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {isArabic ? 'إجمالي الراتب' : 'Gross Pay'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {(calculationResult.summary.total_net_pay / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {isArabic ? 'صافي الراتب' : 'Net Pay'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {isArabic ? 'حاسبة الرواتب المتقدمة' : 'Advanced Payroll Calculator'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay Period */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pay_period_start">
                  {isArabic ? 'بداية فترة الراتب' : 'Pay Period Start'}
                </Label>
                <Input
                  id="pay_period_start"
                  type="date"
                  value={formData.pay_period_start}
                  onChange={(e) => handleInputChange('pay_period_start', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="pay_period_end">
                  {isArabic ? 'نهاية فترة الراتب' : 'Pay Period End'}
                </Label>
                <Input
                  id="pay_period_end"
                  type="date"
                  value={formData.pay_period_end}
                  onChange={(e) => handleInputChange('pay_period_end', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="pay_date">
                  {isArabic ? 'تاريخ الدفع' : 'Pay Date'}
                </Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={formData.pay_date}
                  onChange={(e) => handleInputChange('pay_date', e.target.value)}
                />
              </div>
            </div>

            {/* Special Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ramadan_period">
                  {isArabic ? 'فترة رمضان' : 'Ramadan Period'}
                </Label>
                <Switch
                  id="ramadan_period"
                  checked={formData.is_ramadan_period}
                  onCheckedChange={(checked) => handleInputChange('is_ramadan_period', checked)}
                />
              </div>
              
              {formData.is_ramadan_period && (
                <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-800 dark:text-orange-200">
                      <p className="font-medium">
                        {isArabic ? 'تعديلات رمضان' : 'Ramadan Adjustments'}
                      </p>
                      <p className="mt-1">
                        {isArabic ? 
                          'سيتم تقليل ساعات العمل بساعتين يومياً وفقاً لقانون العمل السعودي' :
                          'Working hours will be reduced by 2 hours daily as per Saudi Labor Law'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {isArabic ? 'ملخص الحساب' : 'Calculation Summary'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">~150</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {isArabic ? 'موظف فعال' : 'Active Employees'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 dark:bg-green-950">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">~2.5M</div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {isArabic ? 'إجمالي متوقع' : 'Expected Gross'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 dark:bg-orange-950">
                <CardContent className="p-4 text-center">
                  <Calculator className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">~375K</div>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    {isArabic ? 'استقطاعات' : 'Deductions'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 dark:bg-purple-950">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">~2.1M</div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {isArabic ? 'صافي متوقع' : 'Expected Net'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              {isArabic ? 'معاينة' : 'Preview'}
            </Button>
            <Button 
              onClick={handleCalculatePayroll}
              disabled={isCalculatingPayroll}
              className="bg-primary hover:bg-primary/90"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {isArabic ? 'حساب الرواتب' : 'Calculate Payroll'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">
              {isArabic ? 'حساب العمل الإضافي' : 'Overtime Calculation'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'حساب دقيق للعمل الإضافي بنسبة 150%' : 'Accurate 150% overtime calculations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">
              {isArabic ? 'حسابات الإجازات' : 'Leave Calculations'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'حساب الإجازات وفقاً لقانون العمل السعودي' : 'Saudi Labor Law compliant leave calculations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">
              {isArabic ? 'البدلات المعقدة' : 'Complex Allowances'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'نظام بدلات متقدم مع صيغ معقدة' : 'Advanced allowance system with complex formulas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">
              {isArabic ? 'التوافق مع GOSI' : 'GOSI Compliance'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'حسابات GOSI التلقائية والمزامنة' : 'Automatic GOSI calculations and sync'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};