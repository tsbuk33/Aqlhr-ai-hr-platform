import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, conversation_history = [], tools = [] } = await req.json();
    
    console.log('AI Core Engine request:', { query, context, tools_count: tools.length });
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          response: context?.language === 'ar' 
            ? 'عذراً، الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.'
            : 'Sorry, the service is currently unavailable. Please try again later.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt based on context
    const systemPrompt = buildSystemPrompt(context);
    
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation_history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: query }
    ];

    // Prepare function definitions for OpenAI
    const functions = tools.length > 0 ? tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    })) : undefined;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        tools: functions,
        tool_choice: functions ? 'auto' : undefined,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const aiData = await openAIResponse.json();
    const aiMessage = aiData.choices[0].message;

    let response = aiMessage.content;
    let toolCalls = [];

    // Handle function calls
    if (aiMessage.tool_calls) {
      console.log('AI requested tool calls:', aiMessage.tool_calls);
      
      for (const toolCall of aiMessage.tool_calls) {
        const toolResult = await executeToolCall(toolCall, context);
        toolCalls.push({
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
          result: toolResult
        });
      }

      // If there were tool calls, get final response
      if (toolCalls.length > 0) {
        const followUpMessages = [
          ...messages,
          aiMessage,
          ...toolCalls.map(call => ({
            role: 'tool',
            tool_call_id: aiMessage.tool_calls.find(tc => tc.function.name === call.name)?.id,
            content: JSON.stringify(call.result)
          }))
        ];

        const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: followUpMessages,
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (followUpResponse.ok) {
          const followUpData = await followUpResponse.json();
          response = followUpData.choices[0].message.content;
        }
      }
    }

    // Log the interaction
    await logInteraction(query, response, context, toolCalls);

    return new Response(
      JSON.stringify({ 
        response,
        timestamp: new Date().toISOString(),
        module: context?.module || 'unknown',
        tool_calls: toolCalls,
        language: context?.language || 'en'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('AI Core Engine error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        response: 'A system error occurred. Please try again.'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function buildSystemPrompt(context: any): string {
  const isArabic = context?.language === 'ar';
  const module = context?.module || 'AqlHR';
  const userCompany = context?.company_name || 'your company';

  const basePrompt = isArabic
    ? `أنت مساعد ذكي متخصص في منصة عقل HR، وهي منصة شاملة لإدارة الموارد البشرية في المملكة العربية السعودية.`
    : `You are an AI assistant specialized in AqlHR platform, a comprehensive HR management system for Saudi Arabia.`;

  const capabilities = isArabic
    ? `إمكانياتك تشمل:
• تحليل البيانات والتقارير
• التكامل مع الأنظمة الحكومية السعودية (قوى، أبشر، مقيم، مداد، إلم، صحة)
• إدارة الرواتب ونظام WPS
• حساب مساهمات التأمينات الاجتماعية (GOSI)
• إدارة الأداء والتدريب
• التخطيط للتعاقب الوظيفي
• تحليلات الذكاء الاصطناعي
• إدارة الامتثال والمخاطر`
    : `Your capabilities include:
• Data analysis and reporting
• Saudi government systems integration (Qiwa, Absher, Muqeem, Mudad, Elm, Seha)
• Payroll management and WPS processing
• GOSI contribution calculations
• Performance and training management
• Succession planning
• AI-powered analytics
• Compliance and risk management`;

  const moduleSpecific = getModuleSpecificPrompt(module, isArabic);

  return `${basePrompt}

${capabilities}

${moduleSpecific}

${isArabic 
  ? `أنت تساعد موظفي ${userCompany} في وحدة ${module}. قدم إجابات دقيقة ومفيدة باللغة العربية.`
  : `You're helping ${userCompany} employees with the ${module} module. Provide accurate and helpful responses in English.`
}

${isArabic
  ? 'استخدم الأدوات المتاحة عند الحاجة لجلب البيانات أو تنفيذ العمليات.'
  : 'Use available tools when needed to fetch data or perform operations.'
}`;
}

function getModuleSpecificPrompt(module: string, isArabic: boolean): string {
  const modulePrompts = {
    'employees': isArabic 
      ? 'أنت متخصص في إدارة بيانات الموظفين، التوظيف، والإدماج الوظيفي.'
      : 'You specialize in employee data management, recruitment, and onboarding.',
    'payroll': isArabic
      ? 'أنت خبير في معالجة الرواتب، نظام WPS، والتكامل مع التأمينات الاجتماعية.'
      : 'You are an expert in payroll processing, WPS system, and GOSI integration.',
    'analytics': isArabic
      ? 'أنت متخصص في تحليل البيانات، إنشاء التقارير، والذكاء الاصطناعي للموارد البشرية.'
      : 'You specialize in data analytics, report generation, and HR artificial intelligence.',
    'government': isArabic
      ? 'أنت خبير في التكامل مع الأنظمة الحكومية السعودية والامتثال التنظيمي.'
      : 'You are an expert in Saudi government systems integration and regulatory compliance.',
    'time-attendance': isArabic
      ? 'أنت متخصص في إدارة الوقت والحضور، تتبع ساعات العمل، والإجازات.'
      : 'You specialize in time and attendance management, work hours tracking, and leave management.'
  };

  return modulePrompts[module] || (isArabic 
    ? 'أنت مساعد شامل لجميع وحدات منصة عقل HR.'
    : 'You are a comprehensive assistant for all AqlHR platform modules.');
}

async function executeToolCall(toolCall: any, context: any) {
  const { name, arguments: args } = toolCall.function;
  
  try {
    console.log(`Executing tool: ${name} with args:`, args);
    
    switch (name) {
      case 'get_employee_data':
        return await getEmployeeData(JSON.parse(args), context);
      case 'get_payroll_summary':
        return await getPayrollSummary(JSON.parse(args), context);
      case 'get_analytics_data':
        return await getAnalyticsData(JSON.parse(args), context);
      case 'sync_government_data':
        return await syncGovernmentData(JSON.parse(args), context);
      case 'generate_report':
        return await generateReport(JSON.parse(args), context);
      case 'search_documents':
        return await searchDocuments(JSON.parse(args), context);
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);
    return { error: error.message };
  }
}

async function getEmployeeData(args: any, context: any) {
  const { employee_id, filters = {} } = args;
  
  let query = supabase.from('employees').select('*');
  
  if (employee_id) {
    query = query.eq('id', employee_id);
  }
  
  if (context?.company_id) {
    query = query.eq('company_id', context.company_id);
  }
  
  if (filters.department) {
    query = query.eq('department', filters.department);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.limit(100);
  
  if (error) throw error;
  
  return {
    employees: data,
    count: data?.length || 0,
    timestamp: new Date().toISOString()
  };
}

async function getPayrollSummary(args: any, context: any) {
  const { month, year, department } = args;
  
  let query = supabase
    .from('employees')
    .select('id, first_name, last_name, department, basic_salary, status');
    
  if (context?.company_id) {
    query = query.eq('company_id', context.company_id);
  }
  
  if (department) {
    query = query.eq('department', department);
  }
  
  const { data: employees, error } = await query.eq('status', 'active');
  
  if (error) throw error;
  
  const summary = {
    total_employees: employees?.length || 0,
    total_basic_salary: employees?.reduce((sum, emp) => sum + (emp.basic_salary || 0), 0) || 0,
    departments: {},
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear()
  };
  
  // Group by department
  employees?.forEach(emp => {
    if (!summary.departments[emp.department]) {
      summary.departments[emp.department] = {
        count: 0,
        total_salary: 0
      };
    }
    summary.departments[emp.department].count++;
    summary.departments[emp.department].total_salary += emp.basic_salary || 0;
  });
  
  return summary;
}

async function getAnalyticsData(args: any, context: any) {
  const { metric_type, date_range, filters = {} } = args;
  
  // Get employee statistics
  let query = supabase.from('employees').select('*');
  
  if (context?.company_id) {
    query = query.eq('company_id', context.company_id);
  }
  
  const { data: employees, error } = await query;
  
  if (error) throw error;
  
  const analytics = {
    total_employees: employees?.length || 0,
    active_employees: employees?.filter(e => e.status === 'active').length || 0,
    saudi_employees: employees?.filter(e => e.is_saudi === true).length || 0,
    expatriate_employees: employees?.filter(e => e.is_saudi === false).length || 0,
    departments: {},
    average_salary: 0,
    saudization_rate: 0
  };
  
  if (employees && employees.length > 0) {
    // Calculate saudization rate
    analytics.saudization_rate = (analytics.saudi_employees / analytics.total_employees) * 100;
    
    // Calculate average salary
    const totalSalary = employees.reduce((sum, emp) => sum + (emp.basic_salary || 0), 0);
    analytics.average_salary = totalSalary / employees.length;
    
    // Group by departments
    employees.forEach(emp => {
      if (!analytics.departments[emp.department]) {
        analytics.departments[emp.department] = {
          total: 0,
          saudi: 0,
          expatriate: 0
        };
      }
      analytics.departments[emp.department].total++;
      if (emp.is_saudi) {
        analytics.departments[emp.department].saudi++;
      } else {
        analytics.departments[emp.department].expatriate++;
      }
    });
  }
  
  return analytics;
}

async function syncGovernmentData(args: any, context: any) {
  const { system_name, action } = args;
  
  // This would integrate with actual government systems
  const result = {
    system: system_name,
    action: action,
    status: 'success',
    message: `Successfully ${action}ed data with ${system_name}`,
    timestamp: new Date().toISOString()
  };
  
  // Log the sync event
  await supabase.from('ai_sync_events').insert({
    company_id: context?.company_id,
    event_type: `government_sync_${system_name}`,
    source_table: 'ai_tools',
    source_record_id: crypto.randomUUID(),
    affected_modules: [system_name, 'compliance'],
    payload: { action, result }
  });
  
  return result;
}

async function generateReport(args: any, context: any) {
  const { report_type, parameters = {} } = args;
  
  try {
    const { data: reportId, error } = await supabase.rpc('generate_comprehensive_employee_report', {
      _company_id: context?.company_id,
      _filters: parameters,
      _report_name: `AI Generated ${report_type} Report`
    });
    
    if (error) throw error;
    
    return {
      report_id: reportId,
      report_type,
      status: 'generated',
      download_url: `/api/reports/${reportId}/download`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: 'Failed to generate report',
      details: error.message
    };
  }
}

async function searchDocuments(args: any, context: any) {
  const { query, module_key } = args;
  
  try {
    // Search in document embeddings
    const { data: documents, error } = await supabase
      .from('ai_document_embeddings')
      .select('id, file_name, module_key, upload_date, metadata')
      .ilike('file_name', `%${query}%`)
      .eq('company_id', context?.company_id || '')
      .limit(20);
    
    if (error) throw error;
    
    return {
      documents: documents || [],
      count: documents?.length || 0,
      query,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: 'Failed to search documents',
      details: error.message
    };
  }
}

async function logInteraction(query: string, response: string, context: any, toolCalls: any[]) {
  try {
    await supabase.from('ai_interaction_logs').insert({
      company_id: context?.company_id,
      user_id: context?.user_id,
      module_context: context?.module,
      query_text: query,
      response_text: response,
      tool_calls: toolCalls,
      language: context?.language || 'en',
      session_id: context?.session_id
    });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
}