import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      query, 
      language = 'en', 
      module_context = 'general',
      company_id,
      user_id 
    } = await req.json();

    console.log('AI Core Engine received query:', { query, language, module_context });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();
    
    // Enhanced system prompt for AqlHR AI integration
    const systemPrompt = `You are Manus.im, the advanced AI engine powering AqlHR - the world's most intelligent HR Operating System. You have deep expertise in:

    CORE CAPABILITIES:
    - Saudi Arabian labor law and regulations
    - HR best practices and strategic planning
    - Workforce analytics and predictive modeling
    - Performance management and talent optimization
    - Government compliance (QIWA, GOSI, Nitaqat)
    - Executive intelligence and strategic insights

    RESPONSE GUIDELINES:
    - Provide actionable, data-driven insights
    - Include confidence scores for predictions
    - Suggest specific implementation steps
    - Consider Saudi cultural context
    - Maintain professional, executive-level communication
    - Support both Arabic and English languages
    - Focus on measurable business outcomes

    Current module context: ${module_context}
    Response language: ${language}

    Provide intelligent, strategic responses that demonstrate deep HR expertise and deliver immediate value.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const aiData = await openAIResponse.json();
    const aiResponse = aiData.choices[0].message.content;
    const executionTime = Date.now() - startTime;

    // Calculate confidence score based on response characteristics
    const confidenceScore = calculateConfidenceScore(aiResponse, query);

    // Store query and response in database for learning
    if (company_id && user_id) {
      await supabase.from('ai_query_history').insert({
        company_id,
        user_id,
        query_text: query,
        query_language: language,
        module_context,
        ai_response: {
          content: aiResponse,
          model: 'gpt-4o',
          confidence_score: confidenceScore,
          execution_time_ms: executionTime
        },
        confidence_score: confidenceScore,
        execution_time_ms: executionTime
      });

      // Generate AI recommendations based on query
      await generateContextualRecommendations(company_id, query, module_context, aiResponse);
    }

    const response = {
      success: true,
      ai_response: aiResponse,
      confidence_score: confidenceScore,
      execution_time_ms: executionTime,
      model_used: 'gpt-4o',
      module_context,
      language,
      recommendations: await getRelevantRecommendations(company_id, module_context)
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Core Engine error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      ai_response: "I apologize, but I'm experiencing technical difficulties. Please try your query again.",
      confidence_score: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateConfidenceScore(response: string, query: string): number {
  let score = 0.5; // Base score
  
  // Length and detail indicators
  if (response.length > 500) score += 0.1;
  if (response.includes('recommendation') || response.includes('suggest')) score += 0.1;
  if (response.includes('data') || response.includes('analysis')) score += 0.1;
  
  // Specific knowledge indicators
  if (response.includes('Saudi') || response.includes('QIWA') || response.includes('GOSI')) score += 0.1;
  if (response.includes('%') || response.includes('metric')) score += 0.1;
  
  // Query complexity consideration
  if (query.length > 100) score += 0.05;
  if (query.includes('predict') || query.includes('forecast')) score += 0.05;
  
  return Math.min(0.95, Math.max(0.1, score));
}

async function generateContextualRecommendations(
  companyId: string, 
  query: string, 
  context: string, 
  aiResponse: string
) {
  try {
    // Generate recommendations based on the AI response
    const recommendations = [];
    
    if (context === 'workforce_planning' && aiResponse.includes('hire')) {
      recommendations.push({
        recommendation_type: 'hiring_optimization',
        title: 'Optimize Hiring Strategy',
        title_ar: 'تحسين استراتيجية التوظيف',
        description: 'Based on your query about workforce planning, consider implementing AI-powered candidate screening to improve hiring efficiency by 40%.',
        description_ar: 'بناءً على استفسارك حول تخطيط القوى العاملة، فكر في تنفيذ فحص المرشحين المدعوم بالذكاء الاصطناعي لتحسين كفاءة التوظيف بنسبة 40%.',
        confidence_score: 0.85,
        priority_level: 'high'
      });
    }
    
    if (context === 'performance' && aiResponse.includes('training')) {
      recommendations.push({
        recommendation_type: 'performance_enhancement',
        title: 'Implement Personalized Training',
        title_ar: 'تنفيذ التدريب الشخصي',
        description: 'AI analysis suggests implementing personalized training programs to boost employee performance by 25%.',
        description_ar: 'يقترح تحليل الذكاء الاصطناعي تنفيذ برامج تدريب شخصية لتعزيز أداء الموظفين بنسبة 25%.',
        confidence_score: 0.78,
        priority_level: 'medium'
      });
    }

    // Insert recommendations into database
    for (const rec of recommendations) {
      await supabase.from('ai_recommendations').insert({
        company_id: companyId,
        target_type: 'company',
        ...rec,
        expected_impact: {
          metric: 'efficiency',
          value: 25,
          timeline: '3 months'
        },
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }
}

async function getRelevantRecommendations(companyId: string, context: string) {
  try {
    const { data } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .gte('confidence_score', 0.7)
      .order('created_at', { ascending: false })
      .limit(3);

    return data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}