import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Calendar, 
  Monitor,
  Presentation,
  Target,
  Brain,
  Settings2,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Users,
  FileText,
  Filter,
  Layers
} from 'lucide-react';

interface AnalyticsFeature {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  icon: React.ElementType;
  status: 'active' | 'development' | 'planned';
  description: string;
  descriptionAr: string;
  capabilities: string[];
  capabilitiesAr: string[];
  completionRate: number;
}

export const AdvancedAnalyticsSuite = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [selectedFeature, setSelectedFeature] = useState<AnalyticsFeature | null>(null);

  const analyticsFeatures: AnalyticsFeature[] = [
    // Report Building & Visualization
    {
      id: 'drag-drop-builder',
      name: 'Drag-and-Drop Report Builder',
      nameAr: 'أداة إنشاء التقارير بالسحب والإفلات',
      category: 'reporting',
      icon: FileText,
      status: 'development',
      description: 'Visual report creation with drag-and-drop interface for custom layouts',
      descriptionAr: 'إنشاء التقارير المرئية مع واجهة السحب والإفلات للتخطيطات المخصصة',
      capabilities: ['Visual Report Designer', 'Template Library', 'Custom Layouts', 'Real-time Preview', 'Export Options'],
      capabilitiesAr: ['مصمم التقارير المرئي', 'مكتبة القوالب', 'التخطيطات المخصصة', 'المعاينة الفورية', 'خيارات التصدير'],
      completionRate: 65
    },
    {
      id: 'advanced-visualization',
      name: 'Advanced Data Visualization',
      nameAr: 'تمثيل البيانات المتقدم',
      category: 'reporting',
      icon: PieChart,
      status: 'development',
      description: 'Interactive charts, heatmaps, and advanced visualization components',
      descriptionAr: 'المخططات التفاعلية وخرائط الحرارة ومكونات التمثيل المرئي المتقدمة',
      capabilities: ['Interactive Charts', 'Heatmaps', '3D Visualizations', 'Animated Transitions', 'Custom Themes'],
      capabilitiesAr: ['المخططات التفاعلية', 'خرائط الحرارة', 'التصور ثلاثي الأبعاد', 'الانتقالات المتحركة', 'السمات المخصصة'],
      completionRate: 45
    },

    // Predictive Analytics
    {
      id: 'turnover-modeling',
      name: 'Predictive Turnover Modeling',
      nameAr: 'نمذجة معدل دوران الموظفين التنبؤية',
      category: 'predictive',
      icon: TrendingUp,
      status: 'planned',
      description: 'AI-powered employee turnover prediction and risk analysis',
      descriptionAr: 'التنبؤ بمعدل دوران الموظفين وتحليل المخاطر باستخدام الذكاء الاصطناعي',
      capabilities: ['Risk Scoring', 'Retention Strategies', 'Early Warning System', 'Trend Analysis', 'Intervention Recommendations'],
      capabilitiesAr: ['تسجيل المخاطر', 'استراتيجيات الاحتفاظ', 'نظام الإنذار المبكر', 'تحليل الاتجاهات', 'توصيات التدخل'],
      completionRate: 20
    },
    {
      id: 'workforce-simulator',
      name: 'Workforce Planning Simulator',
      nameAr: 'محاكي تخطيط القوى العاملة',
      category: 'predictive',
      icon: Users,
      status: 'planned',
      description: 'Scenario-based workforce planning with predictive modeling',
      descriptionAr: 'تخطيط القوى العاملة القائم على السيناريوهات مع النمذجة التنبؤية',
      capabilities: ['Scenario Planning', 'Budget Forecasting', 'Headcount Optimization', 'Skills Gap Analysis', 'Growth Projections'],
      capabilitiesAr: ['تخطيط السيناريوهات', 'التنبؤ بالميزانية', 'تحسين عدد الموظفين', 'تحليل فجوة المهارات', 'توقعات النمو'],
      completionRate: 15
    },

    // Real-time Dashboards
    {
      id: 'compliance-dashboards',
      name: 'Real-time Compliance Dashboards',
      nameAr: 'لوحات معلومات الامتثال الفورية',
      category: 'dashboards',
      icon: Monitor,
      status: 'active',
      description: 'Live compliance monitoring with automated alerts and reporting',
      descriptionAr: 'مراقبة الامتثال المباشرة مع التنبيهات والتقارير الآلية',
      capabilities: ['Live Monitoring', 'Automated Alerts', 'Compliance Scoring', 'Violation Tracking', 'Regulatory Updates'],
      capabilitiesAr: ['المراقبة المباشرة', 'التنبيهات الآلية', 'تسجيل الامتثال', 'تتبع المخالفات', 'التحديثات التنظيمية'],
      completionRate: 85
    },
    {
      id: 'automated-scheduling',
      name: 'Automated Report Scheduling',
      nameAr: 'جدولة التقارير الآلية',
      category: 'dashboards',
      icon: Calendar,
      status: 'active',
      description: 'Intelligent report distribution with customizable scheduling',
      descriptionAr: 'توزيع التقارير الذكي مع جدولة قابلة للتخصيص',
      capabilities: ['Smart Scheduling', 'Multi-format Export', 'Recipient Management', 'Delivery Tracking', 'Custom Frequencies'],
      capabilitiesAr: ['الجدولة الذكية', 'التصدير متعدد التنسيقات', 'إدارة المستلمين', 'تتبع التسليم', 'الترددات المخصصة'],
      completionRate: 90
    },

    // Executive Tools
    {
      id: 'executive-presentations',
      name: 'Interactive Executive Presentations',
      nameAr: 'العروض التنفيذية التفاعلية',
      category: 'executive',
      icon: Presentation,
      status: 'development',
      description: 'Dynamic presentation builder with interactive data storytelling',
      descriptionAr: 'أداة إنشاء العروض التقديمية الديناميكية مع سرد البيانات التفاعلي',
      capabilities: ['Interactive Slides', 'Live Data Integration', 'Storytelling Templates', 'Voice Narration', 'Remote Control'],
      capabilitiesAr: ['الشرائح التفاعلية', 'تكامل البيانات المباشرة', 'قوالب السرد', 'التعليق الصوتي', 'التحكم عن بعد'],
      completionRate: 55
    },
    {
      id: 'benchmark-analysis',
      name: 'Benchmark Analysis Tools',
      nameAr: 'أدوات تحليل المقارنات المرجعية',
      category: 'executive',
      icon: Target,
      status: 'development',
      description: 'Industry benchmarking with peer comparison and best practice insights',
      descriptionAr: 'المقارنة المرجعية للصناعة مع مقارنة الأقران ورؤى أفضل الممارسات',
      capabilities: ['Industry Benchmarks', 'Peer Comparison', 'Best Practice Library', 'Gap Analysis', 'Improvement Roadmaps'],
      capabilitiesAr: ['المعايير الصناعية', 'مقارنة الأقران', 'مكتبة أفضل الممارسات', 'تحليل الفجوات', 'خرائط طريق التحسين'],
      completionRate: 40
    },

    // Advanced Analytics
    {
      id: 'custom-kpi-builders',
      name: 'Custom KPI Builders',
      nameAr: 'أدوات إنشاء مؤشرات الأداء المخصصة',
      category: 'advanced',
      icon: Settings2,
      status: 'active',
      description: 'Build and track custom KPIs with advanced calculation engines',
      descriptionAr: 'إنشاء وتتبع مؤشرات الأداء المخصصة مع محركات الحساب المتقدمة',
      capabilities: ['Formula Builder', 'Custom Metrics', 'Threshold Alerts', 'Performance Tracking', 'Goal Management'],
      capabilitiesAr: ['أداة إنشاء الصيغ', 'المقاييس المخصصة', 'تنبيهات العتبة', 'تتبع الأداء', 'إدارة الأهداف'],
      completionRate: 80
    },
    {
      id: 'multidimensional-analytics',
      name: 'Multi-dimensional Analytics',
      nameAr: 'التحليلات متعددة الأبعاد',
      category: 'advanced',
      icon: Layers,
      status: 'development',
      description: 'OLAP cube analysis with drill-down capabilities and pivot tables',
      descriptionAr: 'تحليل مكعب OLAP مع إمكانيات التفصيل والجداول المحورية',
      capabilities: ['OLAP Cubes', 'Drill-down Analysis', 'Pivot Tables', 'Cross-tabulation', 'Statistical Functions'],
      capabilitiesAr: ['مكعبات OLAP', 'تحليل التفصيل', 'الجداول المحورية', 'الجدولة المتقاطعة', 'الوظائف الإحصائية'],
      completionRate: 35
    }
  ];

  const categories = {
    'reporting': { name: 'Report Building & Visualization', nameAr: 'إنشاء التقارير والتمثيل المرئي' },
    'predictive': { name: 'Predictive Analytics', nameAr: 'التحليلات التنبؤية' },
    'dashboards': { name: 'Real-time Dashboards', nameAr: 'لوحات المعلومات الفورية' },
    'executive': { name: 'Executive Tools', nameAr: 'أدوات تنفيذية' },
    'advanced': { name: 'Advanced Analytics', nameAr: 'التحليلات المتقدمة' }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'development': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: 'Active', textAr: 'نشط', variant: 'default' as const },
      development: { text: 'In Development', textAr: 'قيد التطوير', variant: 'secondary' as const },
      planned: { text: 'Planned', textAr: 'مخطط', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant}>
        {isArabic ? config.textAr : config.text}
      </Badge>
    );
  };

  const activateFeature = (feature: AnalyticsFeature) => {
    console.log(`Activating ${feature.name}...`);
    // In a real implementation, this would trigger the feature activation process
  };

  const getOverallProgress = () => {
    const totalCompletion = analyticsFeatures.reduce((sum, feature) => sum + feature.completionRate, 0);
    return Math.round(totalCompletion / analyticsFeatures.length);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {isArabic ? 'التحليلات والتقارير المتقدمة' : 'Advanced Analytics & Reporting'}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
          {isArabic 
            ? 'مجموعة ذكاء الأعمال الشاملة - أدوات تحليل متقدمة وإنشاء تقارير تفاعلية للقرارات الاستراتيجية'
            : 'Comprehensive Business Intelligence suite - Advanced analytics and interactive reporting for strategic decisions'
          }
        </p>
        
        {/* Overall Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isArabic ? 'التقدم العام' : 'Overall Progress'}
            </span>
            <span className="text-sm text-muted-foreground">
              {getOverallProgress()}%
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="reporting">{isArabic ? 'التقارير' : 'Reporting'}</TabsTrigger>
          <TabsTrigger value="predictive">{isArabic ? 'التنبؤية' : 'Predictive'}</TabsTrigger>
          <TabsTrigger value="dashboards">{isArabic ? 'لوحات المعلومات' : 'Dashboards'}</TabsTrigger>
          <TabsTrigger value="advanced">{isArabic ? 'متقدم' : 'Advanced'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(categories).map(([key, category]) => {
              const featuresInCategory = analyticsFeatures.filter(f => f.category === key);
              const activeCount = featuresInCategory.filter(f => f.status === 'active').length;
              const avgProgress = Math.round(
                featuresInCategory.reduce((sum, f) => sum + f.completionRate, 0) / featuresInCategory.length
              );
              
              return (
                <Card key={key} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {activeCount}/{featuresInCategory.length}
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {isArabic ? category.nameAr : category.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {isArabic ? 'ميزات نشطة' : 'Active Features'}
                    </p>
                    <Progress value={avgProgress} className="h-1" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {Object.keys(categories).map(categoryKey => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsFeatures
                .filter(feature => feature.category === categoryKey)
                .map((feature) => (
                  <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {isArabic ? feature.nameAr : feature.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(feature.status)}
                              {getStatusBadge(feature.status)}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => activateFeature(feature)}
                          disabled={feature.status === 'active'}
                          size="sm"
                          variant={feature.status === 'active' ? 'default' : 'outline'}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {feature.status === 'active' 
                            ? (isArabic ? 'نشط' : 'Active')
                            : (isArabic ? 'تفعيل' : 'Activate')
                          }
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isArabic ? feature.descriptionAr : feature.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">
                            {isArabic ? 'التقدم' : 'Progress'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {feature.completionRate}%
                          </span>
                        </div>
                        <Progress value={feature.completionRate} className="h-2" />
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-sm">
                          {isArabic ? 'القدرات الرئيسية:' : 'Key Capabilities:'}
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {(isArabic ? feature.capabilitiesAr : feature.capabilities).map((capability, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};