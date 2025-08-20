import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let actionId: string | null = null;

  try {
    console.log('CCI Compute Scores v1 function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { tenantId, surveyId, waveId } = await req.json();
    const requestId = crypto.randomUUID();

    console.log('Request params:', { tenantId, surveyId, waveId, requestId });

    // Start observability logging
    const { data: logData } = await supabase.rpc('log_agent_action', {
      p_tenant_id: tenantId,
      p_action_type: 'cci_compute_scores',
      p_function_name: 'cci-compute-scores-v1',
      p_request_id: requestId,
      p_metadata: { surveyId, waveId }
    });
    actionId = logData;

    // Check rate limit (3 computes per minute per tenant/survey/wave)
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      p_tenant_id: tenantId,
      p_survey_id: surveyId,
      p_wave_id: waveId,
      p_action_type: 'cci_compute_scores',
      p_max_per_minute: 3
    });

    if (!rateLimitOk) {
      if (actionId) {
        await supabase.rpc('complete_agent_action', {
          p_action_id: actionId,
          p_status: 'error',
          p_error_message: 'Rate limit exceeded: max 3 compute runs per minute',
          p_metadata: { execution_time_ms: Date.now() - startTime }
        });
      }
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded: max 3 compute runs per minute',
        success: false
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get responses for the wave
    const { data: responses, error: responsesError } = await supabase
      .from('cci_responses')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('survey_id', surveyId)
      .eq('wave_id', waveId)
      .eq('is_flagged', false);

    if (responsesError) throw responsesError;

    if (!responses || responses.length === 0) {
      if (actionId) {
        await supabase.rpc('complete_agent_action', {
          p_action_id: actionId,
          p_status: 'error',
          p_error_message: 'No valid responses found for computation',
          p_metadata: { execution_time_ms: Date.now() - startTime }
        });
      }
      return new Response(JSON.stringify({
        error: 'No valid responses found for computation',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${responses.length} responses`);

    // Simple scoring algorithm (this would be more sophisticated in production)
    let totalScore = 0;
    let validResponses = 0;

    for (const response of responses) {
      if (response.answers && typeof response.answers === 'object') {
        const answers = Object.values(response.answers) as number[];
        const responseScore = answers.reduce((sum: number, val: number) => sum + val, 0) / answers.length;
        totalScore += responseScore;
        validResponses++;
      }
    }

    const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
    
    // Store computed scores (simplified - in production this would be in a dedicated scores table)
    const computedResults = {
      tenantId,
      surveyId,
      waveId,
      totalResponses: responses.length,
      validResponses,
      averageScore: Math.round(averageScore * 100) / 100,
      computedAt: new Date().toISOString(),
      requestId
    };

    console.log('Computed results:', computedResults);

    // Complete observability logging
    if (actionId) {
      await supabase.rpc('complete_agent_action', {
        p_action_id: actionId,
        p_status: 'success',
        p_error_message: null,
        p_metadata: {
          execution_time_ms: Date.now() - startTime,
          results: computedResults
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      results: computedResults,
      requestId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('CCI compute scores error:', error);
    
    // Log error
    if (actionId) {
      await supabase.rpc('complete_agent_action', {
        p_action_id: actionId,
        p_status: 'error',
        p_error_message: error.message,
        p_metadata: { execution_time_ms: Date.now() - startTime }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});