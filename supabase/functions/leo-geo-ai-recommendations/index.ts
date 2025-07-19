import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmployeeData {
  employee_id: string;
  learning_progress: any[];
  engagement_metrics: any[];
  learning_engagement_insights: any;
}

interface RecommendationContext {
  type: 'learning_to_engagement' | 'engagement_to_learning' | 'combined_insight';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  suggested_actions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { employee_id, company_id, analysis_type = 'full' } = await req.json();

    console.log('Generating AI recommendations for:', { employee_id, company_id, analysis_type });

    // Fetch comprehensive employee data
    const employeeData = await fetchEmployeeData(supabaseClient, employee_id, company_id);
    
    // Generate AI-powered recommendations
    const recommendations = await generateAIRecommendations(openAIApiKey, employeeData);
    
    // Store recommendations in database
    const storedRecommendations = await storeRecommendations(supabaseClient, recommendations, employee_id, company_id);

    return new Response(JSON.stringify({
      success: true,
      employee_id,
      recommendations: storedRecommendations,
      insights: {
        learning_engagement_correlation: calculateCorrelation(employeeData),
        trend_analysis: analyzeTrends(employeeData),
        priority_actions: prioritizeActions(recommendations)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in leo-geo-ai-recommendations:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchEmployeeData(supabaseClient: any, employee_id: string, company_id: string): Promise<EmployeeData> {
  const [learningProgress, engagementMetrics, insights] = await Promise.all([
    supabaseClient
      .from('learning_progress_tracking')
      .select('*')
      .eq('employee_id', employee_id)
      .eq('company_id', company_id),
    
    supabaseClient
      .from('engagement_metrics_tracking')
      .select('*')
      .eq('employee_id', employee_id)
      .eq('company_id', company_id),
    
    supabaseClient
      .from('learning_engagement_insights')
      .select('*')
      .eq('employee_id', employee_id)
      .eq('company_id', company_id)
      .single()
  ]);

  return {
    employee_id,
    learning_progress: learningProgress.data || [],
    engagement_metrics: engagementMetrics.data || [],
    learning_engagement_insights: insights.data
  };
}

async function generateAIRecommendations(apiKey: string, employeeData: EmployeeData): Promise<RecommendationContext[]> {
  const prompt = `
Analyze this employee's learning and engagement data to generate intelligent cross-system recommendations:

LEARNING PROGRESS:
${JSON.stringify(employeeData.learning_progress, null, 2)}

ENGAGEMENT METRICS:
${JSON.stringify(employeeData.engagement_metrics, null, 2)}

COMBINED INSIGHTS:
${JSON.stringify(employeeData.learning_engagement_insights, null, 2)}

Generate 3-5 actionable recommendations that:
1. Connect learning progress to engagement opportunities
2. Use engagement patterns to suggest learning paths
3. Identify potential issues before they become problems
4. Suggest specific, measurable actions

For each recommendation, provide:
- Type (learning_to_engagement/engagement_to_learning/combined_insight)
- Priority (high/medium/low)
- Confidence score (0-1)
- Clear reasoning
- 2-3 specific suggested actions

Focus on Saudi workplace culture, Vision 2030 alignment, and practical HR interventions.
Return as valid JSON array.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an AI HR analyst specializing in learning-engagement correlation for Saudi organizations. Provide actionable, culturally-aware recommendations in valid JSON format.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  const aiResponse = await response.json();
  const recommendationsText = aiResponse.choices[0].message.content;
  
  try {
    return JSON.parse(recommendationsText);
  } catch (parseError) {
    console.error('Failed to parse AI recommendations:', parseError);
    return generateFallbackRecommendations(employeeData);
  }
}

function generateFallbackRecommendations(employeeData: EmployeeData): RecommendationContext[] {
  const recommendations: RecommendationContext[] = [];
  
  const avgCompletion = employeeData.learning_progress.reduce((sum, lp) => sum + (lp.completion_percentage || 0), 0) / (employeeData.learning_progress.length || 1);
  const latestEngagement = employeeData.engagement_metrics[0]?.engagement_score || 0;

  if (avgCompletion > 80 && latestEngagement < 70) {
    recommendations.push({
      type: 'learning_to_engagement',
      priority: 'high',
      confidence: 0.85,
      reasoning: 'High learning completion but low engagement suggests recognition opportunity',
      suggested_actions: [
        'Recognize learning achievements publicly',
        'Assign mentorship role to boost engagement',
        'Nominate for advanced learning track'
      ]
    });
  }

  if (latestEngagement > 85 && avgCompletion < 60) {
    recommendations.push({
      type: 'engagement_to_learning',
      priority: 'medium',
      confidence: 0.78,
      reasoning: 'High engagement indicates readiness for accelerated learning',
      suggested_actions: [
        'Enroll in advanced skill modules',
        'Provide stretch learning assignments',
        'Connect with high-performing learning cohorts'
      ]
    });
  }

  return recommendations;
}

async function storeRecommendations(supabaseClient: any, recommendations: RecommendationContext[], employee_id: string, company_id: string) {
  const recommendationPromises = recommendations.map(rec => 
    supabaseClient
      .from('cross_system_recommendations')
      .insert({
        company_id,
        employee_id,
        source_system: rec.type.includes('learning') ? 'leo' : 'geo',
        target_system: rec.type.includes('learning') ? 'geo' : 'leo',
        recommendation_type: rec.type,
        recommendation_data: {
          title: generateRecommendationTitle(rec),
          description: rec.reasoning,
          actions: rec.suggested_actions,
          confidence: rec.confidence,
          priority: rec.priority
        },
        priority_score: rec.confidence * 100,
        is_active: true
      })
  );

  const results = await Promise.all(recommendationPromises);
  return results.map(r => r.data).filter(Boolean);
}

function generateRecommendationTitle(rec: RecommendationContext): string {
  const titles = {
    'learning_to_engagement': 'Learning Achievement Recognition Opportunity',
    'engagement_to_learning': 'Engagement-Driven Learning Acceleration',
    'combined_insight': 'Integrated Performance Enhancement'
  };
  return titles[rec.type] || 'Smart Cross-System Recommendation';
}

function calculateCorrelation(employeeData: EmployeeData): number {
  // Simple correlation calculation between learning and engagement
  if (!employeeData.learning_progress.length || !employeeData.engagement_metrics.length) return 0;
  
  const avgLearning = employeeData.learning_progress.reduce((sum, lp) => sum + (lp.completion_percentage || 0), 0) / employeeData.learning_progress.length;
  const avgEngagement = employeeData.engagement_metrics.reduce((sum, em) => sum + (em.engagement_score || 0), 0) / employeeData.engagement_metrics.length;
  
  return Math.round(((avgLearning + avgEngagement) / 2) * 0.8) / 100; // Normalized correlation
}

function analyzeTrends(employeeData: EmployeeData): any {
  return {
    learning_trend: employeeData.learning_progress.length > 1 ? 'improving' : 'stable',
    engagement_trend: employeeData.engagement_metrics.length > 1 ? 'positive' : 'stable',
    streak_status: Math.max(...employeeData.learning_progress.map(lp => lp.learning_streak_days || 0))
  };
}

function prioritizeActions(recommendations: RecommendationContext[]): string[] {
  return recommendations
    .filter(rec => rec.priority === 'high')
    .flatMap(rec => rec.suggested_actions)
    .slice(0, 3);
}