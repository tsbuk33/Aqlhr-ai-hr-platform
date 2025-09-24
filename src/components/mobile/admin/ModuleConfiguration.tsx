import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Power,
  Wrench,
  Eye
} from 'lucide-react';

export const ModuleConfiguration: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [modules, setModules] = useState([
    {
      id: 'hr-core',
      name: isArabic ? 'الموارد البشرية الأساسية' : 'HR Core',
      description: isArabic ? 'إدارة الموظفين والرواتب' : 'Employee and payroll management',
      version: '2.4.1',
      status: 'active',
      enabled: true,
      users: 1247,
      lastUpdate: isArabic ? 'منذ يوم' : '1 day ago'
    },
    {
      id: 'government-integration',
      name: isArabic ? 'التكامل الحكومي' : 'Government Integration',
      description: isArabic ? 'ربط مع الأنظمة الحكومية' : 'Connect with government systems',
      version: '1.8.3',
      status: 'active',
      enabled: true,
      users: 456,
      lastUpdate: isArabic ? 'منذ ساعة' : '1 hour ago'
    },
    {
      id: 'analytics-suite',
      name: isArabic ? 'مجموعة التحليلات' : 'Analytics Suite',
      description: isArabic ? 'تقارير وتحليلات متقدمة' : 'Advanced reporting and analytics',
      version: '3.1.0',
      status: 'warning',
      enabled: true,
      users: 89,
      lastUpdate: isArabic ? 'منذ ٣ أيام' : '3 days ago'
    },
    {
      id: 'mobile-app',
      name: isArabic ? 'التطبيق المحمول' : 'Mobile App',
      description: isArabic ? 'تطبيق الجوال للموظفين' : 'Employee mobile application',
      version: '1.5.2',
      status: 'maintenance',
      enabled: false,
      users: 234,
      lastUpdate: isArabic ? 'منذ أسبوع' : '1 week ago'
    },
    {
      id: 'ai-assistant',
      name: isArabic ? 'المساعد الذكي' : 'AI Assistant',
      description: isArabic ? 'ذكاء اصطناعي للموارد البشرية' : 'AI-powered HR assistant',
      version: '0.9.1-beta',
      status: 'beta',
      enabled: true,
      users: 67,
      lastUpdate: isArabic ? 'منذ ساعتين' : '2 hours ago'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'beta':
        return <Package className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      warning: 'secondary',
      maintenance: 'outline',
      beta: 'secondary'
    } as const;

    const labels = {
      active: isArabic ? 'نشط' : 'Active',
      warning: isArabic ? 'تحذير' : 'Warning',
      maintenance: isArabic ? 'صيانة' : 'Maintenance',
      beta: isArabic ? 'تجريبي' : 'Beta'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, enabled: !module.enabled }
        : module
    ));
  };

  const handleConfigure = (moduleId: string) => {
    console.log(`Configuring module: ${moduleId}`);
  };

  const handleViewDetails = (moduleId: string) => {
    console.log(`Viewing details for module: ${moduleId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {isArabic ? 'إعداد الوحدات' : 'Module Configuration'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="p-4 bg-muted/50 rounded-lg">
            {/* Module Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(module.status)}
                <div>
                  <div className="font-medium">{module.name}</div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(module.status)}
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.id)}
                  disabled={module.status === 'maintenance'}
                />
              </div>
            </div>

            {/* Module Stats */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-center">
              <div>
                <div className="text-sm font-medium">{module.version}</div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'الإصدار' : 'Version'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">{module.users.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'مستخدمين' : 'Users'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{module.lastUpdate}</div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'آخر تحديث' : 'Last Update'}
                </div>
              </div>
            </div>

            {/* Module Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigure(module.id)}
                disabled={!module.enabled || module.status === 'maintenance'}
                className="flex-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                {isArabic ? 'إعداد' : 'Configure'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(module.id)}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                {isArabic ? 'تفاصيل' : 'Details'}
              </Button>
            </div>

            {/* Module Status Messages */}
            {module.status === 'warning' && (
              <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/20 rounded text-xs text-orange-700 dark:text-orange-300">
                {isArabic ? 'يتطلب هذا الوحدة تحديث' : 'This module requires an update'}
              </div>
            )}
            {module.status === 'maintenance' && (
              <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                {isArabic ? 'الوحدة قيد الصيانة حالياً' : 'Module is currently under maintenance'}
              </div>
            )}
            {module.status === 'beta' && (
              <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/20 rounded text-xs text-purple-700 dark:text-purple-300">
                {isArabic ? 'هذه نسخة تجريبية - استخدم بحذر' : 'This is a beta version - use with caution'}
              </div>
            )}
          </div>
        ))}

        {/* System Overview */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Power className="h-4 w-4 text-green-600" />
                <span className="text-lg font-semibold text-green-600">
                  {modules.filter(m => m.enabled).length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'وحدات نشطة' : 'Active Modules'}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-lg font-semibold text-orange-600">
                  {modules.filter(m => m.status === 'warning' || m.status === 'maintenance').length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'تحتاج انتباه' : 'Need Attention'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};