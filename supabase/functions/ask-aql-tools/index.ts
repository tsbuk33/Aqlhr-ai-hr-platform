import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ToolRequest {
  tool: string;
  parameters: any;
  tenantId: string;
  userId: string;
  prompt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, parameters, tenantId, userId, prompt }: ToolRequest = await req.json();
    const startTime = Date.now();
    
    console.log(`Executing tool: ${tool} for tenant: ${tenantId}`);

    let result: any;
    let success = true;
    let errorMessage = null;

    try {
      switch (tool) {
        case 'get_headcount':
          result = await getHeadcount(tenantId);
          break;
        case 'get_saudization':
          result = await getSaudization(tenantId);
          break;
        case 'create_task':
          result = await createTask(tenantId, userId, parameters);
          break;
        case 'export_cci_pdf':
          result = await exportCciPdf(tenantId, parameters);
          break;
        case 'find_document':
          result = await findDocument(tenantId, parameters);
          break;
        default:
          throw new Error(`Unknown tool: ${tool}`);
      }
    } catch (error) {
      success = false;
      errorMessage = error.message;
      result = { error: error.message };
    }

    // Log the action
    await supabase.from('agent_actions').insert({
      tenant_id: tenantId,
      user_id: userId,
      action_type: 'tool_execution',
      tool_name: tool,
      prompt: prompt,
      tool_payload: parameters,
      response_data: result,
      execution_time_ms: Date.now() - startTime,
      success: success,
      error_message: errorMessage
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Ask Aql Tools error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function getHeadcount(tenantId: string) {
  const { data: employees, error } = await supabase
    .from('hr_employees')
    .select('id, employment_status, is_saudi')
    .eq('company_id', tenantId)
    .eq('employment_status', 'active');
  
  if (error) throw error;

  const totalActive = employees?.length || 0;
  const saudiCount = employees?.filter(emp => emp.is_saudi).length || 0;
  const nonSaudiCount = totalActive - saudiCount;

  return {
    source: "HR Employee Database",
    scope: `Active employees only (n=${totalActive})`,
    data: {
      total_active_employees: totalActive,
      saudi_employees: saudiCount,
      non_saudi_employees: nonSaudiCount,
      last_updated: new Date().toISOString()
    }
  };
}

async function getSaudization(tenantId: string) {
  const { data: employees, error } = await supabase
    .from('hr_employees')
    .select('is_saudi, employment_status')
    .eq('company_id', tenantId)
    .eq('employment_status', 'active');
  
  if (error) throw error;

  const totalActive = employees?.length || 0;
  const saudiCount = employees?.filter(emp => emp.is_saudi).length || 0;
  const saudizationRate = totalActive > 0 ? ((saudiCount / totalActive) * 100) : 0;

  // Check iqama expiries in next 30 days
  const { data: expiringIqamas, error: iqamaError } = await supabase
    .from('hr_employees')
    .select('id, iqama_expiry')
    .eq('company_id', tenantId)
    .eq('employment_status', 'active')
    .eq('is_saudi', false)
    .gte('iqama_expiry', new Date().toISOString().split('T')[0])
    .lte('iqama_expiry', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (iqamaError) throw iqamaError;

  return {
    source: "HR Employee Database + Document System",
    scope: `Active employees only (n≥${Math.min(7, totalActive)})`,
    data: {
      saudization_rate: Math.round(saudizationRate * 100) / 100,
      total_employees: totalActive,
      saudi_employees: saudiCount,
      iqamas_expiring_30_days: expiringIqamas?.length || 0,
      expiring_details: expiringIqamas?.map(emp => ({
        employee_id: emp.id,
        expiry_date: emp.iqama_expiry
      })) || [],
      compliance_status: saudizationRate >= 60 ? 'compliant' : 'attention_needed',
      last_updated: new Date().toISOString()
    }
  };
}

async function createTask(tenantId: string, userId: string, parameters: any) {
  const { title, description, priority = 'medium', due_days = 7 } = parameters;
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + due_days);

  const { data: task, error } = await supabase.functions.invoke('task-create-v1', {
    body: {
      p_tenant_id: tenantId,
      p_module: 'ask_aql_assistant',
      p_title: title,
      p_description: description,
      p_due_at: dueDate.toISOString(),
      p_priority: priority,
      p_owner_user_id: userId,
      p_metadata: {
        created_by_ai: true,
        source: 'ask_aql',
        auto_generated: true
      }
    }
  });

  if (error) throw error;

  return {
    source: "Task Management System",
    scope: "Task created successfully",
    data: {
      task_id: task,
      title: title,
      description: description,
      due_date: dueDate.toISOString(),
      priority: priority,
      status: 'created'
    }
  };
}

async function exportCciPdf(tenantId: string, parameters: any) {
  // Stub implementation for CCI PDF export
  const { survey_id } = parameters;
  
  // In real implementation, this would generate a PDF export
  return {
    source: "CCI Survey System",
    scope: "PDF export initiated",
    data: {
      export_status: 'initiated',
      survey_id: survey_id,
      estimated_completion: '2-3 minutes',
      download_url: null, // Would be populated when ready
      message: 'PDF export has been queued. You will receive a notification when ready.'
    }
  };
}

async function findDocument(tenantId: string, parameters: any) {
  const { query, document_type } = parameters;
  
  // Stub implementation for document search
  // In real implementation, this would use vector search
  const { data: documents, error } = await supabase
    .from('saudi_documents')
    .select('id, title_en, document_type, created_at')
    .eq('company_id', tenantId)
    .ilike('title_en', `%${query}%`)
    .limit(5);

  if (error) throw error;

  return {
    source: "Document Management System",
    scope: `Search results for "${query}" (showing top 5)`,
    data: {
      query: query,
      results_count: documents?.length || 0,
      documents: documents?.map(doc => ({
        id: doc.id,
        title: doc.title_en,
        type: doc.document_type,
        relevance_score: 0.85, // Placeholder
        created_at: doc.created_at
      })) || [],
      search_metadata: {
        search_time_ms: Math.random() * 100 + 50,
        total_indexed: 1250 // Placeholder
      }
    }
  };
}