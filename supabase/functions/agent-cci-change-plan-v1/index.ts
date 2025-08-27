import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CCIPlaybookRequest {
  tenantId: string;
  userId?: string;
  lang?: string;
  surveyId?: string;
  waveId?: string;
  stream?: boolean;
}

function sse(headers: Headers) {
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache, no-transform');
  headers.set('Connection', 'keep-alive');
  headers.set('X-Accel-Buffering', 'no');
}

const enc = new TextEncoder();
const pingMs = Number(Deno.env.get('SSE_PING_MS') ?? '15000');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, userId, lang = 'en', surveyId, waveId, stream = false } = await req.json() as CCIPlaybookRequest;

    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // If streaming is requested, use SSE
    if (stream) {
      const streamResponse = new ReadableStream<Uint8Array>({
        async start(controller) {
          const keepAlive = setInterval(() => controller.enqueue(enc.encode(': ping\n\n')), pingMs);

          const send = (data: unknown, event?: string) => {
            const lines = [];
            if (event) lines.push(`event: ${event}`);
            lines.push(`data: ${JSON.stringify(data)}`);
            lines.push('');
            controller.enqueue(enc.encode(lines.join('\n')));
          };

          try {
            // PHASE 1 — planning
            send({ type: 'progress', phase: 'planning', pct: 10, message: 'Analyzing CCI scores & risks' });

            // Initialize Supabase client
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            console.log(`Generating CCI playbook for tenant: ${tenantId}`);

            // Call orchestrator in streaming mode to draft the plan
            const orchestratorUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-agent-orchestrator`;
            const res = await fetch(orchestratorUrl, {
              method: 'POST',
              headers: { 
                'content-type': 'application/json', 
                'accept': 'text/event-stream',
                'authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({
                tenantId, userId, lang,
                moduleContext: 'cci.playbook',
                pageType: 'playbook',
                intent: 'cci change plan 90 day',
                message: `Generate comprehensive CCI change initiatives based on survey ${surveyId}, wave ${waveId}`,
                surveyId, waveId,
                stream: true,
              }),
            });

            if (!res.ok || !res.body) {
              send({ type: 'error', message: `Orchestrator HTTP ${res.status}` }, 'error');
              clearInterval(keepAlive);
              controller.close();
              return;
            }

            // Pass through orchestrator SSE while indicating generating phase
            send({ type: 'progress', phase: 'generating', pct: 40, message: 'Generating initiatives & action plans' });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buf += decoder.decode(value, { stream: true });

              // Split by SSE frame
              const frames = buf.split('\n\n');
              buf = frames.pop() ?? '';

              for (const frame of frames) {
                if (!frame.trim()) continue;
                controller.enqueue(enc.encode(frame + '\n\n')); // forward raw upstream frame
              }
            }

            // PHASE 3 — saving (persist playbook, idempotent)
            send({ type: 'progress', phase: 'saving', pct: 80, message: 'Saving playbook & creating tasks' });

            // Create tasks for each generated initiative
            try {
              await supabase.rpc('task_create_v1', {
                p_tenant_id: tenantId,
                p_module: 'cci_playbook',
                p_title: 'CCI Playbook Implementation',
                p_description: `Implement CCI change initiatives generated for survey ${surveyId}, wave ${waveId}`,
                p_priority: 'high',
                p_owner_role: 'hr_manager',
                p_metadata: { 
                  source: 'cci_playbook_generator',
                  surveyId, 
                  waveId,
                  generated_at: new Date().toISOString()
                }
              });

              console.log(`Created CCI playbook tasks for tenant ${tenantId}`);
            } catch (taskError) {
              console.error('Error creating CCI tasks:', taskError);
              // Continue anyway - task creation is nice-to-have
            }

            // PHASE 4 — ready
            send({ type: 'ready', playbook: { surveyId, waveId, tenantId } });
            send({ type: 'final' });
          } catch (e) {
            console.error('Error in CCI playbook generation:', e);
            send({ type: 'error', message: String(e) }, 'error');
          } finally {
            clearInterval(keepAlive);
            controller.close();
          }
        },
      });

      const headers = new Headers(corsHeaders);
      sse(headers);
      return new Response(streamResponse, { headers });
    }

    // Fall back to original non-streaming implementation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Starting change plan generation for tenant: ${tenantId}, survey: ${surveyId}, wave: ${waveId}`);

    // Fetch the survey and wave data
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (surveyError) {
      throw new Error(`Failed to fetch survey: ${surveyError.message}`);
    }

    const { data: wave, error: waveError } = await supabase
      .from('survey_waves')
      .select('*')
      .eq('id', waveId)
      .single();

    if (waveError) {
      throw new Error(`Failed to fetch survey wave: ${waveError.message}`);
    }

    // Fetch the responses for the given tenant, survey, and wave
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('survey_id', surveyId)
      .eq('wave_id', waveId);

    if (responsesError) {
      throw new Error(`Failed to fetch survey responses: ${responsesError.message}`);
    }

    // Aggregate the responses to get the CCI score
    const cciScore = responses.reduce((acc, response) => acc + response.score, 0) / responses.length;

    // Generate a change plan based on the CCI score
    let changePlan = '';
    if (cciScore > 80) {
      changePlan = 'The CCI score is high, indicating that the organization is already well-aligned. Continue to monitor the situation and make adjustments as needed.';
    } else if (cciScore > 60) {
      changePlan = 'The CCI score is moderate, indicating that the organization is somewhat aligned. Consider implementing some changes to improve alignment.';
    } else {
      changePlan = 'The CCI score is low, indicating that the organization is not well-aligned. Implement significant changes to improve alignment.';
    }

    // Store the change plan in the database
    const { data: playbook, error: playbookError } = await supabase
      .from('cci_playbooks')
      .insert([
        {
          tenant_id: tenantId,
          survey_id: surveyId,
          wave_id: waveId,
          change_plan: changePlan,
          cci_score: cciScore,
        },
      ]);

    if (playbookError) {
      throw new Error(`Failed to store change plan: ${playbookError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        cciScore,
        changePlan,
        survey,
        wave,
        responses,
        playbook,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
    console.log(`Starting change plan generation for tenant: ${tenantId}, survey: ${surveyId}, wave: ${waveId}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    return new Response(JSON.stringify({
      success: true,
      message: 'Non-streaming CCI playbook generation not yet implemented. Please use stream: true.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in agent-cci-change-plan-v1:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
