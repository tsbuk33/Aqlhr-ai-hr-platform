import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RetentionPlanRequest {
  tenantId: string;
  scope?: string; // 'overall', 'dept', 'project', 'grade'
  scopeId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, scope = 'overall', scopeId } = await req.json() as RetentionPlanRequest;

    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Generating retention plan for tenant: ${tenantId}, scope: ${scope}`);

    // Get current retention data to inform the plan
    const { data: overview } = await supabase
      .rpc('retention_get_overview_v1', { p_tenant: tenantId });

    const { data: drivers } = await supabase
      .rpc('retention_get_drivers_v1', { p_tenant: tenantId });

    const { data: hotspots } = await supabase
      .rpc('retention_get_hotspots_v1', { p_tenant: tenantId });

    // Generate action plans based on the data
    const actionPlans = generateActionPlans(overview?.[0], drivers || [], hotspots || []);

    // Insert action plans into the database
    for (const plan of actionPlans) {
      await supabase
        .from('retention_actions')
        .insert({
          tenant_id: tenantId,
          period_month: new Date().toISOString().slice(0, 7) + '-01',
          scope,
          scope_id: scopeId || null,
          title: plan.title,
          description: plan.description,
          priority: plan.priority,
          evidence: plan.evidence
        });
    }

    console.log(`Generated ${actionPlans.length} action plans for tenant ${tenantId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        actionsGenerated: actionPlans.length,
        message: 'Retention action plan generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

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

function generateActionPlans(overview: any, drivers: any[], hotspots: any[]) {
  const actions = [];

  // Generate actions based on overall risk level
  if (overview && overview.pct_high > 15) {
    actions.push({
      title: "Emergency Retention Review",
      description: `High-risk employee percentage (${overview.pct_high}%) exceeds threshold. Conduct immediate retention reviews with managers and implement stay interviews for high-risk employees.`,
      priority: "high",
      evidence: { avg_risk: overview.avg_risk, pct_high: overview.pct_high }
    });
  }

  // Generate actions for top risk drivers
  if (drivers.length > 0) {
    const topDriver = drivers[0];
    
    if (topDriver.factor_name === 'low_tenure') {
      actions.push({
        title: "Enhanced Onboarding Program",
        description: `Low tenure is a key risk factor affecting ${topDriver.frequency} employees. Implement comprehensive 90-day onboarding program with regular check-ins and mentorship assignments.`,
        priority: "high",
        evidence: { driver: topDriver.factor_name, impact: topDriver.avg_impact, frequency: topDriver.frequency }
      });
    }

    if (topDriver.factor_name === 'below_median_salary') {
      actions.push({
        title: "Compensation Review Initiative",
        description: `Below-median salary affects ${topDriver.frequency} employees. Conduct market salary analysis and develop pay equity adjustment plan for affected positions.`,
        priority: "high",
        evidence: { driver: topDriver.factor_name, impact: topDriver.avg_impact, frequency: topDriver.frequency }
      });
    }

    if (topDriver.factor_name === 'no_manager') {
      actions.push({
        title: "Management Structure Optimization",
        description: `${topDriver.frequency} employees lack direct managers. Restructure reporting lines and assign clear management responsibilities to improve employee support.`,
        priority: "med",
        evidence: { driver: topDriver.factor_name, impact: topDriver.avg_impact, frequency: topDriver.frequency }
      });
    }
  }

  // Generate actions for high-risk departments
  const criticalDepts = hotspots.filter(h => h.avg_risk > 70);
  criticalDepts.forEach(dept => {
    actions.push({
      title: `${dept.dept_name_en} Department Intervention`,
      description: `Department shows critical retention risk (${dept.avg_risk}% avg risk, ${dept.pct_high}% high-risk employees). Implement targeted department-specific retention strategies and manager coaching.`,
      priority: "high",
      evidence: { 
        department: dept.dept_name_en, 
        avg_risk: dept.avg_risk, 
        pct_high: dept.pct_high,
        employee_count: dept.n
      }
    });
  });

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