import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Plus, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/i18n/locale';

interface DashboardAlert {
  severity: string;
  metric: string;
  message_en: string;
  message_ar: string;
  current_value: number;
  delta_30: number | null;
  recommendation_en: string;
  recommendation_ar: string;
}

interface Props {
  alerts: DashboardAlert[];
  onCreateTask: (alert: DashboardAlert) => Promise<any>;
  loading: boolean;
}

export function EnhancedDashboardAlertsPanel({ alerts, onCreateTask, loading }: Props) {
  const { toast } = useToast();
  const { t, locale } = useLocale();
  const isArabic = locale === 'ar';

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Zap className="h-4 w-4" />;
      case 'low': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleCreateTask = async (alert: DashboardAlert) => {
    try {
      await onCreateTask(alert);
      toast({
        title: t('dashboard', 'task_created'),
        description: t('dashboard', 'task_created_success')
      });
    } catch (error: any) {
      toast({
        title: t('dashboard', 'error'),
        description: error.message || t('dashboard', 'failed_to_create_task'),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard', 'issues_alerts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {t('dashboard', 'issues_alerts')}
          {alerts.length > 0 && (
            <Badge variant="secondary">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="font-medium">
              {t('dashboard', 'no_issues_detected')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard', 'all_metrics_acceptable')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          {alert.metric}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">
                        {isArabic ? alert.message_ar : alert.message_en}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? alert.recommendation_ar : alert.recommendation_en}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-lg font-semibold">
                        {alert.current_value.toFixed(1)}
                      </div>
                      {alert.delta_30 !== null && (
                        <div className={`text-sm flex items-center gap-1 ${
                          alert.delta_30 >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {alert.delta_30 >= 0 ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {alert.delta_30.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    {(alert.severity === 'high' || alert.severity === 'medium') && (
                      <Button
                        size="sm"
                        onClick={() => handleCreateTask(alert)}
                        className="h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('dashboard', 'create_task')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}