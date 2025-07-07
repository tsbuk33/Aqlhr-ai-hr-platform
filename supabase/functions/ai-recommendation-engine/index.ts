import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

/**
 * Smart Recommendation Engine - Temperature: 0.5, Top_p: 0.8
 * Creative suggestions without hallucination
 * Uses employee history, performance, training, and manager feedback
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const employeeId = url.searchParams.get('employee_id');
      const companyId = url.searchParams.get('company_id');

      if (employeeId) {
        // Get recommendations for specific employee
        const { data: recommendations, error } = await supabase
          .from('ai_recommendations')
          .select(`
            *,
            employee:employees(first_name, last_name, position, department)
          `)
          .eq('employee_id', employeeId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (companyId) {
        // Get all recommendations for company
        const { data: recommendations, error } = await supabase
          .from('ai_recommendations')
          .select(`
            *,
            employee:employees(first_name, last_name, position, department)
          `)
          .eq('company_id', companyId)
          .eq('status', 'pending')
          .order('priority', { ascending: false })
          .order('confidence_score', { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'POST') {
      const { employee_id, force_refresh = false } = await req.json();

      if (!employee_id) {
        throw new Error('Employee ID is required');
      }

      // Generate AI recommendations for the employee
      const recommendation = await generateEmployeeRecommendation(employee_id, force_refresh);

      return new Response(JSON.stringify(recommendation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('AI Recommendation Engine Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateEmployeeRecommendation(employeeId: string, forceRefresh: boolean = false) {
  // Check if recent recommendation exists (unless force refresh)
  if (!forceRefresh) {
    const { data: recent } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Within 7 days
      .order('created_at', { ascending: false })
      .limit(1);

    if (recent && recent.length > 0) {
      return {
        success: true,
        recommendation: recent[0],
        message: 'Recent recommendation found'
      };
    }
  }

  // Gather employee data for AI analysis
  const employeeData = await gatherEmployeeData(employeeId);
  
  if (!employeeData.employee) {
    throw new Error('Employee not found');
  }

  // Generate AI recommendation using OpenAI
  const aiRecommendation = await callOpenAIForRecommendation(employeeData);

  // Save recommendation to database
  const { data: savedRecommendation, error } = await supabase
    .from('ai_recommendations')
    .insert({
      company_id: employeeData.employee.company_id,
      employee_id: employeeId,
      recommendation_type: aiRecommendation.type,
      confidence_score: aiRecommendation.confidence,
      reasoning: aiRecommendation.reasoning,
      recommended_action: aiRecommendation.action,
      priority: aiRecommendation.priority,
      implementation_deadline: aiRecommendation.deadline
    })
    .select()
    .single();

  if (error) throw error;

  return {
    success: true,
    recommendation: savedRecommendation,
    ai_analysis: aiRecommendation
  };
}

async function gatherEmployeeData(employeeId: string) {
  console.log(`Gathering data for employee: ${employeeId}`);

  // Get employee basic info
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (empError) throw empError;

  // Get performance reviews
  const { data: reviews } = await supabase
    .from('performance_reviews')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })
    .limit(3);

  // Get training records
  const { data: training } = await supabase
    .from('training_records')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get attendance data
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
    .order('date', { ascending: false });

  // Get payroll history
  const { data: payroll } = await supabase
    .from('payroll')
    .select('*')
    .eq('employee_id', employeeId)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(6);

  return {
    employee,
    reviews: reviews || [],
    training: training || [],
    attendance: attendance || [],
    payroll: payroll || []
  };
}

async function callOpenAIForRecommendation(employeeData: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const { employee, reviews, training, attendance, payroll } = employeeData;

  // Calculate metrics for AI analysis
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.length 
    : 0;

  const attendanceRate = attendance.length > 0
    ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
    : 0;

  const trainingHours = training.reduce((sum, t) => sum + (t.hours || 0), 0);

  const systemPrompt = `You are a professional HR analyst specialized in Saudi labor law and employee behavior prediction. Your job is to recommend data-driven next steps for employee development and retention.

You analyze employee data and provide actionable recommendations that comply with Saudi Labor Law and consider cultural factors.

Always respond in JSON format with these fields:
- type: one of ["promotion", "transfer", "warning", "retention", "training", "salary_adjustment"]
- confidence: number between 0.00 and 1.00
- reasoning: detailed explanation (max 200 words)
- action: specific recommended action (max 100 words)  
- priority: one of ["low", "medium", "high", "urgent"]
- deadline: ISO date string (within next 6 months)`;

  const userPrompt = `Analyze this Saudi employee's data and provide a recommendation:

EMPLOYEE PROFILE:
- Name: ${employee.first_name} ${employee.last_name}
- Position: ${employee.position} (${employee.department})
- Nationality: ${employee.nationality} (Saudi: ${employee.is_saudi})
- Tenure: Hired ${employee.hire_date}
- Current Salary: SAR ${employee.salary}
- Status: ${employee.status}

PERFORMANCE DATA:
- Average Performance Rating: ${avgRating.toFixed(1)}/5.0 (from ${reviews.length} reviews)
- Recent Reviews: ${reviews.slice(0, 2).map(r => `${r.overall_rating}/5.0 (${r.review_period})`).join(', ')}

ATTENDANCE & ENGAGEMENT:
- Attendance Rate: ${attendanceRate.toFixed(1)}% (last 90 days)
- Training Completed: ${trainingHours} hours (${training.length} courses)

COMPENSATION HISTORY:
- Pay progression: ${payroll.slice(0, 3).map(p => `SAR ${p.net_salary} (${p.month}/${p.year})`).join(' → ')}

Provide a strategic recommendation that considers Saudi Labor Law, Saudization requirements, and cultural factors.`;

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
      temperature: 0.5,
      top_p: 0.8,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    return JSON.parse(aiResponse);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      type: 'retention',
      confidence: 0.75,
      reasoning: aiResponse.substring(0, 200),
      action: 'Review employee status and provide feedback',
      priority: 'medium',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}