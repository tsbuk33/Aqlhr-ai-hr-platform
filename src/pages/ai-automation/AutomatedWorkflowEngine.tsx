import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, CheckCircle, Clock, AlertTriangle, Zap, Users, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AutomatedWorkflowEngine = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('ai.automated_workflow_engine')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('ai.automated_workflow_desc')}
        </p>
      </div>

      {/* Process Flow Visualization */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Bot className="h-6 w-6 text-brand-primary" />
            {t('ai.how_sanadhr_automates')}
          </CardTitle>
          <CardDescription>{t('ai.realtime_process_intelligence')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Data Capture</h3>
              <p className="text-sm text-muted-foreground">
                AI monitors all HR activities and captures process patterns in real-time
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                15,678 Events/Day
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Machine learning algorithms identify automation opportunities and bottlenecks
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                99.2% Accuracy
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Auto-Execute</h3>
              <p className="text-sm text-muted-foreground">
                Workflows are automatically triggered and executed with smart decision making
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                2,456 Hours Saved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">127</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">+23 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Automation Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">78.3%</div>
              <Progress value={78.3} className="h-2" />
              <p className="text-xs text-muted-foreground">Target: 85% by Q2</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Time Saved (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">2,456h</div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">≈ 61 work weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Error Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">67%</div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-brand-warning" />
                <span className="text-muted-foreground">vs manual processes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Workflow Analysis */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currently Running Workflows</CardTitle>
              <CardDescription>Real-time workflow execution and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Employee Onboarding", status: "Running", progress: 87, employees: 12 },
                  { name: "Leave Request Processing", status: "Optimizing", progress: 94, employees: 45 },
                  { name: "Performance Review Cycle", status: "Running", progress: 78, employees: 234 },
                  { name: "Payroll Preparation", status: "Scheduled", progress: 100, employees: 567 }
                ].map((workflow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <Badge variant={workflow.status === "Running" ? "default" : workflow.status === "Optimizing" ? "secondary" : "outline"}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {workflow.employees} employees
                        </span>
                        <span>{workflow.progress}% complete</span>
                      </div>
                    </div>
                    <Progress value={workflow.progress} className="w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance Analytics</CardTitle>
              <CardDescription>How automation improves your HR operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">94.2%</div>
                  <p className="text-sm text-muted-foreground">Faster Processing</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">67%</div>
                  <p className="text-sm text-muted-foreground">Cost Reduction</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">99.1%</div>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Driven Optimization</CardTitle>
              <CardDescription>How machine learning continuously improves your workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pattern Recognition</h4>
                  <p className="text-sm text-blue-700">AI identifies recurring patterns in your HR processes and suggests automation opportunities</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Predictive Automation</h4>
                  <p className="text-sm text-green-700">System predicts workflow bottlenecks and proactively adjusts processes</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Continuous Learning</h4>
                  <p className="text-sm text-purple-700">Each workflow execution improves the AI model for better future performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Insights & Recommendations</CardTitle>
              <CardDescription>AI-generated insights to optimize your HR operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 bg-brand-success rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-brand-success mb-1">Optimization Opportunity</h4>
                    <p className="text-sm text-muted-foreground">Employee onboarding can be 23% faster by automating document verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 bg-brand-warning rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-brand-warning mb-1">Process Alert</h4>
                    <p className="text-sm text-muted-foreground">Leave request workflow showing higher than normal manual interventions</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-brand-primary mb-1">Trend Analysis</h4>
                    <p className="text-sm text-muted-foreground">Payroll processing efficiency improved by 34% over the last quarter</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Control Center</CardTitle>
          <CardDescription>Manage and optimize your automated workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Bot className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Pending Approvals
            </Button>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Optimize Existing Flows
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedWorkflowEngine;