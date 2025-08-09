import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Cpu, Zap, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { localAI } from '@/lib/LocalAIEngine';

export const LocalAIStatus: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);

  const initializeAI = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const success = await localAI.initializeModels();
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setModelsLoaded(success);
      
      if (success) {
        await runTests();
      }
    } catch (error) {
      console.error('AI initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runTests = async () => {
    const tests = [
      {
        name: 'Text Generation',
        test: () => localAI.generateContent('Create a brief HR policy overview', 'document')
      },
      {
        name: 'Sentiment Analysis', 
        test: () => localAI.analyzeText('Our employees are highly satisfied with the new policies and benefits.')
      },
      {
        name: 'Content Summarization',
        test: () => localAI.summarizeContent('Human Resources management involves recruiting, training, and retaining employees. It includes policy development, performance management, compensation planning, and ensuring workplace compliance. Modern HR departments use data analytics to improve decision-making and employee engagement.')
      },
      {
        name: 'Embeddings Generation',
        test: () => localAI.generateEmbeddings(['employee satisfaction', 'performance metrics', 'compensation analysis'])
      }
    ];

    const results = [];
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({
          name: test.name,
          success: result.success,
          status: result.success ? 'passed' : 'failed',
          details: result
        });
      } catch (error) {
        results.push({
          name: test.name,
          success: false,
          status: 'error',
          error: error.message
        });
      }
    }
    
    setTestResults(results);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Open-Source AI Engine Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span className="text-sm font-medium">WebGPU Acceleration</span>
            <Badge variant={(navigator as any).gpu ? "default" : "secondary"}>
              {(navigator as any).gpu ? "Available" : "CPU Only"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Models Status</span>
            <Badge variant={modelsLoaded ? "default" : "outline"}>
              {modelsLoaded ? "Loaded" : "Not Loaded"}
            </Badge>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading AI models...</span>
            </div>
            <Progress value={loadingProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {loadingProgress < 30 && "Downloading text generation model..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Loading sentiment analysis model..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Initializing embeddings model..."}
              {loadingProgress >= 90 && "Finalizing setup..."}
            </p>
          </div>
        )}

        {!modelsLoaded && !isLoading && (
          <Button onClick={initializeAI} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Initialize Open-Source AI Models
          </Button>
        )}

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">AI Capabilities Test Results</h4>
            <div className="grid gap-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{result.name}</span>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {modelsLoaded && (
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                All AI models loaded successfully! 
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Using local processing - no API limits or costs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};