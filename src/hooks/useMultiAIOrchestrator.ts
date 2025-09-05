import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIProvider {
  id: string;
  name: string;
  category: 'nlp' | 'workflow' | 'reasoning' | 'code' | 'analysis' | 'document' | 'voice' | 'domain';
  priority: number;
  status: 'available' | 'busy' | 'offline';
  capabilities: string[];
  performance: {
    accuracy: number;
    speed: number;
    cost: number;
  };
}

export interface AITask {
  id: string;
  type: string;
  prompt: string;
  context: any;
  language: 'en' | 'ar';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiredCapabilities: string[];
}

export interface AIResponse {
  providerId: string;
  response: string;
  confidence: number;
  processingTime: number;
  metadata: any;
}

export interface AggregatedResponse {
  finalResponse: string;
  confidence: number;
  sources: AIResponse[];
  reasoning: string;
  qualityScore: number;
}

export function useMultiAIOrchestrator() {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [taskQueue, setTaskQueue] = useState<AITask[]>([]);

  // Initialize available AI providers
  const initializeProviders = useCallback(async () => {
    const defaultProviders: AIProvider[] = [
      {
        id: 'huggingface-transformers',
        name: 'Hugging Face Transformers',
        category: 'nlp',
        priority: 1,
        status: 'available',
        capabilities: ['arabic-nlp', 'english-nlp', 'sentiment-analysis', 'entity-recognition', 'text-classification'],
        performance: { accuracy: 0.92, speed: 0.8, cost: 0.1 }
      },
      {
        id: 'langchain-workflow',
        name: 'LangChain Workflow',
        category: 'workflow',
        priority: 1,
        status: 'available',
        capabilities: ['workflow-orchestration', 'multi-step-planning', 'tool-integration', 'memory-management'],
        performance: { accuracy: 0.88, speed: 0.6, cost: 0.3 }
      },
      {
        id: 'gpt-reasoning',
        name: 'GPT Reasoning Engine',
        category: 'reasoning',
        priority: 1,
        status: 'available',
        capabilities: ['complex-reasoning', 'decision-making', 'problem-solving', 'explanation-generation'],
        performance: { accuracy: 0.95, speed: 0.7, cost: 0.8 }
      },
      {
        id: 'codet5-generator',
        name: 'CodeT5 Generator',
        category: 'code',
        priority: 1,
        status: 'available',
        capabilities: ['code-generation', 'automation-scripts', 'api-integration', 'bug-detection'],
        performance: { accuracy: 0.85, speed: 0.9, cost: 0.2 }
      },
      {
        id: 'pandasai-analyzer',
        name: 'PandasAI Analyzer',
        category: 'analysis',
        priority: 1,
        status: 'available',
        capabilities: ['data-analysis', 'statistical-insights', 'chart-generation', 'trend-analysis'],
        performance: { accuracy: 0.90, speed: 0.85, cost: 0.15 }
      }
    ];

    setProviders(defaultProviders);
    return defaultProviders;
  }, []);

  // Task routing logic - select best AI provider for task
  const selectBestProvider = useCallback((task: AITask, availableProviders: AIProvider[]): AIProvider | null => {
    // Filter providers by required capabilities
    const capableProviders = availableProviders.filter(provider =>
      provider.status === 'available' &&
      task.requiredCapabilities.every(cap => provider.capabilities.includes(cap))
    );

    if (capableProviders.length === 0) return null;

    // Score providers based on task requirements
    const scoredProviders = capableProviders.map(provider => {
      let score = 0;

      // Priority weight
      score += (5 - provider.priority) * 0.2;

      // Performance weights based on task priority
      switch (task.priority) {
        case 'critical':
          score += provider.performance.accuracy * 0.6 + provider.performance.speed * 0.3;
          break;
        case 'high':
          score += provider.performance.accuracy * 0.5 + provider.performance.speed * 0.4;
          break;
        case 'medium':
          score += provider.performance.accuracy * 0.4 + provider.performance.speed * 0.4 + (1 - provider.performance.cost) * 0.2;
          break;
        case 'low':
          score += provider.performance.accuracy * 0.3 + (1 - provider.performance.cost) * 0.5 + provider.performance.speed * 0.2;
          break;
      }

      // Language-specific bonuses
      if (task.language === 'ar' && provider.capabilities.includes('arabic-nlp')) {
        score += 0.1;
      }

      return { provider, score };
    });

    // Return provider with highest score
    return scoredProviders.sort((a, b) => b.score - a.score)[0].provider;
  }, []);

  // Execute task with selected provider
  const executeTask = useCallback(async (task: AITask, provider: AIProvider): Promise<AIResponse> => {
    const startTime = Date.now();

    try {
      // Call appropriate edge function based on provider
      let response;
      
      switch (provider.id) {
        case 'huggingface-transformers':
          response = await supabase.functions.invoke('huggingface-nlp-processor', {
            body: {
              prompt: task.prompt,
              context: task.context,
              language: task.language,
              capabilities: task.requiredCapabilities
            }
          });
          break;

        case 'langchain-workflow':
          response = await supabase.functions.invoke('langchain-workflow-processor', {
            body: {
              prompt: task.prompt,
              context: task.context,
              workflowType: task.type
            }
          });
          break;

        case 'gpt-reasoning':
          response = await supabase.functions.invoke('ai-agent-orchestrator', {
            body: {
              query: task.prompt,
              context: { ...task.context, module: 'reasoning' },
              provider: 'chatgpt'
            }
          });
          break;

        case 'codet5-generator':
          response = await supabase.functions.invoke('code-generation-processor', {
            body: {
              description: task.prompt,
              context: task.context,
              language: 'python'
            }
          });
          break;

        case 'pandasai-analyzer':
          response = await supabase.functions.invoke('data-analysis-processor', {
            body: {
              query: task.prompt,
              data: task.context.data,
              analysisType: task.type
            }
          });
          break;

        default:
          throw new Error(`Unknown provider: ${provider.id}`);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        providerId: provider.id,
        response: response.data?.result || response.data?.response || 'No response',
        confidence: response.data?.confidence || 0.8,
        processingTime,
        metadata: response.data?.metadata || {}
      };

    } catch (error) {
      console.error(`Error executing task with provider ${provider.id}:`, error);
      
      return {
        providerId: provider.id,
        response: `Error: ${error.message}`,
        confidence: 0,
        processingTime: Date.now() - startTime,
        metadata: { error: true }
      };
    }
  }, []);

  // Aggregate responses from multiple providers
  const aggregateResponses = useCallback((responses: AIResponse[]): AggregatedResponse => {
    if (responses.length === 0) {
      return {
        finalResponse: 'No responses available',
        confidence: 0,
        sources: [],
        reasoning: 'No AI providers responded',
        qualityScore: 0
      };
    }

    // Filter out error responses
    const validResponses = responses.filter(r => r.confidence > 0);
    
    if (validResponses.length === 0) {
      return {
        finalResponse: 'All AI providers encountered errors',
        confidence: 0,
        sources: responses,
        reasoning: 'All providers failed to generate valid responses',
        qualityScore: 0
      };
    }

    // Select best response based on confidence and provider performance
    const bestResponse = validResponses.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    // Calculate quality score
    const avgConfidence = validResponses.reduce((sum, r) => sum + r.confidence, 0) / validResponses.length;
    const responseConsistency = validResponses.length > 1 ? 
      validResponses.filter(r => r.response.length > bestResponse.response.length * 0.8).length / validResponses.length : 1;
    
    const qualityScore = (avgConfidence * 0.6 + responseConsistency * 0.4);

    return {
      finalResponse: bestResponse.response,
      confidence: bestResponse.confidence,
      sources: responses,
      reasoning: `Selected response from ${bestResponse.providerId} based on highest confidence (${bestResponse.confidence.toFixed(2)})`,
      qualityScore
    };
  }, []);

  // Main orchestration function
  const processPrompt = useCallback(async (
    prompt: string,
    options: {
      language?: 'en' | 'ar';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      context?: any;
      capabilities?: string[];
      useMultipleProviders?: boolean;
    } = {}
  ): Promise<AggregatedResponse> => {
    setLoading(true);

    try {
      // Create task
      const task: AITask = {
        id: `task_${Date.now()}`,
        type: 'general',
        prompt,
        context: options.context || {},
        language: options.language || 'en',
        priority: options.priority || 'medium',
        requiredCapabilities: options.capabilities || ['general-ai']
      };

      // Initialize providers if needed
      let currentProviders = providers;
      if (currentProviders.length === 0) {
        currentProviders = await initializeProviders();
      }

      // Select appropriate providers
      const primaryProvider = selectBestProvider(task, currentProviders);
      if (!primaryProvider) {
        throw new Error('No suitable AI provider found for this task');
      }

      // Execute with primary provider
      const responses: AIResponse[] = [];
      const primaryResponse = await executeTask(task, primaryProvider);
      responses.push(primaryResponse);

      // If multiple providers requested and primary response has low confidence, try backup
      if (options.useMultipleProviders && primaryResponse.confidence < 0.7) {
        const backupProviders = currentProviders
          .filter(p => p.id !== primaryProvider.id && p.status === 'available')
          .slice(0, 2); // Try up to 2 backup providers

        const backupPromises = backupProviders.map(provider =>
          executeTask(task, provider).catch(error => ({
            providerId: provider.id,
            response: `Backup provider error: ${error.message}`,
            confidence: 0,
            processingTime: 0,
            metadata: { error: true }
          }))
        );

        const backupResponses = await Promise.all(backupPromises);
        responses.push(...backupResponses);
      }

      // Aggregate and return final response
      return aggregateResponses(responses);

    } catch (error) {
      console.error('Multi-AI orchestration error:', error);
      
      return {
        finalResponse: `Orchestration error: ${error.message}`,
        confidence: 0,
        sources: [],
        reasoning: 'System error in AI orchestration',
        qualityScore: 0
      };
    } finally {
      setLoading(false);
    }
  }, [providers, initializeProviders, selectBestProvider, executeTask, aggregateResponses]);

  // Get provider status
  const getProviderStatus = useCallback(async () => {
    // This would typically ping each provider to check status
    return providers.map(provider => ({
      ...provider,
      lastChecked: new Date().toISOString()
    }));
  }, [providers]);

  // Update provider performance metrics
  const updateProviderMetrics = useCallback((providerId: string, metrics: Partial<AIProvider['performance']>) => {
    setProviders(prev => prev.map(provider =>
      provider.id === providerId
        ? { ...provider, performance: { ...provider.performance, ...metrics } }
        : provider
    ));
  }, []);

  return {
    loading,
    providers,
    taskQueue,
    processPrompt,
    getProviderStatus,
    updateProviderMetrics,
    initializeProviders
  };
}