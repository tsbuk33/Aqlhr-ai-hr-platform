import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { localAI } from '@/lib/LocalAIEngine';
import { Brain, Code, MessageCircle, Search, BarChart3, FileText, Zap, Cpu } from 'lucide-react';

export const EnhancedAIShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [activeDemo, setActiveDemo] = useState('conversation');
  const [results, setResults] = useState<any>({});
  const [input, setInput] = useState('');

  useEffect(() => {
    loadModelStatus();
  }, []);

  const loadModelStatus = async () => {
    try {
      const status = await localAI.getModelStatus();
      setModelStatus(status);
    } catch (error) {
      console.error('Error loading model status:', error);
    }
  };

  const runDemo = async (type: string) => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    let result;

    try {
      switch (type) {
        case 'conversation':
          result = await localAI.generateConversation(input);
          break;
        case 'qa':
          result = await localAI.answerQuestion(input, 'AqlHR is a comprehensive HR management system for Saudi Arabia, providing payroll, compliance, and workforce analytics.');
          break;
        case 'analysis':
          result = await localAI.analyzeText(input);
          break;
        case 'summary':
          result = await localAI.summarizeContent(input);
          break;
        case 'code':
          result = await localAI.generateCode(input);
          break;
        case 'embeddings':
          result = await localAI.generateEmbeddings([input]);
          break;
        default:
          result = await localAI.generateContent(input);
      }

      setResults({ ...results, [type]: result });
    } catch (error) {
      setResults({ ...results, [type]: { success: false, error: error.message } });
    } finally {
      setIsLoading(false);
    }
  };

  const capabilities = [
    {
      id: 'conversation',
      title: 'Advanced Conversation',
      icon: MessageCircle,
      description: 'DialoGPT-Large for natural conversations',
      model: 'microsoft/DialoGPT-large',
      color: 'text-blue-500'
    },
    {
      id: 'qa',
      title: 'Question Answering',
      icon: Search,
      description: 'RoBERTa-based Q&A system',
      model: 'deepset/roberta-base-squad2',
      color: 'text-green-500'
    },
    {
      id: 'analysis',
      title: 'Text Analysis',
      icon: BarChart3,
      description: 'Sentiment & embeddings analysis',
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      color: 'text-purple-500'
    },
    {
      id: 'summary',
      title: 'Summarization',
      icon: FileText,
      description: 'BART-Large for text summarization',
      model: 'facebook/bart-large-cnn',
      color: 'text-orange-500'
    },
    {
      id: 'code',
      title: 'Code Generation',
      icon: Code,
      description: 'CodeGPT for programming tasks',
      model: 'microsoft/CodeGPT-small-py',
      color: 'text-red-500'
    },
    {
      id: 'embeddings',
      title: 'Embeddings',
      icon: Brain,
      description: 'Vector embeddings for similarity',
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      color: 'text-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>Enhanced Open-Source AI Capabilities</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              const isActive = modelStatus?.capabilities[capability.id.replace('-', '_')] || false;
              
              return (
                <Card 
                  key={capability.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activeDemo === capability.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveDemo(capability.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 ${capability.color} mt-1`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{capability.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{capability.description}</p>
                        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                          {isActive ? 'Ready' : 'Loading'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {modelStatus && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-4 w-4" />
                  <span className="font-semibold">Model Status</span>
                  <Badge variant="outline">{modelStatus.loaded_models} models loaded</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Device:</span>
                    <p className="font-medium">WebGPU</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ready:</span>
                    <p className="font-medium">{modelStatus.performance.ready ? '✅ Yes' : '⏳ Loading'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Models:</span>
                    <p className="font-medium">{modelStatus.loaded_models}/7</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <p className="font-medium">100% Open-Source</p>
                  </div>
                </div>
                <Progress 
                  value={(modelStatus.loaded_models / 7) * 100} 
                  className="mt-3"
                />
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <Textarea
              placeholder={`Try the ${capabilities.find(c => c.id === activeDemo)?.title} model...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={() => runDemo(activeDemo)}
                disabled={isLoading || !input.trim()}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {isLoading ? 'Processing...' : `Test ${capabilities.find(c => c.id === activeDemo)?.title}`}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setInput('');
                  setResults({});
                }}
              >
                Clear
              </Button>
            </div>

            {results[activeDemo] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60">
                    {JSON.stringify(results[activeDemo], null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="mt-6 border-dashed">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">🚀 Future Enhancements</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Coming Soon</Badge>
                  <span>GPT-OSS-120B integration (when available)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">API Ready</Badge>
                  <span>Manus.im API integration via Edge Functions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Planned</Badge>
                  <span>Additional Hugging Face models for specialized tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};