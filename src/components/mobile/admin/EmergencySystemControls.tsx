import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Power, 
  Lock,
  Unlock,
  RefreshCw,
  Phone,
  Mail,
  Users,
  Database,
  Wifi,
  HardDrive
} from 'lucide-react';

export const EmergencySystemControls: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [systemLocked, setSystemLocked] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const systemStatus = {
    overall: 'normal',
    database: 'operational',
    network: 'stable',
    storage: 'normal',
    users: 'active',
    lastCheck: isArabic ? 'منذ ثانية' : '1s ago'
  };

  const emergencyContacts = [
    {
      role: isArabic ? 'مدير النظام الرئيسي' : 'Lead System Admin',
      name: 'أحمد محمد علي',
      phone: '+966 50 123 4567',
      email: 'admin@company.com',
      status: 'available'
    },
    {
      role: isArabic ? 'مهندس قاعدة البيانات' : 'Database Engineer',
      name: 'سارة أحمد محمود',
      phone: '+966 50 765 4321',
      email: 'db@company.com',
      status: 'on-call'
    },
    {
      role: isArabic ? 'أمن المعلومات' : 'Security Specialist',
      name: 'محمد حسن سالم',
      phone: '+966 50 987 6543',
      email: 'security@company.com',
      status: 'available'
    }
  ];

  const emergencyActions = [
    {
      id: 'system-lock',
      name: isArabic ? 'قفل النظام الكامل' : 'Full System Lock',
      description: isArabic ? 'منع جميع المستخدمين من الدخول' : 'Prevent all user access',
      severity: 'critical',
      icon: Lock
    },
    {
      id: 'emergency-backup',
      name: isArabic ? 'نسخ احتياطي طارئ' : 'Emergency Backup',
      description: isArabic ? 'إنشاء نسخة احتياطية فورية' : 'Create immediate backup',
      severity: 'high',
      icon: HardDrive
    },
    {
      id: 'network-isolation',
      name: isArabic ? 'عزل الشبكة' : 'Network Isolation',
      description: isArabic ? 'قطع الاتصالات الخارجية' : 'Cut external connections',
      severity: 'critical',
      icon: Wifi
    },
    {
      id: 'safe-mode',
      name: isArabic ? 'الوضع الآمن' : 'Safe Mode',
      description: isArabic ? 'تشغيل الخدمات الأساسية فقط' : 'Run essential services only',
      severity: 'moderate',
      icon: Shield
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'stable':
      case 'normal':
      case 'active':
        return <span className="h-2 w-2 bg-green-500 rounded-full inline-block" />;
      case 'warning':
        return <span className="h-2 w-2 bg-orange-500 rounded-full inline-block" />;
      case 'error':
        return <span className="h-2 w-2 bg-red-500 rounded-full inline-block" />;
      default:
        return <span className="h-2 w-2 bg-gray-500 rounded-full inline-block" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 border-red-300';
      case 'high': return 'text-orange-600 border-orange-300';
      case 'moderate': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getContactStatus = (status: string) => {
    const variants = {
      available: 'default',
      'on-call': 'secondary',
      busy: 'destructive'
    } as const;

    const labels = {
      available: isArabic ? 'متاح' : 'Available',
      'on-call': isArabic ? 'مناوبة' : 'On-Call',
      busy: isArabic ? 'مشغول' : 'Busy'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleEmergencyAction = async (actionId: string) => {
    setExecutingAction(actionId);
    
    // Simulate action execution
    setTimeout(() => {
      if (actionId === 'system-lock') {
        setSystemLocked(!systemLocked);
      } else if (actionId === 'safe-mode') {
        setEmergencyMode(!emergencyMode);
      }
      setExecutingAction(null);
    }, 3000);
    
    console.log(`Executing emergency action: ${actionId}`);
  };

  const handleContactEmergency = (contact: any, method: 'phone' | 'email') => {
    if (method === 'phone') {
      console.log(`Calling ${contact.phone}`);
    } else {
      console.log(`Emailing ${contact.email}`);
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader className="bg-red-50 dark:bg-red-950/20">
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-5 w-5" />
          {isArabic ? 'أدوات التحكم في حالات الطوارئ' : 'Emergency System Controls'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* System Status Overview */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-3">
            {isArabic ? 'حالة النظام' : 'System Status'}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span>{isArabic ? 'قاعدة البيانات' : 'Database'}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.database)}
                <span className="text-xs text-muted-foreground">
                  {systemStatus.database}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{isArabic ? 'الشبكة' : 'Network'}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.network)}
                <span className="text-xs text-muted-foreground">
                  {systemStatus.network}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{isArabic ? 'التخزين' : 'Storage'}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.storage)}
                <span className="text-xs text-muted-foreground">
                  {systemStatus.storage}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{isArabic ? 'المستخدمون' : 'Users'}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.users)}
                <span className="text-xs text-muted-foreground">
                  {systemStatus.users}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {isArabic ? `آخر فحص: ${systemStatus.lastCheck}` : `Last check: ${systemStatus.lastCheck}`}
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'إجراءات الطوارئ' : 'Emergency Actions'}
          </div>
          {emergencyActions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className={`p-3 border rounded-lg ${getSeverityColor(action.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">{action.name}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </div>
                <Button
                  variant={action.severity === 'critical' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleEmergencyAction(action.id)}
                  disabled={executingAction !== null}
                  className="w-full"
                >
                  {executingAction === action.id ? (
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Icon className="h-3 w-3 mr-2" />
                  )}
                  {executingAction === action.id 
                    ? (isArabic ? 'جاري التنفيذ...' : 'Executing...') 
                    : (isArabic ? 'تنفيذ' : 'Execute')
                  }
                </Button>
              </div>
            );
          })}
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'جهات الاتصال الطارئة' : 'Emergency Contacts'}
          </div>
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-sm">{contact.role}</div>
                  <div className="text-xs text-muted-foreground">{contact.name}</div>
                </div>
                {getContactStatus(contact.status)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactEmergency(contact, 'phone')}
                  className="flex-1"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {isArabic ? 'اتصال' : 'Call'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactEmergency(contact, 'email')}
                  className="flex-1"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  {isArabic ? 'بريد' : 'Email'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* System Mode Indicators */}
        {(systemLocked || emergencyMode) && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {isArabic ? 'النظام في وضع الطوارئ' : 'System in Emergency Mode'}
              </span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">
              {systemLocked && (isArabic ? '• النظام مقفل' : '• System is locked')}
              {emergencyMode && (isArabic ? '• الوضع الآمن مفعل' : '• Safe mode is active')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};