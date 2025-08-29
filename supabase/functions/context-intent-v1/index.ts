import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntentRequest {
  query: string;
  moduleContext: string;
  lang: 'en' | 'ar';
  route: string;
  userAgent?: string;
  stream?: boolean;
}

interface IntentResponse {
  intentId: string;
  sessionId: string;
  intent: string;
  urgency: number;
  complexity: number;
  riskHints: string[];
  confidence: number;
}

interface GensparkIntentClassification {
  intent: string;
  urgency: number;
  complexity: number;
  riskHints: string[];
  confidence: number;
  reasoning: string;
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

    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Invalid token or user not found')
    }

    // Parse request body
    const body: IntentRequest = await req.json()
    const { query, moduleContext, lang, route, userAgent } = body

    if (!query || !moduleContext || !lang || !route) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: query, moduleContext, lang, route' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's company ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      throw new Error('User company not found')
    }

    const companyId = profile.company_id
    const userRole = profile.role || 'employee'

    // Find or create AI session
    let sessionId: string
    
    // Look for recent session (within last 4 hours)
    const { data: existingSessions } = await supabase
      .from('ai_sessions')
      .select('id')
      .eq('company_id', companyId)
      .eq('user_id', user.id)
      .eq('role', userRole)
      .eq('lang', lang)
      .gte('updated_at', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)

    if (existingSessions && existingSessions.length > 0) {
      sessionId = existingSessions[0].id
      
      // Update session activity
      await supabase
        .from('ai_sessions')
        .update({ 
          updated_at: new Date().toISOString(),
          route: route 
        })
        .eq('id', sessionId)
    } else {
      // Create new session
      const { data: newSession, error: sessionError } = await supabase
        .from('ai_sessions')
        .insert({
          company_id: companyId,
          user_id: user.id,
          role: userRole,
          lang: lang,
          route: route,
          user_agent: userAgent
        })
        .select('id')
        .single()

      if (sessionError) {
        throw new Error(`Failed to create session: ${sessionError.message}`)
      }

      sessionId = newSession.id
    }

    // Call Genspark for intent classification
    const gensparkClassification = await classifyIntentWithGenspark(query, moduleContext, lang, userRole)

    // Insert AI intent record
    const { data: intentRecord, error: intentError } = await supabase
      .from('ai_intents')
      .insert({
        session_id: sessionId,
        company_id: companyId,
        user_id: user.id,
        lang: lang,
        route: route,
        module_context: moduleContext,
        query: query,
        intent: gensparkClassification.intent,
        urgency: gensparkClassification.urgency,
        complexity: gensparkClassification.complexity,
        risk_hints: gensparkClassification.riskHints,
        confidence: gensparkClassification.confidence
      })
      .select('id')
      .single()

    if (intentError) {
      throw new Error(`Failed to create intent: ${intentError.message}`)
    }

    const response: IntentResponse = {
      intentId: intentRecord.id,
      sessionId: sessionId,
      intent: gensparkClassification.intent,
      urgency: gensparkClassification.urgency,
      complexity: gensparkClassification.complexity,
      riskHints: gensparkClassification.riskHints,
      confidence: gensparkClassification.confidence
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Context Intent Error:', error)
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

async function classifyIntentWithGenspark(
  query: string, 
  moduleContext: string, 
  lang: 'en' | 'ar',
  userRole: string
): Promise<GensparkIntentClassification> {
  
  const gensparkApiKey = Deno.env.get('GENSPARK_API_KEY')
  if (!gensparkApiKey) {
    // Fallback to rule-based classification
    return fallbackIntentClassification(query, moduleContext)
  }

  try {
    const systemPrompt = `You are an AI intent classifier for AqlHR, a Saudi HR platform. 
    
Analyze the user query and return a JSON object with:
- intent: one of [document_search, document_upload, employee_inquiry, payroll_calculation, compliance_check, policy_review, government_integration, data_analysis, technical_support, general_inquiry]
- urgency: 0-1 (0=low priority, 1=urgent/time-sensitive)
- complexity: 0-1 (0=simple lookup, 1=complex analysis requiring advanced reasoning)
- riskHints: array of strings describing potential compliance/policy/security risks
- confidence: 0-1 confidence in classification
- reasoning: brief explanation

Context:
- Module: ${moduleContext}
- User Role: ${userRole}
- Language: ${lang}
- Query: "${query}"

Consider Saudi labor law, PDPL compliance, government integration requirements, and Hijri calendar context.`

    const response = await fetch('https://api.genspark.ai/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gensparkApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'genspark-1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`Genspark API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in Genspark response')
    }

    // Parse JSON response
    const parsed = JSON.parse(content)
    
    // Validate and sanitize response
    return {
      intent: validateIntent(parsed.intent),
      urgency: Math.max(0, Math.min(1, parsed.urgency || 0.5)),
      complexity: Math.max(0, Math.min(1, parsed.complexity || 0.5)),
      riskHints: Array.isArray(parsed.riskHints) ? parsed.riskHints.slice(0, 5) : [],
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.7)),
      reasoning: parsed.reasoning || 'Genspark classification'
    }

  } catch (error) {
    console.error('Genspark classification error:', error)
    return fallbackIntentClassification(query, moduleContext)
  }
}

function validateIntent(intent: string): string {
  const validIntents = [
    'document_search', 'document_upload', 'employee_inquiry', 'payroll_calculation',
    'compliance_check', 'policy_review', 'government_integration', 'data_analysis',
    'technical_support', 'general_inquiry'
  ]
  
  return validIntents.includes(intent) ? intent : 'general_inquiry'
}

function fallbackIntentClassification(query: string, moduleContext: string): GensparkIntentClassification {
  const lowerQuery = query.toLowerCase()
  
  // Simple rule-based classification
  let intent = 'general_inquiry'
  let urgency = 0.5
  let complexity = 0.5
  let riskHints: string[] = []

  // Document-related keywords
  if (lowerQuery.includes('document') || lowerQuery.includes('file') || lowerQuery.includes('upload') || 
      lowerQuery.includes('مستند') || lowerQuery.includes('ملف') || lowerQuery.includes('رفع')) {
    intent = lowerQuery.includes('search') || lowerQuery.includes('find') || lowerQuery.includes('بحث') ? 
      'document_search' : 'document_upload'
    complexity = 0.3
  }

  // Employee-related keywords
  else if (lowerQuery.includes('employee') || lowerQuery.includes('staff') || lowerQuery.includes('موظف')) {
    intent = 'employee_inquiry'
    complexity = 0.4
  }

  // Payroll keywords
  else if (lowerQuery.includes('salary') || lowerQuery.includes('payroll') || lowerQuery.includes('gosi') ||
           lowerQuery.includes('راتب') || lowerQuery.includes('أجر') || lowerQuery.includes('جوسي')) {
    intent = 'payroll_calculation'
    urgency = 0.7
    complexity = 0.6
  }

  // Government integration
  else if (lowerQuery.includes('qiwa') || lowerQuery.includes('absher') || lowerQuery.includes('mudad') ||
           lowerQuery.includes('قوى') || lowerQuery.includes('أبشر') || lowerQuery.includes('مدد')) {
    intent = 'government_integration'
    urgency = 0.8
    riskHints.push('government_compliance_required')
  }

  // Compliance keywords
  else if (lowerQuery.includes('compliance') || lowerQuery.includes('policy') || lowerQuery.includes('law') ||
           lowerQuery.includes('امتثال') || lowerQuery.includes('سياسة') || lowerQuery.includes('قانون')) {
    intent = lowerQuery.includes('policy') || lowerQuery.includes('سياسة') ? 'policy_review' : 'compliance_check'
    urgency = 0.9
    complexity = 0.8
    riskHints.push('compliance_risk')
  }

  // Module context adjustments
  if (moduleContext.startsWith('gov.')) {
    urgency = Math.min(1, urgency + 0.2)
    riskHints.push('government_module')
  }

  return {
    intent,
    urgency,
    complexity,
    riskHints,
    confidence: 0.6, // Lower confidence for rule-based
    reasoning: 'Rule-based fallback classification'
  }
}