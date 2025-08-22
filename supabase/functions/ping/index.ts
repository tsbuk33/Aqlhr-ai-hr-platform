import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ak_')) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key format' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const keyHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey))))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    // Verify API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('tenant_id, scopes, active')
      .eq('key_hash', keyHash)
      .eq('active', true)
      .single();

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check rate limit
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const bucket = `${keyData.tenant_id}:ping:${windowStart.toISOString()}`;

    // Get current rate limit counter
    const { data: rateLimitData } = await supabase
      .from('api_rate_limit')
      .select('counter')
      .eq('tenant_id', keyData.tenant_id)
      .eq('bucket', bucket)
      .eq('window_start', windowStart.toISOString())
      .single();

    const currentCounter = rateLimitData?.counter || 0;
    const rateLimit = 1000; // 1000 requests per hour

    if (currentCounter >= rateLimit) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', limit: rateLimit }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update rate limit counter
    await supabase
      .from('api_rate_limit')
      .upsert({
        tenant_id: keyData.tenant_id,
        bucket: bucket,
        window_start: windowStart.toISOString(),
        counter: currentCounter + 1
      });

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: now.toISOString() })
      .eq('key_hash', keyHash);

    // Log API call to audit log
    await supabase
      .from('audit_log')
      .insert({
        tenant_id: keyData.tenant_id,
        action: 'api_ping',
        entity: 'api_endpoint',
        details: {
          endpoint: '/ping',
          method: req.method,
          user_agent: req.headers.get('user-agent'),
          scopes: keyData.scopes
        },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Pong! API is working',
        timestamp: now.toISOString(),
        tenant_id: keyData.tenant_id,
        scopes: keyData.scopes,
        rate_limit: {
          remaining: rateLimit - currentCounter - 1,
          reset_at: new Date(windowStart.getTime() + 60 * 60 * 1000).toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in ping endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});