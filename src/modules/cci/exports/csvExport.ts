import { fetchCSVData, generateCSVContent } from './data';
import { footerFor } from './disclaimers';

export function generateCSVFilename(tenantName: string, waveNo: string): string {
  const cleanTenantName = tenantName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanWaveNo = waveNo.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `AqlHR_CCI_${cleanTenantName}_Wave_${cleanWaveNo}_${dateStr}.csv`;
}

export async function exportCSV(tenantId: string, surveyId: string, waveId: string, tenantName: string, waveNo: string, lang: 'en' | 'ar' = 'en') {
  try {
    const data = await fetchCSVData(tenantId, surveyId, waveId);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('No data available for CSV export');
    }

    let csvContent = generateCSVContent(data);
    
    // Add disclaimer as comment at the bottom
    const disclaimer = footerFor(lang);
    csvContent += '\n\n# DISCLAIMER:\n';
    csvContent += `# ${disclaimer}\n`;
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', generateCSVFilename(tenantName, waveNo));
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}