import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
    )

    // Sample companies data
    const sampleCompanies = [
      {
        company_id: "ARAMCO_001",
        company_name_en: "Saudi Arabian Oil Company (Aramco)",
        company_name_ar: "شركة أرامكو السعودية",
        company_type: "Public",
        sector_primary: "Energy",
        total_employees: 76418,
        saudization_rate: 80.5,
        contract_potential_score: 9.2,
        nitaqat_color: "Green",
        confidence_score: 9.8
      },
      {
        company_id: "ALRAJHI_001", 
        company_name_en: "Al Rajhi Banking and Investment Corporation",
        company_name_ar: "مصرف الراجحي",
        company_type: "Public",
        sector_primary: "Banking",
        total_employees: 12500,
        saudization_rate: 85.2,
        contract_potential_score: 8.7,
        nitaqat_color: "Green",
        confidence_score: 9.5
      },
      {
        company_id: "SNB_001",
        company_name_en: "The Saudi National Bank",
        company_name_ar: "البنك الأهلي السعودي",
        company_type: "Public", 
        sector_primary: "Banking",
        total_employees: 15000,
        saudization_rate: 82.1,
        contract_potential_score: 8.9,
        nitaqat_color: "Green",
        confidence_score: 9.3
      },
      {
        company_id: "MAADEN_001",
        company_name_en: "Saudi Arabian Mining Company (Ma'aden)",
        company_name_ar: "شركة التعدين العربية السعودية (معادن)",
        company_type: "Public",
        sector_primary: "Mining",
        total_employees: 8500,
        saudization_rate: 75.8,
        contract_potential_score: 7.8,
        nitaqat_color: "Yellow",
        confidence_score: 8.9
      },
      {
        company_id: "STC_001",
        company_name_en: "Saudi Telecom Company",
        company_name_ar: "شركة الاتصالات السعودية",
        company_type: "Public",
        sector_primary: "Telecommunications",
        total_employees: 18000,
        saudization_rate: 78.3,
        contract_potential_score: 8.1,
        nitaqat_color: "Green",
        confidence_score: 9.1
      }
    ];

    // Insert sample data with conflict handling
    const { data, error } = await supabaseClient
      .from('company_intelligence')
      .upsert(sampleCompanies, { 
        onConflict: 'company_id',
        ignoreDuplicates: false 
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sample company intelligence data imported successfully!',
        count: sampleCompanies.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})