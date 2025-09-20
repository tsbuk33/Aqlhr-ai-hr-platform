import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Clock,
  Target,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';

export const ComplianceMonitoring: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const complianceGaps = [
    {
      id: 1,
      category: isRTL ? 'ساعات العمل' : 'Working Hours',
      requirement: isRTL ? 'تسجيل ساعات العمل الإضافية' : 'Overtime hours registration',
      currentStatus: 'partial',
      gap: isRTL ? 'عدم تسجيل 25% من الساعات الإضافية' : '25% of overtime hours not recorded',
      priority: 'high',
      estimatedEffort: isRTL ? '2-3 أسابيع' : '2-3 weeks',
      riskScore: 75
    },
    {
      id: 2,
      category: isRTL ? 'الأجور' : 'Wages',
      requirement: isRTL ? 'حد أدنى للأجور حسب التصنيف' : 'Minimum wage per classification',
      currentStatus: 'compliant',
      gap: isRTL ? 'لا توجد فجوات' : 'No gaps identified',
      priority: 'low',
      estimatedEffort: isRTL ? 'مكتمل' : 'Completed',
      riskScore: 15
    },
    {
      id: 3,
      category: isRTL ? 'الإجازات' : 'Leave Management',
      requirement: isRTL ? 'حساب رصيد الإجازات السنوية' : 'Annual leave balance calculation',
      currentStatus: 'non-compliant',
      gap: isRTL ? 'عدم احتساب الإجازات المرضية بشكل صحيح' : 'Sick leave calculation errors',
      priority: 'critical',
      estimatedEffort: isRTL ? '1-2 أسبوع' : '1-2 weeks',
      riskScore: 90
    }
  ];

  const auditTrail = [
    {
      id: 1,
      action: isRTL ? 'تحديث سياسة الحضور' : 'Updated attendance policy',
      user: 'HR Manager',
      timestamp: '2024-01-15 10:30',
      category: 'policy',
      status: 'completed'
    },
    {
      id: 2,
      action: isRTL ? 'مراجعة عقود الموظفين' : 'Reviewed employee contracts',
      user: 'Legal Advisor',
      timestamp: '2024-01-14 14:20',
      category: 'contract',
      status: 'completed'
    },
    {
      id: 3,
      action: isRTL ? 'تقييم مخاطر الامتثال' : 'Compliance risk assessment',
      user: 'Compliance Officer',
      timestamp: '2024-01-13 09:15',
      category: 'assessment',
      status: 'in-progress'
    }
  ];

  const remediationActions = [
    {
      id: 1,
      title: isRTL ? 'تطبيق نظام تسجيل الساعات الإضافية' : 'Implement overtime tracking system',
      description: isRTL ? 'تطوير نظام آلي لتسجيل الساعات الإضافية' : 'Develop automated overtime tracking system',
      priority: 'high',
      assignee: 'IT Team',
      dueDate: '2024-02-15',
      progress: 60,
      status: 'in-progress'
    },
    {
      id: 2,
      title: isRTL ? 'تحديث سياسات الإجازات' : 'Update leave policies',
      description: isRTL ? 'مراجعة وتحديث سياسات الإجازات لتتماشى مع القانون' : 'Review and update leave policies to comply with law',
      priority: 'critical',
      assignee: 'HR Team',
      dueDate: '2024-01-30',
      progress: 25,
      status: 'planning'
    },
    {
      id: 3,
      title: isRTL ? 'تدريب الموظفين على الامتثال' : 'Employee compliance training',
      description: isRTL ? 'برنامج تدريبي شامل للموظفين حول متطلبات الامتثال' : 'Comprehensive training program for employee compliance',
      priority: 'medium',
      assignee: 'Training Dept',
      dueDate: '2024-03-01',
      progress: 10,
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'scheduled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {isRTL ? 'مراقبة الامتثال' : 'Compliance Monitoring'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'مقارنة السياسات مع المتطلبات القانونية وتحليل الفجوات' : 'Compare policies with legal requirements and analyze gaps'}
          </p>
        </div>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          {isRTL ? 'تقرير شامل' : 'Full Report'}
        </Button>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'معدل الامتثال العام' : 'Overall Compliance Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-muted-foreground">+5% من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'فجوات عالية المخاطر' : 'High Risk Gaps'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'تتطلب إجراء فوري' : 'Require immediate action'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'إجراءات الإصلاح النشطة' : 'Active Remediation Actions'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'قيد التنفيذ' : 'In progress'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'متوسط درجة المخاطر' : 'Average Risk Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'من أصل 100' : 'Out of 100'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gaps">{isRTL ? 'تحليل الفجوات' : 'Gap Analysis'}</TabsTrigger>
          <TabsTrigger value="remediation">{isRTL ? 'خطط الإصلاح' : 'Remediation Planning'}</TabsTrigger>
          <TabsTrigger value="audit">{isRTL ? 'سجلات المراجعة' : 'Audit Trail'}</TabsTrigger>
          <TabsTrigger value="scoring">{isRTL ? 'تقييم المخاطر' : 'Risk Scoring'}</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {isRTL ? 'تحديد فجوات الامتثال' : 'Compliance Gap Identification'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceGaps.map((gap) => (
                  <div key={gap.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{gap.category}</h4>
                          <Badge className={getPriorityColor(gap.priority)}>
                            {gap.priority}
                          </Badge>
                          <Badge className={getStatusColor(gap.currentStatus)}>
                            {gap.currentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{gap.requirement}</p>
                        <p className="text-sm text-muted-foreground">{gap.gap}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getRiskColor(gap.riskScore)}`}>
                          {gap.riskScore}
                        </div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'نقاط المخاطر' : 'Risk Score'}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'الجهد المقدر:' : 'Estimated Effort:'}</span>
                        <div className="font-medium">{gap.estimatedEffort}</div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {isRTL ? 'تفاصيل' : 'Details'}
                        </Button>
                        <Button size="sm">
                          <Target className="h-3 w-3 mr-1" />
                          {isRTL ? 'إنشاء خطة' : 'Create Plan'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {isRTL ? 'تخطيط الإجراءات التصحيحية' : 'Remediation Action Planning'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {remediationActions.map((action) => (
                  <div key={action.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{action.title}</h4>
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority}
                          </Badge>
                          <Badge className={getStatusColor(action.status)}>
                            {action.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'المسؤول:' : 'Assignee:'}</span>
                            <div className="font-medium">{action.assignee}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>
                            <div className="font-medium">{action.dueDate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'التقدم:' : 'Progress:'}</span>
                            <div className="font-medium">{action.progress}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'التقدم' : 'Progress'}</span>
                        <span className="text-sm font-medium">{action.progress}%</span>
                      </div>
                      <Progress value={action.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isRTL ? 'سجل المراجعة والمتابعة' : 'Audit Trail Maintenance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {auditTrail.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{entry.action}</h4>
                          <Badge className={getStatusColor(entry.status)} variant="secondary">
                            {entry.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{entry.user}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.timestamp}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? 'نقاط تقييم المخاطر' : 'Risk Assessment Scoring'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{isRTL ? 'مخاطر عالية (80-100)' : 'High Risk (80-100)'}</span>
                      <span className="text-2xl font-bold text-red-600">3</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{isRTL ? 'مخاطر متوسطة (40-79)' : 'Medium Risk (40-79)'}</span>
                      <span className="text-2xl font-bold text-yellow-600">5</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{isRTL ? 'مخاطر منخفضة (0-39)' : 'Low Risk (0-39)'}</span>
                      <span className="text-2xl font-bold text-green-600">12</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'عوامل المخاطر الرئيسية' : 'Key Risk Factors'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>{isRTL ? 'عدم تسجيل الساعات الإضافية' : 'Untracked Overtime'}</span>
                    <span className="font-bold text-red-600">90</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>{isRTL ? 'أخطاء حساب الإجازات' : 'Leave Calculation Errors'}</span>
                    <span className="font-bold text-orange-600">75</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>{isRTL ? 'عقود غير محدثة' : 'Outdated Contracts'}</span>
                    <span className="font-bold text-yellow-600">60</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>{isRTL ? 'نقص التوثيق' : 'Missing Documentation'}</span>
                    <span className="font-bold text-green-600">30</span>
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