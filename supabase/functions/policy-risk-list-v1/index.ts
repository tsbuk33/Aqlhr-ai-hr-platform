import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ListParams {
  page?: number
  pageSize?: number
  q?: string
  from?: string
  to?: string
  orderBy?: 'created_at' | 'overall'
  dir?: 'asc' | 'desc'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Parse query parameters
    const url = new URL(req.url)
    const params: ListParams = {
      page: parseInt(url.searchParams.get('page') || '1'),
      pageSize: parseInt(url.searchParams.get('pageSize') || '20'),
      q: url.searchParams.get('q') || undefined,
      from: url.searchParams.get('from') || undefined,
      to: url.searchParams.get('to') || undefined,
      orderBy: (url.searchParams.get('orderBy') as 'created_at' | 'overall') || 'created_at',
      dir: (url.searchParams.get('dir') as 'asc' | 'desc') || 'desc'
    }

    // Build query
    let query = supabaseClient
      .from('policy_risk_assessments')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,id.ilike.%${params.q}%`)
    }

    // Apply date range filters
    if (params.from) {
      query = query.gte('created_at', params.from)
    }
    if (params.to) {
      query = query.lte('created_at', params.to)
    }

    // Apply ordering
    if (params.orderBy === 'overall') {
      query = query.order('scores->overall->>value', { 
        ascending: params.dir === 'asc',
        nullsFirst: false 
      })
    } else {
      query = query.order('created_at', { ascending: params.dir === 'asc' })
    }

    // Apply pagination
    const offset = ((params.page || 1) - 1) * (params.pageSize || 20)
    query = query.range(offset, offset + (params.pageSize || 20) - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform data for frontend
    const transformedData = data?.map(row => ({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      overall_score: row.scores?.overall?.value || 0,
      compliance_score: {
        saudiLaborLaw: row.scores?.complianceRisk?.saudiLaborLaw?.value || 0,
        workplaceRights: row.scores?.complianceRisk?.workplaceRights?.value || 0,
        discriminationPrevention: row.scores?.complianceRisk?.discriminationPrevention?.value || 0,
        dataProtection: row.scores?.complianceRisk?.dataProtection?.value || 0,
      },
      business_score: {
        operationalComplexity: row.scores?.businessRisk?.operationalComplexity?.value || 0,
        resourceRequirements: row.scores?.businessRisk?.resourceRequirements?.value || 0,
        stakeholderImpact: row.scores?.businessRisk?.stakeholderImpact?.value || 0,
        financialImplications: row.scores?.businessRisk?.financialImplications?.value || 0,
      },
      implementation_score: {
        systemComplexity: row.scores?.implementationRisk?.systemComplexity?.value || 0,
        changeResistance: row.scores?.implementationRisk?.changeResistance?.value || 0,
        trainingRequirements: row.scores?.implementationRisk?.trainingRequirements?.value || 0,
        monitoringDifficulty: row.scores?.implementationRisk?.monitoringDifficulty?.value || 0,
      },
      mitigation_count: row.mitigation_strategies?.length || 0,
      citation_count: row.citations?.length || 0,
      policy_doc_id: row.policy_doc_id,
      source_text: row.source_text
    })) || []

    const response = {
      rows: transformedData,
      total: count || 0,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      totalPages: Math.ceil((count || 0) / (params.pageSize || 20))
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})