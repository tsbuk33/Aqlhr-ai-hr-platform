import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportParams {
  format: 'csv' | 'xlsx'
  lang?: 'en' | 'ar'
  from?: string
  to?: string
  ids?: string[]
}

const translations = {
  en: {
    createdAt: 'Created At',
    title: 'Title',
    overall: 'Overall Score',
    complianceRisk: 'Compliance Risk',
    businessRisk: 'Business Risk',
    implementationRisk: 'Implementation Risk',
    saudiLaborLaw: 'Saudi Labor Law',
    workplaceRights: 'Workplace Rights',
    discriminationPrevention: 'Discrimination Prevention',
    dataProtection: 'Data Protection',
    operationalComplexity: 'Operational Complexity',
    resourceRequirements: 'Resource Requirements',
    stakeholderImpact: 'Stakeholder Impact',
    financialImplications: 'Financial Implications',
    systemComplexity: 'System Complexity',
    changeResistance: 'Change Resistance',
    trainingRequirements: 'Training Requirements',
    monitoringDifficulty: 'Monitoring Difficulty',
    topMitigations: 'Top 3 Mitigations',
    citationCount: 'Citations Count'
  },
  ar: {
    createdAt: 'تاريخ الإنشاء',
    title: 'العنوان',
    overall: 'النتيجة الإجمالية',
    complianceRisk: 'مخاطر الامتثال',
    businessRisk: 'مخاطر الأعمال',
    implementationRisk: 'مخاطر التنفيذ',
    saudiLaborLaw: 'قانون العمل السعودي',
    workplaceRights: 'حقوق مكان العمل',
    discriminationPrevention: 'منع التمييز',
    dataProtection: 'حماية البيانات',
    operationalComplexity: 'التعقيد التشغيلي',
    resourceRequirements: 'متطلبات الموارد',
    stakeholderImpact: 'تأثير أصحاب المصلحة',
    financialImplications: 'الآثار المالية',
    systemComplexity: 'تعقيد النظام',
    changeResistance: 'مقاومة التغيير',
    trainingRequirements: 'متطلبات التدريب',
    monitoringDifficulty: 'صعوبة المراقبة',
    topMitigations: 'أفضل ٣ استراتيجيات تخفيف',
    citationCount: 'عدد المراجع'
  }
}

function formatNumber(num: number, lang: string): string {
  if (lang === 'ar') {
    // Convert to Arabic-Indic numerals
    return num.toFixed(1).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
  }
  return num.toFixed(1)
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
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

    const body: ExportParams = await req.json()
    const { format, lang = 'en', from, to, ids } = body

    // Build query
    let query = supabaseClient
      .from('policy_risk_assessments')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (ids && ids.length > 0) {
      query = query.in('id', ids)
    }
    if (from) {
      query = query.gte('created_at', from)
    }
    if (to) {
      query = query.lte('created_at', to)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const t = translations[lang]

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        t.createdAt,
        t.title,
        t.overall,
        t.saudiLaborLaw,
        t.workplaceRights,
        t.discriminationPrevention,
        t.dataProtection,
        t.operationalComplexity,
        t.resourceRequirements,
        t.stakeholderImpact,
        t.financialImplications,
        t.systemComplexity,
        t.changeResistance,
        t.trainingRequirements,
        t.monitoringDifficulty,
        t.topMitigations,
        t.citationCount
      ].map(escapeCSV).join(',')

      const rows = data?.map(row => {
        const topMitigations = (row.mitigation_strategies || [])
          .slice(0, 3)
          .map((m: any) => m.title || '')
          .join('; ')

        return [
          new Date(row.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'),
          escapeCSV(row.title || ''),
          formatNumber(row.scores?.overall?.value || 0, lang),
          formatNumber(row.scores?.complianceRisk?.saudiLaborLaw?.value || 0, lang),
          formatNumber(row.scores?.complianceRisk?.workplaceRights?.value || 0, lang),
          formatNumber(row.scores?.complianceRisk?.discriminationPrevention?.value || 0, lang),
          formatNumber(row.scores?.complianceRisk?.dataProtection?.value || 0, lang),
          formatNumber(row.scores?.businessRisk?.operationalComplexity?.value || 0, lang),
          formatNumber(row.scores?.businessRisk?.resourceRequirements?.value || 0, lang),
          formatNumber(row.scores?.businessRisk?.stakeholderImpact?.value || 0, lang),
          formatNumber(row.scores?.businessRisk?.financialImplications?.value || 0, lang),
          formatNumber(row.scores?.implementationRisk?.systemComplexity?.value || 0, lang),
          formatNumber(row.scores?.implementationRisk?.changeResistance?.value || 0, lang),
          formatNumber(row.scores?.implementationRisk?.trainingRequirements?.value || 0, lang),
          formatNumber(row.scores?.implementationRisk?.monitoringDifficulty?.value || 0, lang),
          escapeCSV(topMitigations),
          (row.citations?.length || 0).toString()
        ].join(',')
      }).join('\n') || ''

      const csv = headers + '\n' + rows
      const filename = `policy-risk-export-${new Date().toISOString().split('T')[0]}.csv`

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    }

    // For XLSX format, return JSON data for client-side processing
    // (Excel generation is better handled client-side with libraries like SheetJS)
    const excelData = data?.map(row => ({
      [t.createdAt]: new Date(row.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'),
      [t.title]: row.title || '',
      [t.overall]: row.scores?.overall?.value || 0,
      [t.saudiLaborLaw]: row.scores?.complianceRisk?.saudiLaborLaw?.value || 0,
      [t.workplaceRights]: row.scores?.complianceRisk?.workplaceRights?.value || 0,
      [t.discriminationPrevention]: row.scores?.complianceRisk?.discriminationPrevention?.value || 0,
      [t.dataProtection]: row.scores?.complianceRisk?.dataProtection?.value || 0,
      [t.operationalComplexity]: row.scores?.businessRisk?.operationalComplexity?.value || 0,
      [t.resourceRequirements]: row.scores?.businessRisk?.resourceRequirements?.value || 0,
      [t.stakeholderImpact]: row.scores?.businessRisk?.stakeholderImpact?.value || 0,
      [t.financialImplications]: row.scores?.businessRisk?.financialImplications?.value || 0,
      [t.systemComplexity]: row.scores?.implementationRisk?.systemComplexity?.value || 0,
      [t.changeResistance]: row.scores?.implementationRisk?.changeResistance?.value || 0,
      [t.trainingRequirements]: row.scores?.implementationRisk?.trainingRequirements?.value || 0,
      [t.monitoringDifficulty]: row.scores?.implementationRisk?.monitoringDifficulty?.value || 0,
      [t.topMitigations]: (row.mitigation_strategies || []).slice(0, 3).map((m: any) => m.title || '').join('; '),
      [t.citationCount]: row.citations?.length || 0
    })) || []

    return new Response(
      JSON.stringify({ data: excelData }),
      {
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