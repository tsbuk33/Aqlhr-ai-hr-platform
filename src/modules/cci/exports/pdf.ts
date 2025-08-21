import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { footerFor, t } from './disclaimers';
import { CCIOverviewData, CCIInitiative } from './data';

export interface PDFExportOptions {
  lang: 'en' | 'ar';
  brand: { nameEN: string; nameAR: string };
  surveyName: string;
  waveLabel: string;
  asOf: string;
  overview: CCIOverviewData;
  cvfPng?: string;
  heatmapPng?: string;
  initiatives: CCIInitiative[];
}

export async function buildExecutivePdf(opts: PDFExportOptions): Promise<jsPDF> {
  const { lang, brand, surveyName, waveLabel, asOf, overview, cvfPng, heatmapPng, initiatives } = opts;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // 595x842
  const isAR = lang === 'ar';
  const brandName = isAR ? brand.nameAR : brand.nameEN;

  // Set document metadata
  doc.setProperties({
    title: `CCI Report - ${brandName}`,
    subject: 'Corporate Culture Intelligence Report',
    author: 'AqlHR'
  });

  // For Arabic text support, use a font that includes Arabic glyphs
  // Note: In production, you would embed NotoSansArabic or similar
  if (isAR) {
    try {
      // Fallback to default font for now - in production load Arabic font
      doc.setFont('helvetica');
    } catch (error) {
      console.warn('Arabic font not available, using fallback');
    }
  }

  // Header
  doc.setFontSize(16);
  const headerAlign = isAR ? 'right' : 'left';
  const headerX = isAR ? 555 : 40;
  doc.text(`${brandName} — ${t('corporateCultureIntelligence', lang)}`, headerX, 40, { align: headerAlign });
  doc.setFontSize(11);
  doc.text(`${t('survey', lang)}: ${surveyName}   ${t('wave', lang)}: ${waveLabel}   ${t('asOf', lang)}: ${asOf}`, headerX, 60, { align: headerAlign });

  // KPI cards (simple text rows)
  const fmt = (v: number | null): string => v == null ? '—' : Number(v).toFixed(1);
  doc.setFontSize(12);
  
  let yPos = 90;
  doc.text(`${t('balanceScore', lang)}: ${fmt(overview.balance_score)}`, 40, yPos);
  doc.text(`${t('culturalRiskIndex', lang)}: ${fmt(overview.risk_index)}`, 240, yPos);
  doc.text(`${t('psychologicalSafety', lang)}: ${fmt(overview.psych_safety)}`, 440, yPos);
  
  yPos += 20;
  if (overview.values_alignment != null) {
    doc.text(`${t('valuesAlignment', lang)}: ${fmt(overview.values_alignment)}`, 40, yPos);
  }

  // Charts section
  yPos = 120;
  if (cvfPng) {
    try {
      doc.addImage(cvfPng, 'PNG', 40, yPos, 240, 180);
    } catch (error) {
      console.error('Error adding CVF image to PDF:', error);
    }
  }
  
  if (heatmapPng) {
    try {
      doc.addImage(heatmapPng, 'PNG', 310, yPos, 245, 180);
    } catch (error) {
      console.error('Error adding heatmap image to PDF:', error);
    }
  }
  
  yPos += 200;

  // Top initiatives table
  const rows = (initiatives || []).slice(0, 5).map(it => [
    isAR ? it.title_ar : it.title_en,
    it.owner_role,
    it.priority.toUpperCase()
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [[
      t('topInitiatives', lang),
      t('owner', lang),
      t('priority', lang)
    ]],
    body: rows.length ? rows : [[t('noInitiativesFound', lang), '', '']],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [230, 230, 230] },
    margin: { left: 40, right: 40 }
  });

  // Footer disclaimer
  const footer = footerFor(lang);
  doc.setFontSize(8);
  const pageH = doc.internal.pageSize.getHeight();
  doc.text(footer, 40, pageH - 36, { maxWidth: 515 });

  return doc;
}

export function generatePDFFilename(tenantName: string, waveNo: string): string {
  const cleanTenantName = tenantName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanWaveNo = waveNo.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `AqlHR_CCI_${cleanTenantName}_Wave_${cleanWaveNo}_${dateStr}.pdf`;
}