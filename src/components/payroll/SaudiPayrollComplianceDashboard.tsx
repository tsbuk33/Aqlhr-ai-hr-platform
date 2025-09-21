import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { SaudiPayrollComplianceEngine } from '@/services/SaudiPayrollComplianceEngine';
import { 
  Calculator, 
  Coins, 
  Clock, 
  Moon, 
  Plane, 
  GraduationCap,
  Users,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { SaudiLaborCompliance } from '@/types/saudi-payroll-compliance';

export const SaudiPayrollComplianceDashboard: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const { toast } = useToast();
  const [complianceEngine] = useState(new SaudiPayrollComplianceEngine());
  const [payrollData, setPayrollData] = useState<SaudiLaborCompliance | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('demo-employee-1');

  const isArabic = lang === 'ar';

  // Demo employee data
  const demoEmployees = {
    'demo-employee-1': {
      id: 'demo-employee-1',
      company_id: 'demo-company',
      employee_number: 'EMP001',
      first_name: 'Ahmed',
      last_name: 'Al-Rashid',
      basic_salary: 8000,
      hire_date: '2020-01-15',
      is_saudi: true,
      marital_status: 'married',
      children_count: 2,
      family_size: 4,
      city: 'riyadh',
      hazardous_work: false,
      risk_level: 'low',
      performance_rating: 'exceeds',
      years_since_last_hajj: 6,
      position_level: 'senior'
    },
    'demo-employee-2': {
      id: 'demo-employee-2',
      company_id: 'demo-company',
      employee_number: 'EMP002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      basic_salary: 12000,
      hire_date: '2018-03-20',
      is_saudi: false,
      marital_status: 'single',
      children_count: 0,
      family_size: 1,
      city: 'jeddah',
      hazardous_work: true,
      risk_level: 'medium',
      performance_rating: 'exceptional',
      years_since_last_hajj: 0,
      position_level: 'manager'
    }
  };

  const calculatePayroll = async () => {
    setLoading(true);
    try {
      const employeeData = demoEmployees[selectedEmployee as keyof typeof demoEmployees];
      const periodData = {
        period: '2024-12',
        regular_hours: 168, // Monthly hours
        total_hours: 180,
        night_hours: 40,
        weekend_hours: 16,
        holiday_hours: 8,
        is_ramadan_period: false,
        on_call_hours: 20,
        callback_hours: 4
      };
      const companyPolicies = {
        housing_allowance_percentage: 25,
        transport_allowance: 800,
        medical_allowance: 600
      };

      const result = await complianceEngine.calculateCompletePayroll(
        employeeData,
        periodData,
        companyPolicies
      );

      setPayrollData(result);
      toast({
        title: isArabic ? 'تم حساب الراتب بنجاح' : 'Payroll Calculated Successfully',
        description: isArabic ? 
          'تم حساب الراتب وفقاً لقانون العمل السعودي' : 
          'Payroll calculated according to Saudi Labor Law'
      });
    } catch (error) {
      console.error('Payroll calculation error:', error);
      toast({
        title: isArabic ? 'خطأ في الحساب' : 'Calculation Error',
        description: isArabic ? 
          'حدث خطأ أثناء حساب الراتب' : 
          'An error occurred during payroll calculation',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePayroll();
  }, [selectedEmployee]);

  if (!payrollData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isArabic ? 'جاري حساب الراتب...' : 'Calculating payroll...'}
          </p>
        </div>
      </div>
    );
  }

  const complianceColor = payrollData.compliance_score >= 90 ? 'text-green-600' : 
                         payrollData.compliance_score >= 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {isArabic ? 'نظام الامتثال لقانون العمل السعودي' : 'Saudi Labor Law Compliance System'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 
              'حاسبة شاملة للرواتب وفقاً لقانون العمل السعودي' : 
              'Comprehensive payroll calculator according to Saudi Labor Law'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={selectedEmployee}
            onValueChange={setSelectedEmployee}
          >
            <SelectTrigger className="w-[280px] bg-background border-border z-50">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg z-50">
              <SelectItem value="demo-employee-1">Ahmed Al-Rashid (Saudi)</SelectItem>
              <SelectItem value="demo-employee-2">Sarah Johnson (Expat)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={calculatePayroll} disabled={loading}>
            {loading ? (
              isArabic ? 'جاري الحساب...' : 'Calculating...'
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                {isArabic ? 'إعادة حساب' : 'Recalculate'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'إجمالي الراتب' : 'Total Gross'}
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollData.total_gross.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
            </div>
            <Badge variant="secondary" className="mt-2">
              {isArabic ? 'أساسي:' : 'Base:'} {payrollData.base_salary.toLocaleString()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'صافي الراتب' : 'Net Pay'}
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollData.net_pay.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
            </div>
            <Badge variant="outline" className="mt-2">
              {isArabic ? 'خصومات:' : 'Deductions:'} {payrollData.total_deductions.toLocaleString()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'ساعات إضافية' : 'Overtime Hours'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollData.overtime.overtime_hours.toFixed(1)}
            </div>
            <Badge variant="secondary" className="mt-2">
              {payrollData.overtime.total_overtime_amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'نتيجة الامتثال' : 'Compliance Score'}
            </CardTitle>
            {payrollData.compliance_score >= 90 ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : payrollData.compliance_score >= 70 ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${complianceColor}`}>
              {payrollData.compliance_score}%
            </div>
            <Progress value={payrollData.compliance_score} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="overtime" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overtime">
            <Clock className="h-4 w-4 mr-2" />
            {isArabic ? 'الإضافي' : 'Overtime'}
          </TabsTrigger>
          <TabsTrigger value="allowances">
            <Coins className="h-4 w-4 mr-2" />
            {isArabic ? 'البدلات' : 'Allowances'}
          </TabsTrigger>
          <TabsTrigger value="shifts">
            <Moon className="h-4 w-4 mr-2" />
            {isArabic ? 'الورديات' : 'Shifts'}
          </TabsTrigger>
          <TabsTrigger value="hajj">
            <Plane className="h-4 w-4 mr-2" />
            {isArabic ? 'الحج' : 'Hajj'}
          </TabsTrigger>
          <TabsTrigger value="eos">
            <GraduationCap className="h-4 w-4 mr-2" />
            {isArabic ? 'نهاية الخدمة' : 'EOS'}
          </TabsTrigger>
          <TabsTrigger value="bonuses">
            <TrendingUp className="h-4 w-4 mr-2" />
            {isArabic ? 'المكافآت' : 'Bonuses'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'حساب العمل الإضافي متعدد المستويات' : 'Multi-Tier Overtime Calculation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {payrollData.overtime.overtime_tiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {isArabic ? `المستوى ${tier.tier}` : `Tier ${tier.tier}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tier.hours_worked.toFixed(1)} {isArabic ? 'ساعات × ' : 'hours × '}
                        {tier.multiplier}x
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {tier.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                      </p>
                      <Badge variant="outline">
                        {tier.multiplier}x {isArabic ? 'معدل' : 'rate'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allowances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'بدل السكن' : 'Housing Allowance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.allowances.housing.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'النسبة:' : 'Percentage:'}</span>
                    <span>{payrollData.allowances.housing.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'عامل الموقع:' : 'Location Factor:'}</span>
                    <span>{payrollData.allowances.housing.location_factor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'بدل النقل' : 'Transport Allowance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.allowances.transport.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'بدل وقوف:' : 'Parking:'}</span>
                    <span>{payrollData.allowances.transport.parking_allowance} {isArabic ? 'ريال' : 'SAR'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'بدلات العائلة' : 'Family Allowances'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'بدل الزوجة:' : 'Spouse Allowance:'}</span>
                    <span className="font-bold">
                      {payrollData.allowances.family.spouse_allowance.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'بدل طبي للعائلة:' : 'Family Medical:'}</span>
                    <span>
                      {payrollData.allowances.family.family_medical_allowance.base_amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'البدلات التعليمية' : 'Educational Allowances'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'تعليم الموظف:' : 'Employee Education:'}</span>
                    <span className="font-bold">
                      {payrollData.allowances.educational.employee_education.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'التطوير المهني:' : 'Professional Dev:'}</span>
                    <span>
                      {payrollData.allowances.educational.professional_development.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Moon className="h-4 w-4 mr-2 inline" />
                  {isArabic ? 'وردية ليلية' : 'Night Shift'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'وقت البداية:' : 'Start Time:'}</span>
                    <span>{payrollData.shifts.night_shift.start_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'وقت النهاية:' : 'End Time:'}</span>
                    <span>{payrollData.shifts.night_shift.end_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'النسبة الإضافية:' : 'Premium:'}</span>
                    <span>{payrollData.shifts.night_shift.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.shifts.night_shift.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'وردية نهاية الأسبوع' : 'Weekend Shift'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'نسبة الجمعة:' : 'Friday Premium:'}</span>
                    <span>{payrollData.shifts.weekend_shift.friday_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'نسبة السبت:' : 'Saturday Premium:'}</span>
                    <span>{payrollData.shifts.weekend_shift.saturday_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.shifts.weekend_shift.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hajj" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Plane className="h-4 w-4 mr-2 inline" />
                {isArabic ? 'استحقاق إجازة الحج' : 'Hajj Leave Entitlement'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'مؤهل للحج:' : 'Eligible:'}</span>
                    <Badge variant={payrollData.hajj.eligible ? 'default' : 'secondary'}>
                      {payrollData.hajj.eligible ? 
                        (isArabic ? 'مؤهل' : 'Eligible') : 
                        (isArabic ? 'غير مؤهل' : 'Not Eligible')
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'أيام الإجازة:' : 'Leave Days:'}</span>
                    <span>{payrollData.hajj.leave_days_entitled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'أيام مدفوعة:' : 'Paid Days:'}</span>
                    <span>{payrollData.hajj.paid_leave_days}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'مكافأة الحج:' : 'Hajj Bonus:'}</span>
                    <span className="font-bold">
                      {payrollData.hajj.hajj_bonus.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'بدل سفر:' : 'Travel Allowance:'}</span>
                    <span className="font-bold">
                      {payrollData.hajj.travel_allowance.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'مكافأة العودة:' : 'Return Bonus:'}</span>
                    <span className="font-bold">
                      {payrollData.hajj.return_bonus.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'مكافأة نهاية الخدمة' : 'End of Service Benefits'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isArabic ? 'معلومات الخدمة' : 'Service Information'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{isArabic ? 'سنوات الخدمة:' : 'Service Years:'}</span>
                        <span className="font-bold">{payrollData.eos.service_years}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'أشهر الخدمة:' : 'Service Months:'}</span>
                        <span>{payrollData.eos.service_months}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isArabic ? 'المبالغ' : 'Amounts'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold">{isArabic ? 'إجمالي المكافأة:' : 'Total EOS:'}</span>
                        <span className="font-bold text-lg">
                          {payrollData.eos.total_eos_amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'تعويض الإجازات:' : 'Leave Compensation:'}</span>
                        <span>
                          {payrollData.eos.unused_leave_compensation.total_compensation.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isArabic ? 'طبقات الحساب' : 'Calculation Tiers'}
                  </p>
                  <div className="space-y-2">
                    {payrollData.eos.calculation_tiers.map((tier, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">
                          {isArabic ? 
                            `السنوات ${tier.years_range.min}-${tier.years_range.max === Infinity ? '+' : tier.years_range.max}: ${tier.days_per_year} يوم/سنة` :
                            `Years ${tier.years_range.min}-${tier.years_range.max === Infinity ? '+' : tier.years_range.max}: ${tier.days_per_year} days/year`
                          }
                        </span>
                        <span className="font-bold">
                          {tier.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'الأداء الفردي' : 'Individual Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'التقييم:' : 'Rating:'}</span>
                    <Badge variant="default">
                      {payrollData.bonuses.individual_performance.rating}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'النسبة:' : 'Percentage:'}</span>
                    <span>{payrollData.bonuses.individual_performance.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.bonuses.individual_performance.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'أداء الشركة' : 'Company Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'نسبة المشاركة:' : 'Profit Sharing:'}</span>
                    <span>{payrollData.bonuses.company_performance.profit_sharing_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'تحقيق الهدف:' : 'Target Achievement:'}</span>
                    <span>{payrollData.bonuses.company_performance.revenue_target_achievement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{isArabic ? 'المبلغ:' : 'Amount:'}</span>
                    <span className="font-bold">
                      {payrollData.bonuses.company_performance.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};