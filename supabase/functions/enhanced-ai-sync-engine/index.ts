import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ToolIntegrationEvent {
  company_id: string;
  tool_name: string;
  action: 'enable' | 'disable' | 'sync' | 'configure';
  metadata?: any;
}

interface AIProcessingResult {
  success: boolean;
  recommendations?: string[];
  analytics?: any;
  integration_suggestions?: string[];
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event_type, payload, company_id } = await req.json();

    console.log('Processing enhanced AI sync event:', { event_type, company_id });

    // Handle different types of sync events
    let result: AIProcessingResult = { success: false };

    switch (event_type) {
      case 'tool_integration_enable':
      case 'tool_integration_disable':
      case 'tool_integration_sync':
        result = await processToolIntegrationEvent(supabase, payload, openaiApiKey);
        break;
        
      case 'ai_tool_recommendation':
        result = await generateToolRecommendations(supabase, payload, openaiApiKey);
        break;
        
      case 'comprehensive_analysis':
        result = await performComprehensiveAnalysis(supabase, company_id, openaiApiKey);
        break;
        
      default:
        result = await processGeneralEvent(supabase, event_type, payload, openaiApiKey);
    }

    // Log the processing result
    await supabase.from('tool_usage_analytics').insert({
      company_id,
      tool_name: 'enhanced_ai_sync_engine',
      action_type: event_type,
      metadata: {
        processing_result: result,
        event_payload: payload
      },
      success: result.success,
      error_message: result.error || null,
      execution_time_ms: Date.now() - parseInt(payload.timestamp || '0')
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced AI sync engine:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processToolIntegrationEvent(
  supabase: any, 
  payload: ToolIntegrationEvent, 
  openaiApiKey?: string
): Promise<AIProcessingResult> {
  try {
    const { company_id, tool_name, action } = payload;

    // Get company and tool integration data
    const [companyData, toolData, integrationStats] = await Promise.all([
      supabase.from('companies').select('*').eq('id', company_id).single(),
      supabase.from('tool_integrations').select('*').eq('company_id', company_id).eq('tool_name', tool_name).single(),
      supabase.from('tool_integrations').select('tool_category, is_enabled').eq('company_id', company_id)
    ]);

    if (!openaiApiKey) {
      return {
        success: true,
        recommendations: [`Tool ${tool_name} ${action}d successfully`]
      };
    }

    // Generate AI recommendations based on tool integration
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for SanadHR, analyzing tool integrations for Saudi Arabian companies. 
            Provide specific, actionable recommendations for HR optimization based on tool usage patterns.`
          },
          {
            role: 'user',
            content: `Company ${companyData.data?.name} has ${action}d the ${tool_name} integration. 
            Current tool status: ${JSON.stringify(integrationStats.data)}
            
            Provide recommendations for:
            1. Workflow optimizations
            2. Additional tool integrations that would complement this
            3. Best practices for using this tool in Saudi HR context
            4. Potential automation opportunities`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    const aiData = await aiResponse.json();
    const recommendations = aiData.choices[0].message.content.split('\n').filter(r => r.trim());

    // Generate integration suggestions based on current tool mix
    const enabledTools = integrationStats.data?.filter(t => t.is_enabled) || [];
    const integrationSuggestions = generateIntegrationSuggestions(tool_name, enabledTools);

    // Create AI tool recommendation if appropriate
    if (action === 'enable' && integrationSuggestions.length > 0) {
      await supabase.from('ai_tool_recommendations').insert({
        company_id,
        recommended_tool: integrationSuggestions[0],
        tool_category: getToolCategory(integrationSuggestions[0]),
        confidence_score: 0.85,
        reasoning: `Based on enabling ${tool_name}, this tool would create synergy`,
        expected_benefits: ['Improved workflow efficiency', 'Better data integration', 'Enhanced automation'],
        priority: 'high'
      });
    }

    return {
      success: true,
      recommendations,
      integration_suggestions: integrationSuggestions,
      analytics: {
        enabled_tools_count: enabledTools.length,
        tool_categories_active: [...new Set(enabledTools.map(t => t.tool_category))].length
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function generateToolRecommendations(
  supabase: any, 
  payload: any, 
  openaiApiKey?: string
): Promise<AIProcessingResult> {
  try {
    const { company_id } = payload;

    // Get comprehensive company data
    const [companyData, employeeStats, toolIntegrations] = await Promise.all([
      supabase.from('companies').select('*').eq('id', company_id).single(),
      supabase.from('employees').select('department, position, is_saudi').eq('company_id', company_id),
      supabase.from('tool_integrations').select('*').eq('company_id', company_id)
    ]);

    if (!openaiApiKey) {
      return {
        success: true,
        recommendations: ['Enable Microsoft Teams for better communication']
      };
    }

    const companyProfile = {
      name: companyData.data?.name,
      industry: companyData.data?.industry,
      size: employeeStats.data?.length || 0,
      saudization_rate: (employeeStats.data?.filter(e => e.is_saudi).length / employeeStats.data?.length * 100) || 0,
      enabled_tools: toolIntegrations.data?.filter(t => t.is_enabled).map(t => t.tool_name) || []
    };

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an AI consultant specializing in HR technology for Saudi Arabian companies. 
            Recommend specific tools based on company profile, considering Saudi labor law compliance and cultural context.`
          },
          {
            role: 'user',
            content: `Analyze this company profile and recommend 3-5 specific tools they should implement next:
            
            Company: ${JSON.stringify(companyProfile, null, 2)}
            
            Consider:
            - Saudi labor law compliance requirements
            - Nitaqat and Saudization goals
            - Industry-specific needs
            - Integration with existing tools
            - ROI potential
            
            Provide specific tool names and clear justification for each recommendation.`
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      }),
    });

    const aiData = await aiResponse.json();
    const recommendations = aiData.choices[0].message.content;

    // Parse recommendations and create database records
    const toolRecommendations = parseAIRecommendations(recommendations);
    
    for (const rec of toolRecommendations) {
      await supabase.from('ai_tool_recommendations').insert({
        company_id,
        recommended_tool: rec.tool,
        tool_category: rec.category,
        confidence_score: rec.confidence,
        reasoning: rec.reasoning,
        expected_benefits: rec.benefits,
        priority: rec.priority
      });
    }

    return {
      success: true,
      recommendations: toolRecommendations.map(r => `${r.tool}: ${r.reasoning}`),
      analytics: companyProfile
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function performComprehensiveAnalysis(
  supabase: any, 
  company_id: string, 
  openaiApiKey?: string
): Promise<AIProcessingResult> {
  try {
    // Get all relevant data for comprehensive analysis
    const [
      employees,
      toolIntegrations,
      aiSyncEvents,
      toolUsageAnalytics
    ] = await Promise.all([
      supabase.from('employees').select('*').eq('company_id', company_id),
      supabase.from('tool_integrations').select('*').eq('company_id', company_id),
      supabase.from('ai_sync_events').select('*').eq('company_id', company_id).order('created_at', { ascending: false }).limit(100),
      supabase.from('tool_usage_analytics').select('*').eq('company_id', company_id).order('created_at', { ascending: false }).limit(50)
    ]);

    const analysisData = {
      employee_count: employees.data?.length || 0,
      enabled_tools: toolIntegrations.data?.filter(t => t.is_enabled).length || 0,
      recent_sync_events: aiSyncEvents.data?.length || 0,
      tool_usage_frequency: toolUsageAnalytics.data?.length || 0,
      saudization_rate: employees.data ? 
        (employees.data.filter(e => e.is_saudi).length / employees.data.length * 100) : 0
    };

    if (!openaiApiKey) {
      return {
        success: true,
        analytics: analysisData,
        recommendations: ['System operating normally']
      };
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an AI analyst providing comprehensive HR technology insights for Saudi companies.'
          },
          {
            role: 'user',
            content: `Provide a comprehensive analysis of this HR system usage:
            
            ${JSON.stringify(analysisData, null, 2)}
            
            Identify:
            1. System health and utilization patterns
            2. Optimization opportunities
            3. Compliance considerations for Saudi context
            4. Strategic recommendations for tool adoption
            5. Areas for automation improvement`
          }
        ],
        temperature: 0.1,
        max_tokens: 600
      }),
    });

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    return {
      success: true,
      analytics: analysisData,
      recommendations: analysis.split('\n').filter(r => r.trim()),
      integration_suggestions: generateSystemOptimizationSuggestions(analysisData)
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function processGeneralEvent(
  supabase: any, 
  event_type: string, 
  payload: any, 
  openaiApiKey?: string
): Promise<AIProcessingResult> {
  // Handle other types of sync events
  return {
    success: true,
    recommendations: [`Processed ${event_type} event successfully`]
  };
}

function generateIntegrationSuggestions(toolName: string, enabledTools: any[]): string[] {
  const toolSynergies = {
    'Microsoft Teams': ['SharePoint', 'Power BI', 'Power Automate'],
    'Slack': ['Google Drive', 'Zapier', 'Google Calendar'],
    'Google Drive': ['Google Calendar', 'Google Analytics', 'DocuSign'],
    'SharePoint': ['Microsoft Teams', 'Power BI', 'Outlook Integration'],
    'Power BI': ['SharePoint', 'Microsoft Teams', 'Custom Connectors'],
    'Zapier': ['Slack', 'Google Drive', 'Calendly']
  };

  const suggestions = toolSynergies[toolName] || [];
  const enabledToolNames = enabledTools.map(t => t.tool_name);
  
  return suggestions.filter(suggestion => !enabledToolNames.includes(suggestion));
}

function getToolCategory(toolName: string): string {
  const categoryMap = {
    'Microsoft Teams': 'communication_collaboration',
    'Slack': 'communication_collaboration',
    'SharePoint': 'document_management',
    'Google Drive': 'document_management',
    'Power BI': 'analytics_bi',
    'Zapier': 'automation_platforms'
  };
  
  return categoryMap[toolName] || 'other';
}

function parseAIRecommendations(recommendations: string): any[] {
  // Simple parsing - in production, this would be more sophisticated
  const lines = recommendations.split('\n').filter(line => line.trim());
  const tools = [];
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [tool, reason] = line.split(':');
      tools.push({
        tool: tool.trim(),
        category: getToolCategory(tool.trim()),
        confidence: 0.8,
        reasoning: reason?.trim() || 'Recommended for optimization',
        benefits: ['Improved efficiency', 'Better integration'],
        priority: 'medium'
      });
    }
  });
  
  return tools.slice(0, 5); // Limit to 5 recommendations
}

function generateSystemOptimizationSuggestions(data: any): string[] {
  const suggestions = [];
  
  if (data.enabled_tools < 5) {
    suggestions.push('Consider enabling more integration tools for better workflow automation');
  }
  
  if (data.saudization_rate < 70) {
    suggestions.push('Focus on tools that support Saudization and local talent development');
  }
  
  if (data.tool_usage_frequency < 10) {
    suggestions.push('Increase tool utilization through training and process optimization');
  }
  
  return suggestions;
}