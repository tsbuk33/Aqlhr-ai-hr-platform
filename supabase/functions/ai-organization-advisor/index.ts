import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyData, language = 'en' } = await req.json();

    const systemPrompt = `You are an expert organizational structure consultant for SanadHR, a leading Saudi Arabian HR platform. You have deep expertise in organizational design for companies operating in the Saudi market, considering local business culture, regulations, and workforce dynamics.

Analyze the provided company data and recommend the BEST organizational structure from these 6 options:
1. Hierarchical - Traditional top-down structure with clear chain of command
2. Functional - Organized by specialized departments (HR, Finance, Marketing, etc.)
3. Divisional - Organized by products, services, or geographic regions
4. Matrix - Dual reporting relationships combining functional and project-based structure
5. Flat - Minimal hierarchy with few management levels
6. Network - Decentralized structure with interconnected teams

Consider these Saudi-specific factors:
- Saudization requirements and workforce composition
- Local business culture and decision-making preferences
- Compliance with Saudi labor laws and regulations
- Growth potential and scalability in the Saudi market
- Industry-specific best practices in Saudi Arabia

Provide your response in this JSON format:
{
  "recommendedStructure": "structure_name",
  "confidence": 85,
  "reasoning": "Detailed explanation of why this structure is best",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "considerations": ["consideration1", "consideration2"],
  "implementationTips": ["tip1", "tip2", "tip3"],
  "saudizationImpact": "How this structure supports Saudization goals"
}

Language: Respond in ${language === 'ar' ? 'Arabic' : 'English'}.`;

    const userPrompt = `Company Profile:
- Total Employees: ${companyData.totalEmployees || 'Not specified'}
- Saudi Nationals: ${companyData.saudiEmployees || 'Not specified'}
- Departments: ${companyData.departments || 'Not specified'}
- Industry: ${companyData.industry || 'Not specified'}
- Company Size: ${companyData.sizeCategory || 'Not specified'}
- Annual Revenue: ${companyData.revenue || 'Not specified'}
- Geographic Presence: ${companyData.locations || 'Saudi Arabia'}
- Growth Stage: ${companyData.growthStage || 'Not specified'}
- Current Challenges: ${companyData.challenges || 'General operational efficiency'}

Please analyze this company profile and recommend the most suitable organizational structure for success in the Saudi market.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse as JSON, fallback to text if needed
    let recommendation;
    try {
      recommendation = JSON.parse(aiResponse);
    } catch {
      recommendation = {
        recommendedStructure: "functional",
        confidence: 75,
        reasoning: aiResponse,
        benefits: [],
        considerations: [],
        implementationTips: [],
        saudizationImpact: ""
      };
    }

    return new Response(JSON.stringify({ 
      recommendation,
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-organization-advisor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackRecommendation: {
        recommendedStructure: "functional",
        confidence: 70,
        reasoning: "Based on general best practices for Saudi companies, a functional structure is often recommended for medium-sized organizations.",
        benefits: ["Clear specialization", "Efficient resource allocation", "Supports Saudization"],
        considerations: ["May create silos", "Requires good communication"],
        implementationTips: ["Start with core departments", "Establish clear communication channels"],
        saudizationImpact: "Functional structure allows for targeted Saudization in each department"
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});