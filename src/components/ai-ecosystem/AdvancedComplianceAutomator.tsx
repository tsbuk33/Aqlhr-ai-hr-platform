import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Gavel,
  FileText,
  Users,
  Building,
  Globe,
  TrendingUp,
  Bot,
  Eye,
  Send,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface ComplianceRule {
  id: string;
  name: string;
  nameAr: string;
  category: 'labor_law' | 'data_protection' | 'safety' | 'financial' | 'government' | 'international';
  authority: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non_compliant' | 'at_risk' | 'monitoring' | 'under_review';
  complianceScore: number;
  lastChecked: string;
  nextReview: string;
  autoMonitoring: boolean;
  violations: ComplianceViolation[];
  requirements: string[];
  aiActions: AutomatedAction[];
  riskLevel: 'low' | 'medium' | 'high';
  penaltyRisk: number;
}

interface ComplianceViolation {
  id: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolving' | 'resolved';
  affectedEmployees: number;
  estimatedPenalty: number;
  aiRemediation?: string;
}

interface AutomatedAction {
  id: string;
  type: 'monitor' | 'alert' | 'correct' | 'report' | 'escalate';
  description: string;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'completed';
  lastExecuted: string;
  successRate: number;
}

interface ComplianceReport {
  id: string;
  title: string;
  type: 'audit' | 'violation' | 'monthly' | 'quarterly' | 'annual';
  authority: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'submitted' | 'approved';
  aiGenerated: boolean;
  completeness: number;
  sections: ReportSection[];
}

interface ReportSection {
  name: string;
  status: 'complete' | 'incomplete' | 'under_review';
  aiContribution: number;
}

interface AutomatorMetrics {
  totalRules: number;
  compliantRules: number;
  atRiskRules: number;
  activeViolations: number;
  automationRate: number;
  penaltysSaved: number;
}

export const AdvancedComplianceAutomator: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [automatorActive, setAutomatorActive] = useState(true);
  const [rules, setRules] = useState<ComplianceRule[]>([
    {
      id: '1',
      name: 'Nitaqat Saudization Requirements',
      nameAr: 'متطلبات السعودة لبرنامج نطاقات',
      category: 'government',
      authority: 'Ministry of Human Resources',
      priority: 'critical',
      status: 'at_risk',
      complianceScore: 87,
      lastChecked: '2 hours ago',
      nextReview: '2024-09-01',
      autoMonitoring: true,
      riskLevel: 'high',
      penaltyRisk: 250000,
      violations: [
        {
          id: 'v1',
          description: 'IT department Saudization rate dropped to 32% (below 35% threshold)',
          severity: 'major',
          detectedAt: '4 hours ago',
          status: 'resolving',
          affectedEmployees: 23,
          estimatedPenalty: 50000,
          aiRemediation: 'AI initiated hiring process for 2 Saudi IT professionals'
        }
      ],
      requirements: [
        'Maintain 35% minimum Saudization rate',
        'Submit monthly reports to MoHR portal',
        'Quarterly compliance audits',
        'Employee training documentation'
      ],
      aiActions: [
        {
          id: 'a1',
          type: 'monitor',
          description: 'Real-time Saudization rate monitoring',
          frequency: 'real_time',
          status: 'active',
          lastExecuted: '5 minutes ago',
          successRate: 99.2
        },
        {
          id: 'a2',
          type: 'alert',
          description: 'Alert when rate drops below 37% (buffer)',
          frequency: 'real_time',
          status: 'active',
          lastExecuted: '4 hours ago',
          successRate: 100
        }
      ]
    },
    {
      id: '2',
      name: 'Personal Data Protection Law (PDPL) Compliance',
      nameAr: 'الامتثال لقانون حماية البيانات الشخصية',
      category: 'data_protection',
      authority: 'Saudi Data & AI Authority (SDAIA)',
      priority: 'critical',
      status: 'compliant',
      complianceScore: 96,
      lastChecked: '1 hour ago',
      nextReview: '2024-12-15',
      autoMonitoring: true,
      riskLevel: 'low',
      penaltyRisk: 0,
      violations: [],
      requirements: [
        'Employee consent for data processing',
        'Data retention policy implementation',
        'Breach notification procedures',
        'Privacy impact assessments',
        'Regular security audits'
      ],
      aiActions: [
        {
          id: 'a3',
          type: 'monitor',
          description: 'Data access pattern monitoring',
          frequency: 'real_time',
          status: 'active',
          lastExecuted: '1 minute ago',
          successRate: 98.7
        },
        {
          id: 'a4',
          type: 'correct',
          description: 'Auto-anonymization of exported reports',
          frequency: 'real_time',
          status: 'active',
          lastExecuted: '15 minutes ago',
          successRate: 100
        }
      ]
    },
    {
      id: '3',
      name: 'Saudi Labor Law Working Hours Compliance',
      nameAr: 'الامتثال لقانون العمل السعودي - ساعات العمل',
      category: 'labor_law',
      authority: 'Ministry of Human Resources',
      priority: 'high',
      status: 'monitoring',
      complianceScore: 92,
      lastChecked: '30 minutes ago',
      nextReview: '2024-09-15',
      autoMonitoring: true,
      riskLevel: 'medium',
      penaltyRisk: 15000,
      violations: [
        {
          id: 'v2',
          description: 'Employee exceeded 720 annual overtime hours limit',
          severity: 'moderate',
          detectedAt: '2 days ago',
          status: 'resolved',
          affectedEmployees: 1,
          estimatedPenalty: 5000,
          aiRemediation: 'Auto-redistributed workload and scheduled mandatory rest'
        }
      ],
      requirements: [
        'Maximum 8 hours daily work',
        'Maximum 48 hours weekly work',
        'Maximum 720 hours annual overtime',
        'Mandatory rest periods',
        'Ramadan working hours adjustment'
      ],
      aiActions: [
        {
          id: 'a5',
          type: 'monitor',
          description: 'Real-time working hours tracking',
          frequency: 'real_time',
          status: 'active',
          lastExecuted: '1 minute ago',
          successRate: 97.8
        },
        {
          id: 'a6',
          type: 'alert',
          description: 'Alert when approaching overtime limits',
          frequency: 'daily',
          status: 'active',
          lastExecuted: '8 hours ago',
          successRate: 95.5
        }
      ]
    }
  ]);

  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      title: 'Monthly Nitaqat Compliance Report',
      type: 'monthly',
      authority: 'Ministry of Human Resources',
      dueDate: '2024-09-01',
      status: 'draft',
      aiGenerated: true,
      completeness: 85,
      sections: [
        { name: 'Saudization Statistics', status: 'complete', aiContribution: 100 },
        { name: 'Training Programs', status: 'complete', aiContribution: 90 },
        { name: 'Recruitment Efforts', status: 'under_review', aiContribution: 80 },
        { name: 'Compliance Measures', status: 'incomplete', aiContribution: 0 }
      ]
    },
    {
      id: '2',
      title: 'PDPL Annual Compliance Audit',
      type: 'annual',
      authority: 'Saudi Data & AI Authority',
      dueDate: '2024-12-31',
      status: 'pending',
      aiGenerated: true,
      completeness: 60,
      sections: [
        { name: 'Data Processing Activities', status: 'complete', aiContribution: 95 },
        { name: 'Security Measures', status: 'complete', aiContribution: 100 },
        { name: 'Breach Incidents', status: 'complete', aiContribution: 100 },
        { name: 'Employee Training', status: 'under_review', aiContribution: 70 }
      ]
    }
  ]);

  const [metrics, setMetrics] = useState<AutomatorMetrics>({
    totalRules: 28,
    compliantRules: 22,
    atRiskRules: 4,
    activeViolations: 2,
    automationRate: 94.3,
    penaltysSaved: 1850000
  });

  useEffect(() => {
    if (!automatorActive) return;

    const interval = setInterval(() => {
      setRules(prev => prev.map(rule => {
        if (rule.autoMonitoring && Math.random() < 0.1) {
          return { 
            ...rule, 
            complianceScore: Math.max(70, Math.min(100, rule.complianceScore + (Math.random() - 0.3) * 2)),
            lastChecked: 'Just now'
          };
        }
        return rule;
      }));

      setMetrics(prev => ({
        ...prev,
        automationRate: 92 + Math.random() * 4,
        penaltysSaved: prev.penaltysSaved + Math.floor(Math.random() * 1000)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [automatorActive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4 text-brand-warning" />;
      case 'monitoring': return <Eye className="h-4 w-4 text-primary" />;
      case 'under_review': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government': return <Building className="h-4 w-4 text-primary" />;
      case 'data_protection': return <Shield className="h-4 w-4 text-brand-success" />;
      case 'labor_law': return <Users className="h-4 w-4 text-brand-warning" />;
      case 'safety': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'financial': return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'international': return <Globe className="h-4 w-4 text-muted-foreground" />;
      default: return <Gavel className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-status-danger';
      case 'high': return 'bg-brand-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-brand-success';
      default: return 'bg-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-status-danger';
      case 'major': return 'text-brand-warning';
      case 'moderate': return 'text-primary';
      case 'minor': return 'text-brand-success';
      default: return 'text-muted-foreground';
    }
  };

  const resolveViolation = (ruleId: string, violationId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? {
            ...rule,
            violations: rule.violations.map(v => 
              v.id === violationId ? { ...v, status: 'resolved' as const } : v
            )
          }
        : rule
    ));
    toast({
      title: isArabic ? "تم حل المخالفة" : "Violation Resolved",
      description: isArabic ? "تم تطبيق الإجراء التصحيحي" : "Corrective action has been applied",
    });
  };

  const submitReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'submitted' as const }
        : report
    ));
    toast({
      title: isArabic ? "تم إرسال التقرير" : "Report Submitted",
      description: isArabic ? "تم إرسال تقرير الامتثال للسلطة المختصة" : "Compliance report submitted to authority",
    });
  };

  const toggleAutomator = () => {
    setAutomatorActive(!automatorActive);
    toast({
      title: automatorActive 
        ? (isArabic ? "تم إيقاف محرك الامتثال" : "Compliance Automator Paused")
        : (isArabic ? "تم تفعيل محرك الامتثال" : "Compliance Automator Activated"),
      description: automatorActive 
        ? (isArabic ? "إيقاف المراقبة التلقائية للامتثال" : "Automated compliance monitoring paused")
        : (isArabic ? "استئناف المراقبة التلقائية للامتثال" : "Resuming automated compliance monitoring"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "محرك الامتثال المتقدم" : "Advanced Compliance Automator"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "مراقبة وإنفاذ الامتثال التلقائي لجميع اللوائح والقوانين الحكومية" 
              : "Automated monitoring and enforcement of all regulatory and government compliance requirements"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={automatorActive ? "default" : "secondary"} className="px-4 py-2">
            {automatorActive 
              ? (isArabic ? "⚖️ يراقب" : "⚖️ MONITORING")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={toggleAutomator} variant={automatorActive ? "destructive" : "default"}>
            {automatorActive 
              ? (isArabic ? "إيقاف" : "Pause")
              : (isArabic ? "تفعيل" : "Start")
            }
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "متوافقة" : "Compliant"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.compliantRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "في خطر" : "At Risk"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.atRiskRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-status-danger" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "مخالفات نشطة" : "Active Violations"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.activeViolations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "معدل الأتمتة" : "Automation Rate"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.automationRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "غرامات موفرة" : "Penalties Saved"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {(metrics.penaltysSaved / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "المجموع" : "Total Rules"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">
            {isArabic ? "قواعد الامتثال" : "Compliance Rules"}
          </TabsTrigger>
          <TabsTrigger value="violations">
            {isArabic ? "المخالفات" : "Violations"}
          </TabsTrigger>
          <TabsTrigger value="reports">
            {isArabic ? "التقارير" : "Reports"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rule.status)}
                      {getCategoryIcon(rule.category)}
                      <h3 className="font-semibold text-foreground">
                        {isArabic ? rule.nameAr : rule.name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(rule.priority)}`} />
                      {rule.autoMonitoring && (
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          <Bot className="h-3 w-3 mr-1" />
                          Auto Monitoring
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.authority}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📊 {rule.complianceScore}% compliant</span>
                      <span>🎯 {rule.riskLevel} risk</span>
                      <span>💰 {(rule.penaltyRisk / 1000).toFixed(0)}K penalty risk</span>
                      <span>📅 Next review: {rule.nextReview}</span>
                      <span>🔍 Last checked: {rule.lastChecked}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge 
                      variant={rule.status === 'compliant' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {rule.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Compliance Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Score</span>
                      <span className="font-medium">{rule.complianceScore}%</span>
                    </div>
                    <Progress value={rule.complianceScore} className="h-2" />
                  </div>

                  {/* Active Violations */}
                  {rule.violations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Active Violations:</h4>
                      <div className="space-y-2">
                        {rule.violations.map((violation) => (
                          <div key={violation.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">{violation.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className={getSeverityColor(violation.severity)}>
                                    {violation.severity.toUpperCase()}
                                  </span>
                                  <span>👥 {violation.affectedEmployees} employees</span>
                                  <span>💰 {(violation.estimatedPenalty / 1000).toFixed(0)}K penalty</span>
                                  <span>📅 {violation.detectedAt}</span>
                                </div>
                                {violation.aiRemediation && (
                                  <div className="bg-muted/30 rounded p-2 mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Bot className="h-3 w-3 text-primary" />
                                      <span className="text-xs font-medium text-primary">AI Remediation:</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{violation.aiRemediation}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={violation.status === 'resolved' ? 'default' : 'destructive'} className="text-xs">
                                  {violation.status.toUpperCase()}
                                </Badge>
                                {violation.status !== 'resolved' && (
                                  <Button size="sm" onClick={() => resolveViolation(rule.id, violation.id)}>
                                    {isArabic ? "حل" : "Resolve"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Automated Actions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {rule.aiActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-primary" />
                            <span className="text-foreground">{action.description}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {action.successRate}%
                            </Badge>
                            <Badge variant={action.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {action.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {rules.flatMap(rule => rule.violations).map((violation) => (
            <Card key={violation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">{violation.description}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className={getSeverityColor(violation.severity)}>
                        {violation.severity.toUpperCase()}
                      </span>
                      <span>👥 {violation.affectedEmployees} employees</span>
                      <span>💰 {(violation.estimatedPenalty / 1000).toFixed(0)}K SAR penalty</span>
                      <span>📅 Detected {violation.detectedAt}</span>
                    </div>
                  </div>
                  <Badge variant={violation.status === 'resolved' ? 'default' : 'destructive'} className="text-xs">
                    {violation.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      {report.aiGenerated && (
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{report.authority}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📅 Due: {report.dueDate}</span>
                      <span>📊 {report.completeness}% complete</span>
                      <span>📝 {report.type.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge 
                      variant={report.status === 'submitted' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {report.status.toUpperCase()}
                    </Badge>
                    <div className="flex gap-2">
                      {report.status === 'draft' && (
                        <Button size="sm" onClick={() => submitReport(report.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          {isArabic ? "إرسال" : "Submit"}
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Completion Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Report Completion</span>
                      <span className="font-medium">{report.completeness}%</span>
                    </div>
                    <Progress value={report.completeness} className="h-2" />
                  </div>

                  {/* Report Sections */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Report Sections:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {report.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {section.status === 'complete' && <CheckCircle className="h-3 w-3 text-brand-success" />}
                            {section.status === 'under_review' && <Eye className="h-3 w-3 text-brand-warning" />}
                            {section.status === 'incomplete' && <Clock className="h-3 w-3 text-muted-foreground" />}
                            <span className="text-sm text-foreground">{section.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {section.aiContribution}% AI
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};