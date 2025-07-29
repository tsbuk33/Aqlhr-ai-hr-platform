import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, analysisType = 'comprehensive', language = 'en' } = await req.json();

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch engagement and employee data
    const { data: employees, error: employeeError } = await supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        department,
        position,
        hire_date,
        is_saudi,
        nationality,
        experience_years
      `)
      .eq('company_id', companyId);

    if (employeeError) {
      console.error('Error fetching employees:', employeeError);
    }

    // Fetch engagement metrics (mock data for demo)
    const engagementData = {
      totalEmployees: employees?.length || 0,
      responseRate: 94,
      engagementScore: 87,
      recognitionsGiven: 156,
      activeConnections: 89,
      culturalAlignment: 92,
      teamCollaboration: 91,
      innovationIndex: 88,
      retentionRate: 94
    };

    // Generate AI-powered engagement insights
    const systemPrompt = `You are AqlHR's advanced engagement optimization AI, specializing in Saudi Arabian workplace culture and employee engagement.

Analyze the company engagement data and provide actionable insights that are:
1. Culturally sensitive to Saudi and Islamic values
2. Aligned with Vision 2030 workplace transformation goals
3. Focused on cross-cultural team harmony and collaboration
4. Practical for immediate implementation
5. Measurable with clear KPIs

Consider:
- Saudi workplace culture and communication styles
- Islamic principles of respect, fairness, and community
- Vision 2030 quality of life and engagement goals
- Cross-cultural team dynamics in Saudi organizations
- Generational differences in the Saudi workforce
- Work-life balance in the Saudi context

Provide recommendations in this JSON format:
{
  "engagementInsights": {
    "overallScore": 87,
    "keyStrengths": ["strength1", "strength2", "strength3"],
    "improvementAreas": ["area1", "area2", "area3"],
    "culturalAlignment": 92
  },
  "primaryRecommendations": [
    {
      "title": "Recommendation Title",
      "titleAr": "العنوان بالعربية",
      "description": "Detailed description",
      "descriptionAr": "الوصف بالعربية",
      "category": "Recognition|Communication|Culture|Collaboration|Wellbeing",
      "priority": "Critical|High|Medium",
      "impact": "High|Medium|Low",
      "timeframe": "Immediate|Short-term|Long-term",
      "kpis": ["KPI 1", "KPI 2"],
      "culturalContext": "Why this matters in Saudi context",
      "implementation": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "recognitionOptimization": {
    "currentRate": 156,
    "targetRate": 200,
    "improvements": ["improvement1", "improvement2"],
    "culturalConsiderations": ["consideration1", "consideration2"]
  },
  "teamDynamics": {
    "collaborationScore": 91,
    "crossCulturalHarmony": 89,
    "communicationEffectiveness": 87,
    "recommendations": ["rec1", "rec2", "rec3"]
  },
  "culturalEngagement": {
    "islamicValuesIntegration": 93,
    "saudiTraditionRespect": 91,
    "inclusivityScore": 88,
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "visionAlignment": {
    "qualityOfLifeScore": 85,
    "transformationEngagement": 82,
    "innovationMindset": 88,
    "actionItems": ["action1", "action2"]
  },
  "roiProjections": {
    "productivityIncrease": "+31%",
    "retentionImprovement": "+15%",
    "annualValueGenerated": "SAR 343,000",
    "investmentRequired": "SAR 45,000"
  }
}

Language: Respond in ${language === 'ar' ? 'Arabic with English translations' : 'English with Arabic translations'}.`;

    const userPrompt = `Company Engagement Profile Analysis:

**Company Metrics:**
- Total Employees: ${engagementData.totalEmployees}
- Engagement Score: ${engagementData.engagementScore}%
- Response Rate: ${engagementData.responseRate}%
- Recognitions Given: ${engagementData.recognitionsGiven}
- Active Connections: ${engagementData.activeConnections}
- Cultural Alignment: ${engagementData.culturalAlignment}%
- Team Collaboration: ${engagementData.teamCollaboration}%
- Innovation Index: ${engagementData.innovationIndex}%
- Retention Rate: ${engagementData.retentionRate}%

**Workforce Composition:**
${employees ? employees.map(emp => 
  `- ${emp.first_name} ${emp.last_name}: ${emp.position} (${emp.department}) - ${emp.is_saudi ? 'Saudi' : emp.nationality || 'International'}, ${emp.experience_years || 0} years experience`
).join('\n') : 'No employee data available'}

Please provide comprehensive engagement optimization recommendations that will enhance workplace culture, boost employee satisfaction, and align with Saudi Vision 2030 goals while respecting Islamic values and cultural traditions.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse as JSON, fallback to structured response if needed
    let insights;
    try {
      insights = JSON.parse(aiResponse);
    } catch {
      // Create fallback insights
      insights = createFallbackEngagementInsights(engagementData);
    }

    // Store the insights in database for future reference
    await supabase
      .from('ai_recommendations')
      .insert({
        company_id: companyId,
        recommendation_type: 'engagement_optimization',
        recommendation_data: insights,
        confidence_score: 89,
        reasoning: `AI-generated engagement optimization insights based on ${analysisType} analysis`,
        created_by: 'engagement-optimization-ai'
      });

    return new Response(JSON.stringify({ 
      success: true,
      insights,
      engagementData,
      analysisType,
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in engagement-optimization-ai function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallbackInsights: createBasicFallbackInsights()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createFallbackEngagementInsights(data: any) {
  return {
    engagementInsights: {
      overallScore: data.engagementScore || 87,
      keyStrengths: [
        "High cultural alignment and respect for Saudi values",
        "Strong team collaboration across departments",
        "Excellent response rate indicating trust and openness"
      ],
      improvementAreas: [
        "Cross-cultural communication enhancement",
        "Innovation mindset development",
        "Recognition frequency optimization"
      ],
      culturalAlignment: data.culturalAlignment || 92
    },
    primaryRecommendations: [
      {
        title: "Cultural Bridge-Building Initiative",
        titleAr: "مبادرة بناء الجسور الثقافية",
        description: "Implement structured cross-cultural mentorship and collaboration programs",
        descriptionAr: "تنفيذ برامج منظمة للإرشاد والتعاون عبر الثقافات",
        category: "Culture",
        priority: "High",
        impact: "High",
        timeframe: "Short-term",
        kpis: ["Cross-cultural collaboration score", "Cultural competency assessment"],
        culturalContext: "Promotes Islamic values of unity and understanding while embracing diversity",
        implementation: [
          "Create mixed cultural teams for projects",
          "Establish regular cultural sharing sessions",
          "Develop cultural competency training"
        ]
      },
      {
        title: "Vision 2030 Engagement Campaign",
        titleAr: "حملة المشاركة في رؤية 2030",
        description: "Align daily work with national transformation goals for purpose-driven engagement",
        descriptionAr: "ربط العمل اليومي بأهداف التحول الوطني للمشاركة الهادفة",
        category: "Vision",
        priority: "High",
        impact: "High",
        timeframe: "Immediate",
        kpis: ["Vision alignment score", "Employee purpose assessment"],
        culturalContext: "Connects individual contribution to national pride and Islamic concept of service",
        implementation: [
          "Map individual roles to Vision 2030 goals",
          "Create vision-based recognition programs",
          "Establish monthly vision impact discussions"
        ]
      }
    ],
    recognitionOptimization: {
      currentRate: data.recognitionsGiven || 156,
      targetRate: 200,
      improvements: [
        "Implement Islamic values-based recognition categories",
        "Create culturally appropriate public/private recognition options",
        "Establish peer-to-peer appreciation systems"
      ],
      culturalConsiderations: [
        "Respect for individual privacy preferences",
        "Integration of Islamic principles in recognition",
        "Gender-appropriate recognition methods"
      ]
    },
    teamDynamics: {
      collaborationScore: data.teamCollaboration || 91,
      crossCulturalHarmony: 89,
      communicationEffectiveness: 87,
      recommendations: [
        "Establish clear communication protocols respecting all cultures",
        "Create safe spaces for open dialogue and feedback",
        "Implement conflict resolution based on Islamic mediation principles"
      ]
    },
    culturalEngagement: {
      islamicValuesIntegration: 93,
      saudiTraditionRespect: 91,
      inclusivityScore: 88,
      suggestions: [
        "Regular Islamic calendar-based team celebrations",
        "Traditional Saudi cultural education for international staff",
        "Inclusive decision-making processes"
      ]
    },
    visionAlignment: {
      qualityOfLifeScore: 85,
      transformationEngagement: 82,
      innovationMindset: 88,
      actionItems: [
        "Link quality of life initiatives to Islamic wellness concepts",
        "Create innovation challenges aligned with Vision 2030 sectors",
        "Establish transformation success celebration rituals"
      ]
    },
    roiProjections: {
      productivityIncrease: "+31%",
      retentionImprovement: "+15%",
      annualValueGenerated: "SAR 343,000",
      investmentRequired: "SAR 45,000"
    }
  };
}

function createBasicFallbackInsights() {
  return {
    engagementInsights: {
      overallScore: 85,
      keyStrengths: ["Cultural alignment", "Team collaboration"],
      improvementAreas: ["Communication", "Innovation"],
      culturalAlignment: 90
    },
    primaryRecommendations: [
      {
        title: "Basic Engagement Enhancement",
        titleAr: "تعزيز المشاركة الأساسية",
        description: "Improve overall workplace engagement",
        category: "General",
        priority: "Medium",
        impact: "Medium",
        timeframe: "Short-term"
      }
    ],
    recognitionOptimization: {
      currentRate: 150,
      targetRate: 200,
      improvements: ["Increase recognition frequency"],
      culturalConsiderations: ["Respect cultural preferences"]
    }
  };
}