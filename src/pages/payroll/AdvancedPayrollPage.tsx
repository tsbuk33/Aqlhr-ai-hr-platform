import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SaudiPayrollComplianceDashboard } from '@/components/payroll/SaudiPayrollComplianceDashboard';
import { PayrollCalculationWizard } from '@/components/payroll/PayrollCalculationWizard';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Calculator, 
  Zap, 
  BookOpen, 
  Shield,
  DollarSign,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

export const AdvancedPayrollPage: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {isArabic ? 'نظام الرواتب المتقدم' : 'Advanced Payroll System'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isArabic ? 
              'نظام شامل لحساب الرواتب وفقاً لقانون العمل السعودي مع جميع البدلات والحسابات المعقدة' :
              'Comprehensive payroll system with Saudi Labor Law compliance and complex calculations'
            }
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader>
              <Calculator className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-sm">
                {isArabic ? 'حسابات متعددة المستويات' : 'Multi-tier Calculations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'عمل إضافي بمعدلات 1.5x, 2x, 2.5x' : 'Overtime at 1.5x, 2x, 2.5x rates'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-sm">
                {isArabic ? 'تعديلات رمضان' : 'Ramadan Adjustments'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'ساعات عمل مخفضة إلى 6 ساعات' : '6-hour workday adjustments'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-sm">
                {isArabic ? 'بدلات شاملة' : 'Comprehensive Allowances'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'سكن، نقل، تعليم، عائلة' : 'Housing, Transport, Education, Family'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-sm">
                {isArabic ? 'امتثال كامل' : 'Full Compliance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'قانون العمل السعودي' : 'Saudi Labor Law'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isArabic ? 'لوحة التحكم' : 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="wizard" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {isArabic ? 'معالج الحساب' : 'Calculation Wizard'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <SaudiPayrollComplianceDashboard />
          </TabsContent>

          <TabsContent value="wizard" className="mt-6">
            <PayrollCalculationWizard />
          </TabsContent>
        </Tabs>

        {/* Compliance Features List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {isArabic ? 'الميزات المدعومة' : 'Supported Features'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { en: 'Multi-tier Overtime (1.5x, 2x, 2.5x rates)', ar: 'عمل إضافي متعدد المستويات (1.5x, 2x, 2.5x)' },
                { en: 'Shift Differentials (night, weekend, holiday)', ar: 'بدلات الورديات (ليلية، نهاية أسبوع، إجازات)' },
                { en: 'Ramadan Working Hours (6-hour adjustments)', ar: 'ساعات عمل رمضان (تعديل 6 ساعات)' },
                { en: 'Hajj Leave Entitlements (automatic calculation)', ar: 'استحقاق إجازة الحج (حساب تلقائي)' },
                { en: 'End-of-Service Benefits (complex formulas)', ar: 'مكافأة نهاية الخدمة (صيغ معقدة)' },
                { en: 'Housing/Transport Allowances', ar: 'بدلات السكن/النقل' },
                { en: 'Educational Allowances', ar: 'البدلات التعليمية' },
                { en: 'Family/Child Allowances', ar: 'بدلات العائلة/الأطفال' },
                { en: 'Danger Pay Calculations', ar: 'حسابات بدل الخطر' },
                { en: 'Performance Bonuses', ar: 'مكافآت الأداء' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm">
                    {isArabic ? feature.ar : feature.en}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedPayrollPage;