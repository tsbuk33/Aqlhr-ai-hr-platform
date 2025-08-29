import { createClient } from '@supabase/supabase-js';
import { aiConfigManager } from '../../config/aiOrchestrator';
import { detectModuleContext } from './moduleContext';

// Types matching Edge function interfaces
export interface IntentRequest {
  query: string;
  moduleContext: string;
  lang?: 'en' | 'ar';
  route?: string;
}

export interface IntentResponse {
  intentId: string;
  sessionId: string;
  intent: string;
  urgency: number;
  complexity: number;
  riskHints: string[];
  confidence: number;
}

export interface RoutingPlan {
  providers: Array<{
    provider: 'genspark' | 'openai' | 'manus' | 'gemini';
    model: string;
    priority: number;
    maxTokens: number;
    temperature: number;
    streaming: boolean;
  }>;
  costTarget: 'low' | 'balanced' | 'high';
  maxRetries: number;
  timeoutMs: number;
  fallbackEnabled: boolean;
  streaming: boolean;
}

export interface RoutingRequest {
  intentId: string;
  costTarget?: 'low' | 'balanced' | 'high';
  streaming?: boolean;
  moduleSettings?: Record<string, any>;
}

export interface ExecuteRequest {
  query: string;
  context?: string;
  metadata?: Record<string, any>;
}

export interface ExecuteResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  success: boolean;
  error?: string;
}

export interface ContextClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  debug?: boolean;
}

export class ContextClient {
  private supabase: any;
  private debug: boolean;

  constructor(config: ContextClientConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    this.debug = config.debug || false;
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[ContextClient]', ...args);
    }
  }

  private getLanguageFromPath(): 'en' | 'ar' {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path.startsWith('/ar') ? 'ar' : 'en';
    }
    return 'en';
  }

  private getRouteFromPath(): string {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  }

  private async getTenantHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    
    try {
      // Get current session
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Add tenant context if available from localStorage or session
      if (typeof window !== 'undefined') {
        const tenantId = localStorage.getItem('tenant_id') || sessionStorage.getItem('tenant_id');
        if (tenantId) {
          headers['X-Tenant-ID'] = tenantId;
        }
      }

      return headers;
    } catch (error) {
      this.log('Error getting tenant headers:', error);
      return {};
    }
  }

  /**
   * Begin intent classification for a query
   */
  async beginIntent(request: IntentRequest): Promise<IntentResponse> {
    this.log('Beginning intent classification:', request);

    try {
      // Check if intent classification is enabled
      if (!aiConfigManager.isFeatureEnabled('enableIntentClassification')) {
        // Return a default intent response if feature is disabled
        return {
          intentId: 'disabled-' + Date.now(),
          sessionId: 'disabled-' + Date.now(),
          intent: 'general',
          urgency: 0.5,
          complexity: 0.5,
          riskHints: [],
          confidence: 1.0
        };
      }

      const headers = await this.getTenantHeaders();
      
      const payload = {
        ...request,
        lang: request.lang || this.getLanguageFromPath(),
        route: request.route || this.getRouteFromPath(),
        moduleContext: request.moduleContext || detectModuleContext(this.getRouteFromPath()),
      };

      const { data, error } = await this.supabase.functions.invoke(
        'context-intent-v1',
        {
          body: payload,
          headers,
        }
      );

      if (error) {
        throw new Error(`Intent classification failed: ${error.message}`);
      }

      this.log('Intent classification successful:', data);
      return data;
    } catch (error) {
      this.log('Intent classification error:', error);
      throw error;
    }
  }

  /**
   * Get routing plan for an intent
   */
  async getRoutingPlan(request: RoutingRequest): Promise<RoutingPlan> {
    this.log('Getting routing plan:', request);

    try {
      // Check if routing optimization is enabled
      if (!aiConfigManager.isFeatureEnabled('enableRoutingOptimization')) {
        // Return a simple routing plan if feature is disabled
        const moduleContext = detectModuleContext(this.getRouteFromPath());
        return {
          providers: [{
            provider: 'genspark',
            model: 'genspark-1',
            priority: 1,
            maxTokens: aiConfigManager.getMaxTokens(moduleContext),
            temperature: 0.7,
            streaming: aiConfigManager.isStreamingEnabled(moduleContext)
          }],
          costTarget: aiConfigManager.getCostTarget(moduleContext),
          maxRetries: 2,
          timeoutMs: aiConfigManager.getTimeout(moduleContext),
          fallbackEnabled: true,
          streaming: aiConfigManager.isStreamingEnabled(moduleContext)
        };
      }

      const headers = await this.getTenantHeaders();

      // Enhance request with configuration
      const moduleContext = detectModuleContext(this.getRouteFromPath());
      const enhancedRequest = {
        ...request,
        costTarget: request.costTarget || aiConfigManager.getCostTarget(moduleContext),
        streaming: request.streaming ?? aiConfigManager.isStreamingEnabled(moduleContext),
        moduleSettings: {
          ...request.moduleSettings,
          enabledProviders: aiConfigManager.getEnabledProviders(moduleContext),
          maxTokens: aiConfigManager.getMaxTokens(moduleContext),
          timeout: aiConfigManager.getTimeout(moduleContext)
        }
      };

      const { data, error } = await this.supabase.functions.invoke(
        'context-route-v1',
        {
          body: enhancedRequest,
          headers,
        }
      );

      if (error) {
        throw new Error(`Routing plan generation failed: ${error.message}`);
      }

      this.log('Routing plan generated:', data);
      return data;
    } catch (error) {
      this.log('Routing plan error:', error);
      throw error;
    }
  }

  /**
   * Execute a query with a routing plan
   */
  async executeWithPlan(
    plan: RoutingPlan,
    request: ExecuteRequest,
    options?: { stream?: boolean }
  ): Promise<ExecuteResponse | ReadableStream> {
    this.log('Executing with plan:', { plan, request, options });

    try {
      const headers = await this.getTenantHeaders();
      
      // Use the Universal AI Orchestrator with the routing plan
      const payload = {
        ...request,
        routingPlan: plan,
        streaming: options?.stream || plan.streaming,
      };

      if (options?.stream || plan.streaming) {
        // Return streaming response
        const response = await fetch('/api/ai/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Streaming request failed: ${response.statusText}`);
        }

        return response.body as ReadableStream;
      } else {
        // Return JSON response
        const { data, error } = await this.supabase.functions.invoke(
          'universal-ai-orchestrator',
          {
            body: payload,
            headers,
          }
        );

        if (error) {
          throw new Error(`Execution failed: ${error.message}`);
        }

        this.log('Execution successful:', data);
        return data;
      }
    } catch (error) {
      this.log('Execution error:', error);
      throw error;
    }
  }

  /**
   * Convenience method: Complete intent-to-execution flow
   */
  async executeQuery(
    query: string,
    moduleContext: string,
    options?: {
      costTarget?: 'low' | 'balanced' | 'high';
      streaming?: boolean;
      context?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<{ intent: IntentResponse; result: ExecuteResponse | ReadableStream }> {
    this.log('Executing complete query flow:', { query, moduleContext, options });

    try {
      // Step 1: Classify intent
      const intent = await this.beginIntent({
        query,
        moduleContext,
      });

      // Step 2: Get routing plan
      const plan = await this.getRoutingPlan({
        intentId: intent.intentId,
        costTarget: options?.costTarget || 'balanced',
        streaming: options?.streaming,
      });

      // Step 3: Execute with plan
      const result = await this.executeWithPlan(
        plan,
        {
          query,
          context: options?.context,
          metadata: options?.metadata,
        },
        { stream: options?.streaming }
      );

      return { intent, result };
    } catch (error) {
      this.log('Complete query flow error:', error);
      throw error;
    }
  }

  /**
   * Get intent statistics for analytics
   */
  async getIntentStats(filters?: {
    moduleContext?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<any> {
    try {
      const headers = await this.getTenantHeaders();

      const { data, error } = await this.supabase.rpc(
        'get_intent_stats_v1',
        filters || {}
      );

      if (error) {
        throw new Error(`Intent stats query failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.log('Intent stats error:', error);
      throw error;
    }
  }

  /**
   * Get routing performance analytics
   */
  async getRoutingPerformance(filters?: {
    provider?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<any> {
    try {
      const headers = await this.getTenantHeaders();

      const { data, error } = await this.supabase.rpc(
        'get_routing_performance_v1',
        filters || {}
      );

      if (error) {
        throw new Error(`Routing performance query failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.log('Routing performance error:', error);
      throw error;
    }
  }

  /**
   * Get AI control settings for a module
   */
  async getControlSettings(moduleContext: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('ai_control_settings')
        .select('*')
        .eq('module_context', moduleContext)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error(`Control settings query failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.log('Control settings error:', error);
      throw error;
    }
  }

  /**
   * Update AI control settings (admin only)
   */
  async updateControlSettings(
    moduleContext: string,
    settings: {
      enabledProviders?: string[];
      defaultCostTarget?: 'low' | 'balanced' | 'high';
      maxTokensOverride?: number;
      temperatureOverride?: number;
      timeoutOverride?: number;
      featureFlags?: Record<string, boolean>;
    }
  ): Promise<void> {
    try {
      const headers = await this.getTenantHeaders();

      const { error } = await this.supabase
        .from('ai_control_settings')
        .upsert({
          module_context: moduleContext,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Control settings update failed: ${error.message}`);
      }

      this.log('Control settings updated:', { moduleContext, settings });
    } catch (error) {
      this.log('Control settings update error:', error);
      throw error;
    }
  }
}

// Default client instance
export const contextClient = new ContextClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  debug: process.env.NODE_ENV === 'development',
});