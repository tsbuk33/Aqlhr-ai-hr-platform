import React, { useState } from 'react';
import { useOnboardingProfile } from '@/hooks/useOnboardingProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Building2, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Target,
  Settings,
  BarChart3
} from 'lucide-react';
import { CompanyProfileStep } from './steps/CompanyProfileStep';
import { HRProcessAssessmentStep } from './steps/HRProcessAssessmentStep';
import { OnboardingCompletionStep } from './steps/OnboardingCompletionStep';

export type WizardStep = 'profile' | 'assessment' | 'completion';

interface StepConfig {
  id: WizardStep;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<any>;
  completed?: boolean;
}

export function SmartOnboardingWizard() {
  const { data, loading, saving, completeStep, profileCompleted, assessmentCompleted, isCompleted } = useOnboardingProfile();
  const [currentStep, setCurrentStep] = useState<WizardStep>('profile');
  const [isArabic, setIsArabic] = useState(false);

  const steps: StepConfig[] = [
    {
      id: 'profile',
      title: 'Company Profile',
      titleAr: 'ملف الشركة',
      description: 'Tell us about your company and HR goals',
      descriptionAr: 'أخبرنا عن شركتك وأهداف الموارد البشرية',
      icon: Building2,
      completed: profileCompleted
    },
    {
      id: 'assessment',
      title: 'HR Process Assessment',
      titleAr: 'تقييم عمليات الموارد البشرية',
      description: 'Evaluate your current HR processes and challenges',
      descriptionAr: 'قيم عمليات الموارد البشرية الحالية والتحديات',
      icon: Settings,
      completed: assessmentCompleted
    },
    {
      id: 'completion',
      title: 'Personalized Recommendations',
      titleAr: 'التوصيات الشخصية',
      description: 'Get customized insights and next steps',
      descriptionAr: 'احصل على رؤى مخصصة والخطوات التالية',
      icon: BarChart3,
      completed: isCompleted
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    try {
      if (currentStep === 'profile') {
        await completeStep('profile');
        setCurrentStep('assessment');
      } else if (currentStep === 'assessment') {
        await completeStep('assessment');
        setCurrentStep('completion');
      }
    } catch (error) {
      toast.error(isArabic ? 'فشل في حفظ البيانات' : 'Failed to save data');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'assessment') {
      setCurrentStep('profile');
    } else if (currentStep === 'completion') {
      setCurrentStep('assessment');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'profile':
        return data.industry_type && data.company_size && data.hr_challenges.length > 0;
      case 'assessment':
        return data.performance_review_frequency && data.leave_management_complexity;
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">
            {isArabic ? 'جاري التحميل...' : 'Loading your onboarding profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-primary/60">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {isArabic ? 'مساعد الإعداد الذكي' : 'Smart Setup Assistant'}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                {isArabic 
                  ? 'دعنا نخصص منصة الموارد البشرية حسب احتياجاتك' 
                  : 'Let\'s personalize your HR platform to your needs'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {isArabic ? 'التقدم في الإعداد' : 'Setup Progress'}
              </CardTitle>
              <Badge variant="secondary" className="text-sm">
                {currentStepIndex + 1} / {steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    step.completed 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                      : index <= currentStepIndex 
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-sm">
                      {isArabic ? step.titleAr : step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'profile' && (
            <CompanyProfileStep isArabic={isArabic} />
          )}
          
          {currentStep === 'assessment' && (
            <HRProcessAssessmentStep isArabic={isArabic} />
          )}
          
          {currentStep === 'completion' && (
            <OnboardingCompletionStep isArabic={isArabic} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'profile'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isArabic ? 'السابق' : 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsArabic(!isArabic)}
              size="sm"
            >
              {isArabic ? 'EN' : 'العربية'}
            </Button>
          </div>

          {currentStep !== 'completion' && (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {isArabic ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  {isArabic ? 'التالي' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}

          {currentStep === 'completion' && (
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Target className="h-4 w-4" />
              {isArabic ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}