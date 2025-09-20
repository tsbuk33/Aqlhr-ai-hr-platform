import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { SaudiPayrollComplianceEngine } from '@/services/SaudiPayrollComplianceEngine';
import { 
  Calculator,
  ChevronRight,
  ChevronLeft,
  User,
  DollarSign,
  Clock,
  Home,
  Car,
  GraduationCap,
  Users,
  Shield,
  Calendar,
  Zap
} from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  title_ar: string;
  icon: React.ReactNode;
  completed: boolean;
}

export const PayrollCalculationWizard: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [complianceEngine] = useState(new SaudiPayrollComplianceEngine());
  
  const isArabic = lang === 'ar';

  // Wizard data state
  const [wizardData, setWizardData] = useState({
    // Employee Information
    employee_id: '',
    first_name: '',
    last_name: '',
    employee_number: '',
    basic_salary: 5000,
    hire_date: '2020-01-01',
    is_saudi: true,
    marital_status: 'single',
    children_count: 0,
    family_size: 1,
    city: 'riyadh',
    position_level: 'junior',
    
    // Work Schedule
    regular_hours: 168,
    total_hours: 168,
    night_hours: 0,
    weekend_hours: 0,
    holiday_hours: 0,
    on_call_hours: 0,
    callback_hours: 0,
    rotating_shifts: 0,
    
    // Special Conditions
    is_ramadan_period: false,
    hazardous_work: false,
    risk_level: 'low',
    years_since_last_hajj: 0,
    
    // Performance & Bonuses
    performance_rating: 'meets',
    goals_achieved: 80,
    competency_score: 85,
    team_performance: 90,
    company_performance: 100,
    
    // Deductions
    loan_deductions: 0,
    other_deductions: 0,
    zakat_deduction: 0
  });

  const [calculationResult, setCalculationResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 'employee',
      title: 'Employee Information',
      title_ar: 'معلومات الموظف',
      icon: <User className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'schedule',
      title: 'Work Schedule',
      title_ar: 'جدول العمل',
      icon: <Clock className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'allowances',
      title: 'Allowances & Benefits',
      title_ar: 'البدلات والمزايا',
      icon: <DollarSign className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'performance',
      title: 'Performance & Bonuses',
      title_ar: 'الأداء والمكافآت',
      icon: <Zap className="h-5 w-5" />,
      completed: false
    },
    {
      id: 'review',
      title: 'Review & Calculate',
      title_ar: 'مراجعة وحساب',
      icon: <Calculator className="h-5 w-5" />,
      completed: false
    }
  ];

  const updateData = (field: string, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculatePayroll = async () => {
    setCalculating(true);
    try {
      const employeeData = {
        id: wizardData.employee_id || 'wizard-employee',
        company_id: 'demo-company',
        ...wizardData
      };

      const periodData = {
        period: '2024-12',
        regular_hours: wizardData.regular_hours,
        total_hours: wizardData.total_hours,
        night_hours: wizardData.night_hours,
        weekend_hours: wizardData.weekend_hours,
        holiday_hours: wizardData.holiday_hours,
        is_ramadan_period: wizardData.is_ramadan_period,
        on_call_hours: wizardData.on_call_hours,
        callback_hours: wizardData.callback_hours,
        rotating_shifts: wizardData.rotating_shifts
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

      setCalculationResult(result);
      
      toast({
        title: isArabic ? 'تم الحساب بنجاح' : 'Calculation Complete',
        description: isArabic ? 
          'تم حساب الراتب وفقاً لقانون العمل السعودي' : 
          'Payroll calculated according to Saudi Labor Law'
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: isArabic ? 'خطأ في الحساب' : 'Calculation Error',
        description: isArabic ? 
          'حدث خطأ أثناء حساب الراتب' : 
          'An error occurred during calculation',
        variant: 'destructive'
      });
    } finally {
      setCalculating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Employee Information
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="first_name">
                  {isArabic ? 'الاسم الأول' : 'First Name'}
                </Label>
                <Input
                  id="first_name"
                  value={wizardData.first_name}
                  onChange={(e) => updateData('first_name', e.target.value)}
                  placeholder={isArabic ? 'أحمد' : 'Ahmed'}
                />
              </div>
              <div>
                <Label htmlFor="last_name">
                  {isArabic ? 'اسم العائلة' : 'Last Name'}
                </Label>
                <Input
                  id="last_name"
                  value={wizardData.last_name}
                  onChange={(e) => updateData('last_name', e.target.value)}
                  placeholder={isArabic ? 'الراشد' : 'Al-Rashid'}
                />
              </div>
              <div>
                <Label htmlFor="employee_number">
                  {isArabic ? 'رقم الموظف' : 'Employee Number'}
                </Label>
                <Input
                  id="employee_number"
                  value={wizardData.employee_number}
                  onChange={(e) => updateData('employee_number', e.target.value)}
                  placeholder="EMP001"
                />
              </div>
              <div>
                <Label htmlFor="basic_salary">
                  {isArabic ? 'الراتب الأساسي (ريال)' : 'Basic Salary (SAR)'}
                </Label>
                <Input
                  id="basic_salary"
                  type="number"
                  value={wizardData.basic_salary}
                  onChange={(e) => updateData('basic_salary', parseInt(e.target.value) || 0)}
                  min="4000"
                />
              </div>
              <div>
                <Label htmlFor="hire_date">
                  {isArabic ? 'تاريخ التوظيف' : 'Hire Date'}
                </Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={wizardData.hire_date}
                  onChange={(e) => updateData('hire_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">
                  {isArabic ? 'المدينة' : 'City'}
                </Label>
                <Select value={wizardData.city} onValueChange={(value) => updateData('city', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riyadh">{isArabic ? 'الرياض' : 'Riyadh'}</SelectItem>
                    <SelectItem value="jeddah">{isArabic ? 'جدة' : 'Jeddah'}</SelectItem>
                    <SelectItem value="dammam">{isArabic ? 'الدمام' : 'Dammam'}</SelectItem>
                    <SelectItem value="makkah">{isArabic ? 'مكة' : 'Makkah'}</SelectItem>
                    <SelectItem value="medina">{isArabic ? 'المدينة' : 'Medina'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_saudi"
                  checked={wizardData.is_saudi}
                  onCheckedChange={(checked) => updateData('is_saudi', checked)}
                />
                <Label htmlFor="is_saudi">
                  {isArabic ? 'سعودي الجنسية' : 'Saudi National'}
                </Label>
              </div>
              
              <div>
                <Label htmlFor="marital_status">
                  {isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
                </Label>
                <Select value={wizardData.marital_status} onValueChange={(value) => updateData('marital_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{isArabic ? 'أعزب' : 'Single'}</SelectItem>
                    <SelectItem value="married">{isArabic ? 'متزوج' : 'Married'}</SelectItem>
                    <SelectItem value="divorced">{isArabic ? 'مطلق' : 'Divorced'}</SelectItem>
                    <SelectItem value="widowed">{isArabic ? 'أرمل' : 'Widowed'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="children_count">
                  {isArabic ? 'عدد الأطفال' : 'Number of Children'}
                </Label>
                <Input
                  id="children_count"
                  type="number"
                  value={wizardData.children_count}
                  onChange={(e) => updateData('children_count', parseInt(e.target.value) || 0)}
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Work Schedule
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="regular_hours">
                  {isArabic ? 'الساعات النظامية (شهرياً)' : 'Regular Hours (Monthly)'}
                </Label>
                <Input
                  id="regular_hours"
                  type="number"
                  value={wizardData.regular_hours}
                  onChange={(e) => updateData('regular_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="total_hours">
                  {isArabic ? 'إجمالي الساعات' : 'Total Hours'}
                </Label>
                <Input
                  id="total_hours"
                  type="number"
                  value={wizardData.total_hours}
                  onChange={(e) => updateData('total_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="night_hours">
                  {isArabic ? 'ساعات ليلية' : 'Night Hours'}
                </Label>
                <Input
                  id="night_hours"
                  type="number"
                  value={wizardData.night_hours}
                  onChange={(e) => updateData('night_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="weekend_hours">
                  {isArabic ? 'ساعات نهاية الأسبوع' : 'Weekend Hours'}
                </Label>
                <Input
                  id="weekend_hours"
                  type="number"
                  value={wizardData.weekend_hours}
                  onChange={(e) => updateData('weekend_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="holiday_hours">
                  {isArabic ? 'ساعات الإجازات' : 'Holiday Hours'}
                </Label>
                <Input
                  id="holiday_hours"
                  type="number"
                  value={wizardData.holiday_hours}
                  onChange={(e) => updateData('holiday_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="on_call_hours">
                  {isArabic ? 'ساعات الاستدعاء' : 'On-Call Hours'}
                </Label>
                <Input
                  id="on_call_hours"
                  type="number"
                  value={wizardData.on_call_hours}
                  onChange={(e) => updateData('on_call_hours', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_ramadan_period"
                  checked={wizardData.is_ramadan_period}
                  onCheckedChange={(checked) => updateData('is_ramadan_period', checked)}
                />
                <Label htmlFor="is_ramadan_period">
                  {isArabic ? 'فترة رمضان (6 ساعات عمل)' : 'Ramadan Period (6-hour workday)'}
                </Label>
              </div>

              {wizardData.is_ramadan_period && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 
                      'خلال شهر رمضان، يتم تقليل ساعات العمل إلى 6 ساعات يومياً وفقاً لقانون العمل السعودي' :
                      'During Ramadan, working hours are reduced to 6 hours per day according to Saudi Labor Law'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Allowances & Benefits
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {isArabic ? 'بدل السكن' : 'Housing Allowance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 
                      'يحسب تلقائياً كنسبة 25% من الراتب الأساسي' :
                      'Automatically calculated as 25% of basic salary'
                    }
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {(wizardData.basic_salary * 0.25).toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {isArabic ? 'بدل النقل' : 'Transport Allowance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 
                      'بدل نقل ثابت شهري' :
                      'Fixed monthly transport allowance'
                    }
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    800 {isArabic ? 'ريال' : 'SAR'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {isArabic ? 'البدل التعليمي' : 'Educational Allowance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 
                      'بدل تعليم الموظف والأطفال' :
                      'Employee and children education allowance'
                    }
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {(2000 + (wizardData.children_count * 500)).toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {isArabic ? 'بدلات العائلة' : 'Family Allowances'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 
                      'بدل الزوجة والأطفال' :
                      'Spouse and children allowances'
                    }
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {((wizardData.marital_status === 'married' ? 400 : 0) + (wizardData.children_count * 150)).toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hazardous_work"
                  checked={wizardData.hazardous_work}
                  onCheckedChange={(checked) => updateData('hazardous_work', checked)}
                />
                <Label htmlFor="hazardous_work">
                  {isArabic ? 'عمل خطر (بدل خطورة)' : 'Hazardous Work (Danger Pay)'}
                </Label>
              </div>

              {wizardData.hazardous_work && (
                <div>
                  <Label htmlFor="risk_level">
                    {isArabic ? 'مستوى الخطر' : 'Risk Level'}
                  </Label>
                  <Select value={wizardData.risk_level} onValueChange={(value) => updateData('risk_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{isArabic ? 'منخفض (5%)' : 'Low (5%)'}</SelectItem>
                      <SelectItem value="medium">{isArabic ? 'متوسط (10%)' : 'Medium (10%)'}</SelectItem>
                      <SelectItem value="high">{isArabic ? 'عالي (20%)' : 'High (20%)'}</SelectItem>
                      <SelectItem value="extreme">{isArabic ? 'شديد الخطورة (35%)' : 'Extreme (35%)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Performance & Bonuses
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="performance_rating">
                  {isArabic ? 'تقييم الأداء' : 'Performance Rating'}
                </Label>
                <Select value={wizardData.performance_rating} onValueChange={(value) => updateData('performance_rating', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exceptional">{isArabic ? 'متميز (25%)' : 'Exceptional (25%)'}</SelectItem>
                    <SelectItem value="exceeds">{isArabic ? 'يتجاوز التوقعات (15%)' : 'Exceeds (15%)'}</SelectItem>
                    <SelectItem value="meets">{isArabic ? 'يلبي التوقعات (5%)' : 'Meets (5%)'}</SelectItem>
                    <SelectItem value="below">{isArabic ? 'أقل من المتوقع (0%)' : 'Below (0%)'}</SelectItem>
                    <SelectItem value="unsatisfactory">{isArabic ? 'غير مرضي (0%)' : 'Unsatisfactory (0%)'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goals_achieved">
                  {isArabic ? 'الأهداف المحققة (%)' : 'Goals Achieved (%)'}
                </Label>
                <Input
                  id="goals_achieved"
                  type="number"
                  value={wizardData.goals_achieved}
                  onChange={(e) => updateData('goals_achieved', parseInt(e.target.value) || 0)}
                  min="0"
                  max="150"
                />
              </div>

              <div>
                <Label htmlFor="competency_score">
                  {isArabic ? 'نتيجة الكفاءة (%)' : 'Competency Score (%)'}
                </Label>
                <Input
                  id="competency_score"
                  type="number"
                  value={wizardData.competency_score}
                  onChange={(e) => updateData('competency_score', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="team_performance">
                  {isArabic ? 'أداء الفريق (%)' : 'Team Performance (%)'}
                </Label>
                <Input
                  id="team_performance"
                  type="number"
                  value={wizardData.team_performance}
                  onChange={(e) => updateData('team_performance', parseInt(e.target.value) || 0)}
                  min="0"
                  max="150"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">
                {isArabic ? 'الخصومات' : 'Deductions'}
              </h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="loan_deductions">
                    {isArabic ? 'خصم القروض (ريال)' : 'Loan Deductions (SAR)'}
                  </Label>
                  <Input
                    id="loan_deductions"
                    type="number"
                    value={wizardData.loan_deductions}
                    onChange={(e) => updateData('loan_deductions', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="other_deductions">
                    {isArabic ? 'خصومات أخرى (ريال)' : 'Other Deductions (SAR)'}
                  </Label>
                  <Input
                    id="other_deductions"
                    type="number"
                    value={wizardData.other_deductions}
                    onChange={(e) => updateData('other_deductions', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="zakat_deduction">
                    {isArabic ? 'خصم الزكاة (ريال)' : 'Zakat Deduction (SAR)'}
                  </Label>
                  <Input
                    id="zakat_deduction"
                    type="number"
                    value={wizardData.zakat_deduction}
                    onChange={(e) => updateData('zakat_deduction', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Review & Calculate
        return (
          <div className="space-y-6">
            {calculationResult ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-center">
                  {isArabic ? 'نتائج حساب الراتب' : 'Payroll Calculation Results'}
                </h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {isArabic ? 'إجمالي الراتب' : 'Total Gross'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center">
                        {calculationResult.total_gross.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {isArabic ? 'إجمالي الخصومات' : 'Total Deductions'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center text-red-600">
                        {calculationResult.total_deductions.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {isArabic ? 'صافي الراتب' : 'Net Pay'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center text-green-600">
                        {calculationResult.net_pay.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {isArabic ? 'تفاصيل البدلات' : 'Allowances Breakdown'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>{isArabic ? 'بدل السكن:' : 'Housing:'}</span>
                        <span>{calculationResult.allowances.housing.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'بدل النقل:' : 'Transport:'}</span>
                        <span>{calculationResult.allowances.transport.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'بدلات العائلة:' : 'Family:'}</span>
                        <span>{calculationResult.allowances.family.spouse_allowance.amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {isArabic ? 'العمل الإضافي' : 'Overtime Details'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>{isArabic ? 'الساعات الإضافية:' : 'Overtime Hours:'}</span>
                        <span>{calculationResult.overtime.overtime_hours.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? 'مبلغ الإضافي:' : 'Overtime Amount:'}</span>
                        <span>{calculationResult.overtime.total_overtime_amount.toLocaleString()} {isArabic ? 'ريال' : 'SAR'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {isArabic ? 'نتيجة الامتثال' : 'Compliance Score'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {calculationResult.compliance_score}%
                      </div>
                      <Progress value={calculationResult.compliance_score} className="flex-1" />
                      <Badge variant={calculationResult.compliance_score >= 90 ? 'default' : 'secondary'}>
                        {calculationResult.compliance_score >= 90 ? 
                          (isArabic ? 'متوافق' : 'Compliant') : 
                          (isArabic ? 'يحتاج مراجعة' : 'Needs Review')
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Calculator className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-bold">
                  {isArabic ? 'جاهز لحساب الراتب' : 'Ready to Calculate Payroll'}
                </h3>
                <p className="text-muted-foreground">
                  {isArabic ? 
                    'انقر على زر "حساب الراتب" لتطبيق جميع قوانين العمل السعودي' :
                    'Click "Calculate Payroll" to apply all Saudi Labor Law regulations'
                  }
                </p>
                <Button onClick={calculatePayroll} disabled={calculating} size="lg">
                  {calculating ? (
                    isArabic ? 'جاري الحساب...' : 'Calculating...'
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      {isArabic ? 'حساب الراتب' : 'Calculate Payroll'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'معالج حساب الراتب المتقدم' : 'Advanced Payroll Calculation Wizard'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 
            'حساب شامل للراتب وفقاً لقانون العمل السعودي' :
            'Comprehensive payroll calculation according to Saudi Labor Law'
          }
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{isArabic ? 'التقدم:' : 'Progress:'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-background border text-muted-foreground'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step.icon}
              <span className="text-sm hidden md:inline">
                {isArabic ? step.title_ar : step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {steps[currentStep].icon}
            {isArabic ? steps[currentStep].title_ar : steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {isArabic ? 'السابق' : 'Previous'}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>
            {isArabic ? 'التالي' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={calculatePayroll} disabled={calculating}>
            {calculating ? (
              isArabic ? 'جاري الحساب...' : 'Calculating...'
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                {isArabic ? 'حساب نهائي' : 'Final Calculate'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};