import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

interface APIKeyValidation {
  key_id: string;
  tenant_id: string;
  scopes: string[];
  is_valid: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const start = Date.now();

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract API key from header
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .rpc('validate_api_key', { p_api_key: apiKey })
      .single()

    if (keyError || !keyData) {
      console.error('API key validation error:', keyError)
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const validation = keyData as APIKeyValidation
    if (!validation.is_valid) {
      return new Response(
        JSON.stringify({ error: 'API key expired or inactive' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check rate limit
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_tenant_id: validation.tenant_id,
        p_api_key_id: validation.key_id,
        p_limit: 600,
        p_window_minutes: 5
      })

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      return new Response(
        JSON.stringify({ error: 'Rate limit check failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!rateLimitOk) {
      // Log the rate-limited call
      await supabase.rpc('log_api_call', {
        p_tenant_id: validation.tenant_id,
        p_api_key_id: validation.key_id,
        p_endpoint: '/api/ping',
        p_method: req.method,
        p_response_status: 429,
        p_response_time_ms: Date.now() - start,
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        p_user_agent: req.headers.get('user-agent')
      })

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          limit: '600 calls per 5 minutes'
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update API key usage
    await supabase.rpc('update_api_key_usage', {
      p_api_key_id: validation.key_id
    })

    // Prepare response
    const responseTime = Date.now() - start
    const response = {
      status: 'ok',
      message: 'API Gateway is operational',
      timestamp: new Date().toISOString(),
      tenant_id: validation.tenant_id,
      scopes: validation.scopes,
      response_time_ms: responseTime
    }

    // Log successful API call
    await supabase.rpc('log_api_call', {
      p_tenant_id: validation.tenant_id,
      p_api_key_id: validation.key_id,
      p_endpoint: '/api/ping',
      p_method: req.method,
      p_response_status: 200,
      p_response_time_ms: responseTime,
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent')
    })

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('API ping error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})