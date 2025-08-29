import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Users, Clock, TrendingUp, 
  Zap, Eye, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Pause
} from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const RealtimeAnalyticsPage = () => {
  const { isArabic } = useSimpleLanguage();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    document.title = isArabic ? 'التحليلات الفورية - عقل' : 'Real-time Analytics - AqlHR';
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isArabic]);

  const liveMetrics = [
    {
      title: isArabic ? 'الموظفين المتصلين حالياً' : 'Currently Online Employees',
      value: '1,247',
      total: '1,890',
      percentage: 66,
      status: 'active',
      icon: Users,
      trend: '+23',
      description: isArabic ? 'منذ الساعة الماضية' : 'since last hour'
    },
    {
      title: isArabic ? 'الطلبات قيد المعالجة' : 'Requests Being Processed',
      value: '34',
      status: 'processing',
      icon: RefreshCw,
      trend: '-5',
      description: isArabic ? 'انخفاض عن الساعة الماضية' : 'decrease from last hour'
    },
    {
      title: isArabic ? 'متوسط وقت الاستجابة' : 'Average Response Time',
      value: '2.3',
      unit: isArabic ? 'ثانية' : 'seconds',
      status: 'excellent',
      icon: Zap,
      trend: '-0.8',
      description: isArabic ? 'تحسن في الأداء' : 'performance improvement'
    },
    {
      title: isArabic ? 'المعاملات المكتملة اليوم' : 'Completed Transactions Today',
      value: '892',
      target: '1,000',
      percentage: 89,
      status: 'good',
      icon: CheckCircle,
      trend: '+67',
      description: isArabic ? 'أكثر من أمس' : 'more than yesterday'
    }
  ];

  const systemHealth = [
    {
      component: isArabic ? 'خادم قاعدة البيانات' : 'Database Server',
      status: 'healthy',
      responseTime: '12ms',
      uptime: '99.9%'
    },
    {
      component: isArabic ? 'خدمة المصادقة' : 'Authentication Service',
      status: 'healthy',
      responseTime: '45ms',
      uptime: '100%'
    },
    {
      component: isArabic ? 'محرك التحليلات' : 'Analytics Engine',
      status: 'warning',
      responseTime: '156ms',
      uptime: '98.7%'
    },
    {
      component: isArabic ? 'تكامل الأنظمة الخارجية' : 'External Systems Integration',
      status: 'healthy',
      responseTime: '89ms',
      uptime: '99.2%'
    }
  ];

  const recentActivities = [
    {
      time: '14:32',
      user: isArabic ? 'أحمد محمد' : 'Ahmed Mohammed',
      action: isArabic ? 'طلب إجازة سنوية' : 'Annual leave request',
      status: 'pending',
      department: isArabic ? 'تقنية المعلومات' : 'IT'
    },
    {
      time: '14:28',
      user: isArabic ? 'فاطمة العلي' : 'Fatima Al-Ali',
      action: isArabic ? 'تحديث بيانات شخصية' : 'Personal data update',
      status: 'completed',
      department: isArabic ? 'الموارد البشرية' : 'HR'
    },
    {
      time: '14:25',
      user: isArabic ? 'خالد السالم' : 'Khalid Al-Salem',
      action: isArabic ? 'طلب شهادة راتب' : 'Salary certificate request',
      status: 'approved',
      department: isArabic ? 'المالية' : 'Finance'
    },
    {
      time: '14:22',
      user: isArabic ? 'نورا الأحمد' : 'Nora Al-Ahmad',
      action: isArabic ? 'تسجيل دخول إلى النظام' : 'System login',
      status: 'completed',
      department: isArabic ? 'التسويق' : 'Marketing'
    },
    {
      time: '14:18',
      user: isArabic ? 'محمد الغامدي' : 'Mohammed Al-Ghamdi',
      action: isArabic ? 'طلب تدريب' : 'Training request',
      status: 'pending',
      department: isArabic ? 'العمليات' : 'Operations'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'excellent':
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'warning':
      case 'pending':
        return <AlertCircle className="h-3 w-3" />;
      case 'processing':
        return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? '⚡ التحليلات الفورية' : '⚡ Real-time Analytics'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'مراقبة مباشرة لأنشطة وأداء النظام' : 'Live monitoring of system activities and performance'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-3 w-3 mr-1" />
            {isArabic ? 'مباشر' : 'Live'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {isArabic ? 'آخر تحديث:' : 'Last update:'} {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <Badge className={getStatusColor(metric.status)} variant="secondary">
                    {getStatusIcon(metric.status)}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
                  {metric.total && <span className="text-sm text-muted-foreground">/ {metric.total}</span>}
                </div>
                
                {metric.percentage && (
                  <Progress value={metric.percentage} className="h-2 mb-2" />
                )}
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend} {metric.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Health & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? 'صحة النظام' : 'System Health'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'حالة المكونات الرئيسية للنظام' : 'Status of core system components'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    component.status === 'healthy' ? 'bg-green-500' : 
                    component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{component.component}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{component.responseTime}</span>
                  <span className="text-muted-foreground">{component.uptime}</span>
                  <Badge className={getStatusColor(component.status)} variant="secondary">
                    {component.status === 'healthy' ? (isArabic ? 'صحي' : 'Healthy') :
                     component.status === 'warning' ? (isArabic ? 'تحذير' : 'Warning') :
                     (isArabic ? 'خطأ' : 'Error')}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {isArabic ? 'الأنشطة الحديثة' : 'Recent Activities'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'آخر الأنشطة في النظام' : 'Latest system activities'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {activity.time}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.department}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)} variant="secondary">
                      {getStatusIcon(activity.status)}
                      <span className="ml-1">
                        {activity.status === 'completed' ? (isArabic ? 'مكتمل' : 'Complete') :
                         activity.status === 'pending' ? (isArabic ? 'قيد الانتظار' : 'Pending') :
                         activity.status === 'approved' ? (isArabic ? 'موافق عليه' : 'Approved') :
                         activity.status}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Integration for Realtime Analytics */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="realtime-analytics" 
        companyId="demo-company" 
        enabledFeatures={['real-time-insights', 'predictive-analytics', 'data-visualization', 'contextual-help']}
      />
    </div>
  );
};

export default RealtimeAnalyticsPage;