import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/i18n/locale';
import { getLang } from '@/lib/i18n/getLang';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { supabase } from '@/integrations/supabase/client';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Globe,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';

interface ExportOptions {
  includePII: boolean;
  format: 'pptx' | 'pdf' | 'csv' | 'all';
  language: 'ar' | 'en';
}

interface OSIExportProps {
  tenantId?: string;
}

export const OSIExport: React.FC<OSIExportProps> = ({ tenantId }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includePII: false,
    format: 'pdf',
    language: getLang() as 'ar' | 'en'
  });
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { locale, t } = useLocale();
  const { user } = useAuthOptional();

  // Check if user has admin role for PII access using useAuthOptional roles
  const canIncludePII = false; // Simplified for now - will be properly implemented with role system

  const exportOSIReport = async () => {
    if (!tenantId) {
      toast({
        title: t('osi', 'error'),
        description: 'No tenant ID available for export',
        variant: 'destructive'
      });
      return;
    }

    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('cci-exports', {
        body: {
          tenant_id: tenantId,
          report_type: 'osi',
          format: exportOptions.format,
          language: exportOptions.language,
          include_pii: exportOptions.includePII && canIncludePII,
          sections: [
            'cover',
            'methodology',
            'layer_distribution', 
            'saudization_by_layer',
            'span_outliers',
            'cost_of_management',
            'recommendations'
          ]
        }
      });

      if (error) throw error;

      setLastExport(new Date());
      toast({
        title: t('osi', 'export') + ' Complete',
        description: `OSI report exported successfully as ${exportOptions.format.toUpperCase()}`,
      });

    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: t('osi', 'export') + ' ' + t('osi', 'error'),
        description: error.message || 'Failed to export OSI report',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'pptx':
        return <Presentation className="h-4 w-4" />;
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'all':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatName = (format: string) => {
    switch (format) {
      case 'pdf':
        return t('osi', 'pdf_report');
      case 'pptx':
        return t('osi', 'presentation');
      case 'csv':
        return t('osi', 'data_export');
      case 'all':
        return t('osi', 'all_formats');
      default:
        return format.toUpperCase();
    }
  };

  return (
    <div className="space-y-6" key={locale}>
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('osi', 'export_options')}
          </CardTitle>
          <CardDescription>
            {t('osi', 'configure_export_settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t('osi', 'export_format')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['pdf', 'pptx', 'csv', 'all'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportOptions(prev => ({ ...prev, format }))}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    exportOptions.format === format
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {getFormatIcon(format)}
                  <span className="text-sm font-medium">{getFormatName(format)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t('osi', 'report_language')}
            </label>
            <div className="flex gap-3">
              {(['en', 'ar'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setExportOptions(prev => ({ ...prev, language: lang }))}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    exportOptions.language === lang
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {lang === 'en' ? 'English' : 'العربية'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PII Inclusion (Admin only) */}
          {canIncludePII && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                {t('osi', 'data_inclusion')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExportOptions(prev => ({ 
                    ...prev, 
                    includePII: !prev.includePII 
                  }))}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    exportOptions.includePII
                      ? 'border-warning bg-warning/10'
                      : 'border-muted hover:border-warning/50'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {t('osi', 'include_manager_names')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('osi', 'admin_only_feature')}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'report_preview')}</CardTitle>
          <CardDescription>
            {t('osi', 'report_sections_preview')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: t('osi', 'cover_slide'), desc: t('osi', 'executive_summary') },
              { title: t('osi', 'methodology'), desc: t('osi', 'analysis_approach') },
              { title: t('osi', 'layer_distribution'), desc: t('osi', 'organizational_layers') },
              { title: t('osi', 'saudization_analysis'), desc: t('osi', 'compliance_by_layer') },
              { title: t('osi', 'span_analysis'), desc: t('osi', 'management_effectiveness') },
              { title: t('osi', 'cost_analysis'), desc: t('osi', 'financial_optimization') },
              { title: t('osi', 'recommendations'), desc: t('osi', 'improvement_roadmap') },
              { title: t('osi', 'next_steps'), desc: t('osi', 'implementation_guide') },
              { title: t('osi', 'appendix'), desc: t('osi', 'detailed_data') },
              { title: t('osi', 'compliance_footer'), desc: t('osi', 'pdpl_disclaimer') }
            ].map((section, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded border-l-4 border-l-primary/30">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{section.title}</div>
                  <div className="text-xs text-muted-foreground">{section.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Action */}
      <Card>
        <CardHeader>
          <CardTitle>{t('osi', 'generate_report')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={exportOSIReport}
            disabled={exporting || !tenantId}
            className="w-full"
            size="lg"
          >
            {exporting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {t('osi', 'generating_report')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('osi', 'export_report')}
              </>
            )}
          </Button>

          {lastExport && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t('osi', 'last_exported')}: {lastExport.toLocaleString(locale)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDPL Compliance Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            {t('osi', 'data_protection_compliance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t('osi', 'pdpl_notice_1')}</p>
            <p>{t('osi', 'pdpl_notice_2')}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                {t('osi', 'saudi_pdpl_compliant')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {t('osi', 'gdpr_compliant')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};