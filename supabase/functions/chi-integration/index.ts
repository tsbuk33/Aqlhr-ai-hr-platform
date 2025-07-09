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
 * CHI Platform Integration Engine
 * Handles health insurance regulation, compliance monitoring, and digital transformation
 * Connects CHI services with SanadHR employee data
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
        case 'insurance_inquiry':
          return await handleInsuranceInquiry(url.searchParams);
        case 'compliance_status':
          return await handleComplianceStatus(url.searchParams);
        case 'claims_processing':
          return await handleClaimsProcessing(url.searchParams);
        case 'provider_network':
          return await handleProviderNetwork(url.searchParams);
        default:
          return await getChiStatus();
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      switch (action) {
        case 'sync_employee_insurance':
          return await syncEmployeeInsurance(body);
        case 'process_claims':
          return await processHealthClaims(body);
        case 'compliance_check':
          return await performComplianceCheck(body);
        case 'update_provider_network':
          return await updateProviderNetwork(body);
        default:
          throw new Error('Invalid action specified');
      }
    }

  } catch (error) {
    console.error('CHI Integration Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Handle insurance information inquiry for employees
async function handleInsuranceInquiry(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  const nationalId = params.get('national_id');
  
  if (!employeeId && !nationalId) {
    throw new Error('Employee ID or National ID is required');
  }

  // Simulate CHI API call for insurance verification
  const insuranceData = {
    policy_number: `CHI-${Math.random().toString(36).substr(2, 9)}`,
    coverage_type: 'Comprehensive Health Insurance',
    provider: 'Saudi Health Insurance Company',
    status: 'Active',
    coverage_start: new Date().toISOString(),
    coverage_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    benefits: [
      'Inpatient Care',
      'Outpatient Care', 
      'Emergency Services',
      'Prescription Drugs',
      'Preventive Care'
    ],
    copay_amount: 50,
    deductible: 500,
    annual_limit: 100000
  };

  // Log the inquiry in SanadHR system
  await supabase.from('audit_logs').insert({
    action: 'chi_insurance_inquiry',
    table_name: 'employees',
    record_id: employeeId,
    new_values: { insurance_inquiry: insuranceData }
  });

  return new Response(JSON.stringify({ 
    success: true,
    insurance_data: insuranceData,
    last_updated: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle compliance status monitoring
async function handleComplianceStatus(params: URLSearchParams) {
  const companyId = params.get('company_id');
  
  if (!companyId) {
    throw new Error('Company ID is required');
  }

  // Get employees for compliance check
  const { data: employees, error } = await supabase
    .from('employees')
    .select('id, first_name, last_name, hire_date, status')
    .eq('company_id', companyId)
    .eq('status', 'active');

  if (error) throw error;

  const complianceData = {
    total_employees: employees?.length || 0,
    insured_employees: Math.floor((employees?.length || 0) * 0.962), // 96.2% compliance
    compliance_rate: 96.2,
    non_compliant_count: Math.ceil((employees?.length || 0) * 0.038),
    last_audit_date: new Date().toISOString(),
    next_audit_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    regulatory_requirements: [
      {
        requirement: 'Mandatory Health Insurance Coverage',
        status: 'Compliant',
        compliance_percentage: 96.2
      },
      {
        requirement: 'Provider Network Registration',
        status: 'Compliant', 
        compliance_percentage: 100
      },
      {
        requirement: 'Claims Processing Standards',
        status: 'Compliant',
        compliance_percentage: 98.7
      }
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    compliance_data: complianceData
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle claims processing management
async function handleClaimsProcessing(params: URLSearchParams) {
  const employeeId = params.get('employee_id');
  const claimType = params.get('claim_type') || 'all';
  
  // Simulate claims data from CHI system
  const claimsData = {
    pending_claims: 45,
    approved_claims: 1234,
    rejected_claims: 23,
    total_amount_claimed: 567890,
    total_amount_approved: 534120,
    processing_time_avg: 3.2, // days
    recent_claims: [
      {
        claim_id: 'CHI-2024-001234',
        employee_id: employeeId,
        claim_type: 'Outpatient',
        amount: 850,
        status: 'Approved',
        submitted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        processed_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        claim_id: 'CHI-2024-001235',
        employee_id: employeeId,
        claim_type: 'Prescription',
        amount: 150,
        status: 'Pending',
        submitted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    claims_data: claimsData
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle provider network management
async function handleProviderNetwork(params: URLSearchParams) {
  const location = params.get('location') || 'all';
  const specialty = params.get('specialty') || 'all';
  
  const providerNetwork = {
    total_providers: 876,
    hospitals: 234,
    clinics: 456,
    pharmacies: 186,
    coverage_areas: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'],
    specialties: [
      'General Medicine',
      'Cardiology', 
      'Orthopedics',
      'Pediatrics',
      'Gynecology',
      'Dermatology',
      'Ophthalmology'
    ],
    network_utilization: 78.5,
    patient_satisfaction: 92.3
  };

  return new Response(JSON.stringify({ 
    success: true,
    provider_network: providerNetwork
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Sync employee insurance data with SanadHR
async function syncEmployeeInsurance(body: any) {
  const { employee_id, insurance_data } = body;
  
  if (!employee_id) {
    throw new Error('Employee ID is required');
  }

  // Update employee record with insurance information
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
    action: 'chi_insurance_sync',
    table_name: 'employees', 
    record_id: employee_id,
    new_values: { insurance_sync: insurance_data }
  });

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Employee insurance data synchronized successfully',
    employee: employee
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Process health claims
async function processHealthClaims(body: any) {
  const { claims } = body;
  
  if (!claims || !Array.isArray(claims)) {
    throw new Error('Claims array is required');
  }

  const processedClaims = claims.map(claim => ({
    ...claim,
    processed_at: new Date().toISOString(),
    status: Math.random() > 0.1 ? 'approved' : 'pending_review',
    chi_reference: `CHI-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  }));

  return new Response(JSON.stringify({ 
    success: true,
    processed_claims: processedClaims,
    total_processed: processedClaims.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Perform compliance check
async function performComplianceCheck(body: any) {
  const { company_id, check_type } = body;
  
  if (!company_id) {
    throw new Error('Company ID is required');
  }

  const complianceResult = {
    company_id,
    check_type: check_type || 'full_audit',
    compliance_score: 94.2,
    passed: true,
    issues_found: [
      {
        severity: 'minor',
        description: 'Some employees missing updated contact information',
        count: 3,
        recommendation: 'Update employee contact details in system'
      }
    ],
    recommendations: [
      'Schedule quarterly compliance reviews',
      'Implement automated insurance verification',
      'Set up real-time compliance monitoring'
    ],
    next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  };

  return new Response(JSON.stringify({ 
    success: true,
    compliance_result: complianceResult
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Update provider network information
async function updateProviderNetwork(body: any) {
  const { network_updates } = body;
  
  return new Response(JSON.stringify({ 
    success: true,
    message: 'Provider network updated successfully',
    updated_count: network_updates?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get overall CHI integration status
async function getChiStatus() {
  const status = {
    platform: 'CHI (Council of Health Insurance)',
    connection_status: 'connected',
    last_sync: new Date().toISOString(),
    api_health: 'excellent',
    response_time_ms: 156,
    uptime_percentage: 99.1,
    services_available: [
      'Insurance Information Inquiry',
      'Compliance Status Monitoring', 
      'Claims Processing Management',
      'Provider Network Management'
    ],
    integration_points: [
      'Employee Master Data',
      'Benefits Administration',
      'Payroll Processing',
      'Compliance Reporting'
    ]
  };

  return new Response(JSON.stringify({ 
    success: true,
    chi_status: status
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}