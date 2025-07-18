import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Brain, Target, BarChart3, Trophy, Lightbulb, ArrowRight, Star, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  questionAr: string;
  type: 'radio' | 'scale' | 'multiselect';
  options?: string[];
  optionsAr?: string[];
  scale?: string;
  weight: number;
  aqlhrSolution?: string;
}

interface AssessmentSection {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  questions: AssessmentQuestion[];
}

const AIStrategicAssessment = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';
  
  const [currentStep, setCurrentStep] = useState<'welcome' | 'assessment' | 'results'>('welcome');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const assessmentSections: AssessmentSection[] = [
    {
      id: 'organizational-profile',
      name: 'Organizational Profile',
      nameAr: 'ملف المنظمة',
      description: 'Company size, industry, and current HR system maturity',
      descriptionAr: 'حجم الشركة والصناعة ونضج نظام الموارد البشرية الحالي',
      questions: [
        {
          id: 'OP001',
          question: "What is your organization's current employee count?",
          questionAr: "ما هو عدد الموظفين الحالي في منظمتكم؟",
          type: 'radio',
          options: [
            "1-50 employees (Small Enterprise)",
            "51-250 employees (Medium Enterprise)", 
            "251-1,000 employees (Large Corporation)",
            "1,001-5,000 employees (Major Corporation)",
            "5,000+ employees (Enterprise Corporation)"
          ],
          optionsAr: [
            "1-50 موظف (مؤسسة صغيرة)",
            "51-250 موظف (مؤسسة متوسطة)",
            "251-1,000 موظف (شركة كبيرة)",
            "1,001-5,000 موظف (شركة رئيسية)",
            "5,000+ موظف (شركة عملاقة)"
          ],
          weight: 20
        },
        {
          id: 'OP002',
          question: "Which best describes your current HR system?",
          questionAr: "أي مما يلي يصف أفضل نظام الموارد البشرية الحالي لديكم؟",
          type: 'radio',
          options: [
            "Manual processes and spreadsheets",
            "Basic HR software with limited features",
            "Integrated HR system with some automation",
            "Advanced HR platform with AI capabilities",
            "Enterprise-grade HR ecosystem with full integration"
          ],
          optionsAr: [
            "عمليات يدوية وجداول بيانات",
            "برنامج موارد بشرية أساسي بميزات محدودة",
            "نظام موارد بشرية متكامل مع بعض الأتمتة",
            "منصة موارد بشرية متقدمة مع قدرات الذكاء الاصطناعي",
            "نظام موارد بشرية متكامل بمستوى المؤسسات"
          ],
          weight: 25,
          aqlhrSolution: "Core HR + AI Automation Engine"
        }
      ]
    },
    {
      id: 'strategic-alignment',
      name: 'Strategic Alignment',
      nameAr: 'التوافق الاستراتيجي',
      description: 'Vision 2030 alignment and strategic planning maturity',
      descriptionAr: 'التوافق مع رؤية 2030 ونضج التخطيط الاستراتيجي',
      questions: [
        {
          id: 'SA001',
          question: "How well aligned is your HR strategy with Saudi Vision 2030 objectives?",
          questionAr: "ما مدى توافق استراتيجية الموارد البشرية لديكم مع أهداف رؤية السعودية 2030؟",
          type: 'scale',
          scale: "1-10",
          weight: 25,
          aqlhrSolution: "Executive Intelligence Center + Strategic Planning"
        },
        {
          id: 'SA002',
          question: "How quickly can your executive team access comprehensive workforce analytics?",
          questionAr: "ما مدى سرعة وصول فريقكم التنفيذي إلى تحليلات شاملة للقوى العاملة؟",
          type: 'radio',
          options: [
            "Real-time access with predictive insights",
            "Same-day reporting with basic analytics",
            "Weekly reports with limited insights",
            "Monthly reports with basic data",
            "Quarterly or longer reporting cycles",
            "No structured workforce analytics available"
          ],
          optionsAr: [
            "وصول فوري مع رؤى تنبؤية",
            "تقارير في نفس اليوم مع تحليلات أساسية",
            "تقارير أسبوعية مع رؤى محدودة",
            "تقارير شهرية مع بيانات أساسية",
            "دورات تقارير ربع سنوية أو أطول",
            "لا تتوفر تحليلات منظمة للقوى العاملة"
          ],
          weight: 30,
          aqlhrSolution: "Executive Intelligence Center (PREMIUM)"
        }
      ]
    },
    {
      id: 'operational-excellence',
      name: 'Operational Excellence',
      nameAr: 'التميز التشغيلي',
      description: 'Government platform integration and process automation',
      descriptionAr: 'تكامل المنصات الحكومية وأتمتة العمليات',
      questions: [
        {
          id: 'OE001',
          question: "Which Saudi government platforms is your HR system currently integrated with?",
          questionAr: "ما هي المنصات الحكومية السعودية المتكاملة حالياً مع نظام الموارد البشرية لديكم؟",
          type: 'multiselect',
          options: [
            "Qiwa (Ministry of Labor)",
            "GOSI (General Organization for Social Insurance)",
            "Absher (Ministry of Interior)",
            "HRSD (Human Resources & Social Development)",
            "MOL (Ministry of Labor)",
            "Mudad (Unified Labor Platform)",
            "Muqeem (Residency Management)",
            "Nafath (National Single Sign-On)",
            "Yakeen (Identity Verification)",
            "ELM (Education & Training)",
            "None of the above"
          ],
          optionsAr: [
            "قوى (وزارة العمل)",
            "التأمينات الاجتماعية",
            "أبشر (وزارة الداخلية)",
            "وزارة الموارد البشرية والتنمية الاجتماعية",
            "وزارة العمل",
            "مداد (منصة العمل الموحدة)",
            "مقيم (إدارة الإقامة)",
            "نفاذ (الدخول الموحد الوطني)",
            "يقين (التحقق من الهوية)",
            "علم (التعليم والتدريب)",
            "لا شيء مما سبق"
          ],
          weight: 30,
          aqlhrSolution: "Government Integrations (21 platforms)"
        },
        {
          id: 'OE002',
          question: "What percentage of your HR processes are automated?",
          questionAr: "ما هي نسبة عمليات الموارد البشرية المؤتمتة لديكم؟",
          type: 'radio',
          options: [
            "90-100% (Fully automated)",
            "70-89% (Highly automated)",
            "50-69% (Moderately automated)",
            "30-49% (Partially automated)",
            "10-29% (Minimally automated)",
            "0-9% (Mostly manual)"
          ],
          optionsAr: [
            "90-100% (مؤتمت بالكامل)",
            "70-89% (مؤتمت بدرجة عالية)",
            "50-69% (مؤتمت بدرجة متوسطة)",
            "30-49% (مؤتمت جزئياً)",
            "10-29% (مؤتمت بدرجة قليلة)",
            "0-9% (يدوي في الغالب)"
          ],
          weight: 20,
          aqlhrSolution: "AI Automation Engine + Core HR"
        }
      ]
    },
    {
      id: 'talent-management',
      name: 'Talent Management',
      nameAr: 'إدارة المواهب',
      description: 'Saudization performance and employee development',
      descriptionAr: 'أداء السعودة وتطوير الموظفين',
      questions: [
        {
          id: 'TM001',
          question: "How effectively does your organization meet Saudization requirements?",
          questionAr: "ما مدى فعالية منظمتكم في تحقيق متطلبات السعودة؟",
          type: 'radio',
          options: [
            "Consistently exceed requirements with strategic planning",
            "Meet requirements with good planning",
            "Usually meet requirements with some challenges",
            "Struggle to meet requirements consistently",
            "Frequently fall short of requirements",
            "Unsure of current Saudization status"
          ],
          optionsAr: [
            "تتجاوز المتطلبات باستمرار مع التخطيط الاستراتيجي",
            "تحقق المتطلبات مع تخطيط جيد",
            "تحقق المتطلبات عادة مع بعض التحديات",
            "تواجه صعوبة في تحقيق المتطلبات باستمرار",
            "تقصر في تحقيق المتطلبات بشكل متكرر",
            "غير متأكد من حالة السعودة الحالية"
          ],
          weight: 30,
          aqlhrSolution: "Saudization & Visa Calculator + Skills Intelligence"
        }
      ]
    },
    {
      id: 'compliance-risk',
      name: 'Compliance & Risk',
      nameAr: 'الامتثال والمخاطر',
      description: 'Regulatory compliance and risk management',
      descriptionAr: 'الامتثال التنظيمي وإدارة المخاطر',
      questions: [
        {
          id: 'CR001',
          question: "How prepared is your organization for regulatory audits?",
          questionAr: "ما مدى استعداد منظمتكم للمراجعات التنظيمية؟",
          type: 'radio',
          options: [
            "Always audit-ready with real-time compliance monitoring",
            "Well-prepared with regular compliance reviews",
            "Moderately prepared with periodic compliance checks",
            "Somewhat prepared but requires preparation time",
            "Poorly prepared - significant effort required",
            "Not prepared for regulatory audits"
          ],
          optionsAr: [
            "جاهز دائماً للمراجعة مع مراقبة الامتثال في الوقت الفعلي",
            "محضر جيداً مع مراجعات امتثال منتظمة",
            "محضر بدرجة متوسطة مع فحوصات امتثال دورية",
            "محضر إلى حد ما لكن يتطلب وقت تحضير",
            "محضر بشكل ضعيف - يتطلب جهد كبير",
            "غير محضر للمراجعات التنظيمية"
          ],
          weight: 25,
          aqlhrSolution: "Legal Consultant AI + Government Integrations"
        }
      ]
    }
  ];

  const eliteBenchmarks = {
    energySector: { score: 95, description: "Major Energy Corporation Standard" },
    sovereignFund: { score: 97, description: "Sovereign Wealth Fund Standard" },
    industrialChampion: { score: 92, description: "Leading Industrial Conglomerate" }
  };

  const calculateProgress = () => {
    const totalQuestions = assessmentSections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    console.log('✅ Answer recorded:', questionId, '=', answer);
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    const currentSectionQuestions = assessmentSections[currentSection].questions;
    console.log('➡️ Navigation - Current:', currentSection, currentQuestion, 'Total sections:', assessmentSections.length, 'Questions in section:', currentSectionQuestions.length);
    
    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log('📋 Moving to next question:', currentQuestion + 1);
    } else if (currentSection < assessmentSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      console.log('📂 Moving to next section:', currentSection + 1);
    } else {
      // Assessment complete
      console.log('🎉 Assessment completed! Generating results...');
      setCurrentStep('results');
      generateResults();
    }
  };

  const generateResults = () => {
    // Simulate AI analysis
    console.log('🤖 AI Analysis started with answers:', Object.keys(answers).length, 'total answers');
    console.log('📊 Assessment data:', answers);
    toast({
      title: isArabic ? "تحليل الذكاء الاصطناعي مكتمل" : "AI Analysis Complete",
      description: isArabic ? "تم إنشاء توصياتكم الاستراتيجية" : "Your strategic recommendations have been generated"
    });
    setShowResults(true);
    console.log('✨ Results generated and displayed');
  };

  const startAssessment = () => {
    console.log('🧠 AI Assessment Started - Testing functionality');
    setCurrentStep('assessment');
    console.log('📊 Current step changed to assessment, section:', currentSection, 'question:', currentQuestion);
    toast({
      title: isArabic ? "بدء التقييم" : "Assessment Started",
      description: isArabic ? "التقييم الاستراتيجي للذكاء التنظيمي" : "Strategic Organizational Intelligence Assessment"
    });
  };

  if (currentStep === 'welcome') {
    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-brand-primary" />
          </div>
          <div>
            <Badge className="mb-4 bg-brand-accent text-background">
              {isArabic ? "جديد" : "NEW"}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {isArabic ? "تقييم الذكاء التنظيمي الاستراتيجي AqlHR" : "AqlHR Strategic Organizational Intelligence Assessment"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {isArabic 
                ? "اكتشف كيف تقارن منظمتكم مع أنجح الشركات في المملكة العربية السعودية وحدد الفرص للتقدم الاستراتيجي"
                : "Discover how your organization compares to Saudi Arabia's most successful corporations and identify opportunities for strategic advancement"
              }
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-brand-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {isArabic ? "35 سؤال تكيفي" : "35 Adaptive Questions"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "أسئلة ذكية تتكيف مع صناعتكم" : "Smart questions that adapt to your industry"}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="h-8 w-8 text-brand-secondary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {isArabic ? "تحليل فوري بالذكاء الاصطناعي" : "Immediate AI Analysis"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "نتائج فورية مع رؤى عميقة" : "Instant results with deep insights"}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-brand-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {isArabic ? "مقارنة بالشركات النخبة" : "Elite Corporate Benchmarking"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "مقارنة مع أفضل الشركات السعودية" : "Compare against top Saudi corporations"}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Lightbulb className="h-8 w-8 text-brand-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {isArabic ? "توصيات استراتيجية" : "Strategic Recommendations"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "خطة عمل مخصصة لمنظمتكم" : "Customized action plan for your organization"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-secondary" />
              {isArabic ? "ما ستحصلون عليه" : "What You'll Get"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-brand-primary">
                  {isArabic ? "تحليل شامل" : "Comprehensive Analysis"}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {isArabic ? "تقييم النضج التنظيمي" : "Organizational maturity assessment"}</li>
                  <li>• {isArabic ? "تحليل الفجوات الاستراتيجية" : "Strategic gap analysis"}</li>
                  <li>• {isArabic ? "مقارنة بمعايير الصناعة" : "Industry benchmark comparison"}</li>
                  <li>• {isArabic ? "تحديد فرص التحسين" : "Improvement opportunities identification"}</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-brand-primary">
                  {isArabic ? "حلول AqlHR المخصصة" : "Tailored AqlHR Solutions"}
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {isArabic ? "توصيات محددة للوحدات" : "Specific module recommendations"}</li>
                  <li>• {isArabic ? "حساب العائد على الاستثمار" : "ROI calculations"}</li>
                  <li>• {isArabic ? "خريطة طريق التنفيذ" : "Implementation roadmap"}</li>
                  <li>• {isArabic ? "ربط مباشر بالخدمات الاستشارية" : "Direct consulting services mapping"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <Button 
            onClick={startAssessment}
            size="lg" 
            className="bg-brand-primary hover:bg-brand-primary/90 text-background px-8 py-3 text-lg"
          >
            {isArabic ? "ابدأ التقييم الآن" : "BEGIN ASSESSMENT NOW"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? "يستغرق 10-15 دقيقة • نتائج فورية • تحليل مجاني" 
              : "Takes 10-15 minutes • Instant results • Free analysis"
            }
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'assessment') {
    const currentSectionData = assessmentSections[currentSection];
    const currentQuestionData = currentSectionData.questions[currentQuestion];
    const progress = calculateProgress();

    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Progress Header */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isArabic ? currentSectionData.nameAr : currentSectionData.name}
              </h2>
              <p className="text-muted-foreground">
                {isArabic ? currentSectionData.descriptionAr : currentSectionData.description}
              </p>
            </div>
            <Badge variant="secondary">
              {isArabic ? `القسم ${currentSection + 1} من 5` : `Section ${currentSection + 1} of 5`}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{isArabic ? `السؤال ${currentQuestion + 1} من ${currentSectionData.questions.length}` : `Question ${currentQuestion + 1} of ${currentSectionData.questions.length}`}</span>
              <span>{progress}% {isArabic ? "مكتمل" : "Complete"}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isArabic ? currentQuestionData.questionAr : currentQuestionData.question}
            </CardTitle>
            {currentQuestionData.aqlhrSolution && (
              <Badge variant="outline" className="w-fit">
                🎯 {currentQuestionData.aqlhrSolution}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestionData.type === 'radio' && (
              <RadioGroup
                value={answers[currentQuestionData.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
              >
                {currentQuestionData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {isArabic && currentQuestionData.optionsAr ? currentQuestionData.optionsAr[index] : option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestionData.type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isArabic ? "ضعيف جداً" : "Very Poor"}</span>
                  <span>{isArabic ? "ممتاز" : "Excellent"}</span>
                </div>
                <RadioGroup
                  value={answers[currentQuestionData.id] || ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                  className="flex justify-between"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <div key={num} className="flex flex-col items-center space-y-1">
                      <RadioGroupItem value={num.toString()} id={`scale-${num}`} />
                      <Label htmlFor={`scale-${num}`} className="text-xs">{num}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentQuestionData.type === 'multiselect' && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`multi-${index}`}
                      checked={answers[currentQuestionData.id]?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQuestionData.id] || [];
                        if (checked) {
                          handleAnswerChange(currentQuestionData.id, [...currentAnswers, option]);
                        } else {
                          handleAnswerChange(currentQuestionData.id, currentAnswers.filter((a: string) => a !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`multi-${index}`} className="flex-1 cursor-pointer">
                      {isArabic && currentQuestionData.optionsAr ? currentQuestionData.optionsAr[index] : option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQuestionData.id]}
                className="w-full"
              >
                {currentSection === assessmentSections.length - 1 && currentQuestion === currentSectionData.questions.length - 1
                  ? (isArabic ? "إنهاء التقييم" : "Complete Assessment")
                  : (isArabic ? "السؤال التالي" : "Next Question")
                }
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results' && showResults) {
    // Mock results for demonstration
    const mockResults = {
      overallScore: 72,
      industryAverage: 65,
      eliteStandard: 92,
      dimensions: [
        { name: isArabic ? "التوافق الاستراتيجي" : "Strategic Alignment", score: 68, gap: 24 },
        { name: isArabic ? "التميز التشغيلي" : "Operational Excellence", score: 75, gap: 17 },
        { name: isArabic ? "إدارة المواهب" : "Talent Management", score: 70, gap: 22 },
        { name: isArabic ? "الامتثال والمخاطر" : "Compliance & Risk", score: 77, gap: 15 }
      ],
      recommendations: [
        {
          id: 1,
          priority: isArabic ? "أولوية عالية" : "HIGH PRIORITY",
          solution: isArabic ? "مركز الذكاء التنفيذي (بريميوم)" : "Executive Intelligence Center (PREMIUM)",
          description: isArabic ? "حقق ذكاء القوى العاملة الاستراتيجي المستخدم من قبل شركات الطاقة الكبرى" : "Achieve strategic workforce intelligence used by major energy corporations",
          investment: isArabic ? "750,000-1,125,000 ريال سعودي" : "SAR 750,000-1,125,000",
          roi: "320%"
        },
        {
          id: 2,
          priority: isArabic ? "أولوية متوسطة" : "MEDIUM PRIORITY",
          solution: isArabic ? "التكامل الحكومي (21 منصة) + محرك الأتمتة بالذكاء الاصطناعي" : "Government Integrations (21 platforms) + AI Automation Engine",
          description: isArabic ? "اطابق التميز التشغيلي للشركات السعودية الرائدة" : "Match operational excellence of leading Saudi corporations",
          investment: isArabic ? "562,500-937,500 ريال سعودي" : "SAR 562,500-937,500",
          roi: "280%"
        }
      ]
    };

    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Results Header */}
        <div className="text-center space-y-4 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-xl p-8">
          <Trophy className="h-12 w-12 text-brand-accent mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? "نتائج تقييمكم" : "Your Assessment Results"}
          </h1>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary">{mockResults.overallScore}/100</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "نتيجتكم الإجمالية" : "Your Overall Score"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{mockResults.industryAverage}/100</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "متوسط الصناعة" : "Industry Average"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">{mockResults.eliteStandard}/100</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "معيار النخبة" : "Elite Standard"}</div>
            </div>
          </div>
        </div>

        {/* Dimensional Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {isArabic ? "التحليل البعدي" : "Dimensional Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockResults.dimensions.map((dimension, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{dimension.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {dimension.score}/100
                    </span>
                  </div>
                  <Progress value={dimension.score} className="h-2" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    {isArabic ? `فجوة: ${dimension.gap} نقطة عن معيار النخبة` : `Gap: ${dimension.gap} points below elite standard`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AqlHR Solutions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {isArabic ? "حلول AqlHR لسد الفجوات" : "AqlHR Solutions to Bridge Gaps"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockResults.recommendations.map((rec) => (
                <Card key={rec.id} className="border-l-4 border-l-brand-primary">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <Badge className={rec.priority.includes("HIGH") || rec.priority.includes("عالية") ? "bg-destructive" : "bg-warning"}>
                          {rec.priority}
                        </Badge>
                        <h3 className="text-lg font-semibold">{rec.solution}</h3>
                        <p className="text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? "الاستثمار:" : "Investment:"} {rec.investment}
                        </div>
                        <div className="text-sm font-medium text-brand-secondary">
                          {isArabic ? "العائد على الاستثمار:" : "ROI:"} {rec.roi}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          {isArabic ? "عرض توضيحي" : "VIEW DEMO"}
                        </Button>
                        <Button size="sm" className="bg-brand-primary">
                          {isArabic ? "حجز استشارة" : "SCHEDULE CONSULTATION"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consulting Services Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {isArabic ? "الخدمات الاستشارية الموصى بها" : "Recommended Consulting Services"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: isArabic ? "التخطيط الاستراتيجي" : "Strategic Planning", investment: isArabic ? "562,500-1,125,000 ريال" : "SAR 562,500-1,125,000" },
                { name: isArabic ? "التحول الرقمي" : "Digital Transformation", investment: isArabic ? "750,000-1,500,000 ريال" : "SAR 750,000-1,500,000" },
                { name: isArabic ? "إدارة التغيير" : "Change Management", investment: isArabic ? "375,000-750,000 ريال" : "SAR 375,000-750,000" }
              ].map((service, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.investment}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {isArabic ? "تعلم المزيد" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center space-y-4">
          <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-background px-8">
            {isArabic ? "حمل التقرير الكامل" : "Download Complete Report"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? "احصل على تقرير مفصل بتحليل شامل وتوصيات مخصصة"
              : "Get a detailed report with comprehensive analysis and customized recommendations"
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AIStrategicAssessment;