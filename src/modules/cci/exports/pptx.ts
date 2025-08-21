import PptxGenJS from 'pptxgenjs';
import { footerFor, t } from './disclaimers';
import { CCIOverviewData, CCIInitiative } from './data';

export interface PPTXExportOptions {
  lang: 'en' | 'ar';
  brand: { nameEN: string; nameAR: string };
  surveyName: string;
  waveLabel: string;
  asOf: string;
  overview: CCIOverviewData;
  cvfPng?: string;
  heatmapPng?: string;
  initiatives: CCIInitiative[];
  pulses: { day: 30 | 60 | 90 }[];
}

export async function buildBoardDeck(opts: PPTXExportOptions): Promise<PptxGenJS> {
  const { lang, brand, surveyName, waveLabel, asOf, overview, cvfPng, heatmapPng, initiatives, pulses } = opts;
  const isAR = lang === 'ar';
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  const footer = footerFor(lang);
  const addFooter = (slide: any) => 
    slide.addText(footer, { 
      x: 0.2, 
      y: 6.8, 
      w: 9.0, 
      h: 0.6, 
      fontSize: 9,
      color: '666666'
    });

  const fmt = (v: any): string => v == null ? '—' : Number(v).toFixed(1);

  // 1) Cover slide
  let s = pptx.addSlide();
  s.addText(t('corporateCultureIntelligence', lang), { 
    x: 0.6, 
    y: 1.2, 
    fontSize: 32, 
    bold: true 
  });
  s.addText(`${brand.nameEN} / ${brand.nameAR}`, { 
    x: 0.6, 
    y: 2.0, 
    fontSize: 18 
  });
  s.addText(`${t('survey', lang)}: ${surveyName}  •  ${t('wave', lang)}: ${waveLabel}  •  ${t('asOf', lang)}: ${asOf}`, { 
    x: 0.6, 
    y: 2.6, 
    fontSize: 14 
  });
  addFooter(s);

  // 2) Method & Anonymity
  s = pptx.addSlide();
  s.addText(t('methodAnonymity', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  s.addText(t('anonymityEnforced', lang), { 
    x: 0.6, 
    y: 1.4, 
    fontSize: 14, 
    w: 9 
  });
  addFooter(s);

  // 3) Key Scores
  s = pptx.addSlide();
  s.addText(t('keyScores', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  
  const scoresText = `${t('balance', lang)}: ${fmt(overview.balance_score)}   ${t('risk', lang)}: ${fmt(overview.risk_index)}   ${t('psychSafety', lang)}: ${fmt(overview.psych_safety)}`;
  s.addText(scoresText, { 
    x: 0.6, 
    y: 1.4, 
    fontSize: 16 
  });
  
  if (overview.values_alignment != null) {
    s.addText(`${t('valuesAlignment', lang)}: ${fmt(overview.values_alignment)}`, {
      x: 0.6,
      y: 1.8,
      fontSize: 16
    });
  }
  addFooter(s);

  // 4) CVF Spider
  s = pptx.addSlide();
  s.addText(t('competingValues', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  
  if (cvfPng) {
    try {
      s.addImage({ 
        data: cvfPng, 
        x: 0.8, 
        y: 1.2, 
        w: 8, 
        h: 4.5 
      });
    } catch (error) {
      console.error('Error adding CVF image to PPTX:', error);
      s.addText('CVF chart unavailable', { x: 0.8, y: 3, fontSize: 14 });
    }
  } else {
    s.addText('CVF chart unavailable', { x: 0.8, y: 3, fontSize: 14 });
  }
  addFooter(s);

  // 5) Heatmap
  s = pptx.addSlide();
  s.addText(t('heatmapByDepartment', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  
  if (heatmapPng) {
    try {
      s.addImage({ 
        data: heatmapPng, 
        x: 0.8, 
        y: 1.2, 
        w: 8, 
        h: 4.5 
      });
    } catch (error) {
      console.error('Error adding heatmap image to PPTX:', error);
      s.addText('Heatmap unavailable', { x: 0.8, y: 3, fontSize: 14 });
    }
  } else {
    s.addText('Heatmap unavailable', { x: 0.8, y: 3, fontSize: 14 });
  }
  addFooter(s);

  // 6) Top Initiatives
  const tops = (initiatives || []).slice(0, 5);
  s = pptx.addSlide();
  s.addText(t('aiChangePlan', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  
  if (tops.length > 0) {
    let y = 1.4;
    tops.forEach((it, i) => {
      const title = isAR ? it.title_ar : it.title_en;
      s.addText(`${i + 1}. ${title} — ${it.owner_role} [${it.priority}]`, { 
        x: 0.6, 
        y: y, 
        w: 9, 
        fontSize: 14 
      });
      y += 0.5;
    });
  } else {
    s.addText(t('noInitiativesFound', lang), { 
      x: 0.6, 
      y: 1.4, 
      fontSize: 14 
    });
  }
  addFooter(s);

  // 7) Pulse Schedule
  s = pptx.addSlide();
  s.addText(t('pulseSchedule', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  s.addText(t('pulseDescription', lang), { 
    x: 0.6, 
    y: 1.4, 
    w: 9, 
    fontSize: 14 
  });
  addFooter(s);

  // 8) Next Steps
  s = pptx.addSlide();
  s.addText(t('nextSteps', lang), { 
    x: 0.6, 
    y: 0.7, 
    fontSize: 22, 
    bold: true 
  });
  s.addText(t('nextStepsDescription', lang), { 
    x: 0.6, 
    y: 1.4, 
    w: 9, 
    fontSize: 14 
  });
  addFooter(s);

  return pptx;
}

export function generatePPTXFilename(waveLabel: string): string {
  return `AqlHR_CCI_${waveLabel.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
}