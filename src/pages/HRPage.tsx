import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  FileText,
  Settings,
  Award,
  BookOpen,
  UserPlus,
  DollarSign,
  Target,
  Briefcase
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const HRPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const navigate = useNavigate();

  const hrModules = [
    {
      title: isArabic ? 'إدارة الموظفين' : 'Employee Management',
      description: isArabic ? 'إدارة بيانات الموظفين وملفاتهم الشخصية' : 'Manage employee data and personal files',
      icon: Users,
      route: '/employees',
      count: '2,847',
      status: 'active'
    },
    {
      title: isArabic ? 'الحضور والانصراف' : 'Time & Attendance',
      description: isArabic ? 'تتبع ساعات العمل والحضور' : 'Track working hours and attendance',
      icon: Clock,
      route: '/attendance',
      count: '156',
      status: 'active'
    },
    {
      title: isArabic ? 'إدارة الإجازات' : 'Leave Management',
      description: isArabic ? 'إدارة طلبات الإجازات والأرصدة' : 'Manage leave requests and balances',
      icon: Calendar,
      route: '/leave',
      count: '89',
      status: 'pending'
    },
    {
      title: isArabic ? 'إدارة الأداء' : 'Performance Management',
      description: isArabic ? 'تقييم أداء الموظفين والأهداف' : 'Employee performance evaluation and goals',
      icon: TrendingUp,
      route: '/core-hr/performance-management',
      count: '324',
      status: 'active'
    },
    {
      title: isArabic ? 'التوظيف والإعداد' : 'Recruitment & Onboarding',
      description: isArabic ? 'إدارة عمليات التوظيف وإعداد الموظفين الجدد' : 'Manage recruitment and new employee onboarding',
      icon: UserPlus,
      route: '/recruitment',
      count: '45',
      status: 'active'
    },
    {
      title: isArabic ? 'التدريب والتطوير' : 'Training & Development',
      description: isArabic ? 'برامج التدريب وتطوير المهارات' : 'Training programs and skill development',
      icon: BookOpen,
      route: '/core-hr/training-development',
      count: '178',
      status: 'active'
    },
    {
      title: isArabic ? 'الرواتب والمزايا' : 'Payroll & Benefits',
      description: isArabic ? 'إدارة الرواتب والمزايا الوظيفية' : 'Manage payroll and employee benefits',
      icon: DollarSign,
      route: '/payroll',
      count: '2,847',
      status: 'active'
    },
    {
      title: isArabic ? 'التقارير والتحليلات' : 'Reports & Analytics',
      description: isArabic ? 'تقارير شاملة وتحليلات متقدمة' : 'Comprehensive reports and advanced analytics',
      icon: FileText,
      route: '/analytics',
      count: '127',
      status: 'active'
    }
  ];

  const quickStats = [
    {
      label: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: isArabic ? 'الموظفون الحاضرون اليوم' : 'Present Today',
      value: '2,534',
      change: '+2%',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      label: isArabic ? 'الإجازات المعلقة' : 'Pending Leaves',
      value: '89',
      change: '-5%',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      label: isArabic ? 'تقييمات الأداء' : 'Performance Reviews',
      value: '324',
      change: '+8%',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {isArabic ? 'إدارة الموارد البشرية' : 'Human Resources Management'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'نظام متكامل لإدارة جميع عمليات الموارد البشرية'
            : 'Complete system for managing all HR operations and processes'
          }
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="modules">
            {isArabic ? 'الوحدات' : 'Modules'}
          </TabsTrigger>
          <TabsTrigger value="quick-actions">
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
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

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { activity: isArabic ? 'تمت الموافقة على 5 طلبات إجازة' : '5 leave requests approved', time: '2 hours ago' },
                  { activity: isArabic ? 'تم إضافة 3 موظفين جدد' : '3 new employees added', time: '4 hours ago' },
                  { activity: isArabic ? 'تم تحديث 12 تقييم أداء' : '12 performance reviews updated', time: '6 hours ago' },
                  { activity: isArabic ? 'تم إنشاء تقرير الحضور الشهري' : 'Monthly attendance report generated', time: '1 day ago' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{item.activity}</span>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hrModules.map((module, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.route)}
              >
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
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {module.description}
                  </CardDescription>
                  <div className="flex items-center gap-2">
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

        <TabsContent value="quick-actions" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  {isArabic ? 'إضافة موظف جديد' : 'Add New Employee'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/employees?action=add')}
                >
                  {isArabic ? 'إضافة موظف' : 'Add Employee'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {isArabic ? 'إنشاء تقرير' : 'Generate Report'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/analytics')}
                >
                  {isArabic ? 'إنشاء تقرير' : 'Create Report'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {isArabic ? 'إعدادات النظام' : 'System Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/settings')}
                >
                  {isArabic ? 'الإعدادات' : 'Settings'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Integration */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="hr-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'organizational-structure']}
      />
    </div>
  );
};

export default HRPage;