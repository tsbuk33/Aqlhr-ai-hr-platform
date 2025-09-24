import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  HardDrive, 
  BarChart3, 
  RefreshCw,
  Trash2,
  Archive,
  Download,
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const DatabaseManagementInterface: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null);

  const databases = [
    {
      name: isArabic ? 'قاعدة بيانات الموظفين' : 'Employee Database',
      size: '2.4 GB',
      tables: 15,
      records: '847K',
      status: 'healthy',
      lastBackup: isArabic ? 'منذ ساعة' : '1 hour ago',
      growth: '+2.3%'
    },
    {
      name: isArabic ? 'قاعدة بيانات الحضور' : 'Attendance Database', 
      size: '892 MB',
      tables: 8,
      records: '2.1M',
      status: 'healthy',
      lastBackup: isArabic ? 'منذ ٣ ساعات' : '3 hours ago',
      growth: '+5.7%'
    },
    {
      name: isArabic ? 'قاعدة بيانات الرواتب' : 'Payroll Database',
      size: '456 MB',
      tables: 12,
      records: '123K',
      status: 'warning',
      lastBackup: isArabic ? 'منذ يوم' : '1 day ago',
      growth: '+1.2%'
    },
    {
      name: isArabic ? 'قاعدة بيانات النظام' : 'System Database',
      size: '234 MB',
      tables: 25,
      records: '45K',
      status: 'healthy',
      lastBackup: isArabic ? 'منذ ٦ ساعات' : '6 hours ago',
      growth: '+0.8%'
    }
  ];

  const maintenanceTasks = [
    {
      name: isArabic ? 'تحسين الفهارس' : 'Index Optimization',
      description: isArabic ? 'تحسين أداء الاستعلامات' : 'Improve query performance',
      progress: 0,
      status: 'pending'
    },
    {
      name: isArabic ? 'تنظيف السجلات القديمة' : 'Old Records Cleanup',
      description: isArabic ? 'حذف البيانات المنتهية الصلاحية' : 'Remove expired data entries',
      progress: 0,
      status: 'pending'
    },
    {
      name: isArabic ? 'النسخ الاحتياطي التلقائي' : 'Automated Backup',
      description: isArabic ? 'إنشاء نسخة احتياطية شاملة' : 'Create comprehensive backup',
      progress: 0,
      status: 'pending'
    }
  ];

  const systemStats = {
    totalStorage: '4.2 GB',
    usedStorage: '3.1 GB',
    availableStorage: '1.1 GB',
    storageUsage: 74,
    totalQueries: '234K',
    avgResponseTime: '45ms',
    activeConnections: 23,
    maxConnections: 100
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;

    const labels = {
      healthy: isArabic ? 'سليم' : 'Healthy',
      warning: isArabic ? 'تحذير' : 'Warning',
      error: isArabic ? 'خطأ' : 'Error'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleOperation = async (operation: string, dbName?: string) => {
    setOperationInProgress(operation);
    // Simulate operation
    setTimeout(() => setOperationInProgress(null), 3000);
    console.log(`Executing ${operation} ${dbName ? `on ${dbName}` : ''}`);
  };

  const handleBackup = (dbName: string) => {
    handleOperation('backup', dbName);
  };

  const handleOptimize = (dbName: string) => {
    handleOperation('optimize', dbName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {isArabic ? 'واجهة إدارة قاعدة البيانات' : 'Database Management Interface'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {isArabic ? 'استخدام التخزين' : 'Storage Usage'}
              </span>
              <span className="text-xs font-medium">{systemStats.storageUsage}%</span>
            </div>
            <Progress value={systemStats.storageUsage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {systemStats.usedStorage} / {systemStats.totalStorage}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{isArabic ? 'الاستعلامات' : 'Queries'}</span>
              <span className="font-medium">{systemStats.totalQueries}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>{isArabic ? 'زمن الاستجابة' : 'Response Time'}</span>
              <span className="font-medium text-green-600">{systemStats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>{isArabic ? 'الاتصالات' : 'Connections'}</span>
              <span className="font-medium">{systemStats.activeConnections}/{systemStats.maxConnections}</span>
            </div>
          </div>
        </div>

        {/* Database List */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'قواعد البيانات' : 'Databases'}
          </div>
          {databases.slice(0, 3).map((db, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(db.status)}
                  <div>
                    <div className="font-medium text-sm">{db.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? `${db.tables} جداول • ${db.records} سجل` : `${db.tables} tables • ${db.records} records`}
                    </div>
                  </div>
                </div>
                {getStatusBadge(db.status)}
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-2 text-xs text-center">
                <div>
                  <div className="font-medium text-blue-600">{db.size}</div>
                  <div className="text-muted-foreground">{isArabic ? 'الحجم' : 'Size'}</div>
                </div>
                <div>
                  <div className="font-medium">{db.lastBackup}</div>
                  <div className="text-muted-foreground">{isArabic ? 'النسخ الاحتياطي' : 'Backup'}</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">{db.growth}</div>
                  <div className="text-muted-foreground">{isArabic ? 'النمو' : 'Growth'}</div>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-full p-0"
                    onClick={() => handleBackup(db.name)}
                    disabled={operationInProgress === 'backup'}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Maintenance Tasks */}
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'مهام الصيانة' : 'Maintenance Tasks'}
          </div>
          {maintenanceTasks.map((task, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-sm">{task.name}</div>
                  <div className="text-xs text-muted-foreground">{task.description}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOperation(task.name)}
                  disabled={operationInProgress !== null}
                >
                  <RefreshCw className={`h-3 w-3 ${operationInProgress === task.name ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOperation('full-backup')}
            disabled={operationInProgress !== null}
          >
            <Archive className="h-3 w-3 mr-1" />
            {isArabic ? 'نسخ احتياطي شامل' : 'Full Backup'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOperation('optimize-all')}
            disabled={operationInProgress !== null}
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            {isArabic ? 'تحسين شامل' : 'Optimize All'}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {isArabic ? 'إشعار أمني' : 'Security Notice'}
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {isArabic 
              ? 'جميع العمليات محمية بتشفير AES-256 ومسجلة للمراجعة'
              : 'All operations are protected with AES-256 encryption and logged for audit'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};