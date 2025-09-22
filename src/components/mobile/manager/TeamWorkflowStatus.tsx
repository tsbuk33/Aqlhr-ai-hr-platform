import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Activity,
  ArrowRight
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  nameAr: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  assignedTo: string[];
  estimatedTime: number; // in hours
  actualTime?: number;
  dependencies: string[];
  startDate?: string;
  endDate?: string;
}

interface Workflow {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'project' | 'onboarding' | 'compliance' | 'maintenance';
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  startDate: string;
  dueDate: string;
  steps: WorkflowStep[];
  teamLead: string;
}

interface TeamWorkflowStatusProps {
  isArabic: boolean;
}

export const TeamWorkflowStatus: React.FC<TeamWorkflowStatusProps> = ({ isArabic }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'blocked'>('active');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflowsData();
  }, []);

  const loadWorkflowsData = () => {
    setWorkflows([
      {
        id: 'wf_001',
        name: 'New Employee Onboarding',
        nameAr: 'إدماج الموظف الجديد',
        description: 'Complete onboarding process for new team member',
        descriptionAr: 'عملية إدماج كاملة لعضو الفريق الجديد',
        category: 'onboarding',
        status: 'in_progress',
        priority: 'high',
        progress: 65,
        startDate: '2024-02-20',
        dueDate: '2024-03-05',
        teamLead: 'manager_001',
        steps: [
          {
            id: 'step_001',
            name: 'Documentation Review',
            nameAr: 'مراجعة الوثائق',
            status: 'completed',
            assignedTo: ['emp_001'],
            estimatedTime: 2,
            actualTime: 1.5,
            dependencies: [],
            startDate: '2024-02-20',
            endDate: '2024-02-20'
          },
          {
            id: 'step_002',
            name: 'System Access Setup',
            nameAr: 'إعداد الوصول للنظام',
            status: 'completed',
            assignedTo: ['emp_002'],
            estimatedTime: 4,
            actualTime: 3,
            dependencies: ['step_001'],
            startDate: '2024-02-21',
            endDate: '2024-02-21'
          },
          {
            id: 'step_003',
            name: 'Team Introduction',
            nameAr: 'تعريف بالفريق',
            status: 'in_progress',
            assignedTo: ['emp_003'],
            estimatedTime: 2,
            dependencies: ['step_002'],
            startDate: '2024-02-22'
          },
          {
            id: 'step_004',
            name: 'Training Schedule',
            nameAr: 'جدولة التدريب',
            status: 'pending',
            assignedTo: ['emp_004'],
            estimatedTime: 8,
            dependencies: ['step_003']
          }
        ]
      },
      {
        id: 'wf_002',
        name: 'Quarterly Review Process',
        nameAr: 'عملية المراجعة الفصلية',
        description: 'Complete Q1 performance reviews for all team members',
        descriptionAr: 'إكمال تقييمات الأداء للربع الأول لجميع أعضاء الفريق',
        category: 'project',
        status: 'in_progress',
        priority: 'medium',
        progress: 40,
        startDate: '2024-02-15',
        dueDate: '2024-03-15',
        teamLead: 'manager_001',
        steps: [
          {
            id: 'step_005',
            name: 'Data Collection',
            nameAr: 'جمع البيانات',
            status: 'completed',
            assignedTo: ['emp_001', 'emp_002'],
            estimatedTime: 6,
            actualTime: 5,
            dependencies: [],
            startDate: '2024-02-15',
            endDate: '2024-02-17'
          },
          {
            id: 'step_006',
            name: 'Individual Reviews',
            nameAr: 'المراجعات الفردية',
            status: 'in_progress',
            assignedTo: ['emp_003'],
            estimatedTime: 20,
            dependencies: ['step_005'],
            startDate: '2024-02-18'
          },
          {
            id: 'step_007',
            name: 'Team Summary Report',
            nameAr: 'تقرير ملخص الفريق',
            status: 'pending',
            assignedTo: ['emp_004'],
            estimatedTime: 8,
            dependencies: ['step_006']
          }
        ]
      },
      {
        id: 'wf_003',
        name: 'Compliance Audit Preparation',
        nameAr: 'إعداد تدقيق الامتثال',
        description: 'Prepare for annual compliance audit',
        descriptionAr: 'التحضير لتدقيق الامتثال السنوي',
        category: 'compliance',
        status: 'on_hold',
        priority: 'high',
        progress: 20,
        startDate: '2024-02-10',
        dueDate: '2024-04-01',
        teamLead: 'manager_001',
        steps: [
          {
            id: 'step_008',
            name: 'Document Gathering',
            nameAr: 'جمع الوثائق',
            status: 'completed',
            assignedTo: ['emp_005'],
            estimatedTime: 12,
            actualTime: 10,
            dependencies: [],
            startDate: '2024-02-10',
            endDate: '2024-02-14'
          },
          {
            id: 'step_009',
            name: 'Gap Analysis',
            nameAr: 'تحليل الفجوات',
            status: 'blocked',
            assignedTo: ['emp_001'],
            estimatedTime: 16,
            dependencies: ['step_008']
          }
        ]
      }
    ]);
  };

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'on_hold':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStepStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'blocked':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: Workflow['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (isArabic) {
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  const filteredWorkflows = workflows.filter(workflow => {
    switch (filter) {
      case 'active':
        return workflow.status === 'in_progress';
      case 'completed':
        return workflow.status === 'completed';
      case 'blocked':
        return workflow.status === 'on_hold' || workflow.steps.some(step => step.status === 'blocked');
      default:
        return true;
    }
  });

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          {isArabic ? 'حالة سير العمل' : 'Team Workflow Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: isArabic ? 'الكل' : 'All' },
              { key: 'active', label: isArabic ? 'نشط' : 'Active' },
              { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
              { key: 'blocked', label: isArabic ? 'محظور' : 'Blocked' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Workflows List */}
          <div className="space-y-3">
            {filteredWorkflows.map((workflow) => {
              const daysRemaining = getDaysRemaining(workflow.dueDate);
              const isExpanded = selectedWorkflow === workflow.id;
              
              return (
                <Card key={workflow.id} className={`border-l-4 ${getPriorityColor(workflow.priority)}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => setSelectedWorkflow(isExpanded ? null : workflow.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">
                              {isArabic ? workflow.nameAr : workflow.name}
                            </h4>
                            <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic ? workflow.descriptionAr : workflow.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {isArabic ? 'التقدم' : 'Progress'}: {formatNumber(workflow.progress)}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {daysRemaining > 0 
                              ? `${formatNumber(daysRemaining)} ${isArabic ? 'يوم متبقي' : 'days left'}`
                              : `${formatNumber(Math.abs(daysRemaining))} ${isArabic ? 'يوم متأخر' : 'days overdue'}`
                            }
                          </span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>
                              {formatNumber(workflow.steps.filter(s => s.status === 'completed').length)}/
                              {formatNumber(workflow.steps.length)} {isArabic ? 'خطوات' : 'steps'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>
                              {formatNumber([...new Set(workflow.steps.flatMap(s => s.assignedTo))].length)} {isArabic ? 'أعضاء' : 'members'}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {workflow.category}
                        </Badge>
                      </div>

                      {/* Expanded Steps */}
                      {isExpanded && (
                        <div className="space-y-2 border-t pt-3">
                          <h5 className="text-sm font-medium">
                            {isArabic ? 'خطوات سير العمل' : 'Workflow Steps'}
                          </h5>
                          <div className="space-y-2">
                            {workflow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-center gap-3 p-2 bg-background rounded border">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-muted-foreground w-6">
                                    {formatNumber(index + 1)}
                                  </div>
                                  {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {step.status === 'in_progress' && <Activity className="h-4 w-4 text-blue-500" />}
                                  {step.status === 'pending' && <Clock className="h-4 w-4 text-gray-500" />}
                                  {step.status === 'blocked' && <AlertCircle className="h-4 w-4 text-red-500" />}
                                </div>
                                
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {isArabic ? step.nameAr : step.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>
                                      {formatNumber(step.estimatedTime)}h {isArabic ? 'مقدر' : 'est.'}
                                    </span>
                                    {step.actualTime && (
                                      <span>
                                        • {formatNumber(step.actualTime)}h {isArabic ? 'فعلي' : 'actual'}
                                      </span>
                                    )}
                                    <span>
                                      • {formatNumber(step.assignedTo.length)} {isArabic ? 'أعضاء' : 'members'}
                                    </span>
                                  </div>
                                </div>
                                
                                <Badge className={`${getStepStatusColor(step.status)} text-xs`}>
                                  {step.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد تدفقات عمل في هذه الفئة' : 'No workflows in this category'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};