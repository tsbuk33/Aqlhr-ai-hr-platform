import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield,
  Target,
  Building,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReportTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: 'board' | 'executive' | 'kpi' | 'financial' | 'workforce' | 'compliance' | 'strategic';
  estimatedTime: string;
  sections: string[];
  icon: React.ReactNode;
}

interface BoardReportGeneratorProps {
  isArabic?: boolean;
}

export const BoardReportGenerator: React.FC<BoardReportGeneratorProps> = ({ 
  isArabic = false 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'board-presentation',
      name: 'Board Presentation',
      nameAr: 'عرض مجلس الإدارة',
      description: 'Complete board-ready presentation with KPIs, financials, and strategic updates',
      descriptionAr: 'عرض تقديمي شامل جاهز لمجلس الإدارة مع مؤشرات الأداء والمالية والتحديثات الاستراتيجية',
      type: 'board',
      estimatedTime: '3-5 min',
      sections: ['Executive Summary', 'Financial Performance', 'Workforce Analytics', 'Strategic Initiatives', 'Risk Assessment'],
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      nameAr: 'الملخص التنفيذي',
      description: 'Concise executive overview with key metrics and insights',
      descriptionAr: 'نظرة عامة تنفيذية موجزة مع المقاييس والرؤى الرئيسية',
      type: 'executive',
      estimatedTime: '1-2 min',
      sections: ['Key Highlights', 'Performance Metrics', 'Action Items', 'Next Steps'],
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      id: 'kpi-snapshot',
      name: 'KPI Snapshot',
      nameAr: 'لقطة مؤشرات الأداء',
      description: 'Visual dashboard of key performance indicators',
      descriptionAr: 'لوحة معلومات بصرية لمؤشرات الأداء الرئيسية',
      type: 'kpi',
      estimatedTime: '30 sec',
      sections: ['Core KPIs', 'Trend Analysis', 'Benchmark Comparison'],
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'financial-performance',
      name: 'Financial Performance',
      nameAr: 'الأداء المالي',
      description: 'Comprehensive financial analysis and projections',
      descriptionAr: 'تحليل مالي شامل وتوقعات',
      type: 'financial',
      estimatedTime: '2-3 min',
      sections: ['Revenue Analysis', 'Cost Management', 'Profitability', 'Cash Flow', 'Forecasts'],
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: 'workforce-analytics',
      name: 'Workforce Analytics',
      nameAr: 'تحليلات القوى العاملة',
      description: 'Employee performance, retention, and HR metrics',
      descriptionAr: 'أداء الموظفين والاحتفاظ ومقاييس الموارد البشرية',
      type: 'workforce',
      estimatedTime: '2-3 min',
      sections: ['Headcount Analysis', 'Saudization Status', 'Performance Metrics', 'Retention Analysis'],
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'compliance-report',
      name: 'Government Compliance',
      nameAr: 'الامتثال الحكومي',
      description: 'Regulatory compliance status across all 21 government portals',
      descriptionAr: 'حالة الامتثال التنظيمي عبر جميع البوابات الحكومية الـ21',
      type: 'compliance',
      estimatedTime: '3-4 min',
      sections: ['MOL Compliance', 'GOSI Status', 'NITAQAT Rating', 'ZATCA Compliance', 'Vision 2030 Alignment'],
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'strategic-initiatives',
      name: 'Strategic Initiatives',
      nameAr: 'المبادرات الاستراتيجية',
      description: 'Progress on strategic goals and transformation projects',
      descriptionAr: 'التقدم في الأهداف الاستراتيجية ومشاريع التحول',
      type: 'strategic',
      estimatedTime: '2-3 min',
      sections: ['Initiative Status', 'Milestone Progress', 'Resource Allocation', 'Risk Mitigation'],
      icon: <Target className="h-5 w-5" />
    }
  ];

  const generateReport = async (templateId: string) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate report generation with progress updates
      const progressSteps = [
        { step: 'Gathering data from systems...', progress: 15 },
        { step: 'Analyzing workforce metrics...', progress: 30 },
        { step: 'Processing financial data...', progress: 45 },
        { step: 'Checking compliance status...', progress: 60 },
        { step: 'Generating visualizations...', progress: 75 },
        { step: 'Creating presentation...', progress: 90 },
        { step: 'Finalizing report...', progress: 100 }
      ];

      for (const { step, progress } of progressSteps) {
        setGenerationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call the board report generation edge function
      const { data, error } = await supabase.functions.invoke('generate-board-report', {
        body: {
          templateId,
          language: isArabic ? 'ar' : 'en',
          includeVisuals: true,
          format: 'both' // Generate both PDF and PowerPoint
        }
      });

      if (error) {
        throw error;
      }

      setLastGenerated(new Date());
      toast.success(
        isArabic 
          ? 'تم إنشاء التقرير بنجاح! جاهز للتحميل والمشاركة.' 
          : 'Report generated successfully! Ready for download and sharing.'
      );

      // Auto-download the generated report
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }

    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error(
        isArabic 
          ? 'فشل في إنشاء التقرير. يرجى المحاولة مرة أخرى.' 
          : 'Failed to generate report. Please try again.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const scheduleReport = async (templateId: string, frequency: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('schedule-report', {
        body: {
          templateId,
          frequency, // 'daily', 'weekly', 'monthly'
          language: isArabic ? 'ar' : 'en',
          recipients: ['executive@company.com'] // Would be dynamic based on user
        }
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? `تم جدولة التقرير ${frequency === 'daily' ? 'يومياً' : frequency === 'weekly' ? 'أسبوعياً' : 'شهرياً'}` 
          : `Report scheduled ${frequency}`
      );
    } catch (error) {
      console.error('Failed to schedule report:', error);
      toast.error(
        isArabic 
          ? 'فشل في جدولة التقرير' 
          : 'Failed to schedule report'
      );
    }
  };

  const shareReport = async (format: 'pdf' | 'pptx' | 'both') => {
    try {
      const shareData = {
        title: isArabic ? 'تقرير تنفيذي - AqlHR' : 'Executive Report - AqlHR',
        text: isArabic ? 'تقرير تنفيذي شامل من منصة عقل الموارد البشرية' : 'Comprehensive executive report from AqlHR platform',
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success(
          isArabic 
            ? 'تم نسخ رابط التقرير' 
            : 'Report link copied to clipboard'
        );
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {isArabic ? 'مولد التقارير التنفيذية' : 'Board Report Generator'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? 'إنشاء تقارير احترافية جاهزة للعرض على مجلس الإدارة' 
              : 'Generate professional board-ready reports in minutes'
            }
          </p>
        </div>
        {lastGenerated && (
          <Badge variant="outline" className="text-xs">
            {isArabic ? 'آخر إنشاء: ' : 'Last generated: '}
            {lastGenerated.toLocaleTimeString()}
          </Badge>
        )}
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isArabic ? 'جاري إنشاء التقرير...' : 'Generating report...'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {generationProgress}%
                </span>
              </div>
              <Progress value={generationProgress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 animate-pulse" />
                {isArabic ? 'معالجة البيانات من جميع الأنظمة...' : 'Processing data from all systems...'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {isArabic ? template.nameAr : template.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {isArabic ? template.descriptionAr : template.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {template.estimatedTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 3).map((section, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {section}
                    </Badge>
                  ))}
                  {template.sections.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.sections.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateReport(template.id);
                    }}
                    disabled={isGenerating}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {isArabic ? 'إنشاء' : 'Generate'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      shareReport('both');
                    }}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => generateReport('board-presentation')}
            >
              <Clock className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">
                  {isArabic ? 'عرض فوري' : 'Instant Board Report'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'جاهز في 3 دقائق' : 'Ready in 3 minutes'}
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => scheduleReport('executive-summary', 'weekly')}
            >
              <Calendar className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">
                  {isArabic ? 'تقرير أسبوعي' : 'Weekly Schedule'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'تسليم تلقائي' : 'Auto delivery'}
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => shareReport('both')}
            >
              <Download className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">
                  {isArabic ? 'تحميل وإرسال' : 'Download & Share'}
                </div>
                <div className="text-xs text-muted-foreground">
                  PDF + PowerPoint
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'التقارير الأخيرة' : 'Recent Reports'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">
                    {isArabic ? 'تقرير مجلس الإدارة - ديسمبر 2024' : 'Board Report - December 2024'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'تم الإنشاء منذ ساعة' : 'Generated 1 hour ago'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Download className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-secondary" />
                <div>
                  <p className="font-medium text-sm">
                    {isArabic ? 'ملخص تنفيذي - Q4 2024' : 'Executive Summary - Q4 2024'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'تم الإنشاء أمس' : 'Generated yesterday'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Download className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};