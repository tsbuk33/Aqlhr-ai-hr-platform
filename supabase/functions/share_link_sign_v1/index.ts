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

    const { tenantId, kind, ttlHours = 72, payload } = await req.json();

    if (!kind || !['dashboard_snapshot', 'cci_export'].includes(kind)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing kind. Must be dashboard_snapshot or cci_export' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve tenant ID if not provided
    let resolvedTenantId = tenantId;
    if (!resolvedTenantId) {
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseClient.auth.getUser(token);
        if (user) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('company_id')
            .eq('user_id', user.id)
            .single();
          resolvedTenantId = profile?.company_id;
        }
      }
    }

    if (!resolvedTenantId) {
      return new Response(
        JSON.stringify({ error: 'Could not resolve tenant ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a random 48-character token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + (ttlHours * 60 * 60 * 1000));

    // Insert share link
    const { data: shareLink, error: insertError } = await supabaseClient
      .from('share_links')
      .insert({
        tenant_id: resolvedTenantId,
        token,
        kind,
        payload: payload || {},
        expires_at: expiresAt.toISOString(),
        created_by: req.headers.get('authorization') ? undefined : null
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Share Link Sign] Insert error:', insertError);
      throw insertError;
    }

    // Generate public URL
    const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'https://your-domain.com';
    const shareUrl = `${publicSiteUrl}/share/${token}`;

    console.log(`[Share Link Sign] Created share link for tenant ${resolvedTenantId}: ${token}`);

    return new Response(
      JSON.stringify({ 
        url: shareUrl,
        token,
        expires_at: expiresAt.toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[Share Link Sign] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create share link' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});