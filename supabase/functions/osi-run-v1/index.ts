import { serve } from "../_shared/deps.ts";
import { createClient } from "../_shared/deps.ts";
import { corsHeaders } from "../_shared/deps.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId } = await req.json();
    
    if (!caseId) {
      return new Response(
        JSON.stringify({ error: 'Missing caseId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Running OSI computation for case:', caseId);

    // Step 1: Run OSI computation
    const { data: computeResult, error: computeError } = await supabase
      .rpc('osi_compute_case_v1', { p_case_id: caseId });

    if (computeError) {
      console.error('OSI computation error:', computeError);
      return new Response(
        JSON.stringify({ error: 'Failed to compute OSI metrics', details: computeError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Get computed overview
    const { data: overview, error: overviewError } = await supabase
      .rpc('osi_get_overview_v1', { p_case_id: caseId });

    if (overviewError) {
      console.error('OSI overview error:', overviewError);
      return new Response(
        JSON.stringify({ error: 'Failed to get OSI overview', details: overviewError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Generate AI-powered playbook
    const playbook = generatePlaybook(overview);
    
    // Step 4: Create dx_playbooks entry
    const { data: playbookEntry, error: playbookError } = await supabase
      .from('dx_playbooks')
      .upsert({
        case_id: caseId,
        ai_summary: playbook.summary,
        initiatives: playbook.initiatives,
        status: 'draft',
        confidence: playbook.confidence
      }, {
        onConflict: 'case_id'
      })
      .select()
      .single();

    if (playbookError) {
      console.error('Playbook creation error:', playbookError);
      return new Response(
        JSON.stringify({ error: 'Failed to create playbook', details: playbookError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 5: Emit value events for ROI tracking
    const { error: roiError } = await supabase
      .rpc('roi_emit_event', {
        p_tenant: overview.tenant_id || null,
        p_event: 'osi_analysis',
        p_qty: 1,
        p_module: 'diagnostic',
        p_ref: caseId,
        p_meta: {
          headcount: overview.headcount,
          flags: overview.flags,
          org_health_score: overview.org_health_score
        }
      });

    if (roiError) {
      console.warn('ROI event emission failed:', roiError);
    }

    console.log('OSI analysis completed successfully for case:', caseId);

    return new Response(
      JSON.stringify({
        success: true,
        overview,
        playbook: playbookEntry,
        message: 'OSI analysis completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OSI function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generatePlaybook(overview: any) {
  const flags = overview.flags || [];
  const initiatives: any[] = [];
  let confidence = 0.8;

  // Generate initiatives based on flags
  if (flags.includes('OVER_SPAN')) {
    initiatives.push({
      title: 'Optimize Management Spans',
      description: 'Rebalance spans of control to improve management effectiveness',
      priority: 'high',
      estimated_impact: 'Medium',
      timeline: '3-6 months',
      owner_role: 'HR Manager',
      metrics: ['span_avg', 'manager_satisfaction']
    });
  }

  if (flags.includes('DEEP_LAYERS')) {
    initiatives.push({
      title: 'Flatten Organization Structure',
      description: 'Reduce management layers to improve decision-making speed',
      priority: 'high',
      estimated_impact: 'High',
      timeline: '6-12 months',
      owner_role: 'Chief Operating Officer',
      metrics: ['layers_depth', 'decision_speed']
    });
  }

  if (flags.includes('LOW_SAUDI_LAYER')) {
    initiatives.push({
      title: 'Accelerate Saudization Program',
      description: 'Increase Saudi national representation in management positions',
      priority: 'medium',
      estimated_impact: 'High',
      timeline: '12-18 months',
      owner_role: 'Head of Talent Acquisition',
      metrics: ['saudization', 'compliance_score']
    });
  }

  if (flags.includes('HIGH_COST_TO_MANAGE')) {
    initiatives.push({
      title: 'Optimize Management Costs',
      description: 'Reduce cost-to-manage ratio through efficiency improvements',
      priority: 'high',
      estimated_impact: 'High',
      timeline: '6-9 months',
      owner_role: 'Chief Financial Officer',
      metrics: ['cost_to_manage', 'operational_efficiency']
    });
  }

  if (flags.includes('DUP_ROLE_TITLES')) {
    initiatives.push({
      title: 'Consolidate Role Definitions',
      description: 'Merge duplicate titles and clarify role responsibilities',
      priority: 'medium',
      estimated_impact: 'Medium',
      timeline: '3-4 months',
      owner_role: 'HR Business Partner',
      metrics: ['role_clarity', 'duplicate_titles_n']
    });
  }

  // Default initiatives if no major flags
  if (initiatives.length === 0) {
    initiatives.push({
      title: 'Maintain Organizational Excellence',
      description: 'Continue monitoring and optimizing organizational health',
      priority: 'low',
      estimated_impact: 'Medium',
      timeline: '6 months',
      owner_role: 'Organization Development Manager',
      metrics: ['org_health_score', 'employee_satisfaction']
    });
  }

  const summary = `
Organization Structure Analysis Summary:

Current State:
- Total Headcount: ${overview.headcount}
- Management Layers: ${overview.layers_depth}
- Average Span: ${overview.span_avg}
- Saudization Rate: ${overview.saudization}%
- Cost to Manage: ${overview.cost_to_manage}%

Key Issues Identified: ${flags.join(', ') || 'None'}

Recommended Actions:
${initiatives.map((init, i) => `${i + 1}. ${init.title} (${init.priority} priority)`).join('\n')}

This analysis provides a comprehensive view of your organizational structure with specific recommendations to optimize effectiveness and compliance.
  `.trim();

  return {
    summary,
    initiatives,
    confidence
  };
}