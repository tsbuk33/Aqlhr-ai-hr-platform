import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Zap,
  Bot,
  ArrowRight,
  Settings,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface AutonomousTask {
  id: string;
  type: 'hire' | 'promote' | 'transfer' | 'training' | 'compliance' | 'performance' | 'contract';
  title: string;
  description: string;
  status: 'queued' | 'processing' | 'awaiting_approval' | 'executing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  estimatedDuration: string;
  timeRemaining: string;
  affectedEmployees: number;
  steps: TaskStep[];
  decisionId?: string;
  autonomyLevel: 'full' | 'supervised' | 'manual';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface TaskStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  duration?: string;
  result?: string;
  requiresApproval: boolean;
}

interface ExecutorMetrics {
  totalTasks: number;
  completedToday: number;
  activeExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  hoursAutomated: number;
}

export const AutonomousTaskExecutor: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [executorActive, setExecutorActive] = useState(true);
  const [tasks, setTasks] = useState<AutonomousTask[]>([
    {
      id: '1',
      type: 'hire',
      title: 'Execute Saudization Hiring Plan',
      description: 'Automatically process hiring for 3 Saudi IT professionals to meet Nitaqat requirements',
      status: 'executing',
      priority: 'high',
      progress: 67,
      estimatedDuration: '2-3 days',
      timeRemaining: '18 hours',
      affectedEmployees: 3,
      decisionId: 'dec_001',
      autonomyLevel: 'supervised',
      createdAt: '1 hour ago',
      startedAt: '45 minutes ago',
      steps: [
        {
          id: 'step1',
          name: 'Candidate Screening',
          description: 'AI screening of 12 qualified candidates',
          status: 'completed',
          duration: '15 min',
          result: '3 top candidates selected',
          requiresApproval: false
        },
        {
          id: 'step2',
          name: 'Background Verification',
          description: 'MOI and Education verification via government APIs',
          status: 'processing',
          requiresApproval: false
        },
        {
          id: 'step3',
          name: 'Contract Generation',
          description: 'Generate employment contracts with optimal terms',
          status: 'pending',
          requiresApproval: true
        },
        {
          id: 'step4',
          name: 'GOSI Registration',
          description: 'Automatic GOSI registration and insurance setup',
          status: 'pending',
          requiresApproval: false
        }
      ]
    },
    {
      id: '2',
      type: 'compliance',
      title: 'Contract Updates for Labor Law Changes',
      description: 'Update 47 employee contracts for new labor law compliance',
      status: 'queued',
      priority: 'critical',
      progress: 0,
      estimatedDuration: '6 hours',
      timeRemaining: '6 hours',
      affectedEmployees: 47,
      autonomyLevel: 'full',
      createdAt: '30 minutes ago',
      steps: [
        {
          id: 'step1',
          name: 'Contract Analysis',
          description: 'Identify required changes per new regulations',
          status: 'pending',
          requiresApproval: false
        },
        {
          id: 'step2',
          name: 'Legal Review',
          description: 'AI legal compliance verification',
          status: 'pending',
          requiresApproval: false
        },
        {
          id: 'step3',
          name: 'Document Generation',
          description: 'Generate updated contract amendments',
          status: 'pending',
          requiresApproval: true
        },
        {
          id: 'step4',
          name: 'Digital Signatures',
          description: 'Coordinate electronic signing process',
          status: 'pending',
          requiresApproval: false
        }
      ]
    },
    {
      id: '3',
      type: 'performance',
      title: 'Promote Sarah Al-Rashid',
      description: 'Execute promotion including salary adjustment, role transition, and team restructuring',
      status: 'awaiting_approval',
      priority: 'medium',
      progress: 15,
      estimatedDuration: '1 day',
      timeRemaining: '24 hours',
      affectedEmployees: 8,
      decisionId: 'dec_002',
      autonomyLevel: 'supervised',
      createdAt: '45 minutes ago',
      steps: [
        {
          id: 'step1',
          name: 'Performance Validation',
          description: 'Final performance metrics validation',
          status: 'completed',
          duration: '5 min',
          result: 'Confirmed: 96/100 performance score',
          requiresApproval: false
        },
        {
          id: 'step2',
          name: 'Salary Calculation',
          description: 'Calculate optimal salary increase and benefits',
          status: 'pending',
          requiresApproval: true
        },
        {
          id: 'step3',
          name: 'Role Transition Plan',
          description: 'Create transition plan and team restructuring',
          status: 'pending',
          requiresApproval: false
        }
      ]
    }
  ]);

  const [metrics, setMetrics] = useState<ExecutorMetrics>({
    totalTasks: 156,
    completedToday: 23,
    activeExecutions: 3,
    successRate: 96.8,
    avgExecutionTime: 4.2,
    hoursAutomated: 847
  });

  useEffect(() => {
    if (!executorActive) return;

    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'executing') {
          const newProgress = Math.min(100, task.progress + Math.random() * 5);
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : task.status
          };
        }
        return task;
      }));

      setMetrics(prev => ({
        ...prev,
        hoursAutomated: prev.hoursAutomated + 0.01
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [executorActive]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'executing': return <Activity className="h-4 w-4 text-primary animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'awaiting_approval': return <Clock className="h-4 w-4 text-brand-warning" />;
      case 'queued': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
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

  const getAutonomyBadge = (level: string) => {
    switch (level) {
      case 'full': return <Badge variant="default" className="bg-brand-success text-white">🤖 Full Auto</Badge>;
      case 'supervised': return <Badge variant="secondary">👁️ Supervised</Badge>;
      case 'manual': return <Badge variant="outline">👤 Manual</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const toggleExecutor = () => {
    setExecutorActive(!executorActive);
    toast({
      title: executorActive 
        ? (isArabic ? "تم إيقاف المنفذ المستقل" : "Autonomous Executor Paused")
        : (isArabic ? "تم تفعيل المنفذ المستقل" : "Autonomous Executor Activated"),
      description: executorActive 
        ? (isArabic ? "جميع المهام متوقفة مؤقتاً" : "All autonomous executions paused")
        : (isArabic ? "استئناف تنفيذ المهام المستقلة" : "Resuming autonomous task execution"),
    });
  };

  const approveTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'executing' as const, startedAt: 'Just now' }
        : task
    ));
    toast({
      title: isArabic ? "تمت الموافقة على المهمة" : "Task Approved",
      description: isArabic ? "بدء تنفيذ المهمة" : "Task execution has begun",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "منفذ المهام المستقل" : "Autonomous Task Executor"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "تنفيذ المهام والقرارات تلقائياً مع مراقبة مستمرة" 
              : "Autonomous execution of HR tasks and decisions with continuous monitoring"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={executorActive ? "default" : "secondary"} className="px-4 py-2">
            {executorActive 
              ? (isArabic ? "🤖 نشط" : "🤖 ACTIVE")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={toggleExecutor} variant={executorActive ? "destructive" : "default"}>
            {executorActive 
              ? (isArabic ? "إيقاف مؤقت" : "Pause")
              : (isArabic ? "تفعيل" : "Activate")
            }
          </Button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "المهام النشطة" : "Active Tasks"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.activeExecutions}</p>
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
              <Zap className="h-5 w-5 text-brand-warning" />
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
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "متوسط التنفيذ" : "Avg Execution"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.avgExecutionTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "ساعات موفرة" : "Hours Automated"}
                </p>
                <p className="text-2xl font-bold text-foreground">{Math.floor(metrics.hoursAutomated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "المجموع" : "Total Tasks"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {isArabic ? "المهام النشطة" : "Active Task Executions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      {getAutonomyBadge(task.autonomyLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>⏱️ {task.timeRemaining}</span>
                      <span>👥 {task.affectedEmployees} employees</span>
                      <span>📅 Created {task.createdAt}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {task.status === 'awaiting_approval' && (
                      <Button size="sm" onClick={() => approveTask(task.id)}>
                        {isArabic ? "موافقة" : "Approve"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {/* Task Steps */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Execution Steps:</h4>
                  <div className="space-y-2">
                    {task.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-brand-success flex-shrink-0" />}
                          {step.status === 'processing' && <Activity className="h-4 w-4 text-primary animate-pulse flex-shrink-0" />}
                          {step.status === 'pending' && <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                          {step.status === 'failed' && <AlertTriangle className="h-4 w-4 text-status-danger flex-shrink-0" />}
                          <span className={`${step.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {step.name}
                          </span>
                          {step.requiresApproval && <Badge variant="outline" className="text-xs">Approval Required</Badge>}
                        </div>
                        {step.duration && (
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {step.duration}
                          </span>
                        )}
                        {index < task.steps.length - 1 && step.status === 'completed' && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};