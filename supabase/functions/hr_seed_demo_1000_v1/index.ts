import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  console.log('HR Seed Demo 1000 v1 function called');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { tenantId } = await req.json();
    
    console.log('Seeding HR demo data for tenant:', tenantId);

    // Check if already seeded (≥1000 employees)
    const { count: existingCount } = await supabase
      .from('hr_employees')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    if (existingCount && existingCount >= 1000) {
      console.log('Already seeded with', existingCount, 'employees');
      return new Response(JSON.stringify({
        success: true,
        message: `Already seeded with ${existingCount} employees`,
        counts: { employees: existingCount }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting HR data seeding...');

    // 1. Create departments
    const departments = [
      { code: 'IT', name_en: 'Information Technology', name_ar: 'تقنية المعلومات' },
      { code: 'HR', name_en: 'Human Resources', name_ar: 'الموارد البشرية' },
      { code: 'FIN', name_en: 'Finance', name_ar: 'المالية' },
      { code: 'OPS', name_en: 'Operations', name_ar: 'العمليات' },
      { code: 'SALES', name_en: 'Sales', name_ar: 'المبيعات' },
      { code: 'MKT', name_en: 'Marketing', name_ar: 'التسويق' },
      { code: 'ENG', name_en: 'Engineering', name_ar: 'الهندسة' },
      { code: 'QA', name_en: 'Quality Assurance', name_ar: 'ضمان الجودة' },
      { code: 'SUPPORT', name_en: 'Customer Support', name_ar: 'دعم العملاء' },
      { code: 'ADMIN', name_en: 'Administration', name_ar: 'الإدارة' },
      { code: 'LEGAL', name_en: 'Legal', name_ar: 'الشؤون القانونية' },
      { code: 'PROCUREMENT', name_en: 'Procurement', name_ar: 'المشتريات' }
    ];

    const { data: deptData } = await supabase.from('hr_departments').insert(
      departments.map(d => ({ ...d, tenant_id: tenantId }))
    ).select();
    console.log('Created departments:', deptData?.length);

    // 2. Create locations
    const locations = [
      { name_en: 'Riyadh HQ', name_ar: 'الرياض - المقر الرئيسي' },
      { name_en: 'Jeddah Branch', name_ar: 'جدة - الفرع' },
      { name_en: 'Dammam Office', name_ar: 'الدمام - المكتب' },
      { name_en: 'Remote', name_ar: 'عن بُعد' }
    ];

    const { data: locationData } = await supabase.from('hr_locations').insert(
      locations.map(l => ({ ...l, tenant_id: tenantId }))
    ).select();
    console.log('Created locations:', locationData?.length);

    // 3. Create grades
    const grades = [
      { code: 'L1', min_salary: 3000, max_salary: 5000 },
      { code: 'L2', min_salary: 5000, max_salary: 8000 },
      { code: 'L3', min_salary: 8000, max_salary: 12000 },
      { code: 'L4', min_salary: 12000, max_salary: 18000 },
      { code: 'L5', min_salary: 18000, max_salary: 25000 },
      { code: 'L6', min_salary: 25000, max_salary: 35000 },
      { code: 'M1', min_salary: 35000, max_salary: 50000 },
      { code: 'M2', min_salary: 50000, max_salary: 70000 },
      { code: 'E1', min_salary: 70000, max_salary: 100000 }
    ];

    const { data: gradeData } = await supabase.from('hr_grades').insert(
      grades.map(g => ({ ...g, tenant_id: tenantId }))
    ).select();
    console.log('Created grades:', gradeData?.length);

    // 4. Create job titles
    const jobs = [
      { code: 'DEV_JR', title_en: 'Junior Developer', title_ar: 'مطور مبتدئ', family: 'Engineering' },
      { code: 'DEV_SR', title_en: 'Senior Developer', title_ar: 'مطور أول', family: 'Engineering' },
      { code: 'DEV_LEAD', title_en: 'Development Lead', title_ar: 'قائد التطوير', family: 'Engineering' },
      { code: 'QA_ENG', title_en: 'QA Engineer', title_ar: 'مهندس ضمان جودة', family: 'Engineering' },
      { code: 'SYS_ADMIN', title_en: 'System Administrator', title_ar: 'مدير أنظمة', family: 'IT' },
      { code: 'HR_SPEC', title_en: 'HR Specialist', title_ar: 'أخصائي موارد بشرية', family: 'HR' },
      { code: 'HR_MGR', title_en: 'HR Manager', title_ar: 'مدير موارد بشرية', family: 'HR' },
      { code: 'ACCOUNTANT', title_en: 'Accountant', title_ar: 'محاسب', family: 'Finance' },
      { code: 'FIN_ANALYST', title_en: 'Financial Analyst', title_ar: 'محلل مالي', family: 'Finance' },
      { code: 'SALES_REP', title_en: 'Sales Representative', title_ar: 'ممثل مبيعات', family: 'Sales' },
      { code: 'SALES_MGR', title_en: 'Sales Manager', title_ar: 'مدير مبيعات', family: 'Sales' },
      { code: 'MKT_SPEC', title_en: 'Marketing Specialist', title_ar: 'أخصائي تسويق', family: 'Marketing' },
      { code: 'PROJ_MGR', title_en: 'Project Manager', title_ar: 'مدير مشروع', family: 'Management' },
      { code: 'SUPPORT_AGT', title_en: 'Support Agent', title_ar: 'وكيل دعم', family: 'Support' },
      { code: 'ADMIN_ASST', title_en: 'Administrative Assistant', title_ar: 'مساعد إداري', family: 'Administration' }
    ];

    const { data: jobData } = await supabase.from('hr_jobs').insert(
      jobs.map(j => ({ ...j, tenant_id: tenantId }))
    ).select();
    console.log('Created jobs:', jobData?.length);

    // 5. Generate 1,000 employees
    console.log('Generating 1,000 employees...');
    const employees = [];
    const nationalities = ['SA', 'EG', 'IN', 'PH', 'BD', 'PK', 'JO', 'SY'];
    const nationalityWeights = [68, 8, 6, 5, 4, 4, 3, 2]; // SA dominates

    for (let i = 1; i <= 1000; i++) {
      // Nationality selection (weighted random)
      const rand = Math.random() * 100;
      let cumulative = 0;
      let nationality = 'SA';
      for (let j = 0; j < nationalityWeights.length; j++) {
        cumulative += nationalityWeights[j];
        if (rand <= cumulative) {
          nationality = nationalities[j];
          break;
        }
      }

      const isSaudi = nationality === 'SA';
      const isMale = Math.random() < 0.82; // 82% male, 18% female
      
      // Generate hire date (last 10 years)
      const hireDate = new Date();
      hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 10));
      hireDate.setMonth(Math.floor(Math.random() * 12));
      hireDate.setDate(Math.floor(Math.random() * 28) + 1);

      // 5-8% terminated
      const isTerminated = Math.random() < 0.065;
      let terminationDate = null;
      if (isTerminated) {
        terminationDate = new Date(hireDate);
        terminationDate.setDate(terminationDate.getDate() + Math.floor(Math.random() * 1000));
      }

      // Random selections
      const dept = deptData?.[Math.floor(Math.random() * deptData.length)];
      const job = jobData?.[Math.floor(Math.random() * jobData.length)];
      const grade = gradeData?.[Math.floor(Math.random() * gradeData.length)];
      const location = locationData?.[Math.floor(Math.random() * locationData.length)];

      // Generate names
      const arabicNames = ['أحمد', 'فاطمة', 'محمد', 'عائشة', 'علي', 'زينب', 'عبدالله', 'مريم'];
      const englishNames = ['Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Ali', 'Zainab', 'Abdullah', 'Maryam'];
      const randomNameIndex = Math.floor(Math.random() * arabicNames.length);

      employees.push({
        tenant_id: tenantId,
        employee_no: `EMP${i.toString().padStart(4, '0')}`,
        full_name_en: englishNames[randomNameIndex] + ' Al-' + (isSaudi ? 'Saudi' : nationality),
        full_name_ar: arabicNames[randomNameIndex] + ' آل ' + (isSaudi ? 'السعودي' : nationality),
        gender: isMale ? 'M' : 'F',
        nationality_code: nationality,
        is_saudi: isSaudi,
        hire_date: hireDate.toISOString().split('T')[0],
        termination_date: terminationDate ? terminationDate.toISOString().split('T')[0] : null,
        dept_id: dept?.id,
        job_id: job?.id,
        grade_id: grade?.id,
        location_id: location?.id,
        employment_status: isTerminated ? 'terminated' : 'active',
        base_salary: Math.floor(Math.random() * 50000) + 5000,
        allowances: Math.floor(Math.random() * 5000),
        iqama_expiry: !isSaudi ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0] : null
      });
    }

    // Insert employees in batches
    const batchSize = 100;
    let totalEmployees = 0;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      const { data: empBatch } = await supabase.from('hr_employees').insert(batch).select('id');
      totalEmployees += empBatch?.length || 0;
      console.log(`Inserted employees batch ${Math.floor(i / batchSize) + 1}`);
    }

    // 6. Generate sample activity data
    console.log('Generating activity data...');

    // Attendance (last 60 workdays)
    const activeEmployees = await supabase
      .from('hr_employees')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('employment_status', 'active')
      .limit(500); // Sample for performance

    if (activeEmployees.data) {
      const attendanceRecords = [];
      for (let i = 0; i < 60; i++) {
        const workDate = new Date();
        workDate.setDate(workDate.getDate() - i);
        // Skip weekends
        if (workDate.getDay() === 5 || workDate.getDay() === 6) continue;

        activeEmployees.data.forEach(emp => {
          attendanceRecords.push({
            tenant_id: tenantId,
            employee_id: emp.id,
            work_date: workDate.toISOString().split('T')[0],
            tardy_minutes: Math.random() < 0.1 ? Math.floor(Math.random() * 30) : 0,
            overtime_minutes: Math.random() < 0.3 ? Math.floor(Math.random() * 120) : 0
          });
        });
      }

      // Insert attendance in batches
      for (let i = 0; i < attendanceRecords.length; i += 1000) {
        const batch = attendanceRecords.slice(i, i + 1000);
        await supabase.from('hr_attendance').insert(batch);
      }
    }

    // Generate other activity data (leaves, training, incidents, docs, integrations)
    // Leaves
    if (activeEmployees.data) {
      const leaveRecords = [];
      const sampleSize = Math.min(200, activeEmployees.data.length);
      for (let i = 0; i < sampleSize; i++) {
        const emp = activeEmployees.data[i];
        if (Math.random() < 0.4) { // 40% chance of having leave
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
          const days = Math.floor(Math.random() * 10) + 1;
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + days);

          leaveRecords.push({
            tenant_id: tenantId,
            employee_id: emp.id,
            leave_type: ['annual', 'sick', 'other'][Math.floor(Math.random() * 3)],
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            days
          });
        }
      }
      if (leaveRecords.length > 0) {
        await supabase.from('hr_leaves').insert(leaveRecords);
      }
    }

    // Training records
    if (activeEmployees.data) {
      const trainingRecords = [];
      const sampleSize = Math.min(300, activeEmployees.data.length);
      const courses = ['Safety Training', 'Leadership Development', 'Technical Skills', 'Compliance Training'];
      
      for (let i = 0; i < sampleSize; i++) {
        const emp = activeEmployees.data[i];
        if (Math.random() < 0.6) { // 60% chance of having training
          trainingRecords.push({
            tenant_id: tenantId,
            employee_id: emp.id,
            course_name: courses[Math.floor(Math.random() * courses.length)],
            hours: Math.floor(Math.random() * 8) + 1,
            completed_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        }
      }
      if (trainingRecords.length > 0) {
        await supabase.from('hr_training').insert(trainingRecords);
      }
    }

    // HSE Incidents
    const incidents = [];
    for (let i = 0; i < 12; i++) { // ~12 incidents per quarter
      incidents.push({
        tenant_id: tenantId,
        occurred_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dept_id: deptData?.[Math.floor(Math.random() * deptData.length)]?.id,
        severity: ['NearMiss', 'FirstAid', 'LTI', 'Recordable'][Math.floor(Math.random() * 4)],
        days_lost: Math.random() < 0.2 ? Math.floor(Math.random() * 5) : 0,
        description: 'Sample incident for demo purposes'
      });
    }
    if (incidents.length > 0) {
      await supabase.from('hse_incidents').insert(incidents);
    }

    // Document events
    const docEvents = [];
    for (let i = 0; i < 1500; i++) {
      docEvents.push({
        tenant_id: tenantId,
        event_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: ['upload', 'ocr', 'extract', 'approve'][Math.floor(Math.random() * 4)],
        module: ['HR', 'Payroll', 'Compliance', 'Training'][Math.floor(Math.random() * 4)],
        processed_by_ai: Math.random() < 0.6 // 60% AI processed
      });
    }
    if (docEvents.length > 0) {
      for (let i = 0; i < docEvents.length; i += 500) {
        const batch = docEvents.slice(i, i + 500);
        await supabase.from('docs_events').insert(batch);
      }
    }

    // Integrations
    const integrationsList = [
      { name: 'MOL', category: 'Gov', status: 'connected' },
      { name: 'QIWA', category: 'Gov', status: 'connected' },
      { name: 'GOSI', category: 'Gov', status: 'connected' },
      { name: 'ABSHER', category: 'Gov', status: 'connected' },
      { name: 'Payroll System', category: 'Tool', status: 'connected' },
      { name: 'LMS Platform', category: 'Tool', status: 'partial' },
      { name: 'ATS System', category: 'Tool', status: 'connected' }
    ];

    await supabase.from('integrations').insert(
      integrationsList.map(int => ({ 
        ...int, 
        tenant_id: tenantId,
        last_sync: new Date().toISOString()
      }))
    );

    console.log('HR demo seeding completed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'HR demo data seeded successfully',
      counts: {
        departments: deptData?.length || 0,
        locations: locationData?.length || 0,
        grades: gradeData?.length || 0,
        jobs: jobData?.length || 0,
        employees: totalEmployees,
        integrations: integrationsList.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hr_seed_demo_1000_v1:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});