import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatGPTRequest {
  prompt: string;
  model?: string;
  max_completion_tokens?: number;
  context?: string;
  stream?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model = 'gpt-5-2025-08-07', max_completion_tokens = 1000, context, stream = false }: ChatGPTRequest = await req.json();

    console.log('🤖 ChatGPT 5 AI Request:', { model, prompt: prompt.substring(0, 100) + '...' });

    // OpenAI API integration for ChatGPT 5
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: context || 'You are an expert AI analytics assistant for AqlHR, a Saudi Arabian HR management system. Provide detailed analytical insights about HR metrics, workforce trends, and compliance analytics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: max_completion_tokens,
        stream: stream
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();

    const response = {
      success: true,
      response: data.choices[0]?.message?.content || 'No response generated',
      model: data.model || model,
      usage: data.usage || null,
      timestamp: new Date().toISOString(),
      provider: 'openai_chatgpt5',
      version: 'gpt-5-2025-08-07'
    };

    console.log('✅ ChatGPT 5 response generated successfully');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ ChatGPT 5 integration error:', error);

    // Fallback response
    const fallbackResponse = {
      success: false,
      error: error.message,
      fallback: true,
      response: `I apologize, but I'm currently unable to process your request through ChatGPT 5. This could be due to API connectivity issues or configuration. 

Your query: "${prompt?.substring(0, 100)}..."

Please try again later or contact support if the issue persists.`,
      provider: 'fallback',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});