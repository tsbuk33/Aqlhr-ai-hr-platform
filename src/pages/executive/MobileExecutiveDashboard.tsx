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
  ChevronRight
} from 'lucide-react';
import { useAIDashboard, useAIRecommendations, useAISync } from '@/hooks/useAI';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // AI Hooks for real-time data
  const { data: aiData, isLoading: aiLoading } = useAIDashboard();
  const { data: recommendations } = useAIRecommendations();
  const { data: syncData } = useAISync();

  const quickMetrics: QuickMetric[] = [
    {
      icon: '🏆',
      title: isArabic ? 'صحة النظام' : 'System Health',
      value: '99.9%',
      status: 'excellent',
      trend: 'stable'
    },
    {
      icon: '💰',
      title: isArabic ? 'فرصة العائد' : 'ROI Opportunity',
      value: '340%',
      status: 'critical',
      trend: 'increasing',
      alert: true
    },
    {
      icon: '🏛️',
      title: isArabic ? 'نقاط الامتثال' : 'Compliance Score',
      value: '94%',
      status: 'good',
      trend: 'improving'
    },
    {
      icon: '👥',
      title: isArabic ? 'عائد القوى العاملة' : 'Workforce ROI',
      value: '146%',
      status: 'excellent',
      trend: 'up-15%'
    }
  ];

  const criticalAlerts: MobileAlert[] = [
    {
      priority: 'critical',
      icon: '💡',
      title: isArabic ? 'فرصة استراتيجية' : 'Strategic Opportunity',
      message: isArabic ? 'زيادة العائد بنسبة 340% متاحة من خلال تخطيط القوى العاملة المتقدم' : '340% ROI increase available through advanced workforce planning',
      confidence: '94%',
      actionLabel: isArabic ? 'عرض التفاصيل' : 'View Details'
    },
    {
      priority: 'warning',
      icon: '📊',
      title: isArabic ? 'هدف السعودة' : 'Saudization Target',
      message: isArabic ? 'قسم تقنية المعلومات يقترب من عتبة 35%' : 'IT department approaching 35% threshold',
      confidence: '96%',
      actionLabel: isArabic ? 'اتخاذ إجراء' : 'Take Action'
    }
  ];

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
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              📱 {isArabic ? 'مركز القيادة التنفيذية' : 'Executive Command Center'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
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
          <div className="p-6 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? 'تحليلات متقدمة' : 'Advanced Analytics'}
            </h3>
            <p className="text-muted-foreground">
              {isArabic ? 'ميزات التحليلات المحسنة قريباً' : 'Enhanced analytics features coming soon'}
            </p>
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
          <div className="p-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? 'الملف الشخصي' : 'Executive Profile'}
            </h3>
            <p className="text-muted-foreground">
              {isArabic ? 'إعدادات الملف الشخصي قريباً' : 'Profile settings coming soon'}
            </p>
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