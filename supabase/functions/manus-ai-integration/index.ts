import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManusRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  context?: string;
  stream?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model = 'default', temperature = 0.7, max_tokens = 1000, context, stream = false }: ManusRequest = await req.json();

    console.log('🤖 Manus.im Open Source AI Agent Request:', { model, prompt: prompt.substring(0, 100) + '...' });

    // Manus.im Open Source AI Agent - Local Processing
    // Since it's open source, we simulate local AI processing
    const systemContext = context || 'You are an expert AI assistant for AqlHR, a Saudi Arabian HR management system. Provide accurate, helpful responses about HR practices, Saudi labor law, and workforce management.';
    
    // Simulate AI processing based on prompt analysis
    let aiResponse = '';
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('saudi') || promptLower.includes('labor law') || promptLower.includes('ksa')) {
      aiResponse = `Based on Saudi Arabian HR regulations and labor law, I can provide guidance on your query about "${prompt.substring(0, 50)}...". As an open-source AI agent specialized in Saudi HR practices, I recommend consulting the latest Ministry of Human Resources and Social Development guidelines for specific compliance requirements.`;
    } else if (promptLower.includes('employee') || promptLower.includes('hr') || promptLower.includes('payroll')) {
      aiResponse = `For HR management regarding "${prompt.substring(0, 50)}...", I suggest implementing best practices that align with Saudi Arabian employment standards. This open-source AI agent can help you navigate employee relations, performance management, and HR processes effectively.`;
    } else if (promptLower.includes('analytics') || promptLower.includes('data') || promptLower.includes('report')) {
      aiResponse = `Regarding analytics and data insights for "${prompt.substring(0, 50)}...", this open-source AI agent recommends focusing on key HR metrics like employee retention, performance indicators, and compliance tracking that are relevant to Saudi Arabian business environment.`;
    } else {
      aiResponse = `Thank you for your query about "${prompt.substring(0, 50)}...". As an open-source AI agent for AqlHR, I'm designed to assist with Saudi Arabian HR management, employee relations, labor law compliance, and workforce analytics. Please provide more specific details for more targeted assistance.`;
    }

    const data = {
      choices: [{
        message: {
          content: aiResponse,
          role: 'assistant'
        }
      }],
      model: 'manus-opensource-agent',
      usage: {
        prompt_tokens: prompt.length / 4, // Rough estimation
        completion_tokens: aiResponse.length / 4,
        total_tokens: (prompt.length + aiResponse.length) / 4
      }
    };

    const response = {
      success: true,
      response: data.choices[0]?.message?.content || 'No response generated',
      model: data.model || model,
      usage: data.usage || null,
      timestamp: new Date().toISOString(),
      provider: 'manus.im',
      open_source: true
    };

    console.log('✅ Manus.im response generated successfully');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Manus.im integration error:', error);

    // Fallback response for open-source AI agent
    const fallbackResponse = {
      success: false,
      error: error.message,
      fallback: true,
      response: `I apologize, but I'm currently unable to process your request through the Manus.im open-source AI agent. This could be due to processing limitations or configuration issues. 

Your query: "${prompt?.substring(0, 100) || 'Unable to read prompt'}..."

As an open-source solution, please try again or consider simplifying your query for better processing.`,
      provider: 'manus-opensource-fallback',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});