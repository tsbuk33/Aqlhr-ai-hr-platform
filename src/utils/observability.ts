import { supabase } from '@/integrations/supabase/client';

export interface RateLimitOptions {
  tenantId: string;
  surveyId?: string;
  waveId?: string;
  actionType: string;
  maxPerMinute?: number;
}

export interface ObservabilityOptions {
  tenantId?: string;
  actionType: string;
  functionName?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

export class ObservabilityManager {
  private static instance: ObservabilityManager;
  
  static getInstance(): ObservabilityManager {
    if (!ObservabilityManager.instance) {
      ObservabilityManager.instance = new ObservabilityManager();
    }
    return ObservabilityManager.instance;
  }

  /**
   * Check if rate limit is exceeded
   */
  async checkRateLimit(options: RateLimitOptions): Promise<boolean> {
    try {
      const windowStart = new Date();
      windowStart.setSeconds(0, 0); // Start of current minute
      
      const { data: rateLimits, error } = await supabase
        .from('tool_usage_analytics') // Using existing table as fallback
        .select('*')
        .eq('company_id', options.tenantId)
        .eq('action_type', options.actionType)
        .gte('created_at', windowStart.toISOString());

      if (error) {
        console.error('Rate limit check failed:', error);
        return true; // Allow on error
      }

      const currentCount = rateLimits?.length || 0;
      const maxAllowed = options.maxPerMinute || 3;

      return currentCount < maxAllowed;
    } catch (error) {
      console.error('Rate limit error:', error);
      return true; // Allow on error
    }
  }

  /**
   * Log start of an agent action
   */
  async logActionStart(options: ObservabilityOptions): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('tool_usage_analytics')
        .insert({
          company_id: options.tenantId || null,
          action_type: options.actionType,
          tool_name: options.functionName || 'unknown',
          metadata: options.metadata || {},
          success: true, // Will be updated on completion
          execution_time_ms: null
        })
        .select()
        .single();

      if (error) {
        console.error('Action logging failed:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Action logging error:', error);
      return null;
    }
  }

  /**
   * Log completion of an agent action
   */
  async logActionComplete(
    actionId: string,
    status: 'success' | 'error' | 'timeout',
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('tool_usage_analytics')
        .update({
          success: status === 'success',
          error_message: errorMessage || null,
          execution_time_ms: metadata?.execution_time_ms || null,
          metadata: metadata || {}
        })
        .eq('id', actionId);

      if (error) {
        console.error('Action completion logging failed:', error);
      }
    } catch (error) {
      console.error('Action completion error:', error);
    }
  }

  /**
   * Instrument a function with observability
   */
  async instrumentFunction<T>(
    options: ObservabilityOptions,
    fn: () => Promise<T>
  ): Promise<T> {
    const actionId = await this.logActionStart(options);
    const startTime = Date.now();

    try {
      const result = await fn();
      
      if (actionId) {
        await this.logActionComplete(actionId, 'success', undefined, {
          execution_time_ms: Date.now() - startTime
        });
      }

      return result;
    } catch (error) {
      if (actionId) {
        await this.logActionComplete(
          actionId,
          'error',
          error instanceof Error ? error.message : 'Unknown error',
          {
            execution_time_ms: Date.now() - startTime,
            error_details: error instanceof Error ? error.stack : error
          }
        );
      }
      throw error;
    }
  }

  /**
   * Check rate limit and instrument function
   */
  async withRateLimitAndObservability<T>(
    rateLimitOptions: RateLimitOptions,
    observabilityOptions: ObservabilityOptions,
    fn: () => Promise<T>
  ): Promise<T> {
    // Check rate limit first
    const canProceed = await this.checkRateLimit(rateLimitOptions);
    
    if (!canProceed) {
      throw new Error(`Rate limit exceeded for ${rateLimitOptions.actionType}. Max ${rateLimitOptions.maxPerMinute || 3} requests per minute.`);
    }

    // Execute with observability
    return this.instrumentFunction(observabilityOptions, fn);
  }
}

// Export singleton instance
export const observability = ObservabilityManager.getInstance();

// Helper functions for common patterns
export const withObservability = <T>(
  options: ObservabilityOptions,
  fn: () => Promise<T>
): Promise<T> => observability.instrumentFunction(options, fn);

export const checkRateLimit = (options: RateLimitOptions): Promise<boolean> =>
  observability.checkRateLimit(options);

export const withRateLimitAndObservability = <T>(
  rateLimitOptions: RateLimitOptions,
  observabilityOptions: ObservabilityOptions,
  fn: () => Promise<T>
): Promise<T> =>
  observability.withRateLimitAndObservability(rateLimitOptions, observabilityOptions, fn);