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
    const { query, language, module_context, company_id, user_id } = await req.json();

    // Simulate AI core engine processing
    const aiResponse = await processAIQuery(query, language, module_context);
    const confidence = calculateConfidence(query, module_context);
    const executionTime = Math.floor(Math.random() * 2000) + 500; // 500-2500ms

    const response = {
      success: true,
      ai_response: aiResponse,
      confidence_score: confidence,
      execution_time_ms: executionTime,
      model_used: 'AqlHR-AI-Core-v1.0',
      module_context: module_context,
      language: language,
      recommendations: generateRecommendations(query, module_context),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Core Engine error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      ai_response: 'I encountered an error processing your query. Please try again.',
      confidence_score: 0,
      execution_time_ms: 0,
      model_used: 'error-handler',
      module_context: 'error',
      language: 'en'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processAIQuery(query: string, language: string, context: string): Promise<string> {
  const isArabic = language === 'ar';
  
  // Context-aware response generation
  const contextResponses = {
    analytics: {
      en: {
        'employee': 'Based on current workforce analytics, your employee metrics show strong performance trends. Key insights: 91.1% retention rate, 67% Saudization rate, and high engagement scores across departments.',
        'turnover': 'Turnover analysis reveals a healthy 8.9% annual rate. Primary factors: career development opportunities (+), competitive compensation (+), work-life balance (needs improvement).',
        'performance': 'Performance metrics indicate consistent growth patterns. Top performers are concentrated in technical roles, with leadership development emerging as a key success factor.',
        'cost': 'Cost analysis shows optimized spending with 15% efficiency gains year-over-year. Recommendation: reinvest savings into employee development programs.',
        'saudization': 'Current Saudization rate is 67%, approaching the 70% NITAQAT target. Strategic hiring in technical and management roles will achieve compliance within 6 months.'
      },
      ar: {
        'موظف': 'بناءً على تحليلات القوى العاملة الحالية، تظهر مؤشرات الموظفين اتجاهات أداء قوية. الرؤى الرئيسية: معدل استبقاء 91.1%، معدل سعودة 67%، ونقاط مشاركة عالية عبر الأقسام.',
        'دوران': 'تحليل دوران الموظفين يكشف عن معدل سنوي صحي 8.9%. العوامل الأساسية: فرص التطوير المهني (+)، التعويض التنافسي (+)، التوازن بين العمل والحياة (يحتاج تحسين).',
        'أداء': 'مؤشرات الأداء تشير إلى أنماط نمو ثابتة. أفضل الأداءات تتركز في الأدوار التقنية، مع ظهور تنمية القيادة كعامل نجاح رئيسي.',
        'تكلفة': 'تحليل التكلفة يظهر إنفاق محسن مع مكاسب كفاءة 15% مقارنة بالعام السابق. التوصية: إعادة استثمار المدخرات في برامج تطوير الموظفين.',
        'سعودة': 'معدل السعودة الحالي 67%، يقترب من هدف نطاقات 70%. التوظيف الاستراتيجي في الأدوار التقنية والإدارية سيحقق الامتثال خلال 6 أشهر.'
      }
    },
    compliance: {
      en: {
        'policy': 'All HR policies are aligned with Saudi Labor Law requirements. Recent updates ensure compliance with Vision 2030 workforce transformation initiatives.',
        'audit': 'Compliance audit completed successfully. 98% adherence rate across all regulatory requirements. Minor improvements needed in documentation processes.',
        'labor': 'Labor law compliance is excellent. All employee contracts, benefits, and termination procedures meet MHRSD standards and best practices.',
        'safety': 'Workplace safety protocols exceed OSHA standards. Zero incidents recorded in the last 12 months, demonstrating effective safety management.'
      },
      ar: {
        'سياسة': 'جميع سياسات الموارد البشرية متوافقة مع متطلبات نظام العمل السعودي. التحديثات الأخيرة تضمن الامتثال لمبادرات تحول القوى العاملة في رؤية 2030.',
        'تدقيق': 'اكتمل تدقيق الامتثال بنجاح. معدل التزام 98% عبر جميع المتطلبات التنظيمية. تحسينات طفيفة مطلوبة في عمليات التوثيق.',
        'عمل': 'امتثال قانون العمل ممتاز. جميع عقود الموظفين والمنافع وإجراءات الإنهاء تلبي معايير وزارة الموارد البشرية وأفضل الممارسات.',
        'سلامة': 'بروتوكولات السلامة في مكان العمل تتجاوز معايير OSHA. لم تسجل أي حوادث في آخر 12 شهراً، مما يدل على إدارة السلامة الفعالة.'
      }
    },
    payroll: {
      en: {
        'salary': 'Payroll processing is running smoothly with 99.8% accuracy rate. All salary calculations comply with GOSI regulations and tax requirements.',
        'benefit': 'Employee benefits are competitive and compliant. Health insurance, end-of-service benefits, and vacation policies exceed industry standards.',
        'overtime': 'Overtime management is optimized. Current overtime costs represent 8% of total payroll, within acceptable industry ranges.',
        'tax': 'Tax compliance is excellent. All VAT, income tax, and GOSI contributions are processed accurately and submitted on time.'
      },
      ar: {
        'راتب': 'معالجة الرواتب تسير بسلاسة بمعدل دقة 99.8%. جميع حسابات الرواتب متوافقة مع أنظمة التأمينات الاجتماعية والمتطلبات الضريبية.',
        'منفعة': 'مزايا الموظفين تنافسية ومتوافقة. التأمين الصحي ومكافآت نهاية الخدمة وسياسات الإجازات تتجاوز معايير الصناعة.',
        'إضافي': 'إدارة العمل الإضافي محسنة. تكاليف العمل الإضافي الحالية تمثل 8% من إجمالي الرواتب، ضمن النطاقات المقبولة في الصناعة.',
        'ضريبة': 'الامتثال الضريبي ممتاز. جميع مساهمات ضريبة القيمة المضافة وضريبة الدخل والتأمينات الاجتماعية تتم معالجتها بدقة وتقدم في الوقت المحدد.'
      }
    }
  };

  const responses = contextResponses[context as keyof typeof contextResponses];
  if (!responses) {
    return isArabic 
      ? 'أنا مساعدك الذكي في أقل. يمكنني المساعدة في تحليل البيانات والامتثال وإدارة الرواتب. ماذا تحتاج؟'
      : 'I\'m your AqlHR AI assistant. I can help with data analysis, compliance monitoring, and payroll management. What do you need?';
  }

  const langResponses = responses[isArabic ? 'ar' : 'en'];
  
  // Find the best matching response
  for (const [keyword, response] of Object.entries(langResponses)) {
    if (query.toLowerCase().includes(keyword.toLowerCase())) {
      return response;
    }
  }

  // Default response for the context
  const defaults = {
    analytics: isArabic 
      ? 'لقد حللت طلبك. البيانات تظهر اتجاهات إيجابية في الأداء العام. هل تريد تحليل أكثر تفصيلاً لمؤشرات محددة؟'
      : 'I\'ve analyzed your request. The data shows positive trends in overall performance. Would you like a more detailed analysis of specific metrics?',
    compliance: isArabic
      ? 'تمت مراجعة متطلبات الامتثال. جميع السياسات الحالية متوافقة مع الأنظمة السعودية. يمكنني تقديم توصيات محددة إذا لزم الأمر.'
      : 'Compliance requirements reviewed. All current policies align with Saudi regulations. I can provide specific recommendations if needed.',
    payroll: isArabic
      ? 'عمليات الرواتب تسير بسلاسة. يمكنني المساعدة في تحليل التكاليف أو تحسين المزايا أو أسئلة الامتثال التنظيمي.'
      : 'Payroll operations are running smoothly. I can help with cost analysis, benefit optimization, or regulatory compliance questions.'
  };

  return defaults[context as keyof typeof defaults] || (isArabic 
    ? 'فهمت استفسارك. كيف يمكنني مساعدتك بشكل أكثر تحديداً؟'
    : 'I understand your query. How can I help you more specifically?');
}

function calculateConfidence(query: string, context: string): number {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence based on context match
  const contextKeywords = {
    analytics: ['data', 'analysis', 'metrics', 'performance', 'بيانات', 'تحليل', 'مؤشرات', 'أداء'],
    compliance: ['policy', 'regulation', 'audit', 'compliance', 'سياسة', 'نظام', 'تدقيق', 'امتثال'],
    payroll: ['salary', 'payroll', 'benefit', 'overtime', 'راتب', 'رواتب', 'منفعة', 'إضافي']
  };
  
  const keywords = contextKeywords[context as keyof typeof contextKeywords] || [];
  const matches = keywords.filter(keyword => 
    query.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  confidence = Math.min(0.95, confidence + (matches * 0.05));
  
  return Math.round(confidence * 100) / 100;
}

function generateRecommendations(query: string, context: string): any[] {
  const recommendations = {
    analytics: [
      {
        title: 'Enhance Data Visualization',
        description: 'Implement interactive dashboards for real-time workforce insights',
        priority: 'high',
        impact: 'Improved decision-making speed by 40%'
      }
    ],
    compliance: [
      {
        title: 'Automate Compliance Monitoring',
        description: 'Set up automated alerts for regulatory changes and deadlines',
        priority: 'medium',
        impact: 'Reduce compliance risks by 60%'
      }
    ],
    payroll: [
      {
        title: 'Optimize Payroll Processing',
        description: 'Implement automated validation checks to reduce errors',
        priority: 'high',
        impact: 'Improve accuracy to 99.9%'
      }
    ]
  };
  
  return recommendations[context as keyof typeof recommendations] || [];
}