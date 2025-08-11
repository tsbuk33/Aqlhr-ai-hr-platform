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

    console.log('🤖 Manus.im AI Request:', { model, prompt: prompt.substring(0, 100) + '...' });

    // Manus.im API integration
    const manusResponse = await fetch('https://manus.im/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('MANUS_API_KEY')}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: context || 'You are an expert AI assistant for AqlHR, a Saudi Arabian HR management system. Provide accurate, helpful responses about HR practices, Saudi labor law, and workforce management.'
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

    if (!manusResponse.ok) {
      throw new Error(`Manus.im API error: ${manusResponse.status} ${manusResponse.statusText}`);
    }

    const data = await manusResponse.json();

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

    // Fallback response
    const fallbackResponse = {
      success: false,
      error: error.message,
      fallback: true,
      response: `I apologize, but I'm currently unable to process your request through the Manus.im service. This could be due to API connectivity issues or configuration. 

Your query: "${(await req.json()).prompt?.substring(0, 100)}..."

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