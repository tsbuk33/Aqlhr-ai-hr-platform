import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KPIRegistration {
  module_name: string;
  category: string;
  kpis: Array<{
    name: string;
    order: number;
    target_value?: number;
    unit?: string;
  }>;
}

interface KPIMeasurement {
  module_name: string;
  kpi_name: string;
  value: number;
  source?: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'register-module-kpis':
        return await registerModuleKPIs(req, supabase);
      case 'record-measurement':
        return await recordKPIMeasurement(req, supabase);
      case 'bulk-register':
        return await bulkRegisterModules(req, supabase);
      case 'sync-kpi-data':
        return await syncKPIData(req, supabase);
      case 'get-module-performance':
        return await getModulePerformance(req, supabase);
      case 'calculate-scores':
        return await calculatePerformanceScores(req, supabase);
      default:
        throw new Error('Invalid endpoint');
    }
  } catch (error) {
    console.error('Error in kpi-engine function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function registerModuleKPIs(req: Request, supabase: any) {
  const { module_name, category, company_id, kpis }: KPIRegistration & { company_id: string } = await req.json();
  
  // Get or create category
  let { data: categoryData, error: categoryError } = await supabase
    .from('module_categories')
    .select('id')
    .eq('name', category)
    .single();

  if (categoryError) {
    const { data: newCategory, error: createCategoryError } = await supabase
      .from('module_categories')
      .insert({ name: category, description: `${category} modules` })
      .select('id')
      .single();
    
    if (createCategoryError) throw createCategoryError;
    categoryData = newCategory;
  }

  // Create or update module
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .upsert({
      category_id: categoryData.id,
      company_id,
      name: module_name,
      description: `${module_name} module for performance tracking`
    })
    .select('id')
    .single();

  if (moduleError) throw moduleError;

  // Register KPIs
  const kpiInserts = kpis.map(kpi => ({
    module_id: moduleData.id,
    kpi_name: kpi.name,
    kpi_order: kpi.order,
    target_value: kpi.target_value,
    unit: kpi.unit || 'value'
  }));

  const { error: kpiError } = await supabase
    .from('module_kpis')
    .upsert(kpiInserts, { onConflict: 'module_id,kpi_order' });

  if (kpiError) throw kpiError;

  console.log(`Registered ${kpis.length} KPIs for module: ${module_name}`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      module_id: moduleData.id,
      registered_kpis: kpis.length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function recordKPIMeasurement(req: Request, supabase: any) {
  const { module_name, kpi_name, value, source = 'ai_sync', notes, company_id }: KPIMeasurement & { company_id: string } = await req.json();

  // Find the KPI
  const { data: kpiData, error: kpiError } = await supabase
    .from('module_kpis')
    .select(`
      id,
      modules!inner(
        id,
        name,
        company_id
      )
    `)
    .eq('modules.name', module_name)
    .eq('modules.company_id', company_id)
    .eq('kpi_name', kpi_name)
    .single();

  if (kpiError) throw new Error(`KPI not found: ${kpi_name} in module ${module_name}`);

  // Record measurement
  const { data: measurement, error: measurementError } = await supabase
    .from('kpi_measurements')
    .insert({
      kpi_id: kpiData.id,
      measured_value: value,
      measurement_source: source,
      notes
    })
    .select()
    .single();

  if (measurementError) throw measurementError;

  // Update current value in KPI
  await supabase
    .from('module_kpis')
    .update({ current_value: value })
    .eq('id', kpiData.id);

  console.log(`Recorded measurement: ${kpi_name} = ${value} for ${module_name}`);

  return new Response(
    JSON.stringify({ 
      success: true, 
      measurement_id: measurement.id,
      value: value 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function bulkRegisterModules(req: Request, supabase: any) {
  const { modules, company_id } = await req.json();
  const results = [];

  for (const moduleData of modules) {
    try {
      const response = await registerModuleKPIs(
        new Request('https://dummy.url/register-module-kpis', {
          method: 'POST',
          body: JSON.stringify({ ...moduleData, company_id })
        }),
        supabase
      );
      
      const result = await response.json();
      results.push({ module: moduleData.module_name, success: true, ...result });
    } catch (error) {
      results.push({ 
        module: moduleData.module_name, 
        success: false, 
        error: error.message 
      });
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true,
      results,
      total_modules: modules.length,
      successful: results.filter(r => r.success).length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncKPIData(req: Request, supabase: any) {
  const { company_id } = await req.json();

  // Simulate AI sync process - collect metrics from various sources
  const syncMetrics = [
    { module: 'AI Sync Engine', kpi: 'Sync Accuracy %', value: 99.2 },
    { module: 'AI Sync Engine', kpi: 'Latency (ms)', value: 45 },
    { module: 'AI Sync Engine', kpi: 'Failed Events', value: 3 },
    { module: 'Employee Management', kpi: 'Total Active Employees', value: 245 },
    { module: 'Employee Management', kpi: 'Attrition Rate', value: 8.5 },
    { module: 'Employee Management', kpi: 'Data Completeness %', value: 97.8 },
    { module: 'Payroll Processing (WPS)', kpi: 'Payroll Processing (WPS) Performance Score', value: 94.5 },
    { module: 'Payroll Processing (WPS)', kpi: 'Payroll Processing (WPS) Compliance %', value: 100 },
    { module: 'Payroll Processing (WPS)', kpi: 'Payroll Processing (WPS) Efficiency Index', value: 89.2 }
  ];

  const syncResults = [];

  for (const metric of syncMetrics) {
    try {
      const response = await recordKPIMeasurement(
        new Request('https://dummy.url/record-measurement', {
          method: 'POST',
          body: JSON.stringify({
            module_name: metric.module,
            kpi_name: metric.kpi,
            value: metric.value,
            source: 'ai_sync',
            notes: 'Automated sync measurement',
            company_id
          })
        }),
        supabase
      );
      
      const result = await response.json();
      syncResults.push({ ...metric, success: true });
    } catch (error) {
      syncResults.push({ ...metric, success: false, error: error.message });
    }
  }

  console.log(`KPI sync completed for company ${company_id}: ${syncResults.filter(r => r.success).length}/${syncResults.length} metrics updated`);

  return new Response(
    JSON.stringify({ 
      success: true,
      sync_results: syncResults,
      sync_timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getModulePerformance(req: Request, supabase: any) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');
  const moduleId = url.searchParams.get('module_id');

  let query = supabase
    .from('modules')
    .select(`
      id,
      name,
      name_ar,
      category_id,
      module_categories(name, name_ar),
      module_kpis(
        id,
        kpi_name,
        kpi_order,
        current_value,
        target_value,
        unit,
        kpi_measurements(
          measured_value,
          measurement_date,
          measurement_source
        )
      )
    `)
    .eq('company_id', companyId)
    .eq('is_active', true);

  if (moduleId) {
    query = query.eq('id', moduleId);
  }

  const { data: modules, error } = await query;

  if (error) throw error;

  return new Response(
    JSON.stringify({ modules }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculatePerformanceScores(req: Request, supabase: any) {
  const { company_id } = await req.json();

  // Get all modules with their KPIs for the company
  const { data: modules, error: moduleError } = await supabase
    .from('modules')
    .select(`
      id,
      name,
      module_kpis(
        id,
        kpi_name,
        current_value,
        target_value,
        unit
      )
    `)
    .eq('company_id', company_id)
    .eq('is_active', true);

  if (moduleError) throw moduleError;

  const performanceScores = modules.map(module => {
    const kpiScores = module.module_kpis.map(kpi => {
      if (!kpi.current_value || !kpi.target_value) return null;
      
      // Calculate score based on KPI type
      let score = 0;
      if (kpi.unit === '%' || kpi.kpi_name.includes('Accuracy') || kpi.kpi_name.includes('Compliance')) {
        score = Math.min(100, (kpi.current_value / kpi.target_value) * 100);
      } else if (kpi.kpi_name.includes('Latency') || kpi.kpi_name.includes('Time')) {
        // Lower is better for latency/time metrics
        score = Math.max(0, 100 - ((kpi.current_value / kpi.target_value) * 100));
      } else {
        score = (kpi.current_value / kpi.target_value) * 100;
      }
      
      return {
        kpi_name: kpi.kpi_name,
        score: Math.round(score * 100) / 100,
        current_value: kpi.current_value,
        target_value: kpi.target_value
      };
    }).filter(Boolean);

    const overallScore = kpiScores.length > 0 
      ? kpiScores.reduce((sum, kpi) => sum + kpi.score, 0) / kpiScores.length
      : 0;

    return {
      module_id: module.id,
      module_name: module.name,
      overall_score: Math.round(overallScore * 100) / 100,
      kpi_scores: kpiScores,
      performance_grade: getPerformanceGrade(overallScore)
    };
  });

  return new Response(
    JSON.stringify({ 
      company_id,
      performance_scores: performanceScores,
      calculated_at: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function getPerformanceGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 65) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}