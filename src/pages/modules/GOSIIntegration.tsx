import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, CheckCircle, AlertCircle } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const GOSIIntegration = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تكامل نظام الجوسي' : 'GOSI Integration System'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التكامل المباشر مع النظام العام للتأمينات الاجتماعية' : 'Direct integration with General Organization for Social Insurance'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الموظفون المؤمن عليهم' : 'Insured Employees'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? '100% من الموظفين' : '100% of employees'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الاشتراكات الشهرية' : 'Monthly Contributions'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isArabic ? '850,000 ريال' : 'SAR 850K'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'تم دفعها بنجاح' : 'paid successfully'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'حالة التزامن' : 'Sync Status'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {isArabic ? 'متزامن' : 'Synced'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'آخر تحديث: اليوم' : 'last update: today'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'التحديثات المعلقة' : 'Pending Updates'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'جميع البيانات محدثة' : 'all data updated'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'خدمات الجوسي' : 'GOSI Services'}</CardTitle>
            <CardDescription>
              {isArabic ? 'الخدمات المتاحة عبر التكامل' : 'Available services through integration'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'تسجيل الموظفين الجدد' : 'New Employee Registration'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'تسجيل تلقائي للموظفين الجدد' : 'Automatic registration for new hires'}</div>
              </div>
              <Badge variant="default">{isArabic ? 'نشط' : 'Active'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'تحديث بيانات الموظفين' : 'Employee Data Updates'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'مزامنة البيانات الشخصية والوظيفية' : 'Sync personal and employment data'}</div>
              </div>
              <Badge variant="default">{isArabic ? 'نشط' : 'Active'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'حساب الاشتراكات' : 'Contribution Calculations'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'حساب اشتراكات التأمينات الاجتماعية' : 'Calculate social insurance contributions'}</div>
              </div>
              <Badge variant="default">{isArabic ? 'نشط' : 'Active'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              {isArabic ? 'مزامنة البيانات مع الجوسي' : 'Sync Data with GOSI'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تقرير الاشتراكات الشهرية' : 'Monthly Contributions Report'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'استعلام عن حالة موظف' : 'Employee Status Inquiry'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'إعدادات التكامل' : 'Integration Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="gosi.integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default GOSIIntegration;