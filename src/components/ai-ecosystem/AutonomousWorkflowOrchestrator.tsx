import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Bot,
  ArrowRight,
  Network,
  Settings,
  Activity,
  Users,
  FileText,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'automated' | 'human_approval' | 'external_api' | 'validation';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'waiting';
  duration?: string;
  dependencies: string[];
  assignedTo?: string;
  estimatedTime: number;
  actualTime?: number;
  output?: any;
  errorMessage?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'onboarding' | 'offboarding' | 'promotion' | 'transfer' | 'compliance' | 'performance_review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  steps: WorkflowStep[];
  triggeredBy: 'manual' | 'ai_decision' | 'schedule' | 'event';
  triggerEvent?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedCompletion: string;
  affectedEmployees: number;
  metadata: Record<string, any>;
}

interface OrchestrationMetrics {
  activeWorkflows: number;
  completedToday: number;
  totalWorkflows: number;
  averageCompletionTime: number;
  successRate: number;
  automationLevel: number;
}

export const AutonomousWorkflowOrchestrator: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [orchestratorActive, setOrchestratorActive] = useState(true);
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'New Employee Onboarding - Ahmed Al-Mansouri',
      description: 'Complete onboarding process for new IT specialist including documentation, system access, and training',
      type: 'onboarding',
      priority: 'high',
      status: 'active',
      progress: 65,
      triggeredBy: 'ai_decision',
      triggerEvent: 'Hiring decision approved',
      createdAt: '2 hours ago',
      startedAt: '1.5 hours ago',
      estimatedCompletion: '4 hours remaining',
      affectedEmployees: 1,
      metadata: {
        employeeId: 'emp_001',
        department: 'IT',
        position: 'Software Engineer',
        startDate: '2024-08-30'
      },
      steps: [
        {
          id: 'step1',
          name: 'Generate Employment Contract',
          description: 'Auto-generate contract based on job offer and company templates',
          type: 'automated',
          status: 'completed',
          duration: '12 min',
          dependencies: [],
          estimatedTime: 15,
          actualTime: 12,
          output: { contractId: 'CTR_001', documentUrl: '/contracts/ctr_001.pdf' }
        },
        {
          id: 'step2',
          name: 'GOSI Registration',
          description: 'Submit employee registration to GOSI system',
          type: 'external_api',
          status: 'completed',
          duration: '8 min',
          dependencies: ['step1'],
          estimatedTime: 10,
          actualTime: 8,
          output: { gosiId: 'GOSI_123456', registrationConfirmed: true }
        },
        {
          id: 'step3',
          name: 'HR Manager Approval',
          description: 'Final approval for onboarding package',
          type: 'human_approval',
          status: 'running',
          dependencies: ['step1', 'step2'],
          assignedTo: 'Sarah Al-Rashid',
          estimatedTime: 30,
        },
        {
          id: 'step4',
          name: 'System Access Provisioning',
          description: 'Create user accounts and assign system permissions',
          type: 'automated',
          status: 'pending',
          dependencies: ['step3'],
          estimatedTime: 20,
        },
        {
          id: 'step5',
          name: 'Workspace Assignment',
          description: 'Assign desk, equipment, and facilities access',
          type: 'automated',
          status: 'pending',
          dependencies: ['step3'],
          estimatedTime: 15,
        },
        {
          id: 'step6',
          name: 'Welcome Package Delivery',
          description: 'Schedule orientation session and deliver welcome materials',
          type: 'automated',
          status: 'pending',
          dependencies: ['step4', 'step5'],
          estimatedTime: 25,
        }
      ]
    },
    {
      id: '2',
      name: 'Performance Review Cycle - Q4 2024',
      description: 'Automated performance review process for all active employees',
      type: 'performance_review',
      priority: 'medium',
      status: 'active',
      progress: 23,
      triggeredBy: 'schedule',
      triggerEvent: 'Quarterly review schedule',
      createdAt: '6 hours ago',
      startedAt: '5 hours ago',
      estimatedCompletion: '3 days remaining',
      affectedEmployees: 124,
      metadata: {
        reviewPeriod: 'Q4 2024',
        totalEmployees: 124,
        department: 'All',
        reviewType: 'quarterly'
      },
      steps: [
        {
          id: 'step1',
          name: 'Data Collection',
          description: 'Gather performance metrics from all systems',
          type: 'automated',
          status: 'completed',
          duration: '45 min',
          dependencies: [],
          estimatedTime: 60,
          actualTime: 45,
          output: { employeesProcessed: 124, metricsCollected: 847 }
        },
        {
          id: 'step2',
          name: 'AI Performance Analysis',
          description: 'Analyze individual and team performance patterns',
          type: 'automated',
          status: 'running',
          dependencies: ['step1'],
          estimatedTime: 120,
        },
        {
          id: 'step3',
          name: 'Review Form Generation',
          description: 'Generate personalized review forms for each employee',
          type: 'automated',
          status: 'pending',
          dependencies: ['step2'],
          estimatedTime: 90,
        },
        {
          id: 'step4',
          name: 'Manager Review Assignment',
          description: 'Assign reviews to appropriate managers',
          type: 'automated',
          status: 'pending',
          dependencies: ['step3'],
          estimatedTime: 30,
        },
        {
          id: 'step5',
          name: 'HR Quality Validation',
          description: 'HR team validates AI-generated recommendations',
          type: 'human_approval',
          status: 'pending',
          dependencies: ['step4'],
          assignedTo: 'HR Team',
          estimatedTime: 480,
        }
      ]
    },
    {
      id: '3',
      name: 'Compliance Audit - Labor Law Updates',
      description: 'Update all employee contracts and policies for new labor law requirements',
      type: 'compliance',
      priority: 'critical',
      status: 'paused',
      progress: 8,
      triggeredBy: 'event',
      triggerEvent: 'Government regulation change detected',
      createdAt: '1 day ago',
      startedAt: '18 hours ago',
      estimatedCompletion: '2 days remaining',
      affectedEmployees: 124,
      metadata: {
        regulationId: 'LAB_2024_08',
        deadline: '2024-09-15',
        complianceType: 'labor_law',
        urgency: 'high'
      },
      steps: [
        {
          id: 'step1',
          name: 'Regulation Analysis',
          description: 'Analyze new labor law requirements and impact',
          type: 'automated',
          status: 'completed',
          duration: '2 hours',
          dependencies: [],
          estimatedTime: 120,
          actualTime: 118,
          output: { changesIdentified: 23, contractsAffected: 124 }
        },
        {
          id: 'step2',
          name: 'Legal Review',
          description: 'Legal team reviews compliance requirements',
          type: 'human_approval',
          status: 'waiting',
          dependencies: ['step1'],
          assignedTo: 'Legal Team',
          estimatedTime: 240,
        },
        {
          id: 'step3',
          name: 'Contract Template Updates',
          description: 'Update contract templates for compliance',
          type: 'automated',
          status: 'pending',
          dependencies: ['step2'],
          estimatedTime: 60,
        }
      ]
    }
  ]);

  const [metrics, setMetrics] = useState<OrchestrationMetrics>({
    activeWorkflows: 3,
    completedToday: 12,
    totalWorkflows: 89,
    averageCompletionTime: 4.2,
    successRate: 94.7,
    automationLevel: 78.3
  });

  useEffect(() => {
    if (!orchestratorActive) return;

    const interval = setInterval(() => {
      setWorkflows(prev => prev.map(workflow => {
        if (workflow.status === 'active') {
          const runningSteps = workflow.steps.filter(step => step.status === 'running');
          if (runningSteps.length > 0) {
            // Progress running steps
            const newProgress = Math.min(100, workflow.progress + Math.random() * 2);
            return {
              ...workflow,
              progress: newProgress,
              steps: workflow.steps.map(step => {
                if (step.status === 'running' && Math.random() < 0.1) {
                  return { ...step, status: 'completed' as const, duration: `${step.estimatedTime}m` };
                }
                return step;
              })
            };
          }
        }
        return workflow;
      }));

      setMetrics(prev => ({
        ...prev,
        automationLevel: 75 + Math.random() * 8
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [orchestratorActive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'running': return <Activity className="h-4 w-4 text-primary animate-pulse" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'waiting': return <Clock className="h-4 w-4 text-brand-warning" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'automated': return <Bot className="h-4 w-4 text-primary" />;
      case 'human_approval': return <Users className="h-4 w-4 text-brand-warning" />;
      case 'external_api': return <Network className="h-4 w-4 text-brand-success" />;
      case 'validation': return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-status-danger';
      case 'high': return 'bg-brand-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const toggleOrchestrator = () => {
    setOrchestratorActive(!orchestratorActive);
    toast({
      title: orchestratorActive 
        ? (isArabic ? "تم إيقاف منسق سير العمل" : "Workflow Orchestrator Paused")
        : (isArabic ? "تم تفعيل منسق سير العمل" : "Workflow Orchestrator Activated"),
      description: orchestratorActive 
        ? (isArabic ? "جميع سير العمل متوقف مؤقتاً" : "All workflow orchestration paused")
        : (isArabic ? "استئناف تنسيق سير العمل" : "Resuming workflow orchestration"),
    });
  };

  const resumeWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: 'active' as const }
        : workflow
    ));
    toast({
      title: isArabic ? "تم استئناف سير العمل" : "Workflow Resumed",
      description: isArabic ? "استئناف تنفيذ سير العمل" : "Workflow execution has resumed",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "منسق سير العمل المستقل" : "Autonomous Workflow Orchestrator"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "تنسيق وتنفيذ سير العمل المعقد تلقائياً عبر جميع عمليات الموارد البشرية" 
              : "Autonomous orchestration of complex HR workflows across all business processes"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={orchestratorActive ? "default" : "secondary"} className="px-4 py-2">
            {orchestratorActive 
              ? (isArabic ? "🔀 نشط" : "🔀 ORCHESTRATING")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={toggleOrchestrator} variant={orchestratorActive ? "destructive" : "default"}>
            {orchestratorActive 
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
              <GitBranch className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "نشط الآن" : "Active Now"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.activeWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "مكتملة اليوم" : "Completed Today"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.completedToday}</p>
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
                  {isArabic ? "متوسط الإنجاز" : "Avg Completion"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.averageCompletionTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "معدل النجاح" : "Success Rate"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.successRate}%</p>
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
                  {isArabic ? "مستوى الأتمتة" : "Automation Level"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.automationLevel.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "المجموع" : "Total Workflows"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(workflow.priority)}`} />
                    <Badge variant="outline" className="text-xs">
                      {workflow.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>👥 {workflow.affectedEmployees} employees</span>
                    <span>⏱️ {workflow.estimatedCompletion}</span>
                    <span>🚀 Triggered by {workflow.triggeredBy.replace('_', ' ')}</span>
                    <span>📅 Started {workflow.startedAt || workflow.createdAt}</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge 
                    variant={workflow.status === 'active' ? 'default' : workflow.status === 'paused' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {workflow.status.toUpperCase()}
                  </Badge>
                  {workflow.status === 'paused' && (
                    <Button size="sm" onClick={() => resumeWorkflow(workflow.id)}>
                      <Play className="h-4 w-4 mr-1" />
                      {isArabic ? "استئناف" : "Resume"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{workflow.progress}%</span>
                </div>
                <Progress value={workflow.progress} className="h-2" />
              </div>

              {/* Workflow Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Workflow Steps:</h4>
                <div className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-2 rounded border">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getStatusIcon(step.status)}
                        {getStepTypeIcon(step.type)}
                        <div className="min-w-0 flex-1">
                          <span className={`text-sm ${step.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {step.name}
                          </span>
                          <p className="text-xs text-muted-foreground truncate">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                        {step.assignedTo && (
                          <Badge variant="outline" className="text-xs">
                            {step.assignedTo}
                          </Badge>
                        )}
                        {step.duration && (
                          <span>{step.duration}</span>
                        )}
                        {!step.duration && (
                          <span>~{step.estimatedTime}m</span>
                        )}
                      </div>
                      
                      {index < workflow.steps.length - 1 && step.status === 'completed' && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};