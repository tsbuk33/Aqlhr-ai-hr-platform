import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, TrendingDown, AlertCircle } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const ExpenseManagement = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة المصروفات' : 'Expense Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'تتبع وإدارة مصروفات الموظفين والمؤسسة' : 'Track and manage employee and organizational expenses'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المصروفات الشهرية' : 'Monthly Expenses'}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isArabic ? '456,780 ريال' : 'SAR 456,780'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? '-8% من الشهر الماضي' : '-8% from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المطالبات المعلقة' : 'Pending Claims'}
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'بحاجة للمراجعة' : 'awaiting review'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'نسبة الوفورات' : 'Savings Rate'}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'مقارنة بالعام الماضي' : 'vs last year'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المخالفات' : 'Policy Violations'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'هذا الشهر' : 'this month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="expense.management" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ExpenseManagement;