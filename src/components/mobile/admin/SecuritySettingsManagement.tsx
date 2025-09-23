import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Fingerprint,
  Smartphone,
  Wifi,
  Database,
  Users
} from 'lucide-react';

interface SecurityPolicy {
  id: string;
  name: string;
  nameAr: string;
  enabled: boolean;
  severity: 'high' | 'medium' | 'low';
  description: string;
  descriptionAr: string;
}

interface SecurityMetric {
  name: string;
  nameAr: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  icon: any;
}

export const SecuritySettingsManagement: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: 'password_policy',
      name: 'Strong Password Policy',
      nameAr: 'سياسة كلمة المرور القوية',
      enabled: true,
      severity: 'high',
      description: 'Enforce complex password requirements',
      descriptionAr: 'فرض متطلبات كلمة مرور معقدة'
    },
    {
      id: 'two_factor_auth',
      name: 'Two-Factor Authentication',
      nameAr: 'المصادقة الثنائية',
      enabled: true,
      severity: 'high',
      description: 'Require 2FA for admin accounts',
      descriptionAr: 'طلب المصادقة الثنائية للحسابات الإدارية'
    },
    {
      id: 'session_timeout',
      name: 'Automatic Session Timeout',
      nameAr: 'انتهاء الجلسة التلقائي',
      enabled: true,
      severity: 'medium',
      description: 'Auto-logout after inactivity',
      descriptionAr: 'تسجيل خروج تلقائي بعد عدم النشاط'
    },
    {
      id: 'ip_whitelist',
      name: 'IP Address Whitelist',
      nameAr: 'القائمة البيضاء لعناوين IP',
      enabled: false,
      severity: 'medium',
      description: 'Restrict access by IP address',
      descriptionAr: 'تقييد الوصول حسب عنوان IP'
    },
    {
      id: 'audit_logging',
      name: 'Comprehensive Audit Logging',
      nameAr: 'تسجيل المراجعة الشامل',
      enabled: true,
      severity: 'high',
      description: 'Log all security events',
      descriptionAr: 'تسجيل جميع الأحداث الأمنية'
    },
    {
      id: 'encryption_at_rest',
      name: 'Data Encryption at Rest',
      nameAr: 'تشفير البيانات المخزنة',
      enabled: true,
      severity: 'high',
      description: 'Encrypt sensitive data in database',
      descriptionAr: 'تشفير البيانات الحساسة في قاعدة البيانات'
    }
  ]);

  const [securityMetrics] = useState<SecurityMetric[]>([
    {
      name: 'Overall Security Score',
      nameAr: 'النتيجة الأمنية الإجمالية',
      value: 87,
      status: 'good',
      icon: Shield
    },
    {
      name: 'Active Sessions',
      nameAr: 'الجلسات النشطة',
      value: 1247,
      status: 'good',
      icon: Users
    },
    {
      name: 'Failed Login Attempts',
      nameAr: 'محاولات تسجيل الدخول الفاشلة',
      value: 23,
      status: 'warning',
      icon: Lock
    },
    {
      name: 'Suspicious Activities',
      nameAr: 'الأنشطة المشبوهة',
      value: 5,
      status: 'critical',
      icon: AlertTriangle
    }
  ]);

  const [authSettings, setAuthSettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    requireMFA: true,
    allowBiometric: true
  });

  const togglePolicy = (policyId: string) => {
    setSecurityPolicies(prev => prev.map(policy => 
      policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {isArabic ? 'إدارة إعدادات الأمان' : 'Security Settings Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Security Score */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
            <div className="text-sm text-muted-foreground mb-3">
              {isArabic ? 'النتيجة الأمنية الإجمالية' : 'Overall Security Score'}
            </div>
            <Progress value={87} className="h-2" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-2" />
              {isArabic ? 'تدوير المفاتيح' : 'Rotate Keys'}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {isArabic ? 'مراجعة الأمان' : 'Security Audit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'مقاييس الأمان' : 'Security Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const StatusIcon = getStatusIcon(metric.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        {isArabic ? metric.nameAr : metric.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{metric.value.toLocaleString()}</span>
                    <StatusIcon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'السياسات الأمنية' : 'Security Policies'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityPolicies.map((policy) => (
              <div key={policy.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">
                      {isArabic ? policy.nameAr : policy.name}
                    </h4>
                    <Badge className={getSeverityColor(policy.severity)}>
                      {policy.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? policy.descriptionAr : policy.description}
                  </p>
                </div>
                <Switch
                  checked={policy.enabled}
                  onCheckedChange={() => togglePolicy(policy.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Fingerprint className="h-5 w-5 text-primary" />
            {isArabic ? 'إعدادات المصادقة' : 'Authentication Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isArabic ? 'الحد الأدنى لطول كلمة المرور' : 'Minimum Password Length'}
              </label>
              <Input
                type="number"
                value={authSettings.passwordMinLength}
                onChange={(e) => setAuthSettings(prev => ({ 
                  ...prev, 
                  passwordMinLength: parseInt(e.target.value) 
                }))}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isArabic ? 'مهلة انتهاء الجلسة (دقائق)' : 'Session Timeout (minutes)'}
              </label>
              <Input
                type="number"
                value={authSettings.sessionTimeoutMinutes}
                onChange={(e) => setAuthSettings(prev => ({ 
                  ...prev, 
                  sessionTimeoutMinutes: parseInt(e.target.value) 
                }))}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isArabic ? 'الحد الأقصى لمحاولات تسجيل الدخول' : 'Max Login Attempts'}
              </label>
              <Input
                type="number"
                value={authSettings.maxLoginAttempts}
                onChange={(e) => setAuthSettings(prev => ({ 
                  ...prev, 
                  maxLoginAttempts: parseInt(e.target.value) 
                }))}
                className="text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {isArabic ? 'طلب أحرف خاصة' : 'Require Special Characters'}
                </span>
                <Switch
                  checked={authSettings.passwordRequireSpecial}
                  onCheckedChange={(checked) => setAuthSettings(prev => ({ 
                    ...prev, 
                    passwordRequireSpecial: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {isArabic ? 'طلب المصادقة متعددة العوامل' : 'Require Multi-Factor Authentication'}
                </span>
                <Switch
                  checked={authSettings.requireMFA}
                  onCheckedChange={(checked) => setAuthSettings(prev => ({ 
                    ...prev, 
                    requireMFA: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {isArabic ? 'السماح بالمصادقة الحيوية' : 'Allow Biometric Authentication'}
                </span>
                <Switch
                  checked={authSettings.allowBiometric}
                  onCheckedChange={(checked) => setAuthSettings(prev => ({ 
                    ...prev, 
                    allowBiometric: checked 
                  }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};