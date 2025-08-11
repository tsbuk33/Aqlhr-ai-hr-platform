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


    // Julius Provider
    if (Deno.env.get('JULIUS_API_KEY')) {
      this.providers.set('julius', {
        name: 'Julius AI',
        endpoint: 'https://api.julius.ai/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('JULIUS_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        formatRequest: (query: string, context: any) => ({
          model: 'julius-chat',
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
          max_tokens: 1500,
          temperature: 0.7
        }),
        parseResponse: (response: any) => response.choices[0].message.content
      });
    }

    // Google Gemini Provider
    if (Deno.env.get('GOOGLE_AI_API_KEY')) {
      this.providers.set('gemini', {
        name: 'Google Gemini',
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get('GOOGLE_AI_API_KEY')}`,
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

    // DeepSeek AI Provider
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
    // Handle "auto" provider by selecting the best available one
    let provider = preferredProvider;
    if (provider === 'auto' || !provider) {
      provider = this.selectBestProvider(context);
    }
    
    if (!this.providers.has(provider)) {
      // If the requested provider is not available, select the best alternative
      console.log(`Provider ${provider} not available, selecting best alternative...`);
      provider = this.selectBestProvider(context);
      
      if (!this.providers.has(provider)) {
        throw new Error(`No AI providers available`);
      }
    }

    const aiProvider = this.providers.get(provider)!;
    
    // Detect query language
    const isArabicQuery = /[\u0600-\u06FF]/.test(query);
    const responseLanguage = context.language || (isArabicQuery ? 'ar' : 'en');
    
    // Enhanced system prompt for multilingual support
    const systemPrompt = `You are AqlHR AI Assistant, a specialist in Saudi Arabian HR, immigration, and government services.

CRITICAL INSTRUCTIONS:
1. ALWAYS respond in the SAME language as the user's question
2. You are an EXPERT - provide detailed, accurate information, NOT translation services
3. For visa/immigration questions, provide comprehensive information about Saudi visa types, procedures, and MOL requirements
4. For HR questions, give specific guidance on Saudi labor law, GOSI, payroll, and compliance

CURRENT USER LANGUAGE: ${responseLanguage}

${responseLanguage === 'ar' ? 
  `أنت خبير متخصص في:
- جميع أنواع التأشيرات السعودية (عمل، زيارة، استثمار، إقامة مميزة، سياحة)
- إجراءات وزارة الموارد البشرية والتنمية الاجتماعية
- منصة قوى والخدمات الحكومية
- قانون العمل السعودي ونظام العمل
- التأمينات الاجتماعية والجوسي
- نطاقات والسعودة
- تأشيرات العمل والإقامة والتجديد

قدم معلومات تفصيلية ودقيقة عن الإجراءات والمتطلبات.` : 
  `You are an expert specializing in:
- All Saudi visa types (work, visit, investment, premium residency, tourism)
- Ministry of Human Resources and Social Development procedures  
- Qiwa platform and government services
- Saudi Labor Law and Employment System
- Social Insurance and GOSI
- Nitaqat and Saudization
- Work visas, residency permits, and renewals

Provide detailed and accurate information about procedures and requirements.`}

EXPERTISE AREAS:
- Saudi Visa Classifications: Work Visa, Visit Visa, Investment Visa, Premium Residency, Tourist Visa, Hajj/Umrah Visa
- MOL Procedures: Work permit applications, employer registration, employee transfers
- Immigration Services: Residency permits (Iqama), renewals, exits/re-entry, final exit
- Labor Law: Employment contracts, termination procedures, end-of-service benefits
- Government Platforms: Qiwa, Absher, MOL portal, Immigration portal

Module Context: ${context.module}
Company: ${context.company_id}
User Role: ${context.user_context}

IMPORTANT: Never offer translation services - you are an HR and immigration expert, not a translator.`;
    
    try {
      console.log(`Querying ${aiProvider.name} with query:`, query);
      
      const requestBody = aiProvider.formatRequest(query, context);
      
      const response = await fetch(aiProvider.endpoint, {
        method: 'POST',
        headers: aiProvider.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${aiProvider.name} API error:`, response.status, response.statusText, errorText);
        
        // For rate limiting (429) or other common errors, immediately try fallback
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`${aiProvider.name} temporarily unavailable (${response.status})`);
        }
        
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
      
      const isRateLimitError = errorMessage.includes('rate limit') || 
                              errorMessage.includes('too many requests') ||
                              errorMessage.includes('429') ||
                              errorMessage.includes('temporarily unavailable');
      
      if (isRegionalError || isRateLimitError) {
        console.log(`${isRateLimitError ? 'Rate limit' : 'Regional restriction'} detected for ${provider}, trying alternative providers...`);
        
        // Try alternative providers in order of reliability
        const alternativeProviders = ['gemini', 'julius', 'deepseek', 'openai', 'qwen', 'ernie'];
        
        for (const altProvider of alternativeProviders) {
          if (altProvider !== provider && this.providers.has(altProvider)) {
            console.log(`Falling back to ${altProvider}...`);
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
    const highAvailabilityProviders = ['openai', 'gemini', 'deepseek', 'julius'];
    
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
      // Chinese providers often work globally
      if (this.providers.has('deepseek')) return 'deepseek';
    }
    
    // For performance and analytics modules, prefer available advanced models
    if (module?.includes('performance') || module?.includes('analytics')) {
      if (this.providers.has('openai')) return 'openai';
      if (this.providers.has('gemini')) return 'gemini';
      if (this.providers.has('deepseek')) return 'deepseek';
    }
    
    // Global availability preference order (prioritizing non-rate-limited providers)
    const preferenceOrder = ['gemini', 'julius', 'deepseek', 'qwen', 'ernie', 'openai'];
    
    for (const provider of preferenceOrder) {
      if (this.providers.has(provider)) {
        console.log(`Selected provider: ${provider}`);
        return provider;
      }
    }
    
    // Fallback to first available if none of the preferred ones are available
    const availableProviders = this.getAvailableProviders();
    if (availableProviders.length > 0) {
      console.log(`Fallback to first available provider: ${availableProviders[0]}`);
      return availableProviders[0];
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
    const { query, context = {}, provider, action } = await req.json();

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

    // Ensure context has safe defaults to prevent errors
    const safeContext = {
      language: 'en',
      module: 'general',
      user_location: 'global',
      ...context
    };

    // Process AI query with safe context
    const result = await orchestrator.queryAgent(query, safeContext, provider);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Agent Orchestrator error:', error);
    
    // Provide contextual fallback responses when all AI providers fail
    const { query, context = {} } = await req.json().catch(() => ({ query: '', context: {} }));
    const isArabic = context.language === 'ar';
    
    let fallbackResponse = '';
    
    if (query.toLowerCase().includes('gosi') || query.includes('جوسي') || query.includes('تأمينات')) {
      fallbackResponse = isArabic 
        ? `🏛️ **معلومات التأمينات الاجتماعية (GOSI):**

معدلات GOSI الحالية (2024):
• السعوديين (النظام الجديد): 9.75% موظف + 11.75% صاحب عمل = 21.5% إجمالي
• السعوديين (النظام القديم): 9% موظف + 9% صاحب عمل = 18% إجمالي  
• غير السعوديين: 0% موظف + 2% صاحب عمل = 2% إجمالي

للمزيد من المعلومات، يرجى زيارة موقع التأمينات الاجتماعية الرسمي.`
        : `🏛️ **GOSI (Social Insurance) Information:**

Current GOSI Rates (2024):
• Saudis (NEW System): 9.75% employee + 11.75% employer = 21.5% total
• Saudis (OLD System): 9% employee + 9% employer = 18% total  
• Non-Saudis: 0% employee + 2% employer = 2% total

For more information, please visit the official GOSI website.`;
    } else if (query.toLowerCase().includes('employee') || query.toLowerCase().includes('موظف')) {
      fallbackResponse = isArabic
        ? `👥 **إدارة الموظفين:**

يمكنني مساعدتك في:
• تسجيل موظف جديد
• تحديث بيانات الموظفين
• إدارة العقود والمستندات
• متطلبات وزارة العمل

يرجى تحديد ما تحتاج مساعدة به بالضبط.`
        : `👥 **Employee Management:**

I can help you with:
• Registering new employees
• Updating employee data
• Managing contracts and documents
• Ministry of Labor requirements

Please specify exactly what you need help with.`;
    } else {
      fallbackResponse = isArabic
        ? `🤖 **مساعد عقل HR:**

عذراً، هناك مشكلة مؤقتة في الاتصال بخدمات الذكاء الاصطناعي.

يمكنني مساعدتك في:
• إدارة الموظفين والتوظيف
• الرواتب والتأمينات الاجتماعية
• التكامل الحكومي (قوى، وزارة العمل)
• التحليلات والتقارير

يرجى إعادة المحاولة أو تحديد سؤالك أكثر.`
        : `🤖 **AqlHR Assistant:**

Sorry, there's a temporary issue connecting to AI services.

I can help you with:
• Employee management and recruitment  
• Payroll and social insurance
• Government integration (Qiwa, MOL)
• Analytics and reporting

Please try again or be more specific with your question.`;
    }
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      provider: 'AqlHR Fallback',
      confidence: 80,
      timestamp: new Date().toISOString(),
      error: error.message,
      success: false
    }), {
      status: 200, // Return 200 so the client can display the fallback response
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});