import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentSkillRequest {
  tenantId: string;
  skillCode: string;
  input?: any;
  dryRun?: boolean;
}

interface AgentSkillResponse {
  success: boolean;
  actions: any[];
  metrics: any;
  executionId: string;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tenantId, skillCode, input = {}, dryRun = false }: AgentSkillRequest = await req.json();
    
    if (!tenantId || !skillCode) {
      throw new Error('Missing required fields: tenantId and skillCode');
    }

    // Check if skill is enabled for this tenant
    const { data: binding, error: bindingError } = await supabase
      .from('agent_skill_bindings')
      .select('*, agent_skills(*)')
      .eq('tenant_id', tenantId)
      .eq('skill_code', skillCode)
      .eq('enabled', true)
      .single();

    if (bindingError || !binding) {
      throw new Error(`Skill ${skillCode} is not enabled for tenant ${tenantId}`);
    }

    // Generate execution ID
    const executionId = crypto.randomUUID();
    
    // Log execution start
    await supabase.from('agent_skill_executions').insert({
      tenant_id: tenantId,
      skill_code: skillCode,
      execution_id: executionId,
      status: 'running',
      input_data: input,
      dry_run: dryRun
    });

    let result: AgentSkillResponse;
    
    try {
      // Route to specific skill handler
      result = await executeSkill(skillCode, {
        tenantId,
        input: { ...binding.config, ...input },
        dryRun,
        executionId
      }, supabase);

      // Log successful execution
      await supabase.from('agent_skill_executions')
        .update({
          status: 'success',
          output_data: result,
          metrics: result.metrics,
          completed_at: new Date().toISOString()
        })
        .eq('execution_id', executionId);

      // Update binding metrics
      await supabase.from('agent_skill_bindings')
        .update({
          last_run_at: new Date().toISOString(),
          last_run_status: 'success',
          last_run_metrics: result.metrics,
          run_count: binding.run_count + 1
        })
        .eq('id', binding.id);

    } catch (skillError) {
      console.error(`Skill execution failed:`, skillError);
      
      // Log failed execution
      await supabase.from('agent_skill_executions')
        .update({
          status: 'error',
          error_message: skillError.message,
          completed_at: new Date().toISOString()
        })
        .eq('execution_id', executionId);

      // Update binding with error status
      await supabase.from('agent_skill_bindings')
        .update({
          last_run_at: new Date().toISOString(),
          last_run_status: 'error',
          run_count: binding.run_count + 1
        })
        .eq('id', binding.id);

      throw skillError;
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Agent skill execution error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        actions: [],
        metrics: {},
        executionId: ''
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Skill execution router
async function executeSkill(
  skillCode: string, 
  params: { tenantId: string; input: any; dryRun: boolean; executionId: string }, 
  supabase: any
): Promise<AgentSkillResponse> {
  
  switch (skillCode) {
    case 'cci_change_plan':
      return await executeCCIChangePlan(params, supabase);
    case 'compliance_nitaqat_watch':
      return await executeNitaqatWatch(params, supabase);
    case 'work_permit_watch':
      return await executeWorkPermitWatch(params, supabase);
    case 'docs_ingest_ocr':
      return await executeDocsIngestOCR(params, supabase);
    case 'pulse_survey_send':
      return await executePulseSurveySend(params, supabase);
    default:
      throw new Error(`Unknown skill: ${skillCode}`);
  }
}

// Individual skill implementations
async function executeCCIChangePlan(params: any, supabase: any): Promise<AgentSkillResponse> {
  const { tenantId, input, dryRun, executionId } = params;
  
  // Get latest CCI survey data
  const { data: surveys, error } = await supabase
    .from('cci_surveys')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !surveys?.length) {
    return {
      success: false,
      actions: [],
      metrics: { surveys_found: 0 },
      executionId,
      error: 'No completed CCI surveys found'
    };
  }

  const actions = [];
  if (input.threshold > 0.7) {
    actions.push({
      type: 'suggestion',
      title: 'Culture Change Initiative Recommended',
      description: 'Based on CCI analysis, consider implementing targeted culture change programs',
      data: { survey_id: surveys[0].id, confidence: input.threshold }
    });
  }

  return {
    success: true,
    actions,
    metrics: { 
      surveys_analyzed: surveys.length, 
      recommendations_generated: actions.length,
      threshold_used: input.threshold 
    },
    executionId
  };
}

async function executeNitaqatWatch(params: any, supabase: any): Promise<AgentSkillResponse> {
  const { tenantId, input, dryRun, executionId } = params;
  
  // Check current saudization ratio
  const { data: employees } = await supabase
    .from('hr_employees')
    .select('is_saudi, employment_status')
    .eq('company_id', tenantId)
    .eq('employment_status', 'active');

  if (!employees?.length) {
    return {
      success: true,
      actions: [],
      metrics: { total_employees: 0, saudization_ratio: 0 },
      executionId
    };
  }

  const totalEmployees = employees.length;
  const saudiEmployees = employees.filter(emp => emp.is_saudi).length;
  const saudizationRatio = (saudiEmployees / totalEmployees) * 100;

  const actions = [];
  if (saudizationRatio < 60) { // Critical threshold
    actions.push({
      type: 'alert',
      title: 'Nitaqat Compliance Risk',
      description: `Saudization ratio is ${saudizationRatio.toFixed(1)}% - below critical threshold`,
      priority: 'high',
      data: { current_ratio: saudizationRatio, required_ratio: 60 }
    });
  }

  return {
    success: true,
    actions,
    metrics: { 
      total_employees: totalEmployees,
      saudi_employees: saudiEmployees,
      saudization_ratio: saudizationRatio,
      compliance_status: saudizationRatio >= 60 ? 'compliant' : 'at_risk'
    },
    executionId
  };
}

async function executeWorkPermitWatch(params: any, supabase: any): Promise<AgentSkillResponse> {
  const { tenantId, input, dryRun, executionId } = params;
  
  // Check for expiring documents
  const alertDays = input.alert_days || [90, 60, 30, 7];
  const actions = [];

  for (const days of alertDays) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const { data: expiringDocs } = await supabase
      .from('saudi_documents')
      .select('*, hr_employees(full_name_en)')
      .eq('document_category', 'work_permit')
      .eq('compliance_status', 'valid')
      .lte('expiry_date', expiryDate.toISOString().split('T')[0]);

    if (expiringDocs?.length) {
      actions.push({
        type: 'notification',
        title: `Work Permits Expiring in ${days} Days`,
        description: `${expiringDocs.length} work permits require renewal attention`,
        priority: days <= 30 ? 'high' : 'medium',
        data: { 
          expiring_in_days: days, 
          count: expiringDocs.length,
          documents: expiringDocs.map(doc => ({
            id: doc.id,
            employee_name: doc.hr_employees?.full_name_en,
            expiry_date: doc.expiry_date
          }))
        }
      });
    }
  }

  return {
    success: true,
    actions,
    metrics: { 
      alert_triggers: alertDays,
      total_alerts: actions.length,
      documents_monitored: actions.reduce((sum, action) => sum + (action.data?.count || 0), 0)
    },
    executionId
  };
}

async function executeDocsIngestOCR(params: any, supabase: any): Promise<AgentSkillResponse> {
  const { tenantId, input, dryRun, executionId } = params;
  
  // This would integrate with OCR service in real implementation
  // For now, simulate document processing
  
  const actions = [{
    type: 'processing',
    title: 'Document OCR Processing Queued',
    description: 'Documents are being processed for text extraction and data mining',
    data: { 
      confidence_threshold: input.confidence_threshold,
      languages: input.languages,
      processing_status: 'queued'
    }
  }];

  return {
    success: true,
    actions,
    metrics: { 
      documents_queued: 1,
      confidence_threshold: input.confidence_threshold,
      languages_supported: input.languages?.length || 0
    },
    executionId
  };
}

async function executePulseSurveySend(params: any, supabase: any): Promise<AgentSkillResponse> {
  const { tenantId, input, dryRun, executionId } = params;
  
  // Check if it's time for pulse survey based on frequency
  const { data: employees } = await supabase
    .from('hr_employees')
    .select('id, full_name_en')
    .eq('company_id', tenantId)
    .eq('employment_status', 'active');

  const actions = [];
  if (employees?.length && !dryRun) {
    actions.push({
      type: 'survey',
      title: 'Pulse Survey Sent',
      description: `Monthly pulse survey sent to ${employees.length} employees`,
      data: { 
        frequency: input.frequency,
        employee_count: employees.length,
        reminder_schedule: input.reminder_days
      }
    });
  }

  return {
    success: true,
    actions,
    metrics: { 
      employees_targeted: employees?.length || 0,
      frequency: input.frequency,
      reminders_scheduled: input.reminder_days?.length || 0
    },
    executionId
  };
}

serve(handler);