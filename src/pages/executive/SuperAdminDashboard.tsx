import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Crown, Users, Building2, DollarSign, TrendingUp, Activity, 
  Settings, Database, Mail, Globe, Shield, Zap, Brain, 
  FileText, Target, MessageSquare, Clock, AlertTriangle,
  ChevronRight, Search, Filter, Download, RefreshCw,
  UserCheck, Star, Award, Briefcase, BarChart3, 
  PieChart, LineChart, Map, Calendar, Bell
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import SelfHealingSystem from '@/components/self-healing/SelfHealingSystem';

interface PlatformMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalCompanies: number;
  activeUsers: number;
  totalEmployees: number;
  mcKinseyPresentations: number;
  conversionRate: number;
  systemHealth: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const SuperAdminDashboard: React.FC = () => {
  const { language, isArabic } = useSimpleLanguage();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalRevenue: 2850000,
    monthlyRevenue: 485000,
    totalCompanies: 247,
    activeUsers: 1432,
    totalEmployees: 18650,
    mcKinseyPresentations: 89,
    conversionRate: 73.5,
    systemHealth: 99.2
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'McKinsey Presentation',
      description: 'CEO presentation generated for شركة أرامكو السعودية',
      timestamp: '2 minutes ago',
      severity: 'high'
    },
    {
      id: '2', 
      type: 'New Company',
      description: 'شركة الراجحي المصرفية registered - Enterprise plan',
      timestamp: '15 minutes ago',
      severity: 'medium'
    },
    {
      id: '3',
      type: 'System Alert',
      description: 'GOSI integration sync completed successfully',
      timestamp: '1 hour ago',
      severity: 'low'
    },
    {
      id: '4',
      type: 'Payment',
      description: 'SAR 125,000 payment received from شركة سابك',
      timestamp: '3 hours ago',
      severity: 'high'
    }
  ]);

  const platformStats = [
    {
      title: isArabic ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `SAR ${metrics.totalRevenue.toLocaleString()}`,
      change: '+24.5%',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: isArabic ? 'الإيرادات الشهرية' : 'Monthly Revenue', 
      value: `SAR ${metrics.monthlyRevenue.toLocaleString()}`,
      change: '+18.2%',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: isArabic ? 'إجمالي الشركات' : 'Total Companies',
      value: metrics.totalCompanies.toString(),
      change: '+12 this month',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      title: isArabic ? 'المستخدمون النشطون' : 'Active Users',
      value: metrics.activeUsers.toString(),
      change: '+8.7%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: metrics.totalEmployees.toLocaleString(),
      change: '+2,340 this month',
      icon: UserCheck,
      color: 'text-orange-600'
    },
    {
      title: isArabic ? 'عروض مكنزي' : 'McKinsey Presentations',
      value: metrics.mcKinseyPresentations.toString(),
      change: '+23 this week',
      icon: FileText,
      color: 'text-indigo-600'
    },
    {
      title: isArabic ? 'معدل التحويل' : 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      change: '+5.2%',
      icon: Target,
      color: 'text-rose-600'
    },
    {
      title: isArabic ? 'صحة النظام' : 'System Health',
      value: `${metrics.systemHealth}%`,
      change: 'Excellent',
      icon: Activity,
      color: 'text-teal-600'
    }
  ];

  const topPerformingCompanies = [
    { name: 'شركة أرامكو السعودية', employees: 5420, revenue: 445000, plan: 'Enterprise Plus' },
    { name: 'شركة سابك', employees: 3180, revenue: 290000, plan: 'Enterprise' },
    { name: 'شركة الراجحي المصرفية', employees: 2890, revenue: 185000, plan: 'Professional' },
    { name: 'شركة الاتصالات السعودية', employees: 2340, revenue: 165000, plan: 'Enterprise' },
    { name: 'شركة البنك الأهلي', employees: 1950, revenue: 125000, plan: 'Professional' }
  ];

  const mcKinseyMetrics = {
    totalPresentations: 89,
    thisWeek: 23,
    conversionToConsultation: 73.5,
    avgViewTime: '16 minutes',
    topTemplate: 'CEO Executive',
    revenueFromMcKinsey: 385000
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-surface-subtle">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isArabic ? 'لوحة المؤسس الرئيسية' : 'Founder Super-Admin Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'مرحباً طلال - السيطرة الكاملة على منصة أقل' : 'Welcome Talal - Complete AqlHR Platform Control'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Activity className="w-3 h-3 mr-1" />
              {isArabic ? 'النظام يعمل بكفاءة' : 'System Healthy'}
            </Badge>
            <Button size="sm" variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              {isArabic ? '5 تنبيهات جديدة' : '5 New Alerts'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="assessment">{isArabic ? 'ذكاء التقييم' : 'Assessment Intelligence'}</TabsTrigger>
            <TabsTrigger value="companies">{isArabic ? 'الشركات' : 'Companies'}</TabsTrigger>
            <TabsTrigger value="mckinsey">{isArabic ? 'مكنزي' : 'McKinsey'}</TabsTrigger>
            <TabsTrigger value="analytics">{isArabic ? 'التحليلات' : 'Analytics'}</TabsTrigger>
            <TabsTrigger value="healing">{isArabic ? 'الشفاء الذاتي' : 'Self-Healing'}</TabsTrigger>
            <TabsTrigger value="system">{isArabic ? 'النظام' : 'System'}</TabsTrigger>
            <TabsTrigger value="settings">{isArabic ? 'الإعدادات' : 'Settings'}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Platform Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platformStats.map((stat, index) => (
                <Card key={index} className="bg-gradient-to-br from-surface to-surface-subtle border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                        <p className="text-sm text-emerald-600 mt-1">{stat.change}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity & Top Companies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{isArabic ? 'النشاط الحديث' : 'Recent Activity'}</span>
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-background/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.severity === 'high' ? 'bg-red-500' :
                        activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{activity.type}</Badge>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Performing Companies */}
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle>{isArabic ? 'أفضل الشركات أداء' : 'Top Performing Companies'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPerformingCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.employees} employees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">SAR {company.revenue.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{company.plan}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessment Intelligence Tab */}
          <TabsContent value="assessment" className="space-y-6">
            {/* Real-Time Assessment Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">{isArabic ? 'التقييمات النشطة' : 'Active Assessments'}</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">42</p>
                      <p className="text-xs text-blue-600">+7 today</p>
                    </div>
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">{isArabic ? 'مكتملة اليوم' : 'Completed Today'}</p>
                      <p className="text-2xl font-bold text-emerald-900 mt-1">18</p>
                      <p className="text-xs text-emerald-600">Awaiting presentations</p>
                    </div>
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">{isArabic ? 'معدل التحويل' : 'Conversion Rate'}</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">73.5%</p>
                      <p className="text-xs text-purple-600">Assessment → Consultation</p>
                    </div>
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">{isArabic ? 'متوسط النتائج' : 'Average Score'}</p>
                      <p className="text-2xl font-bold text-orange-900 mt-1">6.8/10</p>
                      <p className="text-xs text-orange-600">Across all industries</p>
                    </div>
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">{isArabic ? 'أهم الثغرات' : 'Top Gaps'}</p>
                      <p className="text-xl font-bold text-red-900 mt-1">Digital HR</p>
                      <p className="text-xs text-red-600">67% of companies</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assessment Pipeline */}
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'خط إنتاج التقييم' : 'Assessment Pipeline'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div>
                      <p className="font-medium text-blue-900">{isArabic ? 'عروض معلقة' : 'Pending Presentations'}</p>
                      <p className="text-sm text-blue-700">Ready for generation</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">15</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div>
                      <p className="font-medium text-yellow-900">{isArabic ? 'قائمة التخصيص' : 'Customization Queue'}</p>
                      <p className="text-sm text-yellow-700">Awaiting your review</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <div>
                      <p className="font-medium text-green-900">{isArabic ? 'حالة التسليم' : 'Delivery Status'}</p>
                      <p className="text-sm text-green-700">Delivered & tracking</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">23</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                    <div>
                      <p className="font-medium text-red-900">{isArabic ? 'متابعة مطلوبة' : 'Follow-up Required'}</p>
                      <p className="text-sm text-red-700">Action needed</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">5</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Market Intelligence */}
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'ذكاء السوق' : 'Market Intelligence'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'اتجاهات الصناعة' : 'Industry Trends'}</span>
                      <Badge variant="outline">Oil & Gas Leading</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'رؤى المنافسين' : 'Competitor Insights'}</span>
                      <Badge variant="outline">vs Oracle/SAP</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'ذكاء التسعير' : 'Pricing Intelligence'}</span>
                      <Badge variant="outline">High Investment</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'نقاط الفرص' : 'Opportunity Scoring'}</span>
                      <Badge variant="outline">AI-Powered</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-2">{isArabic ? 'أهم الثغرات المحددة' : 'Top Identified Gaps'}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Digital HR Transformation</span>
                        <span className="text-red-600">67%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Performance Management</span>
                        <span className="text-orange-600">54%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Succession Planning</span>
                        <span className="text-yellow-600">43%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Scoring */}
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'نقاط الفرص' : 'Opportunity Scoring'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-900">شركة أرامكو السعودية</span>
                        <Badge className="bg-green-100 text-green-800">98%</Badge>
                      </div>
                      <p className="text-xs text-green-700">High investment capacity • Digital gaps • Decision maker engaged</p>
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-900">شركة الراجحي المصرفية</span>
                        <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                      </div>
                      <p className="text-xs text-blue-700">Banking sector leader • Compliance needs • Quick decision cycle</p>
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-purple-900">شركة الاتصالات السعودية</span>
                        <Badge className="bg-purple-100 text-purple-800">78%</Badge>
                      </div>
                      <p className="text-xs text-purple-700">Tech-forward • Succession planning gaps • Medium timeline</p>
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-orange-900">شركة معادن</span>
                        <Badge className="bg-orange-100 text-orange-800">72%</Badge>
                      </div>
                      <p className="text-xs text-orange-700">Growth phase • Multiple HR gaps • Budget constraints</p>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    {isArabic ? 'عرض التقرير الكامل' : 'View Full Report'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Performance Analytics */}
            <Card className="bg-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'تحليل أداء التقييم' : 'Assessment Performance Analytics'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      {isArabic ? 'هذا الشهر' : 'This Month'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      {isArabic ? 'تصدير' : 'Export'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <LineChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">16 min</p>
                    <p className="text-sm text-muted-foreground">{isArabic ? 'متوسط وقت التقييم' : 'Average Assessment Time'}</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">247</p>
                    <p className="text-sm text-muted-foreground">{isArabic ? 'شركات مقيّمة' : 'Companies Assessed'}</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">89%</p>
                    <p className="text-sm text-muted-foreground">{isArabic ? 'معدل إتمام التقييم' : 'Assessment Completion Rate'}</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">4.8/5</p>
                    <p className="text-sm text-muted-foreground">{isArabic ? 'تقييم رضا العملاء' : 'Client Satisfaction'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <Card className="bg-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isArabic ? 'إدارة الشركات' : 'Company Management'}</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      {isArabic ? 'بحث' : 'Search'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      {isArabic ? 'تصفية' : 'Filter'}
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {isArabic ? 'تصدير' : 'Export'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topPerformingCompanies.map((company, index) => (
                    <Card key={index} className="bg-background/50 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{company.plan}</Badge>
                          <Button size="sm" variant="ghost">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        <h3 className="font-medium text-foreground mb-2">{company.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{isArabic ? 'الموظفون:' : 'Employees:'}</span>
                            <span className="text-foreground">{company.employees}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{isArabic ? 'الإيرادات:' : 'Revenue:'}</span>
                            <span className="text-foreground">SAR {company.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* McKinsey Tab */}
          <TabsContent value="mckinsey" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">{isArabic ? 'إجمالي العروض' : 'Total Presentations'}</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{mcKinseyMetrics.totalPresentations}</p>
                      <p className="text-sm text-blue-600 mt-1">+{mcKinseyMetrics.thisWeek} this week</p>
                    </div>
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">{isArabic ? 'معدل التحويل' : 'Conversion Rate'}</p>
                      <p className="text-3xl font-bold text-emerald-900 mt-2">{mcKinseyMetrics.conversionToConsultation}%</p>
                      <p className="text-sm text-emerald-600 mt-1">{isArabic ? 'إلى استشارة' : 'to consultation'}</p>
                    </div>
                    <Target className="h-10 w-10 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">{isArabic ? 'إيرادات مكنزي' : 'McKinsey Revenue'}</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">SAR {mcKinseyMetrics.revenueFromMcKinsey.toLocaleString()}</p>
                      <p className="text-sm text-purple-600 mt-1">+28% this month</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-surface border-border/50">
              <CardHeader>
                <CardTitle>{isArabic ? 'أداء نظام مكنزي' : 'McKinsey System Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'متوسط وقت المشاهدة' : 'Average View Time'}</span>
                      <span className="font-medium">{mcKinseyMetrics.avgViewTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'القالب الأكثر استخداماً' : 'Top Template'}</span>
                      <span className="font-medium">{mcKinseyMetrics.topTemplate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{isArabic ? 'عروض هذا الأسبوع' : 'This Week\'s Presentations'}</span>
                      <span className="font-medium">{mcKinseyMetrics.thisWeek}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Brain className="w-4 h-4 mr-2" />
                      {isArabic ? 'إعدادات مولد مكنزي' : 'McKinsey Generator Settings'}
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      {isArabic ? 'قوالب البريد الإلكتروني' : 'Email Templates'}
                    </Button>
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {isArabic ? 'تحليلات متقدمة' : 'Advanced Analytics'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'توزيع الاشتراكات' : 'Subscription Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Enterprise Plus</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Enterprise</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Professional</span>
                      <span className="font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'نمو المستخدمين' : 'User Growth'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'هذا الشهر' : 'This Month'}</span>
                      <span className="font-medium text-emerald-600">+18.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'الشهر الماضي' : 'Last Month'}</span>
                      <span className="font-medium">+12.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'متوسط 3 أشهر' : '3-Month Avg'}</span>
                      <span className="font-medium">+15.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'التوزيع الجغرافي' : 'Geographic Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'الرياض' : 'Riyadh'}</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'جدة' : 'Jeddah'}</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'الدمام' : 'Dammam'}</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isArabic ? 'أخرى' : 'Others'}</span>
                      <span className="font-medium">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Self-Healing System Tab */}
          <TabsContent value="healing" className="space-y-6">
            <SelfHealingSystem />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'حالة النظام' : 'System Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'الخوادم الرئيسية' : 'Main Servers'}</span>
                    <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'تعمل' : 'Online'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'قاعدة البيانات' : 'Database'}</span>
                    <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'صحية' : 'Healthy'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'تكاملات الحكومة' : 'Gov Integrations'}</span>
                    <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'متزامنة' : 'Synced'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'نظام مكنزي' : 'McKinsey System'}</span>
                    <Badge className="bg-emerald-100 text-emerald-800">{isArabic ? 'نشط' : 'Active'}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    {isArabic ? 'الأمان والمراقبة' : 'Security & Monitoring'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'محاولات تسجيل الدخول' : 'Login Attempts'}</span>
                    <span className="font-medium">1,247 {isArabic ? 'اليوم' : 'today'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'تنبيهات الأمان' : 'Security Alerts'}</span>
                    <span className="font-medium">0 {isArabic ? 'نشط' : 'active'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? 'النسخ الاحتياطية' : 'Backups'}</span>
                    <span className="font-medium">{isArabic ? 'تم اليوم' : 'Completed today'}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {isArabic ? 'عرض السجلات المفصلة' : 'View Detailed Logs'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle>{isArabic ? 'إعدادات المنصة' : 'Platform Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'الوضع الليلي الافتراضي' : 'Default Dark Mode'}</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'التسجيلات التلقائية' : 'Auto-registrations'}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'وضع الصيانة' : 'Maintenance Mode'}</Label>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border/50">
                <CardHeader>
                  <CardTitle>{isArabic ? 'إعدادات مكنزي' : 'McKinsey Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'الإنشاء التلقائي' : 'Auto-generation'}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'الإرسال التلقائي' : 'Auto-delivery'}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{isArabic ? 'تتبع الأداء' : 'Performance Tracking'}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? 'حد الإنشاء اليومي' : 'Daily Generation Limit'}</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-surface border-border/50">
              <CardHeader>
                <CardTitle>{isArabic ? 'أدوات المطور' : 'Developer Tools'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    {isArabic ? 'قاعدة البيانات' : 'Database Admin'}
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Globe className="w-6 h-6 mb-2" />
                    {isArabic ? 'إدارة الواجهات' : 'API Management'}
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Zap className="w-6 h-6 mb-2" />
                    {isArabic ? 'أدوات الأداء' : 'Performance Tools'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;