import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RoutingRequest {
  intentId: string;
  costTarget?: 'low' | 'balanced' | 'high';
  allowStreaming?: boolean;
  maxTokens?: number;
}

interface RoutingPlan {
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

interface RoutingResponse {
  planId: string;
  plan: RoutingPlan;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extract authorization token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Set auth for RLS
    const token = authHeader.replace('Bearer ', '')
    supabase.auth.setSession({ access_token: token, refresh_token: '' })

    // Parse request body
    const body: RoutingRequest = await req.json()
    const { 
      intentId, 
      costTarget = 'balanced', 
      allowStreaming = true,
      maxTokens = 2048
    } = body

    if (!intentId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: intentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch intent details
    const { data: intent, error: intentError } = await supabase
      .from('ai_intents')
      .select(`
        *,
        ai_sessions!inner(company_id, role)
      `)
      .eq('id', intentId)
      .single()

    if (intentError || !intent) {
      throw new Error('Intent not found or access denied')
    }

    // Get AI control settings for the module
    const { data: settings } = await supabase
      .from('ai_control_settings')
      .select('settings')
      .eq('company_id', intent.ai_sessions.company_id)
      .eq('module_context', intent.module_context)
      .single()

    const moduleSettings = settings?.settings || {}

    // Generate routing plan based on intent characteristics
    const plan = generateRoutingPlan(
      intent,
      costTarget,
      allowStreaming,
      maxTokens,
      moduleSettings
    )

    // Insert routing plan
    const { data: planRecord, error: planError } = await supabase
      .from('ai_routing_plans')
      .insert({
        intent_id: intentId,
        plan: plan,
        cost_target: costTarget,
        allow_streaming: allowStreaming
      })
      .select('id')
      .single()

    if (planError) {
      throw new Error(`Failed to create routing plan: ${planError.message}`)
    }

    const response: RoutingResponse = {
      planId: planRecord.id,
      plan: plan
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Context Route Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateRoutingPlan(
  intent: any,
  costTarget: 'low' | 'balanced' | 'high',
  allowStreaming: boolean,
  maxTokens: number,
  moduleSettings: any
): RoutingPlan {
  
  const { urgency, complexity, intent: intentType, lang } = intent
  
  // Apply module-specific overrides
  const effectiveCostTarget = moduleSettings.costTarget || costTarget
  const effectiveStreaming = moduleSettings.allowStreaming !== undefined ? 
    moduleSettings.allowStreaming : allowStreaming

  // Determine model selection based on complexity and cost target
  const providers: RoutingPlan['providers'] = []

  // Genspark (primary) - always first choice
  const gensparkModel = selectGensparkModel(complexity, effectiveCostTarget)
  if (gensparkModel) {
    providers.push({
      provider: 'genspark',
      model: gensparkModel,
      priority: 1,
      maxTokens: Math.min(maxTokens, getModelMaxTokens('genspark', gensparkModel)),
      temperature: calculateTemperature(intentType, complexity),
      streaming: effectiveStreaming && complexity > 0.3
    })
  }

  // OpenAI (fallback) - second choice for complex queries
  if (complexity > 0.4 || effectiveCostTarget !== 'low') {
    const openaiModel = selectOpenAIModel(complexity, effectiveCostTarget)
    providers.push({
      provider: 'openai',
      model: openaiModel,
      priority: 2,
      maxTokens: Math.min(maxTokens, getModelMaxTokens('openai', openaiModel)),
      temperature: calculateTemperature(intentType, complexity),
      streaming: effectiveStreaming && openaiModel.includes('gpt-4')
    })
  }

  // Gemini (fallback) - third choice, good for multilingual
  if (lang === 'ar' || complexity > 0.6) {
    providers.push({
      provider: 'gemini',
      model: 'gemini-pro',
      priority: 3,
      maxTokens: Math.min(maxTokens, 2048),
      temperature: calculateTemperature(intentType, complexity),
      streaming: effectiveStreaming
    })
  }

  // Manus (fallback) - last resort for simple queries
  if (effectiveCostTarget === 'low' || complexity < 0.3) {
    providers.push({
      provider: 'manus',
      model: 'manus-lite',
      priority: 4,
      maxTokens: Math.min(maxTokens, 1024),
      temperature: 0.1,
      streaming: false
    })
  }

  // Determine timeout based on urgency and streaming
  const timeoutMs = calculateTimeout(urgency, effectiveStreaming)

  return {
    providers,
    costTarget: effectiveCostTarget,
    maxRetries: urgency > 0.7 ? 2 : 3, // Fewer retries for urgent queries
    timeoutMs,
    fallbackEnabled: true,
    streaming: effectiveStreaming && providers.some(p => p.streaming)
  }
}

function selectGensparkModel(complexity: number, costTarget: string): string {
  // Genspark model selection based on complexity and cost
  if (costTarget === 'high' && complexity > 0.7) {
    return 'genspark-pro-max'
  } else if (complexity > 0.5) {
    return 'genspark-pro'
  } else if (costTarget === 'low') {
    return 'genspark-lite'
  } else {
    return 'genspark-standard'
  }
}

function selectOpenAIModel(complexity: number, costTarget: string): string {
  if (costTarget === 'high' && complexity > 0.8) {
    return 'gpt-4-turbo-preview'
  } else if (complexity > 0.6) {
    return 'gpt-4'
  } else if (costTarget === 'low') {
    return 'gpt-3.5-turbo'
  } else {
    return 'gpt-4-turbo'
  }
}

function getModelMaxTokens(provider: string, model: string): number {
  const limits: Record<string, Record<string, number>> = {
    genspark: {
      'genspark-lite': 1024,
      'genspark-standard': 2048,
      'genspark-pro': 4096,
      'genspark-pro-max': 8192
    },
    openai: {
      'gpt-3.5-turbo': 4096,
      'gpt-4': 8192,
      'gpt-4-turbo': 4096,
      'gpt-4-turbo-preview': 4096
    },
    gemini: {
      'gemini-pro': 2048
    },
    manus: {
      'manus-lite': 1024
    }
  }

  return limits[provider]?.[model] || 2048
}

function calculateTemperature(intentType: string, complexity: number): number {
  // Lower temperature for factual queries, higher for creative tasks
  const baseTemp = {
    document_search: 0.1,
    employee_inquiry: 0.2,
    payroll_calculation: 0.1,
    compliance_check: 0.2,
    policy_review: 0.3,
    government_integration: 0.2,
    data_analysis: 0.4,
    technical_support: 0.3,
    general_inquiry: 0.5
  }[intentType] || 0.3

  // Adjust based on complexity
  return Math.min(0.9, baseTemp + (complexity * 0.3))
}

function calculateTimeout(urgency: number, streaming: boolean): number {
  // Base timeout: 30 seconds, reduced for urgent queries, increased for streaming
  let timeout = 30000

  if (urgency > 0.7) {
    timeout *= 0.7 // Reduce timeout for urgent queries
  }

  if (streaming) {
    timeout *= 2 // Double timeout for streaming responses
  }

  return Math.max(15000, Math.min(120000, timeout))
}