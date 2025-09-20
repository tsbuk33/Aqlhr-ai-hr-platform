import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Shield, Users } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const BenefitsManagement = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة المزايا والتعويضات' : 'Benefits & Compensation Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'إدارة شاملة لمزايا الموظفين وحزم التعويضات' : 'Comprehensive employee benefits and compensation package management'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المزايا النشطة' : 'Active Benefits'}
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? '+3 هذا الشهر' : '+3 this month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'إجمالي التعويضات' : 'Total Compensation'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isArabic ? '2.4 مليون ريال' : 'SAR 2.4M'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? '+12% من الشهر الماضي' : '+12% from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'التأمين الصحي' : 'Health Insurance'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'نسبة التغطية' : 'Coverage rate'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'المشاركون' : 'Enrolled Employees'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'من إجمالي الموظفين' : 'total employees'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'حزم المزايا' : 'Benefits Packages'}</CardTitle>
            <CardDescription>
              {isArabic ? 'حزم المزايا المتاحة للموظفين' : 'Available benefit packages for employees'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'الحزمة الأساسية' : 'Basic Package'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'المزايا الأساسية للموظفين' : 'Essential benefits for all employees'}</div>
              </div>
              <Badge variant="secondary">{isArabic ? '1,245 موظف' : '1,245 employees'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'الحزمة المتميزة' : 'Premium Package'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'مزايا إضافية للمناصب العليا' : 'Enhanced benefits for senior positions'}</div>
              </div>
              <Badge variant="default">{isArabic ? '892 موظف' : '892 employees'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'الحزمة التنفيذية' : 'Executive Package'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'مزايا شاملة للإدارة التنفيذية' : 'Comprehensive benefits for executives'}</div>
              </div>
              <Badge variant="outline">{isArabic ? '156 موظف' : '156 employees'}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              {isArabic ? 'إنشاء حزمة مزايا جديدة' : 'Create New Benefits Package'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'مراجعة طلبات المزايا' : 'Review Benefits Applications'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تقرير التكاليف الشهري' : 'Monthly Cost Report'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'إعدادات التأمين الصحي' : 'Health Insurance Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="benefits.management" 
        companyId="demo-company"
      />
    </div>
  );
};

export default BenefitsManagement;