// Analytics & Observability Infrastructure
import { supabase } from '@/integrations/supabase/client';

// Analytics Event Types
export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  module_name: string;
  user_id?: string;
  company_id?: string;
  session_id: string;
  timestamp: string;
  properties: Record<string, any>;
  page_url: string;
  user_agent: string;
  performance_metrics?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  page_load_time: number;
  time_to_interactive: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  memory_usage?: number;
}

export interface ErrorEvent {
  id?: string;
  error_type: 'javascript' | 'network' | 'edge_function' | 'database';
  message: string;
  stack_trace?: string;
  user_id?: string;
  company_id?: string;
  session_id: string;
  module_name: string;
  page_url: string;
  timestamp: string;
  user_agent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, any>;
}

export interface UsageMetrics {
  module_name: string;
  feature_name: string;
  action_type: 'view' | 'click' | 'submit' | 'export' | 'ai_query' | 'upload';
  duration_ms?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  private companyId?: string;
  private isEnabled: boolean = true;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxQueueSize: number = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUser();
    this.setupPerformanceMonitoring();
    this.setupErrorHandling();
    this.startEventFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        this.userId = user.id;
        
        // Get company_id from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          this.companyId = profile.company_id;
        }
      }
    } catch (error) {
      console.warn('Failed to initialize analytics user:', error);
    }
  }

  private setupPerformanceMonitoring() {
    // Web Vitals monitoring
    if (typeof window !== 'undefined') {
      // Page load time
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const metrics: PerformanceMetrics = {
            page_load_time: navigation.loadEventEnd - navigation.loadEventStart,
            time_to_interactive: navigation.domInteractive - navigation.fetchStart,
            largest_contentful_paint: 0,
            cumulative_layout_shift: 0
          };

          // Get memory usage if available
          if ('memory' in performance) {
            metrics.memory_usage = (performance as any).memory.usedJSHeapSize;
          }

          this.trackEvent('page_performance', 'core', {
            performance_metrics: metrics
          });
        }, 1000);
      });

      // Track unload for session duration
      window.addEventListener('beforeunload', () => {
        this.trackEvent('session_end', 'core', {
          session_duration: Date.now() - parseInt(this.sessionId.split('_')[1])
        });
        this.flushEvents();
      });
    }
  }

  private setupErrorHandling() {
    if (typeof window !== 'undefined') {
      // JavaScript errors
      window.addEventListener('error', (event) => {
        this.trackError({
          error_type: 'javascript',
          message: event.message,
          stack_trace: event.error?.stack,
          module_name: this.getCurrentModule(),
          page_url: window.location.href,
          severity: 'high',
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.trackError({
          error_type: 'javascript',
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack_trace: event.reason?.stack,
          module_name: this.getCurrentModule(),
          page_url: window.location.href,
          severity: 'medium',
          context: {
            reason: event.reason
          }
        });
      });
    }
  }

  private getCurrentModule(): string {
    if (typeof window === 'undefined') return 'server';
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments[0] || 'dashboard';
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return;

    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];

      await (supabase as any)
        .from('analytics_events')
        .insert(events);

    } catch (error) {
      console.warn('Failed to flush analytics events:', error);
      // Re-queue events if they failed to send
      this.eventQueue.unshift(...this.eventQueue.slice(-10)); // Keep last 10 events
    }
  }

  private startEventFlush() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }

  public trackEvent(eventType: string, moduleName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      event_type: eventType,
      module_name: moduleName,
      user_id: this.userId,
      company_id: this.companyId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      properties,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : ''
    };

    this.eventQueue.push(event);

    // Flush immediately if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flushEvents();
    }
  }

  public trackError(errorData: Omit<ErrorEvent, 'session_id' | 'timestamp' | 'user_agent' | 'user_id' | 'company_id'>) {
    const error: ErrorEvent = {
      ...errorData,
      user_id: this.userId,
      company_id: this.companyId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : ''
    };

    // Send errors immediately for high/critical severity
    if (error.severity === 'high' || error.severity === 'critical') {
      (supabase as any)
        .from('error_events')
        .insert([error])
        .then(() => {})
        .catch(console.warn);
    } else {
      // Queue for batch processing
      this.eventQueue.push({
        event_type: 'error',
        module_name: error.module_name,
        user_id: this.userId,
        company_id: this.companyId,
        session_id: this.sessionId,
        timestamp: error.timestamp,
        properties: error,
        page_url: error.page_url,
        user_agent: error.user_agent
      });
    }
  }

  public trackUsage(metrics: UsageMetrics) {
    this.trackEvent('feature_usage', metrics.module_name, {
      feature_name: metrics.feature_name,
      action_type: metrics.action_type,
      duration_ms: metrics.duration_ms,
      success: metrics.success,
      ...metrics.metadata
    });
  }

  public trackPageView(pageName: string, moduleName: string, additionalProps: Record<string, any> = {}) {
    this.trackEvent('page_view', moduleName, {
      page_name: pageName,
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      ...additionalProps
    });
  }

  public trackAIInteraction(moduleName: string, query: string, responseTime: number, success: boolean, confidence?: number) {
    this.trackEvent('ai_interaction', moduleName, {
      query_length: query.length,
      response_time_ms: responseTime,
      success,
      confidence_score: confidence,
      query_type: this.categorizeQuery(query)
    });
  }

  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('report') || lowerQuery.includes('analytics')) return 'reporting';
    if (lowerQuery.includes('employee') || lowerQuery.includes('staff')) return 'hr_management';
    if (lowerQuery.includes('compliance') || lowerQuery.includes('law')) return 'compliance';
    if (lowerQuery.includes('payroll') || lowerQuery.includes('salary')) return 'payroll';
    return 'general';
  }

  public disable() {
    this.isEnabled = false;
  }

  public enable() {
    this.isEnabled = true;
  }

  public setUser(userId: string, companyId?: string) {
    this.userId = userId;
    this.companyId = companyId;
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// Convenience functions
export const trackEvent = (eventType: string, moduleName: string, properties?: Record<string, any>) => 
  analytics.trackEvent(eventType, moduleName, properties);

export const trackError = (errorData: Omit<ErrorEvent, 'session_id' | 'timestamp' | 'user_agent' | 'user_id' | 'company_id'>) => 
  analytics.trackError(errorData);

export const trackUsage = (metrics: UsageMetrics) => 
  analytics.trackUsage(metrics);

export const trackPageView = (pageName: string, moduleName: string, additionalProps?: Record<string, any>) => 
  analytics.trackPageView(pageName, moduleName, additionalProps);

export const trackAIInteraction = (moduleName: string, query: string, responseTime: number, success: boolean, confidence?: number) => 
  analytics.trackAIInteraction(moduleName, query, responseTime, success, confidence);