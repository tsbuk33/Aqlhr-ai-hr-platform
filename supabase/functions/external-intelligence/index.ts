import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExternalIntelligenceRequest {
  moduleContext: string;
  query: string;
  dataType: 'market_data' | 'regulations' | 'benchmarks' | 'trends' | 'best_practices';
  country?: string;
  industry?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { moduleContext, query, dataType, country = 'Saudi Arabia', industry = 'HR Technology' }: ExternalIntelligenceRequest = await req.json();

    console.log('External Intelligence Request:', { moduleContext, dataType, country, industry });

    // Create secure, generic prompts that don't expose company data
    const systemPrompts = {
      market_data: `You are an expert HR market analyst specializing in ${country}. Provide current market data, salary ranges, and industry benchmarks for HR roles and compensation. Focus on factual, publicly available market intelligence.`,
      
      regulations: `You are a legal expert in ${country} labor laws and HR compliance. Provide current regulatory information, compliance requirements, and legal updates relevant to HR operations. Only cite official, publicly available legal information.`,
      
      benchmarks: `You are an HR benchmarking specialist for ${country}. Provide industry-standard metrics, KPIs, and performance benchmarks for HR operations. Focus on widely accepted industry standards and best practices.`,
      
      trends: `You are an HR technology and industry trends analyst for ${country}. Provide insights on current HR trends, emerging technologies, and industry developments. Focus on publicly available market research and trends.`,
      
      best_practices: `You are an HR best practices consultant specializing in ${country}. Provide recommendations for HR processes, workflows, and operational excellence. Focus on proven, industry-standard practices.`
    };

    // Enhanced context-aware prompts based on module
    const moduleEnhancers = {
      analytics: 'Focus on metrics, KPIs, and data-driven insights.',
      payroll: 'Focus on compensation structures, benefits, and payroll best practices.',
      employees: 'Focus on employee lifecycle, engagement, and management practices.',
      recruitment: 'Focus on talent acquisition, hiring trends, and recruitment strategies.',
      performance: 'Focus on performance management, evaluation methods, and improvement strategies.',
      compliance: 'Focus on regulatory compliance, risk management, and legal requirements.',
      executive: 'Focus on strategic insights, executive decision-making, and organizational leadership.'
    };

    const enhancer = moduleEnhancers[moduleContext as keyof typeof moduleEnhancers] || 'Provide comprehensive HR insights.';
    const systemPrompt = `${systemPrompts[dataType]} ${enhancer}`;

    // Sanitize user query to ensure no sensitive data leakage
    const sanitizedQuery = query.replace(/\b\d{10,}\b/g, '[ID]') // Replace long numbers (IDs)
                               .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Replace emails
                               .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[CARD]'); // Replace card numbers

    console.log('Making OpenAI request for external intelligence');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: `${sanitizedQuery}\n\nNote: This is a request for external market intelligence only. Do not request or expect any internal company data.` 
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const externalInsight = data.choices[0].message.content;

    console.log('External intelligence gathered successfully');

    // Structure the response for integration with internal data
    const intelligenceResponse = {
      success: true,
      moduleContext,
      dataType,
      externalInsight,
      country,
      industry,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'OpenAI External Intelligence',
        sanitized: true,
        securityLevel: 'external_only'
      }
    };

    return new Response(JSON.stringify(intelligenceResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in external-intelligence function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to gather external intelligence',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});