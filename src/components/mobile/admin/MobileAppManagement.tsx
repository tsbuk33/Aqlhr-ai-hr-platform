import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Users, 
  Download, 
  Star,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Bell,
  Shield
} from 'lucide-react';

export const MobileAppManagement: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [refreshing, setRefreshing] = useState(false);

  const appVersions = [
    {
      platform: 'iOS',
      version: '2.4.1',
      status: 'current',
      downloads: '2,847',
      rating: 4.7,
      users: 1234,
      lastUpdate: isArabic ? 'منذ ٣ أيام' : '3 days ago',
      issues: 2
    },
    {
      platform: 'Android',
      version: '2.4.0',
      status: 'needs_update',
      downloads: '4,123',
      rating: 4.5,
      users: 2156,
      lastUpdate: isArabic ? 'منذ أسبوع' : '1 week ago',
      issues: 5
    },
    {
      platform: 'Web PWA',
      version: '2.5.0-beta',
      status: 'beta',
      downloads: '567',
      rating: 4.2,
      users: 345,
      lastUpdate: isArabic ? 'منذ ساعة' : '1 hour ago',
      issues: 8
    }
  ];

  const notifications = [
    {
      title: isArabic ? 'تحديث التطبيق متوفر' : 'App Update Available',
      message: isArabic ? 'إصدار جديد متوفر لنظام أندرويد' : 'New version available for Android',
      severity: 'info',
      time: isArabic ? 'منذ ساعة' : '1 hour ago'
    },
    {
      title: isArabic ? 'مشكلة في المزامنة' : 'Sync Issue Detected',
      message: isArabic ? 'مشكلة في مزامنة بيانات iOS' : 'Data sync issue on iOS platform',
      severity: 'warning',
      time: isArabic ? 'منذ ٣ ساعات' : '3 hours ago'
    },
    {
      title: isArabic ? 'زيادة في التحميلات' : 'Download Spike',
      message: isArabic ? 'زيادة ٤٥٪ في التحميلات اليوم' : '45% increase in downloads today',
      severity: 'success',
      time: isArabic ? 'منذ ٦ ساعات' : '6 hours ago'
    }
  ];

  const appFeatures = [
    {
      name: isArabic ? 'الإشعارات الذكية' : 'Smart Notifications',
      enabled: true,
      users: 89,
      description: isArabic ? 'تنبيهات مخصصة للموظفين' : 'Personalized employee alerts'
    },
    {
      name: isArabic ? 'المصادقة البيومترية' : 'Biometric Auth',
      enabled: true,
      users: 67,
      description: isArabic ? 'دخول آمن ببصمة الإصبع' : 'Secure fingerprint login'
    },
    {
      name: isArabic ? 'الوضع الليلي' : 'Dark Mode',
      enabled: false,
      users: 45,
      description: isArabic ? 'واجهة مظلمة للراحة البصرية' : 'Dark interface for visual comfort'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'needs_update':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'beta':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <Smartphone className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      current: 'default',
      needs_update: 'secondary',
      beta: 'outline'
    } as const;

    const labels = {
      current: isArabic ? 'حديث' : 'Current',
      needs_update: isArabic ? 'يحتاج تحديث' : 'Needs Update',
      beta: isArabic ? 'تجريبي' : 'Beta'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handlePushNotification = () => {
    console.log('Sending push notification...');
  };

  const handleUpdateApp = (platform: string) => {
    console.log(`Updating ${platform} app...`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {isArabic ? 'إدارة التطبيق المحمول' : 'Mobile App Management'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Versions */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'إصدارات التطبيق' : 'App Versions'}
          </div>
          {appVersions.map((app, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(app.status)}
                  <div>
                    <div className="font-medium">{app.platform}</div>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? `الإصدار ${app.version}` : `Version ${app.version}`}
                    </div>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-xs text-center">
                <div>
                  <div className="font-medium text-blue-600">{app.downloads}</div>
                  <div className="text-muted-foreground">{isArabic ? 'تحميلات' : 'Downloads'}</div>
                </div>
                <div>
                  <div className="font-medium text-green-600 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3" />
                    {app.rating}
                  </div>
                  <div className="text-muted-foreground">{isArabic ? 'تقييم' : 'Rating'}</div>
                </div>
                <div>
                  <div className="font-medium">{app.users.toLocaleString()}</div>
                  <div className="text-muted-foreground">{isArabic ? 'مستخدمين' : 'Users'}</div>
                </div>
                <div>
                  <div className={`font-medium ${app.issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {app.issues}
                  </div>
                  <div className="text-muted-foreground">{isArabic ? 'مشاكل' : 'Issues'}</div>
                </div>
              </div>

              {app.status === 'needs_update' && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateApp(app.platform)}
                    className="w-full"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {isArabic ? 'إرسال تحديث' : 'Push Update'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* App Features */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'ميزات التطبيق' : 'App Features'}
          </div>
          {appFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{feature.name}</div>
                <div className="text-xs text-muted-foreground">{feature.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {feature.users}% {isArabic ? 'استخدام' : 'usage'}
                </span>
                <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                  {feature.enabled ? (isArabic ? 'مفعل' : 'Enabled') : (isArabic ? 'معطل' : 'Disabled')}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Notifications */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'الإشعارات الأخيرة' : 'Recent Notifications'}
          </div>
          {notifications.slice(0, 2).map((notification, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.message}</div>
                </div>
                <div className={`text-xs ${getSeverityColor(notification.severity)}`}>
                  {notification.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePushNotification}
          >
            <Bell className="h-3 w-3 mr-1" />
            {isArabic ? 'إرسال إشعار' : 'Push Notification'}
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Settings className="h-3 w-3 mr-1" />
            {isArabic ? 'إعدادات التطبيق' : 'App Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};