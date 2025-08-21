import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AdminActionRequest {
  functionName: string;
  parameters: any;
  actionDescription?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { functionName, parameters, actionDescription }: AdminActionRequest = await req.json();
    
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!userRoles || !['admin', 'super_admin'].includes(userRoles.role)) {
      throw new Error('Admin access required');
    }

    console.log(`Admin ${user.email} executing ${functionName}`);

    // Execute the wrapped function with audit logging
    const startTime = Date.now();
    let result: any;
    let success = true;
    let errorMessage = null;

    try {
      // Execute the target function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: parameters
      });

      if (error) throw error;
      result = data;

    } catch (error) {
      success = false;
      errorMessage = error.message;
      result = { error: error.message };
    }

    // Log the admin action
    const auditData = {
      company_id: userRoles.company_id,
      user_id: user.id,
      user_email: user.email,
      user_role: userRoles.role,
      action: actionDescription || `admin_${functionName}`,
      table_name: 'system_functions',
      record_id: null,
      old_values: null,
      new_values: {
        function_name: functionName,
        parameters: parameters,
        success: success,
        execution_time_ms: Date.now() - startTime
      },
      severity: success ? 'info' : 'error',
      category: 'admin_action'
    };

    await supabase.from('audit_logs').insert(auditData);

    // Also log to agent_actions for comprehensive tracking
    await supabase.from('agent_actions').insert({
      tenant_id: userRoles.company_id,
      user_id: user.id,
      action_type: 'admin_function_execution',
      tool_name: functionName,
      prompt: actionDescription || `Execute ${functionName}`,
      tool_payload: parameters,
      response_data: result,
      execution_time_ms: Date.now() - startTime,
      success: success,
      error_message: errorMessage
    });

    return new Response(JSON.stringify({
      ...result,
      audit_logged: true,
      execution_time_ms: Date.now() - startTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Secure Admin Wrapper error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      audit_logged: false
    }), {
      status: error.message.includes('Admin access required') ? 403 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});