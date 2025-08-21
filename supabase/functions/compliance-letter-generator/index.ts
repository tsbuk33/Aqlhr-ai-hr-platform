import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LetterRequest {
  tenant_id: string;
  employee: {
    id: string;
    full_name_en: string;
    full_name_ar: string;
    employee_no: string;
    iqama_expiry: string;
    department?: string;
    position?: string;
  };
  company: {
    name: string;
    name_ar?: string;
  };
  language: 'en' | 'ar';
  letter_type: 'iqama_renewal' | 'visa_renewal' | 'custom';
  footer?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const letterRequest: LetterRequest = await req.json();

    console.log(`Generating ${letterRequest.language} ${letterRequest.letter_type} letter for tenant: ${letterRequest.tenant_id}`);

    // Generate PDF buffer
    const pdfBuffer = await generateComplianceLetterPDF(letterRequest);
    
    // Create filename following the specified pattern
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    
    const filename = `${letterRequest.employee.employee_no}_${letterRequest.language}_${dateStr}.pdf`;
    const storagePath = `compliance-letters/${letterRequest.tenant_id}/${year}/${month}/${filename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('compliance-letters')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload PDF to storage');
    }

    // Store letter record in database
    const { error: dbError } = await supabase
      .from('compliance_letters')
      .insert({
        tenant_id: letterRequest.tenant_id,
        employee_id: letterRequest.employee.id,
        type: letterRequest.letter_type,
        lang: letterRequest.language,
        expiry_date: letterRequest.employee.iqama_expiry,
        reminder_day: 0, // Generated on-demand
        storage_path: storagePath,
        created_by: null // System generated
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't throw here, just log - the PDF was created successfully
    }

    return new Response(JSON.stringify({
      success: true,
      filename,
      storagePath,
      buffer: Array.from(pdfBuffer) // Convert to array for JSON serialization
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in compliance-letter-generator:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateComplianceLetterPDF(request: LetterRequest): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const isArabic = request.language === 'ar';
  
  // Margins and spacing
  const leftMargin = 50;
  const rightMargin = width - 50;
  const topMargin = height - 80;
  
  let yPosition = topMargin;
  
  if (isArabic) {
    // Arabic letter layout (RTL)
    await generateArabicLetter(page, request, font, boldFont, width, height);
  } else {
    // English letter layout (LTR)
    await generateEnglishLetter(page, request, font, boldFont, width, height);
  }
  
  return await pdfDoc.save();
}

async function generateArabicLetter(
  page: any, 
  request: LetterRequest, 
  font: any, 
  boldFont: any, 
  width: number, 
  height: number
) {
  const rightMargin = width - 50;
  let yPosition = height - 80;
  
  // Company Header (Arabic) - Right aligned
  page.drawText(request.company.name_ar || request.company.name, {
    x: rightMargin - 200,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  // AqlHR branding
  page.drawText('نظام عقل للموارد البشرية', {
    x: rightMargin - 150,
    y: yPosition - 25,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  
  yPosition -= 80;
  
  // Date (Arabic format) - Right aligned
  const currentDate = new Date();
  const arabicDate = `التاريخ: ${currentDate.toLocaleDateString('ar-SA')}`;
  page.drawText(arabicDate, {
    x: rightMargin - 120,
    y: yPosition,
    size: 11,
    font: font,
  });
  
  yPosition -= 60;
  
  // Subject line - Centered
  page.drawText('طلب تجديد هوية مقيم', {
    x: width / 2 - 70,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  yPosition -= 60;
  
  // Formal Arabic greeting - Right aligned
  page.drawText('السلام عليكم ورحمة الله وبركاته', {
    x: rightMargin - 180,
    y: yPosition,
    size: 12,
    font: font,
  });
  
  yPosition -= 30;
  
  page.drawText('إلى من يهمه الأمر،', {
    x: rightMargin - 100,
    y: yPosition,
    size: 12,
    font: font,
  });
  
  yPosition -= 40;
  
  // Employee information section
  const employeeLines = [
    'نتقدم إليكم بطلب تجديد هوية مقيم للموظف التالي:',
    '',
    `الاسم: ${request.employee.full_name_ar || request.employee.full_name_en}`,
    `رقم الموظف: ${request.employee.employee_no}`,
    ...(request.employee.department ? [`القسم: ${request.employee.department}`] : []),
    ...(request.employee.position ? [`المنصب: ${request.employee.position}`] : []),
    `تاريخ انتهاء الهوية الحالية: ${request.employee.iqama_expiry}`,
    '',
    'نرجو من سيادتكم التكرم بالموافقة على طلب التجديد',
    'حيث أن الموظف المذكور يعمل لدى مؤسستنا بموجب',
    'عقد عمل ساري المفعول ويستوفي جميع الشروط',
    'والمتطلبات اللازمة للحصول على هوية مقيم.',
    '',
    'علماً بأن الموظف ملتزم بجميع الأنظمة واللوائح',
    'المعمول بها في المملكة العربية السعودية.',
    '',
    'نشكر لكم حسن تعاونكم',
    '',
    'وتقبلوا فائق الاحترام والتقدير،'
  ];
  
  employeeLines.forEach(line => {
    if (yPosition < 150) {
      // Add new page if needed
      yPosition = height - 80;
    }
    
    if (line) {
      page.drawText(line, {
        x: rightMargin - (line.length * 4.5), // Approximate RTL positioning
        y: yPosition,
        size: 11,
        font: font,
      });
    }
    yPosition -= 18;
  });
  
  // Company signature section
  yPosition -= 30;
  page.drawText('إدارة الموارد البشرية', {
    x: rightMargin - 120,
    y: yPosition,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(request.company.name_ar || request.company.name, {
    x: rightMargin - 150,
    y: yPosition - 20,
    size: 12,
    font: font,
  });
  
  // Footer (PDPL compliance)
  const footerText = request.footer || 'تم إنشاء هذا الخطاب آلياً بواسطة نظام عقل للموارد البشرية - متوافق مع نظام حماية البيانات الشخصية';
  page.drawText(footerText, {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
    maxWidth: width - 100,
  });
}

async function generateEnglishLetter(
  page: any, 
  request: LetterRequest, 
  font: any, 
  boldFont: any, 
  width: number, 
  height: number
) {
  const leftMargin = 50;
  let yPosition = height - 80;
  
  // Company Header
  page.drawText(request.company.name, {
    x: leftMargin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  // AqlHR branding
  page.drawText('AqlHR Human Resources Management System', {
    x: leftMargin,
    y: yPosition - 25,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  
  yPosition -= 80;
  
  // Date
  const currentDate = new Date().toLocaleDateString('en-GB');
  page.drawText(`Date: ${currentDate}`, {
    x: width - 150,
    y: yPosition,
    size: 11,
    font: font,
  });
  
  yPosition -= 60;
  
  // Subject line
  page.drawText('IQAMA RENEWAL REQUEST', {
    x: leftMargin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  yPosition -= 60;
  
  // Formal greeting
  page.drawText('To Whom It May Concern,', {
    x: leftMargin,
    y: yPosition,
    size: 12,
    font: font,
  });
  
  yPosition -= 40;
  
  // Employee information section
  const employeeLines = [
    'We hereby request the renewal of Iqama (residence permit) for the following employee:',
    '',
    `Employee Name: ${request.employee.full_name_en}`,
    `Employee Number: ${request.employee.employee_no}`,
    ...(request.employee.department ? [`Department: ${request.employee.department}`] : []),
    ...(request.employee.position ? [`Position: ${request.employee.position}`] : []),
    `Current Iqama Expiry Date: ${request.employee.iqama_expiry}`,
    '',
    'The above-mentioned employee is currently employed with our organization',
    'under a valid employment contract and meets all the requirements and',
    'conditions necessary for obtaining a residence permit.',
    '',
    'The employee is fully compliant with all regulations and laws',
    'applicable in the Kingdom of Saudi Arabia.',
    '',
    'We would be grateful for your kind cooperation in processing this',
    'renewal request at your earliest convenience.',
    '',
    'Thank you for your assistance.',
    '',
    'Respectfully yours,'
  ];
  
  employeeLines.forEach(line => {
    if (yPosition < 150) {
      // Add new page if needed
      yPosition = height - 80;
    }
    
    page.drawText(line, {
      x: leftMargin,
      y: yPosition,
      size: 11,
      font: font,
    });
    yPosition -= 18;
  });
  
  // Company signature section
  yPosition -= 30;
  page.drawText('Human Resources Department', {
    x: leftMargin,
    y: yPosition,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(request.company.name, {
    x: leftMargin,
    y: yPosition - 20,
    size: 12,
    font: font,
  });
  
  // Footer (PDPL compliance)
  const footerText = request.footer || 'Generated automatically by AqlHR - PDPL compliant. No national IDs stored in logs.';
  page.drawText(footerText, {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
    maxWidth: width - 100,
  });
}