import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  FileText,
  Brain,
  Target,
  Award,
  Calendar,
  Filter
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { useModuleFeatures } from "@/hooks/useModuleFeatures";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import CenteredLayout from "@/components/layout/CenteredLayout";
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";

const WorkforceAnalytics = () => {
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const moduleFeatures = useModuleFeatures('workforceAnalytics');
  const isArabic = language === 'ar';

  const getLocalizedText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const stats = [
    {
      title: getLocalizedText('workforceAnalytics.stats.totalEmployees', isArabic ? 'إجمالي الموظفين' : 'Total Employees'),
      value: '2,847',
      variant: 'primary' as const,
      trend: { value: '+12.5%', isPositive: true },
      icon: Users,
    },
    {
      title: getLocalizedText('workforceAnalytics.stats.productivity', isArabic ? 'الإنتاجية' : 'Productivity'),
      value: '94.2%',
      variant: 'success' as const,
      trend: { value: '+8.1%', isPositive: true },
      icon: TrendingUp,
    },
    {
      title: getLocalizedText('workforceAnalytics.stats.engagement', isArabic ? 'مستوى المشاركة' : 'Engagement Level'),
      value: '87.5%',
      variant: 'secondary' as const,
      trend: { value: '+5.3%', isPositive: true },
      icon: Activity,
    },
    {
      title: getLocalizedText('workforceAnalytics.stats.retention', isArabic ? 'معدل الاحتفاظ' : 'Retention Rate'),
      value: '91.8%',
      variant: 'warning' as const,
      trend: { value: '+2.7%', isPositive: true },
      icon: Award,
    },
  ];

  const quickActions = [
    {
      title: getLocalizedText('workforceAnalytics.actions.uploadData', isArabic ? 'رفع البيانات' : 'Upload Data'),
      description: getLocalizedText('workforceAnalytics.actions.uploadDataDesc', isArabic ? 'رفع ملفات البيانات للتحليل' : 'Upload data files for analysis'),
      icon: Upload,
      color: 'blue',
      onClick: () => {}
    },
    {
      title: getLocalizedText('workforceAnalytics.actions.generateReport', isArabic ? 'إنشاء تقرير' : 'Generate Report'),
      description: getLocalizedText('workforceAnalytics.actions.generateReportDesc', isArabic ? 'إنشاء تقارير تحليلية مخصصة' : 'Create custom analytics reports'),
      icon: FileText,
      color: 'green',
      onClick: () => {}
    },
    {
      title: getLocalizedText('workforceAnalytics.actions.aiInsights', isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'),
      description: getLocalizedText('workforceAnalytics.actions.aiInsightsDesc', isArabic ? 'احصل على رؤى ذكية مدعومة بالذكاء الاصطناعي' : 'Get AI-powered intelligent insights'),
      icon: Brain,
      color: 'purple',
      onClick: () => {}
    },
    {
      title: getLocalizedText('workforceAnalytics.actions.performanceMetrics', isArabic ? 'مقاييس الأداء' : 'Performance Metrics'),
      description: getLocalizedText('workforceAnalytics.actions.performanceMetricsDesc', isArabic ? 'مراجعة مؤشرات الأداء الرئيسية' : 'Review key performance indicators'),
      icon: Target,
      color: 'orange',
      onClick: () => {}
    },
  ];

  const documents = [
    {
      name: getLocalizedText('workforceAnalytics.docs.monthlyReport', isArabic ? 'تقرير_القوى_العاملة_ديسمبر_2024.pdf' : 'workforce_analytics_december_2024.pdf'),
      type: 'PDF',
      size: '2.3 MB',
      date: '2024-12-15',
      status: 'processed' as const
    },
    {
      name: getLocalizedText('workforceAnalytics.docs.performanceData', isArabic ? 'بيانات_الأداء_Q4_2024.xlsx' : 'performance_data_Q4_2024.xlsx'),
      type: 'Excel',
      size: '5.7 MB',
      date: '2024-12-10',
      status: 'processing' as const
    },
    {
      name: getLocalizedText('workforceAnalytics.docs.engagementSurvey', isArabic ? 'استبيان_المشاركة_2024.csv' : 'engagement_survey_2024.csv'),
      type: 'CSV',
      size: '1.2 MB',
      date: '2024-12-08',
      status: 'processed' as const
    },
  ];

  const tabs = [
    {
      id: 'overview',
      label: getLocalizedText('workforceAnalytics.tabs.overview', isArabic ? 'نظرة عامة' : 'Overview'),
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getLocalizedText('workforceAnalytics.overview.activeReports', isArabic ? 'التقارير النشطة' : 'Active Reports')}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12% {getLocalizedText('common.fromLastMonth', isArabic ? 'من الشهر الماضي' : 'from last month')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getLocalizedText('workforceAnalytics.overview.dataAccuracy', isArabic ? 'دقة البيانات' : 'Data Accuracy')}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.3% {getLocalizedText('common.improvement', isArabic ? 'تحسن' : 'improvement')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getLocalizedText('workforceAnalytics.overview.insights', isArabic ? 'الرؤى المتولدة' : 'Generated Insights')}
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +187 {getLocalizedText('common.thisWeek', isArabic ? 'هذا الأسبوع' : 'this week')}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'reports',
      label: getLocalizedText('workforceAnalytics.tabs.reports', isArabic ? 'التقارير' : 'Reports'),
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {getLocalizedText('workforceAnalytics.reports.title', isArabic ? 'تقارير تحليلات القوى العاملة' : 'Workforce Analytics Reports')}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {getLocalizedText('common.filter', isArabic ? 'تصفية' : 'Filter')}
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {getLocalizedText('common.dateRange', isArabic ? 'نطاق التاريخ' : 'Date Range')}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: isArabic ? 'تقرير الأداء الشهري' : 'Monthly Performance Report', status: 'ready', date: '2024-12-15' },
              { title: isArabic ? 'تحليل المشاركة' : 'Engagement Analysis', status: 'processing', date: '2024-12-14' },
              { title: isArabic ? 'معدلات الدوران' : 'Turnover Rates', status: 'ready', date: '2024-12-13' },
              { title: isArabic ? 'تقييم المهارات' : 'Skills Assessment', status: 'pending', date: '2024-12-12' },
            ].map((report, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{report.title}</CardTitle>
                    <Badge variant={report.status === 'ready' ? 'default' : report.status === 'processing' ? 'secondary' : 'outline'}>
                      {report.status === 'ready' ? (isArabic ? 'جاهز' : 'Ready') : 
                       report.status === 'processing' ? (isArabic ? 'قيد المعالجة' : 'Processing') : 
                       (isArabic ? 'في الانتظار' : 'Pending')}
                    </Badge>
                  </div>
                  <CardDescription>{report.date}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {getLocalizedText('common.download', isArabic ? 'تحميل' : 'Download')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      label: getLocalizedText('workforceAnalytics.tabs.analytics', isArabic ? 'التحليلات المتقدمة' : 'Advanced Analytics'),
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {getLocalizedText('workforceAnalytics.analytics.title', isArabic ? 'التحليلات المدفوعة بالذكاء الاصطناعي' : 'AI-Powered Analytics')}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  {getLocalizedText('workforceAnalytics.analytics.predictiveInsights', isArabic ? 'الرؤى التنبؤية' : 'Predictive Insights')}
                </CardTitle>
                <CardDescription>
                  {getLocalizedText('workforceAnalytics.analytics.predictiveDesc', isArabic ? 'تحليلات متقدمة للتنبؤ بالاتجاهات' : 'Advanced analytics for trend prediction')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span>{getLocalizedText('workforceAnalytics.analytics.retentionPrediction', isArabic ? 'توقع الاحتفاظ' : 'Retention Prediction')}</span>
                      <span className="text-green-600">94%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span>{getLocalizedText('workforceAnalytics.analytics.performanceGrowth', isArabic ? 'نمو الأداء' : 'Performance Growth')}</span>
                      <span className="text-blue-600">87%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {getLocalizedText('workforceAnalytics.analytics.kpiTracking', isArabic ? 'تتبع المؤشرات' : 'KPI Tracking')}
                </CardTitle>
                <CardDescription>
                  {getLocalizedText('workforceAnalytics.analytics.kpiDesc', isArabic ? 'مراقبة مؤشرات الأداء الرئيسية' : 'Monitor key performance indicators')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: isArabic ? 'رضا الموظفين' : 'Employee Satisfaction', value: '4.2/5', color: 'text-green-600' },
                    { label: isArabic ? 'معدل الإنتاجية' : 'Productivity Rate', value: '94%', color: 'text-blue-600' },
                    { label: isArabic ? 'وقت التدريب' : 'Training Hours', value: '32h', color: 'text-purple-600' },
                  ].map((kpi, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-muted last:border-0">
                      <span className="text-sm text-muted-foreground">{kpi.label}</span>
                      <span className={`font-medium ${kpi.color}`}>{kpi.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <CenteredLayout
      title={getLocalizedText('workforceAnalytics.title', isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics')}
      description={getLocalizedText('workforceAnalytics.description', isArabic ? 'تحليل شامل لبيانات الموظفين والأداء التشغيلي' : 'Comprehensive analysis of employee data and operational performance')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="workforceAnalytics" showIcon={true}>
          <h1 className="text-3xl font-bold">
            {getLocalizedText('workforceAnalytics.title', isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics')}
          </h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="workforceAnalytics" />
        )}

        <EnhancedPageLayout
          title={getLocalizedText('workforceAnalytics.title', isArabic ? 'تحليلات القوى العاملة المتقدمة' : 'Advanced Workforce Analytics')}
          description={getLocalizedText('workforceAnalytics.subtitle', isArabic ? 'رؤى مدفوعة بالبيانات لاتخاذ قرارات استراتيجية حول القوى العاملة' : 'Data-driven insights for strategic workforce decision making')}
          showUserInfo={true}
          showQuickActions={true}
          showTabs={true}
          stats={stats}
          quickActions={quickActions}
          documents={documents}
          tabs={tabs}
        />
        
        {/* Workforce Analytics Document Management */}
        <UniversalDocumentManager
          moduleName={getLocalizedText('workforceAnalytics.documentManager.title', "Workforce Analytics & Data")}
          moduleNameAr={getLocalizedText('workforceAnalytics.documentManager.titleAr', "تحليلات القوى العاملة والبيانات")}
          description={getLocalizedText('workforceAnalytics.documentManager.description', "Upload employee data, performance reports, and workforce analytics documents for comprehensive analysis")}
          descriptionAr={getLocalizedText('workforceAnalytics.documentManager.descriptionAr', "رفع بيانات الموظفين وتقارير الأداء ومستندات تحليلات القوى العاملة للتحليل الشامل")}
          platform="workforce-analytics"
          moduleType="hr"
          acceptedTypes={['.xlsx', '.xls', '.csv', '.pdf', '.json', '.pptx']}
          maxFileSize={100 * 1024 * 1024}
          maxFiles={50}
        />

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="workforceAnalytics"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="workforceAnalytics"
            context={{
              moduleName: getLocalizedText('workforceAnalytics.title', isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics'),
              currentData: { stats, quickActions, documents },
              uploadedDocs: []
            }}
          />
        )}

        <AqlHRAIAssistant 
          moduleContext="workforceAnalytics" 
          companyId="demo-company"
        />
      </div>
    </CenteredLayout>
  );
};

export default WorkforceAnalytics;