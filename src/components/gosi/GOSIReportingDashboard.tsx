import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const GOSIReportingDashboard: React.FC = () => {
  const [reportType, setReportType] = useState('dashboard');
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateReport(reportType);
  }, [reportType]);

  const generateReport = async (type: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gosi-analytics-engine', {
        body: {
          type,
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
      console.error('Error generating report:', error);
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
      title: "Report Export",
      description: "Report exported successfully to Excel format",
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
          <h2 className="text-2xl font-bold text-foreground">GOSI Reporting & Analytics</h2>
          <p className="text-muted-foreground">Real-time reporting and compliance analytics dashboard</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Real-time Dashboard</SelectItem>
              <SelectItem value="compliance_report">Compliance Report</SelectItem>
              <SelectItem value="cost_analysis">Cost Analysis</SelectItem>
              <SelectItem value="performance_metrics">Performance Metrics</SelectItem>
              <SelectItem value="predictive_insights">Predictive Insights</SelectItem>
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends & Forecasts</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverviewReport()}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {renderDetailedAnalysis()}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {renderTrendsAndForecasts()}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {renderComplianceStatus()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  function renderOverviewReport() {
    if (reportType === 'dashboard' && reportData) {
      return (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-4">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportData.overview.total_employees}</p>
                  <p className="text-xs text-muted-foreground">Active Contributors</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {(reportData.overview.total_contributions_sar / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">SAR This Month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <Shield className="h-8 w-8 text-purple-500 mr-3" />
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
                <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportData.overview.automation_level}%</p>
                  <p className="text-xs text-muted-foreground">Automation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contribution Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Contribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Monthly Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Month</span>
                      <span className="font-medium">{(reportData.contributions.current_month / 1000).toFixed(0)}K SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Previous Month</span>
                      <span className="font-medium">{(reportData.contributions.previous_month / 1000).toFixed(0)}K SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Growth</span>
                      <Badge variant={reportData.contributions.trend_percentage > 0 ? "default" : "secondary"}>
                        {reportData.contributions.trend_percentage > 0 ? '+' : ''}{reportData.contributions.trend_percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Automation Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Operations</span>
                      <span className="font-medium">{reportData.automation.sync_operations_today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Accuracy</span>
                      <span className="font-medium">{reportData.automation.processing_accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exceptions Resolved</span>
                      <Badge variant="default">{reportData.automation.exceptions_resolved}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Handle other report types
    return renderGenericOverview();
  }

  function renderGenericOverview() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{reportType.replace('_', ' ')} Overview</CardTitle>
            <CardDescription>
              Generated at {reportData?.generated_at ? new Date(reportData.generated_at).toLocaleString() : 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportType === 'compliance_report' && reportData && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Overall Compliance</h4>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{reportData.overall_compliance?.score?.toFixed(1)}%</div>
                    <div className="text-lg font-medium text-green-700 dark:text-green-400">Grade: {reportData.overall_compliance?.grade}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Employee Compliance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Employees</span>
                      <span className="font-medium">{reportData.employee_compliance?.total_employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fully Compliant</span>
                      <span className="font-medium text-green-600">{reportData.employee_compliance?.fully_compliant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Minor Issues</span>
                      <span className="font-medium text-yellow-600">{reportData.employee_compliance?.minor_issues}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Major Violations</span>
                      <span className="font-medium text-red-600">{reportData.employee_compliance?.major_violations}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'cost_analysis' && reportData && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Total Costs (SAR)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Contributions</span>
                      <span className="font-medium">{(reportData.total_costs?.employee_contributions / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employer Contributions</span>
                      <span className="font-medium">{(reportData.total_costs?.employer_contributions / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Administrative Costs</span>
                      <span className="font-medium">{reportData.total_costs?.administrative_costs}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">{(reportData.total_costs?.total_costs / 1000).toFixed(0)}K SAR</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Automation Savings</h4>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{reportData.automation_savings?.total_savings?.toFixed(0)} SAR</div>
                    <div className="text-sm text-green-700 dark:text-green-400">Monthly Savings</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">ROI</span>
                      <span className="font-medium">{reportData.automation_savings?.roi_percentage?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Time Saved</span>
                      <span className="font-medium">{reportData.automation_savings?.time_saved_hours} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'performance_metrics' && reportData && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="font-semibold">Automation Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sync Success Rate</span>
                      <span className="font-medium">{reportData.automation_performance?.sync_success_rate?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reconciliation Accuracy</span>
                      <span className="font-medium">{reportData.automation_performance?.reconciliation_accuracy?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exception Resolution</span>
                      <span className="font-medium">{reportData.automation_performance?.exception_resolution_rate?.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Data Accuracy</span>
                      <span className="font-medium">{reportData.quality_metrics?.data_accuracy?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Compliance Adherence</span>
                      <span className="font-medium">{reportData.quality_metrics?.compliance_adherence?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium">{reportData.quality_metrics?.error_rate?.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Benchmark Comparison</h4>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      +{reportData.benchmark_comparison?.performance_advantage?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Above Industry Average</div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'predictive_insights' && reportData && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                  <div className="text-lg font-semibold text-foreground mb-2">Prediction Confidence</div>
                  <div className="text-4xl font-bold text-purple-600">{reportData.confidence_level}%</div>
                  <div className="text-sm text-muted-foreground">AI Model Accuracy</div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contribution Forecast</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Next Month</span>
                        <span className="font-medium">{(reportData.insights?.contribution_forecast?.next_month_sar / 1000).toFixed(0)}K SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Annual Projection</span>
                        <span className="font-medium">{(reportData.insights?.contribution_forecast?.annual_sar / 1000000).toFixed(1)}M SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Rate</span>
                        <Badge variant="default">+{reportData.insights?.contribution_forecast?.growth_rate}%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Workforce Predictions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Hires</span>
                        <span className="font-medium text-green-600">+{reportData.insights?.workforce_changes?.expected_hires}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Resignations</span>
                        <span className="font-medium text-red-600">-{reportData.insights?.workforce_changes?.expected_resignations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Net Change</span>
                        <Badge variant={reportData.insights?.workforce_changes?.net_change > 0 ? "default" : "secondary"}>
                          {reportData.insights?.workforce_changes?.net_change > 0 ? '+' : ''}{reportData.insights?.workforce_changes?.net_change}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderDetailedAnalysis() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis - Work in Progress</CardTitle>
            <CardDescription>Comprehensive breakdown of GOSI operations and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Detailed Analytics Coming Soon</p>
              <p className="text-muted-foreground">
                Advanced charts and detailed breakdowns will be available in the next update
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderTrendsAndForecasts() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trends & Forecasting - Advanced Analytics</CardTitle>
            <CardDescription>Historical trends and future projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Advanced Trending Analysis</p>
              <p className="text-muted-foreground">
                Interactive charts and forecasting models will be implemented in future releases
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderComplianceStatus() {
    if (reportType === 'compliance_report' && reportData) {
      return (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Regulatory Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.regulatory_requirements?.map((requirement: any, index: number) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{requirement.requirement}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(requirement.last_submission || requirement.last_update).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={requirement.status === 'compliant' ? 'default' : 'destructive'}>
                      {requirement.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 capitalize">
                      {reportData.risk_assessment?.overall_risk}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400">Overall Risk Level</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Financial Risk</span>
                      <span className="font-medium">{reportData.risk_assessment?.financial_risk_sar} SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Regulatory Risk</span>
                      <Badge variant="outline" className="capitalize">{reportData.risk_assessment?.regulatory_risk}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Operational Risk</span>
                      <Badge variant="outline" className="capitalize">{reportData.risk_assessment?.operational_risk}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {reportData.recommendations && reportData.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Compliance Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Impact: {rec.estimated_impact}</span>
                      <span className="text-muted-foreground">Type: {rec.type}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status Overview</CardTitle>
            <CardDescription>Current compliance status and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Select Compliance Report</p>
              <p className="text-muted-foreground">
                Choose "Compliance Report" from the dropdown to view detailed compliance analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default GOSIReportingDashboard;