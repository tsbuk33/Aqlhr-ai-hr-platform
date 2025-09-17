import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AqlHRAIAssistant } from '@/components/ai';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/i18n/format";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calculator, 
  Target,
  FileText,
  Download,
  Users,
  Briefcase,
  GraduationCap,
  Building,
  Monitor,
  Scale,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface CostCategory {
  id: string;
  name: string;
  amount: number;
  budget: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  subcategories: SubCategory[];
}

interface SubCategory {
  name: string;
  amount: number;
  percentage: number;
}

interface CostOptimization {
  id: string;
  category: string;
  title: string;
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeline: string;
  status: 'identified' | 'in-progress' | 'completed';
}

const CostAnalytics = () => {
  const lang = 'en';
  const { analyticsData, loading } = useAnalytics();
  const { series } = useDashboardTrends(365);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('yearly');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Cost categories
  const costCategories: CostCategory[] = [
    {
      id: 'salary',
      name: 'Salary & Benefits',
      amount: 8450000,
      budget: 8800000,
      variance: -4.0,
      trend: 'down',
      percentage: 68.5,
      subcategories: [
        { name: 'Base Salaries', amount: 6200000, percentage: 73.4 },
        { name: 'Health Insurance', amount: 850000, percentage: 10.1 },
        { name: 'Bonuses', amount: 720000, percentage: 8.5 },
        { name: 'Retirement Plans', amount: 680000, percentage: 8.0 }
      ]
    },
    {
      id: 'recruitment',
      name: 'Recruitment',
      amount: 1250000,
      budget: 1100000,
      variance: 13.6,
      trend: 'up',
      percentage: 10.1,
      subcategories: [
        { name: 'External Agencies', amount: 680000, percentage: 54.4 },
        { name: 'Job Advertising', amount: 280000, percentage: 22.4 },
        { name: 'Assessment Tools', amount: 190000, percentage: 15.2 },
        { name: 'Interview Costs', amount: 100000, percentage: 8.0 }
      ]
    },
    {
      id: 'training',
      name: 'Training & Development',
      amount: 980000,
      budget: 1200000,
      variance: -18.3,
      trend: 'down',
      percentage: 7.9,
      subcategories: [
        { name: 'External Training', amount: 420000, percentage: 42.9 },
        { name: 'E-Learning Platforms', amount: 280000, percentage: 28.6 },
        { name: 'Internal Programs', amount: 180000, percentage: 18.4 },
        { name: 'Certifications', amount: 100000, percentage: 10.2 }
      ]
    },
    {
      id: 'technology',
      name: 'Technology & Systems',
      amount: 850000,
      budget: 900000,
      variance: -5.6,
      trend: 'stable',
      percentage: 6.9,
      subcategories: [
        { name: 'HR Software', amount: 380000, percentage: 44.7 },
        { name: 'Hardware', amount: 250000, percentage: 29.4 },
        { name: 'Support & Maintenance', amount: 150000, percentage: 17.6 },
        { name: 'Licenses', amount: 70000, percentage: 8.2 }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      amount: 520000,
      budget: 550000,
      variance: -5.5,
      trend: 'stable',
      percentage: 4.2,
      subcategories: [
        { name: 'Office Space', amount: 280000, percentage: 53.8 },
        { name: 'Utilities', amount: 120000, percentage: 23.1 },
        { name: 'Equipment', amount: 80000, percentage: 15.4 },
        { name: 'Maintenance', amount: 40000, percentage: 7.7 }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance & Legal',
      amount: 290000,
      budget: 320000,
      variance: -9.4,
      trend: 'down',
      percentage: 2.4,
      subcategories: [
        { name: 'Legal Consulting', amount: 150000, percentage: 51.7 },
        { name: 'Audit & Compliance', amount: 80000, percentage: 27.6 },
        { name: 'Insurance', amount: 40000, percentage: 13.8 },
        { name: 'Documentation', amount: 20000, percentage: 6.9 }
      ]
    }
  ];

  // Cost optimization opportunities
  const optimizations: CostOptimization[] = [
    {
      id: '1',
      category: 'Recruitment',
      title: 'Reduce External Agency Dependency',
      description: 'Develop internal recruitment capabilities to reduce external agency costs by 40%',
      potentialSavings: 272000,
      effort: 'high',
      impact: 'high',
      timeline: '6-9 months',
      status: 'identified'
    },
    {
      id: '2',
      category: 'Training',
      title: 'Optimize E-Learning Platform',
      description: 'Consolidate multiple platforms and negotiate bulk pricing',
      potentialSavings: 84000,
      effort: 'medium',
      impact: 'medium',
      timeline: '3-4 months',
      status: 'in-progress'
    },
    {
      id: '3',
      category: 'Technology',
      title: 'Cloud Migration Savings',
      description: 'Migrate on-premise systems to cloud for operational cost reduction',
      potentialSavings: 120000,
      effort: 'high',
      impact: 'high',
      timeline: '8-12 months',
      status: 'identified'
    },
    {
      id: '4',
      category: 'Infrastructure',
      title: 'Office Space Optimization',
      description: 'Implement hybrid work model to reduce office space requirements',
      potentialSavings: 168000,
      effort: 'medium',
      impact: 'high',
      timeline: '4-6 months',
      status: 'in-progress'
    }
  ];

  // Cost trends data
  const costTrends = series?.slice(-12).map((item, index) => ({
    month: new Date(Date.now() - (11 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
    totalCost: (item.total_employees || 100) * 21300 + Math.floor(Math.random() * 50000),
    salary: (item.total_employees || 100) * 14600 + Math.floor(Math.random() * 30000),
    recruitment: Math.floor(Math.random() * 40000) + 80000,
    training: Math.floor(Math.random() * 30000) + 70000,
    technology: Math.floor(Math.random() * 20000) + 60000,
    roi: Math.min(400, 250 + Math.floor(Math.random() * 150))
  })) || [];

  // Calculate total metrics
  const totalAmount = costCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = costCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalVariance = ((totalAmount - totalBudget) / totalBudget) * 100;
  const costPerEmployee = totalAmount / (analyticsData?.uniqueUsers || 150);
  const costPerHire = costCategories.find(c => c.id === 'recruitment')?.amount || 0 / 30; // Assume 30 hires
  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
  const roiAchievement = 340;

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (variance: number) => {
    if (variance > 5) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'analytics.costAnalytics.title': { en: 'Cost Analytics', ar: 'تحليلات التكاليف' },
      'analytics.costAnalytics.description': { en: 'HR cost analysis and optimization insights', ar: 'تحليل تكاليف الموارد البشرية ورؤى التحسين' },
      'analytics.costAnalytics.costOptimization': { en: 'Cost Optimization', ar: 'تحسين التكاليف' },
      'analytics.costAnalytics.budgetTracking': { en: 'Budget Tracking', ar: 'تتبع الميزانية' },
      'analytics.costAnalytics.generateCostReport': { en: 'Generate Cost Report', ar: 'إنشاء تقرير التكاليف' },
      'analytics.costAnalytics.exportAnalysis': { en: 'Export Analysis', ar: 'تصدير التحليل' },
      'analytics.costAnalytics.costBreakdown': { en: 'Cost Breakdown', ar: 'تفصيل التكاليف' },
      'analytics.costAnalytics.metrics.costPerEmployee': { en: 'Cost per Employee', ar: 'التكلفة لكل موظف' },
      'analytics.costAnalytics.metrics.costPerHire': { en: 'Cost per Hire', ar: 'تكلفة التوظيف' },
      'analytics.costAnalytics.metrics.costSavings': { en: 'Cost Savings', ar: 'وفورات التكاليف' },
      'analytics.costAnalytics.metrics.roiAchievement': { en: 'ROI Achievement', ar: 'تحقيق العائد على الاستثمار' }
    };
    
    return translations[key]?.[lang] || key;
  };

  // Pie chart data for cost distribution
  const pieData = costCategories.map((cat, index) => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    fill: `hsl(${index * 60}, 70%, 50%)`
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.costAnalytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.costAnalytics.description')}</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="salary">Salary & Benefits</SelectItem>
              <SelectItem value="recruitment">Recruitment</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
            <FileText className="mr-2 h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : t('analytics.costAnalytics.generateCostReport')}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('analytics.costAnalytics.exportAnalysis')}
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('analytics.costAnalytics.metrics.costPerEmployee')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(costPerEmployee, lang)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">-3.2% vs last year</span>  
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-secondary" />
              {t('analytics.costAnalytics.metrics.costPerHire')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{formatCurrency(costPerHire, lang)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">+8.1% vs last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              {t('analytics.costAnalytics.metrics.costSavings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatCurrency(totalSavings, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Potential annual savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-600" />
              {t('analytics.costAnalytics.metrics.roiAchievement')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatNumber(roiAchievement, lang)}%</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+12% improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost Breakdown */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {t('analytics.costAnalytics.costBreakdown')}
              </CardTitle>
              <CardDescription>
                Detailed analysis of HR cost categories and budget variance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.percentage}% of total budget
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(category.trend)}
                        <Badge variant={category.variance > 0 ? 'destructive' : 'default'}>
                          {formatCurrency(category.amount, lang)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold">{formatCurrency(category.budget, lang)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Variance</p>
                        <p className={`font-semibold ${getTrendColor(category.variance)}`}>
                          {category.variance > 0 ? '+' : ''}{category.variance.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold">
                          {category.variance > 5 ? 'Over Budget' : category.variance < -5 ? 'Under Budget' : 'On Track'}
                        </p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(category.amount / category.budget) * 100} 
                      className="h-2"
                    />
                    
                    <div className="border-t pt-2">
                      <p className="text-xs font-medium mb-2">Top Subcategories:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {category.subcategories.slice(0, 4).map((sub, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-muted-foreground">{sub.name}:</span>
                            <span className="font-medium">{formatCurrency(sub.amount, lang)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Optimization Opportunities */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('analytics.costAnalytics.costOptimization')}
              </CardTitle>
              <CardDescription>
                Identified opportunities for cost reduction and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((opt) => (
                  <div key={opt.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(opt.status)}
                        <Badge variant="outline">{opt.category}</Badge>
                      </div>
                      <Badge variant={getImpactColor(opt.impact)}>
                        {opt.impact} impact
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-sm">{opt.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {opt.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(opt.potentialSavings, lang)}
                        </p>
                        <p className="text-xs text-muted-foreground">Annual savings</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getEffortColor(opt.effort)}`} />
                          <span className="text-xs capitalize">{opt.effort} effort</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{opt.timeline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cost Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('analytics.costAnalytics.budgetTracking')}
          </CardTitle>
          <CardDescription>
            Cost trends, budget performance, and ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends">Cost Trends</TabsTrigger>
              <TabsTrigger value="distribution">Cost Distribution</TabsTrigger>
              <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="totalCost" fill="hsl(var(--primary))" opacity={0.3} name="Total Cost" />
                  <Bar yAxisId="left" dataKey="salary" fill="hsl(var(--secondary))" name="Salary" />
                  <Line yAxisId="right" type="monotone" dataKey="roi" stroke="hsl(var(--accent))" strokeWidth={3} name="ROI %" />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number, lang)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="roi" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={4}
                    name="ROI Achievement %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics" 
        companyId="default"
        position="fixed"
      />
    </div>
  );
};

export default CostAnalytics;