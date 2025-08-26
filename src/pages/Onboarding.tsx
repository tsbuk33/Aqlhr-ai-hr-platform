import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Circle, ArrowRight, Users, FileText, Shield, Zap, TrendingUp, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeatureGating } from '@/hooks/useFeatureGating';
import { UpsellModal } from '@/components/ui/upsell-modal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  actionLabel: string;
  estimatedMinutes: number;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningStep, setRunningStep] = useState<string | null>(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { hasAccess, loading: featureLoading, showUpsell, hideUpsell, upsellOpen } = useFeatureGating('self_sell_growth');

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'seed_employees',
      title: 'Seed 1,000 Employees',
      description: 'Generate sample employee data to experience AqlHR features',
      icon: <Users className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Run Seed',
      estimatedMinutes: 2
    },
    {
      id: 'backfill_kpis',
      title: 'Backfill KPIs (12 months)',
      description: 'Generate historical KPI data for comprehensive analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Run Backfill',
      estimatedMinutes: 3
    },
    {
      id: 'compliance_autopilot',
      title: 'Run Compliance Autopilot',
      description: 'Automatically check and improve compliance status',
      icon: <Shield className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Run Autopilot',
      estimatedMinutes: 4
    },
    {
      id: 'cci_quick_test',
      title: 'Send CCI Quick Test',
      description: 'Launch a corporate culture assessment survey',
      icon: <FileText className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Send Test',
      estimatedMinutes: 1
    },
    {
      id: 'export_cci_pdf',
      title: 'Export CCI Executive PDF',
      description: 'Generate executive summary report of culture assessment',
      icon: <FileText className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Export PDF',
      estimatedMinutes: 2
    },
    {
      id: 'create_snapshot',
      title: 'Create Read-Only Snapshot',
      description: 'Generate a shareable dashboard snapshot for stakeholders',
      icon: <Camera className="h-5 w-5" />,
      completed: false,
      actionLabel: 'Create Snapshot',
      estimatedMinutes: 1
    }
  ];

  useEffect(() => {
    initializeOnboarding();
  }, []);

  const initializeOnboarding = async () => {
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
      setTenantId(userRole.company_id);

      // Initialize steps (for demo, all start as uncompleted)
      setSteps(onboardingSteps);
      setCompletionRate(0);

    } catch (error) {
      toast.error('Failed to initialize onboarding');
    } finally {
      setLoading(false);
    }
  };

  const runStep = async (stepId: string) => {
    if (!tenantId) return;
    
    setRunningStep(stepId);
    
    try {
      let success = false;
      
      switch (stepId) {
        case 'seed_employees':
          // Simulate seeding employees
          await new Promise(resolve => setTimeout(resolve, 2000));
          success = true;
          break;
          
        case 'backfill_kpis':
          // Call backfill function
          const { error: backfillError } = await supabase
            .rpc('roi_backfill_snapshots_v1', { p_tenant: tenantId, p_days: 365 });
          success = !backfillError;
          break;
          
        case 'compliance_autopilot':
          // Simulate compliance check
          await new Promise(resolve => setTimeout(resolve, 3000));
          success = true;
          break;
          
        case 'cci_quick_test':
          // Simulate sending CCI test
          await new Promise(resolve => setTimeout(resolve, 1000));
          success = true;
          break;
          
        case 'export_cci_pdf':
          // Simulate PDF export
          await new Promise(resolve => setTimeout(resolve, 2000));
          success = true;
          break;
          
        case 'create_snapshot':
          // Create actual share link
          const { data, error } = await supabase.functions.invoke('share_link_sign_v1', {
            body: {
              tenantId,
              kind: 'dashboard_snapshot',
              ttlHours: 168, // 7 days
              payload: {
                onboarding_snapshot: true,
                generated_at: new Date().toISOString()
              }
            }
          });
          
          if (!error && data.url) {
            setShareUrl(data.url);
            setShareModalOpen(true);
            success = true;
          }
          break;
      }

      if (success) {
        // Mark step as completed
        setSteps(prev => prev.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        ));
        
        // Update completion rate
        const completedCount = steps.filter(s => s.completed).length + 1;
        setCompletionRate((completedCount / steps.length) * 100);
        
        toast.success(`${steps.find(s => s.id === stepId)?.title} completed!`);
      } else {
        toast.error('Step failed to complete');
      }
      
    } catch (error) {
      toast.error('Failed to run step');
    } finally {
      setRunningStep(null);
    }
  };

  const totalEstimatedTime = steps.reduce((total, step) => 
    total + (step.completed ? 0 : step.estimatedMinutes), 0
  );

  const completedSteps = steps.filter(step => step.completed).length;
  const allCompleted = completedSteps === steps.length;

  // Plan gating check
  if (!hasAccess && !featureLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Unlock Advanced Onboarding</h2>
            <p className="text-muted-foreground mb-6">
              The complete onboarding experience with ROI tracking and analytics is available in our Growth plan.
            </p>
            <Button size="lg" onClick={showUpsell}>
              View Plans & Pricing
            </Button>
          </CardContent>
        </Card>
        
        <UpsellModal 
          open={upsellOpen}
          onOpenChange={hideUpsell}
          title="Complete Your AqlHR Setup"
          description="Get the full onboarding experience with ROI tracking and powerful analytics."
          features={[
            "Show ROI automatically",
            "Weekly exec pdfs",
            "Read-only snapshot links (PDPL-safe)"
          ]}
        />
      </div>
    );
  }

  if (loading || featureLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-lg w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            {[1,2,3,4,5,6].map((i) => (
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
        <h1 className="text-4xl font-bold">AqlHR Onboarding</h1>
        <p className="text-xl text-muted-foreground">
          Complete these 6 steps to experience the full power of AqlHR
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
            Follow the guided setup to unlock AqlHR's capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completedSteps} of {steps.length} steps completed
            </span>
            <Badge variant={allCompleted ? "default" : "secondary"}>
              {Math.round(completionRate)}% Complete
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Estimated time remaining: {totalEstimatedTime} minutes</span>
            {allCompleted && (
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
                    {!step.completed && (
                      <Badge variant="secondary">
                        ~{step.estimatedMinutes} min
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {!step.completed && (
                  <Button 
                    onClick={() => runStep(step.id)}
                    disabled={runningStep === step.id}
                  >
                    {runningStep === step.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        {step.actionLabel}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Message & Upsell */}
      {allCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-800">
              Congratulations! You're ready to scale
            </h2>
            <p className="text-green-700">
              You've experienced AqlHR's power. Now upgrade to unlock unlimited features and transform your HR operations.
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="lg">
                🚀 Upgrade to Pro Plan
              </Button>
              <Button variant="outline" onClick={() => navigate('/growth/roi')}>
                View ROI Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Link Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dashboard Snapshot Created!</DialogTitle>
            <DialogDescription>
              Your read-only dashboard snapshot is ready to share with stakeholders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-mono break-all">{shareUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Share link copied to clipboard!');
                }}
                className="flex-1"
              >
                Copy Link
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(shareUrl, '_blank')}
              >
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* AI Integration for Onboarding */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="onboarding" 
        companyId="demo-company" 
        enabledFeatures={['intelligent-guidance', 'contextual-help', 'workflow-automation']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="onboarding" 
        companyId="demo-company"
      />
    </div>
  );
};

export default Onboarding;