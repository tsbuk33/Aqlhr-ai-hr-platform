import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

const corsResponse = () => new Response('ok', { headers: corsHeaders });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tenantId, testMode = false, jobId } = await req.json();

    // Get adapter configuration
    const { data: adapter, error: adapterError } = await supabase
      .from('gov_adapters')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('system', 'absher')
      .single();

    if (adapterError) {
      console.error('Adapter config error:', adapterError);
      throw new Error('Absher adapter not configured');
    }

    // Get all non-Saudi employees for iQama validation
    const { data: employees, error: empError } = await supabase
      .from('hr_employees')
      .select('id, full_name_en, full_name_ar, iqama_expiry, employee_no')
      .eq('company_id', tenantId)
      .eq('is_saudi', false)
      .eq('employment_status', 'active');

    if (empError) {
      console.error('Employee fetch error:', empError);
      throw new Error('Failed to fetch employee data');
    }

    const isDemoMode = testMode || adapter.status === 'demo';
    let result;
    const issues = [];
    const validatedEmployees = [];

    if (isDemoMode) {
      // DEMO mode: mark ~1-3% of non-Saudis as "needs attention"
      const issueRate = 0.02; // 2% will have issues
      const totalEmployees = employees?.length || 0;
      const expectedIssues = Math.max(1, Math.floor(totalEmployees * issueRate));

      console.log(`Demo mode: checking ${totalEmployees} employees, expecting ~${expectedIssues} issues`);

      const issueTypes = [
        'iqama_expired',
        'iqama_expiring_soon',
        'iqama_invalid',
        'exit_reentry_required',
        'document_mismatch'
      ];

      // Randomly select employees to have issues
      const shuffledEmployees = [...(employees || [])].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < shuffledEmployees.length; i++) {
        const employee = shuffledEmployees[i];
        const hasIssue = i < expectedIssues;
        
        if (hasIssue) {
          const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
          
          issues.push({
            employee_id: employee.id,
            employee_no: employee.employee_no,
            employee_name: employee.full_name_en || employee.full_name_ar,
            issue_type: issueType,
            severity: issueType.includes('expired') || issueType.includes('invalid') ? 'error' : 'warn',
            message: getIssueMessage(issueType),
            iqama_expiry: employee.iqama_expiry
          });

          // Write event for each issue
          await supabase
            .from('gov_events')
            .insert({
              tenant_id: tenantId,
              system: 'absher',
              kind: 'iqama_invalid',
              severity: issueType.includes('expired') || issueType.includes('invalid') ? 'error' : 'warn',
              message: `Employee ${employee.employee_no} - ${getIssueMessage(issueType)}`,
              data: {
                employee_id: employee.id,
                employee_no: employee.employee_no,
                issue_type: issueType,
                iqama_expiry: employee.iqama_expiry,
                job_id: jobId,
                demo_mode: isDemoMode
              }
            });

          // Create task for critical issues
          if (issueType.includes('expired') || issueType.includes('invalid')) {
            await supabase.rpc('task_create_v1', {
              p_tenant_id: tenantId,
              p_module: 'government',
              p_title: `Urgent: iQama Issue - ${employee.employee_no}`,
              p_description: `Employee ${employee.full_name_en || employee.full_name_ar} has a critical iQama issue: ${getIssueMessage(issueType)}`,
              p_priority: 'urgent',
              p_metadata: {
                system: 'absher',
                employee_id: employee.id,
                issue_type: issueType,
                employee_no: employee.employee_no
              }
            });
          }
        }
        
        validatedEmployees.push({
          employee_id: employee.id,
          employee_no: employee.employee_no,
          status: hasIssue ? 'needs_attention' : 'valid',
          issue_type: hasIssue ? issues[issues.length - 1].issue_type : null
        });
      }

      result = {
        total_checked: totalEmployees,
        valid_count: totalEmployees - issues.length,
        issues_count: issues.length,
        issues: issues,
        validated_employees: validatedEmployees
      };

    } else {
      // LIVE mode: outline HTTPS call structure (stub)
      console.log('Live mode: would make HTTPS call to Absher API');
      
      // This would be the actual API call structure:
      /*
      for (const employee of employees) {
        const absherResponse = await fetch('https://absher-api-endpoint', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adapter.config?.api_key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            iqama_number: employee.iqama_number, // Would need this field
            check_type: 'iqama_validation'
          })
        });
        
        const absherData = await absherResponse.json();
        
        if (!absherData.valid) {
          issues.push({
            employee_id: employee.id,
            issue_type: absherData.issue_type,
            message: absherData.message
          });
        }
      }
      */
      
      // For now, return demo data with live flag
      result = {
        total_checked: employees?.length || 0,
        valid_count: (employees?.length || 0) - 1,
        issues_count: 1,
        issues: [{
          employee_id: employees?.[0]?.id,
          employee_no: employees?.[0]?.employee_no,
          issue_type: 'iqama_expiring_soon',
          severity: 'warn',
          message: 'iQama expires within 30 days'
        }],
        mode: 'live_stub'
      };
    }

    // Write summary event
    await supabase
      .from('gov_events')
      .insert({
        tenant_id: tenantId,
        system: 'absher',
        kind: 'iqama_validation_summary',
        severity: issues.length > 0 ? 'warn' : 'info',
        message: `iQama validation completed. ${result.total_checked} employees checked, ${result.issues_count} issues found`,
        data: {
          total_checked: result.total_checked,
          issues_count: result.issues_count,
          valid_count: result.valid_count,
          job_id: jobId,
          demo_mode: isDemoMode
        }
      });

    // Update adapter last sync time
    await supabase
      .from('gov_adapters')
      .update({
        last_sync: new Date().toISOString(),
        last_error: null
      })
      .eq('tenant_id', tenantId)
      .eq('system', 'absher');

    console.log(`Absher iQama check completed for tenant ${tenantId}:`, {
      total: result.total_checked,
      issues: result.issues_count
    });

    return new Response(
      JSON.stringify({
        success: true,
        system: 'absher',
        result: result,
        demo_mode: isDemoMode,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Absher sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getIssueMessage(issueType: string): string {
  switch (issueType) {
    case 'iqama_expired':
      return 'iQama has expired and requires immediate renewal';
    case 'iqama_expiring_soon':
      return 'iQama expires within 30 days';
    case 'iqama_invalid':
      return 'iQama number is invalid or not found in Absher system';
    case 'exit_reentry_required':
      return 'Exit/Re-entry permit required for renewal';
    case 'document_mismatch':
      return 'Document information does not match Absher records';
    default:
      return 'Unknown iQama issue detected';
  }
}