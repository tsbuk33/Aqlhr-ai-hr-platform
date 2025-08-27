import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GensparkRequest {
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
    const { prompt, model = 'gpt-5', temperature = 0.2, max_tokens = 1024, context, stream = false }: GensparkRequest = await req.json();

    console.log('🤖 Genspark.ai AI Agent Request:', { model, prompt: prompt.substring(0, 100) + '...' });

    // Check if API key is available
    const gensparkApiKey = Deno.env.get('GENSPARK_API_KEY');
    const gensparkBaseUrl = Deno.env.get('GENSPARK_BASE_URL') || 'https://api.genspark.ai/v1/chat/completions';

    if (!gensparkApiKey) {
      console.log('📝 Genspark API key not found, using mock response');
      
      // Generate mock response based on prompt analysis (similar to manus pattern)
      let aiResponse = '';
      const promptLower = prompt.toLowerCase();
      
      if (promptLower.includes('saudi') || promptLower.includes('labor law') || promptLower.includes('ksa')) {
        aiResponse = `Based on Saudi Arabian HR regulations and labor law, I can provide guidance on your query about "${prompt.substring(0, 50)}...". As a Genspark.ai agent specialized in Saudi HR practices, I recommend consulting the latest Ministry of Human Resources and Social Development guidelines for specific compliance requirements.`;
      } else if (promptLower.includes('employee') || promptLower.includes('hr') || promptLower.includes('payroll')) {
        aiResponse = `For HR management regarding "${prompt.substring(0, 50)}...", I suggest implementing best practices that align with Saudi Arabian employment standards. This Genspark.ai agent can help you navigate employee relations, performance management, and HR processes effectively.`;
      } else if (promptLower.includes('analytics') || promptLower.includes('data') || promptLower.includes('report')) {
        aiResponse = `Regarding analytics and data insights for "${prompt.substring(0, 50)}...", this Genspark.ai agent recommends focusing on key HR metrics like employee retention, performance indicators, and compliance tracking that are relevant to Saudi Arabian business environment.`;
      } else if (promptLower.includes('cost') || promptLower.includes('cheap') || promptLower.includes('economy')) {
        aiResponse = `For cost-effective solutions regarding "${prompt.substring(0, 50)}...", Genspark.ai provides efficient AI processing optimized for budget-conscious HR operations while maintaining quality insights for Saudi Arabian businesses.`;
      } else {
        aiResponse = `Thank you for your query about "${prompt.substring(0, 50)}...". As a Genspark.ai agent for AqlHR, I'm designed to provide cost-effective AI assistance for Saudi Arabian HR management, employee relations, labor law compliance, and workforce analytics. Please provide more specific details for more targeted assistance.`;
      }

      const mockData = {
        choices: [{
          message: {
            content: aiResponse,
            role: 'assistant'
          },
          finish_reason: 'stop'
        }],
        model: `genspark:${model}`,
        usage: {
          prompt_tokens: Math.floor(prompt.length / 4),
          completion_tokens: Math.floor(aiResponse.length / 4),
          total_tokens: Math.floor((prompt.length + aiResponse.length) / 4)
        }
      };

      const response = {
        success: true,
        response: mockData.choices[0]?.message?.content || 'No response generated',
        model: mockData.model || `genspark:${model}`,
        usage: mockData.usage || null,
        timestamp: new Date().toISOString(),
        provider: 'genspark.ai',
        mock: true
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Real Genspark.ai API integration (OpenAI-compatible)
    const gensparkResponse = await fetch(gensparkBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gensparkApiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: context || 'You are an expert AI assistant for AqlHR, a Saudi Arabian HR management system. Provide accurate, cost-effective insights about HR practices, Saudi labor law, and workforce management.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: max_tokens,
        stream: stream
      }),
    });

    if (!gensparkResponse.ok) {
      throw new Error(`Genspark API error: ${gensparkResponse.status} ${gensparkResponse.statusText}`);
    }

    const data = await gensparkResponse.json();

    const response = {
      success: true,
      response: data.choices[0]?.message?.content || 'No response generated',
      model: `genspark:${data.model || model}`,
      usage: data.usage || null,
      timestamp: new Date().toISOString(),
      provider: 'genspark.ai',
      mock: false
    };

    console.log('✅ Genspark.ai response generated successfully');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Genspark.ai integration error:', error);

    // Fallback response
    const fallbackResponse = {
      success: false,
      error: error.message,
      fallback: true,
      response: `I apologize, but I'm currently unable to process your request through Genspark.ai. This could be due to API connectivity issues or configuration. 

Your query: "${prompt?.substring(0, 100) || 'Unable to read prompt'}..."

As a cost-effective AI solution, please try again or consider simplifying your query for better processing.`,
      provider: 'genspark-fallback',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});