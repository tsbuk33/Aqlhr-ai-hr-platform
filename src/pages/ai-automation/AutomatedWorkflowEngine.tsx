import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, CheckCircle, Clock, AlertTriangle, Zap, Users, FileText, Settings, TrendingUp, Brain, Activity, Workflow, Play, Pause, BarChart3, Target, Gauge } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";

// Embedded translations
const translations = {
  en: {
    title: "Automated Workflow Engine",
    subtitle: "AI-powered intelligent automation for seamless HR process management",
    howItWorks: "How SanadHR Automates Your Workflows",
    processIntelligence: "Real-time process intelligence and optimization",
    dataCapture: "Data Capture",
    dataCaptureDesc: "AI monitors all HR activities and captures process patterns in real-time",
    aiAnalysis: "AI Analysis", 
    aiAnalysisDesc: "Machine learning algorithms identify automation opportunities and bottlenecks",
    autoExecute: "Auto-Execute",
    autoExecuteDesc: "Workflows are automatically triggered and executed with smart decision making",
    activeWorkflows: "Active Workflows",
    automationSuccess: "Automation Success Rate",
    timeSaved: "Time Saved (Monthly)",
    errorReduction: "Error Reduction",
    activeWorkflowsTab: "Active Workflows",
    performanceTab: "Performance Analytics",
    optimizationTab: "AI Optimization",
    insightsTab: "Smart Insights",
    currentlyRunning: "Currently Running Workflows",
    realtimeMonitoring: "Real-time workflow execution and monitoring",
    workflowPerformance: "Workflow Performance Analytics",
    performanceDesc: "How automation improves your HR operations",
    aiOptimization: "AI-Driven Optimization",
    optimizationDesc: "How machine learning continuously improves your workflows",
    smartInsights: "Workflow Insights & Recommendations",
    insightsDesc: "AI-generated insights to optimize your HR operations",
    controlCenter: "Workflow Control Center",
    controlCenterDesc: "Manage and optimize your automated workflows",
    createWorkflow: "Create New Workflow",
    reviewApprovals: "Review Pending Approvals",
    optimizeFlows: "Optimize Existing Flows",
    fasterProcessing: "Faster Processing",
    costReduction: "Cost Reduction",
    complianceRate: "Compliance Rate",
    patternRecognition: "Pattern Recognition",
    patternDesc: "AI identifies recurring patterns in your HR processes and suggests automation opportunities",
    predictiveAutomation: "Predictive Automation",
    predictiveDesc: "System predicts workflow bottlenecks and proactively adjusts processes",
    continuousLearning: "Continuous Learning",
    learningDesc: "Each workflow execution improves the AI model for better future performance"
  },
  ar: {
    title: "محرك سير العمل الآلي",
    subtitle: "أتمتة ذكية مدعومة بالذكاء الاصطناعي لإدارة سلسة لعمليات الموارد البشرية",
    howItWorks: "كيف يقوم سند للموارد البشرية بأتمتة سير العمل",
    processIntelligence: "ذكاء العمليات والتحسين في الوقت الفعلي",
    dataCapture: "التقاط البيانات",
    dataCaptureDesc: "يراقب الذكاء الاصطناعي جميع أنشطة الموارد البشرية ويلتقط أنماط العمليات في الوقت الفعلي",
    aiAnalysis: "تحليل الذكاء الاصطناعي",
    aiAnalysisDesc: "خوارزميات التعلم الآلي تحدد فرص الأتمتة والاختناقات",
    autoExecute: "التنفيذ التلقائي",
    autoExecuteDesc: "يتم تشغيل وتنفيذ سير العمل تلقائياً مع اتخاذ قرارات ذكية",
    activeWorkflows: "سير العمل النشط",
    automationSuccess: "معدل نجاح الأتمتة",
    timeSaved: "الوقت الموفر (شهرياً)",
    errorReduction: "تقليل الأخطاء",
    activeWorkflowsTab: "سير العمل النشط",
    performanceTab: "تحليل الأداء",
    optimizationTab: "تحسين الذكاء الاصطناعي",
    insightsTab: "رؤى ذكية",
    currentlyRunning: "سير العمل قيد التشغيل حالياً",
    realtimeMonitoring: "تنفيذ ومراقبة سير العمل في الوقت الفعلي",
    workflowPerformance: "تحليل أداء سير العمل",
    performanceDesc: "كيف تحسن الأتمتة عمليات الموارد البشرية لديك",
    aiOptimization: "التحسين المدفوع بالذكاء الاصطناعي",
    optimizationDesc: "كيف يحسن التعلم الآلي سير العمل باستمرار",
    smartInsights: "رؤى وتوصيات سير العمل",
    insightsDesc: "رؤى مُولدة بالذكاء الاصطناعي لتحسين عمليات الموارد البشرية",
    controlCenter: "مركز التحكم في سير العمل",
    controlCenterDesc: "إدارة وتحسين سير العمل الآلي",
    createWorkflow: "إنشاء سير عمل جديد",
    reviewApprovals: "مراجعة الموافقات المعلقة",
    optimizeFlows: "تحسين التدفقات الحالية",
    fasterProcessing: "معالجة أسرع",
    costReduction: "تقليل التكلفة",
    complianceRate: "معدل الامتثال",
    patternRecognition: "التعرف على الأنماط",
    patternDesc: "يحدد الذكاء الاصطناعي الأنماط المتكررة في عمليات الموارد البشرية ويقترح فرص الأتمتة",
    predictiveAutomation: "الأتمتة التنبؤية",
    predictiveDesc: "يتنبأ النظام بعقد سير العمل ويعدل العمليات بشكل استباقي",
    continuousLearning: "التعلم المستمر",
    learningDesc: "كل تنفيذ لسير العمل يحسن نموذج الذكاء الاصطناعي لأداء أفضل في المستقبل"
  }
};

const AutomatedWorkflowEngine = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Process Flow Visualization */}
      <Card className="p-8 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />
            {t.howItWorks}
          </CardTitle>
          <CardDescription>{t.processIntelligence}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t.dataCapture}</h3>
              <p className="text-sm text-muted-foreground">
                {t.dataCaptureDesc}
              </p>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                15,678 Events/Day
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t.aiAnalysis}</h3>
              <p className="text-sm text-muted-foreground">
                {t.aiAnalysisDesc}
              </p>
              <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
                99.2% Accuracy
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t.autoExecute}</h3>
              <p className="text-sm text-muted-foreground">
                {t.autoExecuteDesc}
              </p>
              <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                2,456 Hours Saved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t.activeWorkflows}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">127</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">+23 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              {t.automationSuccess}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-emerald-600">78.3%</div>
              <Progress value={78.3} className="h-2" />
              <p className="text-xs text-muted-foreground">Target: 85% by Q2</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t.timeSaved}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">2,456h</div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">≈ 61 work weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.errorReduction}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-amber-600">67%</div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">vs manual processes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Workflow Analysis */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {t.activeWorkflowsTab}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.performanceTab}
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            {t.optimizationTab}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t.insightsTab}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          <Card className="bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                {t.currentlyRunning}
              </CardTitle>
              <CardDescription>{t.realtimeMonitoring}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Employee Onboarding", status: "Running", progress: 87, employees: 12, icon: Users },
                  { name: "Leave Request Processing", status: "Optimizing", progress: 94, employees: 45, icon: Clock },
                  { name: "Performance Review Cycle", status: "Running", progress: 78, employees: 234, icon: Target },
                  { name: "Payroll Preparation", status: "Scheduled", progress: 100, employees: 567, icon: CheckCircle }
                ].map((workflow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <workflow.icon className="h-5 w-5 text-primary" />
                      </div>
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
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={workflow.progress} className="w-24" />
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-gradient-to-br from-background to-emerald-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                {t.workflowPerformance}
              </CardTitle>
              <CardDescription>{t.performanceDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto" />
                    <div className="text-3xl font-bold text-emerald-600">94.2%</div>
                    <p className="text-sm text-emerald-700">{t.fasterProcessing}</p>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="text-center space-y-2">
                    <Target className="h-8 w-8 text-blue-600 mx-auto" />
                    <div className="text-3xl font-bold text-blue-600">67%</div>
                    <p className="text-sm text-blue-700">{t.costReduction}</p>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto" />
                    <div className="text-3xl font-bold text-purple-600">99.1%</div>
                    <p className="text-sm text-purple-700">{t.complianceRate}</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-gradient-to-br from-background to-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                {t.aiOptimization}
              </CardTitle>
              <CardDescription>{t.optimizationDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">{t.patternRecognition}</h4>
                      <p className="text-sm text-blue-700">{t.patternDesc}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-900 mb-2">{t.predictiveAutomation}</h4>
                      <p className="text-sm text-emerald-700">{t.predictiveDesc}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900 mb-2">{t.continuousLearning}</h4>
                      <p className="text-sm text-purple-700">{t.learningDesc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-gradient-to-br from-background to-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                {t.smartInsights}
              </CardTitle>
              <CardDescription>{t.insightsDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-1">Optimization Opportunity</h4>
                      <p className="text-sm text-emerald-600">Employee onboarding can be 23% faster by automating document verification</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-amber-700 mb-1">Process Alert</h4>
                      <p className="text-sm text-amber-600">Leave request workflow showing higher than normal manual interventions</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-start gap-4">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">Trend Analysis</h4>
                      <p className="text-sm text-blue-600">Payroll processing efficiency improved by 34% over the last quarter</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card className="bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {t.controlCenter}
          </CardTitle>
          <CardDescription>{t.controlCenterDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Bot className="h-4 w-4 mr-2" />
              {t.createWorkflow}
            </Button>
            <Button variant="outline" className="hover:bg-primary/5">
              <CheckCircle className="h-4 w-4 mr-2" />
              {t.reviewApprovals}
            </Button>
            <Button variant="outline" className="hover:bg-primary/5">
              <Zap className="h-4 w-4 mr-2" />
              {t.optimizeFlows}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedWorkflowEngine;