import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  metric: string;
  current_value: number;
  threshold_value: number;
  created_at: string;
}

interface IssuesCardProps {
  alerts: DashboardAlert[];
  isArabic?: boolean;
}

export const IssuesCard: React.FC<IssuesCardProps> = ({ alerts, isArabic = false }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-status-danger/10 text-status-danger border-status-danger';
      case 'Medium': return 'bg-status-warning/10 text-status-warning border-status-warning';
      case 'Low': return 'bg-status-success/10 text-status-success border-status-success';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High': return AlertTriangle;
      case 'Medium': return AlertCircle;
      case 'Low': return CheckCircle;
      default: return Info;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return isArabic ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return isArabic ? `منذ ${Math.floor(diffInMinutes / 60)} ساعة` : `${Math.floor(diffInMinutes / 60)}h ago`;
    return isArabic ? `منذ ${Math.floor(diffInMinutes / 1440)} يوم` : `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const highAlerts = alerts.filter(a => a.severity === 'High');
  const mediumAlerts = alerts.filter(a => a.severity === 'Medium');
  const lowAlerts = alerts.filter(a => a.severity === 'Low');

  return (
    <Card className="bg-gradient-to-br from-surface to-surface-subtle border-border-subtle">
      <CardHeader className={`flex flex-row items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 rounded-lg bg-status-warning/10">
            <AlertTriangle className="h-5 w-5 text-status-warning" />
          </div>
          <div>
            <CardTitle className={`text-lg font-semibold text-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic ? 'تنبيهات النظام' : 'System Issues'}
            </CardTitle>
            <p className={`text-sm text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic ? 'المسائل المطلوبة للمراجعة' : 'Issues requiring attention'}
            </p>
          </div>
        </div>
        
        {/* Summary badges */}
        <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {highAlerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highAlerts.length} {isArabic ? 'عالي' : 'High'}
            </Badge>
          )}
          {mediumAlerts.length > 0 && (
            <Badge variant="secondary" className="text-xs bg-status-warning/10 text-status-warning">
              {mediumAlerts.length} {isArabic ? 'متوسط' : 'Med'}
            </Badge>
          )}
          {lowAlerts.length > 0 && (
            <Badge variant="outline" className="text-xs text-status-success">
              {lowAlerts.length} {isArabic ? 'منخفض' : 'Low'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className={`text-center py-8 text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-status-success" />
              <p className="text-sm">
                {isArabic ? 'لا توجد تنبيهات في الوقت الحالي' : 'No issues detected'}
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const Icon = getSeverityIcon(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center justify-between gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <h4 className={`text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}>
                          {alert.title}
                        </h4>
                        <span className="text-xs text-foreground-subtle">
                          {formatTimeAgo(alert.created_at)}
                        </span>
                      </div>
                      <p className={`text-xs text-foreground-muted mt-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                        {alert.message}
                      </p>
                      {alert.metric !== 'overall' && (
                        <div className={`flex items-center gap-2 mt-2 text-xs ${isArabic ? 'flex-row-reverse' : ''}`}>
                          <span className="text-foreground-subtle">
                            {isArabic ? 'القيمة الحالية:' : 'Current:'}
                          </span>
                          <span className="font-mono">
                            {alert.current_value.toFixed(1)}
                          </span>
                          <span className="text-foreground-subtle">
                            {isArabic ? 'العتبة:' : 'Threshold:'}
                          </span>
                          <span className="font-mono">
                            {alert.threshold_value.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};