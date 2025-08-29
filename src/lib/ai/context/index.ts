// Context Engine - Main exports
export { ContextClient, contextClient } from './ContextClient';
export type {
  IntentRequest,
  IntentResponse,
  RoutingPlan,
  RoutingRequest,
  ExecuteRequest,
  ExecuteResponse,
  ContextClientConfig
} from './ContextClient';

// Comprehensive type definitions
export * from './types';

// Re-export commonly used types for convenience
export type {
  AIProvider,
  CostTarget,
  Language,
  IntentType,
  ModuleContext,
  FeatureFlags,
  ContextEngineError,
  StreamChunk,
  IntentStats,
  RoutingPerformance,
  ControlRoomMetrics
} from './types';

// Constants for easy access
export {
  INTENT_TYPES,
  AI_PROVIDERS,
  COST_TARGETS,
  LANGUAGES,
  MODULE_CONTEXTS
} from './types';