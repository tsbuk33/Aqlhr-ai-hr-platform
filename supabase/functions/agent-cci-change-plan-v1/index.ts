import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas - simplified zod-like validation
interface GenerateChangePlanRequest {
  tenantId: string;
  surveyId: string;
  waveId: string;
  dryRun?: boolean;
}

interface Overview {
  balance_score: number | null;
  risk_index: number | null;
  psych_safety: number | null;
  barrett: { values_alignment: number | null } | null;
  cvf: Record<string, number> | null;
  web: Record<string, number> | null;
  n: number | null;
  last_computed_at: string | null;
}

interface Gap {
  kind: 'psych_safety_deficit' | 'over_hierarchy_vs_agility' | 'weak_cross_team_collab' | 'values_misalignment' | 'customer_voice_gap' | 'recognition_gap';
  severity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[];
}

interface KPI {
  name: string;
  targetDelta: number;
  unit: '%' | 'pts';
}

interface Initiative {
  id: string;
  titleEN: string;
  titleAR: string;
  descriptionEN: string;
  descriptionAR: string;
  ownerRole: 'HR' | 'LineManager' | 'Executive' | 'HSE';
  durationDays: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  kpis: KPI[];
  milestones: { titleEN: string; titleAR: string; dueInDays: number }[];
}

// Validation functions
function validateInput(data: any): GenerateChangePlanRequest {
  if (!data.tenantId || typeof data.tenantId !== 'string') {
    throw new Error('Invalid tenantId');
  }
  if (!data.surveyId || typeof data.surveyId !== 'string') {
    throw new Error('Invalid surveyId');
  }
  if (!data.waveId || typeof data.waveId !== 'string') {
    throw new Error('Invalid waveId');
  }
  
  return {
    tenantId: data.tenantId,
    surveyId: data.surveyId,
    waveId: data.waveId,
    dryRun: Boolean(data.dryRun)
  };
}

function severityToPriority(sev: number): 'low' | 'medium' | 'high' | 'critical' {
  if (sev < 25) return 'low';
  if (sev < 50) return 'medium';
  if (sev < 75) return 'high';
  return 'critical';
}

function makeInitiatives(priority: 'low' | 'medium' | 'high' | 'critical'): Initiative[] {
  const baseKPIs = {
    psychSafetyPlus5: { name: 'Psychological Safety', targetDelta: +5, unit: 'pts' as const },
    approvalsMinus30: { name: 'Approval cycle time', targetDelta: -30, unit: '%' as const },
    crossTeamPlus20: { name: 'Cross-team tasks', targetDelta: +20, unit: '%' as const },
  };

  const common: Initiative[] = [
    {
      id: 'manager-safety-training',
      titleEN: 'Manager Psychological Safety Training',
      titleAR: 'تدريب المديرين على السلامة النفسية',
      descriptionEN: 'Targeted workshops and practice with feedback.',
      descriptionAR: 'ورش عمل مستهدفة وممارسة مع تغذية راجعة.',
      ownerRole: 'HR',
      durationDays: 30,
      priority,
      kpis: [baseKPIs.psychSafetyPlus5],
      milestones: [
        { titleEN: 'Design curriculum', titleAR: 'تصميم المنهج', dueInDays: 7 },
        { titleEN: 'Pilot with 2 teams', titleAR: 'تجربة على فريقين', dueInDays: 20 },
        { titleEN: 'Full roll-out', titleAR: 'إطلاق كامل', dueInDays: 30 },
      ],
    },
    {
      id: 'decision-rights-raci',
      titleEN: 'Decision Rights Reset (RACI)',
      titleAR: 'إعادة ضبط صلاحيات القرار (RACI)',
      descriptionEN: 'Clarify who is Responsible, Accountable, Consulted, Informed.',
      descriptionAR: 'توضيح من المسؤول والمحاسب والمستشار والمُخطر.',
      ownerRole: 'Executive',
      durationDays: 45,
      priority,
      kpis: [baseKPIs.approvalsMinus30],
      milestones: [
        { titleEN: 'Map current approvals', titleAR: 'حصر الموافقات الحالية', dueInDays: 10 },
        { titleEN: 'Publish RACI', titleAR: 'نشر RACI', dueInDays: 25 },
        { titleEN: 'Audit adoption', titleAR: 'مراجعة الالتزام', dueInDays: 45 },
      ],
    },
    {
      id: 'cross-team-rituals',
      titleEN: 'Cross‑Team Weekly Rituals',
      titleAR: 'طقوس أسبوعية بين الفرق',
      descriptionEN: 'Weekly huddles to unblock dependencies.',
      descriptionAR: 'اجتماعات قصيرة أسبوعياً لإزالة العوائق.',
      ownerRole: 'LineManager',
      durationDays: 60,
      priority,
      kpis: [baseKPIs.crossTeamPlus20],
      milestones: [
        { titleEN: 'Pick time & cadence', titleAR: 'تحديد الوقت والإيقاع', dueInDays: 7 },
        { titleEN: 'First 4 sessions', titleAR: 'أول ٤ جلسات', dueInDays: 28 },
        { titleEN: 'Retrospective', titleAR: 'مراجعة وتحسين', dueInDays: 60 },
      ],
    },
    {
      id: 'recognition-refresh',
      titleEN: 'Recognition Refresh',
      titleAR: 'تجديد برنامج التقدير',
      descriptionEN: 'Make recognition visible and fair.',
      descriptionAR: 'جعل التقدير مرئياً وعادلاً.',
      ownerRole: 'HR',
      durationDays: 30,
      priority,
      kpis: [],
      milestones: [
        { titleEN: 'Define criteria', titleAR: 'تحديد المعايير', dueInDays: 7 },
        { titleEN: 'Launch monthly awards', titleAR: 'إطلاق جوائز شهرية', dueInDays: 30 },
      ],
    },
    {
      id: 'lean-approvals-pilot',
      titleEN: 'Lean Approvals Pilot',
      titleAR: 'تجربة تقليل طبقات الموافقة',
      descriptionEN: 'Reduce layers where risk is low.',
      descriptionAR: 'تقليل الطبقات حين المخاطر منخفضة.',
      ownerRole: 'Executive',
      durationDays: 30,
      priority,
      kpis: [baseKPIs.approvalsMinus30],
      milestones: [
        { titleEN: 'Pick one process', titleAR: 'اختيار عملية واحدة', dueInDays: 5 },
        { titleEN: 'Pilot & measure', titleAR: 'تجربة وقياس', dueInDays: 25 },
      ],
    },
    {
      id: 'customer-voice-huddles',
      titleEN: 'Customer‑Voice Huddles',
      titleAR: 'جلسات صوت العميل',
      descriptionEN: 'Short weekly reviews of customer feedback.',
      descriptionAR: 'مراجعات قصيرة أسبوعياً لتعليقات العملاء.',
      ownerRole: 'LineManager',
      durationDays: 30,
      priority,
      kpis: [],
      milestones: [
        { titleEN: 'Collect inputs', titleAR: 'جمع المدخلات', dueInDays: 7 },
        { titleEN: 'Weekly cadence', titleAR: 'وتيرة أسبوعية', dueInDays: 30 },
      ],
    },
  ];

  switch (priority) {
    case 'low':
      return [common[3]];
    case 'medium':
      return [common[0], common[3]];
    case 'high':
      return [common[0], common[1], common[2]];
    case 'critical':
      return [common[0], common[1], common[2], common[4], common[5]];
    default:
      return [];
  }
}

async function checkUserRole(supabase: any, userId: string, tenantId: string): Promise<boolean> {
  const allowedRoles = ['admin', 'hr_manager', 'super_admin'];
  
  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('role, company_id')
    .eq('user_id', userId);

  if (error || !roles || roles.length === 0) {
    return false;
  }

  // Check if user has allowed role and belongs to the tenant
  return roles.some((r: any) => 
    allowedRoles.includes(r.role) && r.company_id === tenantId
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate and parse input
    const requestData = await req.json();
    const input = validateInput(requestData);

    // Check user role and tenant access
    const hasAccess = await checkUserRole(supabase, user.id, input.tenantId);
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'Forbidden - insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Starting change plan generation for tenant: ${input.tenantId}, survey: ${input.surveyId}, wave: ${input.waveId}, dryRun: ${input.dryRun}`);

    // Try to insert action for idempotency (only if not dry run)
    let actionId = null;
    if (!input.dryRun) {
      try {
        const { data: actionLog, error: actionError } = await supabase
          .from('agent_actions')
          .insert({
            tenant_id: input.tenantId,
            action_type: 'cci_change_plan_generation',
            payload: input,
            status: 'running',
            created_by: user.id
          })
          .select()
          .single();

        if (actionError) {
          if (actionError.code === '23505') { // Unique constraint violation
            return new Response(JSON.stringify({
              error: 'Plan generation already in progress—try again shortly.',
              code: 'ALREADY_IN_PROGRESS'
            }), {
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          throw actionError;
        }
        
        actionId = actionLog.id;
      } catch (error) {
        console.error('Error creating action log:', error);
        throw error;
      }
    }

    // Fetch overview data via RPC
    const fetchOverviewStart = Date.now();
    const { data: overviewData, error: overviewError } = await supabase
      .rpc('cci_get_overview_v1', {
        p_tenant: input.tenantId,
        p_survey: input.surveyId,
        p_wave: input.waveId
      });

    if (overviewError) {
      throw new Error(`Failed to fetch overview: ${overviewError.message}`);
    }

    if (!overviewData || overviewData.length === 0) {
      throw new Error('No overview data found. Please compute scores first.');
    }

    const overview: Overview = overviewData[0];
    const fetchOverviewMs = Date.now() - fetchOverviewStart;
    console.log(`Overview data fetched in ${fetchOverviewMs}ms:`, overview);

    // Compose plan from gaps
    const composePlanStart = Date.now();
    const gaps: Gap[] = [];
    
    // Analyze psychological safety
    const ps = overview.psych_safety ?? 70;
    const psDeficit = Math.max(0, 100 - ps);
    if (psDeficit > 10) {
      gaps.push({ 
        kind: 'psych_safety_deficit', 
        severity: psDeficit, 
        priority: severityToPriority(psDeficit) 
      });
    }

    // Analyze values alignment
    const va = overview.barrett?.values_alignment ?? 70;
    const vaDeficit = Math.max(0, 100 - va);
    if (vaDeficit > 10) {
      gaps.push({ 
        kind: 'values_misalignment', 
        severity: vaDeficit, 
        priority: severityToPriority(vaDeficit) 
      });
    }

    // CVF hierarchy vs agility check
    const cvf = overview.cvf ?? {};
    const overHierarchy = Math.max(0, (cvf['Hierarchy'] ?? 0) - (cvf['Adhocracy'] ?? 0));
    if (overHierarchy > 15) {
      gaps.push({ 
        kind: 'over_hierarchy_vs_agility', 
        severity: overHierarchy, 
        priority: severityToPriority(overHierarchy) 
      });
    }

    // Cross-team collaboration proxy from Web
    const web = overview.web ?? {};
    const collabGap = Math.max(0, 70 - (web['Rituals & Routines'] ?? 0));
    if (collabGap > 10) {
      gaps.push({ 
        kind: 'weak_cross_team_collab', 
        severity: collabGap, 
        priority: severityToPriority(collabGap) 
      });
    }

    // Rank by severity, pick top 3-5
    gaps.sort((a, b) => b.severity - a.severity);
    const topGaps = gaps.slice(0, 5);

    // Determine global priority
    const priorityOrder: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const globalPriority = topGaps.reduce<'low' | 'medium' | 'high' | 'critical'>((acc, g) => {
      return priorityOrder.indexOf(g.priority) > priorityOrder.indexOf(acc) ? g.priority : acc;
    }, 'low');

    // Generate initiatives
    const initiatives = makeInitiatives(globalPriority);
    
    // Create schedule
    const now = new Date();
    const schedule = {
      pulses: [
        {
          day: 30,
          date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: 'First Pulse Check',
          activities: ['Progress review', 'Obstacle identification', 'Course correction']
        },
        {
          day: 60,
          date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: 'Mid-Point Assessment',
          activities: ['Interim results analysis', 'Stakeholder feedback', 'Plan adjustments']
        },
        {
          day: 90,
          date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: 'Final Evaluation',
          activities: ['Full impact assessment', 'Success celebration', 'Next phase planning']
        }
      ]
    };

    // Generate communications
    const summaryEN = `90-Day Culture Change Plan\n\nBased on assessment results, we identified ${topGaps.length} priority areas requiring ${globalPriority} priority action. Key initiatives include ${initiatives.map(i => i.titleEN).join(', ')}.`;
    const summaryAR = `خطة تغيير الثقافة لمدة 90 يومًا\n\nبناءً على نتائج التقييم، حددنا ${topGaps.length} مجالات ذات أولوية ${globalPriority}. المبادرات الرئيسية تشمل ${initiatives.map(i => i.titleAR).join('، ')}.`;

    const composePlanMs = Date.now() - composePlanStart;
    console.log(`Plan composed in ${composePlanMs}ms - ${initiatives.length} initiatives, priority: ${globalPriority}`);

    // If dry run, return without DB writes
    if (input.dryRun) {
      return new Response(JSON.stringify({
        success: true,
        dryRun: true,
        plan: {
          initiatives,
          schedule,
          summaryEN,
          summaryAR,
          gaps: topGaps,
          globalPriority
        },
        execution_time_ms: Date.now() - startTime
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Write to database
    const dbWriteStart = Date.now();
    const { data: playbook, error: playbookError } = await supabase
      .from('cci_playbooks')
      .upsert({
        tenant_id: input.tenantId,
        survey_id: input.surveyId,
        wave_id: input.waveId,
        title: '90-Day Culture Change Plan',
        description: `AI-generated change plan based on CCI assessment results. Focus areas: ${topGaps.map(g => g.kind).join(', ')}`,
        status: 'draft',
        initiatives: initiatives,
        schedule: schedule,
        ai_summary: summaryEN,
        comms_en: summaryEN,
        comms_ar: summaryAR,
        manager_brief: `Manager Brief: Your leadership is critical for the success of these ${initiatives.length} culture change initiatives.`
      }, {
        onConflict: 'tenant_id,survey_id,wave_id'
      })
      .select()
      .single();

    if (playbookError) {
      throw new Error(`Failed to create playbook: ${playbookError.message}`);
    }

    const dbWriteMs = Date.now() - dbWriteStart;
    const executionTime = Date.now() - startTime;

    // Update action log
    if (actionId) {
      await supabase
        .from('agent_actions')
        .update({
          status: 'completed',
          finished_at: new Date().toISOString(),
          payload: {
            ...input,
            result: {
              playbook_id: playbook.id,
              initiatives_count: initiatives.length,
              gaps_identified: topGaps.length,
              global_priority: globalPriority,
              timing: {
                fetchOverviewMs,
                composePlanMs,
                dbWriteMs,
                totalMs: executionTime
              }
            }
          }
        })
        .eq('id', actionId);
    }

    console.log(`Change plan generated successfully in ${executionTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      playbookId: playbook.id,
      initiativesCount: initiatives.length,
      pulses: [30, 60, 90],
      globalPriority,
      execution_time_ms: executionTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error generating change plan:', error);
    
    const executionTime = Date.now() - startTime;
    
    return new Response(JSON.stringify({
      error: error.message,
      execution_time_ms: executionTime
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});