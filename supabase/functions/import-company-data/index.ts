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

    // Almalaz Company Data - Premium real estate and development company
    const almalazCompanyData = [
      {
        company_id: "ALMALAZ_001",
        company_name_en: "Almalaz Real Estate Development Company",
        company_name_ar: "شركة الملاز للتطوير العقاري",
        company_type: "Private",
        sector_primary: "Real Estate Development",
        total_employees: 2450,
        saudization_rate: 78.5,
        contract_potential_score: 8.8,
        nitaqat_color: "Green",
        confidence_score: 9.2
      },
      {
        company_id: "ALMALAZ_CONSTRUCTION_001",
        company_name_en: "Almalaz Construction & Engineering",
        company_name_ar: "شركة الملاز للإنشاءات والهندسة",
        company_type: "Private",
        sector_primary: "Construction",
        total_employees: 1850,
        saudization_rate: 72.3,
        contract_potential_score: 8.4,
        nitaqat_color: "Green",
        confidence_score: 8.9
      },
      {
        company_id: "ALMALAZ_FACILITIES_001",
        company_name_en: "Almalaz Facilities Management",
        company_name_ar: "شركة الملاز لإدارة المرافق",
        company_type: "Private",
        sector_primary: "Facilities Management",
        total_employees: 3200,
        saudization_rate: 82.1,
        contract_potential_score: 7.9,
        nitaqat_color: "Green",
        confidence_score: 8.7
      },
      {
        company_id: "ALMALAZ_HOSPITALITY_001",
        company_name_en: "Almalaz Hospitality Group",
        company_name_ar: "مجموعة الملاز للضيافة",
        company_type: "Private",
        sector_primary: "Hospitality",
        total_employees: 1420,
        saudization_rate: 75.8,
        contract_potential_score: 8.2,
        nitaqat_color: "Green",
        confidence_score: 8.8
      },
      {
        company_id: "ALMALAZ_RETAIL_001",
        company_name_en: "Almalaz Retail & Commercial Centers",
        company_name_ar: "شركة الملاز للمراكز التجارية والتجزئة",
        company_type: "Private",
        sector_primary: "Retail",
        total_employees: 980,
        saudization_rate: 79.4,
        contract_potential_score: 7.6,
        nitaqat_color: "Green",
        confidence_score: 8.5
      }
    ];

    // Insert Almalaz company data with conflict handling
    const { data, error } = await supabaseClient
      .from('company_intelligence')
      .upsert(almalazCompanyData, { 
        onConflict: 'company_id',
        ignoreDuplicates: false 
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Almalaz company intelligence data imported successfully!',
        count: almalazCompanyData.length 
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