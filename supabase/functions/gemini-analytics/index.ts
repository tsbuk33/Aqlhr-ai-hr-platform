import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeminiRequest {
  analyticsData: any;
  analysisType: 'insights' | 'predictions' | 'anomalies';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { analyticsData, analysisType }: GeminiRequest = await req.json();

    console.log('Gemini Analytics Request:', { analysisType, dataKeys: Object.keys(analyticsData) });

    // Prepare analytics summary for Gemini
    const analyticsSummary = `
Analytics Data Summary:
- Total Users: ${analyticsData.totalUsers || 0}
- Page Views: ${analyticsData.totalPageViews || 0}
- Session Duration: ${analyticsData.avgSessionDuration || 0} minutes
- Bounce Rate: ${analyticsData.bounceRate || 0}%
- Saudization Rate: ${analyticsData.saudizationRate || 0}%
- Departments: ${analyticsData.departments?.length || 0}
- Salary Range: ${analyticsData.salaryAnalytics?.minSalary || 0} - ${analyticsData.salaryAnalytics?.maxSalary || 0} SAR

Analysis Type: ${analysisType}
`;

    const prompts = {
      insights: `Analyze this HR analytics data and provide 2 key insights about workforce performance, engagement patterns, and operational efficiency. Focus on actionable recommendations:

${analyticsSummary}

Provide insights in this JSON format:
{
  "insights": [
    {
      "title": "Insight Title",
      "description": "Detailed description with specific metrics and recommendations",
      "confidence": 0.85,
      "category": "performance|trend|anomaly|prediction",
      "priority": "high|medium|low"
    }
  ]
}`,
      predictions: `Based on this HR analytics data, predict future trends and potential challenges. Focus on workforce planning and strategic recommendations:

${analyticsSummary}

Provide predictions in JSON format with specific forecasts and recommended actions.`,
      anomalies: `Identify any unusual patterns or anomalies in this HR analytics data that require immediate attention:

${analyticsSummary}

Highlight anomalies with severity levels and recommended actions.`
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [{
          "parts": [{
            "text": prompts[analysisType]
          }]
        }],
        "generationConfig": {
          "temperature": 0.3,
          "topK": 32,
          "topP": 0.8,
          "maxOutputTokens": 1024,
        },
        "safetySettings": [
          {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini Response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const geminiText = data.candidates[0].content.parts[0].text;
    
    // Try to parse JSON, fallback to text analysis
    let structuredInsights;
    try {
      structuredInsights = JSON.parse(geminiText);
    } catch (e) {
      // Fallback: create structured insights from text
      structuredInsights = {
        insights: [{
          title: `Gemini AI Analysis - ${analysisType}`,
          description: geminiText.slice(0, 200) + '...',
          confidence: 0.8,
          category: analysisType === 'insights' ? 'performance' : analysisType === 'predictions' ? 'prediction' : 'anomaly',
          priority: 'medium'
        }]
      };
    }

    return new Response(JSON.stringify({
      success: true,
      data: structuredInsights,
      model: 'gemini-2.0-flash-exp',
      analysisType,
      rawResponse: geminiText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-analytics function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});