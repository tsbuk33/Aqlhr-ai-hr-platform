import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Calendar, TrendingUp, ArrowUp, ArrowDown, Activity,
  Settings, Shield, Heart, BarChart3, Building2, Zap, Brain, Star,
  GraduationCap, Sparkles, Crown, Target, AlertTriangle, Clock,
  CheckCircle, ExternalLink, Award, FileText, PlusCircle
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
      color: "text-blue-400"
    },
    {
      title: isArabic ? "معدل السعودة" : "Saudization Rate",
      value: "66.8%",
      change: "+2.1%",
      trend: "up", 
      icon: Target,
      color: "text-green-400"
    },
    {
      title: isArabic ? "معدل السلامة" : "Safety Score",
      value: "8.5/10",
      change: "-0.3",
      trend: "down",
      icon: Shield,
      color: "text-yellow-400"
    },
    {
      title: isArabic ? "رضا الموظفين" : "Employee Experience",
      value: "7.5/10",
      change: "+0.8",
      trend: "up",
      icon: Heart,
      color: "text-rose-400"
    }
  ];

  const quickActions = [
    {
      title: isArabic ? "إضافة موظف" : "Add Employee",
      icon: PlusCircle,
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
      icon: FileText,
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
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* Main KPI Cards - Exact Production Layout */}
        <div className="grid grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="aqlhr-card bg-card border-border/30 hover:border-border/50 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <LinkL key={index} to={action.url}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-10 text-sm hover:bg-accent/30 transition-colors"
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    {action.title}
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </Button>
                </LinkL>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/20 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' : 
                    activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
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
          <Card className="aqlhr-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-primary" />
                {isArabic ? 'حالة النظام' : 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {isArabic ? 'حالة النظام' : 'System Health'}
                </span>
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  {isArabic ? 'ممتاز' : 'Excellent'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الأداء' : 'Performance'}</span>
                    <span className="text-foreground font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isArabic ? 'الاستخدام' : 'Usage'}</span>
                    <span className="text-foreground font-medium">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues & Alerts Section */}
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {isArabic ? 'التنبيهات والمشاكل' : 'Issues & Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">
                {isArabic ? 'لا توجد مشاكل في النظام' : 'No system issues detected'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trends Section */}
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-lg">{isArabic ? 'الاتجاهات' : 'Trends'}</span>
              </div>
              <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">
                MEDIUM
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                <div>
                  <p className="font-medium text-foreground">
                    {isArabic ? 'انخفض السلامة النفسية بمقدار >1.0 في 30 يوماً' : 'Psychological safety dropped >1.0 in 30 days'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'أعلن مدير الأمان إحاطة مستهدفة نبض في أقسام عالية المخاطر.' : 'Team manager safety brief requires targeted pulse in high-risk departments.'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">75.0</div>
                  <div className="text-sm text-red-400 flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" />
                    -7.3%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}