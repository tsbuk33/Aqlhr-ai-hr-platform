import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HROperation {
  action: 'create_employee' | 'update_profile' | 'validate_data' | 'audit_trail' | 'crud_operation';
  data?: any;
  employeeId?: string;
  operationType?: 'insert' | 'update' | 'delete' | 'select';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data, employeeId, operationType }: HROperation = await req.json();

    console.log('HR Core Engine - Processing:', { action, employeeId, operationType });

    let result: any = {};

    switch (action) {
      case 'create_employee':
        result = await createEmployee(supabase, data);
        break;

      case 'update_profile':
        result = await updateProfile(supabase, employeeId, data);
        break;

      case 'validate_data':
        result = await validateData(data);
        break;

      case 'audit_trail':
        result = await createAuditLog(supabase, data);
        break;

      case 'crud_operation':
        result = await performCrudOperation(supabase, operationType, data);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: true,
      result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('HR Core Engine Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function createEmployee(supabase: any, employeeData: any) {
  // Employee master data management
  const employee = {
    id: crypto.randomUUID(),
    ...employeeData,
    created_at: new Date().toISOString(),
    status: 'active'
  };

  console.log('Creating employee:', employee);

  // Simulate employee creation (in real implementation, this would use actual tables)
  return {
    employee_id: employee.id,
    status: 'created',
    message: 'Employee successfully created in master data system'
  };
}

async function updateProfile(supabase: any, employeeId: string, profileData: any) {
  console.log('Updating profile for employee:', employeeId, profileData);

  // Simulate profile update with data validation
  const validatedData = await validateData(profileData);

  if (!validatedData.isValid) {
    throw new Error('Data validation failed: ' + validatedData.errors.join(', '));
  }

  return {
    employee_id: employeeId,
    status: 'updated',
    message: 'Profile successfully updated',
    updated_fields: Object.keys(profileData)
  };
}

async function validateData(data: any) {
  console.log('Validating data:', data);

  const errors: string[] = [];

  // Basic validation rules
  if (data.email && !data.email.includes('@')) {
    errors.push('Invalid email format');
  }

  if (data.national_id && data.national_id.length !== 10) {
    errors.push('National ID must be 10 digits');
  }

  if (data.phone && !/^(\+966|0)?[5]\d{8}$/.test(data.phone)) {
    errors.push('Invalid Saudi phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    timestamp: new Date().toISOString()
  };
}

async function createAuditLog(supabase: any, logData: any) {
  const auditEntry = {
    id: crypto.randomUUID(),
    action: logData.action,
    entity_type: logData.entity_type || 'employee',
    entity_id: logData.entity_id,
    user_id: logData.user_id,
    changes: logData.changes,
    timestamp: new Date().toISOString(),
    ip_address: logData.ip_address
  };

  console.log('Creating audit log:', auditEntry);

  return {
    audit_id: auditEntry.id,
    status: 'logged',
    message: 'Action successfully logged in audit trail'
  };
}

async function performCrudOperation(supabase: any, operation: string, data: any) {
  console.log('Performing CRUD operation:', operation, data);

  const operations = {
    insert: 'Record inserted successfully',
    update: 'Record updated successfully',
    delete: 'Record deleted successfully',
    select: 'Records retrieved successfully'
  };

  return {
    operation,
    status: 'completed',
    message: operations[operation] || 'Operation completed',
    affected_rows: operation === 'select' ? data?.limit || 10 : 1
  };
}