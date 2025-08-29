import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    
    // Only allow service_role for this operation
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!authHeader || !authHeader.includes(serviceKey || '')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - service role required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Starting materialized view refresh for policy_risk_daily_mv')

    // Call the refresh function
    const { error } = await supabaseClient.rpc('refresh_policy_risk_daily_mv')

    if (error) {
      console.error('Error refreshing materialized view:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to refresh materialized view',
          details: error.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully refreshed policy_risk_daily_mv')

    // Get some basic stats about the refresh
    const { data: stats } = await supabaseClient
      .from('policy_risk_daily_mv')
      .select('company_id, day', { count: 'exact' })

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Materialized view refreshed successfully',
        refreshed_at: new Date().toISOString(),
        stats: {
          total_records: stats?.length || 0
        }
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error during MV refresh:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during refresh',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})