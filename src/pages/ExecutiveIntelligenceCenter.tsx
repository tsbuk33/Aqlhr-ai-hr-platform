import { useState } from 'react';
import { useLocale } from '@/i18n/locale';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, Brain, Target, TrendingUp, Users, Zap, 
  Calendar, Clock, FileText, Shield, 
  UserCheck, AlertCircle, CheckCircle, Eye, Settings,
  PieChart, Activity, Globe, Building, Award, Briefcase,
  ChevronRight, Download, Filter, Search, MoreHorizontal,
  Grid3X3
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

// Executive Intelligence Center - Comprehensive Restored Layout
const ExecutiveIntelligenceCenter = () => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  
  // Key Performance Indicators
  const kpiData = [
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: isArabic ? 'معدل الحضور' : 'Attendance Rate',
      value: '96.8%',
      change: '+2.1%',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: isArabic ? 'معدل الدوران' : 'Turnover Rate',
      value: '3.2%',
      change: '-1.8%',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: isArabic ? 'مؤشر الرضا' : 'Satisfaction Index',
      value: '8.7/10',
      change: '+0.5',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Workforce Analytics
  const workforceData = [
    {
      department: isArabic ? 'التكنولوجيا' : 'Technology',
      employees: 487,
      growth: '+15%',
      performance: 94
    },
    {
      department: isArabic ? 'التسويق' : 'Marketing',
      employees: 321,
      growth: '+8%',
      performance: 89
    },
    {
      department: isArabic ? 'المبيعات' : 'Sales',
      employees: 654,
      growth: '+22%',
      performance: 91
    },
    {
      department: isArabic ? 'العمليات' : 'Operations',
      employees: 423,
      growth: '+5%',
      performance: 87
    }
  ];

  // Executive Modules
  const executiveModules = [
    {
      title: isArabic ? 'تحليلات الأداء' : 'Performance Analytics',
      description: isArabic ? 'مراقبة شاملة لأداء الموظفين' : 'Comprehensive employee performance monitoring',
      icon: BarChart3,
      count: '2.8K',
      status: 'active'
    },
    {
      title: isArabic ? 'إدارة المواهب' : 'Talent Management',
      description: isArabic ? 'تطوير وإدارة المواهب البشرية' : 'Develop and manage human talent',
      icon: Users,
      count: '156',
      status: 'active'
    },
    {
      title: isArabic ? 'التخطيط الاستراتيجي' : 'Strategic Planning',
      description: isArabic ? 'أدوات التخطيط طويل المدى' : 'Long-term planning tools',
      icon: Target,
      count: '42',
      status: 'active'
    },
    {
      title: isArabic ? 'الذكاء التنبؤي' : 'Predictive Intelligence',
      description: isArabic ? 'توقعات مدعومة بالذكاء الاصطناعي' : 'AI-powered predictions',
      icon: Brain,
      count: '89%',
      status: 'active'
    },
    {
      title: isArabic ? 'إدارة المخاطر' : 'Risk Management',
      description: isArabic ? 'تحديد وتقييم المخاطر التنظيمية' : 'Identify and assess organizational risks',
      icon: Shield,
      count: '12',
      status: 'monitoring'
    },
    {
      title: isArabic ? 'التحليل المالي' : 'Financial Analysis',
      description: isArabic ? 'تحليل التكاليف والعائدات' : 'Cost and ROI analysis',
      icon: CurrencyIcon,
      count: '$2.4M',
      status: 'active'
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      type: 'performance',
      title: isArabic ? 'تقييم الأداء الربعي' : 'Q4 Performance Review',
      time: isArabic ? 'منذ ساعتين' : '2 hours ago',
      status: 'completed'
    },
    {
      type: 'recruitment',
      title: isArabic ? 'حملة توظيف جديدة' : 'New Recruitment Campaign',
      time: isArabic ? 'منذ 4 ساعات' : '4 hours ago',
      status: 'in-progress'
    },
    {
      type: 'training',
      title: isArabic ? 'برنامج تدريبي للقيادة' : 'Leadership Training Program',
      time: isArabic ? 'أمس' : 'Yesterday',
      status: 'scheduled'
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isArabic ? 'لوحة القيادة الشاملة للإدارة التنفيذية' : 'Comprehensive executive management dashboard'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {isArabic ? 'تصدير' : 'Export'}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {isArabic ? 'تصفية' : 'Filter'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-12 bg-transparent border-b-0">
              <TabsTrigger value="overview" className="px-6">
                {isArabic ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="px-6">
                {isArabic ? 'التحليلات' : 'Analytics'}
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="px-6">
                {isArabic ? 'الذكاء' : 'Intelligence'}
              </TabsTrigger>
              <TabsTrigger value="operations" className="px-6">
                {isArabic ? 'العمليات' : 'Operations'}
              </TabsTrigger>
              <TabsTrigger value="reports" className="px-6">
                {isArabic ? 'التقارير' : 'Reports'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                      <Badge variant={kpi.change.startsWith('+') ? 'default' : 'secondary'}>
                        {kpi.change}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workforce Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  {isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'توزيع الموظفين حسب الأقسام والأداء' : 'Employee distribution by department and performance'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workforceData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{dept.department}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">{dept.employees} {isArabic ? 'موظف' : 'employees'}</span>
                            <Badge variant="outline">{dept.growth}</Badge>
                          </div>
                        </div>
                        <Progress value={dept.performance} className="h-2" />
                        <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                          <span>{isArabic ? 'الأداء' : 'Performance'}: {dept.performance}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Executive Modules Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  {isArabic ? 'الوحدات التنفيذية' : 'Executive Modules'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'أدوات الإدارة والتحليل المتقدمة' : 'Advanced management and analytics tools'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {executiveModules.map((module, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <module.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{module.title}</h4>
                            <Badge variant={module.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                              {module.status === 'active' ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'مراقبة' : 'Monitoring')}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{module.count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {isArabic ? 'الأنشطة الأخيرة' : 'Recent Activities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant={
                        activity.status === 'completed' ? 'default' : 
                        activity.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {activity.status === 'completed' ? (isArabic ? 'مكتمل' : 'Completed') :
                         activity.status === 'in-progress' ? (isArabic ? 'جاري' : 'In Progress') :
                         (isArabic ? 'مجدول' : 'Scheduled')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'التحليلات المتقدمة' : 'Advanced Analytics'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'تحليلات تفصيلية ومؤشرات الأداء الرئيسية' : 'Detailed analytics and key performance indicators'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'تحليلات متقدمة قيد التطوير' : 'Advanced analytics in development'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'رؤى مدعومة بالذكاء الاصطناعي والتعلم الآلي' : 'AI-powered insights and machine learning'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'نماذج الذكاء الاصطناعي قيد التطوير' : 'AI models in development'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'العمليات التشغيلية' : 'Operations'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'مراقبة وإدارة العمليات اليومية' : 'Monitor and manage daily operations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'لوحة العمليات قيد التطوير' : 'Operations dashboard in development'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'التقارير والتصدير' : 'Reports & Export'}</CardTitle>
                <CardDescription>
                  {isArabic ? 'إنشاء وتصدير التقارير التفصيلية' : 'Generate and export detailed reports'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'نظام التقارير قيد التطوير' : 'Reporting system in development'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AqlHRAIAssistant 
        moduleContext="executive.intelligence" 
        position="fixed"
        className="executive-ai-assistant"
      />
      <UniversalAIIntegrator 
        pageType="executive" 
        moduleName="executive-intelligence-center" 
        companyId="demo-company" 
        enabledFeatures={['executive-insights', 'strategic-intelligence', 'leadership-analytics', 'predictive-analytics']}
      />
    </div>
  );
};

export default ExecutiveIntelligenceCenter;