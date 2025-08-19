import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Presentation, 
  Database, 
  Download, 
  Calendar,
  Filter,
  Settings,
  Share,
  Clock
} from 'lucide-react';

const Export: React.FC = () => {
  const isArabic = false; // TODO: Implement i18n

  const exportTemplates = [
    {
      id: 'executive-summary',
      title: isArabic ? 'ملخص تنفيذي' : 'Executive Summary',
      description: isArabic ? 'تقرير موجز للإدارة العليا مع النتائج الرئيسية' : 'Concise report for senior management with key findings',
      format: 'PDF',
      pages: 8,
      sections: [isArabic ? 'النتائج' : 'Key Findings', isArabic ? 'التوصيات' : 'Recommendations', isArabic ? 'خطة العمل' : 'Action Plan'],
      audience: isArabic ? 'الإدارة العليا' : 'Senior Management'
    },
    {
      id: 'detailed-analysis',
      title: isArabic ? 'تحليل مفصل' : 'Detailed Analysis',
      description: isArabic ? 'تقرير شامل مع جميع الأطر والتحليلات' : 'Comprehensive report with all frameworks and analyses',
      format: 'PDF',
      pages: 45,
      sections: [isArabic ? 'CVF' : 'CVF', isArabic ? 'الشبكة الثقافية' : 'Cultural Web', isArabic ? 'باريت' : 'Barrett', isArabic ? 'هوفستيد' : 'Hofstede'],
      audience: isArabic ? 'فريق الموارد البشرية' : 'HR Team'
    },
    {
      id: 'stakeholder-presentation',
      title: isArabic ? 'عرض أصحاب المصلحة' : 'Stakeholder Presentation',
      description: isArabic ? 'عرض تقديمي تفاعلي للأطراف المعنية' : 'Interactive presentation for stakeholders',
      format: 'PPTX',
      pages: 25,
      sections: [isArabic ? 'النظرة العامة' : 'Overview', isArabic ? 'النتائج' : 'Findings', isArabic ? 'المبادرات' : 'Initiatives'],
      audience: isArabic ? 'أصحاب المصلحة' : 'Stakeholders'
    },
    {
      id: 'raw-data',
      title: isArabic ? 'البيانات الخام' : 'Raw Data Export',
      description: isArabic ? 'تصدير جميع البيانات والمقاييس للتحليل الإضافي' : 'Export all data and metrics for additional analysis',
      format: 'CSV',
      pages: 0,
      sections: [isArabic ? 'المسوح' : 'Surveys', isArabic ? 'المقاييس' : 'Metrics', isArabic ? 'الاتجاهات' : 'Trends'],
      audience: isArabic ? 'محللو البيانات' : 'Data Analysts'
    }
  ];

  const recentExports = [
    {
      name: isArabic ? 'تقرير الربع الأول 2024' : 'Q1 2024 Report',
      format: 'PDF',
      size: '2.4 MB',
      date: '2024-01-15',
      downloads: 23
    },
    {
      name: isArabic ? 'عرض مجلس الإدارة' : 'Board Presentation',
      format: 'PPTX',
      size: '8.7 MB',
      date: '2024-01-10',
      downloads: 12
    },
    {
      name: isArabic ? 'بيانات تحليل الاتجاهات' : 'Trend Analysis Data',
      format: 'CSV',
      size: '145 KB',
      date: '2024-01-08',
      downloads: 7
    }
  ];

  const exportOptions = [
    { id: 'include-charts', label: isArabic ? 'تضمين الرسوم البيانية' : 'Include Charts' },
    { id: 'include-recommendations', label: isArabic ? 'تضمين التوصيات' : 'Include Recommendations' },
    { id: 'include-raw-data', label: isArabic ? 'تضمين البيانات الخام' : 'Include Raw Data' },
    { id: 'anonymize-data', label: isArabic ? 'إخفاء هوية البيانات' : 'Anonymize Data' },
    { id: 'watermark', label: isArabic ? 'إضافة العلامة المائية' : 'Add Watermark' }
  ];

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="h-4 w-4" />;
      case 'PPTX': return <Presentation className="h-4 w-4" />;
      case 'CSV': return <Database className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'text-red-600 bg-red-100';
      case 'PPTX': return 'text-orange-600 bg-orange-100';
      case 'CSV': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'تصدير التقارير' : 'Export Reports'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية - تصدير PDF/PPTX/CSV' : 'AqlHR — PDF/PPTX/CSV Export'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {isArabic ? 'تصدير سريع' : 'Quick Export'}
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {isArabic ? 'إعدادات التصدير' : 'Export Settings'}
            </Button>
          </div>
        </div>

        {/* Export Configuration */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">{isArabic ? 'القوالب' : 'Templates'}</TabsTrigger>
            <TabsTrigger value="custom">{isArabic ? 'تصدير مخصص' : 'Custom Export'}</TabsTrigger>
            <TabsTrigger value="history">{isArabic ? 'سجل التصدير' : 'Export History'}</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exportTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <div className={`p-2 rounded-full ${getFormatColor(template.format)}`}>
                        {getFormatIcon(template.format)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'التنسيق' : 'Format'}</span>
                      <Badge variant="outline">{template.format}</Badge>
                    </div>
                    
                    {template.pages > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{isArabic ? 'الصفحات' : 'Pages'}</span>
                        <span>{template.pages}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'الجمهور المستهدف' : 'Target Audience'}</span>
                      <span>{template.audience}</span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">{isArabic ? 'الأقسام المضمنة' : 'Included Sections'}</div>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        {isArabic ? 'تصدير الآن' : 'Export Now'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Export Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {isArabic ? 'إعدادات التصدير' : 'Export Configuration'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'تخصيص المحتوى والتنسيق' : 'Customize content and format'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isArabic ? 'تنسيق الملف' : 'File Format'}
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={isArabic ? 'اختر التنسيق' : 'Select format'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="excel">Excel (XLSX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isArabic ? 'الفترة الزمنية' : 'Time Period'}
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={isArabic ? 'اختر الفترة' : 'Select period'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-30">{isArabic ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
                        <SelectItem value="last-60">{isArabic ? 'آخر 60 يوم' : 'Last 60 days'}</SelectItem>
                        <SelectItem value="last-90">{isArabic ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
                        <SelectItem value="custom">{isArabic ? 'فترة مخصصة' : 'Custom period'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      {isArabic ? 'خيارات التصدير' : 'Export Options'}
                    </label>
                    <div className="space-y-3">
                      {exportOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox id={option.id} />
                          <label
                            htmlFor={option.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {isArabic ? 'معاينة التصدير' : 'Export Preview'}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? 'معاينة المحتوى المحدد' : 'Preview of selected content'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-2">
                        {isArabic ? 'تقرير ذكاء الثقافة المؤسسية' : 'Corporate Culture Intelligence Report'}
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• {isArabic ? 'درجة التوازن الثقافي: 78%' : 'Culture Balance Score: 78%'}</div>
                        <div>• {isArabic ? 'مؤشر الأمان النفسي: 82%' : 'Psychological Safety Index: 82%'}</div>
                        <div>• {isArabic ? 'محاذاة القيم: 65%' : 'Values Alignment: 65%'}</div>
                        <div>• {isArabic ? '12 مبادرة مقترحة' : '12 recommended initiatives'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'الحجم المتوقع' : 'Estimated Size'}</span>
                      <span>~3.2 MB</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'وقت التوليد' : 'Generation Time'}</span>
                      <span>~30 {isArabic ? 'ثانية' : 'seconds'}</span>
                    </div>
                    
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      {isArabic ? 'توليد وتحميل' : 'Generate & Download'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {isArabic ? 'سجل التصدير الأخير' : 'Recent Export History'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'التقارير والملفات المصدرة مؤخراً' : 'Recently exported reports and files'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExports.map((exportItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${getFormatColor(exportItem.format)}`}>
                          {getFormatIcon(exportItem.format)}
                        </div>
                        <div>
                          <h4 className="font-medium">{exportItem.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {exportItem.size} • {exportItem.date} • {exportItem.downloads} {isArabic ? 'تحميل' : 'downloads'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Export;