// Client-side exports for Evidence Answer (PDF via print view, PPTX via pptxgenjs, CSV, and ZIP via Edge)
// Phase 25: Comprehensive export utilities with bilingual support and PDPL compliance

import type { Citation } from "@/hooks/useRAGStream";
import { supabase } from "@/lib/supabaseClient";

type Lang = 'en' | 'ar';

interface ExportOptions {
  lang: Lang;
  question: string;
  answer: string;
  citations: Citation[];
  tenant?: string;
  filename?: string;
}

/**
 * Export answer as PDF using browser print functionality
 * Ensures perfect Arabic shaping and RTL support via native browser rendering
 */
export async function exportAnswerPDF(opts: ExportOptions): Promise<void> {
  const { lang, question, answer, citations, tenant = 'AqlHR' } = opts;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const title = lang === 'ar' ? 'تقرير الأدلة — AqlHR' : 'Evidence Report — AqlHR';
  
  const disclaimers = lang === 'ar'
    ? [
        'تنبيه نظام حماية البيانات الشخصية: هذا التقرير خالٍ من البيانات الشخصية باستثناء المجاميع المسموح بها.',
        'هذه ليست استشارة قانونية؛ يرجى التحقق مع الجهات الرسمية قبل أي إجراء امتثال.',
        'تم إنشاؤه بواسطة الذكاء الاصطناعي؛ يُنصح بالمراجعة البشرية للقرارات الحرجة.'
      ]
    : [
        'PDPL Notice: This report contains no personal data beyond permitted aggregates.',
        'Not legal advice; verify with official portals before any compliance action.',
        'AI-generated content; human review recommended for critical decisions.'
      ];

  const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  @media print {
    @page { 
      size: A4; 
      margin: 20mm; 
      @bottom-center { 
        content: counter(page) " / " counter(pages);
        font-size: 10pt;
        color: #666;
      }
    }
    body { 
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Tajawal", "Cairo", "Noto Sans Arabic", Arial, sans-serif; 
      font-size: 11pt;
      line-height: 1.4;
    }
    h1 { font-size: 18pt; margin-bottom: 12pt; }
    h2 { font-size: 14pt; margin: 16pt 0 8pt; border-bottom: 1pt solid #ddd; padding-bottom: 4pt; }
    h3 { font-size: 12pt; margin: 12pt 0 6pt; }
    .header { border-bottom: 2pt solid #0066cc; padding-bottom: 8pt; margin-bottom: 16pt; }
    .meta { font-size: 9pt; color: #666; margin: 4pt 0; }
    .question { background: #f8f9fa; padding: 8pt; border-left: 3pt solid #0066cc; margin: 8pt 0; }
    .answer { margin: 8pt 0; white-space: pre-wrap; }
    .citation { 
      margin: 4pt 0; 
      padding: 4pt 8pt; 
      border-left: 2pt solid #28a745;
      background: #f8f9fa;
      page-break-inside: avoid;
    }
    .badge { 
      display: inline-block;
      background: #0066cc; 
      color: white; 
      padding: 2pt 6pt; 
      border-radius: 3pt; 
      font-size: 9pt; 
      font-weight: bold;
      margin-${dir === 'rtl' ? 'left' : 'right'}: 6pt;
    }
    .footer { 
      position: fixed; 
      bottom: 0; 
      left: 0; 
      right: 0; 
      border-top: 1pt solid #ddd; 
      padding: 6pt 0; 
      font-size: 8pt; 
      color: #666;
      background: white;
    }
    .disclaimer { margin: 2pt 0; }
    ul { margin: 6pt 0; padding-${dir === 'rtl' ? 'right' : 'left'}: 16pt; }
    li { margin: 2pt 0; }
  }
  body { padding: 16pt; margin: 0; }
  .no-print { display: none; }
</style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="meta">${lang === 'ar' ? 'التاريخ' : 'Date'}: ${new Date().toLocaleString(lang)}</div>
    <div class="meta">${lang === 'ar' ? 'المؤسسة' : 'Organization'}: ${escapeHtml(tenant)}</div>
  </div>

  <section>
    <h2>${lang === 'ar' ? 'السؤال' : 'Question'}</h2>
    <div class="question">${escapeHtml(question)}</div>
  </section>

  <section>
    <h2>${lang === 'ar' ? 'الإجابة المدعومة بالأدلة' : 'Evidence-backed Answer'}</h2>
    <div class="answer">${escapeHtml(answer)}</div>
  </section>

  <section>
    <h2>${lang === 'ar' ? 'المصادر والاستشهادات' : 'Sources & Citations'} (${citations.length})</h2>
    ${
      citations.length
        ? citations.map(c => `
          <div class="citation">
            <span class="badge">#${c.n ?? ''}</span>
            <strong>${escapeHtml(c.title ?? 'Untitled')}</strong>
            ${c.portal ? `<br/><em>${lang === 'ar' ? 'البوابة' : 'Portal'}: ${escapeHtml(c.portal)}</em>` : ''}
            ${c.doc_type ? `<br/><em>${lang === 'ar' ? 'النوع' : 'Type'}: ${escapeHtml(c.doc_type)}</em>` : ''}
            ${c.created_at ? `<br/><em>${lang === 'ar' ? 'التاريخ' : 'Date'}: ${new Date(c.created_at).toLocaleDateString(lang)}</em>` : ''}
          </div>
        `).join('')
        : `<div class="citation"><em>${lang === 'ar' ? 'لم يتم العثور على أدلة داعمة' : 'No supporting evidence found'}</em></div>`
    }
  </section>

  <footer class="footer">
    <div style="font-size: 8pt; text-align: center;">
      ${disclaimers.map(d => `<div class="disclaimer">${escapeHtml(d)}</div>`).join('')}
    </div>
  </footer>

  <script>
    window.onload = () => { 
      window.print(); 
      setTimeout(() => window.close(), 500); 
    };
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
  if (!printWindow) {
    alert(lang === 'ar' ? 'تعذر فتح نافذة الطباعة' : 'Could not open print window');
    return;
  }
  
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Export citations as CSV file
 */
export function exportCitationsCSV(opts: { citations: Citation[], filename?: string, lang?: Lang }): void {
  const { citations, filename, lang = 'en' } = opts;
  const defaultName = lang === 'ar' ? 'استشهادات_الأدلة_AqlHR.csv' : 'AqlHR_Evidence_Citations.csv';
  const finalFilename = filename || defaultName;
  
  const headers = lang === 'ar' 
    ? ['رقم', 'العنوان', 'البوابة', 'النوع', 'التاريخ', 'المسار']
    : ['n', 'title', 'portal', 'doc_type', 'created_at', 'storage_path'];
    
  const header = headers.join(',') + '\n';
  
  const rows = citations.map(c => [
    safe(c.n),
    safe(c.title),
    safe(c.portal),
    safe(c.doc_type),
    safe(c.created_at ? new Date(c.created_at).toLocaleDateString(lang) : ''),
    safe((c as any).storage_path)
  ].map(csvEscape).join(','));

  const csvContent = header + rows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' }); // BOM for Excel compatibility
  downloadBlob(blob, finalFilename);
}

/**
 * Export answer as PowerPoint presentation
 */
export async function exportPPTX(opts: ExportOptions): Promise<void> {
  try {
    // Dynamic import to avoid bundle bloat
    const PptxGenJS = (await import('pptxgenjs')).default;
    
    const { lang, question, answer, citations, filename } = opts;
    const title = lang === 'ar' ? 'تقرير الأدلة — AqlHR' : 'Evidence Report — AqlHR';
    const defaultName = filename || (lang === 'ar' ? 'تقرير_الأدلة_AqlHR.pptx' : 'AqlHR_Evidence_Report.pptx');

    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'A4', width: 8.27, height: 11.69 });
    pptx.layout = 'A4';

    // Title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(title, {
      x: 0.5, y: 2, w: 7.27, h: 1.5,
      fontSize: 32, bold: true, align: 'center',
      color: '0066cc', rtl: lang === 'ar'
    });
    
    titleSlide.addText(
      lang === 'ar' ? 'تقرير مدعوم بالأدلة' : 'Evidence-backed Report',
      {
        x: 0.5, y: 4, w: 7.27, h: 1,
        fontSize: 18, align: 'center',
        color: '666666', rtl: lang === 'ar'
      }
    );

    titleSlide.addText(
      new Date().toLocaleDateString(lang),
      {
        x: 0.5, y: 9, w: 7.27, h: 0.5,
        fontSize: 12, align: 'center',
        color: '999999', rtl: lang === 'ar'
      }
    );

    // Question slide
    const questionSlide = pptx.addSlide();
    questionSlide.addText(
      lang === 'ar' ? 'السؤال' : 'Question',
      { x: 0.5, y: 0.5, w: 7.27, h: 0.8, fontSize: 24, bold: true, color: '0066cc', rtl: lang === 'ar' }
    );
    
    questionSlide.addText(question, {
      x: 0.5, y: 1.5, w: 7.27, h: 8,
      fontSize: 16, rtl: lang === 'ar', wrap: true,
      valign: 'top'
    });

    // Answer slide(s) - split if too long
    const maxAnswerLength = 800;
    const answerChunks = answer.length > maxAnswerLength 
      ? chunkString(answer, maxAnswerLength)
      : [answer];

    answerChunks.forEach((chunk, index) => {
      const answerSlide = pptx.addSlide();
      const slideTitle = answerChunks.length > 1 
        ? `${lang === 'ar' ? 'الإجابة' : 'Answer'} (${index + 1}/${answerChunks.length})`
        : lang === 'ar' ? 'الإجابة المدعومة بالأدلة' : 'Evidence-backed Answer';
        
      answerSlide.addText(slideTitle, {
        x: 0.5, y: 0.5, w: 7.27, h: 0.8,
        fontSize: 24, bold: true, color: '0066cc', rtl: lang === 'ar'
      });
      
      answerSlide.addText(chunk, {
        x: 0.5, y: 1.5, w: 7.27, h: 9,
        fontSize: 14, rtl: lang === 'ar', wrap: true,
        valign: 'top'
      });
    });

    // Citations slide
    const citationsSlide = pptx.addSlide();
    citationsSlide.addText(
      `${lang === 'ar' ? 'المصادر والاستشهادات' : 'Sources & Citations'} (${citations.length})`,
      { x: 0.5, y: 0.5, w: 7.27, h: 0.8, fontSize: 24, bold: true, color: '0066cc', rtl: lang === 'ar' }
    );

    if (citations.length > 0) {
      const citationText = citations.map(c => 
        `#${c.n ?? ''} ${c.title ?? 'Untitled'} — ${c.portal ?? ''} ${c.doc_type ? `(${c.doc_type})` : ''}`
      ).join('\n\n');

      citationsSlide.addText(citationText, {
        x: 0.5, y: 1.5, w: 7.27, h: 9,
        fontSize: 12, rtl: lang === 'ar', wrap: true,
        valign: 'top'
      });
    } else {
      citationsSlide.addText(
        lang === 'ar' ? 'لم يتم العثور على أدلة داعمة' : 'No supporting evidence found',
        {
          x: 0.5, y: 4, w: 7.27, h: 1,
          fontSize: 16, align: 'center', italic: true,
          color: '666666', rtl: lang === 'ar'
        }
      );
    }

    await pptx.writeFile({ fileName: defaultName });
  } catch (e) {
    console.error('PPTX generation error:', e);
    const message = opts.lang === 'ar'
      ? 'تعذر إنشاء ملف PPTX في هذا المتصفح. يرجى المحاولة مع متصفح آخر أو استخدام تصدير PDF.'
      : 'PPTX generation failed in this browser. Please try a different browser or use PDF export.';
    alert(message);
  }
}

/**
 * Request evidence bundle ZIP from Edge Function
 */
export async function requestEvidenceBundleZip(opts: ExportOptions): Promise<void> {
  try {
    const { lang, question, answer, citations, tenant = 'AqlHR' } = opts;
    const title = lang === 'ar' ? 'حزمة_الأدلة' : 'Evidence_Pack';

    // Get authentication token
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/assistant-evidence-bundle-v1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        lang,
        title,
        question,
        answer,
        citations,
        tenant
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error || `ZIP generation failed (${response.status})`);
    }

    const blob = await response.blob();
    const filename = extractFilenameFromResponse(response) || 
                    `${sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.zip`;
    
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Evidence bundle ZIP error:', error);
    const message = opts.lang === 'ar'
      ? 'تعذر إنشاء حزمة الأدلة. يرجى المحاولة مرة أخرى.'
      : 'Failed to generate evidence bundle. Please try again.';
    alert(message);
  }
}

// Utility functions

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function csvEscape(value: any): string {
  const str = (value ?? '').toString();
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function safe(value: any): string {
  return value ?? '';
}

function sanitizeFilename(str: string): string {
  return str.replace(/[^\p{L}\p{N}\-_.]+/gu, '_').slice(0, 50);
}

function escapeHtml(str: string): string {
  return (str ?? '').replace(/[&<>"']/g, (match) => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[match];
  });
}

function chunkString(str: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

function extractFilenameFromResponse(response: Response): string | null {
  const disposition = response.headers.get('content-disposition');
  if (!disposition) return null;
  
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
  if (matches?.[1]) {
    return matches[1].replace(/['"]/g, '');
  }
  
  return null;
}