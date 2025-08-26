import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Settings, 
  Users, 
  Shield, 
  Database, 
  BarChart3, 
  Cog,
  Key,
  Globe,
  CheckCircle,
  AlertTriangle,
  Activity,
  Brain,
  Bot,
  Building,
  TrendingUp,
  FileText,
  AlertCircle,
  Heart,
  Wrench,
  Target,
  Layers
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SuperAdminDashboard: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const navigate = useNavigate();

  const interfaceCategories = [
    {
      category: isArabic ? 'الوحدات الأساسية' : 'Core Modules',
      count: 8,
      icon: Layers,
      routes: ['/hr', '/payroll', '/employee', '/attendance']
    },
    {
      category: isArabic ? 'الذكاء الاصطناعي' : 'AI & Automation',
      count: 15,
      icon: Brain,
      routes: ['/ai-command-center', '/ai-decision-engine', '/aql-mind-core', '/learning-engine', '/intelligence-gatherer']
    },
    {
      category: isArabic ? 'التكامل الحكومي' : 'Government Integration',
      count: 20,
      icon: Building,
      routes: ['/government', '/compliance', '/legal']
    },
    {
      category: isArabic ? 'الموارد البشرية الاستراتيجية' : 'Strategic HR',
      count: 12,
      icon: TrendingUp,
      routes: ['/hr-analytics', '/workforce-planning', '/talent-management']
    },
    {
      category: isArabic ? 'التحليلات والتقارير' : 'Analytics & Reporting',
      count: 12,
      icon: BarChart3,
      routes: ['/analytics', '/reports', '/dashboard']
    },
    {
      category: isArabic ? 'الامتثال والمخاطر' : 'Compliance & Risk',
      count: 11,
      icon: AlertCircle,
      routes: ['/compliance', '/risk-management', '/audit']
    },
    {
      category: isArabic ? 'الرفاهية والأمان' : 'Welfare & Safety',
      count: 8,
      icon: Heart,
      routes: ['/employee-welfare', '/safety', '/health']
    },
    {
      category: isArabic ? 'الأدوات المتخصصة' : 'Specialized Tools',
      count: 15,
      icon: Wrench,
      routes: ['/tools', '/utilities', '/integrations']
    },
    {
      category: isArabic ? 'ذكاء المديرين التنفيذيين' : 'Executive Intelligence',
      count: 5,
      icon: Target,
      routes: ['/executive-dashboard', '/strategic-insights']
    },
    {
      category: isArabic ? 'ميزات المنصة' : 'Platform Features',
      count: 10,
      icon: Globe,
      routes: ['/settings', '/system-engineer', '/chat']
    }
  ];

  const handleInterfaceClick = (category: any) => {
    // Navigate to the first available route for the category
    if (category.routes && category.routes.length > 0) {
      navigate(category.routes[0]);
    }
  };

  const adminStats = [
    { 
      label: isArabic ? 'إجمالي المستخدمين' : 'Total Users', 
      value: '2,847', 
      change: '+12%',
      icon: Users,
      color: 'text-blue-600' 
    },
    { 
      label: isArabic ? 'الجلسات النشطة' : 'Active Sessions', 
      value: '156', 
      change: '+5%',
      icon: Activity,
      color: 'text-green-600' 
    },
    { 
      label: isArabic ? 'تنبيهات الأمان' : 'Security Alerts', 
      value: '3', 
      change: '-2',
      icon: AlertTriangle,
      color: 'text-yellow-600' 
    },
    { 
      label: isArabic ? 'معدل الأداء' : 'System Performance', 
      value: '99.8%', 
      change: '+0.2%',
      icon: BarChart3,
      color: 'text-purple-600' 
    }
  ];

  const adminModules = [
    {
      title: isArabic ? 'إدارة المستخدمين' : 'User Management',
      description: isArabic ? 'إدارة الأدوار والصلاحيات' : 'Manage roles and permissions',
      icon: Users,
      count: '2,847',
      status: 'active'
    },
    {
      title: isArabic ? 'إعدادات النظام' : 'System Configuration',
      description: isArabic ? 'تكوين إعدادات النظام الأساسية' : 'Configure core system settings',
      icon: Settings,
      count: '24',
      status: 'configured'
    },
    {
      title: isArabic ? 'الأمان والمراقبة' : 'Security & Monitoring',
      description: isArabic ? 'مراقبة أمان النظام والتهديدات' : 'Monitor system security and threats',
      icon: Shield,
      count: '3',
      status: 'warning'
    },
    {
      title: isArabic ? 'إدارة قاعدة البيانات' : 'Database Management',
      description: isArabic ? 'مراقبة وإدارة قواعد البيانات' : 'Monitor and manage databases',
      icon: Database,
      count: '5',
      status: 'active'
    },
    {
      title: isArabic ? 'التقارير المتقدمة' : 'Advanced Analytics',
      description: isArabic ? 'تحليلات شاملة لأداء النظام' : 'Comprehensive system performance analytics',
      icon: BarChart3,
      count: '127',
      status: 'active'
    },
    {
      title: isArabic ? 'مفاتيح API' : 'API Management',
      description: isArabic ? 'إدارة مفاتيح API والتكاملات' : 'Manage API keys and integrations',
      icon: Key,
      count: '12',
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'configured': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'warning': return 'destructive';
      case 'configured': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold">
            {isArabic ? 'لوحة تحكم المدير العام' : 'Super Admin Dashboard'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'الصلاحيات الكاملة لإدارة النظام والمستخدمين'
            : 'Complete system administration and user management privileges'
          }
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            {isArabic ? 'الوحدات' : 'Modules'}
          </TabsTrigger>
          <TabsTrigger value="interfaces" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {isArabic ? 'الواجهات' : 'Interfaces'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <Badge variant="outline" className="w-fit">
                        {stat.change}
                      </Badge>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {isArabic ? 'حالة النظام' : 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">{isArabic ? 'خادم الويب' : 'Web Server'}</span>
                  <Badge className="bg-green-600">
                    {isArabic ? 'يعمل' : 'Online'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">{isArabic ? 'قاعدة البيانات' : 'Database'}</span>
                  <Badge className="bg-green-600">
                    {isArabic ? 'يعمل' : 'Online'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">{isArabic ? 'النسخ الاحتياطي' : 'Backup'}</span>
                  <Badge variant="outline" className="bg-yellow-600 text-white">
                    {isArabic ? 'قيد التشغيل' : 'Running'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <module.icon className="h-8 w-8 text-primary" />
                    <Badge variant={getStatusBadge(module.status)}>
                      {module.count}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status).replace('text-', 'bg-')}`} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {module.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interfaces" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'الواجهات المتاحة' : 'Available Interfaces'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'جميع الواجهات والوحدات المتاحة للمدير العام (120+ واجهة)'
                  : 'All interfaces and modules available to Super Admin (120+ interfaces)'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interfaceCategories.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md transform hover:scale-105"
                    onClick={() => handleInterfaceClick(item)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className="h-6 w-6 text-primary" />
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant moduleContext="super.admin.dashboard" />
      
      {/* AI Integration for Super Admin Dashboard */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="super-admin-dashboard" 
        companyId="demo-company" 
        enabledFeatures={['system-monitoring', 'admin-insights', 'user-management', 'security-analysis']}
      />
    </div>
  );
};

export default SuperAdminDashboard;