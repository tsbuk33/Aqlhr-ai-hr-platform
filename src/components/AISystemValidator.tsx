import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITest {
  name: string;
  functionName: string;
  testPayload: any;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
  responseTime?: number;
}

const AISystemValidator: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tests, setTests] = useState<AITest[]>([
    {
      name: 'AI Agent Orchestrator',
      functionName: 'ai-agent-orchestrator',
      testPayload: { query: 'Test AI connectivity', context: { module: 'test' } },
      status: 'pending'
    },
    {
      name: 'Document Intelligence',
      functionName: 'ai-document-intelligence',
      testPayload: { text: 'Test document processing', analysis_type: 'basic' },
      status: 'pending'
    },
    {
      name: 'NLP Processor',
      functionName: 'ai-nlp-processor',
      testPayload: { text: 'Test text processing', language: 'en' },
      status: 'pending'
    },
    {
      name: 'Translation Engine',
      functionName: 'ai-translation-engine',
      testPayload: { 
        action: 'translate',
        text: 'Hello World',
        source_language: 'en',
        target_language: 'ar'
      },
      status: 'pending'
    },
    {
      name: 'Recommendation Engine',
      functionName: 'ai-recommendation-engine',
      testPayload: { company_id: 'test-company', analysis_type: 'workforce' },
      status: 'pending'
    },
    {
      name: 'Predictive Analytics',
      functionName: 'ai-predictive-analytics',
      testPayload: { company_id: 'test-company', prediction_type: 'turnover' },
      status: 'pending'
    },
    {
      name: 'Sync Engine',
      functionName: 'ai-sync-engine',
      testPayload: { action: 'status_check' },
      status: 'pending'
    },
    {
      name: 'Enhanced AqlHR AI',
      functionName: 'enhanced-aqlhr-ai',
      testPayload: { query: 'System status check', module: 'core' },
      status: 'pending'
    },
    {
      name: 'Manus Image Generator',
      functionName: 'manus-image-generator',
      testPayload: { prompt: 'Test image generation', style: 'professional' },
      status: 'pending'
    },
    {
      name: 'HF Document Processor',
      functionName: 'hf-document-processor',
      testPayload: { document_type: 'test', content: 'Test document' },
      status: 'pending'
    }
  ]);

  const runSingleTest = async (test: AITest): Promise<AITest> => {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke(test.functionName, {
        body: test.testPayload
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          ...test,
          status: 'failed',
          error: error.message,
          responseTime
        };
      }

      return {
        ...test,
        status: 'passed',
        responseTime
      };
    } catch (err) {
      const responseTime = Date.now() - startTime;
      return {
        ...test,
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown error',
        responseTime
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const updatedTests = [...tests];
    
    for (let i = 0; i < updatedTests.length; i++) {
      // Mark current test as running
      updatedTests[i] = { ...updatedTests[i], status: 'running' };
      setTests([...updatedTests]);
      
      // Run the test
      const result = await runSingleTest(updatedTests[i]);
      updatedTests[i] = result;
      
      // Update progress
      const currentProgress = ((i + 1) / updatedTests.length) * 100;
      setProgress(currentProgress);
      setTests([...updatedTests]);
      
      // Small delay to make UI updates visible
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsRunning(false);
    
    // Show summary toast
    const passedTests = updatedTests.filter(t => t.status === 'passed').length;
    const failedTests = updatedTests.filter(t => t.status === 'failed').length;
    
    toast({
      title: 'AI System Validation Complete',
      description: `${passedTests} passed, ${failedTests} failed out of ${updatedTests.length} tests`,
      variant: failedTests > 0 ? 'destructive' : 'default'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-brand-success" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-brand-danger" />;
      case 'running':
        return <Clock className="h-5 w-5 text-brand-primary animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">🤖 AI System Validator</h2>
          <p className="text-muted-foreground">Test all AI functions for 100% operational status</p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          size="lg"
          className="gap-2"
        >
          {isRunning ? 'Running Tests...' : 'Run AI Validation'}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Testing Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results Summary</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  ✅ {passedCount} Passed
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  ❌ {failedCount} Failed
                </Badge>
                <Badge variant="outline">
                  📊 {totalTests} Total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {tests.map((test, index) => (
          <Card key={index} className="transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{test.name}</span>
                {getStatusIcon(test.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className={getStatusColor(test.status)}>
                  {test.status.toUpperCase()}
                </Badge>
                
                {test.responseTime && (
                  <div className="text-xs text-muted-foreground">
                    Response: {test.responseTime}ms
                  </div>
                )}
                
                {test.error && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {test.error}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Function: {test.functionName}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AISystemValidator;