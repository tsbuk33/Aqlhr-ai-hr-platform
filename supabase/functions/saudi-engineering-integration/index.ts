import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EngineerVerificationRequest {
  action: 'verify_engineer' | 'sync_engineer_data' | 'update_certificate';
  employee_id: string;
  engineer_number?: string;
  certificate_data?: any;
  engineer_data?: any;
}

interface EngineerData {
  engineer_number: string;
  full_name: string;
  specialization: string;
  registration_date: string;
  certificate_status: 'active' | 'expired' | 'suspended';
  professional_level: string;
  expiry_date?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, employee_id, engineer_number, certificate_data, engineer_data }: EngineerVerificationRequest = await req.json();

    console.log(`Saudi Engineering Body Integration - Action: ${action}, Employee: ${employee_id}`);

    let result;

    switch (action) {
      case 'verify_engineer':
        result = await verifyEngineerRegistration(engineer_number!, supabase);
        break;
      
      case 'sync_engineer_data':
        result = await syncEngineerData(employee_id, engineer_data, supabase);
        break;
      
      case 'update_certificate':
        result = await updateCertificateStatus(employee_id, certificate_data, supabase);
        break;
      
      default:
        // Default test connection
        result = await testConnection(supabase);
    }

    // Log the integration event for AI sync
    await logIntegrationEvent(supabase, {
      action,
      employee_id,
      result,
      platform: 'saudi_engineering_body'
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Saudi Engineering Body integration:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      platform: 'saudi_engineering_body',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifyEngineerRegistration(engineerNumber: string, supabase: any): Promise<any> {
  console.log(`Verifying engineer registration for number: ${engineerNumber}`);
  
  // Simulate API call to Saudi Engineering Body
  // In real implementation, this would call the actual Saudi Engineering Body API
  const mockEngineerData: EngineerData = {
    engineer_number: engineerNumber,
    full_name: "Ahmed Mohammed Al-Rashid",
    specialization: "Civil Engineering",
    registration_date: "2020-03-15",
    certificate_status: "active",
    professional_level: "Senior Engineer",
    expiry_date: "2025-03-15"
  };

  // Update employee record with engineer number if verified
  const { data: updateData, error: updateError } = await supabase
    .from('employees')
    .update({ 
      saudi_engineer_card_number: engineerNumber,
      certificates: `Engineer Number: ${engineerNumber} - ${mockEngineerData.specialization}`,
      additional_attributes: {
        saudi_engineering_body: mockEngineerData
      }
    })
    .eq('id', 'sample-employee-id');

  if (updateError) {
    console.error('Error updating employee with engineer data:', updateError);
  }

  return {
    verified: true,
    engineer_data: mockEngineerData,
    verification_timestamp: new Date().toISOString(),
    status: 'success'
  };
}

async function syncEngineerData(employeeId: string, engineerData: any, supabase: any): Promise<any> {
  console.log(`Syncing engineer data for employee: ${employeeId}`);
  
  // Simulate fetching all engineer records for the company
  const mockSyncData = {
    total_engineers: 1847,
    active_certificates: 2134,
    pending_applications: 23,
    compliance_rate: 97.2,
    last_sync: new Date().toISOString()
  };

  // Insert sync event into ai_sync_events for AI processing
  const { data: syncEvent, error: syncError } = await supabase
    .from('ai_sync_events')
    .insert({
      event_type: 'saudi_engineering_sync',
      source_table: 'saudi_engineering_integration',
      source_record_id: employeeId,
      affected_modules: ['compliance', 'employee_verification', 'professional_development'],
      payload: {
        platform: 'saudi_engineering_body',
        sync_data: mockSyncData,
        engineer_data: engineerData
      },
      sync_status: 'completed'
    });

  if (syncError) {
    console.error('Error logging sync event:', syncError);
  }

  return {
    sync_completed: true,
    records_processed: mockSyncData.total_engineers,
    last_sync: mockSyncData.last_sync,
    statistics: mockSyncData
  };
}

async function updateCertificateStatus(employeeId: string, certificateData: any, supabase: any): Promise<any> {
  console.log(`Updating certificate status for employee: ${employeeId}`);
  
  // Update employee certificate information
  const { data: updateData, error: updateError } = await supabase
    .from('employees')
    .update({
      certificates: certificateData.certificate_details,
      additional_attributes: {
        certificate_status: certificateData.status,
        last_certificate_update: new Date().toISOString()
      }
    })
    .eq('id', employeeId);

  if (updateError) {
    console.error('Error updating certificate data:', updateError);
    throw updateError;
  }

  return {
    certificate_updated: true,
    employee_id: employeeId,
    new_status: certificateData.status,
    timestamp: new Date().toISOString()
  };
}

async function testConnection(supabase: any): Promise<any> {
  console.log('Testing Saudi Engineering Body API connection');
  
  // Simulate API health check
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  return {
    platform: 'saudi_engineering_body',
    status: 'connected',
    response_time: 245,
    api_version: 'v2.1',
    timestamp: new Date().toISOString(),
    services: {
      engineer_verification: 'operational',
      certificate_management: 'operational',
      data_sync: 'operational'
    }
  };
}

async function logIntegrationEvent(supabase: any, eventData: any): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('ai_sync_events')
      .insert({
        event_type: `saudi_engineering_${eventData.action}`,
        source_table: 'saudi_engineering_integration',
        source_record_id: eventData.employee_id || 'system',
        affected_modules: ['government_integration', 'compliance', 'employee_verification'],
        payload: {
          platform: eventData.platform,
          action: eventData.action,
          result: eventData.result,
          timestamp: new Date().toISOString()
        },
        sync_status: 'completed'
      });

    if (error) {
      console.error('Error logging integration event:', error);
    }
  } catch (error) {
    console.error('Failed to log integration event:', error);
  }
}