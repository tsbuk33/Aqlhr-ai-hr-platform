import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify user session
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('No authorization token provided')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Invalid user session')
    }

    // Get query parameters
    const url = new URL(req.url)
    const format = url.searchParams.get('format') || 'json'
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')
    const priority = url.searchParams.get('priority')

    // Build query
    let query = supabaseClient
      .from('prompt_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)

    const { data: promptLogs, error } = await query

    if (error) {
      throw new Error(`Failed to fetch prompt logs: ${error.message}`)
    }

    // Format response based on requested format
    if (format === 'csv') {
      // Convert to CSV
      const headers = [
        'id', 'created_at', 'user_prompt', 'ai_response', 'category', 
        'priority', 'status', 'summary', 'implementation_notes', 'git_commit_hash'
      ]
      
      const csvRows = [
        headers.join(','),
        ...promptLogs.map(log => 
          headers.map(header => {
            const value = log[header] || ''
            // Escape CSV values that contain commas or quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          }).join(',')
        )
      ]

      return new Response(
        csvRows.join('\n'),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="prompt_history.csv"'
          }
        }
      )
    }

    // Default JSON response
    const response = {
      success: true,
      data: promptLogs,
      metadata: {
        total_count: promptLogs.length,
        filters_applied: { category, status, priority },
        export_timestamp: new Date().toISOString(),
        user_id: user.id
      }
    }

    return new Response(
      JSON.stringify(response, null, 2),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Prompt history API error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to fetch prompt history'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})