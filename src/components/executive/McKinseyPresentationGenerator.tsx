import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, 
  Send, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Target,
  Briefcase
} from "lucide-react";

interface AssessmentData {
  companyName: string;
  industry: string;
  employeeCount: string;
  overallScore: number;
  dimensionalScores: Record<string, number>;
  gaps: Array<{
    area: string;
    gap: number;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    module: string;
    priority: string;
    investment: string;
    roi: string;
  }>;
  contacts: {
    ceo: { name: string; email: string; };
    hrDirector: { name: string; email: string; };
  };
}

interface PresentationTemplate {
  id: string;
  name: string;
  audience: 'ceo' | 'hr_director' | 'board' | 'department';
  slides: Array<{
    id: string;
    title: string;
    type: 'cover' | 'summary' | 'analysis' | 'recommendations' | 'roadmap' | 'investment' | 'next_steps';
    content: any;
  }>;
}

const McKinseyPresentationGenerator: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [generationProgress, setGenerationProgress] = useState<Record<string, number>>({});
  console.log('🎯 McKinsey Presentation Generator - Component Loaded Successfully');

  // McKinsey-style presentation templates
  const presentationTemplates: Record<string, PresentationTemplate> = {
    ceo: {
      id: 'ceo',
      name: isArabic ? 'عرض للرئيس التنفيذي' : 'CEO Executive Presentation',
      audience: 'ceo',
      slides: [
        {
          id: 'cover',
          title: isArabic ? 'خارطة طريق التحول الاستراتيجي للموارد البشرية' : 'Strategic HR Transformation Roadmap',
          type: 'cover',
          content: {
            subtitle: isArabic ? 'رفع مستوى {CompanyName} إلى معايير الشركات الرائدة' : 'Elevating {CompanyName} to Elite Corporate Standards',
            presenter: isArabic ? 'AqlHR الذكاء الاستراتيجي' : 'AqlHR Strategic Intelligence',
            confidentiality: isArabic ? 'سري - القيادة التنفيذية فقط' : 'Confidential - Executive Leadership Only'
          }
        },
        {
          id: 'executive_summary',
          title: isArabic ? 'الملخص التنفيذي: الفرص الاستراتيجية' : 'Executive Summary: Strategic Opportunities',
          type: 'summary',
          content: {
            currentScore: '{AssessmentScore}/100',
            industryBenchmark: '{IndustryAverage}/100',
            eliteStandard: '85/100',
            keyFindings: [],
            strategicRecommendation: '',
            investmentOverview: '',
            expectedROI: ''
          }
        },
        {
          id: 'current_state',
          title: isArabic ? 'الوضع الحالي: تقييم الذكاء التنظيمي' : 'Current State: Organizational Intelligence Assessment',
          type: 'analysis',
          content: {
            dimensionalAnalysis: {},
            strengthsIdentified: [],
            criticalGaps: [],
            competitivePosition: '',
            riskFactors: []
          }
        },
        {
          id: 'strategic_gaps',
          title: isArabic ? 'الفجوات الاستراتيجية مقابل معايير الشركات الرائدة' : 'Strategic Gaps vs Elite Corporate Standards',
          type: 'analysis',
          content: {
            gapVisualization: {},
            priorityGaps: [],
            businessImpact: '',
            urgencyAssessment: ''
          }
        },
        {
          id: 'solution_overview',
          title: isArabic ? 'هيكل حلول AqlHR الاستراتيجية' : 'AqlHR Strategic Solution Architecture',
          type: 'recommendations',
          content: {
            solutionEcosystem: {},
            primaryRecommendations: [],
            supportingCapabilities: [],
            integrationBenefits: '',
            competitiveAdvantage: ''
          }
        },
        {
          id: 'transformation_roadmap',
          title: isArabic ? 'خارطة طريق التحول الاستراتيجي' : 'Strategic Transformation Roadmap',
          type: 'roadmap',
          content: {
            phaseOverview: '',
            quickWins: [],
            strategicInitiatives: [],
            sustainabilityPlan: '',
            milestoneTracking: ''
          }
        },
        {
          id: 'investment_analysis',
          title: isArabic ? 'تحليل الاستثمار ودراسة الجدوى' : 'Investment Analysis & Business Case',
          type: 'investment',
          content: {
            investmentBreakdown: {},
            roiProjections: {},
            costBenefitAnalysis: {},
            paybackPeriod: '',
            riskMitigation: []
          }
        },
        {
          id: 'next_steps',
          title: isArabic ? 'الخطوات التالية الفورية والشراكة' : 'Immediate Next Steps & Partnership',
          type: 'next_steps',
          content: {
            immediateActions: [],
            consultationProposal: '',
            partnershipBenefits: '',
            contactInformation: '',
            consultationBooking: ''
          }
        }
      ]
    },
    hr_director: {
      id: 'hr_director',
      name: isArabic ? 'خطة التنفيذ التفصيلية لمدير الموارد البشرية' : 'HR Director Implementation Plan',
      audience: 'hr_director',
      slides: [
        {
          id: 'cover',
          title: isArabic ? 'خطة تنفيذ تحول الموارد البشرية' : 'HR Transformation Implementation Plan',
          type: 'cover',
          content: {
            subtitle: isArabic ? 'خارطة طريق مفصلة لـ {CompanyName}' : 'Detailed Roadmap for {CompanyName}',
            presenter: isArabic ? 'فريق تنفيذ AqlHR' : 'AqlHR Implementation Team',
            confidentiality: isArabic ? 'سري - فريق قيادة الموارد البشرية' : 'Confidential - HR Leadership Team'
          }
        },
        {
          id: 'assessment_results',
          title: isArabic ? 'نتائج التقييم الشاملة' : 'Comprehensive Assessment Results',
          type: 'analysis',
          content: {
            detailedScoring: {},
            benchmarkComparison: {},
            strengthsAnalysis: [],
            improvementAreas: [],
            complianceStatus: {}
          }
        },
        {
          id: 'module_recommendations',
          title: isArabic ? 'توصيات وحدات AqlHR' : 'AqlHR Module Recommendations',
          type: 'recommendations',
          content: {
            priorityModules: [],
            supportingModules: [],
            integrationPlan: '',
            implementationSequence: [],
            trainingRequirements: []
          }
        },
        {
          id: 'consulting_services',
          title: isArabic ? 'الخدمات الاستشارية الموصى بها' : 'Recommended Consulting Services',
          type: 'recommendations',
          content: {
            strategicPlanning: '',
            digitalTransformation: '',
            changeManagement: '',
            cultureTransformation: '',
            leadershipDevelopment: '',
            benchmarkingAnalysis: ''
          }
        },
        {
          id: 'implementation_plan',
          title: isArabic ? 'خطة التنفيذ التفصيلية' : 'Detailed Implementation Plan',
          type: 'roadmap',
          content: {
            phaseBreakdown: {},
            resourceRequirements: {},
            trainingSchedule: {},
            changeManagement: '',
            riskMitigation: []
          }
        },
        {
          id: 'success_metrics',
          title: isArabic ? 'مقاييس النجاح ومؤشرات الأداء الرئيسية' : 'Success Metrics & KPIs',
          type: 'analysis',
          content: {
            performanceKPIs: [],
            complianceMetrics: [],
            userAdoptionMetrics: [],
            businessImpactMetrics: [],
            reportingSchedule: ''
          }
        },
        {
          id: 'support_structure',
          title: isArabic ? 'هيكل الدعم والشراكة مع AqlHR' : 'AqlHR Support & Partnership Structure',
          type: 'recommendations',
          content: {
            implementationSupport: '',
            ongoingSupport: '',
            trainingPrograms: [],
            consultationSchedule: '',
            escalationProcess: ''
          }
        },
        {
          id: 'action_items',
          title: isArabic ? 'بنود العمل الفورية' : 'Immediate Action Items',
          type: 'next_steps',
          content: {
            immediateActions: [],
            approvalProcess: '',
            kickoffPlanning: '',
            stakeholderEngagement: '',
            consultationBooking: ''
          }
        }
      ]
    }
  };

  const generatePresentation = async (assessment: AssessmentData, templateType: string) => {
    console.log('🚀 Starting presentation generation for:', { 
      company: assessment.companyName, 
      template: templateType,
      assessment 
    });
    
    const template = presentationTemplates[templateType];
    if (!template) {
      console.error('❌ Template not found:', templateType);
      return null;
    }

    console.log('📋 Using template:', template.name);
    setGenerationProgress(prev => ({ ...prev, [assessment.companyName]: 0 }));

    // Simulate presentation generation with progress updates
    const steps = template.slides.length;
    console.log('📊 Generating', steps, 'slides');
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const progress = Math.round(((i + 1) / steps) * 100);
      console.log(`⏳ Progress: ${progress}% - Slide ${i + 1}/${steps}: ${template.slides[i].title}`);
      setGenerationProgress(prev => ({ 
        ...prev, 
        [assessment.companyName]: progress
      }));
    }

    // Generate populated presentation
    const populatedSlides = template.slides.map(slide => ({
      ...slide,
      content: populateSlideContent(slide, assessment)
    }));

    const presentation = {
      id: `pres_${Date.now()}`,
      companyName: assessment.companyName,
      templateType,
      template: template.name,
      slides: populatedSlides,
      generatedDate: new Date().toISOString(),
      status: 'generated',
      deliveryStatus: 'pending',
      engagementScore: 0,
      assessment
    };

    setPresentations(prev => [...prev, presentation]);
    
    // Auto-deliver presentation
    await deliverPresentation(presentation);
    
    return presentation;
  };

  const populateSlideContent = (slide: any, assessment: AssessmentData) => {
    const content = { ...slide.content };
    
    // Replace placeholders with actual data
    const replacements = {
      '{CompanyName}': assessment.companyName,
      '{AssessmentScore}': assessment.overallScore.toString(),
      '{IndustryAverage}': '65', // Could be calculated from industry data
      '{EliteStandard}': '85'
    };

    // Populate content based on slide type
    switch (slide.type) {
      case 'summary':
        content.keyFindings = assessment.gaps.slice(0, 3).map(gap => 
          `${gap.area}: ${gap.gap} points below elite standard (${gap.impact} impact)`
        );
        content.strategicRecommendation = generateStrategicRecommendation(assessment);
        content.investmentOverview = calculateTotalInvestment(assessment.recommendations);
        content.expectedROI = calculateExpectedROI(assessment);
        break;
        
      case 'analysis':
        if (slide.id === 'current_state') {
          content.dimensionalAnalysis = assessment.dimensionalScores;
          content.strengthsIdentified = getStrengths(assessment);
          content.criticalGaps = assessment.gaps.filter(gap => gap.priority === 'high');
          content.competitivePosition = generateCompetitivePosition(assessment);
          content.riskFactors = identifyRiskFactors(assessment);
        }
        break;
        
      case 'recommendations':
        if (slide.id === 'solution_overview') {
          content.primaryRecommendations = assessment.recommendations.filter(rec => 
            rec.priority.includes('HIGH') || rec.priority.includes('أولوية عالية')
          );
          content.supportingCapabilities = assessment.recommendations.filter(rec => 
            rec.priority.includes('MEDIUM') || rec.priority.includes('أولوية متوسطة')
          );
        }
        break;
    }

    return content;
  };

  const generateStrategicRecommendation = (assessment: AssessmentData) => {
    const isArabic = language === 'ar';
    const primaryGap = assessment.gaps[0];
    const expectedScore = Math.min(assessment.overallScore + 25, 85);
    
    if (isArabic) {
      return `بناءً على التقييم، تُظهر ${assessment.companyName} أداءً بمستوى ${assessment.overallScore}/100 مقارنة بمتوسط الصناعة البالغ 65/100. يحدد تحليلنا ${primaryGap.area} كأهم مجال للتطوير الاستراتيجي. من خلال تنفيذ حلول AqlHR الموصى بها، يمكن لـ ${assessment.companyName} تحقيق أداء ${expectedScore}/100، مما يضعها في مصاف الشركات الرائدة.`;
    } else {
      return `Based on the assessment, ${assessment.companyName} demonstrates ${assessment.overallScore}/100 performance compared to the industry average of 65/100. Our analysis identifies ${primaryGap.area} as the most critical area for strategic advancement. By implementing our recommended AqlHR solutions, ${assessment.companyName} can achieve ${expectedScore}/100 performance, matching elite corporate standards.`;
    }
  };

  const calculateTotalInvestment = (recommendations: any[]) => {
    // Calculate total investment from recommendations
    const total = recommendations.reduce((sum, rec) => {
      const investment = rec.investment;
      // Extract numbers from investment string (e.g., "SAR 750,000-1,125,000")
      const matches = investment.match(/[\d,]+/g);
      if (matches && matches.length >= 2) {
        const min = parseInt(matches[0].replace(/,/g, ''));
        const max = parseInt(matches[1].replace(/,/g, ''));
        return sum + (min + max) / 2;
      }
      return sum;
    }, 0);
    
    const isArabic = language === 'ar';
    return isArabic 
      ? `إجمالي الاستثمار: ${total.toLocaleString('ar-SA')} ريال سعودي`
      : `Total Investment: SAR ${total.toLocaleString()}`;
  };

  const calculateExpectedROI = (assessment: AssessmentData) => {
    // Calculate ROI based on gap closure and business impact
    const avgROI = assessment.recommendations.reduce((sum, rec) => {
      const roi = parseInt(rec.roi.replace('%', ''));
      return sum + roi;
    }, 0) / assessment.recommendations.length;
    
    return `${Math.round(avgROI)}%`;
  };

  const getStrengths = (assessment: AssessmentData) => {
    return Object.entries(assessment.dimensionalScores)
      .filter(([_, score]) => score >= 75)
      .map(([dimension, score]) => `${dimension}: ${score}/100`);
  };

  const generateCompetitivePosition = (assessment: AssessmentData) => {
    const isArabic = language === 'ar';
    const score = assessment.overallScore;
    
    if (score >= 80) {
      return isArabic ? 'متقدم في السوق' : 'Market Leader';
    } else if (score >= 65) {
      return isArabic ? 'منافس قوي' : 'Strong Competitor';
    } else if (score >= 50) {
      return isArabic ? 'متوسط السوق' : 'Market Average';
    } else {
      return isArabic ? 'يحتاج تطوير' : 'Needs Development';
    }
  };

  const identifyRiskFactors = (assessment: AssessmentData) => {
    const isArabic = language === 'ar';
    const risks = [];
    
    assessment.gaps.forEach(gap => {
      if (gap.priority === 'high') {
        if (isArabic) {
          risks.push(`مخاطر عالية في ${gap.area} - تأثير ${gap.impact}`);
        } else {
          risks.push(`High risk in ${gap.area} - ${gap.impact} impact`);
        }
      }
    });
    
    return risks;
  };

  const deliverPresentation = async (presentation: any) => {
    // Simulate email delivery
    console.log('Delivering presentation to:', presentation.assessment.contacts);
    
    // Update delivery status
    setPresentations(prev => 
      prev.map(p => 
        p.id === presentation.id 
          ? { ...p, deliveryStatus: 'delivered', deliveredAt: new Date().toISOString() }
          : p
      )
    );
  };

  const mockAssessmentData: AssessmentData = {
    companyName: "شركة البترول السعودية",
    industry: "الطاقة والبترول",
    employeeCount: "5000+",
    overallScore: 72,
    dimensionalScores: {
      "الاستراتيجية": 75,
      "العمليات": 68,
      "التكنولوجيا": 70,
      "الموارد البشرية": 74,
      "الامتثال": 69
    },
    gaps: [
      {
        area: "التحول الرقمي",
        gap: 18,
        impact: "عالي",
        priority: 'high'
      },
      {
        area: "أتمتة العمليات",
        gap: 15,
        impact: "متوسط",
        priority: 'medium'
      },
      {
        area: "التكامل الحكومي",
        gap: 12,
        impact: "متوسط",
        priority: 'medium'
      }
    ],
    recommendations: [
      {
        module: "مركز الذكاء التنفيذي",
        priority: "أولوية عالية",
        investment: "750,000-1,125,000 ريال سعودي",
        roi: "320%"
      },
      {
        module: "التكامل الحكومي + محرك الأتمتة",
        priority: "أولوية متوسطة",
        investment: "562,500-937,500 ريال سعودي",
        roi: "280%"
      }
    ],
    contacts: {
      ceo: { name: "أحمد المحمد", email: "ahmed.almohamed@company.com" },
      hrDirector: { name: "فاطمة السعد", email: "fatima.alsaad@company.com" }
    }
  };

  // Initialize with mock data
  useEffect(() => {
    setAssessments([mockAssessmentData]);
  }, []);

  return (
    <div className="mckinsey-presentation-generator p-6 space-y-6">
      {/* Header */}
      <div className="header-section">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              {isArabic ? '🎯 مولد العروض الاستراتيجية' : '🎯 McKinsey Presentation Generator'}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {isArabic 
                ? 'تحويل التقييمات إلى عروض تقديمية تنفيذية عالية الجودة وتسليمها تلقائياً' 
                : 'Transform assessments into executive-quality presentations and deliver automatically'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {isArabic ? 'نشط' : 'ACTIVE'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'التقييمات النشطة' : 'Active Assessments'}
                </p>
                <p className="text-3xl font-bold text-primary">3</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'العروض المُولدة' : 'Presentations Generated'}
                </p>
                <p className="text-3xl font-bold text-brand-success">12</p>
              </div>
              <FileText className="h-8 w-8 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'المشاورات المحجوزة' : 'Consultations Booked'}
                </p>
                <p className="text-3xl font-bold text-brand-accent">8</p>
              </div>
              <Briefcase className="h-8 w-8 text-brand-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'معدل التحويل' : 'Conversion Rate'}
                </p>
                <p className="text-3xl font-bold text-brand-warning">73%</p>
              </div>
              <Target className="h-8 w-8 text-brand-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pipeline" className="presentation-tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline">
            {isArabic ? 'خط الإنتاج' : 'Pipeline'}
          </TabsTrigger>
          <TabsTrigger value="presentations">
            {isArabic ? 'العروض التقديمية' : 'Presentations'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isArabic ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isArabic ? 'خط التقييمات' : 'Assessment Pipeline'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'التقييمات المكتملة في انتظار توليد العروض التقديمية'
                  : 'Completed assessments awaiting presentation generation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment, index) => (
                  <div key={index} className="assessment-card p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{assessment.companyName}</h3>
                            <p className="text-muted-foreground">{assessment.industry} • {assessment.employeeCount} {isArabic ? 'موظف' : 'employees'}</p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {assessment.overallScore}/100
                          </Badge>
                        </div>
                        
                        {generationProgress[assessment.companyName] !== undefined && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                {isArabic ? 'توليد العرض التقديمي...' : 'Generating presentation...'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {generationProgress[assessment.companyName]}%
                              </span>
                            </div>
                            <Progress value={generationProgress[assessment.companyName]} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-brand-success" />
                          <span>{isArabic ? 'التقييم مكتمل' : 'Assessment Completed'}</span>
                          <AlertCircle className="h-4 w-4 text-brand-warning ml-4" />
                          <span>{assessment.gaps.length} {isArabic ? 'فجوات استراتيجية' : 'strategic gaps identified'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => generatePresentation(assessment, 'ceo')}
                          disabled={generationProgress[assessment.companyName] !== undefined}
                          className="min-w-[180px]"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {isArabic ? 'عرض الرئيس التنفيذي' : 'CEO Presentation'}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => generatePresentation(assessment, 'hr_director')}
                          disabled={generationProgress[assessment.companyName] !== undefined}
                          className="min-w-[180px]"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          {isArabic ? 'عرض مدير الموارد البشرية' : 'HR Director Presentation'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presentations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isArabic ? 'مكتبة العروض التقديمية' : 'Presentation Library'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'جميع العروض التقديمية المُولدة مع إمكانية المعاينة والتخصيص'
                  : 'All generated presentations with preview and customization options'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presentations.map((presentation) => (
                  <Card key={presentation.id} className="presentation-card">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant={presentation.deliveryStatus === 'delivered' ? 'default' : 'secondary'}>
                            {presentation.deliveryStatus === 'delivered' 
                              ? (isArabic ? 'تم التسليم' : 'Delivered')
                              : (isArabic ? 'في الانتظار' : 'Pending')
                            }
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(presentation.generatedDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">{presentation.companyName}</h4>
                          <p className="text-sm text-muted-foreground">{presentation.template}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {isArabic ? 'المشاركة:' : 'Engagement:'}
                          </span>
                          <span className="font-medium">{presentation.engagementScore}%</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            {isArabic ? 'معاينة' : 'Preview'}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-1" />
                            {isArabic ? 'تحميل' : 'Download'}
                          </Button>
                          {presentation.deliveryStatus === 'pending' && (
                            <Button size="sm" className="flex-1">
                              <Send className="h-4 w-4 mr-1" />
                              {isArabic ? 'إرسال' : 'Send'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {presentations.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {isArabic 
                        ? 'لم يتم توليد أي عروض تقديمية بعد'
                        : 'No presentations generated yet'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'معدلات التحويل' : 'Conversion Rates'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'من التقييم إلى المشاورة' : 'Assessment to Consultation'}</span>
                    <span className="font-bold text-brand-success">73%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'مشاهدة العرض التقديمي' : 'Presentation Viewing'}</span>
                    <span className="font-bold text-brand-accent">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'حجز المشاورة المباشر' : 'Direct Consultation Booking'}</span>
                    <span className="font-bold text-brand-warning">52%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'الأداء الشهري' : 'Monthly Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'العروض المُولدة' : 'Presentations Generated'}</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'المشاورات المحجوزة' : 'Consultations Booked'}</span>
                    <span className="font-bold">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'الإيرادات المتوقعة' : 'Expected Revenue'}</span>
                    <span className="font-bold text-brand-success">2.4M {isArabic ? 'ريال' : 'SAR'}</span>
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

export default McKinseyPresentationGenerator;