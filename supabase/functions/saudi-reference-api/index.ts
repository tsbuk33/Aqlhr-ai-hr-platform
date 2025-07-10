import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()
    const regionCode = url.searchParams.get('region')
    const sectorCode = url.searchParams.get('sector')
    const search = url.searchParams.get('search')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    let data: any = null
    let error: any = null

    switch (endpoint) {
      case 'regions':
        const regionsQuery = supabaseClient
          .from('saudi_regions')
          .select('*')
          .order('name_en')

        if (search) {
          regionsQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`)
        }

        const regionsResult = await regionsQuery.limit(limit)
        data = regionsResult.data
        error = regionsResult.error
        break

      case 'cities':
        let citiesQuery = supabaseClient
          .from('saudi_cities')
          .select(`
            *,
            region:saudi_regions(*)
          `)
          .order('name_en')

        if (regionCode) {
          citiesQuery = citiesQuery.eq('region.code', regionCode)
        }

        if (search) {
          citiesQuery = citiesQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`)
        }

        const citiesResult = await citiesQuery.limit(limit)
        data = citiesResult.data
        error = citiesResult.error
        break

      case 'sectors':
        const sectorsQuery = supabaseClient
          .from('saudi_sectors')
          .select('*')
          .order('name_en')

        if (search) {
          sectorsQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`)
        }

        const sectorsResult = await sectorsQuery.limit(limit)
        data = sectorsResult.data
        error = sectorsResult.error
        break

      case 'activities':
        let activitiesQuery = supabaseClient
          .from('saudi_activities')
          .select(`
            *,
            sector:saudi_sectors(*)
          `)
          .order('name_en')

        if (sectorCode) {
          activitiesQuery = activitiesQuery.eq('sector.sic_code', sectorCode)
        }

        if (search) {
          activitiesQuery = activitiesQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`)
        }

        const activitiesResult = await activitiesQuery.limit(limit)
        data = activitiesResult.data
        error = activitiesResult.error
        break

      case 'gov-entities':
        const govQuery = supabaseClient
          .from('saudi_gov_entities')
          .select('*')
          .order('name_en')

        if (search) {
          govQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%,entity_key.ilike.%${search}%`)
        }

        const govResult = await govQuery.limit(limit)
        data = govResult.data
        error = govResult.error
        break

      case 'companies':
        const companiesQuery = supabaseClient
          .from('companies_private_top500')
          .select(`
            *,
            sector:saudi_sectors(*),
            headquarters_city:saudi_cities(
              *,
              region:saudi_regions(*)
            )
          `)
          .order('revenue_rank')

        if (search) {
          companiesQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`)
        }

        const companiesResult = await companiesQuery.limit(limit)
        data = companiesResult.data
        error = companiesResult.error
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ data, count: data?.length || 0 }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})