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
    const { employeeId, companyId, language = 'en' } = await req.json();

    if (!employeeId || !companyId) {
      throw new Error('Employee ID and Company ID are required');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch employee data
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        position,
        position_ar,
        actual_job_title,
        actual_job_title_ar,
        company_job_title,
        company_job_title_ar,
        department,
        experience_years,
        hire_date,
        is_saudi,
        nationality
      `)
      .eq('id', employeeId)
      .eq('company_id', companyId)
      .single();

    if (employeeError || !employee) {
      throw new Error('Employee not found');
    }

    // Fetch company data for context
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('name, industry, size_category, saudi_activity_classification')
      .eq('id', companyId)
      .single();

    // Fetch existing learning progress for context
    const { data: learningProgress } = await supabase
      .from('learning_progress_tracking')
      .select('skill_name, skill_category, completion_percentage, current_level, target_level')
      .eq('employee_id', employeeId)
      .eq('company_id', companyId);

    // Create comprehensive employee profile for AI
    const employeeProfile = {
      name: `${employee.first_name} ${employee.last_name}`,
      currentPosition: employee.position || employee.actual_job_title || employee.company_job_title,
      currentPositionAr: employee.position_ar || employee.actual_job_title_ar || employee.company_job_title_ar,
      department: employee.department,
      experienceYears: employee.experience_years || 0,
      tenure: employee.hire_date ? Math.floor((new Date().getTime() - new Date(employee.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0,
      isSaudi: employee.is_saudi,
      nationality: employee.nationality,
      company: {
        name: company?.name || 'Company',
        industry: company?.industry || 'Business',
        size: company?.size_category || 'Medium',
        saudiActivity: company?.saudi_activity_classification || 'General Business'
      },
      currentSkills: learningProgress || []
    };

    // Generate AI-powered learning recommendations
    const systemPrompt = `You are AqlHR's advanced learning recommendation AI, specializing in Saudi Arabian workforce development and Vision 2030 alignment.

Analyze the employee profile and generate highly personalized learning recommendations that are:
1. Directly relevant to their current job title and responsibilities
2. Aligned with Saudi Vision 2030 transformation goals
3. Considerate of Saudi labor market demands and cultural context
4. Progressive for career advancement within their industry
5. Balanced between technical skills, soft skills, and Saudi-specific competencies

Consider:
- Saudi labor law and workplace culture
- Vision 2030 digital transformation priorities
- NEOM, QIDDIYA, and giga-project skill requirements
- Saudization and localization objectives
- Islamic values and work ethics integration
- Modern Saudi business practices and protocols

Provide recommendations in this JSON format:
{
  "primaryRecommendations": [
    {
      "title": "Course/Skill Title",
      "titleAr": "العنوان بالعربية",
      "description": "Detailed description of why this is relevant to their role",
      "descriptionAr": "الوصف بالعربية",
      "category": "Technical|Leadership|Cultural|Compliance|Business",
      "priority": "Critical|High|Medium",
      "estimatedHours": 15,
      "skillLevel": "Beginner|Intermediate|Advanced",
      "relevanceScore": 95,
      "visionAlignment": "How this aligns with Vision 2030",
      "careerImpact": "Direct impact on career progression",
      "learningPath": ["Step 1", "Step 2", "Step 3"],
      "prerequisites": ["Basic requirement 1", "Basic requirement 2"],
      "outcomes": ["Expected outcome 1", "Expected outcome 2"],
      "saudiContext": "Why this is important in Saudi market"
    }
  ],
  "quickWins": [
    {
      "title": "Micro-learning opportunity",
      "titleAr": "الفرصة بالعربية",
      "duration": "2-4 hours",
      "immediateValue": "Quick skill boost or certification"
    }
  ],
  "futurePath": [
    {
      "timeframe": "3 months",
      "focus": "Next quarter learning focus",
      "skills": ["Skill 1", "Skill 2"]
    },
    {
      "timeframe": "6 months", 
      "focus": "Mid-term development",
      "skills": ["Advanced skill 1", "Advanced skill 2"]
    },
    {
      "timeframe": "12 months",
      "focus": "Annual development goal",
      "skills": ["Leadership skill", "Strategic skill"]
    }
  ],
  "industryTrends": [
    {
      "trend": "Emerging trend in their industry",
      "relevance": "Why it matters for their role",
      "preparation": "How to prepare for this trend"
    }
  ],
  "saudiSpecific": [
    {
      "area": "Saudi business practice or regulation",
      "importance": "Why this matters in KSA",
      "learningApproach": "Best way to develop this competency"
    }
  ]
}

Language: Respond in ${language === 'ar' ? 'Arabic with English translations' : 'English with Arabic translations'}.`;

    const userPrompt = `Employee Profile Analysis:

**Personal Information:**
- Name: ${employeeProfile.name}
- Current Position: ${employeeProfile.currentPosition}
- Arabic Title: ${employeeProfile.currentPositionAr || 'Not specified'}
- Department: ${employeeProfile.department || 'Not specified'}
- Experience: ${employeeProfile.experienceYears} years total experience
- Tenure: ${employeeProfile.tenure} years with current company
- Nationality: ${employeeProfile.isSaudi ? 'Saudi' : employeeProfile.nationality || 'International'}

**Company Context:**
- Company: ${employeeProfile.company.name}
- Industry: ${employeeProfile.company.industry}
- Size: ${employeeProfile.company.size}
- Saudi Activity Classification: ${employeeProfile.company.saudiActivity}

**Current Learning Status:**
${employeeProfile.currentSkills.length > 0 ? 
  employeeProfile.currentSkills.map(skill => 
    `- ${skill.skill_name} (${skill.skill_category}): ${skill.completion_percentage}% complete, Level ${skill.current_level}/${skill.target_level}`
  ).join('\n') : 
  'No current learning data available'
}

Please generate comprehensive, personalized learning recommendations that will advance this employee's career while contributing to Saudi Arabia's Vision 2030 transformation goals.`;

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
    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch {
      // Create fallback recommendations based on job title
      recommendations = createFallbackRecommendations(employeeProfile);
    }

    // Store the recommendation in database for future reference
    await supabase
      .from('ai_recommendations')
      .insert({
        company_id: companyId,
        employee_id: employeeId,
        recommendation_type: 'job_specific_learning',
        recommendation_data: recommendations,
        confidence_score: 85,
        reasoning: `AI-generated learning recommendations based on job title: ${employeeProfile.currentPosition}`,
        created_by: 'job-specific-learning-ai'
      });

    return new Response(JSON.stringify({ 
      success: true,
      recommendations,
      employeeProfile: {
        name: employeeProfile.name,
        position: employeeProfile.currentPosition,
        department: employeeProfile.department,
        experience: employeeProfile.experienceYears
      },
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in job-specific-learning-ai function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallbackRecommendations: createBasicFallbackRecommendations()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createFallbackRecommendations(profile: any) {
  return {
    primaryRecommendations: [
      {
        title: "Digital Transformation Fundamentals",
        titleAr: "أساسيات التحول الرقمي",
        description: `Essential digital skills for ${profile.currentPosition} in modern Saudi workplace`,
        descriptionAr: "المهارات الرقمية الأساسية للموظفين في بيئة العمل السعودية الحديثة",
        category: "Technical",
        priority: "High",
        estimatedHours: 20,
        skillLevel: "Intermediate",
        relevanceScore: 90,
        visionAlignment: "Supports Vision 2030 digital transformation goals",
        careerImpact: "Essential for career advancement in digital economy",
        learningPath: ["Digital Literacy", "Cloud Computing Basics", "Data Analysis"],
        prerequisites: ["Basic computer skills"],
        outcomes: ["Digital competency", "Modern workplace readiness"],
        saudiContext: "Aligned with Saudi Arabia's digital transformation initiatives"
      },
      {
        title: "Saudi Business Culture & Protocol",
        titleAr: "ثقافة وبروتوكول الأعمال السعودية",
        description: "Understanding Saudi business practices and cultural norms",
        descriptionAr: "فهم ممارسات الأعمال والمعايير الثقافية السعودية",
        category: "Cultural",
        priority: profile.isSaudi ? "Medium" : "Critical",
        estimatedHours: 12,
        skillLevel: "Beginner",
        relevanceScore: 85,
        visionAlignment: "Supports cultural awareness in diverse workforce",
        careerImpact: "Improves professional relationships and effectiveness",
        learningPath: ["Cultural Foundations", "Business Etiquette", "Communication Styles"],
        prerequisites: [],
        outcomes: ["Cultural competency", "Improved workplace relationships"],
        saudiContext: "Critical for success in Saudi business environment"
      }
    ],
    quickWins: [
      {
        title: "Vision 2030 Overview",
        titleAr: "نظرة عامة على رؤية 2030",
        duration: "3 hours",
        immediateValue: "Understanding national transformation goals"
      }
    ],
    futurePath: [
      {
        timeframe: "3 months",
        focus: "Core competency development",
        skills: ["Digital Skills", "Communication"]
      },
      {
        timeframe: "6 months",
        focus: "Advanced professional skills",
        skills: ["Leadership", "Project Management"]
      },
      {
        timeframe: "12 months",
        focus: "Strategic and specialized skills",
        skills: ["Strategic Thinking", "Innovation Management"]
      }
    ],
    industryTrends: [
      {
        trend: "Artificial Intelligence adoption",
        relevance: "AI is transforming all industries in Saudi Arabia",
        preparation: "Learn AI fundamentals and applications in your field"
      }
    ],
    saudiSpecific: [
      {
        area: "Saudi Labor Law",
        importance: "Essential for compliance and employee rights",
        learningApproach: "Structured course with practical examples"
      }
    ]
  };
}

function createBasicFallbackRecommendations() {
  return {
    primaryRecommendations: [
      {
        title: "Professional Development Essentials",
        titleAr: "أساسيات التطوير المهني",
        description: "Core skills for professional growth",
        category: "Business",
        priority: "High",
        estimatedHours: 15,
        relevanceScore: 80
      }
    ],
    quickWins: [],
    futurePath: [],
    industryTrends: [],
    saudiSpecific: []
  };
}