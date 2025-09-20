import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  ArrowDown,
  Target,
  Settings,
  TrendingUp
} from 'lucide-react';
import { QueryPlanner, ExecutionPlan, PlanStep } from '@/lib/ai-specialists/QueryPlanner';
import { ModuleType } from '@/lib/ai-specialists/QueryGatekeeper';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface QueryPlannerInterfaceProps {
  query: string;
  targetModule: ModuleType;
  onPlanReady: (plan: ExecutionPlan) => void;
  onExecutionComplete: (plan: ExecutionPlan) => void;
}

export const QueryPlannerInterface: React.FC<QueryPlannerInterfaceProps> = ({
  query,
  targetModule,
  onPlanReady,
  onExecutionComplete
}) => {
  const { isArabic } = useSimpleLanguage();
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const planner = QueryPlanner.getInstance();

  const handleCreatePlan = async () => {
    setIsPlanning(true);
    try {
      const newPlan = await planner.createExecutionPlan(query, targetModule, {
        availableTools: ['get_headcount', 'get_saudization', 'create_task', 'export_cci_pdf', 'find_document'],
        dataAccess: ['hr_employees', 'analytics_events', 'saudi_documents']
      });
      
      setPlan(newPlan);
      onPlanReady(newPlan);
    } catch (error) {
      console.error('Planning failed:', error);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleExecutePlan = async () => {
    if (!plan) return;
    
    setIsExecuting(true);
    try {
      const executedPlan = await planner.executePlan(plan);
      setPlan(executedPlan);
      onExecutionComplete(executedPlan);
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: PlanStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <RotateCcw className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: PlanStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'skipped': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getPriorityVariant = (priority: PlanStep['priority']): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getComplexityColor = (complexity: ExecutionPlan['complexity']) => {
    switch (complexity) {
      case 'simple': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'complex': return 'text-orange-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateProgress = () => {
    if (!plan) return 0;
    const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
    return (completedSteps / plan.steps.length) * 100;
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {!plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {isArabic ? 'مخطط الاستفسار' : 'Query Planner'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Settings className="w-4 h-4" />
                <AlertDescription>
                  <strong>{isArabic ? 'الاستفسار:' : 'Query:'}</strong> {query}
                  <br />
                  <strong>{isArabic ? 'الوحدة المستهدفة:' : 'Target Module:'}</strong> {targetModule}
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleCreatePlan}
                disabled={isPlanning}
                className="w-full flex items-center gap-2"
              >
                {isPlanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isArabic ? 'إنشاء الخطة...' : 'Creating Plan...'}
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    {isArabic ? 'إنشاء خطة تنفيذ' : 'Create Execution Plan'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {plan && (
        <>
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isArabic ? 'خطة التنفيذ' : 'Execution Plan'}
                </div>
                <Badge variant="outline" className={getComplexityColor(plan.complexity)}>
                  {plan.complexity}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{plan.steps.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'خطوات' : 'Steps'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{plan.estimatedTotalTime}s</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'الوقت المقدر' : 'Est. Time'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{plan.confidence}%</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'الثقة' : 'Confidence'}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {isArabic ? 'التقدم' : 'Progress'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(calculateProgress())}%
                  </span>
                </div>
                <Progress value={calculateProgress()} className="w-full" />
              </div>

              <Alert>
                <TrendingUp className="w-4 h-4" />
                <AlertDescription>
                  <strong>{isArabic ? 'الهدف:' : 'Objective:'}</strong> {plan.objective}
                </AlertDescription>
              </Alert>

              {plan.status === 'ready' && (
                <Button 
                  onClick={handleExecutePlan}
                  disabled={isExecuting}
                  className="w-full flex items-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isArabic ? 'تنفيذ الخطة...' : 'Executing Plan...'}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {isArabic ? 'تنفيذ الخطة' : 'Execute Plan'}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Steps Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="w-5 h-5" />
                {isArabic ? 'تفاصيل الخطوات' : 'Step Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`p-4 border rounded-lg ${
                      step.status === 'running' ? 'border-blue-200 bg-blue-50' :
                      step.status === 'completed' ? 'border-green-200 bg-green-50' :
                      step.status === 'failed' ? 'border-red-200 bg-red-50' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{step.name}</h4>
                            <Badge variant={getPriorityVariant(step.priority)} className="text-xs">
                              {step.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {step.tool}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {isArabic ? 'الوحدة:' : 'Module:'} {step.module}
                            </span>
                            <span>
                              {isArabic ? 'الوقت:' : 'Time:'} {step.estimatedTime}s
                            </span>
                            <span className={getStatusColor(step.status)}>
                              {step.status}
                            </span>
                          </div>
                          {step.dependencies.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">
                                {isArabic ? 'يعتمد على:' : 'Depends on:'} {step.dependencies.join(', ')}
                              </span>
                            </div>
                          )}
                          {step.error && (
                            <Alert className="mt-2 border-red-200 bg-red-50">
                              <AlertTriangle className="w-4 h-4" />
                              <AlertDescription className="text-red-700">
                                {step.error}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Execution Summary */}
          {plan.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {isArabic ? 'ملخص التنفيذ' : 'Execution Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    {plan.summary}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};