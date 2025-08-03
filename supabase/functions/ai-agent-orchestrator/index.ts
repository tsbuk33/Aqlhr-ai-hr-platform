import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for logging
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AIProvider {
  name: string;
  endpoint: string;
  headers: Record<string, string>;
  formatRequest: (query: string, context: any) => any;
  parseResponse: (response: any) => string;
}

class AIAgentOrchestrator {
  private providers: Map<string, AIProvider> = new Map();
  
  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // OpenAI GPT Provider
    if (Deno.env.get('OPENAI_API_KEY')) {
      this.providers.set('openai', {
        name: 'OpenAI GPT-4',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        formatRequest: (query: string, context: any) => ({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(context)
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        }),
        parseResponse: (response: any) => response.choices[0].message.content
      });
    }

    // Anthropic Claude Provider
    if (Deno.env.get('ANTHROPIC_API_KEY')) {
      this.providers.set('claude', {
        name: 'Anthropic Claude',
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        formatRequest: (query: string, context: any) => ({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: `${this.buildSystemPrompt(context)}\n\nUser Query: ${query}`
            }
          ]
        }),
        parseResponse: (response: any) => response.content[0].text
      });
    }

    // Google Gemini Provider
    if (Deno.env.get('GOOGLE_AI_API_KEY')) {
      this.providers.set('gemini', {
        name: 'Google Gemini',
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${Deno.env.get('GOOGLE_AI_API_KEY')}`,
        headers: {
          'Content-Type': 'application/json',
        },
        formatRequest: (query: string, context: any) => ({
          contents: [{
            parts: [{
              text: `${this.buildSystemPrompt(context)}\n\nUser Query: ${query}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500
          }
        }),
        parseResponse: (response: any) => response.candidates[0].content.parts[0].text
      });
    }

    // Baidu Ernie (Chinese AI)
    if (Deno.env.get('BAIDU_API_KEY') && Deno.env.get('BAIDU_SECRET_KEY')) {
      this.providers.set('ernie', {
        name: 'Baidu Ernie Bot',
        endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        headers: {
          'Content-Type': 'application/json',
        },
        formatRequest: (query: string, context: any) => ({
          messages: [
            {
              role: 'user',
              content: `${this.buildSystemPrompt(context)}\n\n${query}`
            }
          ],
          temperature: 0.7,
          max_output_tokens: 1500
        }),
        parseResponse: (response: any) => response.result
      });
    }

    // Alibaba Qwen (Chinese AI)
    if (Deno.env.get('ALIBABA_API_KEY')) {
      this.providers.set('qwen', {
        name: 'Alibaba Qwen',
        endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('ALIBABA_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        formatRequest: (query: string, context: any) => ({
          model: 'qwen-turbo',
          input: {
            messages: [
              {
                role: 'system',
                content: this.buildSystemPrompt(context)
              },
              {
                role: 'user',
                content: query
              }
            ]
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 1500
          }
        }),
        parseResponse: (response: any) => response.output.choices[0].message.content
      });
    }

    // DeepSeek (Chinese Open Source)
    if (Deno.env.get('DEEPSEEK_API_KEY')) {
      this.providers.set('deepseek', {
        name: 'DeepSeek AI',
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        formatRequest: (query: string, context: any) => ({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(context)
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        }),
        parseResponse: (response: any) => response.choices[0].message.content
      });
    }

    console.log(`Initialized ${this.providers.size} AI providers:`, Array.from(this.providers.keys()));
  }

  private buildSystemPrompt(context: any): string {
    const { module, language, user_context, company_id } = context;
    
    const basePrompt = language === 'ar' 
      ? `أنت مساعد ذكي متخصص في الموارد البشرية في منصة AqlHR. أجب باللغة العربية بطريقة مفيدة ومهنية.`
      : `You are an intelligent HR assistant specialized in the AqlHR platform. Respond in English in a helpful and professional manner.`;

    const modulePrompts = {
      'payroll': language === 'ar' 
        ? 'متخصص في الرواتب، GOSI، نظام حماية الأجور، والحسابات المالية للموظفين'
        : 'Specialized in payroll, GOSI, Wage Protection System, and employee financial calculations',
      'employees': language === 'ar'
        ? 'متخصص في إدارة الموظفين، التوظيف، السجلات، والامتثال للقوانين السعودية'
        : 'Specialized in employee management, recruitment, records, and Saudi compliance',
      'government': language === 'ar'
        ? 'متخصص في التكامل الحكومي، منصة قوى، وزارة العمل، التأمينات الاجتماعية، ونطاقات'
        : 'Specialized in government integrations, Qiwa platform, MOL, GOSI, and Nitaqat',
      'analytics': language === 'ar'
        ? 'متخصص في التحليلات، الذكاء الاصطناعي، والتقارير المتقدمة'
        : 'Specialized in analytics, AI intelligence, and advanced reporting',
      'performance': language === 'ar'
        ? 'متخصص في إدارة الأداء، تقييم الموظفين، واستراتيجيات التحسين'
        : 'Specialized in performance management, employee evaluation, and improvement strategies'
    };

    return `${basePrompt}\n\n${modulePrompts[module as keyof typeof modulePrompts] || modulePrompts.employees}\n\nContext: ${user_context}\nCompany: ${company_id}`;
  }

  async queryAgent(query: string, context: any, preferredProvider?: string): Promise<any> {
    const provider = preferredProvider || this.selectBestProvider(context);
    
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not available`);
    }

    const aiProvider = this.providers.get(provider)!;
    
    try {
      console.log(`Querying ${aiProvider.name} with query:`, query);
      
      const requestBody = aiProvider.formatRequest(query, context);
      
      const response = await fetch(aiProvider.endpoint, {
        method: 'POST',
        headers: aiProvider.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`${aiProvider.name} API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = aiProvider.parseResponse(data);

      // Log successful interaction
      await this.logInteraction(query, result, context, provider);

      return {
        response: result,
        provider: aiProvider.name,
        model: provider,
        confidence: 95,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error with ${aiProvider.name}:`, error);
      
      const errorMessage = error.message.toLowerCase();
      const isRegionalError = errorMessage.includes('unavailable') || 
                             errorMessage.includes('region') || 
                             errorMessage.includes('country') ||
                             errorMessage.includes('blocked') ||
                             error.status === 451; // HTTP status for unavailable for legal reasons
      
      if (isRegionalError) {
        console.log(`Regional restriction detected for ${provider}, trying alternative providers...`);
        
        // Try alternative providers in order of global availability
        const alternativeProviders = ['openai', 'gemini', 'deepseek', 'qwen', 'ernie'];
        
        for (const altProvider of alternativeProviders) {
          if (altProvider !== provider && this.providers.has(altProvider)) {
            console.log(`Falling back to ${altProvider} for regional availability...`);
            try {
              return await this.queryAgent(query, context, altProvider);
            } catch (altError) {
              console.error(`Alternative provider ${altProvider} also failed:`, altError);
              continue;
            }
          }
        }
      } else {
        // Try OpenAI as general fallback for non-regional errors
        if (provider !== 'openai' && this.providers.has('openai')) {
          console.log('Falling back to OpenAI for general error...');
          return this.queryAgent(query, context, 'openai');
        }
      }
      
      throw error;
    }
  }

  private selectBestProvider(context: any): string {
    const { language, module, user_location } = context;
    
    // Region-aware provider selection for better global availability
    const highAvailabilityProviders = ['openai', 'gemini', 'deepseek'];
    const restrictedProviders = ['claude']; // Known to have regional restrictions
    
    // Prefer Chinese AI for Chinese contexts
    if (language === 'zh' || language === 'zh-CN') {
      if (this.providers.has('qwen')) return 'qwen';
      if (this.providers.has('ernie')) return 'ernie';
      if (this.providers.has('deepseek')) return 'deepseek';
    }
    
    // For Arabic contexts, prefer globally available models first
    if (language === 'ar') {
      // Try OpenAI first (better global availability)
      if (this.providers.has('openai')) return 'openai';
      // Then Gemini (also globally available)
      if (this.providers.has('gemini')) return 'gemini';
      // Try Claude only as fallback
      if (this.providers.has('claude')) return 'claude';
      // Chinese providers often work globally
      if (this.providers.has('deepseek')) return 'deepseek';
    }
    
    // For performance and analytics modules, prefer available advanced models
    if (module?.includes('performance') || module?.includes('analytics')) {
      if (this.providers.has('openai')) return 'openai';
      if (this.providers.has('gemini')) return 'gemini';
      if (this.providers.has('claude')) return 'claude';
    }
    
    // Global availability preference order (most to least globally available)
    const preferenceOrder = ['openai', 'gemini', 'deepseek', 'qwen', 'ernie', 'claude'];
    
    for (const provider of preferenceOrder) {
      if (this.providers.has(provider)) {
        return provider;
      }
    }
    
    throw new Error('No AI providers available');
  }

  private async logInteraction(query: string, response: string, context: any, provider: string) {
    try {
      await supabase.from('ai_interaction_logs').insert({
        query,
        response,
        context,
        provider,
        timestamp: new Date().toISOString(),
        module: context.module,
        company_id: context.company_id
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProviderStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [key, provider] of this.providers) {
      status[key] = {
        name: provider.name,
        available: true,
        endpoint: provider.endpoint
      };
    }
    
    return status;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orchestrator = new AIAgentOrchestrator();
    const { query, context, provider, action } = await req.json();

    // Handle different actions
    if (action === 'status') {
      return new Response(JSON.stringify({
        providers: orchestrator.getAvailableProviders(),
        status: orchestrator.getProviderStatus()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Process AI query
    const result = await orchestrator.queryAgent(query, context || {}, provider);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Agent Orchestrator error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback_response: context?.language === 'ar' 
        ? 'عذراً، واجهنا مشكلة تقنية. يرجى المحاولة مرة أخرى.'
        : 'Sorry, we encountered a technical issue. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});