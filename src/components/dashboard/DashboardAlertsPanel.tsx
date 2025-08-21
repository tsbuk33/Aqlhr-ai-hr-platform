import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info, Plus } from "lucide-react";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { useToast } from "@/hooks/use-toast";

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
  const { alerts, loading, createTaskFromAlert } = useDashboardTrends();
  const { toast } = useToast();
  const [creatingTask, setCreatingTask] = useState<string | null>(null);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateTask = async (alert: DashboardAlert) => {
    try {
      setCreatingTask(alert.id);
      await createTaskFromAlert(alert);
      
      toast({
        title: "Task Created",
        description: `Task created for alert: ${alert.title}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setCreatingTask(null);
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
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issues & Alerts
          </CardTitle>
          <CardDescription>
            Rule-driven alerts and actionable insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-md" />
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
          Issues & Alerts
          <Badge variant="outline" className="ml-auto">
            {alerts.length} Total
          </Badge>
        </CardTitle>
        <CardDescription>
          Rule-driven alerts and actionable insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Systems Normal</AlertTitle>
            <AlertDescription>
              No critical issues detected across key performance indicators.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Actionable Alerts */}
            {getActionableAlerts().length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Actionable Issues ({getActionableAlerts().length})
                </h4>
                {getActionableAlerts().map((alert) => (
                  <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 space-y-2">
                        <AlertTitle className="text-sm font-medium">
                          {alert.title}
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          {alert.message}
                        </AlertDescription>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Current: {alert.current_value}</span>
                          <span>Threshold: {alert.threshold_value}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.metric}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateTask(alert)}
                        disabled={creatingTask === alert.id}
                        className="shrink-0"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {creatingTask === alert.id ? 'Creating...' : 'Create Task'}
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Info/Low Alerts */}
            {alerts.filter(a => a.severity === 'Low').map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-medium">
                      {alert.title}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {alert.message}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}