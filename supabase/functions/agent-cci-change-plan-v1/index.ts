import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateChangePlanRequest {
  tenantId: string;
  surveyId: string;
  waveId: string;
}

interface Initiative {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  duration_weeks: number;
  expected_impact: string;
  kpis: Array<{
    metric: string;
    target: string;
    baseline?: number;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    description: string;
  }>;
}

// Initiative templates library
const INITIATIVE_TEMPLATES: Record<string, Omit<Initiative, 'id'>> = {
  manager_safety_training: {
    title: "Manager Safety Training Program",
    title_ar: "برنامج تدريب المدراء على الأمان النفسي",
    description: "Comprehensive training for managers on creating psychologically safe environments",
    description_ar: "تدريب شامل للمدراء على خلق بيئات آمنة نفسياً",
    owner: "HR Director",
    priority: "High",
    duration_weeks: 8,
    expected_impact: "Increase psychological safety scores by 15-20%",
    kpis: [
      { metric: "Psychological Safety Score", target: "+15 points", baseline: 0 },
      { metric: "Manager Confidence Rating", target: "85%", baseline: 0 },
      { metric: "Team Engagement", target: "+10%", baseline: 0 }
    ],
    milestones: [
      { week: 2, title: "Training Design Complete", description: "Finalize curriculum and materials" },
      { week: 4, title: "Pilot Training Launch", description: "Train first cohort of managers" },
      { week: 6, title: "Feedback Integration", description: "Incorporate feedback and iterate" },
      { week: 8, title: "Full Rollout Complete", description: "All managers trained and certified" }
    ]
  },
  decision_rights_reset: {
    title: "Decision Rights Reset (RACI)",
    title_ar: "إعادة تعيين صلاحيات القرار (راسي)",
    description: "Clarify decision-making authority using RACI framework",
    description_ar: "توضيح صلاحيات اتخاذ القرار باستخدام إطار راسي",
    owner: "Operations Director",
    priority: "High",
    duration_weeks: 6,
    expected_impact: "Reduce decision bottlenecks by 40%, improve clarity",
    kpis: [
      { metric: "Decision Speed", target: "40% faster", baseline: 0 },
      { metric: "Role Clarity Score", target: "90%", baseline: 0 },
      { metric: "Cross-team Efficiency", target: "+25%", baseline: 0 }
    ],
    milestones: [
      { week: 1, title: "Current State Mapping", description: "Document existing decision processes" },
      { week: 3, title: "RACI Matrix Design", description: "Create new decision authority matrix" },
      { week: 4, title: "Stakeholder Alignment", description: "Get leadership buy-in and approval" },
      { week: 6, title: "Implementation Complete", description: "New system operational" }
    ]
  },
  cross_team_rituals: {
    title: "Cross-Team Collaboration Rituals",
    title_ar: "طقوس التعاون بين الفرق",
    description: "Implement regular cross-functional collaboration sessions",
    description_ar: "تنفيذ جلسات تعاون منتظمة بين الوظائف المختلفة",
    owner: "Team Lead",
    priority: "Medium",
    duration_weeks: 12,
    expected_impact: "Improve cross-team coordination by 30%",
    kpis: [
      { metric: "Cross-team Tasks Completion", target: "+20%", baseline: 0 },
      { metric: "Silo Breaking Score", target: "80%", baseline: 0 },
      { metric: "Innovation Ideas", target: "+35%", baseline: 0 }
    ],
    milestones: [
      { week: 2, title: "Ritual Design", description: "Define formats and cadence" },
      { week: 4, title: "Pilot Launch", description: "Start with 2-3 key teams" },
      { week: 8, title: "Expansion", description: "Roll out to all teams" },
      { week: 12, title: "Optimization", description: "Refine based on feedback" }
    ]
  },
  recognition_refresh: {
    title: "Recognition System Refresh",
    title_ar: "تجديد نظام التقدير",
    description: "Redesign employee recognition to align with company values",
    description_ar: "إعادة تصميم تقدير الموظفين ليتماشى مع قيم الشركة",
    owner: "HR Manager",
    priority: "Medium",
    duration_weeks: 10,
    expected_impact: "Boost values alignment and engagement by 25%",
    kpis: [
      { metric: "Values Alignment Score", target: "+20 points", baseline: 0 },
      { metric: "Employee Engagement", target: "+15%", baseline: 0 },
      { metric: "Recognition Frequency", target: "2x increase", baseline: 0 }
    ],
    milestones: [
      { week: 2, title: "Current System Audit", description: "Assess existing recognition programs" },
      { week: 4, title: "New System Design", description: "Create values-based recognition framework" },
      { week: 6, title: "Platform Implementation", description: "Deploy new recognition tools" },
      { week: 10, title: "Full Adoption", description: "System fully operational across organization" }
    ]
  },
  lean_approvals_pilot: {
    title: "Lean Approvals Pilot",
    title_ar: "تجريب الموافقات الرشيقة",
    description: "Streamline approval processes to reduce bureaucracy",
    description_ar: "تبسيط عمليات الموافقة لتقليل البيروقراطية",
    owner: "Process Owner",
    priority: "High",
    duration_weeks: 8,
    expected_impact: "Reduce approval time by 50%, eliminate 30% of steps",
    kpis: [
      { metric: "Approval Time", target: "-50%", baseline: 0 },
      { metric: "Process Steps", target: "-30%", baseline: 0 },
      { metric: "Employee Satisfaction", target: "+20%", baseline: 0 }
    ],
    milestones: [
      { week: 2, title: "Process Mapping", description: "Document current approval flows" },
      { week: 4, title: "Optimization Design", description: "Create streamlined processes" },
      { week: 6, title: "Pilot Testing", description: "Test with select departments" },
      { week: 8, title: "Rollout Plan", description: "Prepare for organization-wide deployment" }
    ]
  },
  customer_voice_huddles: {
    title: "Customer Voice Huddles",
    title_ar: "اجتماعات صوت العميل",
    description: "Regular sessions to share customer feedback across teams",
    description_ar: "جلسات منتظمة لمشاركة تعليقات العملاء عبر الفرق",
    owner: "Customer Success Manager",
    priority: "Medium",
    duration_weeks: 6,
    expected_impact: "Improve customer focus and market orientation",
    kpis: [
      { metric: "Customer Satisfaction", target: "+15%", baseline: 0 },
      { metric: "Market Culture Score", target: "+10 points", baseline: 0 },
      { metric: "Customer-driven Ideas", target: "50 per quarter", baseline: 0 }
    ],
    milestones: [
      { week: 1, title: "Huddle Format Design", description: "Define structure and content" },
      { week: 2, title: "Pilot Sessions", description: "Test with key departments" },
      { week: 4, title: "Full Implementation", description: "Deploy across all teams" },
      { week: 6, title: "Impact Assessment", description: "Measure early results" }
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { tenantId, surveyId, waveId }: GenerateChangePlanRequest = await req.json();

    console.log(`Starting change plan generation for tenant: ${tenantId}, survey: ${surveyId}, wave: ${waveId}`);

    // Log the action start
    const { data: actionLog } = await supabase
      .from('agent_actions')
      .insert({
        tenant_id: tenantId,
        action_type: 'cci_change_plan_generation',
        input_data: { tenantId, surveyId, waveId },
        status: 'running'
      })
      .select()
      .single();

    // 1. Fetch overview data via RPC
    const { data: overviewData, error: overviewError } = await supabase
      .rpc('cci_get_overview_v1', {
        p_tenant: tenantId,
        p_survey: surveyId,
        p_wave: waveId
      });

    if (overviewError) {
      throw new Error(`Failed to fetch overview: ${overviewError.message}`);
    }

    if (!overviewData || overviewData.length === 0) {
      throw new Error('No overview data found. Please compute scores first.');
    }

    const overview = overviewData[0];
    console.log('Overview data fetched:', overview);

    // 2. Identify top 3-5 gaps based on scores
    const gaps = identifyGaps(overview);
    console.log('Identified gaps:', gaps);

    // 3. Generate initiatives based on gaps
    const initiatives = generateInitiatives(gaps, overview);
    console.log(`Generated ${initiatives.length} initiatives`);

    // 4. Create schedule for D30/D60/D90 pulses
    const schedule = createSchedule();

    // 5. Generate communications
    const comms = generateCommunications(initiatives, overview);

    // 6. Insert into cci_playbooks
    const { data: playbook, error: playbookError } = await supabase
      .from('cci_playbooks')
      .insert({
        tenant_id: tenantId,
        survey_id: surveyId,
        wave_id: waveId,
        title: '90-Day Culture Change Plan',
        description: `AI-generated change plan based on CCI assessment results. Focus areas: ${gaps.map(g => g.area).join(', ')}`,
        status: 'draft',
        initiatives: initiatives,
        schedule: schedule,
        ai_summary: generateAISummary(initiatives, gaps, overview),
        comms_en: comms.english,
        comms_ar: comms.arabic,
        manager_brief: comms.managerBrief
      })
      .select()
      .single();

    if (playbookError) {
      throw new Error(`Failed to create playbook: ${playbookError.message}`);
    }

    const executionTime = Date.now() - startTime;

    // Update action log
    await supabase
      .from('agent_actions')
      .update({
        status: 'completed',
        output_data: {
          playbook_id: playbook.id,
          initiatives_count: initiatives.length,
          gaps_identified: gaps.length,
          overview_scores: {
            balance_score: overview.balance_score,
            risk_index: overview.risk_index,
            psych_safety: overview.psych_safety
          }
        },
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })
      .eq('id', actionLog?.id);

    console.log(`Change plan generated successfully in ${executionTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      playbook_id: playbook.id,
      initiatives_count: initiatives.length,
      gaps_identified: gaps.map(g => g.area),
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

function identifyGaps(overview: any): Array<{area: string, score: number, priority: 'High' | 'Medium' | 'Low'}> {
  const gaps: Array<{area: string, score: number, priority: 'High' | 'Medium' | 'Low'}> = [];

  // Check psychological safety
  if (overview.psych_safety < 60) {
    gaps.push({
      area: 'Psychological Safety',
      score: overview.psych_safety,
      priority: overview.psych_safety < 40 ? 'High' : 'Medium'
    });
  }

  // Check CVF dimensions
  if (overview.cvf) {
    const cvfScores = overview.cvf;
    Object.entries(cvfScores).forEach(([dimension, score]: [string, any]) => {
      if (score < 60) {
        gaps.push({
          area: `CVF ${dimension}`,
          score: score,
          priority: score < 40 ? 'High' : 'Medium'
        });
      }
    });
  }

  // Check Web dimensions
  if (overview.web) {
    const webScores = overview.web;
    Object.entries(webScores).forEach(([dimension, score]: [string, any]) => {
      if (score < 60) {
        gaps.push({
          area: `Cultural Web ${dimension}`,
          score: score,
          priority: score < 40 ? 'High' : 'Medium'
        });
      }
    });
  }

  // Check values alignment
  if (overview.barrett?.values_alignment < 70) {
    gaps.push({
      area: 'Values Alignment',
      score: overview.barrett.values_alignment,
      priority: overview.barrett.values_alignment < 50 ? 'High' : 'Medium'
    });
  }

  // Sort by priority and score, take top 5
  return gaps
    .sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || a.score - b.score;
    })
    .slice(0, 5);
}

function generateInitiatives(gaps: Array<{area: string, score: number, priority: string}>, overview: any): Initiative[] {
  const initiatives: Initiative[] = [];
  const usedTemplates = new Set<string>();

  gaps.forEach((gap, index) => {
    let templateKey = '';

    // Map gaps to initiative templates
    if (gap.area === 'Psychological Safety') {
      templateKey = 'manager_safety_training';
    } else if (gap.area.includes('Power Structures') || gap.area.includes('Control Systems')) {
      templateKey = 'decision_rights_reset';
    } else if (gap.area.includes('Clan') || gap.area.includes('Rituals')) {
      templateKey = 'cross_team_rituals';
    } else if (gap.area === 'Values Alignment') {
      templateKey = 'recognition_refresh';
    } else if (gap.area.includes('Hierarchy') || gap.area.includes('Control')) {
      templateKey = 'lean_approvals_pilot';
    } else if (gap.area.includes('Market')) {
      templateKey = 'customer_voice_huddles';
    }

    // Use fallback if template already used or not found
    if (!templateKey || usedTemplates.has(templateKey)) {
      const availableTemplates = Object.keys(INITIATIVE_TEMPLATES).filter(k => !usedTemplates.has(k));
      if (availableTemplates.length > 0) {
        templateKey = availableTemplates[0];
      }
    }

    if (templateKey && INITIATIVE_TEMPLATES[templateKey]) {
      const template = INITIATIVE_TEMPLATES[templateKey];
      const initiative: Initiative = {
        ...template,
        id: `init_${Date.now()}_${index}`,
        priority: gap.priority as 'High' | 'Medium' | 'Low',
        kpis: template.kpis.map(kpi => ({
          ...kpi,
          baseline: gap.score
        }))
      };

      initiatives.push(initiative);
      usedTemplates.add(templateKey);
    }
  });

  return initiatives;
}

function createSchedule(): any {
  const now = new Date();
  return {
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
}

function generateCommunications(initiatives: Initiative[], overview: any): {english: string, arabic: string, managerBrief: string} {
  const english = `
# 90-Day Culture Change Plan

Based on our recent Culture Climate Index assessment, we've identified key opportunities to strengthen our organizational culture and improve performance.

## Current State
- Overall Balance Score: ${overview.balance_score || 'N/A'}
- Risk Index: ${overview.risk_index || 'N/A'}
- Psychological Safety: ${overview.psych_safety || 'N/A'}

## Key Initiatives
${initiatives.map((init, i) => `
${i + 1}. **${init.title}**
   - Owner: ${init.owner}
   - Duration: ${init.duration_weeks} weeks
   - Expected Impact: ${init.expected_impact}
`).join('')}

## Success Metrics
We will track progress through regular pulse checks at 30, 60, and 90 days, measuring key performance indicators for each initiative.

Let's work together to build a stronger, more engaged culture!
`;

  const arabic = `
# خطة تغيير الثقافة لمدة 90 يومًا

بناءً على تقييم مؤشر مناخ الثقافة الأخير، حددنا الفرص الرئيسية لتقوية ثقافتنا التنظيمية وتحسين الأداء.

## الوضع الحالي
- نتيجة التوازن الإجمالية: ${overview.balance_score || 'غير متوفر'}
- مؤشر المخاطر: ${overview.risk_index || 'غير متوفر'}
- الأمان النفسي: ${overview.psych_safety || 'غير متوفر'}

## المبادرات الرئيسية
${initiatives.map((init, i) => `
${i + 1}. **${init.title_ar}**
   - المسؤول: ${init.owner}
   - المدة: ${init.duration_weeks} أسابيع
   - التأثير المتوقع: ${init.expected_impact}
`).join('')}

## مؤشرات النجاح
سنتابع التقدم من خلال فحوصات نبضية منتظمة في الأيام 30 و60 و90، قياس مؤشرات الأداء الرئيسية لكل مبادرة.

لنعمل معًا لبناء ثقافة أقوى وأكثر إشراكًا!
`;

  const managerBrief = `
# Manager Brief: 90-Day Culture Change Plan

## Your Role
As a manager, you are critical to the success of these culture change initiatives. Your teams look to you for guidance, support, and modeling of desired behaviors.

## Key Actions Required:
1. **Champion the initiatives** - Show visible support and enthusiasm
2. **Communicate regularly** - Keep your team informed of progress and changes
3. **Provide resources** - Ensure your team has what they need to participate
4. **Model behaviors** - Demonstrate the cultural changes you want to see
5. **Gather feedback** - Listen to your team's concerns and suggestions

## Support Available:
- Training materials and resources
- Regular check-ins with HR/Leadership team
- Peer manager support network
- Progress tracking dashboards

## Success Metrics:
- Team engagement scores
- Initiative participation rates
- Behavioral change indicators
- Employee feedback

Remember: Culture change takes time and consistent effort. Your leadership in the next 90 days will set the foundation for long-term success.
`;

  return { english, arabic, managerBrief };
}

function generateAISummary(initiatives: Initiative[], gaps: any[], overview: any): string {
  return `AI-Generated Culture Change Plan Summary:

Analyzed ${overview.n || 0} survey responses and identified ${gaps.length} priority areas for improvement.

Key Focus Areas:
${gaps.map(g => `- ${g.area}: Score ${g.score}/100 (${g.priority} priority)`).join('\n')}

Generated ${initiatives.length} targeted initiatives with specific KPIs and milestones.

Expected Outcomes:
- Psychological Safety improvement: +15-20 points
- Process efficiency gains: 30-40% faster approvals
- Cross-team collaboration: +20-25% increase
- Values alignment: +15-20 points

Implementation Schedule: 90-day phased approach with regular pulse checks.

AI Confidence Level: High (based on proven change management frameworks and cultural assessment data)

Recommended Review: 30-day intervals with stakeholder feedback integration.`;
}