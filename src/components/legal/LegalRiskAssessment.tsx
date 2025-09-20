import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Users,
  FileText,
  Clock,
  Target,
  BarChart3,
  Eye,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const LegalRiskAssessment: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const employeeGrievanceRisks = [
    {
      id: 1,
      employeeName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      department: isRTL ? 'المبيعات' : 'Sales',
      riskLevel: 'high',
      riskScore: 85,
      issues: [
        isRTL ? 'شكاوى متكررة حول ساعات العمل' : 'Recurring complaints about working hours',
        isRTL ? 'عدم رضا عن التعويضات' : 'Dissatisfaction with compensation'
      ],
      lastIncident: '2024-01-10',
      status: 'monitoring'
    },
    {
      id: 2,
      employeeName: isRTL ? 'فاطمة الزهراء' : 'Fatima Alzahra',
      department: isRTL ? 'الموارد البشرية' : 'Human Resources',
      riskLevel: 'medium',
      riskScore: 60,
      issues: [
        isRTL ? 'خلاف حول ترقية' : 'Promotion dispute',
        isRTL ? 'مشاكل في بيئة العمل' : 'Workplace environment issues'
      ],
      lastIncident: '2024-01-05',
      status: 'resolved'
    },
    {
      id: 3,
      employeeName: isRTL ? 'محمد السالم' : 'Mohammed Alsalem',
      department: isRTL ? 'التقنية' : 'Technology',
      riskLevel: 'low',
      riskScore: 25,
      issues: [
        isRTL ? 'طلب توضيح حول سياسة الإجازات' : 'Leave policy clarification request'
      ],
      lastIncident: '2024-01-15',
      status: 'closed'
    }
  ];

  const disciplinaryActions = [
    {
      id: 1,
      employeeName: isRTL ? 'خالد الأحمد' : 'Khalid AlAhmad',
      actionType: 'warning',
      reason: isRTL ? 'تأخير متكرر' : 'Repeated tardiness',
      date: '2024-01-12',
      complianceStatus: 'compliant',
      riskLevel: 'low',
      followUpRequired: false
    },
    {
      id: 2,
      employeeName: isRTL ? 'نورا العلي' : 'Nora AlAli',
      actionType: 'suspension',
      reason: isRTL ? 'انتهاك سياسة الشركة' : 'Policy violation',
      date: '2024-01-08',
      complianceStatus: 'needs-review',
      riskLevel: 'medium',
      followUpRequired: true
    },
    {
      id: 3,
      employeeName: isRTL ? 'عبدالله المطيري' : 'Abdullah AlMutairi',
      actionType: 'termination',
      reason: isRTL ? 'سوء سلوك جسيم' : 'Gross misconduct',
      date: '2024-01-03',
      complianceStatus: 'under-review',
      riskLevel: 'high',
      followUpRequired: true
    }
  ];

  const harassmentPrevention = [
    {
      id: 1,
      category: isRTL ? 'التحرش في مكان العمل' : 'Workplace Harassment',
      riskScore: 15,
      incidentCount: 0,
      preventionMeasures: [
        isRTL ? 'تدريب دوري للموظفين' : 'Regular employee training',
        isRTL ? 'سياسة واضحة لمنع التحرش' : 'Clear anti-harassment policy',
        isRTL ? 'قنوات إبلاغ آمنة' : 'Safe reporting channels'
      ],
      status: 'active'
    },
    {
      id: 2,
      category: isRTL ? 'التمييز على أساس الجنس' : 'Gender Discrimination',
      riskScore: 10,
      incidentCount: 1,
      preventionMeasures: [
        isRTL ? 'سياسة المساواة في التوظيف' : 'Equal employment opportunity policy',
        isRTL ? 'مراجعة عمليات التوظيف' : 'Recruitment process review'
      ],
      status: 'monitoring'
    }
  ];

  const discriminationRisks = [
    {
      id: 1,
      type: isRTL ? 'التمييز العمري' : 'Age Discrimination',
      riskLevel: 'low',
      description: isRTL ? 'عدم وجود مؤشرات للتمييز العمري' : 'No indicators of age discrimination',
      preventionScore: 90,
      lastReview: '2024-01-10'
    },
    {
      id: 2,
      type: isRTL ? 'التمييز على أساس الجنسية' : 'Nationality Discrimination',
      riskLevel: 'medium',
      description: isRTL ? 'مراقبة توزيع الفرص والترقيات' : 'Monitoring opportunity and promotion distribution',
      preventionScore: 75,
      lastReview: '2024-01-08'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'needs-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'under-review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'monitoring': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
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
            <AlertTriangle className="h-6 w-6" />
            {isRTL ? 'تقييم المخاطر القانونية' : 'Legal Risk Assessment'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'تحليل وتقييم المخاطر القانونية في بيئة العمل' : 'Analyze and assess legal risks in the workplace'}
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          {isRTL ? 'تقرير المخاطر' : 'Risk Report'}
        </Button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'مخاطر الشكاوى' : 'Grievance Risks'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-xs text-muted-foreground">{isRTL ? 'حالة نشطة' : 'Active cases'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'الإجراءات التأديبية' : 'Disciplinary Actions'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'قيد المراجعة' : 'Under review'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'مخاطر التحرش' : 'Harassment Risks'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'حادثة واحدة' : 'Single incident'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isRTL ? 'درجة الامتثال' : 'Compliance Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-muted-foreground">{isRTL ? 'متوسط عام' : 'Overall average'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grievance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grievance">{isRTL ? 'تحليل الشكاوى' : 'Grievance Analysis'}</TabsTrigger>
          <TabsTrigger value="disciplinary">{isRTL ? 'الإجراءات التأديبية' : 'Disciplinary Actions'}</TabsTrigger>
          <TabsTrigger value="harassment">{isRTL ? 'منع التحرش' : 'Harassment Prevention'}</TabsTrigger>
          <TabsTrigger value="discrimination">{isRTL ? 'مراقبة التمييز' : 'Discrimination Monitoring'}</TabsTrigger>
        </TabsList>

        <TabsContent value="grievance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isRTL ? 'تحليل مخاطر شكاوى الموظفين' : 'Employee Grievance Risk Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeGrievanceRisks.map((risk) => (
                  <div key={risk.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{risk.employeeName}</h4>
                          <Badge variant="outline">{risk.department}</Badge>
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {risk.riskLevel}
                          </Badge>
                          <Badge className={getStatusColor(risk.status)}>
                            {risk.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-3">
                          {risk.issues.map((issue, index) => (
                            <p key={index} className="text-sm text-muted-foreground">• {issue}</p>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {isRTL ? 'آخر حادثة:' : 'Last Incident:'} {risk.lastIncident}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(risk.riskScore)}`}>
                          {risk.riskScore}
                        </div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'نقاط المخاطر' : 'Risk Score'}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'تفاصيل' : 'Details'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {isRTL ? 'السجلات' : 'Records'}
                      </Button>
                      {risk.status === 'monitoring' && (
                        <Button size="sm">
                          <Target className="h-3 w-3 mr-1" />
                          {isRTL ? 'اتخاذ إجراء' : 'Take Action'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplinary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {isRTL ? 'فحص امتثال الإجراءات التأديبية' : 'Disciplinary Action Compliance Checking'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disciplinaryActions.map((action) => (
                  <div key={action.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{action.employeeName}</h4>
                          <Badge variant="outline">{action.actionType}</Badge>
                          <Badge className={getRiskColor(action.riskLevel)}>
                            {action.riskLevel}
                          </Badge>
                          <Badge className={getStatusColor(action.complianceStatus)}>
                            {action.complianceStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{action.reason}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {action.date}
                          </span>
                          {action.followUpRequired && (
                            <Badge variant="destructive" className="text-xs">
                              {isRTL ? 'يتطلب متابعة' : 'Follow-up Required'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {action.complianceStatus === 'compliant' ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'مراجعة' : 'Review'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {isRTL ? 'الوثائق' : 'Documents'}
                      </Button>
                      {action.followUpRequired && (
                        <Button size="sm">
                          <Target className="h-3 w-3 mr-1" />
                          {isRTL ? 'متابعة' : 'Follow Up'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harassment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {isRTL ? 'منع التحرش في مكان العمل' : 'Workplace Harassment Prevention'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {harassmentPrevention.map((prevention) => (
                  <div key={prevention.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{prevention.category}</h4>
                          <Badge className={getStatusColor(prevention.status)}>
                            {prevention.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'عدد الحوادث:' : 'Incident Count:'}</span>
                            <div className="font-medium">{prevention.incidentCount}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'نقاط المخاطر:' : 'Risk Score:'}</span>
                            <div className={`font-medium ${getScoreColor(prevention.riskScore)}`}>
                              {prevention.riskScore}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium">{isRTL ? 'إجراءات الوقاية:' : 'Prevention Measures:'}</span>
                          {prevention.preventionMeasures.map((measure, index) => (
                            <p key={index} className="text-sm text-muted-foreground">• {measure}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discrimination" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {isRTL ? 'مراقبة مخاطر التمييز' : 'Discrimination Risk Monitoring'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discriminationRisks.map((risk) => (
                  <div key={risk.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{risk.type}</h4>
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {risk.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {isRTL ? 'آخر مراجعة:' : 'Last Review:'} {risk.lastReview}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{risk.preventionScore}%</div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'درجة الوقاية' : 'Prevention Score'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'فعالية الوقاية' : 'Prevention Effectiveness'}</span>
                        <span className="text-sm font-medium">{risk.preventionScore}%</span>
                      </div>
                      <Progress value={risk.preventionScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};