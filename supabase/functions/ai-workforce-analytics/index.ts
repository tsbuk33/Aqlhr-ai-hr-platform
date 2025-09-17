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
    const { company_id, analysis_type } = await req.json();

    // Generate comprehensive workforce analytics
    const analytics = generateWorkforceAnalytics(company_id, analysis_type);

    return new Response(JSON.stringify({
      success: true,
      company_id,
      analysis_type,
      generated_at: new Date().toISOString(),
      ...analytics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Workforce Analytics error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateWorkforceAnalytics(companyId: string, analysisType: string) {
  const baseAnalytics = {
    overview: {
      total_employees: 450,
      active_employees: 425,
      saudization_rate: 0.67,
      retention_rate: 0.911,
      avg_tenure: 3.2,
      employee_satisfaction: 4.2
    },
    demographics: {
      gender_distribution: {
        male: 0.65,
        female: 0.35
      },
      age_groups: {
        "20-30": 0.35,
        "31-40": 0.40,
        "41-50": 0.20,
        "51+": 0.05
      },
      nationality_breakdown: {
        saudi: 0.67,
        non_saudi: 0.33
      }
    },
    performance_metrics: {
      productivity_index: 87.5,
      quality_score: 4.1,
      innovation_index: 76.3,
      collaboration_score: 4.3
    },
    financial_impact: {
      cost_per_employee: 45000,
      cost_per_hire: 12500,
      revenue_per_employee: 125000,
      roi_on_training: 3.2
    }
  };

  if (analysisType === 'comprehensive') {
    return {
      ...baseAnalytics,
      detailed_insights: {
        turnover_analysis: {
          annual_turnover_rate: 0.089,
          voluntary_turnover: 0.065,
          involuntary_turnover: 0.024,
          high_risk_employees: 23,
          retention_drivers: [
            "Career development opportunities",
            "Competitive compensation",
            "Work-life balance",
            "Leadership quality",
            "Company culture"
          ]
        },
        skills_analysis: {
          skill_gaps: [
            { skill: "Digital Marketing", gap_percentage: 35 },
            { skill: "Data Analytics", gap_percentage: 28 },
            { skill: "Leadership", gap_percentage: 22 },
            { skill: "AI/ML", gap_percentage: 45 }
          ],
          top_skills: [
            { skill: "Project Management", proficiency: 85 },
            { skill: "Communication", proficiency: 78 },
            { skill: "Problem Solving", proficiency: 82 },
            { skill: "Technical Skills", proficiency: 73 }
          ]
        },
        predictive_insights: {
          attrition_risk: {
            high_risk: 23,
            medium_risk: 67,
            low_risk: 335
          },
          hiring_forecast: {
            next_quarter: 15,
            next_6_months: 32,
            next_year: 68
          },
          budget_projections: {
            training_budget_needed: 245000,
            hiring_budget_needed: 580000,
            retention_program_budget: 125000
          }
        },
        compliance_status: {
          saudization_compliance: {
            current_rate: 67,
            target_rate: 70,
            gap: 13, // employees needed
            timeline_to_compliance: "6 months"
          },
          labor_law_compliance: 98,
          safety_compliance: 100,
          diversity_metrics: {
            gender_diversity_index: 0.72,
            leadership_diversity: 0.45
          }
        }
      },
      recommendations: [
        {
          category: "Retention",
          priority: "high",
          action: "Implement mentorship programs for high-risk employees",
          expected_impact: "Reduce turnover by 15%",
          investment_required: 85000,
          timeline: "3 months"
        },
        {
          category: "Skills Development",
          priority: "high",
          action: "Launch digital transformation training program",
          expected_impact: "Close 40% of skills gaps",
          investment_required: 150000,
          timeline: "6 months"
        },
        {
          category: "Saudization",
          priority: "critical",
          action: "Accelerate Saudi nationals hiring in technical roles",
          expected_impact: "Achieve 70% Saudization rate",
          investment_required: 200000,
          timeline: "6 months"
        },
        {
          category: "Performance",
          priority: "medium",
          action: "Implement AI-powered performance tracking",
          expected_impact: "Increase productivity by 25%",
          investment_required: 120000,
          timeline: "4 months"
        }
      ],
      trend_analysis: {
        monthly_trends: generateMonthlyTrends(),
        quarterly_projections: generateQuarterlyProjections(),
        year_over_year: {
          headcount_growth: 0.12,
          productivity_improvement: 0.08,
          cost_efficiency: 0.15,
          satisfaction_change: 0.06
        }
      }
    };
  }

  return baseAnalytics;
}

function generateMonthlyTrends() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    month,
    headcount: 420 + Math.floor(Math.random() * 30),
    turnover_rate: 0.07 + (Math.random() * 0.04),
    satisfaction_score: 4.0 + (Math.random() * 0.5),
    productivity_index: 80 + (Math.random() * 15)
  }));
}

function generateQuarterlyProjections() {
  return [
    {
      quarter: "Q1 2024",
      projected_headcount: 465,
      projected_saudization: 0.69,
      projected_turnover: 0.08,
      budget_allocation: 2150000
    },
    {
      quarter: "Q2 2024", 
      projected_headcount: 480,
      projected_saudization: 0.71,
      projected_turnover: 0.075,
      budget_allocation: 2280000
    },
    {
      quarter: "Q3 2024",
      projected_headcount: 495,
      projected_saudization: 0.72,
      projected_turnover: 0.07,
      budget_allocation: 2350000
    },
    {
      quarter: "Q4 2024",
      projected_headcount: 510,
      projected_saudization: 0.73,
      projected_turnover: 0.065,
      budget_allocation: 2420000
    }
  ];
}