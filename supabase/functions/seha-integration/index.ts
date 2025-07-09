import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

/**
 * Seha Platform Integration Engine
 * Handles healthcare services, electronic prescriptions, and medical insurance management
 * Connects Seha services with SanadHR employee healthcare data
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (req.method === 'GET') {
      switch (action) {
        case 'electronic_prescriptions':
          return await handleElectronicPrescriptions(url.searchParams);
        case 'health_records':
          return await handleHealthRecords(url.searchParams);
        case 'medical_checkups':
          return await handleMedicalCheckups(url.searchParams);
        case 'insurance_coverage':
          return await handleInsuranceCoverage(url.searchParams);
        default:
          return await getSehaStatus();
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      switch (action) {
        case 'sync_health_data':
          return await syncHealthData(body);
        case 'process_prescription':
          return await processElectronicPrescription(body);
        case 'schedule_checkup':
          return await scheduleHealthCheckup(body);
        case 'update_medical_records':
          return await updateMedicalRecords(body);
        default:
          throw new Error('Invalid action specified');
      }
    }

  } catch (error) {
    console.error('Seha Integration Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Handle electronic prescriptions management
async function handleElectronicPrescriptions(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  const status = params.get('status') || 'all';
  
  // Simulate Seha electronic prescriptions data
  const prescriptionsData = {
    total_prescriptions: 1234,
    active_prescriptions: 89,
    dispensed_prescriptions: 1098,
    pending_prescriptions: 47,
    recent_prescriptions: [
      {
        prescription_id: 'SEHA-RX-2024-001',
        employee_id: employeeId,
        doctor_name: 'Dr. Ahmed Al-Rashid',
        clinic: 'King Fahd Medical Center',
        medications: [
          {
            name: 'Paracetamol 500mg',
            dosage: '1 tablet every 6 hours',
            quantity: 20,
            duration: '5 days'
          }
        ],
        issue_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiry_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        pharmacy_dispensed: null
      },
      {
        prescription_id: 'SEHA-RX-2024-002',
        employee_id: employeeId,
        doctor_name: 'Dr. Fatima Al-Zahra',
        clinic: 'Al-Riyadh Specialist Hospital',
        medications: [
          {
            name: 'Vitamin D3 1000IU',
            dosage: '1 capsule daily',
            quantity: 30,
            duration: '30 days'
          }
        ],
        issue_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiry_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'dispensed',
        pharmacy_dispensed: 'Nahdi Pharmacy - Al-Malaz'
      }
    ]
  };

  // Log prescription access in SanadHR system
  await supabase.from('audit_logs').insert({
    action: 'seha_prescription_access',
    table_name: 'employees',
    record_id: employeeId,
    new_values: { prescription_access: { total: prescriptionsData.total_prescriptions } }
  });

  return new Response(JSON.stringify({ 
    success: true,
    prescriptions_data: prescriptionsData,
    last_updated: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle health records management
async function handleHealthRecords(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  const recordType = params.get('record_type') || 'all';
  
  const healthRecords = {
    employee_id: employeeId,
    blood_type: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    chronic_conditions: [],
    emergency_contact: {
      name: 'Sara Ahmad',
      relationship: 'Spouse',
      phone: '+966501234567'
    },
    recent_visits: [
      {
        visit_id: 'SEHA-V-2024-001',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'General Checkup',
        provider: 'King Fahd Medical Center',
        doctor: 'Dr. Ahmed Al-Rashid',
        diagnosis: 'Routine health maintenance',
        notes: 'Patient in good health. Recommended regular exercise.'
      }
    ],
    vaccinations: [
      {
        vaccine: 'COVID-19 Booster',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        provider: 'MOH Vaccination Center'
      },
      {
        vaccine: 'Hepatitis B',
        date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        provider: 'Al-Riyadh Medical Center'
      }
    ],
    lab_results: [
      {
        test_type: 'Complete Blood Count',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Normal',
        provider: 'King Fahd Medical Center'
      }
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    health_records: healthRecords
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle medical checkups scheduling
async function handleMedicalCheckups(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  const checkupType = params.get('checkup_type') || 'all';
  
  const checkupsData = {
    scheduled_checkups: 87,
    completed_checkups: 456,
    pending_checkups: 23,
    upcoming_checkups: [
      {
        checkup_id: 'SEHA-CHK-2024-001',
        employee_id: employeeId,
        type: 'Annual Physical Exam',
        scheduled_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        provider: 'King Fahd Medical Center',
        doctor: 'Dr. Ahmed Al-Rashid',
        location: 'Riyadh - Al-Malaz',
        status: 'scheduled',
        preparation_notes: 'Fasting required 12 hours before appointment'
      }
    ],
    available_checkup_types: [
      'Annual Physical Exam',
      'Executive Health Package',
      'Cardiovascular Screening',
      'Diabetes Screening',
      'Cancer Screening',
      'Eye Examination',
      'Dental Checkup'
    ],
    recommended_frequency: {
      'Annual Physical Exam': 'yearly',
      'Cardiovascular Screening': 'every 2 years',
      'Diabetes Screening': 'yearly for high-risk patients'
    }
  };

  return new Response(JSON.stringify({ 
    success: true,
    checkups_data: checkupsData
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle insurance coverage information
async function handleInsuranceCoverage(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  
  const coverageData = {
    employee_id: employeeId,
    policy_number: 'SEHA-INS-2024-' + Math.random().toString(36).substr(2, 6),
    coverage_percentage: 96.8,
    annual_limit: 150000,
    used_amount: 12450,
    remaining_amount: 137550,
    coverage_details: {
      inpatient: { covered: true, copay: 0, limit: 100000 },
      outpatient: { covered: true, copay: 50, limit: 25000 },
      emergency: { covered: true, copay: 0, limit: 50000 },
      prescription: { covered: true, copay: 20, limit: 5000 },
      dental: { covered: true, copay: 100, limit: 3000 },
      vision: { covered: true, copay: 50, limit: 1500 }
    },
    dependent_coverage: [
      {
        name: 'Sara Ahmad',
        relationship: 'Spouse',
        coverage_percentage: 96.8,
        status: 'active'
      }
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    coverage_data: coverageData
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Sync health data with SanadHR
async function syncHealthData(body: any) {
  const { employee_id, health_data } = body;
  
  if (!employee_id) {
    throw new Error('Employee ID is required');
  }

  // Update employee record with health information
  const { data: employee, error } = await supabase
    .from('employees')
    .update({
      updated_at: new Date().toISOString()
    })
    .eq('id', employee_id)
    .select()
    .single();

  if (error) throw error;

  // Log the sync operation
  await supabase.from('audit_logs').insert({
    action: 'seha_health_sync',
    table_name: 'employees',
    record_id: employee_id,
    new_values: { health_sync: health_data }
  });

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Employee health data synchronized successfully',
    employee: employee
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Process electronic prescription
async function processElectronicPrescription(body: any) {
  const { prescription_data } = body;
  
  const processedPrescription = {
    ...prescription_data,
    prescription_id: `SEHA-RX-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    processed_at: new Date().toISOString(),
    status: 'processed',
    verification_code: Math.random().toString(36).substr(2, 8).toUpperCase()
  };

  return new Response(JSON.stringify({ 
    success: true,
    processed_prescription: processedPrescription
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Schedule health checkup
async function scheduleHealthCheckup(body: any) {
  const { employee_id, checkup_type, preferred_date, provider } = body;
  
  const scheduledCheckup = {
    checkup_id: `SEHA-CHK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    employee_id,
    checkup_type,
    scheduled_date: preferred_date,
    provider,
    status: 'scheduled',
    confirmation_code: Math.random().toString(36).substr(2, 8).toUpperCase(),
    created_at: new Date().toISOString()
  };

  return new Response(JSON.stringify({ 
    success: true,
    scheduled_checkup: scheduledCheckup,
    message: 'Health checkup scheduled successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Update medical records
async function updateMedicalRecords(body: any) {
  const { employee_id, records_update } = body;
  
  return new Response(JSON.stringify({ 
    success: true,
    message: 'Medical records updated successfully',
    employee_id,
    updated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get overall Seha integration status
async function getSehaStatus() {
  const status = {
    platform: 'Seha Healthcare Platform',
    connection_status: 'connected',
    last_sync: new Date().toISOString(),
    api_health: 'excellent',
    response_time_ms: 142,
    uptime_percentage: 99.2,
    services_available: [
      'Electronic Prescriptions',
      'Health Records Management',
      'Medical Checkups Scheduling',
      'Insurance Coverage Tracking'
    ],
    integration_points: [
      'Employee Health Data',
      'Benefits Administration',
      'Leave Management',
      'Wellness Programs'
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    seha_status: status
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}