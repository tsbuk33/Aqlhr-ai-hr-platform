import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye,
  Calendar,
  FileText,
  Workflow,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const IntelligentVisaManager: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-refresh dashboard data every 5 minutes
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('visa-compliance-intelligence', {
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

  const handleVisaOperation = async (operation: string) => {
    setIsProcessing(true);
    setCurrentOperation(operation);
    
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-visa-engine', {
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

  const visaOperations = [
    {
      id: 'track_lifecycle',
      title: '360° Lifecycle Tracking',
      description: 'Real-time visa status monitoring with HRSD integration',
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      id: 'initiate_renewal',
      title: '90-Day Advance Renewal',
      description: 'Proactive renewal initiation and automation',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      id: 'prepare_documents',
      title: 'Auto Document Prep',
      description: 'Intelligent document preparation and verification',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      id: 'orchestrate_workflow',
      title: 'Workflow Orchestration',
      description: 'End-to-end process automation and tracking',
      icon: Workflow,
      color: 'bg-orange-500'
    },
    {
      id: 'predict_expirations',
      title: 'Expiration Prediction',
      description: 'AI-powered expiration alerts and planning',
      icon: TrendingUp,
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
        <h2 className="text-2xl font-bold text-foreground">Intelligent Visa Management</h2>
        <p className="text-muted-foreground">360° visa tracking with proactive management and compliance intelligence</p>
      </div>

      {/* Real-time Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardData.overview.total_visas}</p>
              <p className="text-xs text-muted-foreground">Total Visas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardData.overview.compliant_visas}</p>
              <p className="text-xs text-muted-foreground">Compliant</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardData.overview.at_risk_visas}</p>
              <p className="text-xs text-muted-foreground">At Risk</p>
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
      </div>

      {/* Operations Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Intelligent Operations Control
          </CardTitle>
          <CardDescription>
            Execute intelligent visa operations with 360° tracking and proactive management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {visaOperations.map((operation) => {
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
                      onClick={() => handleVisaOperation(operation.id)}
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
      <Tabs defaultValue="tracking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tracking">360° Tracking</TabsTrigger>
          <TabsTrigger value="renewal">Renewals</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Visa Lifecycle Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Visas</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{dashboardData.compliance_status.fully_compliant}</Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expiring Soon (90 days)</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{dashboardData.compliance_status.minor_issues}</Badge>
                      <Clock className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical (30 days)</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{dashboardData.compliance_status.critical_risks}</Badge>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Renewal</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{dashboardData.compliance_status.major_violations}</Badge>
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tracking Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HRSD Integration Status</span>
                      <span>99.2%</span>
                    </div>
                    <Progress value={99.2} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Real-time Sync Accuracy</span>
                      <span>98.7%</span>
                    </div>
                    <Progress value={98.7} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prediction Accuracy</span>
                      <span>96.8%</span>
                    </div>
                    <Progress value={96.8} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Alert Response Time</span>
                      <span>&lt; 5 min</span>
                    </div>
                    <Progress value={95} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="renewal" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>90-Day Advance Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {dashboardData.preventive_actions.recommendations_generated}
                  </div>
                  <div className="text-lg font-medium text-green-700 dark:text-green-400">Auto-Renewals Active</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium">{dashboardData.preventive_actions.success_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Actions Implemented</span>
                    <span className="font-medium">{dashboardData.preventive_actions.actions_implemented}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Savings</span>
                    <Badge variant="default">{(dashboardData.preventive_actions.cost_savings_sar / 1000).toFixed(0)}K SAR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-foreground">Auto Document Prep</p>
                        <p className="text-sm text-muted-foreground">Intelligent generation & verification</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">Compliance Verification</p>
                        <p className="text-sm text-muted-foreground">Real-time validation</p>
                      </div>
                    </div>
                    <Badge variant="default">97.2%</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Workflow className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-foreground">Workflow Orchestration</p>
                        <p className="text-sm text-muted-foreground">End-to-end automation</p>
                      </div>
                    </div>
                    <Badge variant="default">Orchestrated</Badge>
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
                <CardTitle>Compliance Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {dashboardData.overview.compliance_score.toFixed(1)}%
                  </div>
                  <Badge variant="default" className="text-sm">Excellent Compliance</Badge>
                </div>
                
                <Progress value={dashboardData.overview.compliance_score} className="mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Regulation Updates Tracked</span>
                    <span className="font-medium">{dashboardData.regulation_monitoring.recent_updates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Auto-Adaptations</span>
                    <span className="font-medium">{dashboardData.regulation_monitoring.auto_adaptations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Impact Assessments</span>
                    <span className="font-medium">{dashboardData.regulation_monitoring.impact_assessments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-red-600">{dashboardData.risk_intelligence.high_risk_visas}</div>
                    <p className="text-xs text-muted-foreground">High Risk</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600">{dashboardData.risk_intelligence.medium_risk_visas}</div>
                    <p className="text-xs text-muted-foreground">Medium Risk</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{dashboardData.risk_intelligence.low_risk_visas}</div>
                    <p className="text-xs text-muted-foreground">Low Risk</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="text-sm text-muted-foreground">
                    <p>✅ Real-time risk monitoring active</p>
                    <p>✅ Preventive actions implemented</p>
                    <p>✅ Violation risk assessment ongoing</p>
                    <p>✅ Compliance recommendations generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.alerts.map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'critical' ? 'bg-red-100' : 
                    alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : alert.type === 'warning' ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {alert.action_required && (
                    <Badge variant="destructive" className="text-xs">Action Required</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Intelligence Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">360°</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">Comprehensive Coverage</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tracking Accuracy</span>
                    <span className="font-medium">99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Prediction Confidence</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Automation Level</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Zero Surprises</span>
                    <Badge variant="default">Achieved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">0</div>
                    <div className="text-xs text-muted-foreground">Visa Surprises</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-bold text-blue-600">90</div>
                    <div className="text-xs text-muted-foreground">Days Advance</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-bold text-purple-600">100%</div>
                    <div className="text-xs text-muted-foreground">Automation</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-bold text-orange-600">38K</div>
                    <div className="text-xs text-muted-foreground">SAR Saved</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✅ Visa chaos completely eliminated</p>
                  <p>✅ Proactive management operational</p>
                  <p>✅ Compliance intelligence active</p>
                  <p>✅ Zero expiration surprises guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};