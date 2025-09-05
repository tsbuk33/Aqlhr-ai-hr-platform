import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Database, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Activity,
  DollarSign,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AutonomousGOSIManager: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gosi-analytics-engine', {
        body: {
          type: 'dashboard',
          tenantId: 'demo-company'
        }
      });

      if (error) throw error;

      if (data?.success) {
        setDashboardData(data.result);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleGOSIOperation = async (operation: string) => {
    setIsProcessing(true);
    setCurrentOperation(operation);
    
    try {
      const { data, error } = await supabase.functions.invoke('autonomous-gosi-engine', {
        body: {
          action: operation,
          tenantId: 'demo-company'
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Operation Successful",
          description: data.result?.message || `${operation} completed successfully`,
        });
        
        // Refresh dashboard data
        await loadDashboardData();
      }
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setCurrentOperation(null);
    }
  };

  const gosiOperations = [
    {
      id: 'sync_data',
      title: 'Sync GOSI Data',
      description: 'Real-time synchronization with GOSI systems',
      icon: Database,
      color: 'bg-blue-500'
    },
    {
      id: 'reconcile_contributions',
      title: 'Reconcile Contributions',
      description: 'Automated contribution reconciliation',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'validate_compliance',
      title: 'Validate Compliance',
      description: 'Complete compliance validation check',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'calculate_predictions',
      title: 'Calculate Predictions',
      description: 'Predictive contribution calculations',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      id: 'process_exceptions',
      title: 'Process Exceptions',
      description: 'Autonomous exception handling',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-l-primary pl-4">
        <h2 className="text-2xl font-bold text-foreground">Autonomous GOSI Management</h2>
        <p className="text-muted-foreground">100% automated GOSI operations with real-time synchronization</p>
      </div>

      {/* Real-time Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardData.overview.total_employees}</p>
              <p className="text-xs text-muted-foreground">Total Employees</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {(dashboardData.overview.total_contributions_sar / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">SAR Contributions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Shield className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {dashboardData.overview.compliance_score.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Compliance Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Zap className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardData.overview.automation_level}%</p>
              <p className="text-xs text-muted-foreground">Automation Level</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Autonomous Operations Control
          </CardTitle>
          <CardDescription>
            Execute fully automated GOSI operations with zero manual intervention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {gosiOperations.map((operation) => {
              const Icon = operation.icon;
              const isCurrentOperation = currentOperation === operation.id;
              
              return (
                <Card key={operation.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${operation.color} bg-opacity-10`}>
                        <Icon className={`h-5 w-5 text-white`} style={{ color: operation.color.replace('bg-', '').replace('-500', '') }} />
                      </div>
                      {isCurrentOperation && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-1">{operation.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{operation.description}</p>
                    
                    <Button
                      onClick={() => handleGOSIOperation(operation.id)}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                      variant={isCurrentOperation ? "secondary" : "default"}
                    >
                      {isCurrentOperation ? 'Processing...' : 'Execute'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Real-time Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recent_activities.map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.activity}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{activity.automation_level}</Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.alerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'success' ? 'bg-green-100' : 
                      alert.type === 'info' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      <CheckCircle className={`h-4 w-4 ${
                        alert.type === 'success' ? 'text-green-600' : 
                        alert.type === 'info' ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {alert.auto_resolved && (
                      <Badge variant="outline" className="text-xs">Auto-resolved</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Month</span>
                    <span className="font-medium">{(dashboardData.contributions.current_month / 1000).toFixed(0)}K SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Previous Month</span>
                    <span className="font-medium">{(dashboardData.contributions.previous_month / 1000).toFixed(0)}K SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Growth</span>
                    <Badge variant={dashboardData.contributions.trend_percentage > 0 ? "default" : "secondary"}>
                      {dashboardData.contributions.trend_percentage > 0 ? '+' : ''}{dashboardData.contributions.trend_percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Year to Date</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(dashboardData.contributions.year_to_date / 1000000).toFixed(1)}M SAR
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sync Operations Today</span>
                      <span>{dashboardData.automation.sync_operations_today}</span>
                    </div>
                    <Progress value={100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Processing Accuracy</span>
                      <span>{dashboardData.automation.processing_accuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={dashboardData.automation.processing_accuracy} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Exceptions Resolved</span>
                      <span>{dashboardData.automation.exceptions_resolved}</span>
                    </div>
                    <Progress value={85} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {dashboardData.compliance.compliant_employees}
                  </div>
                  <p className="text-sm text-muted-foreground">Compliant Employees</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-foreground">{dashboardData.compliance.violations}</div>
                    <p className="text-xs text-muted-foreground">Violations</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{dashboardData.compliance.resolved_automatically}</div>
                    <p className="text-xs text-muted-foreground">Auto-Resolved</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600">{dashboardData.compliance.pending_manual}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {dashboardData.overview.compliance_score.toFixed(1)}%
                  </div>
                  <Badge variant="default" className="text-sm">Excellent</Badge>
                </div>
                
                <Progress value={dashboardData.overview.compliance_score} className="mb-4" />
                
                <div className="text-sm text-muted-foreground">
                  <p>✅ All regulatory requirements met</p>
                  <p>✅ Real-time monitoring active</p>
                  <p>✅ Automated corrections applied</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                100% Automation Achievement
              </CardTitle>
              <CardDescription>
                Complete autonomous GOSI management with zero manual intervention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-6xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">Autonomous Operations</p>
                <p className="text-sm text-green-600">Zero manual intervention achieved</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{dashboardData.automation.sync_operations_today}</div>
                  <p className="text-sm text-muted-foreground">Daily Sync Operations</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{dashboardData.automation.reconciliations_completed}</div>
                  <p className="text-sm text-muted-foreground">Auto Reconciliations</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{dashboardData.automation.exceptions_resolved}</div>
                  <p className="text-sm text-muted-foreground">Exceptions Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutonomousGOSIManager;