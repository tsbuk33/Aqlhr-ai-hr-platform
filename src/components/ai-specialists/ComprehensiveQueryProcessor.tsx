import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Target, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Brain,
  Zap,
  RefreshCw,
  Eye
} from 'lucide-react';
import { QueryGatekeeperInterface } from './QueryGatekeeperInterface';
import { QueryPlannerInterface } from './QueryPlannerInterface';
import { ResultAuditorInterface } from './ResultAuditorInterface';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useAskAqlV2 } from '@/hooks/useAskAqlV2';
import { ClarificationRequest } from '@/lib/ai-specialists/QueryGatekeeper';
import { ExecutionPlan } from '@/lib/ai-specialists/QueryPlanner';
import { ModuleType } from '@/lib/ai-specialists/QueryGatekeeper';

type ProcessingStage = 'validation' | 'planning' | 'execution' | 'auditing' | 'replanning' | 'completed';

interface ProcessingState {
  stage: ProcessingStage;
  validatedQuery?: string;
  targetModule?: ModuleType;
  executionPlan?: ExecutionPlan;
  auditResults?: any;
  replanningStrategy?: any;
  finalResult?: any;
  iterationCount: number;
}

export const ComprehensiveQueryProcessor: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { messages, isLoading, sendMessage } = useAskAqlV2();
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'validation',
    iterationCount: 0
  });
  const [clarificationNeeded, setClarificationNeeded] = useState<ClarificationRequest | null>(null);

  const handleValidQuery = (query: string, module?: ModuleType) => {
    setProcessingState(prev => ({
      ...prev,
      stage: 'planning',
      validatedQuery: query,
      targetModule: module as ModuleType
    }));
    setClarificationNeeded(null);
  };

  const handleClarificationNeeded = (clarification: ClarificationRequest) => {
    setClarificationNeeded(clarification);
  };

  const handlePlanReady = (plan: ExecutionPlan) => {
    setProcessingState(prev => ({
      ...prev,
      stage: 'execution',
      executionPlan: plan
    }));
  };

  const handleExecutionComplete = (plan: ExecutionPlan) => {
    setProcessingState(prev => ({
      ...prev,
      stage: 'auditing',
      executionPlan: plan
    }));
  };

  const handleAuditComplete = (auditResults: any) => {
    if (auditResults.needsReplanning && processingState.iterationCount < 3) {
      setProcessingState(prev => ({
        ...prev,
        stage: 'replanning',
        auditResults,
        iterationCount: prev.iterationCount + 1
      }));
    } else {
      // Proceed to send to AI system
      handleFinalExecution(auditResults);
    }
  };

  const handleReplanningNeeded = (strategy: any) => {
    setProcessingState(prev => ({
      ...prev,
      replanningStrategy: strategy
    }));
  };

  const handleFinalExecution = async (auditResults: any) => {
    if (processingState.validatedQuery) {
      try {
        await sendMessage(processingState.validatedQuery);
        setProcessingState(prev => ({
          ...prev,
          stage: 'completed',
          finalResult: auditResults
        }));
      } catch (error) {
        console.error('Failed to send to AI system:', error);
      }
    }
  };

  const handleRetryWithCorrections = () => {
    if (processingState.replanningStrategy && processingState.validatedQuery && processingState.targetModule) {
      // Create a new plan with corrections
      setProcessingState(prev => ({
        ...prev,
        stage: 'planning'
      }));
    }
  };

  const handleReset = () => {
    setProcessingState({ stage: 'validation', iterationCount: 0 });
    setClarificationNeeded(null);
  };

  const getStageIcon = (stage: ProcessingStage, currentStage: ProcessingStage) => {
    const stages = ['validation', 'planning', 'execution', 'auditing', 'replanning', 'completed'];
    const isActive = stage === currentStage;
    const isCompleted = stages.indexOf(stage) < stages.indexOf(currentStage);

    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (isActive) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    } else {
      switch (stage) {
        case 'validation': return <Shield className="w-5 h-5 text-gray-400" />;
        case 'planning': return <Target className="w-5 h-5 text-gray-400" />;
        case 'execution': return <Zap className="w-5 h-5 text-gray-400" />;
        case 'auditing': return <Eye className="w-5 h-5 text-gray-400" />;
        case 'replanning': return <RefreshCw className="w-5 h-5 text-gray-400" />;
        case 'completed': return <CheckCircle className="w-5 h-5 text-gray-400" />;
      }
    }
  };

  const getStageLabel = (stage: ProcessingStage) => {
    const labels = {
      validation: isArabic ? 'التحقق' : 'Validation',
      planning: isArabic ? 'التخطيط' : 'Planning',
      execution: isArabic ? 'التنفيذ' : 'Execution',
      auditing: isArabic ? 'المراجعة' : 'Auditing',
      replanning: isArabic ? 'إعادة التخطيط' : 'Replanning',
      completed: isArabic ? 'مكتمل' : 'Completed'
    };
    return labels[stage];
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Comprehensive Processing Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {isArabic ? 'معالج الاستفسارات المتقدم مع المراجعة الذاتية' : 'Advanced Query Processor with Self-Auditing'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {['validation', 'planning', 'execution', 'auditing', 'completed'].map((stage, index) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center">
                  {getStageIcon(stage as ProcessingStage, processingState.stage)}
                  <span className={`text-xs mt-1 text-center ${
                    stage === processingState.stage 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-400'
                  }`}>
                    {getStageLabel(stage as ProcessingStage)}
                  </span>
                </div>
                {index < 4 && (
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>

          {processingState.iterationCount > 0 && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <RefreshCw className="w-4 h-4" />
              <AlertDescription className="text-blue-700">
                {isArabic 
                  ? `التكرار ${processingState.iterationCount} - إعادة معالجة للحصول على نتائج أفضل`
                  : `Iteration ${processingState.iterationCount} - Reprocessing for better results`
                }
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              {isArabic ? 'إعادة تعيين' : 'Reset'}
            </Button>
            {processingState.stage === 'replanning' && (
              <Button size="sm" onClick={handleRetryWithCorrections}>
                {isArabic ? 'إعادة المحاولة مع التصحيحات' : 'Retry with Corrections'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Stage Content */}
      {processingState.stage === 'validation' && (
        <QueryGatekeeperInterface
          onValidQuery={handleValidQuery}
          onClarificationNeeded={handleClarificationNeeded}
        />
      )}

      {processingState.stage === 'planning' && processingState.validatedQuery && processingState.targetModule && (
        <QueryPlannerInterface
          query={processingState.validatedQuery}
          targetModule={processingState.targetModule}
          onPlanReady={handlePlanReady}
          onExecutionComplete={handleExecutionComplete}
        />
      )}

      {processingState.stage === 'execution' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {isArabic ? 'تنفيذ الخطة' : 'Plan Execution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                {isArabic 
                  ? 'جاري تنفيذ خطة الاستفسار... سيتم مراجعة النتائج تلقائياً.'
                  : 'Executing query plan... Results will be automatically audited.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {processingState.stage === 'auditing' && processingState.executionPlan && (
        <ResultAuditorInterface
          executionPlan={processingState.executionPlan}
          onReplanningNeeded={handleReplanningNeeded}
          onAuditComplete={handleAuditComplete}
        />
      )}

      {processingState.stage === 'replanning' && processingState.replanningStrategy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              {isArabic ? 'إعادة التخطيط المطلوبة' : 'Replanning Required'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-orange-200 bg-orange-50 mb-4">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-orange-700">
                {isArabic 
                  ? 'تم اكتشاف مشاكل في الجودة. سيتم إعادة التخطيط تلقائياً للحصول على نتائج أفضل.'
                  : 'Quality issues detected. Automatic replanning will improve results.'
                }
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">
                  {isArabic ? 'استراتيجية التصحيح:' : 'Correction Strategy:'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {processingState.replanningStrategy.strategy}
                </p>
              </div>

              {processingState.replanningStrategy.reasoning.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    {isArabic ? 'أسباب إعادة التخطيط:' : 'Replanning Reasons:'}
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {processingState.replanningStrategy.reasoning.map((reason: string, index: number) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {processingState.stage === 'completed' && processingState.finalResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {isArabic ? 'اكتمل التنفيذ والمراجعة' : 'Execution and Audit Completed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-200 bg-green-50 mb-4">
              <CheckCircle className="w-4 h-4" />
              <AlertDescription className="text-green-700">
                {isArabic 
                  ? `تم تنفيذ الاستفسار بنجاح مع ${processingState.iterationCount} تكرارات للوصول لأفضل النتائج.`
                  : `Query executed successfully with ${processingState.iterationCount} iterations to achieve optimal results.`
                }
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(processingState.finalResult.overallQuality)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'جودة النتائج' : 'Result Quality'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {processingState.iterationCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'تكرارات التحسين' : 'Improvement Iterations'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {processingState.finalResult.auditResults?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'خطوات مراجعة' : 'Audited Steps'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clarification Request */}
      {clarificationNeeded && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              {isArabic ? 'يحتاج توضيح' : 'Clarification Needed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-yellow-200 bg-yellow-100">
              <AlertDescription className="text-yellow-800">
                {isArabic 
                  ? 'يحتاج استفسارك إلى مزيد من التوضيح قبل المتابعة.'
                  : 'Your query needs clarification before proceeding.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* AI Response Messages */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {isArabic ? 'استجابة النظام الذكي المحسنة' : 'Enhanced AI System Response'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.slice(-3).map((message, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary/10 ml-8' 
                      : 'bg-secondary/10 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {message.role === 'user' 
                            ? (isArabic ? 'مستخدم' : 'User')
                            : (isArabic ? 'مساعد محسن' : 'Enhanced Assistant')
                          }
                        </Badge>
                        {processingState.stage === 'completed' && (
                          <Badge variant="default" className="text-xs">
                            {isArabic ? 'مراجع ومحسن' : 'Audited & Enhanced'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp?.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg mr-8">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'النظام الذكي المحسن يعمل...' : 'Enhanced AI system is processing...'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};