import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multi-Level Compliance Configuration for Different Company Types
const COMPLIANCE_LEVELS = {
  // Saudi companies: Strictest compliance - no data leaves platform
  SAUDI_STRICT: {
    name: 'Saudi Strict Compliance',
    SENSITIVE_PATTERNS: [
      /\b\d{10}\b/g, // Saudi National ID (10 digits)
      /\b\d{9,10}\b/g, // Iqama numbers
      /\b[A-Z]\d{8}\b/g, // Passport patterns
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card patterns
      /\b\d{9}\b/g, // GOSI numbers
      /\b\+966\s?\d{1,2}\s?\d{3}\s?\d{4}\b/g, // Saudi phone numbers
      /\bSAR\s?\d+/g, // Salary information
      /\bريال\s?\d+/g, // Arabic salary info
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // Date patterns
    ],
    ANONYMIZATION_RULES: {
      employee_ids: '[EMPLOYEE_ID]',
      saudi_ids: '[SAUDI_ID]',
      iqama_numbers: '[IQAMA]',
      passport_numbers: '[PASSPORT]',
      phone_numbers: '[PHONE]',
      salaries: '[SALARY_AMOUNT]',
      gosi_numbers: '[GOSI_ID]',
      addresses: '[ADDRESS]',
      bank_accounts: '[BANK_INFO]',
    },
    DATA_RESIDENCY: {
      allowExternalAI: false, // NO external AI for Saudi companies
      localProcessingOnly: true,
      require_encryption: true,
      require_audit_log: true,
      allowed_regions: ['saudi-arabia'],
      prohibited_regions: ['*'], // All external regions prohibited
    }
  },
  
  // International companies in Saudi: Moderate compliance 
  INTERNATIONAL_SAUDI: {
    name: 'International Saudi Compliance',
    SENSITIVE_PATTERNS: [
      /\b\d{10}\b/g, // National IDs
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card patterns
      /\b\+966\s?\d{1,2}\s?\d{3}\s?\d{4}\b/g, // Saudi phone numbers
      /\bSAR\s?\d+/g, // Salary information
    ],
    ANONYMIZATION_RULES: {
      employee_ids: '[EMPLOYEE_ID]',
      national_ids: '[NATIONAL_ID]',
      phone_numbers: '[PHONE]',
      salaries: '[SALARY_AMOUNT]',
      addresses: '[ADDRESS]',
    },
    DATA_RESIDENCY: {
      allowExternalAI: true, // External AI allowed with sanitization
      localProcessingOnly: false,
      require_encryption: true,
      require_audit_log: true,
      allowed_regions: ['middle-east', 'gcc', 'eu', 'us'],
      prohibited_regions: ['china', 'russia', 'iran'],
    }
  },
  
  // Global standard: Minimal compliance for MNCs
  GLOBAL_STANDARD: {
    name: 'Global Standard Compliance',
    SENSITIVE_PATTERNS: [
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card patterns
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email patterns in some contexts
    ],
    ANONYMIZATION_RULES: {
      credit_cards: '[CREDIT_CARD]',
      emails: '[EMAIL]',
    },
    DATA_RESIDENCY: {
      allowExternalAI: true,
      localProcessingOnly: false,
      require_encryption: false,
      require_audit_log: true,
      allowed_regions: ['*'], // All regions allowed
      prohibited_regions: [],
    }
  }
};

class SaudiDataProtection {
  static async getCompanyComplianceLevel(companyId: string): Promise<keyof typeof COMPLIANCE_LEVELS> {
    try {
      // Check if company has specific compliance config
      const { data: complianceConfig } = await supabase
        .from('saudi_data_protection_config')
        .select('data_classification_level, cross_border_transfer_allowed')
        .eq('company_id', companyId)
        .single();

      if (complianceConfig) {
        if (!complianceConfig.cross_border_transfer_allowed) {
          return 'SAUDI_STRICT';
        } else if (complianceConfig.data_classification_level === 'highly_confidential') {
          return 'INTERNATIONAL_SAUDI';
        } else {
          return 'GLOBAL_STANDARD';
        }
      }

      // Default to Saudi strict for companies in Saudi
      return 'SAUDI_STRICT';
    } catch (error) {
      console.log('Using default Saudi strict compliance due to error:', error);
      return 'SAUDI_STRICT';
    }
  }

  static sanitizeForAI(text: string, context: any = {}, complianceLevel: keyof typeof COMPLIANCE_LEVELS = 'SAUDI_STRICT'): { sanitized: string, containsSensitiveData: boolean, redactedItems: string[], complianceLevel: string } {
    let sanitized = text;
    let containsSensitiveData = false;
    const redactedItems: string[] = [];
    const config = COMPLIANCE_LEVELS[complianceLevel];
    
    // Check for sensitive patterns based on compliance level
    config.SENSITIVE_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        containsSensitiveData = true;
        const matches = sanitized.match(pattern) || [];
        redactedItems.push(...matches);
        sanitized = sanitized.replace(pattern, '[REDACTED_SENSITIVE_DATA]');
      }
    });
    
    // Additional context-based sanitization
    if (context.company_id) {
      sanitized = sanitized.replace(new RegExp(context.company_id, 'g'), '[COMPANY_ID]');
    }
    
    if (context.user_id) {
      sanitized = sanitized.replace(new RegExp(context.user_id, 'g'), '[USER_ID]');
    }
    
    return { sanitized, containsSensitiveData, redactedItems, complianceLevel: config.name };
  }
  
  static async logComplianceEvent(event: any) {
    try {
      await supabase.from('saudi_compliance_logs').insert({
        event_type: event.type,
        user_id: event.user_id,
        company_id: event.company_id,
        sensitive_data_detected: event.sensitive_data_detected,
        redacted_items_count: event.redacted_items?.length || 0,
        ai_provider_used: event.ai_provider,
        query_hash: event.query_hash,
        compliance_status: event.compliance_status,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log compliance event:', error);
    }
  }
  
  static validateQuery(query: string, context: any): { allowed: boolean, reason?: string } {
    // Block queries that explicitly ask for sensitive data
    const sensitiveQueries = [
      /give me.*saudi.*id/i,
      /show.*salary/i,
      /list.*iqama/i,
      /export.*employee.*data/i,
      /download.*personal/i,
    ];
    
    for (const pattern of sensitiveQueries) {
      if (pattern.test(query)) {
        return { 
          allowed: false, 
          reason: 'Query contains request for sensitive personal data that cannot be processed by external AI' 
        };
      }
    }
    
    return { allowed: true };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context = {} } = await req.json();
    
    console.log('Saudi Compliant AI - Processing query with adaptive compliance protection');
    
    // Step 0: Determine company compliance level
    const complianceLevel = context.company_id 
      ? await SaudiDataProtection.getCompanyComplianceLevel(context.company_id)
      : 'SAUDI_STRICT'; // Default to strictest
    
    const complianceConfig = COMPLIANCE_LEVELS[complianceLevel];
    console.log(`Using compliance level: ${complianceConfig.name} for company: ${context.company_id}`);
    
    // Step 1: Validate query is appropriate for AI processing
    const validation = SaudiDataProtection.validateQuery(query, context);
    if (!validation.allowed) {
      return new Response(JSON.stringify({
        error: validation.reason,
        compliance_blocked: true,
        compliance_level: complianceConfig.name,
        response: context?.language === 'ar' 
          ? 'عذراً، لا يمكن معالجة هذا الاستعلام لأنه يتضمن طلب بيانات شخصية حساسة. يرجى إعادة صياغة استعلامك.'
          : 'Sorry, this query cannot be processed as it involves sensitive personal data. Please rephrase your query.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 2: Sanitize input for AI processing based on compliance level
    const { sanitized, containsSensitiveData, redactedItems, complianceLevel: appliedLevel } = SaudiDataProtection.sanitizeForAI(query, context, complianceLevel);
    
    if (containsSensitiveData) {
      console.log(`Sensitive data detected and redacted: ${redactedItems.length} items`);
    }
    
    // Step 3: Search for relevant AqlHR knowledge (local data only)
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('ai_knowledge_base')
      .select('content_en, content_ar, title_en, title_ar')
      .or(`content_en.ilike.%${sanitized}%,content_ar.ilike.%${sanitized}%`)
      .eq('is_active', true)
      .limit(5);

    let localKnowledge = '';
    if (knowledgeData && knowledgeData.length > 0) {
      localKnowledge = knowledgeData
        .map(item => `Title: ${item.title_en}\nContent: ${item.content_en}`)
        .join('\n\n---\n\n');
    }
    
    // Step 4: If we have sufficient local knowledge, use it without external AI
    if (localKnowledge && localKnowledge.length > 200) {
      const response = context?.language === 'ar' 
        ? `بناءً على قاعدة معرفة AqlHR المحلية:\n\n${localKnowledge}`
        : `Based on local AqlHR knowledge base:\n\n${localKnowledge}`;
        
      // Log compliance event
      await SaudiDataProtection.logComplianceEvent({
        type: 'local_knowledge_response',
        user_id: context.user_id,
        company_id: context.company_id,
        sensitive_data_detected: containsSensitiveData,
        redacted_items: redactedItems,
        ai_provider: 'local_knowledge',
        query_hash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(query)).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')),
        compliance_status: 'saudi_compliant'
      });
      
      return new Response(JSON.stringify({
        response,
        source: 'local_knowledge',
        saudi_compliant: true,
        sensitive_data_redacted: containsSensitiveData,
        knowledge_sources: knowledgeData?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 5: Handle external AI based on compliance level
    if (!complianceConfig.DATA_RESIDENCY.allowExternalAI) {
      // For Saudi strict compliance - NO external AI allowed
      return new Response(JSON.stringify({
        response: context?.language === 'ar' 
          ? 'عذراً، لا يمكن استخدام الذكاء الاصطناعي الخارجي مع هذا المستوى من الامتثال. يرجى استخدام قاعدة المعرفة المحلية فقط.'
          : 'Sorry, external AI cannot be used with this compliance level. Please use local knowledge base only.',
        source: 'compliance_restriction',
        saudi_compliant: true,
        compliance_level: appliedLevel,
        external_ai_blocked: true,
        reason: 'Saudi strict compliance requires local processing only'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // For international/global companies - external AI allowed with sanitization
    const enhancedContext = {
      ...context,
      compliance_notice: `IMPORTANT: This query has been sanitized for ${appliedLevel}. Any response must comply with applicable data protection regulations.`,
      compliance_level: appliedLevel,
      sanitized: true,
      original_contained_sensitive: containsSensitiveData,
      allowed_regions: complianceConfig.DATA_RESIDENCY.allowed_regions,
      prohibited_regions: complianceConfig.DATA_RESIDENCY.prohibited_regions
    };
    
    const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-agent-orchestrator', {
      body: {
        query: sanitized,
        context: enhancedContext,
        provider: 'openai' // Prefer OpenAI for better compliance standards
      }
    });

    if (aiError) {
      throw new Error(aiError.message);
    }
    
    // Step 6: Log compliance event for external AI usage
    await SaudiDataProtection.logComplianceEvent({
      type: 'external_ai_response',
      user_id: context.user_id,
      company_id: context.company_id,
      sensitive_data_detected: containsSensitiveData,
      redacted_items: redactedItems,
      ai_provider: aiData.provider || 'unknown',
      query_hash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(query)).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')),
      compliance_status: 'sanitized_external_ai'
    });
    
    const finalResponse = containsSensitiveData 
      ? `${aiData.response}\n\n⚠️ ${context?.language === 'ar' ? 'تنبيه: تم إخفاء البيانات الحساسة لحماية الخصوصية وفقاً للوائح السعودية' : 'Notice: Sensitive data was redacted for privacy protection in compliance with Saudi regulations'}`
      : aiData.response;

    return new Response(JSON.stringify({
      ...aiData,
      response: finalResponse,
      saudi_compliant: true,
      sensitive_data_redacted: containsSensitiveData,
      redacted_items_count: redactedItems.length,
      local_knowledge_used: localKnowledge.length > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Saudi Compliant AI error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      saudi_compliant: true,
      response: context?.language === 'ar' 
        ? 'عذراً، واجهت مشكلة في معالجة استعلامك مع الحفاظ على متطلبات الامتثال السعودية.'
        : 'Sorry, I encountered an issue processing your query while maintaining Saudi compliance requirements.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});