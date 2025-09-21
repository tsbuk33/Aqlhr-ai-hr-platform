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
  Coins,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

export const AdvancedPayrollPage: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-background p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {isArabic ? 'حاسبة شاملة للرواتب وفقاً لقانون العمل السعودي' : 'Comprehensive Saudi Labor Law Payroll Calculator'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            {isArabic ? 
              'نظام شامل لحساب الرواتب مع جميع البدلات والحسابات المعقدة وفقاً للقانون السعودي - جميع المبالغ بالريال السعودي' :
              'Complete payroll system with all allowances and complex calculations according to Saudi law - All amounts in Saudi Riyal (SAR)'
            }
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center bg-card border border-border">
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

          <Card className="text-center bg-card border border-border">
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

          <Card className="text-center bg-card border border-border">
            <CardHeader>
              <Coins className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-sm">
                {isArabic ? 'بدلات شاملة بالريال السعودي' : 'Comprehensive SAR Allowances'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'سكن، نقل، تعليم، عائلة' : 'Housing, Transport, Education, Family'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-card border border-border">
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
          <TabsList className="grid w-full grid-cols-2 bg-muted">
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
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {isArabic ? 'الميزات المدعومة (جميع المبالغ بالريال السعودي)' : 'Supported Features (All amounts in Saudi Riyal)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { en: 'Multi-tier Overtime (1.5x, 2x, 2.5x rates) - SAR', ar: 'عمل إضافي متعدد المستويات (1.5x, 2x, 2.5x) - ريال سعودي' },
                { en: 'Shift Differentials (night, weekend, holiday) - SAR', ar: 'بدلات الورديات (ليلية، نهاية أسبوع، إجازات) - ريال سعودي' },
                { en: 'Ramadan Working Hours (6-hour adjustments) - SAR', ar: 'ساعات عمل رمضان (تعديل 6 ساعات) - ريال سعودي' },
                { en: 'Hajj Leave Entitlements (automatic calculation) - SAR', ar: 'استحقاق إجازة الحج (حساب تلقائي) - ريال سعودي' },
                { en: 'End-of-Service Benefits (complex formulas) - SAR', ar: 'مكافأة نهاية الخدمة (صيغ معقدة) - ريال سعودي' },
                { en: 'Housing/Transport Allowances - SAR', ar: 'بدلات السكن/النقل - ريال سعودي' },
                { en: 'Educational Allowances - SAR', ar: 'البدلات التعليمية - ريال سعودي' },
                { en: 'Family/Child Allowances - SAR', ar: 'بدلات العائلة/الأطفال - ريال سعودي' },
                { en: 'Danger Pay Calculations - SAR', ar: 'حسابات بدل الخطر - ريال سعودي' },
                { en: 'Performance Bonuses - SAR', ar: 'مكافآت الأداء - ريال سعودي' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background">
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