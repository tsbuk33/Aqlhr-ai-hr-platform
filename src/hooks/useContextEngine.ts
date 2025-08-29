import { useState, useCallback, useMemo, useRef } from 'react';
import { 
  contextClient, 
  IntentRequest, 
  IntentResponse, 
  RoutingPlan, 
  ExecuteResponse 
} from '../lib/ai/context/ContextClient';

export interface UseContextEngineOptions {
  defaultCostTarget?: 'low' | 'balanced' | 'high';
  defaultStreaming?: boolean;
  autoExecute?: boolean; // If true, automatically execute after getting routing plan
  debug?: boolean;
}

export interface ContextEngineState {
  isClassifying: boolean;
  isRouting: boolean;
  isExecuting: boolean;
  isLoading: boolean;
  intent: IntentResponse | null;
  routingPlan: RoutingPlan | null;
  result: ExecuteResponse | null;
  stream: ReadableStream | null;
  error: string | null;
}

export interface UseContextEngineReturn extends ContextEngineState {
  // Core actions
  beginIntent: (request: IntentRequest) => Promise<IntentResponse>;
  getRoutingPlan: (intentId: string, options?: { costTarget?: string; streaming?: boolean }) => Promise<RoutingPlan>;
  executeWithPlan: (plan: RoutingPlan, query: string, options?: any) => Promise<ExecuteResponse | ReadableStream>;
  executeQuery: (query: string, moduleContext: string, options?: any) => Promise<void>;
  
  // Utility actions
  reset: () => void;
  clearError: () => void;
  
  // Analytics
  getStats: () => Promise<any>;
  getPerformance: () => Promise<any>;
  
  // Real-time streaming helpers
  streamReader: ReadableStreamDefaultReader<Uint8Array> | null;
  startReading: () => void;
  stopReading: () => void;
}

export function useContextEngine(options: UseContextEngineOptions = {}): UseContextEngineReturn {
  const {
    defaultCostTarget = 'balanced',
    defaultStreaming = false,
    autoExecute = false,
    debug = false,
  } = options;

  // State management
  const [state, setState] = useState<ContextEngineState>({
    isClassifying: false,
    isRouting: false,
    isExecuting: false,
    isLoading: false,
    intent: null,
    routingPlan: null,
    result: null,
    stream: null,
    error: null,
  });

  // Stream reading management
  const streamReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isReadingRef = useRef(false);

  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[useContextEngine]', ...args);
    }
  }, [debug]);

  // Helper to update state
  const updateState = useCallback((updates: Partial<ContextEngineState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Core actions
  const beginIntent = useCallback(async (request: IntentRequest): Promise<IntentResponse> => {
    log('Beginning intent classification:', request);
    
    updateState({ 
      isClassifying: true, 
      isLoading: true, 
      error: null 
    });

    try {
      const intent = await contextClient.beginIntent(request);
      
      updateState({ 
        intent, 
        isClassifying: false, 
        isLoading: false 
      });

      log('Intent classified:', intent);
      return intent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Intent classification failed';
      log('Intent classification error:', error);
      
      updateState({ 
        isClassifying: false, 
        isLoading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  }, [log, updateState]);

  const getRoutingPlan = useCallback(async (
    intentId: string, 
    planOptions?: { costTarget?: string; streaming?: boolean }
  ): Promise<RoutingPlan> => {
    log('Getting routing plan:', { intentId, planOptions });
    
    updateState({ 
      isRouting: true, 
      isLoading: true, 
      error: null 
    });

    try {
      const plan = await contextClient.getRoutingPlan({
        intentId,
        costTarget: (planOptions?.costTarget as any) || defaultCostTarget,
        streaming: planOptions?.streaming ?? defaultStreaming,
      });
      
      updateState({ 
        routingPlan: plan, 
        isRouting: false, 
        isLoading: false 
      });

      log('Routing plan generated:', plan);
      return plan;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Routing plan generation failed';
      log('Routing plan error:', error);
      
      updateState({ 
        isRouting: false, 
        isLoading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  }, [log, updateState, defaultCostTarget, defaultStreaming]);

  const executeWithPlan = useCallback(async (
    plan: RoutingPlan,
    query: string,
    executeOptions?: { context?: string; metadata?: Record<string, any>; stream?: boolean }
  ): Promise<ExecuteResponse | ReadableStream> => {
    log('Executing with plan:', { plan, query, executeOptions });
    
    updateState({ 
      isExecuting: true, 
      isLoading: true, 
      error: null 
    });

    try {
      const result = await contextClient.executeWithPlan(
        plan,
        {
          query,
          context: executeOptions?.context,
          metadata: executeOptions?.metadata,
        },
        { stream: executeOptions?.stream ?? plan.streaming }
      );

      if (result instanceof ReadableStream) {
        updateState({ 
          stream: result, 
          isExecuting: false, 
          isLoading: false 
        });
        log('Streaming execution started:', result);
      } else {
        updateState({ 
          result: result as ExecuteResponse, 
          isExecuting: false, 
          isLoading: false 
        });
        log('Execution completed:', result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Execution failed';
      log('Execution error:', error);
      
      updateState({ 
        isExecuting: false, 
        isLoading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  }, [log, updateState]);

  const executeQuery = useCallback(async (
    query: string,
    moduleContext: string,
    queryOptions?: {
      costTarget?: 'low' | 'balanced' | 'high';
      streaming?: boolean;
      context?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> => {
    log('Executing complete query:', { query, moduleContext, queryOptions });
    
    try {
      // Step 1: Classify intent
      const intent = await beginIntent({ query, moduleContext });
      
      // Step 2: Get routing plan
      const plan = await getRoutingPlan(intent.intentId, {
        costTarget: queryOptions?.costTarget,
        streaming: queryOptions?.streaming,
      });
      
      // Step 3: Execute (if autoExecute is enabled or explicitly requested)
      if (autoExecute) {
        await executeWithPlan(plan, query, {
          context: queryOptions?.context,
          metadata: queryOptions?.metadata,
          stream: queryOptions?.streaming,
        });
      }
    } catch (error) {
      log('Complete query execution error:', error);
      throw error;
    }
  }, [beginIntent, getRoutingPlan, executeWithPlan, autoExecute, log]);

  // Utility actions
  const reset = useCallback(() => {
    log('Resetting context engine state');
    
    // Stop any active stream reading
    if (streamReaderRef.current) {
      streamReaderRef.current.cancel();
      streamReaderRef.current = null;
      isReadingRef.current = false;
    }

    setState({
      isClassifying: false,
      isRouting: false,
      isExecuting: false,
      isLoading: false,
      intent: null,
      routingPlan: null,
      result: null,
      stream: null,
      error: null,
    });
  }, [log]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Analytics helpers
  const getStats = useCallback(async (filters?: any) => {
    try {
      return await contextClient.getIntentStats(filters);
    } catch (error) {
      log('Stats query error:', error);
      throw error;
    }
  }, [log]);

  const getPerformance = useCallback(async (filters?: any) => {
    try {
      return await contextClient.getRoutingPerformance(filters);
    } catch (error) {
      log('Performance query error:', error);
      throw error;
    }
  }, [log]);

  // Stream reading helpers
  const startReading = useCallback(() => {
    if (!state.stream || isReadingRef.current) return;

    log('Starting stream reading');
    isReadingRef.current = true;
    streamReaderRef.current = state.stream.getReader();

    const readChunk = async (): Promise<void> => {
      if (!streamReaderRef.current || !isReadingRef.current) return;

      try {
        const { done, value } = await streamReaderRef.current.read();
        
        if (done) {
          log('Stream reading completed');
          stopReading();
          return;
        }

        // Process chunk (you can emit events here or update additional state)
        if (value) {
          const chunk = new TextDecoder().decode(value);
          log('Stream chunk received:', chunk.length, 'bytes');
          
          // You could emit custom events here for components to listen to
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('contextEngineStreamChunk', {
              detail: { chunk, value }
            }));
          }
        }

        // Continue reading
        readChunk();
      } catch (error) {
        log('Stream reading error:', error);
        stopReading();
      }
    };

    readChunk();
  }, [state.stream, log]);

  const stopReading = useCallback(() => {
    if (streamReaderRef.current) {
      log('Stopping stream reading');
      streamReaderRef.current.cancel();
      streamReaderRef.current = null;
    }
    isReadingRef.current = false;
  }, [log]);

  // Computed properties
  const streamReader = streamReaderRef.current;
  const isLoading = state.isClassifying || state.isRouting || state.isExecuting;

  // Update isLoading in state when computed value changes
  useMemo(() => {
    if (state.isLoading !== isLoading) {
      updateState({ isLoading });
    }
  }, [isLoading, state.isLoading, updateState]);

  return {
    // State
    ...state,
    isLoading,
    
    // Actions
    beginIntent,
    getRoutingPlan,
    executeWithPlan,
    executeQuery,
    reset,
    clearError,
    
    // Analytics
    getStats,
    getPerformance,
    
    // Stream helpers
    streamReader,
    startReading,
    stopReading,
  };
}

// Convenience hooks for specific use cases

/**
 * Hook for simple query execution with automatic intent classification
 */
export function useSimpleQuery(moduleContext: string, options?: UseContextEngineOptions) {
  const engine = useContextEngine({ ...options, autoExecute: true });
  
  const executeSimpleQuery = useCallback(async (
    query: string,
    queryOptions?: {
      costTarget?: 'low' | 'balanced' | 'high';
      streaming?: boolean;
    }
  ) => {
    return engine.executeQuery(query, moduleContext, queryOptions);
  }, [engine, moduleContext]);

  return {
    ...engine,
    executeQuery: executeSimpleQuery,
  };
}

/**
 * Hook for streaming-focused queries
 */
export function useStreamingQuery(moduleContext: string, options?: UseContextEngineOptions) {
  return useContextEngine({ 
    ...options, 
    defaultStreaming: true, 
    autoExecute: true 
  });
}

/**
 * Hook for analytics and monitoring
 */
export function useContextAnalytics() {
  const [statsLoading, setStatsLoading] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getIntentStats = useCallback(async (filters?: any) => {
    setStatsLoading(true);
    setError(null);
    
    try {
      const stats = await contextClient.getIntentStats(filters);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Stats query failed';
      setError(errorMessage);
      throw err;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const getRoutingPerformance = useCallback(async (filters?: any) => {
    setPerformanceLoading(true);
    setError(null);
    
    try {
      const performance = await contextClient.getRoutingPerformance(filters);
      return performance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Performance query failed';
      setError(errorMessage);
      throw err;
    } finally {
      setPerformanceLoading(false);
    }
  }, []);

  return {
    getIntentStats,
    getRoutingPerformance,
    statsLoading,
    performanceLoading,
    error,
    clearError: () => setError(null),
  };
}