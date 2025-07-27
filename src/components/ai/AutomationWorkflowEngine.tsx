import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Bot, Play, Pause, Settings, CheckCircle, AlertTriangle, Clock, Users } from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  nameAr: string;
  type: 'onboarding' | 'performance' | 'compliance' | 'payroll';
  status: 'active' | 'paused' | 'completed' | 'error';
  progress: number;
  lastRun: string;
  nextRun: string;
  successRate: number;
  affectedEmployees: number;
  estimatedSavings: number;
}

interface AutomationStep {
  id: string;
  name: string;
  nameAr: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration: number;
  confidence: number;
}

const AutomationWorkflowEngine = () => {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';
  
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: '1',
      name: 'Intelligent Onboarding Automation',
      nameAr: 'أتمتة التأهيل الذكية',
      type: 'onboarding',
      status: 'active',
      progress: 78,
      lastRun: '2024-01-15T10:30:00Z',
      nextRun: '2024-01-16T09:00:00Z',
      successRate: 96.5,
      affectedEmployees: 24,
      estimatedSavings: 15000
    },
    {
      id: '2',
      name: 'Performance Review Automation',
      nameAr: 'أتمتة مراجعة الأداء',
      type: 'performance',
      status: 'active',
      progress: 92,
      lastRun: '2024-01-15T14:00:00Z',
      nextRun: '2024-01-22T09:00:00Z',
      successRate: 94.2,
      affectedEmployees: 156,
      estimatedSavings: 35000
    },
    {
      id: '3',
      name: 'Compliance Automation Engine',
      nameAr: 'محرك أتمتة الامتثال',
      type: 'compliance',
      status: 'active',
      progress: 100,
      lastRun: '2024-01-15T08:00:00Z',
      nextRun: '2024-01-16T08:00:00Z',
      successRate: 99.1,
      affectedEmployees: 312,
      estimatedSavings: 85000
    },
    {
      id: '4',
      name: 'Payroll Intelligence Automation',
      nameAr: 'أتمتة ذكاء المرتبات',
      type: 'payroll',
      status: 'active',
      progress: 85,
      lastRun: '2024-01-15T16:00:00Z',
      nextRun: '2024-01-20T09:00:00Z',
      successRate: 97.8,
      affectedEmployees: 312,
      estimatedSavings: 125000
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('1');
  const [workflowSteps, setWorkflowSteps] = useState<AutomationStep[]>([
    {
      id: '1',
      name: 'Generate Employee Profile',
      nameAr: 'إنشاء ملف تعريف الموظف',
      status: 'completed',
      duration: 45,
      confidence: 98.5
    },
    {
      id: '2',
      name: 'Create Government Accounts',
      nameAr: 'إنشاء حسابات حكومية',
      status: 'completed',
      duration: 120,
      confidence: 95.2
    },
    {
      id: '3',
      name: 'Assign Equipment & Access',
      nameAr: 'تخصيص المعدات والوصول',
      status: 'running',
      duration: 30,
      confidence: 92.1
    },
    {
      id: '4',
      name: 'Schedule Orientation',
      nameAr: 'جدولة التوجيه',
      status: 'pending',
      duration: 15,
      confidence: 89.3
    },
    {
      id: '5',
      name: 'Send Welcome Messages',
      nameAr: 'إرسال رسائل الترحيب',
      status: 'pending',
      duration: 10,
      confidence: 96.8
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-brand-success';
      case 'paused': return 'bg-brand-warning';
      case 'completed': return 'bg-brand-primary';
      case 'error': return 'bg-brand-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'running': return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusTranslation = (status: string) => {
    const statusMap = {
      'active': 'نشط',
      'paused': 'متوقف',
      'completed': 'مكتمل',
      'error': 'خطأ',
      'running': 'يعمل',
      'pending': 'في الانتظار',
      'failed': 'فشل'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-SA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Bot className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isArabic ? 'محرك سير عمل الأتمتة المتقدم' : 'ADVANCED AUTOMATION WORKFLOW ENGINE'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'أتمتة ذكية للعمليات الحيوية في الموارد البشرية' : 'Intelligent automation for critical HR processes'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'سير العمل النشط' : 'Active Workflows'}
                </p>
                <p className="text-2xl font-bold text-brand-primary">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'معدل النجاح' : 'Success Rate'}
                </p>
                <p className="text-2xl font-bold text-brand-success">
                  {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'الموظفون المتأثرون' : 'Affected Employees'}
                </p>
                <p className="text-2xl font-bold text-brand-accent">
                  {workflows.reduce((acc, w) => acc + w.affectedEmployees, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-brand-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'التوفير المقدر' : 'Estimated Savings'}
                </p>
                <p className="text-2xl font-bold text-brand-warning">
                  {formatCurrency(workflows.reduce((acc, w) => acc + w.estimatedSavings, 0))}
                </p>
              </div>
              <div className="w-8 h-8 text-brand-warning flex items-center justify-center text-lg font-bold">
                SAR
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">
            {isArabic ? 'سير العمل' : 'Workflows'}
          </TabsTrigger>
          <TabsTrigger value="steps">
            {isArabic ? 'خطوات التنفيذ' : 'Execution Steps'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isArabic ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {isArabic ? workflow.nameAr : workflow.name}
                    </CardTitle>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {isArabic ? 'آخر تشغيل: ' : 'Last run: '} {formatDate(workflow.lastRun)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                      <span>{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'معدل النجاح' : 'Success Rate'}</p>
                      <p className="font-semibold text-brand-success">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الموظفون' : 'Employees'}</p>
                      <p className="font-semibold">{workflow.affectedEmployees}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'التوفير المقدر' : 'Est. Savings'}</p>
                      <p className="font-semibold text-brand-primary">{formatCurrency(workflow.estimatedSavings)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'خطوات أتمتة التأهيل الذكية' : 'Intelligent Onboarding Automation Steps'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'تتبع تقدم كل خطوة في عملية التأهيل المؤتمتة' : 'Track progress of each step in the automated onboarding process'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10">
                      {getStatusIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{isArabic ? step.nameAr : step.name}</h4>
                        <Badge variant="outline" className="ml-2">
                          {step.confidence}% {isArabic ? 'ثقة' : 'confidence'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'المدة المقدرة: ' : 'Estimated duration: '} {step.duration} {isArabic ? 'ثانية' : 'seconds'}
                      </p>
                    </div>

                    <div className="text-right">
                      <Badge className={getStatusColor(step.status)}>
                        {isArabic ? getStatusTranslation(step.status) : step.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'تحليل الأداء' : 'Performance Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'إجمالي الوقت المُوفر' : 'Total Time Saved'}</span>
                    <span className="font-bold text-brand-success">2,340 {isArabic ? 'ساعة' : 'hours'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'تحسن الدقة' : 'Accuracy Improvement'}</span>
                    <span className="font-bold text-brand-primary">+45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'تقليل الأخطاء' : 'Error Reduction'}</span>
                    <span className="font-bold text-brand-warning">-78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'اتجاهات الأتمتة' : 'Automation Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'العمليات المؤتمتة' : 'Automated Processes'}</span>
                    <span className="font-bold text-brand-accent">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'اعتماد المستخدمين' : 'User Adoption'}</span>
                    <span className="font-bold text-brand-success">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'رضا المستخدمين' : 'User Satisfaction'}</span>
                    <span className="font-bold text-brand-primary">4.8/5</span>
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

export default AutomationWorkflowEngine;