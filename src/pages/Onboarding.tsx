import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, ArrowRight, Users, FileText, Settings, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: string;
  route?: string;
  estimatedMinutes?: number;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    checkOnboardingProgress();
  }, []);

  const checkOnboardingProgress = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRole) return;

      // Check various completion criteria
      const [
        { count: employeeCount },
        { count: kpiCount },
        { count: taskCount },
        { data: company },
        { count: trainingCount }
      ] = await Promise.all([
        supabase.from('hr_employees').select('*', { count: 'exact', head: true }).eq('company_id', userRole.company_id),
        supabase.from('employee_kpi_assignments').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('tenant_id', userRole.company_id),
        supabase.from('companies').select('*').eq('id', userRole.company_id).single(),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }).eq('company_id', userRole.company_id)
      ]);

      const onboardingSteps: OnboardingStep[] = [
        {
          id: 'company_setup',
          title: 'Complete Company Profile',
          description: 'Set up your company information, industry, and basic settings',
          icon: <Settings className="h-5 w-5" />,
          completed: !!(company?.name && company?.industry),
          action: 'Complete Setup',
          route: '/settings/company',
          estimatedMinutes: 5
        },
        {
          id: 'import_employees',
          title: 'Import Employee Data',
          description: 'Add your employees to start tracking and managing HR data',
          icon: <Users className="h-5 w-5" />,
          completed: (employeeCount || 0) >= 5,
          action: 'Import Employees',
          route: '/employees',
          estimatedMinutes: 10
        },
        {
          id: 'setup_kpis',
          title: 'Configure Smart KPIs',
          description: 'Set up performance indicators and tracking for your team',
          icon: <TrendingUp className="h-5 w-5" />,
          completed: (kpiCount || 0) >= 1,
          action: 'Setup KPIs',
          route: '/smart-kpi',
          estimatedMinutes: 8
        },
        {
          id: 'create_tasks',
          title: 'Explore Task Management',
          description: 'Create your first tasks to experience automated workflow',
          icon: <Zap className="h-5 w-5" />,
          completed: (taskCount || 0) >= 1,
          action: 'Create Task',
          route: '/tasks',
          estimatedMinutes: 3
        },
        {
          id: 'setup_training',
          title: 'Add Training Programs',
          description: 'Configure learning and development programs',
          icon: <FileText className="h-5 w-5" />,
          completed: (trainingCount || 0) >= 1,
          action: 'Add Training',
          route: '/training',
          estimatedMinutes: 7
        }
      ];

      setSteps(onboardingSteps);
      
      const completedCount = onboardingSteps.filter(step => step.completed).length;
      setCompletionRate((completedCount / onboardingSteps.length) * 100);

    } catch (error) {
      toast.error('Failed to load onboarding progress');
    } finally {
      setLoading(false);
    }
  };

  const handleStepAction = (step: OnboardingStep) => {
    if (step.route) {
      navigate(step.route);
    }
  };

  const totalEstimatedTime = steps.reduce((total, step) => 
    total + (step.estimatedMinutes || 0), 0
  );

  const completedSteps = steps.filter(step => step.completed).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-lg w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Welcome to AqlHR</h1>
        <p className="text-xl text-muted-foreground">
          Get started with a few simple steps to unlock the full potential of your HR management
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Onboarding Progress
          </CardTitle>
          <CardDescription>
            Complete these steps to get the most out of AqlHR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completedSteps} of {steps.length} steps completed
            </span>
            <Badge variant={completionRate === 100 ? "default" : "secondary"}>
              {Math.round(completionRate)}% Complete
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Estimated time remaining: {totalEstimatedTime - steps.filter(s => s.completed).reduce((t, s) => t + (s.estimatedMinutes || 0), 0)} minutes</span>
            {completionRate === 100 && (
              <span className="text-green-600 font-medium">🎉 All done!</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className={step.completed ? 'border-green-200 bg-green-50/50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    {step.completed && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Complete
                      </Badge>
                    )}
                    {step.estimatedMinutes && !step.completed && (
                      <Badge variant="secondary">
                        ~{step.estimatedMinutes} min
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {!step.completed && step.action && (
                  <Button onClick={() => handleStepAction(step)}>
                    {step.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Message */}
      {completionRate === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-800">
              Congratulations! You're all set up
            </h2>
            <p className="text-green-700">
              Your AqlHR system is now fully configured. Start exploring the features and watch your HR efficiency improve!
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/growth/roi')}>
                View ROI Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Start with employees:</strong> Import your team first to unlock most features
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Use bulk import:</strong> Upload CSV files to quickly add multiple employees
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Track ROI:</strong> Your efficiency improvements are automatically measured
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;