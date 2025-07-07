import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap,
  Database,
  Activity,
  Settings
} from "lucide-react";
import KPIManagementDashboard from "@/components/KPIManagementDashboard";

const AILocalContentIntelligence = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI Local Content Intelligence
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Advanced AI-powered analytics and KPI management for comprehensive performance monitoring across all 106 SanadHR modules
        </p>
      </div>

      {/* AI Intelligence Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-brand-primary" />
              AI Performance Analysis
            </CardTitle>
            <CardDescription>Intelligent performance pattern recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Modules</span>
                <Badge variant="secondary">106</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">KPI Tracking</span>
                <Badge variant="secondary">450+</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Accuracy</span>
                <Badge className="bg-green-50 text-green-700">99.2%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              Predictive Insights
            </CardTitle>
            <CardDescription>Forward-looking performance predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Forecast Accuracy</span>
                <Badge className="bg-blue-50 text-blue-700">94.8%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Trend Detection</span>
                <Badge className="bg-purple-50 text-purple-700">Real-time</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Alert System</span>
                <Badge className="bg-orange-50 text-orange-700">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-accent" />
              Intelligent Reporting
            </CardTitle>
            <CardDescription>AI-generated insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Auto Reports</span>
                <Badge className="bg-green-50 text-green-700">Daily</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recommendations</span>
                <Badge className="bg-yellow-50 text-yellow-700">Smart</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Export Formats</span>
                <Badge variant="secondary">5+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="kpi-dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpi-dashboard">KPI Dashboard</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="kpi-dashboard">
          <KPIManagementDashboard />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-brand-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Real-time intelligent analysis of your HR performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">✓ Performance Excellence Detected</h4>
                  <p className="text-sm text-green-700 mt-1">
                    AI Sync Engine is performing 23% above target with 99.2% accuracy. This indicates excellent system stability.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">⚠ Attention Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Payroll Processing latency has increased by 15% over the past week. Consider optimization.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">📈 Growth Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Employee engagement metrics show positive trends. Consider expanding recognition programs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-brand-success" />
                  Top Performing Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'AI Sync Engine', score: 99.2, grade: 'A+' },
                    { name: 'Payroll Processing (WPS)', score: 97.8, grade: 'A+' },
                    { name: 'Employee Management', score: 95.4, grade: 'A' },
                    { name: 'Arabic-English NLP', score: 94.1, grade: 'A' }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{module.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{module.score}%</span>
                        <Badge className="bg-green-50 text-green-700">{module.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brand-warning" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Training & Development Integration', score: 78.5, grade: 'C+' },
                    { name: 'Succession Planning', score: 82.1, grade: 'B' },
                    { name: 'Culture Change Tracker', score: 79.9, grade: 'C+' },
                    { name: 'Leadership Assessment', score: 85.2, grade: 'B+' }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{module.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{module.score}%</span>
                        <Badge className="bg-yellow-50 text-yellow-700">{module.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-primary" />
                AI Intelligence Configuration
              </CardTitle>
              <CardDescription>Configure AI analysis and reporting settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto KPI Sync</h4>
                    <p className="text-sm text-muted-foreground">Automatically sync KPI data every hour</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">AI Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Enable intelligent performance recommendations</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Alert Thresholds</h4>
                    <p className="text-sm text-muted-foreground">Set performance alert thresholds</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AILocalContentIntelligence;