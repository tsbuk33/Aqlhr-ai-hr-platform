import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Users, 
  BarChart3,
  TrendingUp,
  Shield,
  Plus,
  Eye,
  Share,
  Settings,
  Sparkles
} from 'lucide-react';

interface BoardReport {
  id: string;
  title: string;
  titleAr: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'adhoc';
  status: 'draft' | 'generating' | 'ready' | 'sent';
  sections: string[];
  createdAt: string;
  scheduledFor?: string;
  recipients: string[];
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

interface ReportTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  sections: string[];
  frequency: 'monthly' | 'quarterly' | 'annual';
}

interface BoardReportGenerationProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const BoardReportGeneration: React.FC<BoardReportGenerationProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [reports, setReports] = useState<BoardReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showNewReportForm, setShowNewReportForm] = useState(false);

  useEffect(() => {
    loadReports();
    loadTemplates();
  }, []);

  const loadReports = () => {
    const reportData: BoardReport[] = [
      {
        id: 'report_001',
        title: 'Q4 2024 Executive Summary',
        titleAr: 'الملخص التنفيذي للربع الرابع 2024',
        type: 'quarterly',
        status: 'ready',
        sections: ['Financial Performance', 'HR Metrics', 'Strategic Initiatives', 'Risk Assessment'],
        createdAt: new Date().toISOString(),
        recipients: ['board@company.com', 'ceo@company.com'],
        confidentialityLevel: 'confidential'
      },
      {
        id: 'report_002',
        title: 'Monthly HR Dashboard - December',
        titleAr: 'لوحة الموارد البشرية الشهرية - ديسمبر',
        type: 'monthly',
        status: 'generating',
        sections: ['Recruitment', 'Performance', 'Training', 'Saudization'],
        createdAt: new Date().toISOString(),
        recipients: ['hr-team@company.com'],
        confidentialityLevel: 'internal'
      },
      {
        id: 'report_003',
        title: 'Crisis Response Analysis',
        titleAr: 'تحليل الاستجابة للأزمات',
        type: 'adhoc',
        status: 'draft',
        sections: ['Incident Overview', 'Response Timeline', 'Impact Assessment', 'Lessons Learned'],
        createdAt: new Date().toISOString(),
        recipients: ['crisis-team@company.com'],
        confidentialityLevel: 'restricted'
      }
    ];
    setReports(reportData);
  };

  const loadTemplates = () => {
    const templateData: ReportTemplate[] = [
      {
        id: 'template_001',
        name: 'Executive Board Report',
        nameAr: 'تقرير مجلس الإدارة التنفيذي',
        description: 'Comprehensive quarterly report for board members',
        descriptionAr: 'تقرير ربع سنوي شامل لأعضاء مجلس الإدارة',
        sections: ['Executive Summary', 'Financial Performance', 'Strategic Initiatives', 'Risk Management', 'Future Outlook'],
        frequency: 'quarterly'
      },
      {
        id: 'template_002',
        name: 'HR Performance Dashboard',
        nameAr: 'لوحة أداء الموارد البشرية',
        description: 'Monthly HR metrics and analytics report',
        descriptionAr: 'تقرير شهري لمقاييس وتحليلات الموارد البشرية',
        sections: ['Workforce Analytics', 'Recruitment Updates', 'Performance Metrics', 'Training Progress', 'Compliance Status'],
        frequency: 'monthly'
      },
      {
        id: 'template_003',
        name: 'Annual Strategic Review',
        nameAr: 'المراجعة الاستراتيجية السنوية',
        description: 'Comprehensive annual performance and strategy review',
        descriptionAr: 'مراجعة شاملة سنوية للأداء والاستراتيجية',
        sections: ['Year in Review', 'Strategic Goals Achievement', 'Market Analysis', 'Future Strategy', 'Resource Planning'],
        frequency: 'annual'
      }
    ];
    setTemplates(templateData);
  };

  const generateReport = async (templateId: string) => {
    setIsGenerating(true);
    // Simulate AI report generation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newReport: BoardReport = {
        id: `report_${Date.now()}`,
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        titleAr: `${template.nameAr} - ${new Date().toLocaleDateString()}`,
        type: template.frequency as any,
        status: 'ready',
        sections: template.sections,
        createdAt: new Date().toISOString(),
        recipients: [],
        confidentialityLevel: 'confidential'
      };
      
      setReports(prev => [newReport, ...prev]);
    }
    
    setIsGenerating(false);
    setShowNewReportForm(false);
  };

  const getStatusColor = (status: BoardReport['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'generating':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'sent':
        return 'bg-purple-100 text-purple-700';
    }
  };

  const getConfidentialityBadge = (level: BoardReport['confidentialityLevel']) => {
    const colors = {
      public: 'bg-green-100 text-green-700',
      internal: 'bg-blue-100 text-blue-700',
      confidential: 'bg-orange-100 text-orange-700',
      restricted: 'bg-red-100 text-red-700'
    };

    const labels = {
      public: isArabic ? 'عام' : 'Public',
      internal: isArabic ? 'داخلي' : 'Internal',
      confidential: isArabic ? 'سري' : 'Confidential',
      restricted: isArabic ? 'محدود' : 'Restricted'
    };

    return (
      <Badge className={colors[level]}>
        <Shield className="h-3 w-3 mr-1" />
        {labels[level]}
      </Badge>
    );
  };

  const getTypeIcon = (type: BoardReport['type']) => {
    switch (type) {
      case 'monthly':
        return <Calendar className="h-4 w-4" />;
      case 'quarterly':
        return <BarChart3 className="h-4 w-4" />;
      case 'annual':
        return <TrendingUp className="h-4 w-4" />;
      case 'adhoc':
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isArabic ? 'إنشاء تقارير مجلس الإدارة' : 'Board Report Generation'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewReportForm(!showNewReportForm)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Report Form */}
        {showNewReportForm && (
          <Card className="border-2 border-dashed">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">
                    {isArabic ? 'اختر القالب' : 'Select Template'}
                  </Label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="">
                      {isArabic ? 'اختر قالب...' : 'Select a template...'}
                    </option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {isArabic ? template.nameAr : template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTemplate && (
                  <div className="space-y-2">
                    <Label>
                      {isArabic ? 'أقسام التقرير' : 'Report Sections'}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {templates.find(t => t.id === selectedTemplate)?.sections.map((section, index) => (
                        <Badge key={index} variant="secondary">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => selectedTemplate && generateReport(selectedTemplate)}
                    disabled={!selectedTemplate || isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        {isArabic ? 'جاري الإنشاء...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewReportForm(false)}
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(report.type)}
                      <div>
                        <h4 className="font-medium">
                          {isArabic ? report.titleAr : report.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? 'تم الإنشاء في' : 'Created'}: {
                            new Date(report.createdAt).toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      {getConfidentialityBadge(report.confidentialityLevel)}
                    </div>
                  </div>

                  {expanded && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">
                          {isArabic ? 'أقسام التقرير:' : 'Report Sections:'}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {report.sections.map((section, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {report.recipients.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">
                            {isArabic ? 'المستلمون:' : 'Recipients:'}
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {report.recipients.map((recipient, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-2">
                    {report.status === 'ready' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {isArabic ? 'معاينة' : 'Preview'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {isArabic ? 'تحميل' : 'Download'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          {isArabic ? 'مشاركة' : 'Share'}
                        </Button>
                      </>
                    )}
                    {report.status === 'generating' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        {isArabic ? 'جاري إنشاء التقرير بالذكاء الاصطناعي...' : 'AI generating report...'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Status */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {isArabic ? 'مولد التقارير بالذكاء الاصطناعي' : 'AI Report Generator'}
                </span>
              </div>
              <Badge variant="secondary">
                {isArabic ? 'جاهز' : 'Ready'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};