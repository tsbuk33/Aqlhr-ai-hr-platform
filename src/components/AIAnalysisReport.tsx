import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Activity, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";

export function AIAnalysisReport() {
  const { t, isRTL } = useLanguage();

  const aiModules = [
    {
      name: "AI Recommendation Engine",
      status: "Active",
      performance: "98.2%",
      insights: "Processing 2,847 employee profiles with high accuracy",
      category: "Predictive Analytics"
    },
    {
      name: "DOCUMENT INTELLIGENCE",
      status: "Active", 
      performance: "96.8%",
      insights: "Automated processing of 15,678 documents",
      category: "Document Processing"
    },
    {
      name: "Compliance Predictor",
      status: "Active",
      performance: "97.5%", 
      insights: "Maintaining 96.8% compliance score across all modules",
      category: "Risk Management"
    },
    {
      name: "Workflow Automation",
      status: "Active",
      performance: "95.4%",
      insights: "34 AI processes running with 109 active workflows",
      category: "Process Automation"
    }
  ];

  const platformInsights = {
    totalAIProcesses: 34,
    automatedWorkflows: 109, 
    documentsProcessed: 15678,
    complianceScore: 96.8,
    saudizationRate: 67.2,
    activeUsers: 1847
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Brain className="h-6 w-6 text-brand-primary" />
          <div>
            <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? 'تقرير تحليل الذكاء الاصطناعي والأتمتة' : 'AI & Automation Analysis Report'}
            </CardTitle>
            <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? 'تحليل شامل لأداء منصة الذكاء الاصطناعي' : 'Comprehensive analysis of AI platform performance'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-primary">{platformInsights.totalAIProcesses}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'عمليات ذكية' : 'AI Processes'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-accent">{platformInsights.automatedWorkflows}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'سير عمل آلي' : 'Workflows'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-success">{platformInsights.documentsProcessed.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'وثائق معالجة' : 'Documents'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-status-success">{platformInsights.complianceScore}%</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'امتثال' : 'Compliance'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-warning">{platformInsights.saudizationRate}%</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'سعودة' : 'Saudization'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-secondary">{platformInsights.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'مستخدمين' : 'Users'}</div>
          </div>
        </div>

        {/* AI Modules Analysis */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'تحليل وحدات الذكاء الاصطناعي' : 'AI Modules Analysis'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiModules.map((module, index) => (
              <Card key={index} className="bg-surface-secondary">
                <CardContent className="p-4">
                  <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h4 className="font-medium text-sm">{module.name}</h4>
                      <p className="text-xs text-muted-foreground">{module.category}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {module.status}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <TrendingUp className="h-4 w-4 text-status-success" />
                    <span className="font-bold text-lg">{module.performance}</span>
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'كفاءة' : 'Performance'}
                    </span>
                  </div>
                  <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {module.insights}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-subtle rounded-lg p-4">
          <h3 className={`text-lg font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'رؤى رئيسية' : 'Key Insights'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <Activity className="h-4 w-4 text-brand-primary mt-0.5 flex-shrink-0" />
              <span>
                {isRTL 
                  ? 'معدل نجاح عالي في التنبؤ بالامتثال مع دقة 96.8%'
                  : 'High success rate in compliance prediction with 96.8% accuracy'
                }
              </span>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <Activity className="h-4 w-4 text-brand-accent mt-0.5 flex-shrink-0" />
              <span>
                {isRTL 
                  ? 'أتمتة 109 سير عمل مع توفير 40% من الوقت'
                  : 'Automated 109 workflows with 40% time savings'
                }
              </span>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <Activity className="h-4 w-4 text-brand-success mt-0.5 flex-shrink-0" />
              <span>
                {isRTL 
                  ? 'معالجة ذكية لأكثر من 15,000 وثيقة بدقة عالية'
                  : 'Intelligent processing of 15,000+ documents with high accuracy'
                }
              </span>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <Activity className="h-4 w-4 text-brand-warning mt-0.5 flex-shrink-0" />
              <span>
                {isRTL 
                  ? 'تحسين معدل السعودة بنسبة 67.2% نحو الهدف الأخضر'
                  : 'Saudization rate optimization at 67.2% towards green target'
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}