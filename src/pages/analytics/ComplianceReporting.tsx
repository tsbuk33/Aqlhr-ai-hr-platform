import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AqlHRAIAssistant } from '@/components/ai';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboardTrends } from "@/hooks/useDashboardTrends";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/i18n/format";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Eye,
  Search,
  Calendar,
  Scale,
  Building,
  Users,
  TrendingUp,
  AlertCircle,
  Settings
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface ComplianceArea {
  id: string;
  name: string;
  category: string;
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending';
  score: number;
  lastAudit: Date;
  nextReview: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  violations: number;
  improvements: string[];
}

interface ComplianceAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  assignee: string;
  status: 'open' | 'investigating' | 'resolved';
  actions: string[];
}

const ComplianceReporting = () => {
  const lang = 'en';
  const { analyticsData, loading } = useAnalytics();
  const { series } = useDashboardTrends(365);
  
  const [selectedRegulation, setSelectedRegulation] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Compliance areas
  const complianceAreas: ComplianceArea[] = [
    {
      id: 'labor',
      name: 'Labor Law Compliance',
      category: 'laborLaw',
      status: 'compliant',
      score: 95.8,
      lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      riskLevel: 'low',
      violations: 2,
      improvements: ['Update break room policies', 'Enhance overtime tracking']
    },
    {
      id: 'data',
      name: 'Data Protection (PDPL)',
      category: 'dataProtection',
      status: 'warning',
      score: 87.3,
      lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      riskLevel: 'medium',
      violations: 5,
      improvements: ['Implement data encryption', 'Update privacy policies', 'Staff training required']
    },
    {
      id: 'safety',
      name: 'Health & Safety Standards',
      category: 'healthSafety',
      status: 'compliant',
      score: 92.1,
      lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      riskLevel: 'low',
      violations: 1,
      improvements: ['Emergency drill scheduling']
    },
    {
      id: 'financial',
      name: 'Financial Reporting',
      category: 'financialReporting',
      status: 'non-compliant',
      score: 73.2,
      lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      riskLevel: 'high',
      violations: 12,
      improvements: ['Audit trail implementation', 'Financial controls update', 'Quarterly review process']
    },
    {
      id: 'environmental',
      name: 'Environmental Compliance',
      category: 'environmentalCompliance',
      status: 'pending',
      score: 89.7,
      lastAudit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      riskLevel: 'medium',
      violations: 3,
      improvements: ['Waste management audit', 'Carbon footprint assessment']
    }
  ];

  // Compliance alerts
  const complianceAlerts: ComplianceAlert[] = [
    {
      id: '1',
      type: 'Data Protection',
      title: 'PDPL Compliance Review Required',
      description: 'Annual data protection assessment due within 15 days',
      severity: 'high',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      assignee: 'Legal Team',
      status: 'open',
      actions: ['Schedule review meeting', 'Prepare documentation', 'Update policies']
    },
    {
      id: '2',
      type: 'Financial Reporting',
      title: 'Audit Trail Gaps Identified',
      description: 'Missing financial transaction records for Q3 reporting',
      severity: 'critical',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignee: 'Finance Team',
      status: 'investigating',
      actions: ['Investigate missing records', 'Implement controls', 'Generate report']
    },
    {
      id: '3',
      type: 'Labor Law',
      title: 'Overtime Policy Update',
      description: 'New regulations require policy amendments',
      severity: 'medium',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignee: 'HR Department',
      status: 'open',
      actions: ['Review regulations', 'Update policies', 'Staff communication']
    },
    {
      id: '4',
      type: 'Health & Safety',
      title: 'Emergency Drill Overdue',
      description: 'Quarterly emergency drill not conducted',
      severity: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      assignee: 'Safety Officer',
      status: 'open',
      actions: ['Schedule drill', 'Notify staff', 'Document results']
    }
  ];

  // Compliance trends data
  const complianceData = series?.slice(-12).map((item, index) => ({
    month: new Date(Date.now() - (11 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
    overall: Math.min(95, 85 + Math.floor(Math.random() * 10)),
    dataProtection: Math.min(92, 80 + Math.floor(Math.random() * 12)),
    laborLaw: Math.min(98, 90 + Math.floor(Math.random() * 8)),
    financial: Math.min(85, 70 + Math.floor(Math.random() * 15)),
    violations: Math.floor(Math.random() * 8) + 1
  })) || [];

  // Metrics
  const metrics = {
    complianceScore: complianceAreas.reduce((acc, area) => acc + area.score, 0) / complianceAreas.length,
    reportsGenerated: 156,
    violationsPrevented: complianceAreas.reduce((acc, area) => acc + area.violations, 0),
    costAvoidance: 1200000 // SAR
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'non-compliant': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'non-compliant': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'analytics.complianceReporting.title': { en: 'Compliance Reporting', ar: 'تقارير الامتثال' },
      'analytics.complianceReporting.description': { en: 'Automated compliance tracking and reporting', ar: 'تتبع الامتثال الآلي والتقارير التنظيمية' },
      'analytics.complianceReporting.complianceMonitor': { en: 'Compliance Monitor', ar: 'مراقب الامتثال' },
      'analytics.complianceReporting.regulatoryTracking': { en: 'Regulatory Tracking', ar: 'تتبع التنظيمات' },
      'analytics.complianceReporting.generateCompliance': { en: 'Generate Compliance Report', ar: 'إنشاء تقرير امتثال' },
      'analytics.complianceReporting.exportCompliance': { en: 'Export Compliance Report', ar: 'تصدير تقرير الامتثال' },
      'analytics.complianceReporting.complianceOverview': { en: 'Compliance Overview', ar: 'نظرة عامة على الامتثال' },
      'analytics.complianceReporting.metrics.complianceScore': { en: 'Compliance Score', ar: 'نقاط الامتثال' },
      'analytics.complianceReporting.metrics.reportsGenerated': { en: 'Reports Generated', ar: 'التقارير المُنشأة' },
      'analytics.complianceReporting.metrics.violationsPrevented': { en: 'Violations Prevented', ar: 'الانتهاكات المنعة' },
      'analytics.complianceReporting.metrics.costAvoidance': { en: 'Cost Avoidance', ar: 'تجنب التكاليف' }
    };
    
    return translations[key]?.[lang] || key;
  };

  // Pie chart data for regulation distribution
  const regulationData = [
    { name: 'Labor Law', value: 25, fill: 'hsl(var(--primary))' },
    { name: 'Data Protection', value: 20, fill: 'hsl(var(--secondary))' },
    { name: 'Health & Safety', value: 18, fill: 'hsl(var(--accent))' },
    { name: 'Financial', value: 22, fill: 'hsl(var(--muted))' },
    { name: 'Environmental', value: 15, fill: 'hsl(var(--destructive))' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.complianceReporting.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.complianceReporting.description')}</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regulations</SelectItem>
              <SelectItem value="labor">Labor Law</SelectItem>
              <SelectItem value="data">Data Protection</SelectItem>
              <SelectItem value="safety">Health & Safety</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
            <FileText className="mr-2 h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : t('analytics.complianceReporting.generateCompliance')}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('analytics.complianceReporting.exportCompliance')}
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('analytics.complianceReporting.metrics.complianceScore')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatPercent(metrics.complianceScore / 100, lang)}</div>
            <Progress value={metrics.complianceScore} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">Overall compliance rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              {t('analytics.complianceReporting.metrics.reportsGenerated')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{formatNumber(metrics.reportsGenerated, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              {t('analytics.complianceReporting.metrics.violationsPrevented')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{formatNumber(metrics.violationsPrevented, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Total violations addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('analytics.complianceReporting.metrics.costAvoidance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(metrics.costAvoidance, lang)}</div>
            <p className="text-sm text-muted-foreground mt-1">Cost savings from prevention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Areas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t('analytics.complianceReporting.complianceOverview')}
              </CardTitle>
              <CardDescription>
                Regulatory compliance across all business areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAreas.map((area) => (
                  <div key={area.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(area.status)}
                        <div>
                          <h4 className="font-semibold">{area.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last audit: {area.lastAudit.toLocaleDateString()} | Next: {area.nextReview.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(area.riskLevel)}`} />
                        <Badge variant={area.status === 'compliant' ? 'default' : 'destructive'}>
                          {area.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Score</p>
                        <p className="font-semibold text-lg">{area.score}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Risk Level</p>
                        <p className="font-semibold capitalize">{area.riskLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Issues</p>
                        <p className="font-semibold">{area.violations}</p>
                      </div>
                    </div>
                    
                    <Progress value={area.score} className="h-2" />
                    
                    {area.improvements.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="text-xs font-medium mb-1">Recommended Improvements:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {area.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Alerts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Urgent compliance issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <Alert key={alert.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-sm">{alert.title}</h5>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Due: {alert.dueDate.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Assigned to: {alert.assignee}</span>
                        </div>
                        <div className="border-t pt-2">
                          <p className="text-xs font-medium mb-1">Required Actions:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {alert.actions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            {t('analytics.complianceReporting.regulatoryTracking')}
          </CardTitle>
          <CardDescription>
            Compliance trends and regulatory framework analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends">Compliance Trends</TabsTrigger>
              <TabsTrigger value="distribution">Regulation Distribution</TabsTrigger>
              <TabsTrigger value="violations">Violation Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} name="Overall Compliance" />
                  <Line type="monotone" dataKey="dataProtection" stroke="hsl(var(--secondary))" strokeWidth={2} name="Data Protection" />
                  <Line type="monotone" dataKey="laborLaw" stroke="hsl(var(--accent))" strokeWidth={2} name="Labor Law" />
                  <Line type="monotone" dataKey="financial" stroke="hsl(var(--destructive))" strokeWidth={2} name="Financial" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={regulationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regulationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="violations" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="violations" fill="hsl(var(--destructive))" name="Violations" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.compliance" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ComplianceReporting;