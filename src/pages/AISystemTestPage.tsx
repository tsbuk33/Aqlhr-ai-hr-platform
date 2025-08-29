import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAIAgentOrchestrator } from '@/hooks/useAIAgentOrchestrator';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useLanguage } from "@/hooks/useLanguageCompat";
export default function AISystemTestPage() {
  const { queryAIAgent, getProviderStatus, getBestResponse, isLoading } = useAIAgentOrchestrator();
  const [testQuery, setTestQuery] = useState('What is the current Saudization rate and how can we improve it?');
  const [results, setResults] = useState<any[]>([]);
  const [providerStatus, setProviderStatus] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const testOrchestrator = async () => {
    setResults([]);
    try {
      const config = {
        provider: 'auto',
        module: 'dashboard',
        context: { tenantId: 'demo-tenant', module: 'ai-testing' },
        fallback: true
      };

      const response = await getBestResponse(testQuery, config);
      setResults([{
        test: 'AI Orchestrator - Best Response',
        status: 'success',
        response: response.response,
        provider: response.provider,
        confidence: response.confidence,
        timestamp: response.timestamp
      }]);
    } catch (error) {
      setResults([{
        test: 'AI Orchestrator - Best Response',
        status: 'error',
        error: error.message
      }]);
    }
  };

  const testChatGPT5 = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('chatgpt-5-integration', {
        body: {
          prompt: testQuery,
          model: 'gpt-5-2025-08-07',
          max_completion_tokens: 500,
          context: 'You are an expert HR analytics assistant for AqlHR.'
        }
      });

      if (error) throw error;

      setResults(prev => [...prev, {
        test: 'Direct ChatGPT 5 Test',
        status: data.success ? 'success' : 'error',
        response: data.response,
        model: data.model,
        provider: data.provider,
        usage: data.usage,
        error: data.error
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        test: 'Direct ChatGPT 5 Test',
        status: 'error',
        error: error.message
      }]);
    }
  };

  const testManus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manus-ai-integration', {
        body: {
          prompt: testQuery,
          model: 'manus-hr-expert',
          context: 'Saudi Arabian HR compliance and analytics'
        }
      });

      if (error) throw error;

      setResults(prev => [...prev, {
        test: 'Direct Manus AI Test',
        status: data.success ? 'success' : 'error',
        response: data.response,
        model: data.model,
        provider: data.provider,
        usage: data.usage,
        error: data.error
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        test: 'Direct Manus AI Test',
        status: 'error',
        error: error.message
      }]);
    }
  };

  const checkProviderStatus = async () => {
    setStatusLoading(true);
    try {
      const status = await getProviderStatus();
      setProviderStatus(status);
    } catch (error) {
      setProviderStatus({ error: error.message });
    } finally {
      setStatusLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    await testOrchestrator();
    await testChatGPT5();
    await testManus();
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AI System Test Center</h1>
        <Badge variant="outline">System Validation</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>Configure your AI system test parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Test Query</label>
            <Textarea
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter your test query here..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runAllTests} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run All Tests
            </Button>
            <Button variant="outline" onClick={testOrchestrator} disabled={isLoading}>
              Test Orchestrator
            </Button>
            <Button variant="outline" onClick={testChatGPT5} disabled={isLoading}>
              Test ChatGPT 5
            </Button>
            <Button variant="outline" onClick={testManus} disabled={isLoading}>
              Test Manus AI
            </Button>
            <Button variant="outline" onClick={checkProviderStatus} disabled={statusLoading}>
              {statusLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {providerStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Provider Status</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(providerStatus, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{result.test}</CardTitle>
                  <div className="flex items-center gap-2">
                    {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {result.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                    <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
                {result.provider && (
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Provider: {result.provider}</span>
                    {result.model && <span>Model: {result.model}</span>}
                    {result.confidence && <span>Confidence: {Math.round(result.confidence * 100)}%</span>}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {result.status === 'success' ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Response:</h4>
                      <div className="bg-muted p-4 rounded-md">
                        {result.response}
                      </div>
                    </div>
                    {result.usage && (
                      <div>
                        <h4 className="font-medium mb-2">Usage Statistics:</h4>
                        <pre className="bg-muted p-3 rounded-md text-sm">
                          {JSON.stringify(result.usage, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Error: {result.error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* AI Integration for System Testing */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="ai-system-testing" 
        companyId="demo-company" 
        enabledFeatures={['system-monitoring', 'diagnostic-tools', 'performance-analysis']}
      />
    </div>
  );
}