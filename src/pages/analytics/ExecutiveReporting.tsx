import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AqlHRAIAssistant } from '@/components/ai';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/i18n/format";
import { 
  TrendingUp, 
  TrendingDown, 
  Users,
  Target, 
  Award, 
  Calendar,
  FileText,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

interface ExecutiveKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit: 'currency' | 'percentage' | 'number';
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface StrategicInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  urgency: 'immediate' | 'short-term' | 'long-term';
  recommendation: string;
}

const ExecutiveReporting = () => {
  const lang = 'en';
  const { analyticsData, loading } = useAnalytics();
  const { series } = useDashboardTrends(365); // Full year data
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Executive KPIs
  const executiveKPIs: ExecutiveKPI[] = [
    {
      id: 'revenue',
      title: 'Revenue Growth',
      value: 23.7,
      target: 25.0,
      change: 5.2,
      trend: 'up',
      unit: 'percentage',
      status: 'good'
    },
    {
      id: 'engagement',
      title: 'Employee Engagement',
      value: 8.4,
      target: 8.5,
      change: 0.3,
      trend: 'up',
      unit: 'number',
      status: 'good'
    },
    {
      id: 'efficiency',
      title: 'Operational Efficiency',
      value: 87.2,
      target: 90.0,
      change: -2.1,
      trend: 'down',
      unit: 'percentage',
      status: 'warning'
    },
    {
      id: 'profit',
      title: 'Profit Margin',
      value: 15.8,
      target: 18.0,
      change: 1.4,
      trend: 'up',
      unit: 'percentage',
      status: 'warning'
    },
    {
      id: 'market',
      title: 'Market Share',
      value: 12.3,
      target: 15.0,
      change: 0.8,
      trend: 'up',
      unit: 'percentage',
      status: 'good'
    },
    {
      id: 'satisfaction',
      title: 'Customer Satisfaction',
      value: 91.5,
      target: 95.0,
      change: 2.3,
      trend: 'up',
      unit: 'percentage',
      status: 'good'
    }
  ];

  // Strategic insights
  const strategicInsights: StrategicInsight[] = [
    {
      id: '1',
      category: 'Growth',
      title: 'Digital Transformation Acceleration',
      description: 'Market analysis shows 40% increase in digital adoption across our sector',
      impact: 'high',
      urgency: 'immediate',
      recommendation: 'Increase digital transformation budget by 25% for Q2'
    },
    {
      id: '2',
      category: 'Risk',
      title: 'Talent Retention Challenge',
      description: 'Key personnel turnover risk identified in technology division',
      impact: 'high',
      urgency: 'short-term',
      recommendation: 'Implement retention program and salary benchmarking'
    },
    {
      id: '3',
      category: 'Opportunity',
      title: 'Market Expansion Potential',
      description: 'New regulatory changes open opportunities in adjacent markets',
      impact: 'medium',
      urgency: 'long-term',
      recommendation: 'Conduct feasibility study for market entry by Q3'
    },
    {
      id: '4',
      category: 'Efficiency',
      title: 'Process Automation Gains',
      description: 'AI implementation showing 35% efficiency improvement in operations',
      impact: 'medium',
      urgency: 'short-term',
      recommendation: 'Scale automation to additional departments'
    }
  ];

  // Financial performance data
  const financialData = series?.slice(-12).map((item, index) => ({
    month: new Date(Date.now() - (11 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
    revenue: (item.total_employees || 100) * 50000 + Math.floor(Math.random() * 200000),
    profit: (item.total_employees || 100) * 8000 + Math.floor(Math.random() * 50000),
    costs: (item.total_employees || 100) * 42000 + Math.floor(Math.random() * 100000),
    efficiency: item.saudization_rate || Math.floor(Math.random() * 20) + 80
  })) || [];

  // Department performance data
  const departmentData = [
    { name: 'Technology', efficiency: 94, satisfaction: 89, revenue: 4200000 },
    { name: 'Sales', efficiency: 87, satisfaction: 85, revenue: 3800000 },
    { name: 'Marketing', efficiency: 91, satisfaction: 92, revenue: 2100000 },
    { name: 'Operations', efficiency: 83, satisfaction: 78, revenue: 1900000 },
    { name: 'HR', efficiency: 88, satisfaction: 91, revenue: 800000 }
  ];

  // Metrics
  const metrics = {
    executiveReports: 23,
    kpisTracked: executiveKPIs.length,
    monthlyReviews: 12,
    decisionImpact: 94
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatKPIValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency': return formatCurrency(value, lang);
      case 'percentage': return formatPercent(value / 100, lang);
      case 'number': return formatNumber(value, lang);
      default: return value.toString();
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'analytics.executiveReporting.title': { en: 'Executive Reporting', ar: 'التقارير التنفيذية' },
      'analytics.executiveReporting.description': { en: 'C-level dashboards and executive insights', ar: 'لوحات تحكم للمستوى التنفيذي ورؤى المديرين' },
      'analytics.executiveReporting.executiveDashboard': { en: 'Executive Dashboard', ar: 'لوحة التحكم التنفيذية' },
      'analytics.executiveReporting.strategicMetrics': { en: 'Strategic Metrics', ar: 'المقاييس الاستراتيجية' },
      'analytics.executiveReporting.businessIntelligence': { en: 'Business Intelligence', ar: 'ذكاء الأعمال' },
      'analytics.executiveReporting.generateReport': { en: 'Generate Report', ar: 'إنشاء تقرير' },
      'analytics.executiveReporting.exportExecutive': { en: 'Export Executive Summary', ar: 'تصدير الملخص التنفيذي' },
      'analytics.executiveReporting.kpiOverview': { en: 'KPI Overview', ar: 'نظرة عامة على مؤشرات الأداء' },
      'analytics.executiveReporting.metrics.executiveReports': { en: 'Executive Reports', ar: 'التقارير التنفيذية' },
      'analytics.executiveReporting.metrics.kpisTracked': { en: 'KPIs Tracked', ar: 'مؤشرات الأداء المتتبعة' },
      'analytics.executiveReporting.metrics.monthlyReviews': { en: 'Monthly Reviews', ar: 'المراجعات الشهرية' },
      'analytics.executiveReporting.metrics.decisionImpact': { en: 'Decision Impact', ar: 'تأثير القرارات' },
      'analytics.executiveReporting.timeframes.quarterly': { en: 'Quarterly', ar: 'ربع سنوي' },
      'analytics.executiveReporting.timeframes.monthly': { en: 'Monthly', ar: 'شهري' },
      'analytics.executiveReporting.timeframes.yearly': { en: 'Yearly', ar: 'سنوي' }
    };
    
    return translations[key]?.[lang] || key;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.executiveReporting.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.executiveReporting.description')}</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t('analytics.executiveReporting.timeframes.monthly')}</SelectItem>
              <SelectItem value="quarterly">{t('analytics.executiveReporting.timeframes.quarterly')}</SelectItem>
              <SelectItem value="yearly">{t('analytics.executiveReporting.timeframes.yearly')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
            <FileText className="mr-2 h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : t('analytics.executiveReporting.generateReport')}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('analytics.executiveReporting.exportExecutive')}
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('analytics.executiveReporting.metrics.executiveReports')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatNumber(metrics.executiveReports, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Generated this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              {t('analytics.executiveReporting.metrics.kpisTracked')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{formatNumber(metrics.kpisTracked, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Strategic indicators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              {t('analytics.executiveReporting.metrics.monthlyReviews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatNumber(metrics.monthlyReviews, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              {t('analytics.executiveReporting.metrics.decisionImpact')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatNumber(metrics.decisionImpact, lang)}%</div>
            <p className="text-sm text-muted-foreground mt-1">Decision accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Executive Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('analytics.executiveReporting.kpiOverview')}
              </CardTitle>
              <CardDescription>
                Strategic performance indicators and targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {executiveKPIs.map((kpi) => (
                  <div key={kpi.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{kpi.title}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(kpi.status)}
                        {getTrendIcon(kpi.trend)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${getStatusColor(kpi.status)}`}>
                          {formatKPIValue(kpi.value, kpi.unit)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Target: {formatKPIValue(kpi.target, kpi.unit)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={(kpi.value / kpi.target) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {kpi.change >= 0 ? '+' : ''}{kpi.change}% vs last period
                        </span>
                        <Badge variant={kpi.status === 'excellent' || kpi.status === 'good' ? 'default' : 'destructive'}>
                          {kpi.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Insights */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Strategic Insights
              </CardTitle>
              <CardDescription>
                Key business intelligence and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{insight.category}</Badge>
                      <Badge variant={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-sm">{insight.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="border-t pt-2">
                      <p className="text-xs font-medium">Recommendation:</p>
                      <p className="text-xs text-muted-foreground">
                        {insight.recommendation}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        {insight.urgency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Performance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyIcon className="h-5 w-5" />
            {t('analytics.executiveReporting.businessIntelligence')}
          </CardTitle>
          <CardDescription>
            Financial performance and operational metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financial">Financial Performance</TabsTrigger>
              <TabsTrigger value="departments">Department Analysis</TabsTrigger>
              <TabsTrigger value="trends">Market Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Bar yAxisId="left" dataKey="profit" fill="hsl(var(--secondary))" name="Profit" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="hsl(var(--accent))" strokeWidth={3} name="Efficiency %" />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="departments" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="hsl(var(--primary))" name="Efficiency %" />
                  <Bar dataKey="satisfaction" fill="hsl(var(--secondary))" name="Satisfaction %" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    opacity={0.6}
                    name="Revenue Trend"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.executive" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ExecutiveReporting;