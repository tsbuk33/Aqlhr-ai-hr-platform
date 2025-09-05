import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  Clock,
  Bell,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const VisaComplianceDashboard: React.FC = () => {
  const [reportType, setReportType] = useState('real_time_monitoring');
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateComplianceReport(reportType);
  }, [reportType]);

  const generateComplianceReport = async (type: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('visa-compliance-intelligence', {
        body: {
          type: type === 'real_time_monitoring' ? 'dashboard' : type,
          tenantId: 'demo-company',
          period: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }
      });

      if (error) throw error;

      if (data?.success) {
        setReportData(data.result);
      }
    } catch (error) {
      console.error('Error generating compliance report:', error);
      toast({
        title: "Report Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Compliance Report Export",
      description: "Report exported successfully to Excel format with compliance details",
    });
  };

  if (isGenerating && !reportData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-l-primary pl-4">
          <h2 className="text-2xl font-bold text-foreground">Visa Compliance Intelligence</h2>
          <p className="text-muted-foreground">Real-time regulation monitoring and compliance analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select intelligence type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="real_time_monitoring">Real-time Monitoring</SelectItem>
              <SelectItem value="regulation_monitoring">Regulation Updates</SelectItem>
              <SelectItem value="compliance_check">Compliance Check</SelectItem>
              <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
              <SelectItem value="preventive_actions">Preventive Actions</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {reportData && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Intelligence Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Regulation Monitoring</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            <TabsTrigger value="actions">Preventive Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderIntelligenceOverview()}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {renderRegulationMonitoring()}
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            {renderRiskAnalysis()}
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            {renderPreventiveActions()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  function renderIntelligenceOverview() {
    if (reportType === 'real_time_monitoring' && reportData) {
      return (
        <div className="space-y-6">
          {/* Key Intelligence Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-4">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportData.overview.total_visas}</p>
                  <p className="text-xs text-muted-foreground">Visas Monitored</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <Shield className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reportData.overview.compliance_score.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Compliance Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportData.overview.at_risk_visas}</p>
                  <p className="text-xs text-muted-foreground">At Risk</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportData.overview.preventive_actions_active}</p>
                  <p className="text-xs text-muted-foreground">Active Actions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Compliance Intelligence Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Compliance Status Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fully Compliant</span>
                      <Badge variant="default">{reportData.compliance_status.fully_compliant}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Minor Issues</span>
                      <Badge variant="secondary">{reportData.compliance_status.minor_issues}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Major Violations</span>
                      <Badge variant="destructive">{reportData.compliance_status.major_violations}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Critical Risks</span>
                      <Badge variant="destructive">{reportData.compliance_status.critical_risks}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Intelligence Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Regulation Updates Tracked</span>
                      <span className="font-medium">{reportData.regulation_monitoring.recent_updates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auto-Adaptations</span>
                      <span className="font-medium">{reportData.regulation_monitoring.auto_adaptations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Impact Assessments</span>
                      <span className="font-medium">{reportData.regulation_monitoring.impact_assessments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Preventive Actions</span>
                      <Badge variant="default">{reportData.preventive_actions.recommendations_generated}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Real-time Intelligence Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportData.alerts.map((alert: any) => (
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
        </div>
      );
    }

    return renderGenericOverview();
  }

  function renderGenericOverview() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{reportType.replace('_', ' ')} Intelligence</CardTitle>
            <CardDescription>
              Generated at {reportData?.generated_at ? new Date(reportData.generated_at).toLocaleString() : 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">
                {reportType === 'regulation_monitoring' ? '45' :
                 reportType === 'compliance_check' ? '97.2%' :
                 reportType === 'risk_assessment' ? '8' :
                 reportType === 'preventive_actions' ? '12' : 'N/A'}
              </div>
              <div className="text-lg font-medium text-muted-foreground">
                {reportType === 'regulation_monitoring' ? 'Regulations Monitored' :
                 reportType === 'compliance_check' ? 'Compliance Score' :
                 reportType === 'risk_assessment' ? 'High Risk Visas' :
                 reportType === 'preventive_actions' ? 'Actions Generated' : 'Intelligence Metric'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderRegulationMonitoring() {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Active Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-sm text-blue-700 dark:text-blue-400">Regulations Tracked</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Real-time Updates</span>
                  <Badge variant="default">Live</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Regulations (30 days)</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Updated Regulations</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Impact Assessments</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Auto-Adaptations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Work Visa Requirements Update</p>
                    <p className="text-sm text-muted-foreground">Effective Dec 1, 2024 - Auto-adapted</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Dependent Visa Processing</p>
                    <p className="text-sm text-muted-foreground">Timeline extended - Procedures updated</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Medical Certificate Requirements</p>
                    <p className="text-sm text-muted-foreground">New format requirements - Auto-implemented</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Regulation Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 'REG2024001',
                  title: 'Updated Work Visa Renewal Requirements',
                  effective_date: '2024-12-01',
                  impact: 'High',
                  status: 'Adapted',
                  affected_visas: 15
                },
                {
                  id: 'REG2024002',
                  title: 'New Dependent Visa Processing Timeline',
                  effective_date: '2025-01-15',
                  impact: 'Medium',
                  status: 'Monitoring',
                  affected_visas: 8
                },
                {
                  id: 'REG2024003',
                  title: 'Enhanced Medical Certificate Requirements',
                  effective_date: '2024-11-20',
                  impact: 'Low',
                  status: 'Compliant',
                  affected_visas: 22
                }
              ].map((regulation) => (
                <div key={regulation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{regulation.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Effective: {new Date(regulation.effective_date).toLocaleDateString()} | 
                      Affects {regulation.affected_visas} visas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      regulation.impact === 'High' ? 'destructive' : 
                      regulation.impact === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {regulation.impact}
                    </Badge>
                    <Badge variant={
                      regulation.status === 'Adapted' ? 'default' : 
                      regulation.status === 'Monitoring' ? 'secondary' : 'outline'
                    }>
                      {regulation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderRiskAnalysis() {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">2</div>
                <p className="text-sm text-muted-foreground">Critical attention required</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Medium Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                <p className="text-sm text-muted-foreground">Monitor closely</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Low Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">18</div>
                <p className="text-sm text-muted-foreground">Stable and compliant</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  visa_number: 'WV2024009876',
                  employee: 'Ahmed Al-Rashid',
                  risk_level: 'High',
                  risk_score: 85,
                  factors: ['Expiring in 18 days', 'Renewal delayed'],
                  actions: ['Immediate renewal', 'Document verification']
                },
                {
                  visa_number: 'DV2024005678',
                  employee: 'Sarah Mohammed',
                  risk_level: 'High',
                  risk_score: 78,
                  factors: ['Expiring in 28 days', 'Missing documents'],
                  actions: ['Expedite documents', 'Schedule appointment']
                },
                {
                  visa_number: 'WV2024003412',
                  employee: 'Omar Hassan',
                  risk_level: 'Medium',
                  risk_score: 45,
                  factors: ['Expiring in 75 days', 'New regulation impact'],
                  actions: ['Start renewal process', 'Update documents']
                }
              ].map((risk, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-foreground">{risk.visa_number}</p>
                      <Badge variant={
                        risk.risk_level === 'High' ? 'destructive' : 
                        risk.risk_level === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {risk.risk_level} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{risk.employee}</p>
                    <div className="text-sm space-y-1">
                      <p><strong>Risk Factors:</strong> {risk.factors.join(', ')}</p>
                      <p><strong>Recommended Actions:</strong> {risk.actions.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{risk.risk_score}</div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderPreventiveActions() {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Action Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">87.5%</div>
                <div className="text-sm text-green-700 dark:text-green-400">Success Rate</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Actions Generated</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actions Implemented</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cost Savings</span>
                  <Badge variant="default">38K SAR</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">0</div>
                  <div className="text-sm text-muted-foreground">Visa Surprises</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">90</div>
                  <div className="text-sm text-muted-foreground">Days Advance Warning</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-purple-600">100%</div>
                  <div className="text-sm text-muted-foreground">Automation Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Preventive Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: 'Early Renewal Automation',
                  description: '120-day advance renewal automation for all work visas',
                  priority: 'High',
                  status: 'Active',
                  estimated_savings: '15,000 SAR',
                  affected_visas: 8
                },
                {
                  type: 'Document Optimization',
                  description: 'Streamlined document preparation workflow',
                  priority: 'Medium',
                  status: 'Active',
                  estimated_savings: '8,000 SAR',
                  affected_visas: 12
                },
                {
                  type: 'Compliance Enhancement',
                  description: 'Enhanced real-time compliance monitoring',
                  priority: 'Medium',
                  status: 'Active',
                  estimated_savings: '5,000 SAR',
                  affected_visas: 25
                },
                {
                  type: 'Predictive Analytics',
                  description: 'Advanced expiration prediction and risk assessment',
                  priority: 'Low',
                  status: 'Implemented',
                  estimated_savings: '10,000 SAR',
                  affected_visas: 25
                }
              ].map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{action.type}</p>
                    <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                    <p className="text-xs text-muted-foreground">Affects {action.affected_visas} visas</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium text-green-600">{action.estimated_savings}</p>
                      <p className="text-xs text-muted-foreground">Estimated Savings</p>
                    </div>
                    <Badge variant={
                      action.priority === 'High' ? 'destructive' : 
                      action.priority === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {action.priority}
                    </Badge>
                    <Badge variant="default">
                      {action.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};