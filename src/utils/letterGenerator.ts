import jsPDF from 'jspdf';

interface LetterData {
  company_name_en: string;
  company_name_ar: string;
  employee_name_en: string;
  employee_name_ar: string;
  employee_id: string;
  iqama_expiry: string;
  generated_date: string;
  language?: 'en' | 'ar';
  footer_en?: string;
  footer_ar?: string;
}

export const generateRenewalLetterPDF = async (data: LetterData) => {
  const { jsPDF } = await import('jspdf');
  
  // Create new PDF document
  const doc = new jsPDF();
  
  const language = data.language || 'en';
  const isArabic = language === 'ar';
  
  // Set font and font sizes
  const titleFontSize = 18;
  const headerFontSize = 14;
  const bodyFontSize = 12;
  const footerFontSize = 10;
  
  let yPosition = 30;
  
  if (isArabic) {
    // Arabic version
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(data.company_name_ar || data.company_name_en, 20, yPosition, { align: 'right', maxWidth: 170 });
    yPosition += 15;
    
    // Date
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(`التاريخ: ${data.generated_date}`, 170, yPosition, { align: 'right' });
    yPosition += 20;
    
    // Title
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('إشعار تجديد الإقامة', 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Arabic letter content
    const arabicContent = [
      'إلى من يهمه الأمر،',
      '',
      'نحيطكم علماً بأن الموظف التالي يحتاج إلى عناية فورية',
      'لتجديد الإقامة حيث أن تاريخ انتهاء الصلاحية يقترب:',
      '',
      `اسم الموظف (عربي): ${data.employee_name_ar}`,
      `اسم الموظف (إنجليزي): ${data.employee_name_en}`,
      `رقم الموظف: ${data.employee_id}`,
      `تاريخ انتهاء الإقامة الحالي: ${data.iqama_expiry}`,
      '',
      'يرجى التأكد من بدء عملية التجديد فوراً لتجنب',
      'أي مضاعفات قانونية أو مشاكل في تصريح العمل.',
      '',
      'الإجراءات المطلوبة:',
      '١. بدء عملية تجديد الإقامة مع السلطات المختصة',
      '٢. إعداد الوثائق المطلوبة',
      '٣. حجز موعد مع خدمات أبشر/وزارة الداخلية',
      '٤. متابعة حالة الطلب',
      '٥. تحديث سجلات الموارد البشرية عند اكتمال التجديد',
      '',
      'تم إنتاج هذا الإشعار تلقائياً من قبل نظام الموارد البشرية الخاص بنا',
      'لضمان الامتثال لمتطلبات قانون العمل السعودي.',
      '',
      'لأي استفسارات أو مساعدة، يرجى الاتصال بقسم الموارد البشرية.',
      '',
      'مع أطيب التحيات،',
      'قسم الموارد البشرية',
      data.company_name_ar || data.company_name_en
    ];
    
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    
    arabicContent.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      if (line) {
        doc.text(line, 190, yPosition, { align: 'right', maxWidth: 170 });
      }
      yPosition += 6;
    });
    
  } else {
    // English version
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(data.company_name_en, 20, yPosition);
    yPosition += 10;
    
    // Company Name (Arabic) - if different
    if (data.company_name_ar && data.company_name_ar !== data.company_name_en) {
      doc.text(data.company_name_ar, 20, yPosition);
      yPosition += 15;
    } else {
      yPosition += 10;
    }
    
    // Date
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${data.generated_date}`, 150, yPosition);
    yPosition += 20;
    
    // Title
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('IQAMA RENEWAL NOTIFICATION', 20, yPosition);
    yPosition += 20;
    
    // Letter content
    const letterContent = [
      'To Whom It May Concern,',
      '',
      'This is to notify that the following employee requires immediate attention',
      'for Iqama renewal as the expiry date is approaching:',
      '',
      `Employee Name (English): ${data.employee_name_en}`,
      `Employee Name (Arabic): ${data.employee_name_ar}`,
      `Employee ID: ${data.employee_id}`,
      `Current Iqama Expiry Date: ${data.iqama_expiry}`,
      '',
      'Please ensure that the renewal process is initiated immediately to avoid',
      'any legal complications or work permit issues.',
      '',
      'Required Actions:',
      '1. Initiate Iqama renewal process with relevant authorities',
      '2. Prepare required documentation',
      '3. Schedule appointment with Absher/MOI services',
      '4. Follow up on application status',
      '5. Update HR records upon renewal completion',
      '',
      'This notification has been generated automatically by our HR system',
      'to ensure compliance with Saudi Arabian labor law requirements.',
      '',
      'For any questions or assistance, please contact the HR department.',
      '',
      'Best regards,',
      'Human Resources Department',
      data.company_name_en
    ];
    
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    
    letterContent.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
  }
  
  // Add footer
  yPosition = Math.max(yPosition + 20, 280);
  doc.setFontSize(footerFontSize);
  doc.setFont('helvetica', 'italic');
  
  const footerText = isArabic 
    ? (data.footer_ar || 'تم إنشاء الخطاب بواسطة عقل للموارد البشرية – متوافق مع نظام حماية البيانات الشخصية.')
    : (data.footer_en || 'Generated by AqlHR - PDPL Compliant HR Management System');
    
  doc.text(footerText, isArabic ? 190 : 20, yPosition, { align: isArabic ? 'right' : 'left', maxWidth: 170 });
  doc.text(`${isArabic ? 'تاريخ الإنتاج: ' : 'Generation Date: '}${data.generated_date}`, isArabic ? 190 : 20, yPosition + 5, { align: isArabic ? 'right' : 'left' });
  
  // Save the PDF
  const langSuffix = isArabic ? '_AR' : '_EN';
  const fileName = `Iqama_Renewal_${data.employee_name_en.replace(/\s+/g, '_')}_${data.employee_id}_${data.generated_date}${langSuffix}.pdf`;
  doc.save(fileName);
};