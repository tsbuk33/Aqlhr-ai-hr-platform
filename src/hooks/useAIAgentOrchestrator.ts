import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

export interface AIAgentConfig {
  provider?: string;
  module: string;
  context?: any;
  enableFallback?: boolean;
}

export interface AIResponse {
  response: string;
  provider: string;
  model: string;
  confidence: number;
  timestamp: string;
}

export const useAIAgentOrchestrator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [providerStatus, setProviderStatus] = useState<Record<string, any>>({});
  const { isArabic } = useSimpleLanguage();

  const queryAIAgent = useCallback(async (
    query: string, 
    config: AIAgentConfig
  ): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      const context = {
        module: config.module,
        language: isArabic ? 'ar' : 'en',
        company_id: 'demo-company',
        user_context: `HR Professional using ${config.module} module`,
        ...config.context
      };

      const { data, error } = await supabase.functions.invoke('ai-agent-orchestrator', {
        body: {
          query,
          context,
          provider: config.provider
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as AIResponse;
    } catch (error) {
      console.error('AI Agent query error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isArabic]);

  const getProviderStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-agent-orchestrator', {
        body: { action: 'status' }
      });

      if (error) {
        throw new Error(error.message);
      }

      setAvailableProviders(data.providers);
      setProviderStatus(data.status);
      
      return data;
    } catch (error) {
      console.error('Error getting provider status:', error);
      throw error;
    }
  }, []);

  const queryMultipleAgents = useCallback(async (
    query: string,
    config: AIAgentConfig,
    providers: string[]
  ): Promise<AIResponse[]> => {
    const results = await Promise.allSettled(
      providers.map(provider => 
        queryAIAgent(query, { ...config, provider })
      )
    );

    return results
      .filter((result): result is PromiseFulfilledResult<AIResponse> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }, [queryAIAgent]);

  const getBestResponse = useCallback(async (
    query: string,
    config: AIAgentConfig
  ): Promise<AIResponse> => {
    // Try multiple providers and return the best response
    const providers = ['openai', 'claude', 'gemini'];
    const responses = await queryMultipleAgents(query, config, providers);
    
    if (responses.length === 0) {
      throw new Error('No providers available');
    }

    // Return the response with highest confidence
    return responses.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }, [queryMultipleAgents]);

  return {
    queryAIAgent,
    queryMultipleAgents,
    getBestResponse,
    getProviderStatus,
    isLoading,
    availableProviders,
    providerStatus
  };
};