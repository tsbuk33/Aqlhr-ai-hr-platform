import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, conversation_history } = await req.json();
    
    console.log('AI Core Engine request:', { query, context });
    
    // Get language preference
    const isArabic = context?.language === 'ar';
    
    // Simple response logic based on query
    let response = '';
    
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('مرحبا')) {
      response = isArabic 
        ? `مرحباً! أنا مساعدك الذكي لوحدة ${context?.module || 'النظام'}. كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I'm your AI assistant for the ${context?.module || 'system'} module. How can I help you today?`;
    } else if (queryLower.includes('help') || queryLower.includes('مساعدة')) {
      response = isArabic 
        ? `يمكنني مساعدتك في:\n• تحليل البيانات\n• إنشاء التقارير\n• الإجابة على الأسئلة المتعلقة بالوحدة\n• تقديم التوصيات\n\nما الذي تحتاج مساعدة فيه؟`
        : `I can help you with:\n• Data analysis\n• Report generation\n• Module-related questions\n• Recommendations\n\nWhat do you need help with?`;
    } else if (queryLower.includes('analytics') || queryLower.includes('تحليلات')) {
      response = isArabic 
        ? `في وحدة التحليلات، يمكنني مساعدتك في:\n• مراجعة المؤشرات الرئيسية\n• تحليل الاتجاهات\n• إنشاء تقارير مخصصة\n• تفسير البيانات\n\nهل تريد معلومات محددة حول أي من هذه المواضيع؟`
        : `In the Analytics module, I can help you with:\n• Reviewing key metrics\n• Trend analysis\n• Custom report generation\n• Data interpretation\n\nWould you like specific information about any of these topics?`;
    } else {
      response = isArabic 
        ? `شكراً لسؤالك. أعمل على تحسين فهمي لهذا النوع من الاستفسارات. في الوقت الحالي، يمكنني مساعدتك بشكل أفضل في المواضيع المتعلقة بوحدة ${context?.module || 'النظام'}. هل يمكنك أن تكون أكثر تحديداً حول ما تحتاج مساعدة فيه؟`
        : `Thank you for your question. I'm working on improving my understanding of this type of inquiry. Currently, I can help you better with topics related to the ${context?.module || 'system'} module. Could you be more specific about what you need help with?`;
    }

    return new Response(
      JSON.stringify({ 
        response,
        timestamp: new Date().toISOString(),
        module: context?.module || 'unknown'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('AI Core Engine error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});