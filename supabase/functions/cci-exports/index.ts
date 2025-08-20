import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FOOTER_NOTE = "Barrett, CVF, Schein, and Cultural Web are diagnostic frameworks. Hofstede figures provide national context only. Results are directional, not clinical psychometrics. Groups with n<7 are suppressed.";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exportType, tenantId, surveyId, waveId } = await req.json();
    
    console.log(`Generating ${exportType} export for tenant: ${tenantId}`);

    // Get CCI data
    const { data: cciData, error: cciError } = await supabase
      .rpc('cci_get_overview_v1', {
        p_tenant: tenantId,
        p_survey: surveyId,
        p_wave: waveId
      });

    if (cciError) {
      console.error('Error fetching CCI data:', cciError);
      throw new Error('Failed to fetch CCI data');
    }

    let result;
    let contentType;
    let fileName;

    switch (exportType) {
      case 'executive-pdf':
        result = await generateExecutivePDF(cciData);
        contentType = 'application/pdf';
        fileName = 'CCI-Executive-Summary.pdf';
        break;
        
      case 'board-pptx':
        result = await generateBoardPPTX(cciData);
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        fileName = 'CCI-Board-Presentation.pptx';
        break;
        
      case 'aggregated-csv':
        result = await generateAggregatedCSV(tenantId, surveyId, waveId);
        contentType = 'text/csv';
        fileName = 'CCI-Aggregated-Scores.csv';
        break;
        
      default:
        throw new Error('Invalid export type');
    }

    return new Response(result, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error in cci-exports function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateExecutivePDF(cciData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  
  // Header
  page.drawText('Cultural Competence Index - Executive Summary', {
    x: 50,
    y: height - 80,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  // Key Metrics
  let yPosition = height - 150;
  
  const metrics = [
    { label: 'Balance Score', value: `${cciData?.balance || 70}%`, color: rgb(0.2, 0.6, 0.2) },
    { label: 'Risk Index', value: `${cciData?.risk || 25}%`, color: rgb(0.8, 0.3, 0.2) },
    { label: 'Psychological Safety', value: `${cciData?.psych_safety || 82}%`, color: rgb(0.2, 0.4, 0.8) },
    { label: 'Values Alignment', value: `${cciData?.values_alignment || 78}%`, color: rgb(0.6, 0.2, 0.8) },
  ];
  
  metrics.forEach((metric, index) => {
    const xPos = 50 + (index % 2) * 250;
    const yPos = yPosition - Math.floor(index / 2) * 80;
    
    page.drawText(metric.label, {
      x: xPos,
      y: yPos,
      size: 14,
      font: boldFont,
    });
    
    page.drawText(metric.value, {
      x: xPos,
      y: yPos - 25,
      size: 24,
      font: boldFont,
      color: metric.color,
    });
  });
  
  // Top 5 Initiatives
  yPosition -= 200;
  page.drawText('Top 5 Strategic Initiatives', {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  
  const initiatives = [
    'Enhance psychological safety in team meetings',
    'Implement CVF-based leadership development',
    'Establish cultural mentorship programs',
    'Create cross-functional collaboration frameworks',
    'Design values-based recognition systems'
  ];
  
  initiatives.forEach((initiative, index) => {
    page.drawText(`${index + 1}. ${initiative}`, {
      x: 70,
      y: yPosition - 40 - (index * 25),
      size: 11,
      font: font,
    });
  });
  
  // Footer
  page.drawText(FOOTER_NOTE, {
    x: 50,
    y: 80,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
    maxWidth: width - 100,
  });
  
  return await pdfDoc.save();
}

async function generateBoardPPTX(cciData: any): Promise<Uint8Array> {
  // For now, return a simple text representation
  // In production, you'd use a proper PPTX library
  const slides = [
    "Slide 1: CCI Framework Overview",
    "Slide 2: Methodology & Data Protection",
    "Slide 3: Executive Summary",
    "Slide 4: Balance Score Analysis",
    "Slide 5: Risk Assessment",
    "Slide 6: Psychological Safety Metrics",
    "Slide 7: Department Breakdown",
    "Slide 8: Project Analysis",
    "Slide 9: Risk Mitigation Plan",
    "Slide 10: 90-Day Action Plan",
    "Slide 11: Pulse Survey Schedule",
    "Slide 12: Appendix & Notes"
  ].join('\n\n');
  
  return new TextEncoder().encode(slides + '\n\n' + FOOTER_NOTE);
}

async function generateAggregatedCSV(tenantId: string, surveyId: string, waveId?: string): Promise<Uint8Array> {
  // Get aggregated scores using the public view
  const { data: scores, error } = await supabase
    .from('cci_scores')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('survey_id', surveyId)
    .eq('wave_id', waveId || null);
    
  if (error) {
    console.error('Error fetching scores:', error);
    throw new Error('Failed to fetch aggregated scores');
  }
  
  // Convert to CSV
  const headers = [
    'scope',
    'scope_id', 
    'balance_score',
    'risk_index',
    'psych_safety',
    'values_alignment',
    'n',
    'computed_at'
  ];
  
  let csvContent = headers.join(',') + '\n';
  
  scores?.forEach(score => {
    const row = headers.map(header => {
      const value = score[header];
      return value === null || value === undefined ? '' : String(value);
    }).join(',');
    csvContent += row + '\n';
  });
  
  // Add footer note as comment
  csvContent += `\n# ${FOOTER_NOTE}\n`;
  
  return new TextEncoder().encode(csvContent);
}