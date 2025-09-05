import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, context, module, action, tenantId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Enhanced system prompt for AqlHR
    const systemPrompt = `You are AqlHR AI Assistant, a specialized HR management AI for Saudi Arabian companies. 

Context: ${context || 'General HR assistance'}
Module: ${module || 'General'}
Current Action: ${action || 'Chat'}

You help with:
- Saudi labor law compliance (Qiwa, GOSI, Absher)
- Employee management and Saudization
- Payroll and benefits administration
- Performance management
- Government integration workflows

Respond in Arabic when appropriate. Be concise and actionable.`

    // Use Hugging Face for text generation
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-large',
      inputs: `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false
      }
    })

    // Log the automation metrics
    if (action && tenantId) {
      await supabaseClient.from('automation_metrics').insert({
        tenant_id: tenantId,
        command_type: 'ai_assistant',
        action: action,
        success: true,
        automation_score: 85,
        tasks_completed: [`ai_response_${module}`],
        module: module,
        metadata: {
          prompt_length: prompt.length,
          response_length: response.generated_text?.length || 0,
          context_provided: !!context
        }
      })
    }

    return new Response(
      JSON.stringify({ 
        response: response.generated_text || "I'm here to help with your HR needs. Could you please rephrase your question?",
        success: true,
        automation_score: 85
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('AI Assistant Error:', error)
    
    return new Response(
      JSON.stringify({ 
        response: "I'm experiencing some technical difficulties. Please try again in a moment.",
        success: false,
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})