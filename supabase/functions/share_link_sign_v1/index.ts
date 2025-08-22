import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { tenantId, kind, ttlHours = 72, payload } = await req.json();

    if (!tenantId || !kind || !payload) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: tenantId, kind, payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate secure token
    const token = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);

    // Insert share link
    const { data, error } = await supabase
      .from('share_links')
      .insert({
        tenant_id: tenantId,
        kind,
        token,
        expires_at: expiresAt.toISOString(),
        payload
      })
      .select()
      .single();

    if (error) {
      console.error('Share link creation error:', error);
      throw error;
    }

    // Return the share URL
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('//', '//').replace('supabase.co', 'lovable.app') || 'https://aqlhr.lovable.app';
    const shareUrl = `${baseUrl}/share/${token}`;

    return new Response(
      JSON.stringify({ 
        url: shareUrl,
        token,
        expires_at: expiresAt.toISOString(),
        created_at: data.created_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Share link sign error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create share link' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});