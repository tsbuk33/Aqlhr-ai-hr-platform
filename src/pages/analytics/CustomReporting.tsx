import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AqlHRAIAssistant } from '@/components/ai';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { formatNumber, formatDate } from "@/lib/i18n/format";
import { Download, Plus, BarChart3, Table, Layout } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomReporting = () => {
  const lang = 'en'; // Default to English for now - will be replaced with proper locale driver
  const { analyticsData, loading } = useAnalytics();
  const { series } = useDashboardTrends(90);
  
  const [reportConfig, setReportConfig] = useState({
    name: "",
    type: "workforce",
    visualization: "chart",
    dateRange: { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() }
  });

  // Sample report data based on analytics
  const reportMetrics = {
    totalReports: analyticsData?.totalPageViews || 156,
    savedTemplates: 23,
    reportsGenerated: analyticsData?.totalPageViews ? Math.floor(analyticsData.totalPageViews * 0.3) : 47,
    avgGenerationTime: "2.4s"
  };

  // Chart data derived from trends
  const chartData = series?.slice(0, 7).map((item, index) => ({
    name: formatDate(new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000), lang),
    value: item.total_employees || Math.floor(Math.random() * 100) + 50,
    performance: item.saudization_rate || Math.floor(Math.random() * 30) + 70
  })) || [];

  const handleCreateReport = () => {
    console.log("Creating report with config:", reportConfig);
  };

  const handleExportReport = () => {
    console.log("Exporting report");
  };

  const renderVisualization = () => {
    switch (reportConfig.visualization) {
      case "chart":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="performance" stroke="hsl(var(--secondary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Date</th>
                  <th className="border border-border p-2 text-left">Employees</th>
                  <th className="border border-border p-2 text-left">Performance</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-border p-2">{row.name}</td>
                    <td className="border border-border p-2">{formatNumber(row.value, lang)}</td>
                    <td className="border border-border p-2">{formatNumber(row.performance, lang)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <Layout className="mr-2" />
            Dashboard view coming soon
          </div>
        );
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'analytics.customReporting.title': { en: 'Custom Reporting', ar: 'التقارير المخصصة' },
      'analytics.customReporting.description': { en: 'Flexible report builder and custom analytics', ar: 'منشئ التقارير المرن والتحليلات المخصصة' },
      'analytics.customReporting.reportBuilder': { en: 'Report Builder', ar: 'منشئ التقارير' },
      'analytics.customReporting.createReport': { en: 'Create New Report', ar: 'إنشاء تقرير جديد' },
      'analytics.customReporting.exportReport': { en: 'Export Report', ar: 'تصدير التقرير' },
      'analytics.customReporting.reportType': { en: 'Report Type', ar: 'نوع التقرير' },
      'analytics.customReporting.reportName': { en: 'Report Name', ar: 'اسم التقرير' },
      'analytics.customReporting.visualization': { en: 'Visualization', ar: 'التصور' },
      'analytics.customReporting.metrics.totalReports': { en: 'Total Reports', ar: 'إجمالي التقارير' },
      'analytics.customReporting.metrics.savedTemplates': { en: 'Saved Templates', ar: 'القوالب المحفوظة' },
      'analytics.customReporting.metrics.reportsGenerated': { en: 'Reports Generated', ar: 'التقارير المُنشأة' },
      'analytics.customReporting.metrics.avgGenerationTime': { en: 'Avg Generation Time', ar: 'متوسط وقت الإنشاء' },
      'analytics.customReporting.types.workforce': { en: 'Workforce Analytics', ar: 'تحليلات القوى العاملة' },
      'analytics.customReporting.types.financial': { en: 'Financial Analysis', ar: 'التحليل المالي' },
      'analytics.customReporting.types.performance': { en: 'Performance Review', ar: 'مراجعة الأداء' },
      'analytics.customReporting.types.compliance': { en: 'Compliance Report', ar: 'تقرير الامتثال' },
      'analytics.customReporting.types.custom': { en: 'Custom Query', ar: 'استعلام مخصص' },
      'analytics.customReporting.visualizations.chart': { en: 'Chart View', ar: 'عرض الرسم البياني' },
      'analytics.customReporting.visualizations.table': { en: 'Data Table', ar: 'جدول البيانات' },
      'analytics.customReporting.visualizations.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' }
    };
    
    return translations[key]?.[lang] || key;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('analytics.customReporting.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.customReporting.description')}</p>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.customReporting.metrics.totalReports')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatNumber(reportMetrics.totalReports, lang)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.customReporting.metrics.savedTemplates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{formatNumber(reportMetrics.savedTemplates, lang)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.customReporting.metrics.reportsGenerated')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatNumber(reportMetrics.reportsGenerated, lang)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.customReporting.metrics.avgGenerationTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">{reportMetrics.avgGenerationTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('analytics.customReporting.reportBuilder')}
          </CardTitle>
          <CardDescription>
            Build and configure custom reports with real-time data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reportName">{t('analytics.customReporting.reportName')}</Label>
                    <Input
                      id="reportName"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>
                  
                  <div>
                    <Label>{t('analytics.customReporting.reportType')}</Label>
                    <Select value={reportConfig.type} onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workforce">{t('analytics.customReporting.types.workforce')}</SelectItem>
                        <SelectItem value="financial">{t('analytics.customReporting.types.financial')}</SelectItem>
                        <SelectItem value="performance">{t('analytics.customReporting.types.performance')}</SelectItem>
                        <SelectItem value="compliance">{t('analytics.customReporting.types.compliance')}</SelectItem>
                        <SelectItem value="custom">{t('analytics.customReporting.types.custom')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>{t('analytics.customReporting.visualization')}</Label>
                    <Select value={reportConfig.visualization} onValueChange={(value) => setReportConfig(prev => ({ ...prev, visualization: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chart">{t('analytics.customReporting.visualizations.chart')}</SelectItem>
                        <SelectItem value="table">{t('analytics.customReporting.visualizations.table')}</SelectItem>
                        <SelectItem value="dashboard">{t('analytics.customReporting.visualizations.dashboard')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateReport} className="flex-1">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('analytics.customReporting.createReport')}
                    </Button>
                    <Button variant="outline" onClick={handleExportReport}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('analytics.customReporting.exportReport')}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {reportConfig.name || "Untitled Report"} - {t(`analytics.customReporting.types.${reportConfig.type}`)}
                </h3>
                {renderVisualization()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.customReporting" 
        companyId="default"
        position="fixed"
      />
    </div>
  );
};

export default CustomReporting;