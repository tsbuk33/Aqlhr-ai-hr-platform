import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, module, action, tenantId } = await req.json();

    // Simulate AI processing with context-aware responses
    const aiResponse = generateContextualResponse(prompt, context, module);
    const automationScore = calculateAutomationScore(prompt, module);

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
      automation_score: automationScore,
      module: module,
      context: context,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      response: 'I apologize, but I encountered an error processing your request. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateContextualResponse(prompt: string, context: string, module: string): string {
  const responses = {
    analytics: {
      'تحليل بيانات الموظفين': 'تم تحليل بيانات الموظفين بنجاح. معدل السعودة الحالي 67%، ومعدل الاستبقاء 91.1%. أوصي بتحسين برامج التدريب لزيادة الإنتاجية.',
      'analyze employee data': 'Employee data analysis complete. Current Saudization rate is 67%, retention rate is 91.1%. I recommend enhancing training programs to boost productivity.',
      'generate report': 'Generating comprehensive workforce analytics report with KPIs, trends, and actionable insights for strategic decision-making.',
      'إنشاء تقرير': 'جاري إنشاء تقرير تحليلي شامل للقوى العاملة مع مؤشرات الأداء والاتجاهات والرؤى القابلة للتنفيذ لاتخاذ القرارات الاستراتيجية.'
    },
    compliance: {
      'مراجعة الامتثال': 'مراجعة حالة الامتثال: جميع السياسات متوافقة مع أنظمة العمل السعودية. هناك 3 توصيات لتحسين الامتثال.',
      'review compliance': 'Compliance review: All policies align with Saudi labor regulations. There are 3 recommendations for compliance enhancement.',
      'saudization report': 'Current Saudization compliance: 67% (Target: 70%). Recommend targeted hiring in technical roles to meet NITAQAT requirements.',
      'تقرير السعودة': 'حالة امتثال السعودة الحالية: 67% (الهدف: 70%). أوصي بالتوظيف المستهدف في الأدوار التقنية لتلبية متطلبات نطاقات.'
    },
    payroll: {
      'إدارة الرواتب': 'نظام الرواتب يعمل بكفاءة. آخر دورة رواتب تمت بنجاح لـ 450 موظف. لا توجد مشاكل في المعالجة.',
      'manage payroll': 'Payroll system running efficiently. Last payroll cycle completed successfully for 450 employees. No processing issues detected.',
      'payroll analysis': 'Payroll cost analysis shows 15% year-over-year increase. Overtime costs represent 8% of total payroll. Consider workforce optimization.',
      'تحليل الرواتب': 'تحليل تكاليف الرواتب يظهر زيادة 15% مقارنة بالعام السابق. تكاليف العمل الإضافي تمثل 8% من إجمالي الرواتب.'
    },
    general: {
      'help': 'I\'m your AI assistant for AqlHR. I can help with employee analytics, compliance monitoring, payroll management, and workforce optimization. What would you like to know?',
      'مساعدة': 'أنا مساعدك الذكي في أقل للموارد البشرية. يمكنني المساعدة في تحليل الموظفين ومراقبة الامتثال وإدارة الرواتب وتحسين القوى العاملة. ماذا تريد أن تعرف؟'
    }
  };

  const moduleResponses = responses[module as keyof typeof responses] || responses.general;
  
  // Find the best matching response
  for (const [key, response] of Object.entries(moduleResponses)) {
    if (prompt.toLowerCase().includes(key.toLowerCase())) {
      return response;
    }
  }

  // Default contextual response based on module
  const defaultResponses = {
    analytics: 'I\'ve analyzed your request. Based on current data patterns, I recommend focusing on employee retention strategies and skills development programs.',
    compliance: 'I\'ve reviewed the compliance requirements. All current policies are aligned with Saudi labor regulations. I can provide specific recommendations if needed.',
    payroll: 'Payroll operations are running smoothly. I can help with cost analysis, benefit optimization, or regulatory compliance questions.',
    general: `I understand you're asking about "${prompt}". I'm here to help with HR analytics, compliance, and workforce optimization. Could you provide more specific details?`
  };

  return defaultResponses[module as keyof typeof defaultResponses] || defaultResponses.general;
}

function calculateAutomationScore(prompt: string, module: string): number {
  // Calculate automation potential based on query complexity and module
  let baseScore = 70;
  
  const automationKeywords = ['report', 'analysis', 'calculate', 'generate', 'process', 'track', 'monitor'];
  const keywordMatches = automationKeywords.filter(keyword => 
    prompt.toLowerCase().includes(keyword)
  ).length;
  
  const moduleMultipliers = {
    analytics: 1.2,
    payroll: 1.1,
    compliance: 1.0,
    general: 0.9
  };
  
  const multiplier = moduleMultipliers[module as keyof typeof moduleMultipliers] || 1.0;
  const automationScore = Math.min(95, Math.round(baseScore + (keywordMatches * 5) * multiplier));
  
  return automationScore;
}