import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to check rate limits
async function checkRateLimit(supabase: any, tenantId: string, actionType: string, maxPerMinute = 3): Promise<boolean> {
  const windowStart = new Date();
  windowStart.setSeconds(0, 0); // Start of current minute
  
  const { data: rateLimits, error } = await supabase
    .from('tool_usage_analytics')
    .select('*')
    .eq('company_id', tenantId)
    .eq('action_type', actionType)
    .gte('created_at', windowStart.toISOString());

  if (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error
  }

  const currentCount = rateLimits?.length || 0;
  return currentCount < maxPerMinute;
}

// Helper function to log action start
async function logActionStart(supabase: any, tenantId: string, actionType: string, functionName: string, metadata: any = {}): Promise<string | null> {
  const { data, error } = await supabase
    .from('tool_usage_analytics')
    .insert({
      company_id: tenantId,
      action_type: actionType,
      tool_name: functionName,
      metadata: metadata,
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
}

// Helper function to log action completion
async function logActionComplete(supabase: any, actionId: string, success: boolean, executionTime: number, errorMessage?: string): Promise<void> {
  const { error } = await supabase
    .from('tool_usage_analytics')
    .update({
      success: success,
      error_message: errorMessage || null,
      execution_time_ms: executionTime
    })
    .eq('id', actionId);

  if (error) {
    console.error('Action completion logging failed:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let actionId: string | null = null;

  try {
    console.log('Observability Demo function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { tenantId, demoAction = 'demo_computation' } = await req.json();
    const requestId = crypto.randomUUID();

    console.log('Request params:', { tenantId, demoAction, requestId });

    // Check rate limit (max 3 demo actions per minute)
    const canProceed = await checkRateLimit(supabase, tenantId, demoAction, 3);
    
    if (!canProceed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded: max 3 demo actions per minute',
        success: false
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Start observability logging
    actionId = await logActionStart(supabase, tenantId, demoAction, 'observability-demo', {
      requestId,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // Simulate some work
    console.log('Performing demo computation...');
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500)); // 500-2500ms delay

    // Simulate random success/failure for demo purposes
    const shouldSucceed = Math.random() > 0.2; // 80% success rate

    if (!shouldSucceed) {
      throw new Error('Simulated demo failure for observability testing');
    }

    const result = {
      success: true,
      message: 'Demo computation completed successfully',
      requestId,
      tenantId,
      computationResult: Math.round(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };

    // Complete observability logging
    if (actionId) {
      await logActionComplete(supabase, actionId, true, Date.now() - startTime);
    }

    console.log('Demo computation completed successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Observability demo error:', error);
    
    // Log error
    if (actionId) {
      await logActionComplete(supabase, actionId, false, Date.now() - startTime, error.message);
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      requestId: crypto.randomUUID()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});