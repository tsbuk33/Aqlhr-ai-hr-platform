import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Scale, Building } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function CompliancePublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const complianceAreas = [
    {
      icon: Shield,
      title: isArabic ? 'نطاقات السعودة' : 'Nitaqat Compliance',
      description: isArabic ? 'مراقبة وإدارة متطلبات السعودة ونطاقات العمل' : 'Monitor and manage Saudization requirements and labor bands',
      status: 'compliant'
    },
    {
      icon: FileCheck,
      title: isArabic ? 'أنظمة العمل السعودية' : 'Saudi Labor Law',
      description: isArabic ? 'امتثال كامل لأنظمة العمل والعمال السعودية' : 'Full compliance with Saudi labor and worker regulations',
      status: 'compliant'
    },
    {
      icon: AlertTriangle,
      title: isArabic ? 'إدارة المخاطر' : 'Risk Management',
      description: isArabic ? 'تحديد وإدارة مخاطر الامتثال التنظيمي' : 'Identify and manage regulatory compliance risks',
      status: 'review'
    },
    {
      icon: Building,
      title: isArabic ? 'التأمينات الاجتماعية' : 'GOSI Compliance',
      description: isArabic ? 'إدارة متطلبات التأمينات الاجتماعية والتقارير' : 'Manage GOSI requirements and reporting',
      status: 'compliant'
    },
    {
      icon: Scale,
      title: isArabic ? 'حقوق الموظفين' : 'Employee Rights',
      description: isArabic ? 'ضمان حماية حقوق الموظفين وفقاً للأنظمة' : 'Ensure employee rights protection per regulations',
      status: 'compliant'
    },
    {
      icon: CheckCircle,
      title: isArabic ? 'التدقيق والمراجعة' : 'Audit & Review',
      description: isArabic ? 'مراجعات دورية وتدقيق شامل للامتثال' : 'Regular reviews and comprehensive compliance audits',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'review': return 'text-yellow-600 bg-yellow-50';
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return isArabic ? 'متوافق' : 'Compliant';
      case 'review': return isArabic ? 'قيد المراجعة' : 'Under Review';
      case 'scheduled': return isArabic ? 'مجدول' : 'Scheduled';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'الامتثال والحوكمة' : 'Compliance & Governance'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'إدارة شاملة للامتثال التنظيمي والحوكمة وفقاً للأنظمة السعودية'
            : 'Comprehensive regulatory compliance and governance management per Saudi regulations'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {complianceAreas.map((area, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <area.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                  {getStatusText(area.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {area.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">
              {isArabic ? '✅ حالة الامتثال الحالية' : '✅ Current Compliance Status'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'نسبة السعودة' : 'Saudization Rate'}</span>
              <span className="text-green-700 font-bold">67.8%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'النطاق الحالي' : 'Current Band'}</span>
              <span className="text-blue-700 font-bold">{isArabic ? 'أخضر متوسط' : 'Medium Green'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'آخر مراجعة' : 'Last Review'}</span>
              <span className="text-purple-700 font-bold">15 {isArabic ? 'أيام مضت' : 'days ago'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">
              {isArabic ? '📋 الإجراءات المطلوبة' : '📋 Required Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h4 className="font-semibold text-yellow-800">
                {isArabic ? 'تحديث بيانات الموظفين' : 'Update Employee Data'}
              </h4>
              <p className="text-sm text-yellow-700">
                {isArabic ? 'تحديث بيانات 3 موظفين في نظام قوى' : 'Update 3 employees data in Qiwa system'}
              </p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h4 className="font-semibold text-blue-800">
                {isArabic ? 'تجديد رخص العمل' : 'Renew Work Permits'}
              </h4>
              <p className="text-sm text-blue-700">
                {isArabic ? '5 رخص عمل تحتاج تجديد خلال 30 يوم' : '5 work permits need renewal within 30 days'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى التقارير التفصيلية وأدوات الامتثال المتقدمة'
            : '🔒 Login to access detailed reports and advanced compliance tools'
          }
        </p>
      </div>
    </div>
  );
}