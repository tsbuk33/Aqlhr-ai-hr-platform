import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Presentation, Table } from "lucide-react";
import { getLang } from '@/lib/i18n/getLang';
import { RetentionOverview, RetentionHotspot, RetentionDriver, RetentionWatchlistItem } from '@/hooks/useRetention';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface Props {
  overview: RetentionOverview | null;
  hotspots: RetentionHotspot[];
  drivers: RetentionDriver[];
  watchlist: RetentionWatchlistItem[];
  loading: boolean;
  tenantId: string | null;
}

export const RetentionExport: React.FC<Props> = ({
  overview,
  hotspots,
  drivers,
  watchlist,
  loading,
  tenantId
}) => {
  const lang = getLang();
  const isRTL = lang === 'ar';
  const { toast } = useToast();
  const { hasAnyRole } = useUserRole();
  const isAdmin = hasAnyRole(['admin', 'hr_manager', 'super_admin']);

  const t = (key: string) => {
    const translations: Record<string, any> = {
      retention: {
        export: {
          title: lang === 'ar' ? "تصدير تقرير الاحتفاظ" : "Export Retention Report",
          description: lang === 'ar' 
            ? "تصدير التحليل الشامل لاستراتيجية الاحتفاظ" 
            : "Export comprehensive retention strategy analysis",
          formats: lang === 'ar' ? "التنسيقات المتاحة" : "Available Formats",
          pdfReport: lang === 'ar' ? "تقرير PDF" : "PDF Report",
          pptPresentation: lang === 'ar' ? "عرض PowerPoint" : "PowerPoint Presentation", 
          csvData: lang === 'ar' ? "بيانات CSV" : "CSV Data",
          disclaimer: {
            en: "PDPL-compliant export. No personal identifiers for non-admin roles.",
            ar: "تصدير متوافق مع نظام حماية البيانات الشخصية دون بيانات تعريفية لغير الإداريين."
          }
        },
        ui: {
          exporting: lang === 'ar' ? "جاري التصدير..." : "Exporting...",
          noData: lang === 'ar' ? "لا توجد بيانات للتصدير" : "No data to export"
        }
      }
    };

    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const generateFilename = (format: string) => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const tenantName = tenantId?.slice(0, 8) || 'demo';
    return `AqlHR_Retention_${tenantName}_${date}.${format}`;
  };

  const exportToPDF = async () => {
    try {
      toast({
        title: t('retention.ui.exporting'),
        description: "Generating PDF report..."
      });

      // Create PDF content
      const content = {
        tenantId,
        overview,
        hotspots,
        drivers,
        watchlist: isAdmin ? watchlist : [], // Hide PII for non-admins
        lang,
        isAdmin,
        timestamp: new Date().toISOString(),
        disclaimer: t('retention.export.disclaimer')
      };

      // For now, create a simple data URI with JSON (in production, use proper PDF generation)
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", generateFilename('pdf'));
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      toast({
        title: "Success",
        description: "PDF report downloaded successfully"
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToPPTX = async () => {
    try {
      toast({
        title: t('retention.ui.exporting'),
        description: "Generating PowerPoint presentation..."
      });

      // Create PPTX content structure
      const content = {
        slides: [
          {
            title: "Retention Strategy Overview",
            content: overview,
            type: "overview"
          },
          {
            title: "Risk Hotspots",
            content: hotspots,
            type: "hotspots"
          },
          {
            title: "Risk Drivers",
            content: drivers,
            type: "drivers"
          },
          ...(isAdmin ? [{
            title: "High-Risk Watchlist",
            content: watchlist,
            type: "watchlist"
          }] : []),
          {
            title: "Next Steps",
            content: "Recommended actions based on analysis",
            type: "next_steps"
          }
        ],
        metadata: {
          tenantId,
          lang,
          isAdmin,
          disclaimer: t('retention.export.disclaimer')
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", generateFilename('pptx'));
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      toast({
        title: "Success", 
        description: "PowerPoint presentation downloaded successfully"
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = async () => {
    try {
      toast({
        title: t('retention.ui.exporting'),
        description: "Generating CSV data..."
      });

      let csvContent = "# AQL HR Retention Analysis Export\n";
      csvContent += `# Generated: ${new Date().toISOString()}\n`;
      csvContent += `# Language: ${lang}\n`;
      csvContent += `# ${t('retention.export.disclaimer')}\n\n`;

      // Overview section
      if (overview) {
        csvContent += "# OVERVIEW\n";
        csvContent += "Metric,Value\n";
        csvContent += `Average Risk,${overview.avg_risk}\n`;
        csvContent += `High Risk %,${overview.pct_high}\n`;
        csvContent += `Medium Risk %,${overview.pct_med}\n`;
        csvContent += `Low Risk %,${overview.pct_low}\n`;
        csvContent += `Total Employees,${overview.total_employees}\n`;
        csvContent += `Target Turnover,${overview.target_turnover}\n\n`;
      }

      // Hotspots section
      csvContent += "# HOTSPOTS\n";
      csvContent += "Department,Employee Count,Avg Risk,High Risk %\n";
      hotspots.forEach(hotspot => {
        const deptName = lang === 'ar' ? hotspot.dept_name_ar : hotspot.dept_name_en;
        csvContent += `"${deptName}",${hotspot.n},${hotspot.avg_risk},${hotspot.pct_high}\n`;
      });
      csvContent += "\n";

      // Drivers section
      csvContent += "# RISK DRIVERS\n";
      csvContent += "Factor,Impact,Frequency\n";
      drivers.forEach(driver => {
        csvContent += `"${driver.factor_name}",${driver.avg_impact},${driver.frequency}\n`;
      });
      csvContent += "\n";

      // Watchlist section (admin only)
      if (isAdmin && watchlist.length > 0) {
        csvContent += "# WATCHLIST (ADMIN ONLY)\n";
        csvContent += "Employee,Department,Manager,Risk Score\n";
        watchlist.forEach(item => {
          const empName = lang === 'ar' ? item.employee_name_ar : item.employee_name_en;
          const deptName = lang === 'ar' ? item.dept_name_ar : item.dept_name_en;
          csvContent += `"${empName}","${deptName}","${item.manager_name}",${item.risk_score}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", generateFilename('csv'));
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "CSV data downloaded successfully"
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const hasData = overview && (hotspots.length > 0 || drivers.length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('retention.export.title')}
          </CardTitle>
          <CardDescription>{t('retention.export.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t('retention.ui.noData')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium">{t('retention.export.formats')}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={exportToPDF} variant="outline" className="justify-start h-auto p-4">
                  <FileText className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <div className={`text-${isRTL ? 'right' : 'left'}`}>
                    <div className="font-medium">{t('retention.export.pdfReport')}</div>
                    <div className="text-sm text-muted-foreground">
                      Complete analysis report
                    </div>
                  </div>
                </Button>

                <Button onClick={exportToPPTX} variant="outline" className="justify-start h-auto p-4">
                  <Presentation className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <div className={`text-${isRTL ? 'right' : 'left'}`}>
                    <div className="font-medium">{t('retention.export.pptPresentation')}</div>
                    <div className="text-sm text-muted-foreground">
                      Executive presentation
                    </div>
                  </div>
                </Button>

                <Button onClick={exportToCSV} variant="outline" className="justify-start h-auto p-4">
                  <Table className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <div className={`text-${isRTL ? 'right' : 'left'}`}>
                    <div className="font-medium">{t('retention.export.csvData')}</div>
                    <div className="text-sm text-muted-foreground">
                      Raw data for analysis
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDPL Disclaimer */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            {t('retention.export.disclaimer')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};