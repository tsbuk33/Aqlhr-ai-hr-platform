import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Database, 
  RefreshCw,
  Download,
  TrendingUp,
  Clock
} from 'lucide-react';

export const UsageAnalyticsDashboard: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [refreshing, setRefreshing] = useState(false);

  const metrics = [
    {
      label: isArabic ? 'المستخدمون النشطون' : 'Active Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: isArabic ? 'الجلسات اليومية' : 'Daily Sessions',
      value: '18,394',
      change: '+8%',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      label: isArabic ? 'استخدام قاعدة البيانات' : 'Database Usage',
      value: '74.2%',
      change: '+2.3%',
      icon: Database,
      color: 'text-orange-600'
    },
    {
      label: isArabic ? 'الوقت المتوسط' : 'Avg Session Time',
      value: '24m',
      change: '+5m',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExport = () => {
    console.log('Exporting usage analytics...');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {isArabic ? 'تحليلات الاستخدام' : 'Usage Analytics'}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{metric.value}</span>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {isArabic ? 'أهم الأنشطة' : 'Top Activities'}
          </div>
          {[
            { name: isArabic ? 'عرض لوحة التحكم' : 'Dashboard View', count: '4,234', percentage: 85 },
            { name: isArabic ? 'إدارة الموظفين' : 'Employee Management', count: '2,891', percentage: 65 },
            { name: isArabic ? 'تقارير الحضور' : 'Attendance Reports', count: '1,567', percentage: 45 }
          ].map((activity, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{activity.name}</span>
                <span className="text-muted-foreground">{activity.count}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${activity.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};