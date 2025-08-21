import React, { useState } from 'react';
import { FeatureGate } from '@/components/pricing/FeatureGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserCompany } from '@/hooks/useUserCompany';
import { fetchOverview, fetchPlaybook, fetchHofstedeContext, fetchEvidenceInsights } from '@/modules/cci/exports/data';
import { buildExecutivePdf, generatePDFFilename } from '@/modules/cci/exports/pdf';
import { buildBoardDeck, generatePPTXFilename } from '@/modules/cci/exports/pptx';
import { exportCSV } from '@/modules/cci/exports/csvExport';
import { FileText, Presentation, Database, Loader2, AlertTriangle } from 'lucide-react';

const Export: React.FC = () => {
  const isArabic = false; // TODO: Implement i18n
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [selectedWave, setSelectedWave] = useState<string>('');
  const { userRole, hasAnyRole } = useUserRole();
  const { companyId } = useUserCompany();

  const canExport = hasAnyRole(['admin', 'hr_manager', 'super_admin']);

  const handleExport = async (type: 'pdf' | 'pptx' | 'csv') => {
    if (!selectedSurvey || !selectedWave || !companyId) {
      toast.error('Please select a survey and wave');
      return;
    }

    setIsExporting(true);
    try {
      const overview = await fetchOverview(companyId, selectedSurvey, selectedWave);
      const playbook = await fetchPlaybook(companyId, selectedSurvey, selectedWave);
      const hofstedeData = await fetchHofstedeContext(companyId, selectedSurvey, selectedWave);
      const evidenceInsights = await fetchEvidenceInsights(companyId, selectedSurvey, selectedWave);

      const exportData = {
        lang: isArabic ? 'ar' as const : 'en' as const,
        brand: { nameEN: 'Company Name', nameAR: 'اسم الشركة' },
        surveyName: 'CCI Survey',
        waveLabel: `Wave ${selectedWave}`,
        asOf: new Date().toLocaleDateString(),
        overview: overview || { balance_score: null, risk_index: null, psych_safety: null, values_alignment: null, cvf: null, web: null, barrett: null, n: null, last_computed_at: null },
        initiatives: playbook?.initiatives || [],
        pulses: playbook?.pulses || [],
        hofstedeData: hofstedeData || [],
        evidenceInsights: evidenceInsights || [],
        tenantName: 'Company_Name'
      };

      if (type === 'pdf') {
        const doc = await buildExecutivePdf(exportData);
        doc.save(generatePDFFilename(exportData.tenantName, selectedWave));
      } else if (type === 'pptx') {
        const deck = await buildBoardDeck(exportData);
        await deck.writeFile({ fileName: generatePPTXFilename(exportData.tenantName, selectedWave) });
      } else if (type === 'csv') {
        await exportCSV(companyId, selectedSurvey, selectedWave, exportData.tenantName, selectedWave, exportData.lang);
      }

      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <FeatureGate featureKey="cci_export" featureName="CCI Export">
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold">Export Reports</h1>
            <p className="text-muted-foreground mt-2">Export comprehensive CCI reports</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Select survey and wave to export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Survey</label>
                  <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                    <SelectTrigger><SelectValue placeholder="Select survey" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survey-1">CCI Culture Survey</SelectItem>
                      <SelectItem value="survey-2">Leadership Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Wave</label>
                  <Select value={selectedWave} onValueChange={setSelectedWave}>
                    <SelectTrigger><SelectValue placeholder="Select wave" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wave-1">Wave 1 (Baseline)</SelectItem>
                      <SelectItem value="wave-2">Wave 2 (Follow-up)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm">Exports include only aggregated metrics. Groups with n &lt; 7 are suppressed.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Executive PDF
                </CardTitle>
                <CardDescription>1-page executive summary</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleExport('pdf')} 
                  disabled={!canExport || isExporting || !selectedSurvey || !selectedWave}
                  className="w-full"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Download PDF'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5" />
                  Board PPTX
                </CardTitle>
                <CardDescription>10-12 slides for board presentation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleExport('pptx')} 
                  disabled={!canExport || isExporting || !selectedSurvey || !selectedWave}
                  className="w-full"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Download PPTX'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data CSV
                </CardTitle>
                <CardDescription>Aggregated scores only</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleExport('csv')} 
                  disabled={!canExport || isExporting || !selectedSurvey || !selectedWave}
                  className="w-full"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Download CSV'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default Export;