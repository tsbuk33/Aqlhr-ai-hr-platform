import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Shield, CheckCircle, DollarSign } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const WPSIntegration = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تكامل نظام حماية الأجور' : 'Wage Protection System Integration'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التكامل مع نظام حماية الأجور التابع لوزارة العمل' : 'Integration with Ministry of Labor Wage Protection System'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'إجمالي الرواتب' : 'Total Salaries'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isArabic ? '12.5 مليون ريال' : 'SAR 12.5M'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'هذا الشهر' : 'this month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'حالة الإرسال' : 'Submission Status'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {isArabic ? 'مكتمل' : 'Complete'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'تم الإرسال بنجاح' : 'successfully submitted'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'حالة الامتثال' : 'Compliance Status'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">100%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'متوافق بالكامل' : 'fully compliant'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الملفات المرسلة' : 'Files Submitted'}
            </CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'العام الحالي' : 'current year'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تفاصيل النظام' : 'System Details'}</CardTitle>
            <CardDescription>
              {isArabic ? 'معلومات حول تكامل نظام حماية الأجور' : 'Information about WPS integration'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'رقم المنشأة' : 'Establishment ID'}</span>
              <Badge variant="outline">WPS-2024-001</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'آخر إرسال' : 'Last Submission'}</span>
              <span className="text-sm text-muted-foreground">{isArabic ? 'أمس' : 'Yesterday'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'الإرسال القادم' : 'Next Submission'}</span>
              <span className="text-sm text-muted-foreground">{isArabic ? 'في 28 يوم' : 'In 28 days'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الإجراءات' : 'Actions'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              {isArabic ? 'إرسال ملف الرواتب' : 'Submit Salary File'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تحقق من حالة الإرسال' : 'Check Submission Status'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تنزيل تقرير التوافق' : 'Download Compliance Report'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'إعدادات النظام' : 'System Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="wps.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default WPSIntegration;