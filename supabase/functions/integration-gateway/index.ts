import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface IntegrationRequest {
  system: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payload?: any;
  authentication?: any;
  tenant_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: IntegrationRequest = await req.json();
    
    console.log(`Integration gateway request: ${request.system}/${request.endpoint} for tenant: ${request.tenant_id}`);

    // Validate and route the request
    const result = await processIntegrationRequest(request);

    return new Response(JSON.stringify({
      success: true,
      system: request.system,
      endpoint: request.endpoint,
      tenant_id: request.tenant_id,
      timestamp: new Date().toISOString(),
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Integration gateway error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processIntegrationRequest(request: IntegrationRequest) {
  const { system, endpoint, method, payload, tenant_id } = request;

  // Route to appropriate integration handler
  switch (system.toLowerCase()) {
    case 'qiwa':
      return await handleQiwaIntegration(endpoint, method, payload, tenant_id);
    
    case 'gosi':
      return await handleGosiIntegration(endpoint, method, payload, tenant_id);
    
    case 'absher':
      return await handleAbsherIntegration(endpoint, method, payload, tenant_id);
    
    case 'mol':
      return await handleMolIntegration(endpoint, method, payload, tenant_id);
    
    case 'hrsd':
      return await handleHrsdIntegration(endpoint, method, payload, tenant_id);
    
    case 'internal':
      return await handleInternalIntegration(endpoint, method, payload, tenant_id);
    
    default:
      throw new Error(`Unsupported integration system: ${system}`);
  }
}

async function handleQiwaIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing Qiwa integration: ${endpoint}`);
  
  const integrationResult = {
    system: 'qiwa',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 500 + 100,
    data: null,
  };

  switch (endpoint) {
    case 'employee_verification':
      integrationResult.data = {
        employees_verified: payload?.employee_count || 1,
        verification_results: generateEmployeeVerificationData(payload?.employee_count || 1),
        compliance_status: 'compliant',
      };
      break;
    
    case 'visa_status':
      integrationResult.data = {
        visas_checked: payload?.visa_count || 1,
        visa_statuses: generateVisaStatusData(payload?.visa_count || 1),
        expiring_soon: Math.floor(Math.random() * 3),
      };
      break;
    
    case 'nitaqat_compliance':
      integrationResult.data = {
        current_color: 'green',
        saudization_rate: 65.5,
        required_rate: 60.0,
        compliance_level: 'excellent',
        next_review_date: '2024-06-15',
      };
      break;
    
    default:
      integrationResult.data = { message: `Qiwa ${endpoint} integration successful` };
  }

  // Log integration request
  await logIntegrationRequest(tenantId, 'qiwa', endpoint, integrationResult);
  
  return integrationResult;
}

async function handleGosiIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing GOSI integration: ${endpoint}`);
  
  const integrationResult = {
    system: 'gosi',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 600 + 150,
    data: null,
  };

  switch (endpoint) {
    case 'contribution_status':
      integrationResult.data = {
        employees_processed: payload?.employee_count || 1,
        total_contributions: 125000.50,
        employer_contributions: 75000.30,
        employee_contributions: 50000.20,
        pending_payments: 0,
        last_payment_date: '2024-08-30',
      };
      break;
    
    case 'salary_certificate':
      integrationResult.data = {
        certificates_generated: payload?.certificate_count || 1,
        certificates: generateSalaryCertificates(payload?.certificate_count || 1),
      };
      break;
    
    default:
      integrationResult.data = { message: `GOSI ${endpoint} integration successful` };
  }

  await logIntegrationRequest(tenantId, 'gosi', endpoint, integrationResult);
  
  return integrationResult;
}

async function handleAbsherIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing Absher integration: ${endpoint}`);
  
  const integrationResult = {
    system: 'absher',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 400 + 120,
    data: null,
  };

  switch (endpoint) {
    case 'iqama_verification':
      integrationResult.data = {
        verifications_completed: payload?.iqama_count || 1,
        verification_results: generateIqamaVerificationData(payload?.iqama_count || 1),
        expired_iqamas: Math.floor(Math.random() * 2),
      };
      break;
    
    case 'dependent_information':
      integrationResult.data = {
        dependents_processed: payload?.dependent_count || 0,
        dependent_details: generateDependentData(payload?.dependent_count || 0),
      };
      break;
    
    default:
      integrationResult.data = { message: `Absher ${endpoint} integration successful` };
  }

  await logIntegrationRequest(tenantId, 'absher', endpoint, integrationResult);
  
  return integrationResult;
}

async function handleMolIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing MOL integration: ${endpoint}`);
  
  const integrationResult = {
    system: 'mol',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 550 + 100,
    data: {
      message: `MOL ${endpoint} integration successful`,
      compliance_check: 'passed',
      violations: 0,
    },
  };

  await logIntegrationRequest(tenantId, 'mol', endpoint, integrationResult);
  
  return integrationResult;
}

async function handleHrsdIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing HRSD integration: ${endpoint}`);
  
  const integrationResult = {
    system: 'hrsd',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 450 + 110,
    data: {
      message: `HRSD ${endpoint} integration successful`,
      programs_available: 12,
      eligible_employees: payload?.employee_count || 0,
    },
  };

  await logIntegrationRequest(tenantId, 'hrsd', endpoint, integrationResult);
  
  return integrationResult;
}

async function handleInternalIntegration(endpoint: string, method: string, payload: any, tenantId: string) {
  console.log(`Processing internal integration: ${endpoint}`);
  
  let result;
  
  switch (endpoint) {
    case 'sync_employee_data':
      result = await syncEmployeeData(tenantId, payload);
      break;
    
    case 'generate_reports':
      result = await generateReports(tenantId, payload);
      break;
    
    case 'update_compliance_status':
      result = await updateComplianceStatus(tenantId, payload);
      break;
    
    default:
      result = { message: `Internal ${endpoint} integration successful` };
  }

  const integrationResult = {
    system: 'internal',
    endpoint,
    method,
    status: 'success',
    response_time_ms: Math.random() * 300 + 50,
    data: result,
  };

  await logIntegrationRequest(tenantId, 'internal', endpoint, integrationResult);
  
  return integrationResult;
}

// Helper functions for generating mock data
function generateEmployeeVerificationData(count: number) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      employee_id: `EMP_${1000 + i}`,
      iqama_number: `${2000000000 + i}`,
      verification_status: 'verified',
      employment_status: 'active',
      contract_type: 'unlimited',
    });
  }
  return results;
}

function generateVisaStatusData(count: number) {
  const results = [];
  const statuses = ['active', 'expired', 'pending_renewal'];
  
  for (let i = 0; i < count; i++) {
    results.push({
      visa_number: `V${300000000 + i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      profession: 'Software Engineer',
    });
  }
  return results;
}

function generateSalaryCertificates(count: number) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      certificate_id: `CERT_${4000 + i}`,
      employee_id: `EMP_${1000 + i}`,
      salary_amount: 8000 + Math.random() * 5000,
      issue_date: new Date().toISOString().split('T')[0],
      validity_months: 6,
    });
  }
  return results;
}

function generateIqamaVerificationData(count: number) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      iqama_number: `${2000000000 + i}`,
      name_arabic: `أحمد محمد علي ${i + 1}`,
      name_english: `Ahmed Mohammed Ali ${i + 1}`,
      nationality: 'Pakistani',
      expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'valid',
    });
  }
  return results;
}

function generateDependentData(count: number) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push({
      dependent_id: `DEP_${5000 + i}`,
      name: `Dependent ${i + 1}`,
      relationship: ['spouse', 'child'][Math.floor(Math.random() * 2)],
      age: Math.floor(Math.random() * 30) + 5,
      status: 'active',
    });
  }
  return results;
}

async function syncEmployeeData(tenantId: string, payload: any) {
  console.log(`Syncing employee data for tenant: ${tenantId}`);
  
  return {
    employees_synced: payload?.employee_count || 0,
    data_sources: ['qiwa', 'gosi', 'absher'],
    sync_duration_ms: Math.random() * 2000 + 500,
    conflicts_resolved: Math.floor(Math.random() * 3),
  };
}

async function generateReports(tenantId: string, payload: any) {
  console.log(`Generating reports for tenant: ${tenantId}`);
  
  return {
    reports_generated: payload?.report_types?.length || 3,
    report_types: payload?.report_types || ['saudization', 'compliance', 'payroll'],
    generation_time_ms: Math.random() * 3000 + 1000,
  };
}

async function updateComplianceStatus(tenantId: string, payload: any) {
  console.log(`Updating compliance status for tenant: ${tenantId}`);
  
  return {
    compliance_areas_updated: payload?.areas?.length || 5,
    overall_compliance_score: 92.5,
    critical_issues: 0,
    recommendations: ['Maintain current compliance levels', 'Schedule quarterly reviews'],
  };
}

async function logIntegrationRequest(tenantId: string, system: string, endpoint: string, result: any) {
  try {
    await supabase.from('integration_logs').insert({
      tenant_id: tenantId,
      system,
      endpoint,
      status: result.status,
      response_time_ms: result.response_time_ms,
      response_data: result.data,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log integration request:', error);
  }
}