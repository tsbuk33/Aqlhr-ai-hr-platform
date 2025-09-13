import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, ArrowDown,
  Settings, Shield, Scale, Award, HelpCircle, Heart, BarChart3, Briefcase,
  Building2, Zap, Brain, Globe, FileCheck, Wrench, GraduationCap, TrendingUp,
  Star, Sparkles, Activity, Crown, Microscope, Target, AlertTriangle
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
      color: "blue"
    },
    {
      title: isArabic ? "معدل السعودة" : "Saudization Rate",
      value: "66.8%",
      change: "+2.1%",
      trend: "up", 
      icon: Target,
      color: "green"
    },
    {
      title: isArabic ? "معدل السلامة" : "Safety Score",
      value: "8.5/10",
      change: "-0.3",
      trend: "down",
      icon: Shield,
      color: "amber"
    },
    {
      title: isArabic ? "رضا الموظفين" : "Employee Experience",
      value: "7.5/10",
      change: "+0.8",
      trend: "up",
      icon: Heart,
      color: "rose"
    }
  ];

  const quickActions = [
    {
      title: isArabic ? "إضافة موظف جديد" : "Add Employee",
      icon: Users,
      url: "/core-hr/master-data"
    },
    {
      title: isArabic ? "معالجة الرواتب" : "Process Payroll", 
      icon: BarChart3,
      url: "/payroll"
    },
    {
      title: isArabic ? "إدارة الإجازات" : "Manage Leave",
      icon: Calendar,
      url: "/core-hr/leave"
    },
    {
      title: isArabic ? "تقارير الأداء" : "Performance Reports",
      icon: TrendingUp,
      url: "/core-hr/performance"
    }
  ];

  const recentActivities = [
    {
      title: isArabic ? "تم إضافة 5 موظفين جدد" : "5 New employees added",
      time: isArabic ? "منذ ساعتين" : "2 hours ago",
      type: "info"
    },
    {
      title: isArabic ? "تمت معالجة راتب شهر ديسمبر" : "December payroll processed", 
      time: isArabic ? "منذ 4 ساعات" : "4 hours ago",
      type: "success"
    },
    {
      title: isArabic ? "طلب إجازة يحتاج موافقة" : "Leave request needs approval",
      time: isArabic ? "منذ 6 ساعات" : "6 hours ago", 
      type: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-surface">
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            {isArabic ? 'أهلاً بك في نظام عقل للموارد البشرية' : 'Welcome to AqlHR System'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic 
              ? 'منصة ذكية لإدارة الموارد البشرية مدعومة بالذكاء الاصطناعي'
              : 'AI-Powered Smart HR Management Platform'
            }
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="bg-gradient-to-br from-surface to-surface-subtle border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className={`h-5 w-5 text-${kpi.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className={`flex items-center text-xs ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-surface to-surface-subtle border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <LinkL key={index} to={action.url}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12 hover:bg-accent/50">
                    <action.icon className="h-5 w-5 text-primary" />
                    {action.title}
                  </Button>
                </LinkL>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-to-br from-surface to-surface-subtle border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-surface to-surface-subtle border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {isArabic ? 'حالة النظام' : 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'حالة النظام' : 'System Health'}
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {isArabic ? 'ممتاز' : 'Excellent'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الأداء' : 'Performance'}</span>
                    <span className="text-foreground">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الاستخدام' : 'Usage'}</span>
                    <span className="text-foreground">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Modules Grid */}
        <Card className="bg-gradient-to-br from-surface to-surface-subtle border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {isArabic ? 'وحدات المنصة' : 'Platform Modules'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { title: isArabic ? "الموارد البشرية الأساسية" : "Core HR", icon: Users, url: "/core-hr", badge: "13" },
                { title: isArabic ? "مركز الذكاء التنفيذي" : "Executive Intelligence", icon: Crown, url: "/executive-center", badge: "PREMIUM" },
                { title: isArabic ? "ذكاء المهارات" : "Skills Intelligence", icon: Star, url: "/skills-intelligence", badge: "NEW" },
                { title: isArabic ? "تحسين التعلّم" : "Learning Optimization", icon: GraduationCap, url: "/leo", badge: "LEO" },
                { title: isArabic ? "تحسين المشاركة" : "Engagement Optimization", icon: Sparkles, url: "/geo", badge: "GEO" },
                { title: isArabic ? "الذكاء الاصطناعي" : "AI & Analytics", icon: Brain, url: "/analytics", badge: "AI" },
                { title: isArabic ? "التكاملات الحكومية" : "Government Integrations", icon: Building2, url: "/government", badge: "21" },
                { title: isArabic ? "الامتثال والحوكمة" : "Compliance & Governance", icon: Shield, url: "/compliance", badge: "NEW" },
              ].map((module, index) => (
                <LinkL key={index} to={module.url}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/30 border border-border/30 bg-gradient-to-br from-background to-surface">
                    <CardContent className="p-4 text-center">
                      <module.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:text-accent transition-colors" />
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{module.title}</h3>
                      <Badge variant="outline" className="text-xs">
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