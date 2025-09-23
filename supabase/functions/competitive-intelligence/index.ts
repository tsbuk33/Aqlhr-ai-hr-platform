import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { type, companyId } = await req.json();
    
    console.log('🔍 AqlHR: Processing competitive intelligence request', { type, companyId });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check user permissions
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin', 'executive'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let intelligenceData = {};

    switch (type) {
      case 'market_analysis':
        intelligenceData = await generateMarketAnalysis(companyId);
        break;
      case 'competitor_tracking':
        intelligenceData = await generateCompetitorTracking(companyId);
        break;
      case 'threat_assessment':
        intelligenceData = await generateThreatAssessment(companyId);
        break;
      case 'opportunity_mapping':
        intelligenceData = await generateOpportunityMapping(companyId);
        break;
      default:
        intelligenceData = await generateComprehensiveIntelligence(companyId);
    }

    // Log intelligence access
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        company_id: profile.company_id,
        action: 'INTELLIGENCE_ACCESS',
        table_name: 'competitive_intelligence',
        category: 'analytics',
        severity: 'info',
        user_role: profile.role,
        new_values: {
          intelligence_type: type,
          timestamp: new Date().toISOString(),
          source: 'executive_mobile_app'
        }
      });

    console.log('✅ AqlHR: Competitive intelligence generated successfully', { 
      type, 
      userId: user.id 
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: intelligenceData,
        generated_at: new Date().toISOString(),
        type,
        classification: 'confidential'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ AqlHR: Error in competitive-intelligence function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'COMPETITIVE_INTELLIGENCE_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateMarketAnalysis(companyId: string) {
  return {
    market_size: '$2.3T',
    growth_rate: 8.7,
    key_segments: [
      { name: 'Energy', size: '45%', growth: 12.3 },
      { name: 'Technology', size: '28%', growth: 18.7 },
      { name: 'Healthcare', size: '15%', growth: 9.2 },
      { name: 'Manufacturing', size: '12%', growth: 6.8 }
    ],
    trends: [
      'Digital transformation acceleration',
      'Sustainability focus increase', 
      'Government mega-projects expansion',
      'Foreign investment growth'
    ],
    regulatory_changes: [
      'New environmental compliance requirements',
      'Foreign ownership limit relaxations',
      'Digital nomad visa program launch',
      'Carbon tax implementation timeline'
    ]
  };
}

async function generateCompetitorTracking(companyId: string) {
  return {
    competitors: [
      {
        name: 'Saudi Aramco',
        market_share: 35.2,
        threat_level: 'critical',
        recent_moves: [
          { type: 'expansion', description: 'New refinery in Jazan', impact: 'high' },
          { type: 'partnership', description: 'Renewable energy alliance', impact: 'medium' }
        ],
        strengths: ['Market dominance', 'Government backing', 'Infrastructure'],
        weaknesses: ['Limited diversification', 'Oil dependency']
      },
      {
        name: 'SABIC',
        market_share: 18.7,
        threat_level: 'high',
        recent_moves: [
          { type: 'acquisition', description: 'Chemical company buyout', impact: 'medium' },
          { type: 'innovation', description: 'Sustainability initiative', impact: 'low' }
        ],
        strengths: ['Innovation capability', 'Global presence', 'R&D investment'],
        weaknesses: ['Price volatility exposure', 'Raw material costs']
      }
    ],
    market_dynamics: {
      consolidation_trend: 'increasing',
      new_entrants: 3,
      exit_rate: 1.2,
      innovation_pace: 'accelerating'
    }
  };
}

async function generateThreatAssessment(companyId: string) {
  return {
    threats: [
      {
        category: 'Economic',
        level: 'high',
        probability: 0.7,
        impact: 8.5,
        description: 'Global economic uncertainty affecting regional markets',
        mitigation: 'Diversify revenue streams and maintain cash reserves'
      },
      {
        category: 'Competitive',
        level: 'medium',
        probability: 0.6,
        impact: 6.2,
        description: 'New market entrants with disruptive technologies',
        mitigation: 'Accelerate innovation and strategic partnerships'
      },
      {
        category: 'Regulatory',
        level: 'medium',
        probability: 0.8,
        impact: 5.5,
        description: 'Changing environmental regulations',
        mitigation: 'Proactive compliance and sustainability investments'
      }
    ],
    overall_risk_score: 7.2,
    risk_trend: 'stable',
    recommended_actions: [
      'Strengthen market intelligence capabilities',
      'Develop scenario planning protocols',
      'Enhance competitive moats',
      'Build strategic partnerships'
    ]
  };
}

async function generateOpportunityMapping(companyId: string) {
  return {
    opportunities: [
      {
        category: 'Market Expansion',
        potential_value: '$150M',
        probability: 0.8,
        timeframe: '6-12 months',
        description: 'NEOM development projects',
        requirements: ['Strategic partnerships', 'Technology investment', 'Talent acquisition']
      },
      {
        category: 'Technology Innovation',
        potential_value: '$80M',
        probability: 0.6,
        timeframe: '12-18 months',
        description: 'AI and automation solutions',
        requirements: ['R&D investment', 'Skill development', 'Infrastructure']
      },
      {
        category: 'Sustainability',
        potential_value: '$120M',
        probability: 0.7,
        timeframe: '18-24 months',
        description: 'Green energy transition',
        requirements: ['Capital investment', 'Regulatory compliance', 'Market positioning']
      }
    ],
    strategic_priorities: [
      'Focus on Vision 2030 alignment',
      'Leverage government mega-projects',
      'Capitalize on digital transformation',
      'Build sustainability leadership'
    ]
  };
}

async function generateComprehensiveIntelligence(companyId: string) {
  const market = await generateMarketAnalysis(companyId);
  const competitors = await generateCompetitorTracking(companyId);
  const threats = await generateThreatAssessment(companyId);
  const opportunities = await generateOpportunityMapping(companyId);

  return {
    executive_summary: {
      market_position: 'Strong with growth potential',
      competitive_landscape: 'Intensifying with new entrants',
      risk_level: 'Moderate with manageable exposures',
      opportunity_score: 8.3,
      strategic_recommendation: 'Accelerate digital transformation while maintaining market leadership'
    },
    market_analysis: market,
    competitor_tracking: competitors,
    threat_assessment: threats,
    opportunity_mapping: opportunities,
    intelligence_confidence: 0.87,
    last_updated: new Date().toISOString()
  };
}