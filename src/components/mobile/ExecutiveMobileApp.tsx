import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import type { User } from '@supabase/supabase-js';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building,
  AlertCircle,
  Target,
  Award,
  Calendar,
  FileText,
  PieChart,
  Activity,
  Globe,
  Settings,
  Brain,
  AlertTriangle
} from 'lucide-react';

// Import new advanced components
import { BoardReportGenerator } from './executive/BoardReportGenerator';
import { VoiceCommandCenter } from './executive/VoiceCommandCenter';
import { CrisisManagementCenter } from './executive/CrisisManagementCenter';
import { SecureDocumentVault } from './executive/SecureDocumentVault';
import { ExecutiveCalendar } from './executive/ExecutiveCalendar';
import { CompetitiveIntelligence } from './executive/CompetitiveIntelligence';
import { MultiLocationOverview } from './executive/MultiLocationOverview';

interface ExecutiveProfile {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  company: string;
}

interface ExecutiveMetric {
  id: string;
  title: string;
  titleAr: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface ExecutiveAlert {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
}

export const ExecutiveMobileApp: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const { user, isLoading: authLoading } = useAuthOptional();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<ExecutiveProfile | null>(null);
  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const isArabic = lang === 'ar';

  // Mock data for demonstration
  const mockProfile: ExecutiveProfile = {
    id: '1',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    title: 'Chief Executive Officer',
    titleAr: 'الرئيس التنفيذي',
    company: 'AqlHR Solutions'
  };

  const mockMetrics: ExecutiveMetric[] = [
    {
      id: '1',
      title: 'Revenue Growth',
      titleAr: 'نمو الإيرادات',
      value: '12.5%',
      change: 2.3,
      trend: 'up',
      period: 'Q4 2024'
    },
    {
      id: '2',
      title: 'Employee Satisfaction',
      titleAr: 'رضا الموظفين',
      value: '94%',
      change: 8.1,
      trend: 'up',
      period: 'Last Quarter'
    },
    {
      id: '3',
      title: 'Market Share',
      titleAr: 'الحصة السوقية',
      value: '23.8%',
      change: -1.2,
      trend: 'down',
      period: 'Current'
    },
    {
      id: '4',
      title: 'Compliance Score',
      titleAr: 'نقاط الامتثال',
      value: '98%',
      change: 3.5,
      trend: 'up',
      period: 'Latest'
    }
  ];

  const mockAlerts: ExecutiveAlert[] = [
    {
      id: '1',
      title: 'Government Compliance Update',
      titleAr: 'تحديث الامتثال الحكومي',
      description: 'New MHRSD regulations require immediate attention',
      descriptionAr: 'اللوائح الجديدة لوزارة الموارد البشرية تتطلب اهتماماً فورياً',
      severity: 'critical',
      timestamp: '2024-01-15T10:30:00Z',
      acknowledged: false
    },
    {
      id: '2',
      title: 'Q4 Board Meeting',
      titleAr: 'اجتماع مجلس الإدارة للربع الرابع',
      description: 'Preparation required for quarterly board presentation',
      descriptionAr: 'مطلوب التحضير لعرض مجلس الإدارة الفصلي',
      severity: 'warning',
      timestamp: '2024-01-15T09:15:00Z',
      acknowledged: false
    },
    {
      id: '3',
      title: 'Performance Milestone',
      titleAr: 'إنجاز الأداء',
      description: 'Company exceeded annual revenue targets by 15%',
      descriptionAr: 'تجاوزت الشركة أهداف الإيرادات السنوية بنسبة 15%',
      severity: 'info',
      timestamp: '2024-01-15T08:45:00Z',
      acknowledged: true
    }
  ];

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would fetch real executive data
      setProfile(mockProfile);
      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading executive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (title: string) => {
    if (title.includes('Revenue') || title.includes('إيرادات')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (title.includes('Employee') || title.includes('موظف')) {
      return <Users className="h-4 w-4 text-blue-500" />;
    } else if (title.includes('Market') || title.includes('سوق')) {
      return <Target className="h-4 w-4 text-purple-500" />;
    } else if (title.includes('Compliance') || title.includes('امتثال')) {
      return <Award className="h-4 w-4 text-orange-500" />;
    } else {
      return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-blue-500';
    }
  };

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isArabic) {
      return date.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: BarChart3 },
    { id: 'reports', label: 'Board Reports', labelAr: 'تقارير مجلس الإدارة', icon: FileText },
    { id: 'voice', label: 'Voice Commands', labelAr: 'الأوامر الصوتية', icon: Brain },
    { id: 'crisis', label: 'Crisis Center', labelAr: 'مركز الأزمات', icon: AlertTriangle },
    { id: 'documents', label: 'Secure Vault', labelAr: 'الخزانة الآمنة', icon: Settings },
    { id: 'calendar', label: 'Calendar', labelAr: 'التقويم', icon: Calendar },
    { id: 'intelligence', label: 'Intelligence', labelAr: 'الاستخبارات', icon: Target },
    { id: 'locations', label: 'Locations', labelAr: 'المواقع', icon: Globe }
  ];

  const renderDashboard = () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">
          {isArabic ? 'نظرة عامة' : 'Overview'}
        </TabsTrigger>
        <TabsTrigger value="metrics">
          {isArabic ? 'المؤشرات' : 'Metrics'}
        </TabsTrigger>
        <TabsTrigger value="alerts">
          {isArabic ? 'التنبيهات' : 'Alerts'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        {/* Executive Profile */}
        {profile && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {isArabic ? profile.nameAr : profile.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {isArabic ? profile.titleAr : profile.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.company}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'إجمالي الموظفين' : 'Total Employees'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'النمو الشهري' : 'Monthly Growth'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">+12.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'المشاريع النشطة' : 'Active Projects'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">18</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'معدل الامتثال' : 'Compliance Rate'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? 'الإجراءات السريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isArabic ? 'إنشاء تقرير مجلس الإدارة' : 'Generate Board Report'}
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('voice')}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isArabic ? 'الأوامر الصوتية' : 'Voice Commands'}
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('intelligence')}
            >
              <Target className="h-4 w-4 mr-2" />
              {isArabic ? 'تحليل المنافسين' : 'Competitive Analysis'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="metrics" className="space-y-4 mt-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMetricIcon(metric.title)}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {isArabic ? metric.titleAr : metric.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {metric.period}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4 mt-6">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-current" />
                    <h3 className="font-semibold text-foreground">
                      {isArabic ? alert.titleAr : alert.title}
                    </h3>
                    <Badge variant={alert.acknowledged ? 'default' : 'destructive'}>
                      {alert.acknowledged 
                        ? (isArabic ? 'مقروء' : 'Read') 
                        : (isArabic ? 'جديد' : 'New')
                      }
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isArabic ? alert.descriptionAr : alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <Button size="sm" variant="outline">
                    {isArabic ? 'وضع علامة كمقروء' : 'Mark as Read'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {alerts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isArabic ? 'لا توجد تنبيهات' : 'No Alerts'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? 'جميع التنبيهات محدثة' : 'All alerts are up to date'}
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {isArabic ? 'التطبيق التنفيذي' : 'Executive App'}
            </h1>
            <p className="text-sm opacity-90">
              {isArabic ? 'إدارة تنفيذية متقدمة' : 'Advanced Executive Management'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {isArabic ? 'متصل' : 'Connected'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Navigation Tabs - Scrollable */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 whitespace-nowrap min-w-max"
                >
                  <Icon className="h-4 w-4" />
                  {isArabic ? tab.labelAr : tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'reports' && <BoardReportGenerator />}
          {activeTab === 'voice' && <VoiceCommandCenter />}
          {activeTab === 'crisis' && <CrisisManagementCenter />}
          {activeTab === 'documents' && <SecureDocumentVault />}
          {activeTab === 'calendar' && <ExecutiveCalendar />}
          {activeTab === 'intelligence' && <CompetitiveIntelligence />}
          {activeTab === 'locations' && <MultiLocationOverview />}
        </div>
      </div>
    </div>
  );
};