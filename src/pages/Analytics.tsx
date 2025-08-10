import { useNavigate } from 'react-router-dom';
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { GovernmentAPIIntegration } from "@/components/integration/GovernmentAPIIntegration";
import { ComprehensiveTestSuite } from "@/components/testing/ComprehensiveTestSuite";
import { PerformanceMonitor } from "@/components/monitoring/PerformanceMonitor";
import { SecurityEnhancements } from "@/components/security/SecurityEnhancements";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { 
  BarChart, 
  Activity, 
  TrendingUp, 
  DollarSign,
  Database,
  PieChart,
  LineChart,
  Target,
  Users,
  FileText,
  Download,
  Upload,
  Filter,
  Shield,
  Globe,
  Zap,
  TestTube
} from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';
  const moduleFeatures = useModuleFeatures('analytics');

  const stats = [
    {
      title: language === 'ar' ? 'معدل السعودة' : 'Saudization Rate',
      value: '67.2%',
      icon: FileText,
      variant: "primary" as const,
      trend: { value: "2.1%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال نطاقات' : 'Nitaqat Compliance',
      value: language === 'ar' ? 'أخضر' : 'Green',
      icon: Activity,
      variant: "success" as const,
      trend: { value: "stable", isPositive: true }
    },
    {
      title: language === 'ar' ? 'دقة GOSI' : 'GOSI Accuracy',
      value: '99.8%',
      icon: Target,
      variant: "accent" as const,
      trend: { value: "0.2%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال WPS' : 'WPS Compliance',
      value: '100%',
      icon: TrendingUp,
      variant: "warning" as const,
      trend: { value: "maintained", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center',
      description: language === 'ar' ? 'رؤى استراتيجية متقدمة وتحليلات للقيادة' : 'Advanced strategic insights and analytics for leadership',
      icon: Target,
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
      onClick: () => navigate('/executive-center')
    },
    {
      title: language === 'ar' ? 'تحليل السعودة' : 'Saudization Analytics',
      description: language === 'ar' ? 'تتبع ومراقبة معدلات السعودة' : 'Track and monitor Saudization rates',
      icon: Users,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to saudization analytics')
    },
    {
      title: language === 'ar' ? 'تحليل GOSI' : 'GOSI Analytics',
      description: language === 'ar' ? 'تحليل مساهمات التأمينات الاجتماعية' : 'Social insurance contribution analysis',
      icon: TrendingUp,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to gosi analytics')
    },
    {
      title: language === 'ar' ? 'تقارير وزارة العمل' : 'MOL Reports',
      description: language === 'ar' ? 'تقارير الامتثال لوزارة العمل' : 'Ministry of Labor compliance reports',
      icon: BarChart,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to mol reports')
    },
    {
      title: language === 'ar' ? 'تحليل WPS' : 'WPS Analytics',
      description: language === 'ar' ? 'تحليل نظام حماية الأجور' : 'Wage Protection System analysis',
      icon: DollarSign,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to wps analytics')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'تقرير_تحليل_القوى_العاملة_ديسمبر_2024.pdf' : 'workforce_analytics_report_december_2024.pdf',
      type: language === 'ar' ? 'تقرير تحليلي' : 'Analytics Report',
      date: '2024-12-30',
      size: '3.2 MB'
    },
    {
      name: language === 'ar' ? 'نموذج_التنبؤ_بالأداء.xlsx' : 'performance_prediction_model.xlsx',
      type: language === 'ar' ? 'نموذج بيانات' : 'Data Model',
      date: '2024-12-28',
      size: '1.8 MB'
    },
    {
      name: language === 'ar' ? 'لوحة_قيادة_الامتثال.pdf' : 'compliance_dashboard_summary.pdf',
      type: language === 'ar' ? 'ملخص لوحة القيادة' : 'Dashboard Summary',
      date: '2024-12-25',
      size: '2.1 MB'
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'تحليل القوى العاملة' : 'Workforce Analytics'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مقاييس شاملة للموارد البشرية' : 'Comprehensive HR metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '247 تقرير مخصص' : '247 custom reports'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  {language === 'ar' ? 'النمذجة التنبؤية' : 'Predictive Modeling'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'التنبؤ بالدوران والأداء' : 'Turnover and performance forecasting'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '94.7% دقة' : '94.7% accuracy'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-accent" />
                  {language === 'ar' ? 'لوحات القيادة المباشرة' : 'Real-time Dashboards'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مراقبة KPI المباشرة' : 'Live KPI monitoring'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '18 لوحة قيادة نشطة' : '18 active dashboards'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-warning" />
                  {language === 'ar' ? 'تحليل التكاليف' : 'Cost Analytics'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'تكلفة التوظيف والكفاءة' : 'Cost per hire and efficiency'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'ريال سعودي 12,500 تكلفة التوظيف' : 'SAR 12,500 cost per hire'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  {language === 'ar' ? 'تقارير الامتثال' : 'Compliance Reporting'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'تتبع الامتثال التنظيمي' : 'Regulatory compliance tracking'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '96.8% نقاط الامتثال' : '96.8% compliance score'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'تحليل الأداء' : 'Performance Analytics'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مقاييس فردية وجماعية' : 'Individual and team metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '2,456 تقييم' : '2,456 evaluations'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      label: language === 'ar' ? 'التقارير' : 'Reports',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'مولد التقارير' : 'REPORT GENERATOR'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'إنشاء تقارير مخصصة للتحليلات' : 'Generate custom analytics reports'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تقرير الموظفين' : 'Employee Report'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تقرير الأداء' : 'Performance Report'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تقرير التكاليف' : 'Cost Report'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تقرير مخصص' : 'Custom Report'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'integration',
      label: language === 'ar' ? 'التكامل والاختبار' : 'Integration & Testing',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {language === 'ar' ? 'تكامل الواجهات الحكومية' : 'Government API Integration'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'حالة الاتصال مع الأنظمة الحكومية' : 'Government system connection status'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GovernmentAPIIntegration />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === 'ar' ? 'الأمان والحماية' : 'Security & Protection'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مراقبة أمان النظام والحماية' : 'System security monitoring and protection'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityEnhancements />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  {language === 'ar' ? 'اختبارات شاملة' : 'Comprehensive Testing'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مجموعة اختبارات كاملة للنظام' : 'Complete system testing suite'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComprehensiveTestSuite />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {language === 'ar' ? 'مراقبة الأداء' : 'Performance Monitoring'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مراقبة أداء النظام في الوقت الفعلي' : 'Real-time system performance monitoring'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMonitor />
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <CenteredLayout
      title={t('analytics.title')}
      description={t('analytics.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="analytics" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('analytics.title')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="analytics" />
        )}

        <EnhancedPageLayout
        title={language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
        description={language === 'ar' ? 'رؤى مدفوعة بالبيانات لاتخاذ قرارات استراتيجية' : 'Data-driven insights for strategic decision making'}
        showUserInfo={true}
        showQuickActions={true}
        showTabs={true}
        stats={stats}
        quickActions={quickActions}
        documents={documents}
        tabs={tabs}
      />
      
      {/* Analytics Document Management */}
      <UniversalDocumentManager
        moduleName="Analytics & Reporting"
        moduleNameAr="التحليلات والتقارير"
        description="Upload data files, reports, and analytics documents for comprehensive analysis"
        descriptionAr="رفع ملفات البيانات والتقارير ومستندات التحليلات للتحليل الشامل"
        platform="analytics"
        moduleType="hr"
        acceptedTypes={['.xlsx', '.xls', '.csv', '.pdf', '.json', '.pptx']}
        maxFileSize={100 * 1024 * 1024}
        maxFiles={30}
        />

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="analytics"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="analytics"
            context={{
              moduleName: t('analytics.title'),
              currentData: { stats, quickActions, documents },
              uploadedDocs: []
            }}
          />
        )}

        <AqlHRAIAssistant 
          moduleContext="analytics" 
          companyId="demo-company"
        />
      </div>
    </CenteredLayout>
  );
};

export default Analytics;