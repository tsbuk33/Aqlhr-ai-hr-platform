// AI Orchestrator Configuration & Feature Flags
// Provides centralized configuration for Context Engineering Engine

export type CostTarget = 'low' | 'balanced' | 'high';

export interface ModuleConfig {
  costTarget: CostTarget;
  enabledProviders?: string[];
  maxTokensOverride?: number;
  temperatureOverride?: number;
  timeoutOverride?: number;
  streamingOverride?: boolean;
}

export interface AIFeatureFlags {
  gensparkFirst: boolean;
  defaultCostTarget: CostTarget;
  allowStreaming: boolean;
  enableIntentClassification: boolean;
  enableRoutingOptimization: boolean;
  enableAnalytics: boolean;
  enableControlRoom: boolean;
  enableRiskAssessment: boolean;
  maxTokens: number;
  defaultTimeout: number;
  modules: Record<string, ModuleConfig>;
}

// Default configuration - matches server-side defaults
export const aiOrchestratorFlags: AIFeatureFlags = {
  // Core orchestration settings
  gensparkFirst: true,
  defaultCostTarget: 'balanced',
  allowStreaming: true,
  enableIntentClassification: true,
  enableRoutingOptimization: true,
  enableAnalytics: true,
  enableControlRoom: true,
  enableRiskAssessment: true,
  
  // Global limits
  maxTokens: 2048,
  defaultTimeout: 30000, // 30 seconds
  
  // Module-specific configurations
  modules: {
    // Government services - balanced performance
    'gov.qiwa': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    'gov.gosi': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    'gov.mudad': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    'gov.absher': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    
    // Employee management - cost-optimized
    'employee': { 
      costTarget: 'low',
      enabledProviders: ['genspark', 'manus', 'openai'],
      maxTokensOverride: 1024,
      streamingOverride: true
    },
    'payroll': { 
      costTarget: 'low',
      enabledProviders: ['genspark', 'manus', 'openai'],
      maxTokensOverride: 1024,
      streamingOverride: false
    },
    
    // Compliance & policy - high performance
    'policy': { 
      costTarget: 'high',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 4096,
      temperatureOverride: 0.1, // More deterministic for compliance
      streamingOverride: true
    },
    'compliance': { 
      costTarget: 'high',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 4096,
      temperatureOverride: 0.1,
      streamingOverride: true
    },
    
    // Analytics & reports - balanced
    'analytics': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: false
    },
    'reports': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: false
    },
    
    // Document management
    'documents': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 3072,
      streamingOverride: true
    },
    
    // General assistant
    'general': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'manus', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    
    // Ask Aql assistant
    'ask-aql': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 3072,
      streamingOverride: true
    }
  }
};

// Configuration manager for runtime flags
class AIConfigManager {
  private _config: AIFeatureFlags;
  private _serverConfig: AIFeatureFlags | null = null;
  private _configPromise: Promise<AIFeatureFlags> | null = null;
  
  constructor() {
    this._config = { ...aiOrchestratorFlags };
  }

  /**
   * Get current configuration (uses cached or default)
   */
  get config(): AIFeatureFlags {
    return this._config;
  }

  /**
   * Get module-specific configuration
   */
  getModuleConfig(moduleContext: string): ModuleConfig {
    return this._config.modules[moduleContext] || this._config.modules['general'];
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof Omit<AIFeatureFlags, 'modules' | 'maxTokens' | 'defaultTimeout' | 'defaultCostTarget'>): boolean {
    return this._config[feature] as boolean;
  }

  /**
   * Get effective cost target for a module
   */
  getCostTarget(moduleContext: string): CostTarget {
    const moduleConfig = this.getModuleConfig(moduleContext);
    return moduleConfig.costTarget || this._config.defaultCostTarget;
  }

  /**
   * Get effective max tokens for a module
   */
  getMaxTokens(moduleContext: string): number {
    const moduleConfig = this.getModuleConfig(moduleContext);
    return moduleConfig.maxTokensOverride || this._config.maxTokens;
  }

  /**
   * Get effective timeout for a module
   */
  getTimeout(moduleContext: string): number {
    const moduleConfig = this.getModuleConfig(moduleContext);
    return moduleConfig.timeoutOverride || this._config.defaultTimeout;
  }

  /**
   * Check if streaming is enabled for a module
   */
  isStreamingEnabled(moduleContext: string): boolean {
    if (!this._config.allowStreaming) return false;
    
    const moduleConfig = this.getModuleConfig(moduleContext);
    return moduleConfig.streamingOverride !== false; // Default to true unless explicitly disabled
  }

  /**
   * Get enabled providers for a module
   */
  getEnabledProviders(moduleContext: string): string[] {
    const moduleConfig = this.getModuleConfig(moduleContext);
    return moduleConfig.enabledProviders || ['genspark', 'openai', 'manus', 'gemini'];
  }

  /**
   * Fetch server configuration and merge with defaults
   */
  async fetchServerConfig(force: boolean = false): Promise<AIFeatureFlags> {
    // Return cached promise if already fetching
    if (this._configPromise && !force) {
      return this._configPromise;
    }

    this._configPromise = this._doFetchServerConfig();
    return this._configPromise;
  }

  private async _doFetchServerConfig(): Promise<AIFeatureFlags> {
    try {
      const response = await fetch('/api/ai/config', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn('Failed to fetch server AI config, using defaults');
        return this._config;
      }

      const serverConfig: AIFeatureFlags = await response.json();
      
      // Merge server config with defaults
      this._serverConfig = serverConfig;
      this._config = this._mergeConfigs(aiOrchestratorFlags, serverConfig);
      
      console.log('[AIConfigManager] Server config loaded:', this._config);
      return this._config;
    } catch (error) {
      console.warn('Error fetching server AI config:', error);
      return this._config;
    }
  }

  /**
   * Merge server configuration with client defaults
   */
  private _mergeConfigs(defaults: AIFeatureFlags, server: Partial<AIFeatureFlags>): AIFeatureFlags {
    const merged = { ...defaults };
    
    // Merge top-level flags
    Object.keys(server).forEach(key => {
      if (key !== 'modules' && server[key as keyof AIFeatureFlags] !== undefined) {
        (merged as any)[key] = server[key as keyof AIFeatureFlags];
      }
    });
    
    // Merge module configurations
    if (server.modules) {
      merged.modules = { ...defaults.modules };
      Object.keys(server.modules).forEach(moduleKey => {
        merged.modules[moduleKey] = {
          ...defaults.modules[moduleKey],
          ...server.modules![moduleKey]
        };
      });
    }
    
    return merged;
  }

  /**
   * Update configuration (for admin interface)
   */
  async updateConfig(updates: Partial<AIFeatureFlags>): Promise<void> {
    try {
      const response = await fetch('/api/ai/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update config: ${response.statusText}`);
      }

      // Refresh config from server
      await this.fetchServerConfig(true);
    } catch (error) {
      console.error('Error updating AI config:', error);
      throw error;
    }
  }

  /**
   * Reset configuration to defaults
   */
  resetToDefaults(): void {
    this._config = { ...aiOrchestratorFlags };
    this._serverConfig = null;
    this._configPromise = null;
  }
}

// Global configuration manager instance
export const aiConfigManager = new AIConfigManager();

// Hook for React components
export function useAIConfig() {
  const [config, setConfig] = React.useState<AIFeatureFlags>(aiConfigManager.config);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchConfig = React.useCallback(async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const newConfig = await aiConfigManager.fetchServerConfig(force);
      setConfig(newConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch config';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = React.useCallback(async (updates: Partial<AIFeatureFlags>) => {
    setLoading(true);
    setError(null);
    
    try {
      await aiConfigManager.updateConfig(updates);
      setConfig(aiConfigManager.config);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update config';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load config on mount
  React.useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    fetchConfig,
    updateConfig,
    isFeatureEnabled: (feature: string) => aiConfigManager.isFeatureEnabled(feature as any),
    getModuleConfig: (moduleContext: string) => aiConfigManager.getModuleConfig(moduleContext),
    getCostTarget: (moduleContext: string) => aiConfigManager.getCostTarget(moduleContext),
    getMaxTokens: (moduleContext: string) => aiConfigManager.getMaxTokens(moduleContext),
    isStreamingEnabled: (moduleContext: string) => aiConfigManager.isStreamingEnabled(moduleContext),
    getEnabledProviders: (moduleContext: string) => aiConfigManager.getEnabledProviders(moduleContext),
  };
}

// React import for the hook (will be imported where needed)
import React from 'react';

export default aiConfigManager;