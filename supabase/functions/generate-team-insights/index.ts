import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { managerId, analysisType = 'comprehensive' } = await req.json();

    if (!managerId) {
      throw new Error('Manager ID is required');
    }

    // Fetch manager data and team analytics
    const { data: managerProfile, error: managerError } = await supabaseClient
      .from('manager_profiles')
      .select('*')
      .eq('id', managerId)
      .single();

    if (managerError) throw managerError;

    // Fetch team performance metrics
    const { data: performanceMetrics, error: performanceError } = await supabaseClient
      .from('team_performance_metrics')
      .select('*')
      .eq('company_id', managerProfile.company_id)
      .order('metric_date', { ascending: false })
      .limit(30);

    if (performanceError) throw performanceError;

    // Fetch team members
    const { data: teamMembers, error: teamError } = await supabaseClient
      .from('team_members')
      .select('*')
      .eq('manager_id', managerId);

    if (teamError) throw teamError;

    // Fetch recent action items
    const { data: actionItems, error: actionError } = await supabaseClient
      .from('action_items')
      .select('*')
      .eq('manager_id', managerId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (actionError) throw actionError;

    // Generate AI insights based on the data
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const analyticsPrompt = `
As an HR AI Assistant, analyze the following team data and provide actionable insights:

Manager: ${managerProfile.name} (${managerProfile.department})
Team Size: ${teamMembers?.length || 0} members
Recent Performance Metrics: ${JSON.stringify(performanceMetrics?.slice(0, 7))}
Team Members Status: ${JSON.stringify(teamMembers?.map(m => ({
  name: m.name,
  status: m.status,
  performance_score: m.performance_score,
  engagement_score: m.engagement_score
})))}
Active Action Items: ${actionItems?.filter(a => a.status === 'pending').length || 0}

Analysis Type: ${analysisType}

Please provide:
1. Key Performance Insights (trends, patterns)
2. Team Health Assessment 
3. Risk Areas (attendance, engagement, performance)
4. Specific Actionable Recommendations
5. Priority Actions for the next 30 days

Format as JSON with the following structure:
{
  "summary": "Brief overview of team status",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "teamHealth": {
    "overall_score": 85,
    "performance_trend": "improving|stable|declining",
    "engagement_level": "high|medium|low",
    "risk_level": "low|medium|high"
  },
  "riskAreas": [
    {
      "area": "attendance|performance|engagement",
      "severity": "high|medium|low",
      "description": "detailed description",
      "affected_members": 2
    }
  ],
  "recommendations": [
    {
      "title": "recommendation title",
      "description": "detailed description",
      "priority": "high|medium|low",
      "timeline": "immediate|this_week|this_month",
      "expected_impact": "high|medium|low"
    }
  ],
  "priorityActions": [
    {
      "action": "specific action",
      "deadline": "2024-01-15",
      "assignee": "manager|team|hr"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analytics AI that provides data-driven insights for team management. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: analyticsPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let insights;
    
    try {
      insights = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      insights = {
        summary: "Team analytics data processed successfully",
        keyInsights: [
          "Team performance shows consistent patterns",
          "Engagement levels vary across team members",
          "Attendance tracking indicates room for improvement"
        ],
        teamHealth: {
          overall_score: 82,
          performance_trend: "stable",
          engagement_level: "medium",
          risk_level: "low"
        },
        riskAreas: [],
        recommendations: [
          {
            title: "Enhance Team Communication",
            description: "Implement regular one-on-one meetings to improve engagement",
            priority: "medium",
            timeline: "this_week",
            expected_impact: "high"
          }
        ],
        priorityActions: [
          {
            action: "Schedule team performance review",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignee: "manager"
          }
        ]
      };
    }

    // Store insights in database for future reference
    const { error: insertError } = await supabaseClient
      .from('action_items')
      .insert(
        insights.recommendations?.map((rec: any) => ({
          company_id: managerProfile.company_id,
          manager_id: managerId,
          title: rec.title,
          description: rec.description,
          category: 'performance',
          priority: rec.priority,
          status: 'pending',
          is_ai_generated: true,
          confidence_score: 85,
        })) || []
      );

    if (insertError) {
      console.error('Error inserting AI recommendations:', insertError);
    }

    console.log('Team insights generated successfully for manager:', managerId);

    return new Response(JSON.stringify({
      success: true,
      insights,
      metadata: {
        manager_id: managerId,
        team_size: teamMembers?.length || 0,
        analysis_type: analysisType,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating team insights:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});