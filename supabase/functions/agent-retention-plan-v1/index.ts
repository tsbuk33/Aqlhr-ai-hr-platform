import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RetentionPlanRequest {
  tenantId: string;
  userId?: string;
  lang?: string;
  scope?: string; // 'overall', 'dept', 'project', 'grade'
  scopeId?: string;
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
    const { tenantId, userId, lang = 'en', scope = 'overall', scopeId } = await req.json() as RetentionPlanRequest;

    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const stream = new ReadableStream<Uint8Array>({
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
          send({ type: 'progress', phase: 'planning', pct: 10, message: 'Analyzing retention risk drivers' });

          // Initialize Supabase client
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          console.log(`Generating retention plan for tenant: ${tenantId}, scope: ${scope}`);

          // Get current retention data to inform the plan
          const { data: overview } = await supabase
            .rpc('retention_overview_v1', { p_tenant: tenantId });

          const { data: drivers } = await supabase
            .rpc('retention_drivers_v1', { p_tenant: tenantId });

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
              moduleContext: 'retention.plan',
              pageType: 'retention_actions',
              intent: 'retention action plan',
              message: `Generate comprehensive retention action plan based on risk analysis`,
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
          send({ type: 'progress', phase: 'generating', pct: 40, message: 'Generating action plans & interventions' });

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

          // PHASE 3 — saving (persist plan & create tasks)
          send({ type: 'progress', phase: 'saving', pct: 80, message: 'Saving plan & creating retention tasks' });

          // Generate action plans based on analysis
          const actionPlans = generateActionPlans(overview?.[0], drivers || []);

          // Create tasks for each action plan
          for (const plan of actionPlans) {
            try {
              await supabase.rpc('task_create_v1', {
                p_tenant_id: tenantId,
                p_module: 'retention',
                p_title: plan.title,
                p_description: plan.description,
                p_priority: plan.priority,
                p_owner_role: 'hr_manager',
                p_metadata: plan.evidence
              });
            } catch (taskError) {
              console.error('Error creating retention task:', taskError);
              // Continue with other tasks
            }
          }

          console.log(`Generated ${actionPlans.length} action plans for tenant ${tenantId}`);

          // PHASE 4 — ready
          send({ type: 'ready', plan: { tenantId, scope, actionsCount: actionPlans.length } });
          send({ type: 'final' });
        } catch (e) {
          console.error('Error in retention plan generation:', e);
          send({ type: 'error', message: String(e) }, 'error');
        } finally {
          clearInterval(keepAlive);
          controller.close();
        }
      },
    });

    const headers = new Headers(corsHeaders);
    sse(headers);
    return new Response(stream, { headers });

  } catch (error) {
    console.error('Error in agent-retention-plan-v1:', error);
    
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

function generateActionPlans(overview: any, drivers: any[]) {
  const actions = [];

  // Generate actions based on overall risk level
  if (overview && overview.high_risk_percentage > 15) {
    actions.push({
      title: "Emergency Retention Review",
      description: `High-risk employee percentage (${overview.high_risk_percentage}%) exceeds threshold. Conduct immediate retention reviews with managers and implement stay interviews for high-risk employees.`,
      priority: "high",
      evidence: { avg_risk: overview.avg_risk, high_risk_pct: overview.high_risk_percentage }
    });
  }

  // Generate actions for top risk drivers
  if (drivers.length > 0) {
    const topDriver = drivers[0];
    
    if (topDriver.driver_name === 'Compensation') {
      actions.push({
        title: "Compensation Review Initiative",
        description: `Compensation issues affect ${topDriver.affected_count} employees (${topDriver.contribution_percentage.toFixed(1)}% contribution). Conduct market salary analysis and develop pay equity adjustment plan.`,
        priority: "high",
        evidence: { driver: topDriver.driver_name, contribution: topDriver.contribution_percentage, affected: topDriver.affected_count }
      });
    }

    if (topDriver.driver_name === 'Manager Relationship') {
      actions.push({
        title: "Manager Training Program", 
        description: `Manager relationship issues affect ${topDriver.affected_count} employees. Implement leadership development program and improve manager-employee communication.`,
        priority: "high",
        evidence: { driver: topDriver.driver_name, contribution: topDriver.contribution_percentage, affected: topDriver.affected_count }
      });
    }
  }

  // Add general improvement actions
  actions.push({
    title: "Monthly Retention Pulse Survey",
    description: "Implement monthly pulse surveys to track employee satisfaction and identify emerging retention risks before they escalate.",
    priority: "med",
    evidence: { action_type: "proactive_monitoring" }
  });

  actions.push({
    title: "Manager Retention Training Program",
    description: "Develop and deliver training program for managers on retention best practices, stay interviews, and early warning sign identification.",
    priority: "med",
    evidence: { action_type: "capability_building" }
  });

  return actions.slice(0, 5); // Limit to 5 most important actions
}