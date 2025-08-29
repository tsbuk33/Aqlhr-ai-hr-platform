import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types matching client-side configuration
interface ModuleConfig {
  costTarget: 'low' | 'balanced' | 'high';
  enabledProviders?: string[];
  maxTokensOverride?: number;
  temperatureOverride?: number;
  timeoutOverride?: number;
  streamingOverride?: boolean;
}

interface AIFeatureFlags {
  gensparkFirst: boolean;
  defaultCostTarget: 'low' | 'balanced' | 'high';
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

// Default configuration (matches client-side defaults)
const DEFAULT_CONFIG: AIFeatureFlags = {
  gensparkFirst: true,
  defaultCostTarget: 'balanced',
  allowStreaming: true,
  enableIntentClassification: true,
  enableRoutingOptimization: true,
  enableAnalytics: true,
  enableControlRoom: true,
  enableRiskAssessment: true,
  maxTokens: 2048,
  defaultTimeout: 30000,
  modules: {
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
    'policy': { 
      costTarget: 'high',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 4096,
      temperatureOverride: 0.1,
      streamingOverride: true
    },
    'compliance': { 
      costTarget: 'high',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 4096,
      temperatureOverride: 0.1,
      streamingOverride: true
    },
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
    'documents': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 3072,
      streamingOverride: true
    },
    'general': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'manus', 'gemini'],
      maxTokensOverride: 2048,
      streamingOverride: true
    },
    'ask-aql': { 
      costTarget: 'balanced',
      enabledProviders: ['genspark', 'openai', 'gemini'],
      maxTokensOverride: 3072,
      streamingOverride: true
    }
  }
};

// Cache management
let configCache: {
  data: AIFeatureFlags;
  etag: string;
  lastModified: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method === 'GET') {
      return handleGetConfig(req, user.id);
    } else if (req.method === 'POST') {
      return handleUpdateConfig(req, supabase, user.id);
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('AI Config function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleGetConfig(req: Request, userId: string): Promise<Response> {
  try {
    // Check for conditional requests
    const ifNoneMatch = req.headers.get('If-None-Match');
    const currentTime = Date.now();

    // Use cache if valid and not expired
    if (configCache && 
        (currentTime - configCache.lastModified) < CACHE_TTL &&
        ifNoneMatch === configCache.etag) {
      return new Response(null, {
        status: 304,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ETag': configCache.etag,
          'Cache-Control': 'max-age=300', // 5 minutes
        }
      });
    }

    // Load configuration
    const config = await loadConfiguration();
    const etag = generateETag(config);
    
    // Update cache
    configCache = {
      data: config,
      etag,
      lastModified: currentTime
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'ETag': etag,
      'Cache-Control': 'max-age=300, must-revalidate',
      'Last-Modified': new Date(currentTime).toUTCString()
    };

    return new Response(JSON.stringify(config), { headers });
  } catch (error) {
    console.error('Error handling GET config:', error);
    
    // Return default config on error
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    };

    return new Response(JSON.stringify(DEFAULT_CONFIG), { 
      status: 200, 
      headers 
    });
  }
}

async function handleUpdateConfig(req: Request, supabase: any, userId: string): Promise<Response> {
  try {
    // Check if user has admin permissions
    const hasAdminAccess = await checkAdminAccess(supabase, userId);
    if (!hasAdminAccess) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403, 
          headers: { 
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const updates: Partial<AIFeatureFlags> = await req.json();
    
    // Validate updates
    const validationError = validateConfigUpdates(updates);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { 
          status: 400, 
          headers: { 
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Save configuration (this could be stored in a database table or environment variable)
    await saveConfiguration(updates);
    
    // Invalidate cache
    configCache = null;
    
    const updatedConfig = await loadConfiguration();

    return new Response(JSON.stringify(updatedConfig), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error handling POST config:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update configuration', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}

async function loadConfiguration(): Promise<AIFeatureFlags> {
  try {
    // Try to load from AI_CONFIG environment variable
    const configEnv = Deno.env.get('AI_CONFIG');
    if (configEnv) {
      const parsedConfig = JSON.parse(configEnv);
      return mergeConfigs(DEFAULT_CONFIG, parsedConfig);
    }

    // TODO: Could also load from a database table here
    // const { data, error } = await supabase
    //   .from('ai_control_settings')
    //   .select('*')
    //   .eq('is_global', true)
    //   .single();

    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return DEFAULT_CONFIG;
  }
}

async function saveConfiguration(updates: Partial<AIFeatureFlags>): Promise<void> {
  try {
    // For now, this is a no-op since we're reading from environment variables
    // In a production environment, you might want to save to a database
    
    console.log('Configuration update requested:', updates);
    
    // TODO: Implement persistent storage
    // await supabase
    //   .from('ai_control_settings')
    //   .upsert({
    //     is_global: true,
    //     settings: updates,
    //     updated_at: new Date().toISOString()
    //   });
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw error;
  }
}

async function checkAdminAccess(supabase: any, userId: string): Promise<boolean> {
  try {
    // Check user role in the system
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }

    // Allow Admin and Super-Admin roles
    return data?.role === 'Admin' || data?.role === 'Super-Admin';
  } catch (error) {
    console.error('Error in admin access check:', error);
    return false;
  }
}

function validateConfigUpdates(updates: Partial<AIFeatureFlags>): string | null {
  try {
    // Validate cost targets
    if (updates.defaultCostTarget && !['low', 'balanced', 'high'].includes(updates.defaultCostTarget)) {
      return 'Invalid defaultCostTarget value';
    }

    // Validate boolean flags
    const booleanFields = [
      'gensparkFirst', 'allowStreaming', 'enableIntentClassification',
      'enableRoutingOptimization', 'enableAnalytics', 'enableControlRoom', 'enableRiskAssessment'
    ];
    
    for (const field of booleanFields) {
      if (updates[field as keyof AIFeatureFlags] !== undefined && 
          typeof updates[field as keyof AIFeatureFlags] !== 'boolean') {
        return `Invalid ${field} value - must be boolean`;
      }
    }

    // Validate numeric fields
    if (updates.maxTokens && (typeof updates.maxTokens !== 'number' || updates.maxTokens < 1 || updates.maxTokens > 32000)) {
      return 'Invalid maxTokens value - must be between 1 and 32000';
    }

    if (updates.defaultTimeout && (typeof updates.defaultTimeout !== 'number' || updates.defaultTimeout < 1000)) {
      return 'Invalid defaultTimeout value - must be at least 1000ms';
    }

    // Validate module configurations
    if (updates.modules) {
      for (const [moduleKey, moduleConfig] of Object.entries(updates.modules)) {
        if (moduleConfig.costTarget && !['low', 'balanced', 'high'].includes(moduleConfig.costTarget)) {
          return `Invalid costTarget for module ${moduleKey}`;
        }
        
        if (moduleConfig.enabledProviders && !Array.isArray(moduleConfig.enabledProviders)) {
          return `Invalid enabledProviders for module ${moduleKey} - must be array`;
        }
        
        if (moduleConfig.maxTokensOverride && 
            (typeof moduleConfig.maxTokensOverride !== 'number' || 
             moduleConfig.maxTokensOverride < 1 || 
             moduleConfig.maxTokensOverride > 32000)) {
          return `Invalid maxTokensOverride for module ${moduleKey}`;
        }
        
        if (moduleConfig.temperatureOverride && 
            (typeof moduleConfig.temperatureOverride !== 'number' || 
             moduleConfig.temperatureOverride < 0 || 
             moduleConfig.temperatureOverride > 2)) {
          return `Invalid temperatureOverride for module ${moduleKey}`;
        }
      }
    }

    return null; // No validation errors
  } catch (error) {
    return `Validation error: ${error.message}`;
  }
}

function mergeConfigs(defaults: AIFeatureFlags, overrides: Partial<AIFeatureFlags>): AIFeatureFlags {
  const merged = { ...defaults };
  
  // Merge top-level properties
  Object.keys(overrides).forEach(key => {
    if (key !== 'modules' && overrides[key as keyof AIFeatureFlags] !== undefined) {
      (merged as any)[key] = overrides[key as keyof AIFeatureFlags];
    }
  });
  
  // Merge module configurations
  if (overrides.modules) {
    merged.modules = { ...defaults.modules };
    Object.keys(overrides.modules).forEach(moduleKey => {
      merged.modules[moduleKey] = {
        ...defaults.modules[moduleKey],
        ...overrides.modules![moduleKey]
      };
    });
  }
  
  return merged;
}

function generateETag(config: AIFeatureFlags): string {
  // Simple hash-based ETag generation
  const configString = JSON.stringify(config);
  let hash = 0;
  for (let i = 0; i < configString.length; i++) {
    const char = configString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`;
}