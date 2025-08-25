import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { resolveLang } from '@/lib/i18n/localePath';
import { maskEmployees, type Employee } from '@/lib/pdpl/maskEmployee';
import { logUiEvent } from '@/lib/obs/logUiEvent';

interface ExportColumn {
  key: string;
  label: string;
  labelAr?: string;
}

interface ExportOptions {
  isAdmin: boolean;
  tenantId?: string;
  filename?: string;
}

export function useSafeExport() {
  const [isExporting, setIsExporting] = useState(false);
  const lang = resolveLang();
  const { t } = useLanguage();

  const exportToCSV = async (
    rows: Employee[], 
    columns: ExportColumn[], 
    options: ExportOptions
  ) => {
    setIsExporting(true);
    
    try {
      logUiEvent({
        level: 'info',
        page: 'employees',
        message: 'CSV export started',
        details: { rowCount: rows.length, isAdmin: options.isAdmin }
      });

      // Mask data based on user role
      const maskedRows = maskEmployees(rows, { isAdmin: options.isAdmin });
      
      // Generate CSV content
      const csvContent = generateCSV(maskedRows, columns, lang);
      
      // Add PDPL footer
      const csvWithFooter = addPDPLFooter(csvContent, lang);
      
      // Generate filename
      const filename = generateFilename(options.tenantId, 'csv', lang);
      
      // Download file
      downloadFile(csvWithFooter, filename, 'text/csv');
      
      logUiEvent({
        level: 'info',
        page: 'employees',
        message: 'CSV export completed',
        details: { filename, rowCount: rows.length }
      });
      
    } catch (error) {
      logUiEvent({
        level: 'error',
        page: 'employees',
        message: 'CSV export failed',
        details: { error: 'Export generation error' }
      });
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (
    rows: Employee[], 
    columns: ExportColumn[], 
    options: ExportOptions
  ) => {
    setIsExporting(true);
    
    try {
      logUiEvent({
        level: 'info',
        page: 'employees',
        message: 'PDF export started',
        details: { rowCount: rows.length, isAdmin: options.isAdmin }
      });

      // Mask data based on user role
      const maskedRows = maskEmployees(rows, { isAdmin: options.isAdmin });
      
      // Generate PDF (simplified implementation)
      const pdfContent = generatePDF(maskedRows, columns, lang);
      
      // Generate filename
      const filename = generateFilename(options.tenantId, 'pdf', lang);
      
      // Download file
      downloadFile(pdfContent, filename, 'application/pdf');
      
      logUiEvent({
        level: 'info',
        page: 'employees',
        message: 'PDF export completed',
        details: { filename, rowCount: rows.length }
      });
      
    } catch (error) {
      logUiEvent({
        level: 'error',
        page: 'employees',
        message: 'PDF export failed',
        details: { error: 'PDF generation error' }
      });
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToCSV,
    exportToPDF,
    isExporting
  };
}

function generateCSV(rows: Employee[], columns: ExportColumn[], lang: string): string {
  const isRTL = lang === 'ar';
  
  // Generate headers
  const headers = columns.map(col => 
    lang === 'ar' && col.labelAr ? col.labelAr : col.label
  );
  
  // Generate rows
  const csvRows = rows.map(row => 
    columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return '';
      
      // Format numbers for Arabic if needed
      if (typeof value === 'number') {
        return isRTL ? formatArabicNumber(value) : value.toString();
      }
      
      // Escape CSV values
      const stringValue = String(value);
      return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    })
  );
  
  // Combine headers and rows
  return [headers, ...csvRows]
    .map(row => row.join(','))
    .join('\n');
}

function generatePDF(rows: Employee[], columns: ExportColumn[], lang: string): string {
  // Simplified PDF generation - in a real implementation, use jsPDF or similar
  const content = generateCSV(rows, columns, lang);
  return content; // Return CSV for now, would need proper PDF library
}

function addPDPLFooter(content: string, lang: string): string {
  const footer = lang === 'ar' 
    ? '\n\nملاحظة: هذا التقرير يحتوي على بيانات شخصية محمية بموجب نظام حماية البيانات الشخصية السعودي'
    : '\n\nNote: This report contains personal data protected under Saudi Personal Data Protection Law (PDPL)';
  
  return content + footer;
}

function generateFilename(tenantId?: string, extension?: string, lang?: string): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const tenant = tenantId?.slice(0, 8) || 'unknown';
  const langSuffix = lang || 'en';
  
  return `aqlhr_${tenant}_employees_${langSuffix}_${date}.${extension || 'csv'}`;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function formatArabicNumber(num: number): string {
  // Convert Western numerals to Arabic-Indic numerals
  const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
}