import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock, 
  UserCheck,
  Database,
  RefreshCw
} from 'lucide-react';

export const SecurityAuditInterface: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [scanning, setScanning] = useState(false);

  const auditResults = [
    {
      category: isArabic ? 'المصادقة' : 'Authentication',
      status: 'good',
      issues: 0,
      recommendations: 2,
      icon: UserCheck
    },
    {
      category: isArabic ? 'تشفير البيانات' : 'Data Encryption',
      status: 'good',
      issues: 0,
      recommendations: 1,
      icon: Lock
    },
    {
      category: isArabic ? 'صلاحيات الوصول' : 'Access Permissions',
      status: 'warning',
      issues: 3,
      recommendations: 5,
      icon: Shield
    },
    {
      category: isArabic ? 'أمن قاعدة البيانات' : 'Database Security',
      status: 'critical',
      issues: 7,
      recommendations: 12,
      icon: Database
    }
  ];

  const recentActivity = [
    {
      action: isArabic ? 'محاولة دخول فاشلة' : 'Failed login attempt',
      user: 'ahmed.salem@company.com',
      time: isArabic ? 'منذ ٥ دقائق' : '5 minutes ago',
      severity: 'medium'
    },
    {
      action: isArabic ? 'تغيير كلمة مرور' : 'Password changed',
      user: 'sarah.ahmed@company.com',
      time: isArabic ? 'منذ ١٠ دقائق' : '10 minutes ago',
      severity: 'low'
    },
    {
      action: isArabic ? 'وصول من IP جديد' : 'Access from new IP',
      user: 'mohamed.ali@company.com',
      time: isArabic ? 'منذ ١٥ دقيقة' : '15 minutes ago',
      severity: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive'
    } as const;

    const labels = {
      low: isArabic ? 'منخفض' : 'Low',
      medium: isArabic ? 'متوسط' : 'Medium',
      high: isArabic ? 'عالي' : 'High'
    };

    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'secondary'} className="text-xs">
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const handleScan = async () => {
    setScanning(true);
    // Simulate security scan
    setTimeout(() => setScanning(false), 5000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isArabic ? 'مراجعة الأمان' : 'Security Audit'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleScan}
            disabled={scanning}
          >
            <RefreshCw className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Overview */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'نظرة عامة على الأمان' : 'Security Overview'}
          </div>
          {auditResults.map((result, index) => {
            const Icon = result.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${getStatusColor(result.status)}`} />
                  <div>
                    <div className="font-medium text-sm">{result.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {result.issues > 0 
                        ? (isArabic ? `${result.issues} مشكلة` : `${result.issues} issues`)
                        : (isArabic ? 'لا توجد مشاكل' : 'No issues')
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.status === 'good' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                  {result.status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Security Events */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'الأحداث الأمنية الأخيرة' : 'Recent Security Events'}
          </div>
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.user}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
              <div className="flex items-center gap-2">
                {getSeverityBadge(activity.severity)}
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-3 w-3 mr-1" />
            {isArabic ? 'فحص شامل' : 'Full Scan'}
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            {isArabic ? 'سجل الأمان' : 'Security Log'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};