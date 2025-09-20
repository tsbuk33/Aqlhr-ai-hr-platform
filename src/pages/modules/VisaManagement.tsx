import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, FileText, Clock, AlertCircle } from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AqlHRAIAssistant } from '@/components/ai';

const VisaManagement = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة التأشيرات وتصاريح العمل' : 'Visa & Work Permit Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'إدارة شاملة لتأشيرات الموظفين وتصاريح العمل' : 'Comprehensive management of employee visas and work permits'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'التأشيرات النشطة' : 'Active Visas'}
            </CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">706</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'للموظفين الوافدين' : 'for expat employees'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'طلبات التجديد' : 'Renewal Applications'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'قيد المعالجة' : 'in progress'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'تنتهي قريباً' : 'Expiring Soon'}
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">12</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'خلال 30 يوم' : 'within 30 days'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isArabic ? 'حالات طارئة' : 'Urgent Cases'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'تحتاج إجراء فوري' : 'need immediate action'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'أنواع التأشيرات' : 'Visa Types'}</CardTitle>
            <CardDescription>
              {isArabic ? 'توزيع التأشيرات حسب النوع' : 'Distribution of visas by type'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'تأشيرة عمل' : 'Work Visa'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'للموظفين الوافدين' : 'For expat employees'}</div>
              </div>
              <Badge variant="default">645</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'تأشيرة عائلية' : 'Family Visa'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'لأفراد العائلة' : 'For family members'}</div>
              </div>
              <Badge variant="secondary">45</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{isArabic ? 'تأشيرة زيارة' : 'Visit Visa'}</div>
                <div className="text-sm text-muted-foreground">{isArabic ? 'للزيارات المؤقتة' : 'For temporary visits'}</div>
              </div>
              <Badge variant="outline">16</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="default">
              {isArabic ? 'طلب تأشيرة جديدة' : 'Apply for New Visa'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تجديد التأشيرات المنتهية' : 'Renew Expiring Visas'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تقرير حالة التأشيرات' : 'Visa Status Report'}
            </Button>
            <Button className="w-full" variant="outline">
              {isArabic ? 'تتبع الطلبات' : 'Track Applications'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="visa.management" 
        companyId="demo-company"
      />
    </div>
  );
};

export default VisaManagement;