import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Plus, Settings, Download, 
  BarChart3, PieChart, LineChart, Table,
  Filter, Calendar, Users, DollarSign
} from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ReportBuilderPage = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    document.title = isArabic ? 'منشئ التقارير - سند' : 'Report Builder - SanadHR';
  }, [isArabic]);

  const reportTemplates = [
    {
      id: 'employee-summary',
      title: isArabic ? 'ملخص الموظفين' : 'Employee Summary',
      description: isArabic ? 'تقرير شامل عن بيانات الموظفين الأساسية' : 'Comprehensive overview of employee data',
      icon: Users,
      category: isArabic ? 'الموظفين' : 'Employees',
      fields: ['name', 'department', 'position', 'hire_date', 'salary'],
      chartType: 'table'
    },
    {
      id: 'payroll-analysis',
      title: isArabic ? 'تحليل الرواتب' : 'Payroll Analysis',
      description: isArabic ? 'تحليل تفصيلي للرواتب والتكاليف' : 'Detailed analysis of salaries and costs',
      icon: DollarSign,
      category: isArabic ? 'الرواتب' : 'Payroll',
      fields: ['basic_salary', 'allowances', 'deductions', 'net_pay'],
      chartType: 'bar'
    },
    {
      id: 'attendance-report',
      title: isArabic ? 'تقرير الحضور' : 'Attendance Report',
      description: isArabic ? 'تتبع حضور وغياب الموظفين' : 'Track employee attendance and absences',
      icon: Calendar,
      category: isArabic ? 'الحضور' : 'Attendance',
      fields: ['date', 'check_in', 'check_out', 'total_hours', 'overtime'],
      chartType: 'line'
    },
    {
      id: 'department-stats',
      title: isArabic ? 'إحصائيات الأقسام' : 'Department Statistics',
      description: isArabic ? 'إحصائيات وتحليلات حسب القسم' : 'Statistics and analytics by department',
      icon: BarChart3,
      category: isArabic ? 'الأقسام' : 'Departments',
      fields: ['department', 'employee_count', 'avg_salary', 'budget'],
      chartType: 'pie'
    }
  ];

  const chartTypes = [
    { id: 'table', name: isArabic ? 'جدول' : 'Table', icon: Table },
    { id: 'bar', name: isArabic ? 'رسم بياني عمودي' : 'Bar Chart', icon: BarChart3 },
    { id: 'pie', name: isArabic ? 'رسم بياني دائري' : 'Pie Chart', icon: PieChart },
    { id: 'line', name: isArabic ? 'رسم بياني خطي' : 'Line Chart', icon: LineChart }
  ];

  const recentReports = [
    {
      id: 1,
      name: isArabic ? 'تقرير الرواتب - يناير 2024' : 'Payroll Report - January 2024',
      created: isArabic ? 'منذ 3 أيام' : '3 days ago',
      status: 'ready'
    },
    {
      id: 2,
      name: isArabic ? 'تقرير الحضور الشهري' : 'Monthly Attendance Report',
      created: isArabic ? 'منذ أسبوع' : '1 week ago',
      status: 'ready'
    },
    {
      id: 3,
      name: isArabic ? 'إحصائيات الموظفين الجدد' : 'New Employees Statistics',
      created: isArabic ? 'منذ أسبوعين' : '2 weeks ago',
      status: 'processing'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? '📊 منشئ التقارير' : '📊 Report Builder'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'إنشاء وتخصيص التقارير بسهولة' : 'Create and customize reports with ease'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isArabic ? 'تقرير جديد' : 'New Report'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isArabic ? 'قوالب التقارير' : 'Report Templates'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'اختر قالباً لبدء إنشاء التقرير' : 'Choose a template to start building your report'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div 
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge variant="secondary" className="text-xs">
                              {template.fields.length} {isArabic ? 'حقول' : 'fields'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chart Type Selection */}
          {selectedTemplate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isArabic ? 'نوع الرسم البياني' : 'Chart Type'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {chartTypes.map((chart) => {
                    const IconComponent = chart.icon;
                    return (
                      <div 
                        key={chart.id}
                        className="p-3 border rounded-lg cursor-pointer hover:border-primary/50 text-center"
                      >
                        <IconComponent className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-sm font-medium">{chart.name}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Configuration */}
          {selectedTemplate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {isArabic ? 'إعدادات التقرير' : 'Report Configuration'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="report-name">
                    {isArabic ? 'اسم التقرير' : 'Report Name'}
                  </Label>
                  <Input 
                    id="report-name" 
                    placeholder={isArabic ? 'أدخل اسم التقرير' : 'Enter report name'} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="date-range">
                    {isArabic ? 'النطاق الزمني' : 'Date Range'}
                  </Label>
                  <div className="flex gap-2">
                    <Input type="date" />
                    <span className="self-center">{isArabic ? 'إلى' : 'to'}</span>
                    <Input type="date" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {isArabic ? 'فلاتر متقدمة' : 'Advanced Filters'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isArabic ? 'التقارير الأخيرة' : 'Recent Reports'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{report.created}</p>
                    </div>
                    <Badge 
                      variant={report.status === 'ready' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {report.status === 'ready' ? (isArabic ? 'جاهز' : 'Ready') : (isArabic ? 'قيد المعالجة' : 'Processing')}
                    </Badge>
                  </div>
                  {report.status === 'ready' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        {isArabic ? 'عرض' : 'View'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Integration for Report Builder */}
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="report-builder" 
        companyId="demo-company" 
        enabledFeatures={['data-visualization', 'intelligent-automation', 'contextual-help', 'predictive-analytics']}
      />
    </div>
  );
};

export default ReportBuilderPage;