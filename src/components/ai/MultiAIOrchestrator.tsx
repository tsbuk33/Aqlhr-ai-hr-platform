import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMultiAIOrchestrator, AIProvider, AggregatedResponse } from '@/hooks/useMultiAIOrchestrator';
import { Brain, Cpu, Code, BarChart3, FileText, Mic, Users, Zap, Clock, Target } from 'lucide-react';

const providerIcons: { [key: string]: React.ReactNode } = {
  'nlp': <Brain className="h-4 w-4" />,
  'workflow': <Zap className="h-4 w-4" />,
  'reasoning': <Target className="h-4 w-4" />,
  'code': <Code className="h-4 w-4" />,
  'analysis': <BarChart3 className="h-4 w-4" />,
  'document': <FileText className="h-4 w-4" />,
  'voice': <Mic className="h-4 w-4" />,
  'domain': <Users className="h-4 w-4" />
};

const MultiAIOrchestrator: React.FC = () => {
  const {
    loading,
    providers,
    processPrompt,
    getProviderStatus,
    initializeProviders
  } = useMultiAIOrchestrator();

  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [useMultipleProviders, setUseMultipleProviders] = useState(false);
  const [result, setResult] = useState<AggregatedResponse | null>(null);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);

  const allCapabilities = [
    'arabic-nlp', 'english-nlp', 'sentiment-analysis', 'entity-recognition',
    'workflow-orchestration', 'multi-step-planning', 'complex-reasoning',
    'code-generation', 'data-analysis', 'document-processing'
  ];

  useEffect(() => {
    initializeProviders();
  }, [initializeProviders]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const response = await processPrompt(prompt, {
      language,
      priority,
      capabilities: selectedCapabilities.length > 0 ? selectedCapabilities : ['general-ai'],
      useMultipleProviders,
      context: { module: 'multi-ai-orchestrator' }
    });

    setResult(response);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            Multi-AI Orchestration Framework
          </CardTitle>
          <CardDescription>
            Leverage multiple AI providers for optimal results through intelligent task routing and response aggregation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Prompt Interface</CardTitle>
              <CardDescription>
                Describe your task and let the orchestrator select the best AI providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your prompt here... (e.g., 'Analyze employee satisfaction data and generate insights' or 'Create a Python script for payroll automation')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="min-h-[100px]"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <div className="flex gap-2">
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={language === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('ar')}
                    >
                      العربية
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high', 'critical'].map((p) => (
                      <Button
                        key={p}
                        variant={priority === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriority(p as any)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Required Capabilities (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {allCapabilities.map((capability) => (
                    <Badge
                      key={capability}
                      variant={selectedCapabilities.includes(capability) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedCapabilities(prev =>
                          prev.includes(capability)
                            ? prev.filter(c => c !== capability)
                            : [...prev, capability]
                        );
                      }}
                    >
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="multiple-providers"
                  checked={useMultipleProviders}
                  onChange={(e) => setUseMultipleProviders(e.target.checked)}
                />
                <label htmlFor="multiple-providers" className="text-sm">
                  Use multiple providers for higher accuracy (slower but more reliable)
                </label>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Cpu className="h-4 w-4 mr-2 animate-spin" />
                    Processing with AI Orchestrator...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Execute with Multi-AI System
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  AI Response
                  <div className="flex items-center gap-2">
                    <Badge variant={result.confidence > 0.8 ? 'default' : result.confidence > 0.6 ? 'secondary' : 'destructive'}>
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                    <Badge variant="outline">
                      Quality: {(result.qualityScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="response" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                    <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                  </TabsList>

                  <TabsContent value="response" className="mt-4">
                    <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.finalResponse}
                      </pre>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="sources" className="mt-4">
                    <div className="space-y-4">
                      {result.sources.map((source, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{source.providerId}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant={source.confidence > 0.8 ? 'default' : 'secondary'}>
                                  {(source.confidence * 100).toFixed(0)}%
                                </Badge>
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {source.processingTime}ms
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ScrollArea className="h-32">
                              <p className="text-sm text-muted-foreground">
                                {source.response.substring(0, 200)}
                                {source.response.length > 200 && '...'}
                              </p>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reasoning" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm">{result.reasoning}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Provider Status Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Status</CardTitle>
              <CardDescription>
                Real-time status of available AI providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {providerIcons[provider.category]}
                        <span className="text-sm font-medium">{provider.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(provider.status)}`} />
                        <Badge variant="outline" className="text-xs">
                          {provider.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Priority: {provider.priority} | 
                      Accuracy: <span className={getPerformanceColor(provider.performance.accuracy)}>
                        {(provider.performance.accuracy * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Speed</span>
                        <span>{(provider.performance.speed * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={provider.performance.speed * 100} className="h-1" />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {provider.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {provider.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Active Providers</span>
                  <span className="text-sm font-medium">
                    {providers.filter(p => p.status === 'available').length}/{providers.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Confidence</span>
                  <span className="text-sm font-medium">
                    {result ? `${(result.confidence * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quality Score</span>
                  <span className="text-sm font-medium">
                    {result ? `${(result.qualityScore * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiAIOrchestrator;