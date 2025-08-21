import jsPDF from 'jspdf';

interface LetterData {
  company_name_en: string;
  company_name_ar: string;
  employee_name_en: string;
  employee_name_ar: string;
  employee_id: string;
  iqama_expiry: string;
  generated_date: string;
}

export const generateRenewalLetterPDF = async (data: LetterData) => {
  const doc = new jsPDF();
  
  // Set up fonts and styles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Header - Company Name (English)
  doc.text(data.company_name_en, 20, 30);
  
  // Arabic company name (if different)
  if (data.company_name_ar !== data.company_name_en) {
    doc.setFontSize(14);
    doc.text(data.company_name_ar, 20, 45);
  }
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${data.generated_date}`, 150, 30);
  
  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IQAMA RENEWAL NOTIFICATION', 20, 70);
  doc.text('إشعار تجديد الإقامة', 20, 85);
  
  // Letter content - English
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const englishContent = [
    'To: Ministry of Interior - Directorate General of Passports',
    'Re: Iqama Renewal Request',
    '',
    `Employee Name: ${data.employee_name_en}`,
    `Employee ID: ${data.employee_id}`,
    `Current Iqama Expiry: ${data.iqama_expiry}`,
    '',
    'We hereby request the renewal of the above-mentioned employee\'s',
    'Iqama (residence permit) in accordance with Saudi Arabia\'s',
    'immigration regulations.',
    '',
    'The employee is currently employed with our organization and',
    'continues to meet all employment and residency requirements.',
    '',
    'We kindly request your assistance in processing this renewal',
    'application at your earliest convenience.',
    '',
    'Thank you for your cooperation.',
    '',
    'Sincerely,',
    `${data.company_name_en}`,
    'Human Resources Department'
  ];
  
  let yPosition = 105;
  englishContent.forEach(line => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  // Arabic content
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('المحتوى باللغة العربية:', 20, yPosition);
  yPosition += 15;
  
  doc.setFont('helvetica', 'normal');
  const arabicContent = [
    'إلى: وزارة الداخلية - المديرية العامة للجوازات',
    `اسم الموظف: ${data.employee_name_ar}`,
    `رقم الموظف: ${data.employee_id}`,
    `تاريخ انتهاء الإقامة الحالية: ${data.iqama_expiry}`,
    '',
    'نطلب بموجبه تجديد إقامة الموظف المذكور أعلاه',
    'وفقاً للوائح الهجرة في المملكة العربية السعودية.',
    '',
    'الموظف يعمل حالياً لدى مؤسستنا ويستوفي',
    'جميع متطلبات العمل والإقامة.',
    '',
    'نرجو منكم التكرم بمعالجة طلب التجديد',
    'في أقرب وقت ممكن.',
    '',
    'شكراً لتعاونكم.',
    '',
    `${data.company_name_ar}`,
    'قسم الموارد البشرية'
  ];
  
  arabicContent.forEach(line => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.text(`Generated automatically by Aql HR System on ${data.generated_date}`, 20, 280);
  
  // Save the PDF
  const fileName = `Iqama_Renewal_${data.employee_name_en.replace(/\s+/g, '_')}_${data.generated_date}.pdf`;
  doc.save(fileName);
};