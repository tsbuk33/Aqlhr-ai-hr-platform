import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, TrendingUp, Target } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const NitaqatManagement = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة نطاقات' : 'Nitaqat Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'إدارة وتتبع نسب السعودة ومتطلبات نطاقات' : 'Manage and track Saudization ratios and Nitaqat requirements'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'النطاق الحالي' : 'Current Band'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {isArabic ? 'أخضر' : 'Green'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'نطاق متميز' : 'excellent band'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'نسبة السعودة' : 'Saudization Rate'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75.2%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'فوق المطلوب بـ 5.2%' : '+5.2% above required'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الموظفون السعوديون' : 'Saudi Employees'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,141</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'من إجمالي 2,847' : 'out of 2,847 total'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'الهدف المستقبلي' : 'Future Target'}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'بحلول 2025' : 'by 2025'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تفاصيل النطاق' : 'Band Details'}</CardTitle>
            <CardDescription>
              {isArabic ? 'معلومات مفصلة عن وضع النطاق الحالي' : 'Detailed information about current band status'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'النسبة المطلوبة' : 'Required Rate'}</span>
              <Badge variant="outline">70%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'النسبة الحالية' : 'Current Rate'}</span>
              <Badge variant="default">75.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'الفائض' : 'Surplus'}</span>
              <Badge variant="secondary">+5.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{isArabic ? 'تاريخ آخر تحديث' : 'Last Update'}</span>
              <span className="text-sm text-muted-foreground">{isArabic ? 'اليوم' : 'Today'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'التوصيات' : 'Recommendations'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="font-medium text-green-800 dark:text-green-200">
                {isArabic ? 'وضع ممتاز' : 'Excellent Status'}
              </div>
              <div className="text-sm text-green-600 dark:text-green-300">
                {isArabic ? 'تحافظ الشركة على نطاق أخضر بامتياز' : 'Company maintains excellent green band status'}
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              {isArabic ? 'تقرير نطاقات مفصل' : 'Detailed Nitaqat Report'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'توقعات الفترة القادمة' : 'Next Period Forecast'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="nitaqat.management" 
        companyId="demo-company"
      />
    </div>
  );
};

export default NitaqatManagement;