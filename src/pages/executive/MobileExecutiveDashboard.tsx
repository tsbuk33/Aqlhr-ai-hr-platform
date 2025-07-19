import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Users,
  DollarSign,
  Zap,
  Home,
  BarChart3,
  Bell,
  User,
  RefreshCw,
  ChevronRight,
  Crown,
  Building2,
  Globe,
  Settings
} from 'lucide-react';
import { useAIDashboard, useAIRecommendations, useAISync } from '@/hooks/useAI';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock user role - in real app this would come from auth context
const useAuth = () => {
  // For demo purposes - you can change this to test different roles
  const userRole = 'client_ceo'; // or 'super_admin'
  const companyData = {
    name: 'Saudi Aramco',
    totalEmployees: '75,000',
    saudizationRate: 72,
    id: 'aramco-001'
  };
  
  return {
    userRole,
    companyData,
    user: { id: '1', name: 'Executive User' }
  };
};

interface QuickMetric {
  icon: string;
  title: string;
  value: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: string;
  alert?: boolean;
}

interface MobileAlert {
  priority: 'critical' | 'warning' | 'info';
  icon: string;
  title: string;
  message: string;
  confidence: string;
  actionLabel: string;
}

const MobileExecutiveDashboard: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userRole, companyData } = useAuth();
  
  // AI Hooks for real-time data
  const { data: aiData, isLoading: aiLoading } = useAIDashboard();
  const { data: recommendations } = useAIRecommendations();
  const { data: syncData } = useAISync();
  
  const isSuperAdmin = userRole === 'super_admin';
  const isClientCEO = userRole === 'client_ceo';

  // Role-based metrics
  const superAdminMetrics: QuickMetric[] = [
    {
      icon: '🏢',
      title: isArabic ? 'إجمالي الشركات العميلة' : 'Total Client Companies',
      value: '1,247',
      status: 'excellent',
      trend: '+23% this quarter'
    },
    {
      icon: '💰',
      title: isArabic ? 'إيرادات المنصة' : 'Platform Revenue',
      value: '45.2M SAR',
      status: 'excellent',
      trend: '+18% growth'
    },
    {
      icon: '📊',
      title: isArabic ? 'الحصة السوقية' : 'Market Share',
      value: '8.3%',
      status: 'excellent',
      trend: '+2.1% vs competitors'
    },
    {
      icon: '🌍',
      title: isArabic ? 'الوصول العالمي' : 'Global Reach',
      value: '105+ Modules',
      status: 'excellent',
      trend: 'World-class platform'
    }
  ];

  const clientCEOMetrics: QuickMetric[] = [
    {
      icon: '👥',
      title: isArabic ? 'عائد القوى العاملة' : 'Workforce ROI',
      value: '146%',
      status: 'excellent',
      trend: '+15% improvement'
    },
    {
      icon: '💰',
      title: isArabic ? 'الإيرادات لكل موظف' : 'Revenue per Employee',
      value: '180K SAR',
      status: 'excellent',
      trend: '80% cost reduction'
    },
    {
      icon: '🏛️',
      title: isArabic ? 'معدل السعودة' : 'Saudization Rate',
      value: `${companyData.saudizationRate}%`,
      status: 'good',
      trend: 'On track'
    },
    {
      icon: '📊',
      title: isArabic ? 'نقاط الامتثال' : 'Compliance Score',
      value: '94%',
      status: 'excellent',
      trend: 'Excellent standing'
    }
  ];

  const quickMetrics = isSuperAdmin ? superAdminMetrics : clientCEOMetrics;

  // Role-based alerts
  const superAdminAlerts: MobileAlert[] = [
    {
      priority: 'critical',
      icon: '🌍',
      title: isArabic ? 'فرصة توسع السوق' : 'Market Expansion Opportunity',
      message: isArabic ? 'السوق الإماراتي يظهر إمكانية نمو بنسبة 340%' : 'UAE market shows 340% growth potential',
      confidence: '94%',
      actionLabel: isArabic ? 'استكشاف التوسع' : 'Explore Expansion'
    },
    {
      priority: 'info',
      icon: '💰',
      title: isArabic ? 'نمو الإيرادات' : 'Revenue Growth',
      message: isArabic ? 'الإيرادات الشهرية وصلت إلى 45.2 مليون ريال سعودي' : 'Monthly revenue reached 45.2M SAR milestone',
      confidence: '100%',
      actionLabel: isArabic ? 'عرض التفاصيل' : 'View Details'
    }
  ];

  const clientCEOAlerts: MobileAlert[] = [
    {
      priority: 'critical',
      icon: '💡',
      title: isArabic ? 'فرصة استراتيجية للشركة' : 'Strategic Opportunity for Your Company',
      message: isArabic ? `زيادة العائد بنسبة 340% متاحة لموظفيكم البالغ عددهم ${companyData.totalEmployees}` : `340% ROI increase available for your ${companyData.totalEmployees} employees`,
      confidence: '94%',
      actionLabel: isArabic ? 'عرض استراتيجية الشركة' : 'View Company Strategy'
    },
    {
      priority: 'warning',
      icon: '📊',
      title: isArabic ? 'تنبيه أداء القسم' : 'Department Performance Alert',
      message: isArabic ? 'قسم تقنية المعلومات يظهر فرصة إنتاجية بنسبة 23%' : 'IT department showing 23% productivity opportunity',
      confidence: '89%',
      actionLabel: isArabic ? 'مراجعة القسم' : 'Review Department'
    }
  ];

  const criticalAlerts = isSuperAdmin ? superAdminAlerts : clientCEOAlerts;

  const quickActions = [
    { icon: '📊', label: isArabic ? 'عرض التحليلات' : 'View Analytics', description: isArabic ? 'لوحة القيادة الاستراتيجية الكاملة' : 'Full strategic dashboard', badge: isArabic ? 'مباشر' : 'Live' },
    { icon: '✅', label: isArabic ? 'موافقة القرار' : 'Approve Decision', description: isArabic ? 'القرارات الاستراتيجية المعلقة' : 'Pending strategic decisions', badge: '2' },
    { icon: '🎯', label: isArabic ? 'رؤى استراتيجية' : 'Strategic Insights', description: isArabic ? 'توصيات الذكاء الاصطناعي' : 'AI recommendations', badge: isArabic ? 'جديد' : 'New' },
    { icon: '🚨', label: isArabic ? 'التعامل مع التنبيهات' : 'Handle Alerts', description: isArabic ? 'إشعارات حرجة' : 'Critical notifications', badge: '2' },
    { icon: '📱', label: isArabic ? 'استجابة طوارئ' : 'Emergency Response', description: isArabic ? 'مطلوب إجراء فوري' : 'Immediate action required', badge: '!' },
    { icon: '📈', label: isArabic ? 'مراجعة الأداء' : 'Performance Review', description: isArabic ? 'مقاييس في الوقت الفعلي' : 'Real-time metrics', badge: isArabic ? 'مباشر' : 'Live' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-amber-500 bg-amber-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 pb-24">
      {/* Executive Header */}
      <div className={`bg-gradient-to-br p-6 rounded-xl border ${
        isSuperAdmin 
          ? 'from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/20' 
          : 'from-primary/20 via-primary/10 to-transparent border-primary/20'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${
              isSuperAdmin ? 'text-purple-400' : 'text-primary'
            }`}>
              {isSuperAdmin ? '👑' : '🏢'} {
                isSuperAdmin 
                  ? (isArabic ? 'مركز قيادة المنصة' : 'Platform Command Center')
                  : (isArabic ? `مركز ${companyData.name} التنفيذي` : `${companyData.name} Executive Center`)
              }
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {isSuperAdmin ? <Crown className="w-4 h-4 text-purple-400" /> : <Building2 className="w-4 h-4 text-primary" />}
              <span className="text-sm text-muted-foreground">
                {isSuperAdmin 
                  ? (isArabic ? 'وصول المدير العام' : 'Super Admin Access')
                  : (isArabic ? 'وصول الرئيس التنفيذي' : 'CEO Access')
                }
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickMetrics.map((metric, index) => (
          <Card key={index} className="p-4 relative overflow-hidden">
            {metric.alert && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            )}
            <div className="text-2xl mb-2">{metric.icon}</div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.title}</p>
              <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}
              </p>
              <div className="flex items-center gap-1">
                {metric.trend.includes('up') || metric.trend === 'increasing' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : metric.trend === 'stable' ? (
                  <Target className="w-3 h-3 text-blue-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className="text-xs text-muted-foreground">{metric.trend}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Critical Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            🚨 {isArabic ? 'التنبيهات الحرجة' : 'Critical Alerts'}
          </h3>
          <Badge variant="destructive" className="text-xs">
            {criticalAlerts.length} {isArabic ? 'نشط' : 'Active'}
          </Badge>
        </div>
        <div className="space-y-3">
          {criticalAlerts.map((alert, index) => (
            <Card key={index} className={`p-4 border-l-4 ${getPriorityColor(alert.priority)}`}>
              <div className="flex items-start gap-3">
                <div className="text-xl">{alert.icon}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {alert.confidence}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <Button size="sm" className="w-full">
                    {alert.actionLabel}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ⚡ {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="text-center space-y-2">
                <div className="text-2xl">{action.icon}</div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                  {action.badge && (
                    <Badge variant={action.badge === '!' ? 'destructive' : 'secondary'} className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Strategic Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🎯 {isArabic ? 'النظرة الاستراتيجية' : 'Strategic Overview'}
        </h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">{isArabic ? 'ذكاء القوى العاملة' : 'Workforce Intelligence'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? '+15% تحسن الإنتاجية' : '+15% productivity gain'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">146% ROI</p>
                <Badge variant="outline" className="text-xs">{isArabic ? 'ممتاز' : 'Excellent'}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">{isArabic ? 'تحسين الإيرادات' : 'Revenue Optimization'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? '80% تحسن التكلفة' : '80% cost optimized'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-400">180K SAR</p>
                <Badge variant="outline" className="text-xs">{isArabic ? 'ممتاز' : 'Excellent'}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold">{isArabic ? 'تقدم السعودة' : 'Saudization Progress'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'متوافق مع رؤية 2030' : 'Vision 2030 aligned'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-400">70%</p>
                <Badge variant="outline" className="text-xs">{isArabic ? 'جيد' : 'Good'}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold">{isArabic ? 'قدرات الذكاء الاصطناعي' : 'AI Capabilities'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'معالجة في الوقت الفعلي' : 'Real-time processing'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-400">{isArabic ? '26 نشط' : '26 Active'}</p>
                <Badge variant="outline" className="text-xs">{isArabic ? 'ممتاز' : 'Excellent'}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return (
          <div className="space-y-6 pb-24">
            <div className="text-center mb-6">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">
                {isSuperAdmin 
                  ? (isArabic ? 'تحليلات المنصة' : 'Platform Analytics')
                  : (isArabic ? 'تحليلات الشركة' : 'Company Analytics')
                }
              </h2>
            </div>

            {isSuperAdmin ? (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {isArabic ? 'أداء العملاء الأساسيين' : 'Top Client Performance'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🛢️</div>
                        <div>
                          <p className="font-semibold">Saudi Aramco</p>
                          <p className="text-xs text-muted-foreground">75,000 employees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">2.1M SAR</p>
                        <p className="text-xs text-muted-foreground">187% ROI</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🏭</div>
                        <div>
                          <p className="font-semibold">SABIC</p>
                          <p className="text-xs text-muted-foreground">32,000 employees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-400">890K SAR</p>
                        <p className="text-xs text-muted-foreground">156% ROI</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">{isArabic ? 'التحليل التنافسي' : 'Competitive Analysis'}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">vs Oracle HCM</span>
                      <Badge variant="outline" className="text-emerald-400">+60% Superior</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">vs SAP SuccessFactors</span>
                      <Badge variant="outline" className="text-blue-400">+45% Better</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">vs Workday</span>
                      <Badge variant="outline" className="text-purple-400">+200% Cost Advantage</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">{isArabic ? 'أداء الأقسام' : 'Department Performance'}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{isArabic ? 'الهندسة' : 'Engineering'}</p>
                        <p className="text-xs text-muted-foreground">2,340 employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">94%</p>
                        <p className="text-xs text-muted-foreground">Performance</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{isArabic ? 'العمليات' : 'Operations'}</p>
                        <p className="text-xs text-muted-foreground">4,120 employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-400">89%</p>
                        <p className="text-xs text-muted-foreground">Performance</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">{isArabic ? 'مؤشرات الشركة الرئيسية' : 'Company KPIs'}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{isArabic ? 'معدل الاحتفاظ' : 'Retention Rate'}</span>
                      <Badge variant="outline" className="text-emerald-400">88%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{isArabic ? 'رضا الموظفين' : 'Employee Satisfaction'}</span>
                      <Badge variant="outline" className="text-blue-400">92%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{isArabic ? 'الإنتاجية' : 'Productivity Index'}</span>
                      <Badge variant="outline" className="text-purple-400">+15%</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-4 pb-24">
            <h2 className="text-xl font-bold">{isArabic ? 'جميع التنبيهات' : 'All Alerts'}</h2>
            {criticalAlerts.map((alert, index) => (
              <Card key={index} className={`p-4 border-l-4 ${getPriorityColor(alert.priority)}`}>
                <div className="flex items-start gap-3">
                  <div className="text-xl">{alert.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge variant="outline">{alert.confidence}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <Button size="sm" className="w-full">
                      {alert.actionLabel}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'actions':
        return (
          <div className="space-y-4 pb-24">
            <h2 className="text-xl font-bold">{isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}</h2>
            <div className="grid gap-3">
              {quickActions.map((action, index) => (
                <Card key={index} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{action.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{action.label}</p>
                        {action.badge && (
                          <Badge variant={action.badge === '!' ? 'destructive' : 'secondary'}>
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6 pb-24">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isSuperAdmin ? 'bg-purple-500/20' : 'bg-primary/20'
              }`}>
                {isSuperAdmin ? <Crown className="w-10 h-10 text-purple-400" /> : <User className="w-10 h-10 text-primary" />}
              </div>
              <h2 className="text-xl font-bold">
                {isSuperAdmin 
                  ? (isArabic ? 'ملف المؤسس' : 'Founder Profile')
                  : (isArabic ? 'ملف الرئيس التنفيذي' : 'CEO Profile')
                }
              </h2>
              <p className="text-muted-foreground">
                {isSuperAdmin 
                  ? (isArabic ? 'مؤسس منصة سند الموارد البشرية' : 'AqlHR Platform Founder')
                  : (isArabic ? `الرئيس التنفيذي، ${companyData.name}` : `CEO, ${companyData.name}`)
                }
              </p>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isArabic ? 'إعدادات الحساب' : 'Account Settings'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">{isArabic ? 'الإشعارات الفورية' : 'Push Notifications'}</span>
                  <Badge variant="outline" className="text-emerald-400">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">{isArabic ? 'المصادقة البيومترية' : 'Biometric Auth'}</span>
                  <Badge variant="outline" className="text-emerald-400">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">{isArabic ? 'الوضع المظلم' : 'Dark Mode'}</span>
                  <Badge variant="outline" className="text-blue-400">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                </div>
              </div>
            </Card>

            {isSuperAdmin && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">{isArabic ? 'صلاحيات المنصة' : 'Platform Permissions'}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{isArabic ? 'إدارة العملاء' : 'Client Management'}</span>
                    <Badge variant="outline" className="text-purple-400">{isArabic ? 'كامل' : 'Full Access'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isArabic ? 'تحليلات المنصة' : 'Platform Analytics'}</span>
                    <Badge variant="outline" className="text-purple-400">{isArabic ? 'كامل' : 'Full Access'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isArabic ? 'إعدادات النظام' : 'System Configuration'}</span>
                    <Badge variant="outline" className="text-purple-400">{isArabic ? 'كامل' : 'Full Access'}</Badge>
                  </div>
                </div>
              </Card>
            )}

            {isClientCEO && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">{isArabic ? 'معلومات الشركة' : 'Company Information'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <span className="text-sm">{isArabic ? 'إجمالي الموظفين' : 'Total Employees'}</span>
                    <Badge variant="outline">{companyData.totalEmployees}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <span className="text-sm">{isArabic ? 'معدل السعودة' : 'Saudization Rate'}</span>
                    <Badge variant="outline" className="text-emerald-400">{companyData.saudizationRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <span className="text-sm">{isArabic ? 'الوحدات المفعلة' : 'Active Modules'}</span>
                    <Badge variant="outline" className="text-blue-400">89/105</Badge>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-4">
              <h3 className="font-semibold mb-3">{isArabic ? 'إحصائيات الاستخدام' : 'Usage Statistics'}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{isArabic ? 'عدد مرات الدخول هذا الشهر' : 'Monthly Logins'}</span>
                  <Badge variant="outline">247</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{isArabic ? 'آخر نشاط' : 'Last Activity'}</span>
                  <Badge variant="outline">{isArabic ? 'الآن' : 'Now'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{isArabic ? 'المتصفح المفضل' : 'Preferred Browser'}</span>
                  <Badge variant="outline">Mobile Safari</Badge>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        <div className="p-4">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around p-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">{isArabic ? 'نظرة عامة' : 'Overview'}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">{isArabic ? 'تحليلات' : 'Analytics'}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
                activeTab === 'alerts' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs">{isArabic ? 'تنبيهات' : 'Alerts'}</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">2</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === 'actions' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs">{isArabic ? 'إجراءات' : 'Actions'}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">{isArabic ? 'ملف شخصي' : 'Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileExecutiveDashboard;