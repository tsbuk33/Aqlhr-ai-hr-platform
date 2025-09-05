import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Zap, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';

interface ExecutionResult {
  executionId: string;
  status: string;
  results: any;
  performanceMetrics: any;
  autonomyLevel: string;
  adaptations?: string[];
}

interface WorkflowDefinition {
  workflowId: string;
  definition: any;
  estimatedDuration: string;
  parallelTasks: number;
  criticalPath: string[];
}

export const PromptExecutionOrchestrator = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [workflowDefinition, setWorkflowDefinition] = useState<WorkflowDefinition | null>(null);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [intentAnalysis, setIntentAnalysis] = useState<any>(null);

  const executePrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setExecutionProgress(0);

    try {
      // Step 1: Parse Intent
      const intentResponse = await supabase.functions.invoke('prompt-driven-execution-engine', {
        body: {
          action: 'parse_intent',
          prompt: prompt
        }
      });

      if (intentResponse.data?.success) {
        setIntentAnalysis(intentResponse.data.data);
        setExecutionProgress(25);
      }

      // Step 2: Decompose Workflow
      const workflowResponse = await supabase.functions.invoke('prompt-driven-execution-engine', {
        body: {
          action: 'decompose_workflow',
          prompt: prompt,
          context: { userId: 'demo-user', companyId: 'demo-company' }
        }
      });

      if (workflowResponse.data?.success) {
        setWorkflowDefinition(workflowResponse.data.data);
        setExecutionProgress(50);
      }

      // Step 3: Execute Autonomous Workflow
      const executionResponse = await supabase.functions.invoke('prompt-driven-execution-engine', {
        body: {
          action: 'execute_autonomous',
          prompt: prompt,
          context: { userId: 'demo-user', companyId: 'demo-company' }
        }
      });

      if (executionResponse.data?.success) {
        setExecutionResult(executionResponse.data.data);
        setExecutionProgress(100);
      }

    } catch (error) {
      console.error('Error executing prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetExecution = () => {
    setPrompt('');
    setExecutionResult(null);
    setWorkflowDefinition(null);
    setIntentAnalysis(null);
    setExecutionProgress(0);
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isArabic ? 'محرك التنفيذ المدفوع بالأوامر' : 'Prompt-Driven Execution Engine'}
        </h2>
        <p className="text-muted-foreground">
          {isArabic ? 'معالجة اللغة الطبيعية وتنسيق سير العمل المستقل' : 'Natural Language Processing & Autonomous Workflow Orchestration'}
        </p>
      </div>

      {/* Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-brand-primary" />
            <span>{isArabic ? 'معالج الأوامر الذكي' : 'Intelligent Prompt Processor'}</span>
          </CardTitle>
          <CardDescription>
            {isArabic ? 'اكتب أمرًا معقدًا وسيقوم النظام بتحليله وتنفيذه تلقائيًا' : 'Enter a complex command and the system will analyze and execute it autonomously'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={isArabic ? 
              "مثال: 'قم بإنشاء تقرير شامل لجميع الموظفين، وحلل معدلات الأداء، وأرسل النتائج إلى الإدارة'" :
              "Example: 'Generate a comprehensive report for all employees, analyze performance rates, and send results to management'"
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
          
          <div className="flex space-x-3">
            <Button
              onClick={executePrompt}
              disabled={loading || !prompt.trim()}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  {isArabic ? 'جاري التنفيذ...' : 'Executing...'}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isArabic ? 'تنفيذ الأمر' : 'Execute Prompt'}
                </>
              )}
            </Button>
            
            <Button
              onClick={resetExecution}
              variant="outline"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isArabic ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>

          {executionProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'تقدم التنفيذ' : 'Execution Progress'}</span>
                <span>{executionProgress}%</span>
              </div>
              <Progress value={executionProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {(intentAnalysis || workflowDefinition || executionResult) && (
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="analysis">
              {isArabic ? 'تحليل القصد' : 'Intent Analysis'}
            </TabsTrigger>
            <TabsTrigger value="workflow">
              {isArabic ? 'سير العمل' : 'Workflow'}
            </TabsTrigger>
            <TabsTrigger value="results">
              {isArabic ? 'النتائج' : 'Results'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {intentAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-brand-accent" />
                    <span>{isArabic ? 'تحليل القصد المتقدم' : 'Advanced Intent Analysis'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-primary">
                        {(intentAnalysis.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'الثقة' : 'Confidence'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-success">
                        {intentAnalysis.complexity}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'التعقيد' : 'Complexity'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-warning">
                        {intentAnalysis.estimatedSteps}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'الخطوات المقدرة' : 'Estimated Steps'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      {isArabic ? 'القدرات المطلوبة' : 'Required Capabilities'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {intentAnalysis.requiredCapabilities.map((capability: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {capability.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            {workflowDefinition && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-brand-success" />
                    <span>{isArabic ? 'تنسيق سير العمل' : 'Workflow Orchestration'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-primary">
                        {workflowDefinition.estimatedDuration}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'المدة المقدرة' : 'Estimated Duration'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-accent">
                        {workflowDefinition.parallelTasks}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'المهام المتوازية' : 'Parallel Tasks'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-success">
                        {workflowDefinition.criticalPath.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'المسار الحرج' : 'Critical Path'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-warning">
                        {workflowDefinition.workflowId.split('_')[1]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'معرف سير العمل' : 'Workflow ID'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      {isArabic ? 'المسار الحرج' : 'Critical Path'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {workflowDefinition.criticalPath.map((step: string, index: number) => (
                        <Badge key={index} variant="default" className="bg-brand-primary">
                          {index + 1}. {step.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {executionResult && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-brand-success" />
                      <span>{isArabic ? 'نتائج التنفيذ' : 'Execution Results'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {isArabic ? 'الحالة' : 'Status'}
                      </span>
                      <Badge variant="default" className="bg-brand-success">
                        {executionResult.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {isArabic ? 'مستوى الاستقلالية' : 'Autonomy Level'}
                      </span>
                      <Badge variant="outline">
                        {executionResult.autonomyLevel.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-brand-primary">
                          {executionResult.performanceMetrics.tasksCompleted}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'المهام المكتملة' : 'Tasks Completed'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-brand-success">
                          {executionResult.performanceMetrics.successRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'معدل النجاح' : 'Success Rate'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-brand-accent">
                          {executionResult.performanceMetrics.efficiencyScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'نقاط الكفاءة' : 'Efficiency Score'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-brand-warning">
                          {executionResult.performanceMetrics.qualityScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'نقاط الجودة' : 'Quality Score'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {executionResult.adaptations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-brand-accent" />
                        <span>{isArabic ? 'التحسينات المطبقة' : 'Applied Adaptations'}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {executionResult.adaptations.map((adaptation: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-brand-accent/10 rounded-lg">
                            <Activity className="w-4 h-4 text-brand-accent mt-0.5" />
                            <span className="text-sm">{adaptation}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};