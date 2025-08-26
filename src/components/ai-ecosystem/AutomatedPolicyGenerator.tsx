import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bot,
  Gavel,
  Users,
  Building,
  Globe,
  Eye,
  Edit,
  Download,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface PolicyDocument {
  id: string;
  title: string;
  titleAr: string;
  type: 'hr_policy' | 'compliance_policy' | 'safety_policy' | 'security_policy' | 'operational_policy';
  category: string;
  status: 'draft' | 'under_review' | 'approved' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  version: string;
  aiGenerated: boolean;
  legalCompliance: number;
  stakeholders: string[];
  effectiveDate?: string;
  reviewDate: string;
  lastUpdated: string;
  createdBy: 'ai_system' | 'legal_team' | 'hr_team';
  content: {
    summary: string;
    summaryAr: string;
    sections: PolicySection[];
  };
  regulatoryBasis: string[];
  riskLevel: 'low' | 'medium' | 'high';
  implementationComplexity: 'simple' | 'moderate' | 'complex';
}

interface PolicySection {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  mandatory: boolean;
  legalReference?: string;
}

interface PolicyUpdateTrigger {
  id: string;
  type: 'regulatory_change' | 'incident_report' | 'best_practice_update' | 'risk_assessment' | 'audit_finding';
  source: string;
  description: string;
  affectedPolicies: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  aiRecommendation: string;
  status: 'pending' | 'processing' | 'completed';
}

interface GeneratorMetrics {
  totalPolicies: number;
  activePolicies: number;
  pendingReviews: number;
  complianceScore: number;
  aiEfficiency: number;
  timeSaved: number;
}

export const AutomatedPolicyGenerator: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [generatorActive, setGeneratorActive] = useState(true);
  const [policies, setPolicies] = useState<PolicyDocument[]>([
    {
      id: '1',
      title: 'Remote Work and Hybrid Arrangements Policy',
      titleAr: 'سياسة العمل عن بُعد والترتيبات المختلطة',
      type: 'hr_policy',
      category: 'Work Arrangements',
      status: 'draft',
      priority: 'high',
      version: '1.0',
      aiGenerated: true,
      legalCompliance: 94,
      stakeholders: ['HR Team', 'Legal Team', 'IT Security', 'Department Heads'],
      reviewDate: '2024-09-15',
      lastUpdated: '2 hours ago',
      createdBy: 'ai_system',
      content: {
        summary: 'Comprehensive policy governing remote work arrangements, hybrid schedules, performance management, and security requirements for distributed workforce.',
        summaryAr: 'سياسة شاملة تحكم ترتيبات العمل عن بُعد والجداول المختلطة وإدارة الأداء ومتطلبات الأمان للقوى العاملة الموزعة.',
        sections: [
          {
            id: 'sec1',
            title: 'Eligibility and Approval Process',
            titleAr: 'الأهلية وعملية الموافقة',
            content: 'All permanent employees with minimum 6 months tenure are eligible for remote work arrangements subject to role requirements and performance standards.',
            contentAr: 'جميع الموظفين الدائمين الذين لديهم خدمة لا تقل عن 6 أشهر مؤهلون لترتيبات العمل عن بُعد وفقاً لمتطلبات الدور ومعايير الأداء.',
            order: 1,
            mandatory: true,
            legalReference: 'Saudi Labor Law Article 67'
          },
          {
            id: 'sec2',
            title: 'Technology and Security Requirements',
            titleAr: 'متطلبات التكنولوجيا والأمان',
            content: 'Employees must use company-approved devices, maintain VPN connection, and comply with data protection protocols.',
            contentAr: 'يجب على الموظفين استخدام الأجهزة المعتمدة من الشركة والحفاظ على اتصال VPN والامتثال لبروتوكولات حماية البيانات.',
            order: 2,
            mandatory: true,
            legalReference: 'PDPL Requirements'
          }
        ]
      },
      regulatoryBasis: ['Saudi Labor Law', 'PDPL', 'SAMA Cybersecurity Framework'],
      riskLevel: 'medium',
      implementationComplexity: 'moderate'
    },
    {
      id: '2',
      title: 'AI and Automated Decision Making Ethics Policy',
      titleAr: 'سياسة أخلاقيات الذكاء الاصطناعي واتخاذ القرارات الآلية',
      type: 'compliance_policy',
      category: 'AI Ethics',
      status: 'under_review',
      priority: 'critical',
      version: '2.1',
      aiGenerated: true,
      legalCompliance: 97,
      stakeholders: ['Legal Team', 'AI Ethics Committee', 'Data Protection Officer', 'Executive Team'],
      effectiveDate: '2024-09-01',
      reviewDate: '2024-12-01',
      lastUpdated: '1 day ago',
      createdBy: 'ai_system',
      content: {
        summary: 'Establishes ethical guidelines and governance framework for AI-powered HR decisions including hiring, performance evaluation, and employee management.',
        summaryAr: 'تضع المبادئ التوجيهية الأخلاقية وإطار الحوكمة للقرارات التي تعتمد على الذكاء الاصطناعي في الموارد البشرية بما في ذلك التوظيف وتقييم الأداء وإدارة الموظفين.',
        sections: [
          {
            id: 'sec1',
            title: 'AI Decision Transparency',
            titleAr: 'شفافية قرارات الذكاء الاصطناعي',
            content: 'All AI-driven HR decisions must be explainable, auditable, and subject to human oversight with clear appeal processes.',
            contentAr: 'يجب أن تكون جميع قرارات الموارد البشرية المدفوعة بالذكاء الاصطناعي قابلة للتفسير والمراجعة وخاضعة للإشراف البشري مع عمليات استئناف واضحة.',
            order: 1,
            mandatory: true,
            legalReference: 'PDPL Article 23'
          }
        ]
      },
      regulatoryBasis: ['PDPL', 'AI Ethics Guidelines', 'Equal Employment Opportunity Laws'],
      riskLevel: 'high',
      implementationComplexity: 'complex'
    },
    {
      id: '3',
      title: 'Saudization Compliance and Reporting Policy',
      titleAr: 'سياسة الامتثال للسعودة والإبلاغ',
      type: 'compliance_policy',
      category: 'Government Compliance',
      status: 'published',
      priority: 'critical',
      version: '3.2',
      aiGenerated: false,
      legalCompliance: 100,
      stakeholders: ['HR Team', 'Government Relations', 'Executive Team'],
      effectiveDate: '2024-08-01',
      reviewDate: '2024-11-01',
      lastUpdated: '1 week ago',
      createdBy: 'legal_team',
      content: {
        summary: 'Ensures compliance with Nitaqat requirements, establishes Saudization targets, reporting procedures, and risk mitigation strategies.',
        summaryAr: 'يضمن الامتثال لمتطلبات نطاقات ويحدد أهداف السعودة وإجراءات الإبلاغ واستراتيجيات تخفيف المخاطر.',
        sections: [
          {
            id: 'sec1',
            title: 'Nitaqat Color Zone Management',
            titleAr: 'إدارة المناطق اللونية لنطاقات',
            content: 'Company must maintain Green zone status with minimum 35% Saudization rate across all eligible positions.',
            contentAr: 'يجب على الشركة الحفاظ على وضع المنطقة الخضراء بمعدل سعودة لا يقل عن 35% في جميع المناصب المؤهلة.',
            order: 1,
            mandatory: true,
            legalReference: 'Nitaqat Regulations 2024'
          }
        ]
      },
      regulatoryBasis: ['Nitaqat Program', 'Ministry of Human Resources Regulations', 'Labor Law'],
      riskLevel: 'high',
      implementationComplexity: 'moderate'
    }
  ]);

  const [triggers, setTriggers] = useState<PolicyUpdateTrigger[]>([
    {
      id: '1',
      type: 'regulatory_change',
      source: 'Ministry of Human Resources',
      description: 'New remote work regulations published requiring updated data protection measures',
      affectedPolicies: ['Remote Work Policy', 'Data Protection Policy'],
      urgency: 'high',
      detectedAt: '3 hours ago',
      aiRecommendation: 'Update remote work policy sections 4.2 and 4.3 to include enhanced data encryption requirements',
      status: 'processing'
    },
    {
      id: '2',
      type: 'best_practice_update',
      source: 'International AI Ethics Board',
      description: 'Updated guidelines for AI bias testing in recruitment processes',
      affectedPolicies: ['AI Ethics Policy', 'Recruitment Policy'],
      urgency: 'medium',
      detectedAt: '1 day ago',
      aiRecommendation: 'Incorporate quarterly AI bias audits and enhanced monitoring protocols',
      status: 'pending'
    },
    {
      id: '3',
      type: 'incident_report',
      source: 'Internal Security Team',
      description: 'Security incident involving remote access protocols needs policy clarification',
      affectedPolicies: ['Cybersecurity Policy', 'Remote Work Policy'],
      urgency: 'critical',
      detectedAt: '6 hours ago',
      aiRecommendation: 'Strengthen multi-factor authentication requirements and add incident response procedures',
      status: 'completed'
    }
  ]);

  const [metrics, setMetrics] = useState<GeneratorMetrics>({
    totalPolicies: 47,
    activePolicies: 32,
    pendingReviews: 8,
    complianceScore: 96.8,
    aiEfficiency: 89.3,
    timeSaved: 342
  });

  useEffect(() => {
    if (!generatorActive) return;

    const interval = setInterval(() => {
      setPolicies(prev => prev.map(policy => {
        if (policy.status === 'draft' && Math.random() < 0.05) {
          return { ...policy, legalCompliance: Math.min(100, policy.legalCompliance + Math.random() * 2) };
        }
        return policy;
      }));

      setMetrics(prev => ({
        ...prev,
        complianceScore: 94 + Math.random() * 4,
        timeSaved: prev.timeSaved + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [generatorActive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'under_review': return <Eye className="h-4 w-4 text-brand-warning" />;
      case 'draft': return <Edit className="h-4 w-4 text-muted-foreground" />;
      case 'archived': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-status-danger';
      case 'medium': return 'text-brand-warning';
      case 'low': return 'text-brand-success';
      default: return 'text-muted-foreground';
    }
  };

  const approvePolicy = (policyId: string) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: 'approved' as const }
        : policy
    ));
    toast({
      title: isArabic ? "تمت الموافقة على السياسة" : "Policy Approved",
      description: isArabic ? "السياسة جاهزة للنشر" : "Policy is ready for publication",
    });
  };

  const toggleGenerator = () => {
    setGeneratorActive(!generatorActive);
    toast({
      title: generatorActive 
        ? (isArabic ? "تم إيقاف مولد السياسات" : "Policy Generator Paused")
        : (isArabic ? "تم تفعيل مولد السياسات" : "Policy Generator Activated"),
      description: generatorActive 
        ? (isArabic ? "إيقاف إنشاء السياسات الآلي" : "Automated policy generation paused")
        : (isArabic ? "استئناف إنشاء السياسات الآلي" : "Resuming automated policy generation"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "مولد السياسات الآلي" : "Automated Policy Generator"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "إنشاء وتحديث السياسات تلقائياً بناءً على اللوائح والأفضل الممارسات" 
              : "Automated generation and maintenance of HR policies based on regulations and best practices"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={generatorActive ? "default" : "secondary"} className="px-4 py-2">
            {generatorActive 
              ? (isArabic ? "📝 ينشئ" : "📝 GENERATING")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={toggleGenerator} variant={generatorActive ? "destructive" : "default"}>
            {generatorActive 
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
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "سياسات نشطة" : "Active Policies"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.activePolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-brand-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "مراجعات معلقة" : "Pending Reviews"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.pendingReviews}</p>
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
                  {isArabic ? "نقاط الامتثال" : "Compliance Score"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.complianceScore.toFixed(1)}%</p>
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
                  {isArabic ? "كفاءة الذكاء الاصطناعي" : "AI Efficiency"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.aiEfficiency.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "ساعات موفرة" : "Hours Saved"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.timeSaved}</p>
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
                  {isArabic ? "المجموع" : "Total Policies"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">
            {isArabic ? "السياسات النشطة" : "Active Policies"}
          </TabsTrigger>
          <TabsTrigger value="triggers">
            {isArabic ? "محفزات التحديث" : "Update Triggers"}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isArabic ? "مراقبة الامتثال" : "Compliance Monitor"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(policy.status)}
                      <h3 className="font-semibold text-foreground">
                        {isArabic ? policy.titleAr : policy.title}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(policy.priority)}`} />
                      {policy.aiGenerated && (
                        <Badge variant="outline" className="text-xs bg-primary/10">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        v{policy.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isArabic ? policy.content.summaryAr : policy.content.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📊 {policy.legalCompliance}% compliant</span>
                      <span>🎯 {policy.riskLevel} risk</span>
                      <span>⚙️ {policy.implementationComplexity} complexity</span>
                      <span>📅 Review: {policy.reviewDate}</span>
                      <span>👥 {policy.stakeholders.length} stakeholders</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge 
                      variant={policy.status === 'published' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {policy.status.toUpperCase()}
                    </Badge>
                    <div className="flex gap-2">
                      {policy.status === 'draft' && (
                        <Button size="sm" onClick={() => approvePolicy(policy.id)}>
                          {isArabic ? "موافقة" : "Approve"}
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
                  {/* Compliance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Legal Compliance</span>
                      <span className="font-medium">{policy.legalCompliance}%</span>
                    </div>
                    <Progress value={policy.legalCompliance} className="h-2" />
                  </div>

                  {/* Regulatory Basis */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Regulatory Basis:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.regulatoryBasis.map((regulation, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {regulation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stakeholders */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Stakeholders:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.stakeholders.map((stakeholder, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Policy Sections Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Sections:</h4>
                    <div className="space-y-1">
                      {policy.content.sections.slice(0, 2).map((section) => (
                        <div key={section.id} className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded">
                          <span className="font-medium text-foreground min-w-0 flex-1">
                            {isArabic ? section.titleAr : section.title}
                          </span>
                          {section.mandatory && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          {triggers.map((trigger) => (
            <Card key={trigger.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        trigger.urgency === 'critical' ? 'text-status-danger' :
                        trigger.urgency === 'high' ? 'text-brand-warning' :
                        'text-primary'
                      }`} />
                      <h4 className="font-medium text-foreground">{trigger.source}</h4>
                      <Badge variant="outline" className="text-xs">
                        {trigger.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <span>📅 Detected {trigger.detectedAt}</span>
                      <span className="ml-4">📋 Affects {trigger.affectedPolicies.length} policies</span>
                    </div>
                    <div className="bg-muted/30 rounded p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">AI Recommendation:</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{trigger.aiRecommendation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={trigger.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {trigger.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-success">Labor Law Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={98} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">12 policies compliant</span>
                    <span className="font-bold text-brand-success">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brand-warning">Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">8 policies compliant</span>
                    <span className="font-bold text-brand-warning">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-status-danger">Safety Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={76} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">6 policies compliant</span>
                    <span className="font-bold text-status-danger">76%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};