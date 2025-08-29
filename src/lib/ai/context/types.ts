// Core Context Engine Types
export type AIProvider = 'genspark' | 'openai' | 'manus' | 'gemini';
export type CostTarget = 'low' | 'balanced' | 'high';
export type Language = 'en' | 'ar';
export type IntentType = 
  | 'question' 
  | 'task' 
  | 'analysis' 
  | 'generation' 
  | 'search' 
  | 'conversation' 
  | 'troubleshooting' 
  | 'other';

// Database schema types
export interface AISession {
  id: string;
  company_id: string;
  user_id: string;
  lang: Language;
  route: string;
  module_context: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface AIIntent {
  id: string;
  session_id: string;
  company_id: string;
  user_id: string;
  lang: Language;
  route: string;
  module_context: string;
  query: string;
  intent: IntentType;
  urgency: number; // 0-1
  complexity: number; // 0-1
  risk_hints: string[];
  confidence: number; // 0-1
  created_at: string;
}

export interface AIRoutingPlan {
  id: string;
  intent_id: string;
  company_id: string;
  providers: ProviderConfig[];
  cost_target: CostTarget;
  max_retries: number;
  timeout_ms: number;
  fallback_enabled: boolean;
  streaming: boolean;
  created_at: string;
}

export interface ProviderConfig {
  provider: AIProvider;
  model: string;
  priority: number;
  max_tokens: number;
  temperature: number;
  streaming: boolean;
}

export interface AIRoutingStats {
  id: string;
  routing_plan_id: string;
  company_id: string;
  provider_used: AIProvider;
  model_used: string;
  success: boolean;
  tokens_used: number;
  latency_ms: number;
  cost_estimate: number;
  error_type?: string;
  created_at: string;
}

export interface AIControlSettings {
  id: string;
  company_id: string;
  module_context: string;
  enabled_providers: AIProvider[];
  default_cost_target: CostTarget;
  max_tokens_override?: number;
  temperature_override?: number;
  timeout_override?: number;
  feature_flags: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface AIIntentLabel {
  intent: IntentType;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  color: string;
  icon: string;
}

// API Request/Response types
export interface IntentClassificationRequest {
  query: string;
  moduleContext: string;
  lang?: Language;
  route?: string;
}

export interface IntentClassificationResponse {
  intentId: string;
  sessionId: string;
  intent: IntentType;
  urgency: number;
  complexity: number;
  riskHints: string[];
  confidence: number;
}

export interface RoutingPlanRequest {
  intentId: string;
  costTarget?: CostTarget;
  streaming?: boolean;
  moduleSettings?: Partial<AIControlSettings>;
}

export interface RoutingPlanResponse {
  planId: string;
  providers: ProviderConfig[];
  costTarget: CostTarget;
  maxRetries: number;
  timeoutMs: number;
  fallbackEnabled: boolean;
  streaming: boolean;
}

export interface ExecutionRequest {
  query: string;
  context?: string;
  metadata?: Record<string, any>;
  routingPlan?: RoutingPlanResponse;
}

export interface ExecutionResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

// Analytics types
export interface IntentStats {
  total_intents: number;
  intent_distribution: Array<{
    intent: IntentType;
    count: number;
    percentage: number;
  }>;
  urgency_distribution: Array<{
    urgency_range: string;
    count: number;
    avg_urgency: number;
  }>;
  complexity_distribution: Array<{
    complexity_range: string;
    count: number;
    avg_complexity: number;
  }>;
  module_distribution: Array<{
    module_context: string;
    count: number;
    percentage: number;
  }>;
  hourly_distribution: Array<{
    hour: number;
    count: number;
  }>;
  confidence_stats: {
    avg_confidence: number;
    high_confidence_count: number; // > 0.8
    low_confidence_count: number; // < 0.5
  };
}

export interface RoutingPerformance {
  total_executions: number;
  success_rate: number;
  avg_latency_ms: number;
  provider_performance: Array<{
    provider: AIProvider;
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
    avg_tokens_used: number;
    total_cost_estimate: number;
  }>;
  model_performance: Array<{
    model: string;
    provider: AIProvider;
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
    avg_tokens_used: number;
  }>;
  cost_target_performance: Array<{
    cost_target: CostTarget;
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
    avg_cost_estimate: number;
  }>;
  error_distribution: Array<{
    error_type: string;
    count: number;
    percentage: number;
  }>;
  hourly_performance: Array<{
    hour: number;
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
  }>;
}

// UI Component types
export interface IntentBadgeProps {
  intent: IntentType;
  urgency: number;
  complexity: number;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  lang?: Language;
}

export interface RoutingPlanDisplayProps {
  plan: RoutingPlanResponse;
  showDetails?: boolean;
  lang?: Language;
}

export interface ContextEngineStatusProps {
  isClassifying: boolean;
  isRouting: boolean;
  isExecuting: boolean;
  error?: string | null;
  lang?: Language;
}

// Control Room types
export interface ControlRoomMetrics {
  intentStats: IntentStats;
  routingPerformance: RoutingPerformance;
  realTimeStats: {
    active_sessions: number;
    requests_per_minute: number;
    avg_response_time: number;
    error_rate: number;
  };
  moduleStats: Array<{
    module_context: string;
    total_requests: number;
    success_rate: number;
    avg_latency: number;
    popular_intents: Array<{
      intent: IntentType;
      count: number;
    }>;
  }>;
}

export interface ControlRoomSettings extends AIControlSettings {
  // Extended settings for admin interface
  monitoring_enabled: boolean;
  alert_thresholds: {
    error_rate: number;
    latency_ms: number;
    cost_per_hour: number;
  };
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
}

// Feature flag types
export interface FeatureFlags {
  enableContextEngine: boolean;
  enableIntentClassification: boolean;
  enableRoutingOptimization: boolean;
  enableStreamingFallback: boolean;
  enableCostOptimization: boolean;
  enableAnalytics: boolean;
  enableControlRoom: boolean;
  enableGesparkPrimary: boolean;
  enableMultiProvider: boolean;
  enableRiskAssessment: boolean;
}

// Module context definitions
export type ModuleContext = 
  | 'ask-aql'
  | 'gov.qiwa'
  | 'employee'
  | 'payroll'
  | 'compliance'
  | 'analytics'
  | 'documents'
  | 'reports'
  | 'settings'
  | 'general';

// Error types
export interface ContextEngineError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  module_context?: string;
  intent_id?: string;
  session_id?: string;
}

// Streaming types
export interface StreamChunk {
  id: string;
  content: string;
  type: 'content' | 'metadata' | 'error' | 'end';
  timestamp: string;
  provider?: AIProvider;
  model?: string;
}

export interface StreamingConfig {
  enabled: boolean;
  chunkSize: number;
  bufferTimeout: number;
  reconnectAttempts: number;
  heartbeatInterval: number;
}

// Configuration types
export interface ContextEngineConfig {
  providers: {
    genspark: {
      enabled: boolean;
      apiKey: string;
      baseUrl: string;
      defaultModel: string;
      priority: number;
    };
    openai: {
      enabled: boolean;
      apiKey: string;
      organization?: string;
      defaultModel: string;
      priority: number;
    };
    manus: {
      enabled: boolean;
      apiKey: string;
      baseUrl: string;
      defaultModel: string;
      priority: number;
    };
    gemini: {
      enabled: boolean;
      apiKey: string;
      defaultModel: string;
      priority: number;
    };
  };
  routing: {
    maxRetries: number;
    baseTimeout: number;
    fallbackEnabled: boolean;
    costOptimization: boolean;
  };
  intent: {
    confidenceThreshold: number;
    fallbackToRules: boolean;
    cacheEnabled: boolean;
    cacheTTL: number;
  };
  analytics: {
    enabled: boolean;
    retentionDays: number;
    aggregationInterval: number;
  };
  streaming: StreamingConfig;
  featureFlags: FeatureFlags;
}

// Hook return types (extending what's already in useContextEngine.ts)
export interface UseContextEngineOptions {
  defaultCostTarget?: CostTarget;
  defaultStreaming?: boolean;
  autoExecute?: boolean;
  debug?: boolean;
  retryOnFailure?: boolean;
  maxRetries?: number;
}

// Utility types
export type Awaitable<T> = T | Promise<T>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Constants
export const INTENT_TYPES: IntentType[] = [
  'question',
  'task', 
  'analysis',
  'generation',
  'search',
  'conversation',
  'troubleshooting',
  'other'
];

export const AI_PROVIDERS: AIProvider[] = [
  'genspark',
  'openai', 
  'manus',
  'gemini'
];

export const COST_TARGETS: CostTarget[] = [
  'low',
  'balanced', 
  'high'
];

export const LANGUAGES: Language[] = ['en', 'ar'];

export const MODULE_CONTEXTS: ModuleContext[] = [
  'ask-aql',
  'gov.qiwa',
  'employee',
  'payroll', 
  'compliance',
  'analytics',
  'documents',
  'reports',
  'settings',
  'general'
];