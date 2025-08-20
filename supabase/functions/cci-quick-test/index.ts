import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { tenantId } = await req.json();

    console.log('Starting CCI Quick Test for tenant:', tenantId);

    // 1. Create a test survey
    const { data: survey, error: surveyError } = await supabaseClient
      .from('cci_surveys')
      .insert({
        tenant_id: tenantId,
        name: 'Quick Test Survey',
        description: 'Automated test survey for CCI system',
        status: 'active'
      })
      .select()
      .single();

    if (surveyError) throw surveyError;
    console.log('Created survey:', survey.id);

    // 2. Create a test wave
    const { data: wave, error: waveError } = await supabaseClient
      .from('cci_waves')
      .insert({
        tenant_id: tenantId,
        survey_id: survey.id,
        name: 'Wave 1',
        status: 'active'
      })
      .select()
      .single();

    if (waveError) throw waveError;
    console.log('Created wave:', wave.id);

    // 3. Generate 10 fake responses with balanced Likert scores
    const departments = ['HR', 'IT', 'Finance', 'Operations', 'Marketing'];
    const responses = [];

    for (let i = 0; i < 10; i++) {
      // Generate balanced Likert responses (1-7 scale)
      const likertAnswers: Record<string, number> = {};
      
      // CVF questions (balanced around 4-5 for realistic scores)
      for (let q = 1; q <= 16; q++) {
        likertAnswers[`cvf_${q}`] = Math.floor(Math.random() * 3) + 4; // 4-6 range
      }
      
      // Cultural Web questions
      for (let q = 1; q <= 18; q++) {
        likertAnswers[`web_${q}`] = Math.floor(Math.random() * 3) + 4; // 4-6 range
      }
      
      // Psychological Safety questions
      for (let q = 1; q <= 7; q++) {
        likertAnswers[`psych_${q}`] = Math.floor(Math.random() * 3) + 4; // 4-6 range
      }
      
      // Barrett Values (current and desired)
      const barrettAnswers = {
        current_values: ['achievement', 'stability', 'control'].slice(0, Math.floor(Math.random() * 3) + 1),
        desired_values: ['innovation', 'collaboration', 'transparency'].slice(0, Math.floor(Math.random() * 3) + 1)
      };

      const response = {
        tenant_id: tenantId,
        survey_id: survey.id,
        wave_id: wave.id,
        respondent_hash: `test_${i}_${Date.now()}`,
        answers: {
          ...likertAnswers,
          ...barrettAnswers
        },
        duration_seconds: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        department_id: null, // We'll use a simple department string
        nationality: Math.random() > 0.5 ? 'saudi' : 'non_saudi',
        gender: Math.random() > 0.5 ? 'male' : 'female'
      };

      responses.push(response);
    }

    // Insert all responses
    const { error: responsesError } = await supabaseClient
      .from('cci_responses')
      .insert(responses);

    if (responsesError) throw responsesError;
    console.log('Created 10 fake responses');

    // 4. Run score computation
    const { error: computeError } = await supabaseClient.rpc('cci_compute_scores_v1', {
      p_tenant: tenantId,
      p_survey: survey.id,
      p_wave: wave.id
    });

    if (computeError) throw computeError;
    console.log('Computed scores successfully');

    return new Response(JSON.stringify({
      success: true,
      surveyId: survey.id,
      waveId: wave.id,
      message: 'CCI Quick Test completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in CCI Quick Test:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});