import React, { useEffect, useState } from 'react';
import { useOnboardingProfile } from '@/hooks/useOnboardingProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Shield, 
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  BarChart3,
  FileText,
  Settings,
  Clock
} from 'lucide-react';

interface OnboardingCompletionStepProps {
  isArabic: boolean;
}

interface Recommendation {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  categoryAr: string;
  icon: React.ComponentType<any>;
  estimatedImpact: number;
  implementationComplexity: 'easy' | 'medium' | 'complex';
}

interface InsightMetric {
  key: string;
  labelEn: string;
  labelAr: string;
  value: string | number;
  valueAr?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'stable';
}

export function OnboardingCompletionStep({ isArabic }: OnboardingCompletionStepProps) {
  const { data } = useOnboardingProfile();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<InsightMetric[]>([]);
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    generateRecommendations();
    generateInsights();
    calculateCompletionScore();
  }, [data]);

  const calculateCompletionScore = () => {
    let score = 0;
    
    // Base scoring
    if (data.industry_type) score += 10;
    if (data.company_size) score += 10;
    if (data.hr_challenges.length > 0) score += 15;
    if (data.existing_hr_tools.length > 0) score += 10;
    if (data.saudization_percentage_goal) score += 15;
    
    // Process assessment scoring
    if (data.recruitment_process?.steps.length > 0) score += 15;
    if (data.performance_review_frequency) score += 10;
    if (data.leave_management_complexity) score += 10;
    if (data.compliance_concerns.length > 0) score += 5;
    
    setCompletionScore(Math.min(score, 100));
  };

  const generateInsights = () => {
    const generatedInsights: InsightMetric[] = [
      {
        key: 'industry_focus',
        labelEn: 'Industry Focus',
        labelAr: 'تركيز الصناعة',
        value: data.industry_type || 'Not specified',
        valueAr: getIndustryLabel(data.industry_type, true),
        icon: Target
      },
      {
        key: 'company_maturity',
        labelEn: 'Company Size Category',
        labelAr: 'فئة حجم الشركة',
        value: data.company_size || 'Not specified',
        valueAr: getCompanySizeLabel(data.company_size, true),
        icon: Users
      },
      {
        key: 'hr_challenges_count',
        labelEn: 'HR Challenge Areas',
        labelAr: 'مجالات تحديات الموارد البشرية',
        value: data.hr_challenges.length,
        icon: Shield,
        trend: data.hr_challenges.length > 5 ? 'up' : data.hr_challenges.length > 2 ? 'stable' : 'down'
      },
      {
        key: 'saudization_target',
        labelEn: 'Saudization Goal',
        labelAr: 'هدف السعودة',
        value: data.saudization_percentage_goal ? `${data.saudization_percentage_goal}%` : 'Not set',
        valueAr: data.saudization_percentage_goal ? `٪${data.saudization_percentage_goal}` : 'غير محدد',
        icon: Award
      },
      {
        key: 'recruitment_steps',
        labelEn: 'Recruitment Process Steps',
        labelAr: 'خطوات عملية التوظيف',
        value: data.recruitment_process?.steps.length || 0,
        icon: Users
      },
      {
        key: 'compliance_concerns',
        labelEn: 'Compliance Focus Areas',
        labelAr: 'مجالات التركيز على الامتثال',
        value: data.compliance_concerns.length,
        icon: ShieldCheck
      }
    ];
    
    setInsights(generatedInsights);
  };

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];
    
    // High priority recommendations based on challenges
    if (data.hr_challenges.includes('saudization_compliance')) {
      recs.push({
        id: 'saudization_dashboard',
        titleEn: 'Implement Saudization Dashboard',
        titleAr: 'تنفيذ لوحة تحكم السعودة',
        descriptionEn: 'Set up real-time Saudization tracking with automated Nitaqat compliance monitoring.',
        descriptionAr: 'إعداد تتبع السعودة في الوقت الفعلي مع مراقبة امتثال نطاقات التلقائية.',
        priority: 'high',
        category: 'Compliance',
        categoryAr: 'الامتثال',
        icon: Shield,
        estimatedImpact: 90,
        implementationComplexity: 'medium'
      });
    }

    if (data.hr_challenges.includes('recruitment_sourcing')) {
      recs.push({
        id: 'ai_recruitment',
        titleEn: 'Enable AI-Powered Recruitment',
        titleAr: 'تفعيل التوظيف المدعوم بالذكاء الاصطناعي',
        descriptionEn: 'Use AI to screen candidates, match skills, and optimize your recruitment funnel.',
        descriptionAr: 'استخدام الذكاء الاصطناعي لفحص المرشحين ومطابقة المهارات وتحسين مسار التوظيف.',
        priority: 'high',
        category: 'Recruitment',
        categoryAr: 'التوظيف',
        icon: Zap,
        estimatedImpact: 85,
        implementationComplexity: 'easy'
      });
    }

    if (data.hr_challenges.includes('performance_management')) {
      recs.push({
        id: 'performance_analytics',
        titleEn: 'Advanced Performance Analytics',
        titleAr: 'تحليلات الأداء المتقدمة',
        descriptionEn: 'Implement predictive performance analytics with automated review scheduling.',
        descriptionAr: 'تنفيذ تحليلات الأداء التنبؤية مع جدولة المراجعة التلقائية.',
        priority: 'medium',
        category: 'Performance',
        categoryAr: 'الأداء',
        icon: TrendingUp,
        estimatedImpact: 75,
        implementationComplexity: 'medium'
      });
    }

    if (data.hr_challenges.includes('government_integration')) {
      recs.push({
        id: 'government_sync',
        titleEn: 'Government Systems Integration',
        titleAr: 'تكامل الأنظمة الحكومية',
        descriptionEn: 'Connect with Qiwa, GOSI, and other government platforms for seamless data sync.',
        descriptionAr: 'الاتصال بقوى وGOSI والمنصات الحكومية الأخرى لمزامنة البيانات السلسة.',
        priority: 'high',
        category: 'Integration',
        categoryAr: 'التكامل',
        icon: Settings,
        estimatedImpact: 95,
        implementationComplexity: 'complex'
      });
    }

    // Add industry-specific recommendations
    if (data.industry_type === 'technology') {
      recs.push({
        id: 'tech_skills_tracking',
        titleEn: 'Technical Skills Intelligence',
        titleAr: 'ذكاء المهارات التقنية',
        descriptionEn: 'Track and develop technical competencies with skills gap analysis.',
        descriptionAr: 'تتبع وتطوير الكفاءات التقنية مع تحليل فجوات المهارات.',
        priority: 'medium',
        category: 'Skills',
        categoryAr: 'المهارات',
        icon: Lightbulb,
        estimatedImpact: 80,
        implementationComplexity: 'easy'
      });
    }

    // Company size based recommendations
    if (data.company_size === 'enterprise') {
      recs.push({
        id: 'org_structure_optimization',
        titleEn: 'Organizational Structure Optimization',
        titleAr: 'تحسين الهيكل التنظيمي',
        descriptionEn: 'Analyze and optimize your organizational structure for better efficiency.',
        descriptionAr: 'تحليل وتحسين الهيكل التنظيمي لزيادة الكفاءة.',
        priority: 'medium',
        category: 'Organization',
        categoryAr: 'التنظيم',
        icon: BarChart3,
        estimatedImpact: 70,
        implementationComplexity: 'complex'
      });
    }

    // Sort by priority and impact
    recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.estimatedImpact - a.estimatedImpact;
    });

    setRecommendations(recs.slice(0, 6)); // Show top 6 recommendations
  };

  const getIndustryLabel = (industry: string, isArabic: boolean) => {
    const industries = {
      technology: { en: 'Technology & Software', ar: 'التكنولوجيا والبرمجيات' },
      healthcare: { en: 'Healthcare & Medical', ar: 'الرعاية الصحية والطب' },
      finance: { en: 'Finance & Banking', ar: 'المالية والمصرفية' },
      manufacturing: { en: 'Manufacturing', ar: 'التصنيع' },
      retail: { en: 'Retail & E-commerce', ar: 'البيع بالتجزئة' },
      education: { en: 'Education', ar: 'التعليم' },
      construction: { en: 'Construction', ar: 'البناء' },
      energy: { en: 'Energy & Oil', ar: 'الطاقة والنفط' },
      telecommunications: { en: 'Telecommunications', ar: 'الاتصالات' },
      consulting: { en: 'Consulting', ar: 'الاستشارات' },
      other: { en: 'Other', ar: 'أخرى' }
    };
    return industries[industry as keyof typeof industries]?.[isArabic ? 'ar' : 'en'] || industry;
  };

  const getCompanySizeLabel = (size: string, isArabic: boolean) => {
    const sizes = {
      startup: { en: 'Startup', ar: 'شركة ناشئة' },
      small: { en: 'Small Company', ar: 'شركة صغيرة' },
      medium: { en: 'Medium Company', ar: 'شركة متوسطة' },
      large: { en: 'Large Company', ar: 'شركة كبيرة' },
      enterprise: { en: 'Enterprise', ar: 'مؤسسة' }
    };
    return sizes[size as keyof typeof sizes]?.[isArabic ? 'ar' : 'en'] || size;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityLabel = (complexity: string) => {
    const labels = {
      easy: { en: 'Easy', ar: 'سهل' },
      medium: { en: 'Medium', ar: 'متوسط' },
      complex: { en: 'Complex', ar: 'معقد' }
    };
    return labels[complexity as keyof typeof labels]?.[isArabic ? 'ar' : 'en'] || complexity;
  };

  return (
    <div className="space-y-6">
      {/* Completion Header */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-400">
            {isArabic ? '🎉 تم إكمال الإعداد بنجاح!' : '🎉 Setup Complete!'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isArabic 
              ? 'تم تخصيص منصة الموارد البشرية حسب احتياجات شركتك' 
              : 'Your HR platform has been personalized for your company\'s needs'
            }
          </CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isArabic ? 'درجة اكتمال الإعداد' : 'Setup Completion Score'}
              </span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {completionScore}/100
              </Badge>
            </div>
            <Progress value={completionScore} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'الرؤى الرئيسية' : 'Key Insights'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ملخص عن ملف شركتك وتفضيلاتها' 
                  : 'Summary of your company profile and preferences'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {insights.map((insight) => (
              <div key={insight.key} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-muted">
                    <insight.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? insight.labelAr : insight.labelEn}
                  </p>
                  <p className="font-semibold">
                    {isArabic && insight.valueAr ? insight.valueAr : insight.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'التوصيات المخصصة' : 'Personalized Recommendations'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'خطة عمل مخصصة بناءً على احتياجاتك وتحدياتك' 
                  : 'Customized action plan based on your needs and challenges'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                        <rec.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">
                          {isArabic ? rec.titleAr : rec.titleEn}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(rec.priority)} variant="outline">
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {isArabic ? rec.categoryAr : rec.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4">
                    {isArabic ? rec.descriptionAr : rec.descriptionEn}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{rec.estimatedImpact}% {isArabic ? 'تأثير' : 'impact'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getComplexityLabel(rec.implementationComplexity)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'الخطوات التالية' : 'Next Steps'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ابدأ رحلتك مع منصة الموارد البشرية الذكية' 
                  : 'Start your journey with the intelligent HR platform'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">
                  {isArabic ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? 'استكشف منصة الموارد البشرية المخصصة لشركتك' 
                    : 'Explore your personalized HR platform'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">
                  {isArabic ? 'أضف بيانات الموظفين' : 'Add Employee Data'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? 'ابدأ بإضافة بيانات موظفيك للحصول على رؤى فورية' 
                    : 'Start by adding your employee data for instant insights'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">
                  {isArabic ? 'فعل الميزات المقترحة' : 'Enable Recommended Features'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? 'نفذ التوصيات المخصصة لتحسين كفاءة الموارد البشرية' 
                    : 'Implement personalized recommendations to boost HR efficiency'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}