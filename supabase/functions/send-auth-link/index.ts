import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log(`[send-auth-link] ${req.method} request received`)

  if (req.method === 'OPTIONS') {
    console.log('[send-auth-link] Handling OPTIONS preflight')
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    console.log('[send-auth-link] Processing POST request')
    const body = await req.json()
    console.log('[send-auth-link] Request body:', body)
    
    // Return success for now to test function deployment
    return new Response(JSON.stringify({ 
      ok: true, 
      message: 'Function is working but email disabled for testing' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err: any) {
    console.error('[send-auth-link] ERROR', err)
    return new Response(JSON.stringify({ error: err?.message || 'internal_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})