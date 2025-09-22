import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, Target } from "lucide-react";
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const FinancialPlanning = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'التخطيط المالي للموارد البشرية' : 'HR Financial Planning'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التخطيط الاستراتيجي للميزانيات والتكاليف المتعلقة بالموارد البشرية' : 'Strategic planning for HR budgets and workforce costs'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'ميزانية الموارد البشرية' : 'HR Budget'}
            </CardTitle>
            <CurrencyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isArabic ? '15.2 مليون ريال' : 'SAR 15.2M'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'الميزانية السنوية' : 'annual budget'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'معدل الإنفاق' : 'Spending Rate'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'من الميزانية المستخدمة' : 'of budget utilized'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'توقعات النمو' : 'Growth Forecast'}
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'للعام القادم' : 'next year'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'تحقيق الأهداف' : 'Target Achievement'}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'من الأهداف المالية' : 'of financial targets'}
            </p>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="financial.planning" 
        companyId="demo-company"
      />
    </div>
  );
};

export default FinancialPlanning;