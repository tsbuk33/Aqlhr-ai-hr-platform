import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download, 
  FileText, 
  Image,
  FileSpreadsheet,
  Shield,
  Eye,
  EyeOff,
  Calendar,
  Building
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";

interface ExportOptions {
  includePII: boolean;
  format: 'pptx' | 'pdf' | 'csv' | 'all';
  language: 'ar' | 'en';
}

interface OSIExportProps {
  caseId: string;
}

export const OSIExport = ({ caseId }: OSIExportProps) => {
  const [options, setOptions] = useState<ExportOptions>({
    includePII: false,
    format: 'pptx',
    language: 'ar'
  });
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasRole } = useUserRole();

  const canIncludePII = hasRole('admin') || hasRole('hr_manager');

  const exportOSIReport = async () => {
    try {
      setExporting(true);
      
      // Call export function
      const { data: result, error } = await supabase.functions.invoke('cci-exports', {
        body: { 
          caseId,
          exportType: 'osi_report',
          format: options.format,
          language: options.language,
          includePII: options.includePII,
          slides: [
            'cover',
            'method',
            'headcount_layers',
            'spans_analysis',
            'saudization_layer',
            'cost_manage',
            'hotspots_dept',
            'evidence_flags',
            'initiatives',
            'next_steps'
          ]
        }
      });

      if (error) throw error;
      
      setLastExport(new Date().toISOString());
      toast({
        title: "تم تصدير التقرير",
        description: "تم إنشاء تقرير OSI بنجاح",
      });

    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "فشل التصدير",
        description: "فشل في إنشاء التقرير",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pptx': return <Image className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'csv': return <FileSpreadsheet className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  const getFormatName = (format: string) => {
    switch (format) {
      case 'pptx': return 'عرض تقديمي (PowerPoint)';
      case 'pdf': return 'ملف PDF';
      case 'csv': return 'بيانات Excel/CSV';
      case 'all': return 'جميع التنسيقات';
      default: return format;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            خيارات التصدير
          </CardTitle>
          <CardDescription>
            تخصيص تقرير ذكاء الهيكل التنظيمي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">تنسيق التصدير</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['pptx', 'pdf', 'csv', 'all'].map((format) => (
                  <Card 
                    key={format}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      options.format === format ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setOptions(prev => ({ ...prev, format: format as any }))}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {getFormatIcon(format)}
                        <span className="text-xs font-medium">
                          {getFormatName(format)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">اللغة</label>
              <div className="flex gap-3">
                <Card 
                  className={`cursor-pointer flex-1 ${
                    options.language === 'ar' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setOptions(prev => ({ ...prev, language: 'ar' }))}
                >
                  <CardContent className="p-3 text-center">
                    <span className="font-medium">العربية</span>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer flex-1 ${
                    options.language === 'en' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setOptions(prev => ({ ...prev, language: 'en' }))}
                >
                  <CardContent className="p-3 text-center">
                    <span className="font-medium">English</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* PII Options (Admin Only) */}
            {canIncludePII && (
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  خيارات الخصوصية
                </label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="include-pii"
                    checked={options.includePII}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includePII: Boolean(checked) }))
                    }
                  />
                  <label htmlFor="include-pii" className="text-sm flex items-center gap-2">
                    {options.includePII ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    تضمين أسماء الموظفين (للمدراء فقط)
                  </label>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Shield className="h-4 w-4 inline mr-2" />
                  بشكل افتراضي، يتم إخفاء البيانات الشخصية للامتثال لنظام حماية البيانات السعودي
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle>محتوى التقرير</CardTitle>
          <CardDescription>10 شرائح شاملة لتقرير ذكاء الهيكل التنظيمي</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "الغلاف", description: "معلومات المنظمة والتاريخ" },
              { title: "المنهجية", description: "طريقة التحليل والمعايير" },
              { title: "الموظفين والطبقات", description: "إحصائيات الموظفين والهيكل" },
              { title: "تحليل النطاقات", description: "P90/متوسط نطاقات الإدارة" },
              { title: "السعودة بالطبقات", description: "توزيع السعوديين حسب المستوى" },
              { title: "تكلفة الإدارة", description: "نسبة التكلفة والمعايير" },
              { title: "النقاط الساخنة", description: "التحديات بالأقسام" },
              { title: "الأدلة", description: "العلامات والمؤشرات" },
              { title: "المبادرات", description: "التوصيات والإجراءات" },
              { title: "الخطوات التالية", description: "خطة التنفيذ" }
            ].map((slide, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{slide.title}</div>
                  <div className="text-xs text-muted-foreground">{slide.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تصدير التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={exportOSIReport} 
              disabled={exporting}
              className="flex-1"
              size="lg"
            >
              {getFormatIcon(options.format)}
              {exporting ? "جاري التصدير..." : `تصدير ${getFormatName(options.format)}`}
            </Button>
            
            {lastExport && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                آخر تصدير: {new Date(lastExport).toLocaleString('ar-SA')}
              </div>
            )}
          </div>
          
          {/* PDPL Compliance Footer */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-primary mb-1">الامتثال لنظام حماية البيانات</div>
                <div className="text-muted-foreground">
                  جميع التقارير المُصدرة تتوافق مع نظام حماية البيانات السعودي (PDPL). 
                  البيانات الشخصية محمية ولا يتم تضمينها إلا بصلاحيات خاصة.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};