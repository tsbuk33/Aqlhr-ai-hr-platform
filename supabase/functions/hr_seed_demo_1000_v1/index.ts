import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    let tenantId: string;
    
    // Parse request body
    const body = await req.json().catch(() => ({}));
    const providedTenantId = body.tenantId;

    if (providedTenantId) {
      tenantId = providedTenantId;
    } else {
      // Try to resolve tenant from session
      if (authHeader) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        
        if (!authError && user) {
          // Look up company_id from profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (profile?.company_id) {
            tenantId = profile.company_id;
          }
        }
      }

      // Generate UUID if still no tenant
      if (!tenantId) {
        tenantId = crypto.randomUUID();
      }
    }

    console.log('Using tenant ID:', tenantId);

    // Check if already seeded (avoid duplicates)
    const { count: existingCount } = await supabase
      .from('hr_employees')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', tenantId);

    if (existingCount && existingCount >= 1000) {
      return new Response(JSON.stringify({
        success: true,
        message: `Already seeded with ${existingCount} employees`,
        tenantId,
        inserted: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting HR demo data seeding...');

    // 1. Insert 6 departments (Projects, Operations, Finance, HR, IT, HSE)
    const departments = [
      { name: 'Projects', code: 'PROJ' },
      { name: 'Operations', code: 'OPS' },
      { name: 'Finance', code: 'FIN' },
      { name: 'Human Resources', code: 'HR' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Health, Safety & Environment', code: 'HSE' }
    ];

    const { data: deptData } = await supabase.from('hr_departments').insert(
      departments.map(d => ({ company_id: tenantId, name: d.name, code: d.code }))
    ).select();

    // 2. Insert 10 jobs  
    const jobs = [
      'Manager', 'Senior Engineer', 'Engineer', 'Specialist', 'Coordinator',
      'Analyst', 'Technician', 'Administrator', 'Supervisor', 'Consultant'
    ];

    const { data: jobData } = await supabase.from('hr_jobs').insert(
      jobs.map(job => ({ company_id: tenantId, name: job }))
    ).select();

    // 3. Insert 5 grades
    const grades = [
      { name: 'Grade 1', level: 1 },
      { name: 'Grade 2', level: 2 },
      { name: 'Grade 3', level: 3 },
      { name: 'Grade 4', level: 4 },
      { name: 'Grade 5', level: 5 }
    ];

    const { data: gradeData } = await supabase.from('hr_grades').insert(
      grades.map(g => ({ company_id: tenantId, name: g.name, level: g.level }))
    ).select();

    // 4. Generate 1,000 employees with specified distribution
    console.log('Generating 1,000 employees with specified distributions...');
    const employees = [];
    const nonSaudiNationalities = ['EG', 'PH', 'IN', 'PK', 'SD', 'BD'];
    
    // Names for variety
    const maleNames = ['Ahmed', 'Mohammed', 'Abdullah', 'Omar', 'Khalid', 'Faisal', 'Saud', 'Bandar', 'Nasser', 'Turki'];
    const femaleNames = ['Fatima', 'Aisha', 'Sarah', 'Noura', 'Hala', 'Mona', 'Reem', 'Lina', 'Jana', 'Dina'];
    const surnames = ['Al-Ahmed', 'Al-Mohammed', 'Al-Omar', 'Al-Khalid', 'Al-Faisal', 'Al-Saud', 'Al-Rashid', 'Al-Malik', 'Al-Nasser', 'Al-Turki'];

    // Identify female-heavy departments (HR, Finance, IT)
    const femaleHeavyDepts = deptData?.filter(dept => 
      dept.name === 'Human Resources' || 
      dept.name === 'Finance' || 
      dept.name === 'Information Technology'
    ) || [];

    for (let i = 0; i < 1000; i++) {
      // Saudi distribution: 38-45%
      const saudiRate = 0.38 + Math.random() * 0.07; // 38-45%
      const isSaudi = Math.random() < saudiRate;
      const nationality = isSaudi ? 'SA' : nonSaudiNationalities[Math.floor(Math.random() * nonSaudiNationalities.length)];

      // Department assignment
      const department = deptData![Math.floor(Math.random() * deptData!.length)];
      const isFemaleHeavyDept = femaleHeavyDepts.some(d => d.id === department.id);
      
      // Gender distribution: 22-30% female (higher in HR/Finance/IT)
      const baseFemaleRate = 0.22 + Math.random() * 0.08; // 22-30%
      const femaleRate = isFemaleHeavyDept ? baseFemaleRate + 0.15 : baseFemaleRate; // Boost for female-heavy depts
      const isFemale = Math.random() < femaleRate;
      const gender = isFemale ? 'female' : 'male';

      // Generate names
      const firstName = isFemale 
        ? femaleNames[Math.floor(Math.random() * femaleNames.length)]
        : maleNames[Math.floor(Math.random() * maleNames.length)];
      const lastName = surnames[Math.floor(Math.random() * surnames.length)];

      // Hire dates: spread across last 6 years
      const hireDate = new Date();
      hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 6));
      hireDate.setMonth(Math.floor(Math.random() * 12));
      hireDate.setDate(Math.floor(Math.random() * 28) + 1);

      // Employment status: 96-98% active
      const activeRate = 0.96 + Math.random() * 0.02; // 96-98%
      const isActive = Math.random() < activeRate;
      const employmentStatus = isActive ? 'active' : 'terminated';

      // Iqama expiry for non-Saudis: 15-270 days ahead
      let iqamaExpiry = null;
      if (!isSaudi) {
        const daysAhead = 15 + Math.floor(Math.random() * (270 - 15));
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + daysAhead);
        iqamaExpiry = expiry.toISOString().split('T')[0];
      }

      // Generate employee
      const employee = {
        company_id: tenantId,
        employee_no: `AQL-${100000 + i}`,
        first_name: firstName,
        last_name: lastName,
        full_name_en: `${firstName} ${lastName}`,
        full_name_ar: `${firstName} ${lastName}`, // Simplified for demo
        gender,
        nationality,
        is_saudi: isSaudi,
        department_id: department.id,
        job_id: jobData![Math.floor(Math.random() * jobData!.length)].id,
        grade_id: gradeData![Math.floor(Math.random() * gradeData!.length)].id,
        hire_date: hireDate.toISOString().split('T')[0],
        employment_status: employmentStatus,
        iqama_expiry: iqamaExpiry
      };

      employees.push(employee);
    }

    // Insert employees in batches of 100
    let totalInserted = 0;
    for (let i = 0; i < employees.length; i += 100) {
      const batch = employees.slice(i, i + 100);
      const { data: batchResult } = await supabase
        .from('hr_employees')
        .insert(batch)
        .select('id');
      
      totalInserted += batchResult?.length || 0;
      console.log(`Inserted batch ${Math.floor(i / 100) + 1}/10 - Total: ${totalInserted}`);
    }

    console.log('All employees inserted. Computing KPIs...');

    // 5. Compute current KPIs
    const { error: kpiError } = await supabase.rpc('dashboard_compute_kpis_v1', {
      p_tenant: tenantId
    });

    if (kpiError) {
      console.error('KPI computation error:', kpiError);
    }

    console.log('KPIs computed. Starting backfill...');

    // 6. Backfill 365 days of data  
    const { error: backfillError } = await supabase.rpc('dashboard_backfill_v1', {
      p_tenant: tenantId,
      p_days: 365
    });

    if (backfillError) {
      console.error('Backfill error:', backfillError);
    }

    console.log('Demo data seeding completed successfully!');

    return new Response(JSON.stringify({
      success: true,
      tenantId,
      inserted: totalInserted,
      counts: {
        departments: departments.length,
        jobs: jobs.length,
        grades: grades.length,
        employees: totalInserted
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      tenantId: null,
      inserted: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});