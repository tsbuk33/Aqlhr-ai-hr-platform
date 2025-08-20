import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, surveyId, waveId } = await req.json();
    
    console.log(`Seeding demo wave for tenant: ${tenantId}, survey: ${surveyId}, wave: ${waveId}`);

    // Get demo employees for demographics
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, department, gender, is_saudi, nationality, job_level')
      .eq('company_id', tenantId)
      .limit(1000);

    if (empError) {
      console.error('Error fetching employees:', empError);
      throw new Error('Failed to fetch demo employees');
    }

    if (!employees || employees.length === 0) {
      throw new Error('No demo employees found for this tenant');
    }

    console.log(`Found ${employees.length} demo employees`);

    // Generate 300+ responses with realistic distributions
    const targetResponses = Math.max(300, Math.min(employees.length, 350));
    const responses = [];

    // Predefined departments and projects for demo
    const demoDepartments = [
      'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 
      'Operations', 'Customer Success', 'Product', 'Legal', 'IT'
    ];
    
    const demoProjects = [
      'Digital Transformation', 'Customer Experience', 'Process Optimization',
      'Innovation Lab', 'Quality Assurance', 'Market Expansion', 
      'Operational Excellence', 'Strategic Planning'
    ];

    const grades = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director'];

    for (let i = 0; i < targetResponses; i++) {
      const employee = employees[i % employees.length];
      
      // Generate realistic CCI answers targeting specific KPI ranges
      const answers = generateCCIAnswers({
        psychSafetyTarget: 68 + Math.random() * 6, // 68-74
        valuesAlignmentTarget: 72 + Math.random() * 8, // 72-80
        balanceTarget: 72 + Math.random() * 6, // 72-78
        riskTarget: 25 + Math.random() * 10, // 25-35
        cvfTilt: 'hierarchy_market' // Hierarchy + Market orientation
      });

      const response = {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        survey_id: surveyId,
        wave_id: waveId,
        created_by: null, // Anonymous
        department_id: crypto.randomUUID(), // Mock department ID
        project_id: Math.random() > 0.7 ? crypto.randomUUID() : null, // 30% have projects
        grade_id: crypto.randomUUID(), // Mock grade ID
        submitted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        answers: answers,
        duration_seconds: Math.floor(300 + Math.random() * 900), // 5-20 minutes
        is_flagged: Math.random() < 0.02, // 2% flagged for quality
        respondent_hash: `demo_${i}_${Date.now()}`,
        nationality: employee.nationality || (employee.is_saudi ? 'Saudi' : 'Non-Saudi'),
        gender: employee.gender || (Math.random() > 0.6 ? 'male' : 'female'),
        flag_reason: Math.random() < 0.02 ? 'Too fast completion' : null
      };

      responses.push(response);
    }

    // Insert responses in batches
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < responses.length; i += batchSize) {
      const batch = responses.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('cci_responses')
        .insert(batch);

      if (insertError) {
        console.error('Error inserting batch:', insertError);
        throw new Error(`Failed to insert responses batch: ${insertError.message}`);
      }

      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${responses.length} responses`);
    }

    // Compute scores after seeding
    console.log('Computing CCI scores...');
    const { data: scoreData, error: scoreError } = await supabase
      .rpc('cci_compute_scores_v1', {
        p_tenant: tenantId,
        p_survey: surveyId,
        p_wave: waveId
      });

    if (scoreError) {
      console.error('Error computing scores:', scoreError);
      // Don't throw - responses were inserted successfully
    }

    console.log(`Successfully seeded ${insertedCount} CCI responses and computed scores`);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully seeded ${insertedCount} CCI responses`,
      responses_created: insertedCount,
      scores_computed: !scoreError,
      score_data: scoreData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cci-seed-demo-wave-v1 function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateCCIAnswers(targets: {
  psychSafetyTarget: number;
  valuesAlignmentTarget: number;
  balanceTarget: number;
  riskTarget: number;
  cvfTilt: string;
}) {
  // Generate 60 CCI instrument answers (typical CCI has ~60 questions)
  const answers: Record<string, any> = {};
  
  // Psychological Safety questions (Q1-15) - Target 68-74%
  for (let i = 1; i <= 15; i++) {
    const baseScore = targets.psychSafetyTarget / 100;
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    const score = Math.max(1, Math.min(5, Math.round((baseScore + variance) * 5)));
    answers[`ps_${i}`] = score;
  }

  // Values Alignment questions (Q16-30) - Target 72-80%
  for (let i = 16; i <= 30; i++) {
    const baseScore = targets.valuesAlignmentTarget / 100;
    const variance = (Math.random() - 0.5) * 0.25;
    const score = Math.max(1, Math.min(5, Math.round((baseScore + variance) * 5)));
    answers[`va_${i}`] = score;
  }

  // CVF questions (Q31-45) - Hierarchy + Market tilt
  for (let i = 31; i <= 45; i++) {
    let score;
    if (i <= 37) { // Hierarchy questions
      score = Math.round(3.5 + Math.random() * 1.5); // Tilt toward hierarchy (4-5)
    } else if (i <= 41) { // Market questions  
      score = Math.round(3.2 + Math.random() * 1.8); // Strong market orientation
    } else { // Clan/Adhocracy questions
      score = Math.round(2 + Math.random() * 2); // Lower scores
    }
    answers[`cvf_${i}`] = Math.max(1, Math.min(5, score));
  }

  // Cultural Web questions (Q46-60) - Balanced with slight risk bias
  for (let i = 46; i <= 60; i++) {
    const baseScore = (100 - targets.riskTarget) / 100; // Inverse of risk
    const variance = (Math.random() - 0.5) * 0.4;
    const score = Math.max(1, Math.min(5, Math.round((baseScore + variance) * 5)));
    answers[`cw_${i}`] = score;
  }

  return answers;
}