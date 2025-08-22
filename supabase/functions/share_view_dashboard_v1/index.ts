import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify token and get share link
    const { data: shareLink, error: shareLinkError } = await supabaseClient
      .from('share_links')
      .select('*')
      .eq('token', token)
      .eq('kind', 'dashboard_snapshot')
      .single();

    if (shareLinkError || !shareLink) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired share link' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(shareLink.expires_at);
    
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Share link has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tenantId = shareLink.tenant_id;

    console.log(`[Share View Dashboard] Processing for tenant: ${tenantId}`);

    // Query safe aggregated data only (no PII)
    const [kpiResult, trendResult, integrationsResult, companyResult] = await Promise.all([
      // Latest KPI snapshot
      supabaseClient
        .from('kpi_snapshots')
        .select('*')
        .eq('company_id', tenantId)
        .order('snap_date', { ascending: false })
        .limit(1)
        .single(),
      
      // 30-day trend via RPC
      supabaseClient
        .rpc('dashboard_get_series_v1', { p_tenant: tenantId, p_days: 30 }),
      
      // Integrations overview
      supabaseClient
        .rpc('integrations_overview_v2', { p_tenant: tenantId }),
      
      // Company info (non-PII only)
      supabaseClient
        .from('companies')
        .select('name, company_name_arabic, industry, size_category')
        .eq('id', tenantId)
        .single()
    ]);

    // Handle potential errors gracefully
    const kpiData = kpiResult.data || {};
    const trendData = trendResult.data || [];
    const integrationsData = integrationsResult.data || [];
    const companyData = companyResult.data || {};

    // Calculate summary metrics (safe aggregations only)
    const latestKpi = kpiData;
    const totalEmployees = latestKpi.total_employees || 0;
    const saudizationRate = latestKpi.saudization_rate || 0;
    const complianceScore = latestKpi.compliance_score || 0;

    // Integration status summary
    const integrationsSummary = integrationsData.reduce((acc: any, curr: any) => {
      acc.total += curr.total || 0;
      acc.connected += curr.connected || 0;
      return acc;
    }, { total: 0, connected: 0 });

    const dashboardData = {
      company: {
        name: companyData.name || 'Company',
        name_arabic: companyData.company_name_arabic,
        industry: companyData.industry,
        size_category: companyData.size_category
      },
      kpi_summary: {
        total_employees: totalEmployees,
        saudization_rate: Number(saudizationRate),
        compliance_score: Number(complianceScore),
        hse_safety_score: latestKpi.hse_safety_score || 0,
        employee_experience_10: latestKpi.employee_experience_10 || 0
      },
      trend_data: trendData.slice(-30), // Last 30 days only
      integrations: {
        total: integrationsSummary.total,
        connected: integrationsSummary.connected,
        connection_rate: integrationsSummary.total > 0 
          ? Math.round((integrationsSummary.connected / integrationsSummary.total) * 100) 
          : 0
      },
      share_info: {
        created_at: shareLink.created_at,
        expires_at: shareLink.expires_at,
        kind: shareLink.kind
      },
      generated_at: now.toISOString()
    };

    console.log(`[Share View Dashboard] Data retrieved successfully for tenant: ${tenantId}`);

    return new Response(
      JSON.stringify(dashboardData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[Share View Dashboard] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve dashboard data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});