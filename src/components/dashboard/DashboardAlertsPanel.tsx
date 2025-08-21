import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, Plus } from 'lucide-react';
import { useDashboardAlerts } from '@/hooks/useDashboardAlerts';
import { useToast } from '@/hooks/use-toast';
import { useAPITranslations } from '@/hooks/useAPITranslations';

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

export function DashboardAlertsPanel() {
  const { alerts, loading, createTaskFromAlert } = useDashboardAlerts();
  const { toast } = useToast();
  const { t } = useAPITranslations();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const handleCreateTask = async (alert: DashboardAlert) => {
    try {
      await createTaskFromAlert(alert);
      toast({
        title: t('dashboard.alerts.task_created'),
        description: `Task created for: ${alert.title}`,
      });
    } catch (error) {
      toast({
        title: t('dashboard.alerts.task_creation_failed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const getActionableAlerts = () => {
    return alerts.filter(alert => 
      alert.severity === 'High' || alert.severity === 'Medium'
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const actionableAlerts = getActionableAlerts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {t('dashboard.alerts.title')}
        </CardTitle>
        <CardDescription>
          System notifications and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-700 mb-2">{t('dashboard.alerts.no_alerts')}</h3>
            <p className="text-muted-foreground">
              {t('dashboard.alerts.no_alerts_message')}
            </p>
          </div>
        )}

        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {t(`dashboard.alerts.severity.${alert.severity}`)}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Current: {alert.current_value}</span>
                    <span>Threshold: {alert.threshold_value}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.metric}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {actionableAlerts.includes(alert) && (
                <Button 
                  size="sm" 
                  onClick={() => handleCreateTask(alert)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {t('dashboard.alerts.create_task')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}