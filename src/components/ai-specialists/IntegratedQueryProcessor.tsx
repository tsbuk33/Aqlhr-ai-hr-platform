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
  Zap
} from 'lucide-react';
import { QueryGatekeeperInterface } from './QueryGatekeeperInterface';
import { QueryPlannerInterface } from './QueryPlannerInterface';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useAskAqlV2 } from '@/hooks/useAskAqlV2';
import { ClarificationRequest } from '@/lib/ai-specialists/QueryGatekeeper';
import { ExecutionPlan } from '@/lib/ai-specialists/QueryPlanner';
import { ModuleType } from '@/lib/ai-specialists/QueryGatekeeper';

type ProcessingStage = 'validation' | 'planning' | 'execution' | 'completed';

interface ProcessingState {
  stage: ProcessingStage;
  validatedQuery?: string;
  targetModule?: ModuleType;
  executionPlan?: ExecutionPlan;
  finalResult?: any;
}

export const IntegratedQueryProcessor: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { messages, isLoading, sendMessage } = useAskAqlV2();
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'validation'
  });
  const [clarificationNeeded, setClarificationNeeded] = useState<ClarificationRequest | null>(null);

  const handleValidQuery = (query: string, module?: ModuleType) => {
    setProcessingState({
      stage: 'planning',
      validatedQuery: query,
      targetModule: module as ModuleType
    });
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

  const handleExecutionComplete = async (plan: ExecutionPlan) => {
    // Send the validated query to the AI system
    if (processingState.validatedQuery) {
      try {
        await sendMessage(processingState.validatedQuery);
        setProcessingState(prev => ({
          ...prev,
          stage: 'completed',
          finalResult: plan
        }));
      } catch (error) {
        console.error('Failed to send to AI system:', error);
      }
    }
  };

  const handleReset = () => {
    setProcessingState({ stage: 'validation' });
    setClarificationNeeded(null);
  };

  const getStageIcon = (stage: ProcessingStage, currentStage: ProcessingStage) => {
    const isActive = stage === currentStage;
    const isCompleted = ['validation', 'planning', 'execution'].indexOf(stage) < 
                      ['validation', 'planning', 'execution'].indexOf(currentStage);

    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (isActive) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    } else {
      switch (stage) {
        case 'validation': return <Shield className="w-5 h-5 text-gray-400" />;
        case 'planning': return <Target className="w-5 h-5 text-gray-400" />;
        case 'execution': return <Zap className="w-5 h-5 text-gray-400" />;
        case 'completed': return <CheckCircle className="w-5 h-5 text-gray-400" />;
      }
    }
  };

  const getStageStatus = (stage: ProcessingStage, currentStage: ProcessingStage) => {
    const stageOrder = ['validation', 'planning', 'execution', 'completed'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stage);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Processing Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {isArabic ? 'معالج الاستفسارات المتكامل' : 'Integrated Query Processor'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {[
              { key: 'validation', label: isArabic ? 'التحقق' : 'Validation' },
              { key: 'planning', label: isArabic ? 'التخطيط' : 'Planning' },
              { key: 'execution', label: isArabic ? 'التنفيذ' : 'Execution' },
              { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' }
            ].map((stage, index) => (
              <React.Fragment key={stage.key}>
                <div className="flex flex-col items-center">
                  {getStageIcon(stage.key as ProcessingStage, processingState.stage)}
                  <span className={`text-xs mt-1 ${
                    getStageStatus(stage.key as ProcessingStage, processingState.stage) === 'active' 
                      ? 'text-blue-600 font-medium' 
                      : getStageStatus(stage.key as ProcessingStage, processingState.stage) === 'completed'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    {stage.label}
                  </span>
                </div>
                {index < 3 && (
                  <ArrowRight className={`w-4 h-4 ${
                    getStageStatus(stage.key as ProcessingStage, processingState.stage) === 'completed'
                      ? 'text-green-500'
                      : 'text-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={handleReset}>
              {isArabic ? 'إعادة تعيين' : 'Reset'}
            </Button>
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
                  ? 'جاري تنفيذ خطة الاستفسار... يرجى الانتظار.'
                  : 'Executing query plan... Please wait.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {processingState.stage === 'completed' && processingState.finalResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {isArabic ? 'اكتمل التنفيذ' : 'Execution Completed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4" />
              <AlertDescription className="text-green-700">
                {isArabic 
                  ? 'تم تنفيذ الاستفسار بنجاح وإرساله إلى النظام الذكي.'
                  : 'Query executed successfully and sent to AI system.'
                }
              </AlertDescription>
            </Alert>
            
            {processingState.finalResult.summary && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">
                  {isArabic ? 'ملخص التنفيذ:' : 'Execution Summary:'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {processingState.finalResult.summary}
                </p>
              </div>
            )}
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
              {isArabic ? 'استجابة النظام الذكي' : 'AI System Response'}
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
                            : (isArabic ? 'مساعد' : 'Assistant')
                          }
                        </Badge>
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
                    {isArabic ? 'النظام الذكي يعمل...' : 'AI system is processing...'}
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