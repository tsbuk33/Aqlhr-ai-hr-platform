import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Calendar, FileText, ArrowUp, ArrowDown, TrendingUp, Activity,
  Settings, Shield, Heart, BarChart3, Building2, Zap, Brain, Star,
  GraduationCap, Sparkles, Crown, Target, AlertTriangle, Clock,
  CheckCircle, ExternalLink, Briefcase, Award, Globe
} from "lucide-react";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { LinkL } from '@/lib/i18n/LinkL';

export default function Dashboard() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const kpiCards = [
    {
      title: isArabic ? "إجمالي الموظفين" : "Total Employees",
      value: "1,000",
      change: "+12%",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: isArabic ? "معدل السعودة" : "Saudization Rate",
      value: "66.8%",
      change: "+2.1%",
      trend: "up", 
      icon: Target,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: isArabic ? "معدل السلامة" : "Safety Score",
      value: "8.5/10",
      change: "-0.3",
      trend: "down",
      icon: Shield,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: isArabic ? "رضا الموظفين" : "Employee Experience",
      value: "7.5/10",
      change: "+0.8",
      trend: "up",
      icon: Heart,
      gradient: "from-rose-500 to-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/20",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400"
    }
  ];

  const quickActions = [
    {
      title: isArabic ? "إضافة موظف جديد" : "Add Employee",
      icon: Users,
      url: "/core-hr/master-data",
      color: "text-blue-600"
    },
    {
      title: isArabic ? "معالجة الرواتب" : "Process Payroll", 
      icon: BarChart3,
      url: "/payroll",
      color: "text-green-600"
    },
    {
      title: isArabic ? "إدارة الإجازات" : "Manage Leave",
      icon: Calendar,
      url: "/core-hr/leave",
      color: "text-purple-600"
    },
    {
      title: isArabic ? "تقارير الأداء" : "Performance Reports",
      icon: TrendingUp,
      url: "/core-hr/performance",
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      title: isArabic ? "تم إضافة 5 موظفين جدد" : "5 New employees added",
      time: isArabic ? "منذ ساعتين" : "2 hours ago",
      type: "success",
      icon: Users
    },
    {
      title: isArabic ? "تمت معالجة راتب شهر ديسمبر" : "December payroll processed", 
      time: isArabic ? "منذ 4 ساعات" : "4 hours ago",
      type: "info",
      icon: BarChart3
    },
    {
      title: isArabic ? "طلب إجازة يحتاج موافقة" : "Leave request needs approval",
      time: isArabic ? "منذ 6 ساعات" : "6 hours ago", 
      type: "warning",
      icon: AlertTriangle
    }
  ];

  const platformModules = [
    { 
      title: isArabic ? "الموارد البشرية الأساسية" : "Core HR", 
      icon: Users, 
      url: "/core-hr", 
      badge: "13",
      gradient: "from-emerald-500 to-emerald-600",
      description: isArabic ? "إدارة شاملة للموظفين" : "Complete employee management"
    },
    { 
      title: isArabic ? "مركز الذكاء التنفيذي" : "Executive Intelligence", 
      icon: Crown, 
      url: "/executive-center", 
      badge: "PREMIUM",
      gradient: "from-yellow-500 to-yellow-600",
      description: isArabic ? "رؤى تنفيذية متقدمة" : "Advanced executive insights"
    },
    { 
      title: isArabic ? "ذكاء المهارات" : "Skills Intelligence", 
      icon: Star, 
      url: "/skills-intelligence", 
      badge: "NEW",
      gradient: "from-amber-500 to-amber-600",
      description: isArabic ? "تحليل وتطوير المهارات" : "Skills analysis & development"
    },
    { 
      title: isArabic ? "تحسين التعلّم" : "Learning (LEO)", 
      icon: GraduationCap, 
      url: "/leo", 
      badge: "LEO",
      gradient: "from-blue-500 to-blue-600",
      description: isArabic ? "منصة التعلم الذكية" : "Smart learning platform"
    },
    { 
      title: isArabic ? "تحسين المشاركة" : "Engagement (GEO)", 
      icon: Sparkles, 
      url: "/geo", 
      badge: "GEO",
      gradient: "from-pink-500 to-pink-600",
      description: isArabic ? "تحسين مشاركة الموظفين" : "Employee engagement optimization"
    },
    { 
      title: isArabic ? "الذكاء الاصطناعي" : "AI & Analytics", 
      icon: Brain, 
      url: "/analytics", 
      badge: "AI",
      gradient: "from-purple-500 to-purple-600",
      description: isArabic ? "تحليلات ذكية متقدمة" : "Advanced intelligent analytics"
    },
    { 
      title: isArabic ? "التكاملات الحكومية" : "Government Integrations", 
      icon: Building2, 
      url: "/government", 
      badge: "21",
      gradient: "from-green-500 to-green-600",
      description: isArabic ? "ربط مع الأنظمة الحكومية" : "Government systems integration"
    },
    { 
      title: isArabic ? "الامتثال والحوكمة" : "Compliance & Governance", 
      icon: Shield, 
      url: "/compliance", 
      badge: "NEW",
      gradient: "from-indigo-500 to-indigo-600",
      description: isArabic ? "ضمان الامتثال التنظيمي" : "Regulatory compliance assurance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-border/50 p-8">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {isArabic ? 'أهلاً بك في نظام عقل للموارد البشرية' : 'Welcome to AqlHR System'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isArabic 
                    ? 'منصة ذكية لإدارة الموارد البشرية مدعومة بالذكاء الاصطناعي'
                    : 'AI-Powered Smart HR Management Platform'
                  }
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {isArabic ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {isArabic ? 'محدث للتو' : 'Live Data'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className={`relative overflow-hidden ${kpi.bg} border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105 group`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${kpi.iconBg}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {kpi.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {kpi.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-foreground">{kpi.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <LinkL key={index} to={action.url}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-14 hover:bg-accent/50 group">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-accent transition-colors">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="font-medium">{action.title}</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </LinkL>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 
                    activity.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.type === 'success' ? 'text-green-600' : 
                      activity.type === 'warning' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                {isArabic ? 'حالة النظام' : 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'حالة النظام' : 'System Health'}
                </span>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                  {isArabic ? 'ممتاز' : 'Excellent'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الأداء' : 'Performance'}</span>
                    <span className="font-medium text-foreground">95%</span>
                  </div>
                  <Progress value={95} className="h-2 bg-muted" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الاستخدام' : 'Usage'}</span>
                    <span className="font-medium text-foreground">73%</span>
                  </div>
                  <Progress value={73} className="h-2 bg-muted" />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">
                      {isArabic ? 'متصل ومحدث' : 'Online & Updated'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Modules Grid */}
        <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              {isArabic ? 'وحدات المنصة' : 'Platform Modules'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {platformModules.map((module, index) => (
                <LinkL key={index} to={module.url}>
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 bg-gradient-to-br from-background to-muted/20 hover:from-muted/30 hover:to-muted/10">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{module.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{module.description}</p>
                      </div>
                      
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {module.badge}
                      </Badge>
                    </CardContent>
                  </Card>
                </LinkL>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}