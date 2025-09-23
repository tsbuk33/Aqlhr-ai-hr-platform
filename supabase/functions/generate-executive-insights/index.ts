import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 Generate Executive Insights Function called');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { executiveId, metrics, analysisType } = await req.json();

    console.log('📊 Generating insights for executive:', executiveId);
    console.log('📈 Analysis type:', analysisType);
    console.log('🔢 Metrics count:', metrics?.length || 0);

    // Simulate AI analysis processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate insights based on metrics
    const insights = [];

    // Analyze workforce metrics
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0];
      
      // Turnover analysis
      if (latestMetric.turnover_rate > 5) {
        insights.push({
          executive_id: executiveId,
          title: 'High Turnover Rate Alert',
          description: `Current turnover rate of ${latestMetric.turnover_rate}% exceeds industry benchmark. Immediate action recommended.`,
          insight_type: 'workforce',
          priority: 'high',
          actionable: true,
          confidence_score: 92,
          impact_description: 'High turnover increases recruitment costs and affects team productivity',
          recommendations: [
            'Conduct exit interviews to identify root causes',
            'Review compensation and benefits package',
            'Implement employee retention programs',
            'Improve management training and support'
          ],
          status: 'active'
        });
      }

      // Saudization analysis
      if (latestMetric.saudization_ratio < 75) {
        insights.push({
          executive_id: executiveId,
          title: 'Saudization Compliance Risk',
          description: `Current Saudization ratio of ${latestMetric.saudization_ratio}% is below optimal levels. Risk of moving to Yellow category.`,
          insight_type: 'compliance',
          priority: 'high',
          actionable: true,
          confidence_score: 88,
          impact_description: 'Low Saudization ratio may result in penalties and loss of government incentives',
          recommendations: [
            'Prioritize Saudi national hiring',
            'Implement Saudization training programs',
            'Partner with local universities for talent pipeline',
            'Review visa and work permit policies'
          ],
          status: 'active'
        });
      } else if (latestMetric.saudization_ratio > 75) {
        insights.push({
          executive_id: executiveId,
          title: 'Strong Saudization Performance',
          description: `Excellent Saudization ratio of ${latestMetric.saudization_ratio}%. Company maintains Green status with potential for incentives.`,
          insight_type: 'compliance',
          priority: 'medium',
          actionable: false,
          confidence_score: 95,
          impact_description: 'Strong compliance position supports business growth and government partnerships',
          recommendations: [
            'Maintain current hiring practices',
            'Apply for additional government incentives',
            'Share best practices across organization'
          ],
          status: 'active'
        });
      }

      // Cost analysis
      if (latestMetric.cost_per_employee && latestMetric.average_salary) {
        const costEfficiencyRatio = latestMetric.cost_per_employee / latestMetric.average_salary;
        if (costEfficiencyRatio > 1.2) {
          insights.push({
            executive_id: executiveId,
            title: 'Cost Optimization Opportunity',
            description: `Cost per employee is ${(costEfficiencyRatio * 100 - 100).toFixed(1)}% higher than average salary. Optimization potential identified.`,
            insight_type: 'finance',
            priority: 'medium',
            actionable: true,
            confidence_score: 85,
            impact_description: 'Optimizing cost structure can improve profitability by 8-12%',
            recommendations: [
              'Review indirect costs and overhead allocation',
              'Optimize benefits and perks structure',
              'Implement process automation',
              'Evaluate third-party service contracts'
            ],
            status: 'active'
          });
        }
      }

      // Vision 2030 analysis
      if (latestMetric.vision_2030_score) {
        if (latestMetric.vision_2030_score < 80) {
          insights.push({
            executive_id: executiveId,
            title: 'Vision 2030 Alignment Opportunity',
            description: `Current Vision 2030 score of ${latestMetric.vision_2030_score}% suggests room for improvement in strategic alignment.`,
            insight_type: 'strategy',
            priority: 'medium',
            actionable: true,
            confidence_score: 78,
            impact_description: 'Better alignment with Vision 2030 opens new business opportunities and partnerships',
            recommendations: [
              'Develop sustainability initiatives',
              'Increase local content percentage',
              'Invest in digital transformation',
              'Partner with Vision 2030 aligned organizations'
            ],
            status: 'active'
          });
        }
      }
    }

    // Add strategic insights regardless of metrics
    insights.push({
      executive_id: executiveId,
      title: 'Digital Transformation Readiness',
      description: 'AI analysis suggests high potential for digital transformation initiatives to improve operational efficiency.',
      insight_type: 'strategy',
      priority: 'medium',
      actionable: true,
      confidence_score: 82,
      impact_description: 'Digital transformation can reduce operational costs by 15-25% and improve employee satisfaction',
      recommendations: [
        'Conduct digital maturity assessment',
        'Implement cloud-first strategy',
        'Invest in employee digital skills training',
        'Establish innovation labs and pilot programs'
      ],
      status: 'active'
    });

    // Insert insights into database
    if (insights.length > 0) {
      const { data: insertedInsights, error: insertError } = await supabaseClient
        .from('ai_insights')
        .insert(insights)
        .select();

      if (insertError) {
        console.error('❌ Failed to insert insights:', insertError);
        throw insertError;
      }

      console.log(`✅ Generated ${insights.length} executive insights successfully`);
      
      return new Response(
        JSON.stringify({
          success: true,
          insights: insertedInsights,
          count: insights.length,
          message: 'Executive insights generated successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          insights: [],
          count: 0,
          message: 'No actionable insights generated at this time'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

  } catch (error) {
    console.error('💥 Generate Executive Insights Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to generate executive insights'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});