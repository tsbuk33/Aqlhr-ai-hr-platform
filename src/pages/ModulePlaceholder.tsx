import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AqlHRAIAssistant } from '@/components/ai';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

const titles: Record<string, { en: string; ar: string; group?: string }> = {
  'system-overview': { en: 'System Overview', ar: 'نظرة عامة على النظام', group: 'core' },
  'dashboard': { en: 'Dashboard', ar: 'لوحة التحكم', group: 'core' },
  'aqlhr-landing': { en: 'AqlHR Landing', ar: 'الصفحة الرئيسية لعقل HR', group: 'core' },
  'auth': { en: 'Authentication', ar: 'تسجيل الدخول', group: 'core' },
  'core-hr': { en: 'Core HR', ar: 'الموارد البشرية الأساسية', group: 'hr' },
  'employees': { en: 'Employees', ar: 'الموظفون', group: 'hr' },
  'organization': { en: 'Organization', ar: 'الهيكل التنظيمي', group: 'hr' },
  'self-service': { en: 'Self Service', ar: 'الخدمة الذاتية', group: 'hr' },
  'documents': { en: 'Documents', ar: 'المستندات', group: 'hr' },
  'employee-master-data': { en: 'Employee Master Data', ar: 'البيانات الرئيسية للموظف', group: 'hr' },
  'benefits': { en: 'Benefits', ar: 'المزايا', group: 'hr' },
  'benefits-administration': { en: 'Benefits Administration', ar: 'إدارة المزايا', group: 'hr' },
  'succession-planning-core': { en: 'Succession Planning Core', ar: 'التخطيط للتعاقب', group: 'hr' },
  'compensation-management-core': { en: 'Compensation Management Core', ar: 'إدارة التعويضات', group: 'hr' },
  'time-attendance': { en: 'Time & Attendance', ar: 'الحضور والانصراف', group: 'hr' },
  'performance': { en: 'Performance Management', ar: 'إدارة الأداء', group: 'hr' },
  'leave': { en: 'Leave Management', ar: 'إدارة الإجازات', group: 'hr' },
  'training-development': { en: 'Training & Development', ar: 'التدريب والتطوير', group: 'hr' },
  'recruitment-onboarding': { en: 'Recruitment & Onboarding', ar: 'التوظيف والانضمام', group: 'hr' },
  'compensation-benefits': { en: 'Compensation & Benefits', ar: 'التعويضات والمزايا', group: 'hr' },
  'workflow-automation': { en: 'Workflow Automation', ar: 'أتمتة سير العمل', group: 'hr' },
  'mobile-hr': { en: 'Mobile HR', ar: 'تطبيق الموارد البشرية', group: 'hr' },
  'saudization-calculator': { en: 'Saudization Calculator', ar: 'حاسبة السعودة', group: 'hr' },
  'payroll': { en: 'Payroll', ar: 'الرواتب', group: 'payroll' },
  'wps-processing': { en: 'WPS Processing', ar: 'نظام حماية الأجور', group: 'payroll' },
  'gosi-integration': { en: 'GOSI Integration', ar: 'تكامل الجوسي', group: 'gov' },
  'eosb-calculations': { en: 'EOSB Calculations', ar: 'مكافأة نهاية الخدمة', group: 'payroll' },
  'expense-management': { en: 'Expense Management', ar: 'إدارة المصروفات', group: 'payroll' },
  'payroll-analytics': { en: 'Payroll Analytics', ar: 'تحليلات الرواتب', group: 'payroll' },
  'bank-integration': { en: 'Bank Integration', ar: 'تكامل البنوك', group: 'payroll' },
  'budget-forecasting': { en: 'Budget Forecasting', ar: 'التنبؤ بالميزانية', group: 'payroll' },
  'government': { en: 'Government', ar: 'التكاملات الحكومية', group: 'gov' },
  'qiwa': { en: 'Qiwa Integration', ar: 'تكامل قوى', group: 'gov' },
  'absher': { en: 'Absher Platform', ar: 'منصة أبشر', group: 'gov' },
  'muqeem': { en: 'Muqeem Platform', ar: 'منصة مقيم', group: 'gov' },
  'mudad': { en: 'Mudad Platform', ar: 'منصة مدد', group: 'gov' },
  'nitaqat-compliance': { en: 'Nitaqat Compliance', ar: 'امتثال نطاقات', group: 'gov' },
  'tvtc': { en: 'TVTC Integration', ar: 'تكامل التدريب التقني', group: 'gov' },
  'mol-compliance': { en: 'MOL Compliance', ar: 'امتثال وزارة العمل', group: 'gov' },
  'elm': { en: 'ELM Platform', ar: 'منصة علم', group: 'gov' },
  'seha': { en: 'Seha Platform', ar: 'منصة صحة', group: 'gov' },
  'chi': { en: 'CHI Platform', ar: 'منصة الضمان الصحي', group: 'gov' },
  'health-insurance': { en: 'Health Insurance Platform', ar: 'منصة التأمين الصحي', group: 'gov' },
  'medical-insurance': { en: 'Medical Insurance Platform', ar: 'منصة التأمين الطبي', group: 'gov' },
  'qiyas': { en: 'Qiyas Assessment', ar: 'قياس', group: 'gov' },
  'gov-hub': { en: 'Government Integration Hub', ar: 'مركز التكامل الحكومي', group: 'gov' },
  'education-ministry': { en: 'Education Ministry', ar: 'وزارة التعليم', group: 'gov' },
  'taqat': { en: 'Taqat HRDF', ar: 'طاقات – صندوق الموارد البشرية', group: 'gov' },
  'ncei': { en: 'NCEI Employment', ar: 'مركز التوظيف الوطني', group: 'gov' },
  'interior-ministry': { en: 'Interior Ministry', ar: 'وزارة الداخلية', group: 'gov' },
  'esnad': { en: 'ESNAD Notarization', ar: 'توثيق اسناد', group: 'gov' },
  'saudi-post': { en: 'Saudi Post Verification', ar: 'البريد السعودي', group: 'gov' },
  'tawakkalna': { en: 'Tawakkalna Compliance', ar: 'توكلنا', group: 'gov' },
  'umm-al-qura': { en: 'Umm Al-Qura Calendar', ar: 'تقويم أم القرى', group: 'gov' },
  'saudi-engineering': { en: 'Saudi Engineering Body', ar: 'هيئة المهندسين', group: 'gov' },
  'ai-features': { en: 'AI Features', ar: 'ميزات الذكاء الاصطناعي', group: 'ai' },
  'analytics': { en: 'Analytics', ar: 'التحليلات', group: 'ai' },
  'workforce-analytics': { en: 'Workforce Analytics', ar: 'تحليلات القوى العاملة', group: 'ai' },
  'predictive-modeling': { en: 'Predictive Modeling', ar: 'النمذجة التنبؤية', group: 'ai' },
  'realtime-analytics': { en: 'Realtime Analytics', ar: 'التحليلات الفورية', group: 'ai' },
  'kpi-analytics': { en: 'KPI Analytics', ar: 'تحليلات مؤشرات الأداء', group: 'ai' },
  'executive-analytics': { en: 'Executive Analytics', ar: 'تحليلات تنفيذية', group: 'ai' },
  'cost-analytics': { en: 'Cost Analytics', ar: 'تحليلات التكلفة', group: 'ai' },
  'compliance-reporting-analytics': { en: 'Compliance Reporting Analytics', ar: 'تحليلات تقارير الامتثال', group: 'ai' },
  'performance-analytics': { en: 'Performance Analytics', ar: 'تحليلات الأداء', group: 'ai' },
  'turnover-analysis': { en: 'Turnover Analysis', ar: 'تحليل دوران الموظفين', group: 'ai' },
  'benchmarking-reports': { en: 'Benchmarking Reports', ar: 'تقارير المقارنة', group: 'ai' },
  'custom-reporting': { en: 'Custom Reporting', ar: 'تقارير مخصصة', group: 'ai' },
  'data-visualization': { en: 'Data Visualization', ar: 'تصوير البيانات', group: 'ai' },
  'executive-reporting': { en: 'Executive Reporting', ar: 'تقارير تنفيذية', group: 'ai' },
  'employee-reports': { en: 'Employee Reports', ar: 'تقارير الموظفين', group: 'ai' },
  // ... add more as needed
};

const ModulePlaceholder: React.FC = () => {
  const { moduleId } = useParams();
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const info = moduleId ? titles[moduleId] : undefined;
  const title = info ? (isArabic ? info.ar : info.en) : (moduleId || 'module');

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">
          {isArabic ? 'صفحة نموذجية للوحدة — سيتم ربط الوظائف لاحقًا.' : 'Simple module page — functionality will be connected next.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'الحالة' : 'Status'}</CardTitle>
          <CardDescription>{isArabic ? 'الموديل مهيأ وجاهز للاتصال' : 'Module scaffolded and ready for connectivity'}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Badge variant="default">{isArabic ? 'نشط' : 'Active'}</Badge>
          <Badge variant="outline">{isArabic ? 'تجريبي' : 'Preview'}</Badge>
        </CardContent>
      </Card>

      <AqlHRAIAssistant moduleContext={`module.${moduleId}`} companyId="demo-company" />
    </div>
  );
};

export default ModulePlaceholder;