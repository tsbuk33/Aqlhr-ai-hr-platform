import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrchestratorRequest {
  query?: string;
  context?: {
    module: string;
    language: string;
    company_id: string;
    user_context: string;
  };
  provider?: string;
  action?: string;
}

interface AIResponse {
  response: string;
  provider: string;
  model: string;
  confidence: number;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, provider, action }: OrchestratorRequest = await req.json();
    
    // Handle status requests
    if (action === 'status') {
      return new Response(JSON.stringify({
        providers: ['chatgpt5', 'genspark', 'manus', 'fallback'],
        status: {
          chatgpt5: { available: true, model: 'gpt-5-2025-08-07' },
          genspark: { available: true, model: 'gpt-5' },
          manus: { available: true, model: 'open-source-agent' },
          fallback: { available: true, model: 'local-fallback' }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!query || !context) {
      throw new Error('Query and context are required');
    }

    console.log('AI Orchestrator - Processing query:', { 
      query: query.substring(0, 100), 
      provider, 
      module: context.module 
    });

    // Initialize Supabase client for internal function calls
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Determine the best provider based on query type and context
    const selectedProvider = provider || selectBestProvider(query, context);
    
    let aiResponse: AIResponse;

    try {
      switch (selectedProvider) {
        case 'chatgpt5':
        case 'openai':
          aiResponse = await queryChatGPT5(supabase, query, context);
          break;
          
        case 'genspark':
          aiResponse = await queryGenspark(supabase, query, context);
          break;
          
        case 'manus':
        case 'claude': // Fallback mapping
        case 'gemini': // Fallback mapping
          aiResponse = await queryManus(supabase, query, context);
          break;
          
        default:
          // Try ChatGPT 5 first, then Genspark, then Manus as fallback
          try {
            aiResponse = await queryChatGPT5(supabase, query, context);
          } catch (error) {
            console.log('ChatGPT 5 failed, trying Genspark:', error);
            try {
              aiResponse = await queryGenspark(supabase, query, context);
            } catch (gensparkError) {
              console.log('Genspark failed, trying Manus:', gensparkError);
              aiResponse = await queryManus(supabase, query, context);
            }
          }
      }
    } catch (error) {
      console.error('AI provider failed:', error);
      // Fallback response
      aiResponse = {
        response: generateFallbackResponse(query, context),
        provider: 'fallback',
        model: 'local-fallback',
        confidence: 0.3,
        timestamp: new Date().toISOString()
      };
    }

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Orchestrator error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      provider: 'error-handler',
      model: 'fallback',
      confidence: 0.1,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Provider selection logic
function selectBestProvider(query: string, context: any): string {
  const queryLower = query.toLowerCase();
  
  // Use Genspark for cost-sensitive queries
  if (queryLower.includes('cost') || queryLower.includes('cheap') || 
      queryLower.includes('economy') || queryLower.includes('budget') ||
      queryLower.includes('efficient')) {
    return 'genspark';
  }
  
  // Use ChatGPT 5 for complex analytical queries
  if (queryLower.includes('analyze') || queryLower.includes('predict') || 
      queryLower.includes('forecast') || queryLower.includes('calculate') ||
      context.module === 'analytics' || context.module === 'executive') {
    return 'chatgpt5';
  }
  
  // Use Manus for general HR queries and explanations  
  if (queryLower.includes('explain') || queryLower.includes('how to') ||
      queryLower.includes('what is') || context.module === 'employees' ||
      context.module === 'compliance') {
    return 'manus';
  }
  
  // Default to ChatGPT 5 for other cases
  return 'chatgpt5';
}

// Query ChatGPT 5 integration
async function queryChatGPT5(supabase: any, query: string, context: any): Promise<AIResponse> {
  const enhancedPrompt = `Context: ${context.user_context} in ${context.module} module
Language: ${context.language}
Company: ${context.company_id}

User Query: ${query}

Please provide a helpful, accurate response specific to Saudi HR practices.`;

  const { data, error } = await supabase.functions.invoke('chatgpt-5-integration', {
    body: {
      prompt: enhancedPrompt,
      model: 'gpt-5-2025-08-07',
      max_completion_tokens: 1000,
      context: `HR expert for ${context.module} module in Saudi Arabia`
    }
  });

  if (error) throw new Error(`ChatGPT 5 error: ${error.message}`);

  return {
    response: data.content || data.generatedText || 'No response generated',
    provider: 'chatgpt5',
    model: data.model || 'gpt-5-2025-08-07',
    confidence: 0.9,
    timestamp: new Date().toISOString()
  };
}

// Query Genspark AI integration
async function queryGenspark(supabase: any, query: string, context: any): Promise<AIResponse> {
  const enhancedPrompt = `Module: ${context.module}
Language: ${context.language}
Context: ${context.user_context}

Query: ${query}

Provide cost-effective, practical Saudi HR guidance with efficient insights.`;

  const { data, error } = await supabase.functions.invoke('genspark-ai-integration', {
    body: {
      prompt: enhancedPrompt,
      model: 'gpt-5',
      temperature: 0.2,
      max_tokens: 1024,
      context: `Cost-effective Saudi HR specialist for ${context.module}`
    }
  });

  if (error) throw new Error(`Genspark AI error: ${error.message}`);

  return {
    response: data.content || data.response || 'No response generated',
    provider: 'genspark',
    model: data.model || 'genspark:gpt-5',
    confidence: 0.85,
    timestamp: new Date().toISOString()
  };
}

// Query Manus AI integration
async function queryManus(supabase: any, query: string, context: any): Promise<AIResponse> {
  const enhancedPrompt = `Module: ${context.module}
Language: ${context.language}
Context: ${context.user_context}

Query: ${query}

Provide practical Saudi HR guidance.`;

  const { data, error } = await supabase.functions.invoke('manus-ai-integration', {
    body: {
      prompt: enhancedPrompt,
      model: 'open-source-hr-agent',
      temperature: 0.7,
      max_tokens: 800,
      context: `Saudi HR specialist for ${context.module}`
    }
  });

  if (error) throw new Error(`Manus AI error: ${error.message}`);

  return {
    response: data.content || data.answer || 'No response generated',
    provider: 'manus',
    model: data.model || 'manus-hr-agent',
    confidence: 0.8,
    timestamp: new Date().toISOString()
  };
}

// Generate fallback response when AI providers fail
function generateFallbackResponse(query: string, context: any): string {
  const isArabic = context.language === 'ar';
  
  const fallbackResponses = {
    employees: {
      ar: 'أعتذر، أواجه صعوبة في الوصول لخدمات الذكاء الاصطناعي حالياً. بشكل عام، يمكنني مساعدتك في إدارة شؤون الموظفين وفقاً للقوانين السعودية. يرجى تجربة سؤالك مرة أخرى أو التواصل مع فريق الدعم.',
      en: 'I apologize, I\'m having difficulty accessing AI services right now. Generally, I can help you with employee management according to Saudi regulations. Please try your question again or contact support.'
    },
    payroll: {
      ar: 'أعتذر للمشكلة التقنية. يمكنني عادةً مساعدتك في حسابات الرواتب، GOSI، ونظام حماية الأجور. يرجى المحاولة لاحقاً.',
      en: 'Sorry for the technical issue. I can usually help with payroll calculations, GOSI, and WPS. Please try again later.'
    },
    default: {
      ar: 'أعتذر، أواجه مشكلة تقنية مؤقتة. أنا مساعدك الذكي المتخصص في الموارد البشرية السعودية. يرجى إعادة المحاولة.',
      en: 'Sorry, I\'m experiencing a temporary technical issue. I\'m your Saudi HR AI assistant. Please try again.'
    }
  };

  const moduleResponses = fallbackResponses[context.module as keyof typeof fallbackResponses] || fallbackResponses.default;
  return moduleResponses[isArabic ? 'ar' : 'en'];
}