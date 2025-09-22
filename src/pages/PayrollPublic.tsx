import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calculator, FileText, TrendingUp, Shield, Users } from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function PayrollPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const payrollFeatures = [
    {
      icon: CurrencyIcon,
      title: isArabic ? 'معالجة الرواتب' : 'Salary Processing',
      description: isArabic ? 'معالجة تلقائية ودقيقة للرواتب والأجور' : 'Automatic and accurate salary and wage processing'
    },
    {
      icon: Calculator,
      title: isArabic ? 'حساب التأمينات' : 'Insurance Calculations',
      description: isArabic ? 'حساب تلقائي لاشتراكات التأمينات الاجتماعية' : 'Automatic calculation of social insurance contributions'
    },
    {
      icon: FileText,
      title: isArabic ? 'كشوف الرواتب' : 'Payslips',
      description: isArabic ? 'إنتاج كشوف رواتب تفصيلية وإرسالها تلقائياً' : 'Generate detailed payslips and send automatically'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تحليلات التكاليف' : 'Cost Analytics',
      description: isArabic ? 'تحليل تكاليف الرواتب والمزايا' : 'Analyze salary and benefits costs'
    },
    {
      icon: Shield,
      title: isArabic ? 'الامتثال القانوني' : 'Legal Compliance',
      description: isArabic ? 'ضمان الامتثال لقوانين العمل والضرائب' : 'Ensure compliance with labor and tax laws'
    },
    {
      icon: Users,
      title: isArabic ? 'إدارة المزايا' : 'Benefits Management',
      description: isArabic ? 'إدارة البدلات والمزايا والخصومات' : 'Manage allowances, benefits, and deductions'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'إدارة الرواتب' : 'Payroll Management'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'نظام متكامل لمعالجة الرواتب والأجور مع الامتثال الكامل للأنظمة السعودية'
            : 'Integrated system for salary and wage processing with full compliance to Saudi regulations'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {payrollFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى نظام إدارة الرواتب الكامل'
            : '🔒 Login to access the complete Payroll Management system'
          }
        </p>
      </div>
    </div>
  );
}