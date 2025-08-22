import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { caseId } = await req.json();
    console.log('[REW] Processing case:', caseId);

    if (!caseId) {
      throw new Error('Case ID is required');
    }

    // Step 1: Run REW computation
    console.log('[REW] Running retention risk computation...');
    const { error: computeError } = await supabase.rpc('rew_compute_case_v1', {
      p_case_id: caseId
    });

    if (computeError) {
      console.error('[REW] Computation error:', computeError);
      throw new Error(`REW computation failed: ${computeError.message}`);
    }

    // Step 2: Get computed results for playbook generation
    const { data: rewData, error: dataError } = await supabase.rpc('rew_get_overview_v1', {
      p_case_id: caseId
    });

    if (dataError) {
      console.error('[REW] Data retrieval error:', dataError);
      throw new Error(`Failed to retrieve REW data: ${dataError.message}`);
    }

    // Step 3: Generate playbook initiatives based on risk factors
    const topDrivers = rewData?.top_drivers || [];
    const riskScore = rewData?.risk_score || 0;
    
    const initiatives = [];
    
    // Analyze top drivers and generate specific initiatives
    for (const driver of topDrivers) {
      if (driver.score > 20) { // Only focus on significant risks
        switch (driver.driver) {
          case 'psychological_safety':
            initiatives.push({
              title: 'Improve Psychological Safety',
              description: 'Implement team building sessions and manager training on psychological safety',
              priority: 'high',
              timeframe: '30-60 days',
              impact: 'High retention improvement',
              owner: 'HR Team'
            });
            break;
          case 'management_overload':
            initiatives.push({
              title: 'Rebalance Management Spans',
              description: 'Redistribute team members to reduce manager overload and improve support',
              priority: 'urgent',
              timeframe: '15-30 days',
              impact: 'Immediate stress reduction',
              owner: 'Operations Team'
            });
            break;
          case 'contract_expiry':
            initiatives.push({
              title: 'Accelerate Contract Renewals',
              description: 'Fast-track visa and contract renewal processes for expiring employees',
              priority: 'urgent',
              timeframe: '7-14 days',
              impact: 'Prevent involuntary turnover',
              owner: 'Legal/HR Team'
            });
            break;
          case 'compensation_gap':
            initiatives.push({
              title: 'Salary Benchmarking Review',
              description: 'Conduct market salary analysis and adjust compensation for key talent',
              priority: 'high',
              timeframe: '60-90 days',
              impact: 'Competitive positioning',
              owner: 'Compensation Team'
            });
            break;
        }
      }
    }

    // Add pulse survey initiative for ongoing monitoring
    initiatives.push({
      title: 'Implement Retention Pulse Surveys',
      description: 'Deploy 30/60/90 day pulse surveys to monitor retention sentiment',
      priority: 'medium',
      timeframe: '30 days',
      impact: 'Early warning system',
      owner: 'HR Analytics Team'
    });

    // Step 4: Create playbook entry
    const playbookTitle = `Retention Early Warning Action Plan - Risk Score: ${Math.round(riskScore)}%`;
    const { data: playbook, error: playbookError } = await supabase
      .from('dx_playbooks')
      .insert({
        case_id: caseId,
        title: playbookTitle,
        description: `Comprehensive retention action plan addressing ${topDrivers.length} key risk factors`,
        initiatives: initiatives,
        metadata: {
          module: 'rew',
          risk_score: riskScore,
          top_drivers: topDrivers,
          generated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (playbookError) {
      console.error('[REW] Playbook creation error:', playbookError);
      throw new Error(`Failed to create playbook: ${playbookError.message}`);
    }

    // Step 5: Emit value events for ROI tracking
    await supabase.rpc('roi_emit_event', {
      p_tenant: (await supabase.from('dx_cases').select('tenant_id').eq('id', caseId).single()).data?.tenant_id,
      p_event: 'rew_analysis_run',
      p_qty: 1,
      p_module: 'retention',
      p_ref: caseId,
      p_meta: {
        risk_score: riskScore,
        initiatives_count: initiatives.length,
        high_risk_drivers: topDrivers.filter(d => d.score > 30).length
      }
    });

    console.log('[REW] Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      caseId,
      riskScore,
      initiativesCount: initiatives.length,
      playbookId: playbook.id,
      message: 'REW analysis completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('[REW] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});