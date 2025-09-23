import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, FileText, Send, Calendar, CheckCircle, AlertCircle, Clock, Shield, Users } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface GovernmentSubmission {
  id: string;
  submissionType: string;
  targetPortal: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  submissionDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  submittedBy: string;
  completionRate: number;
  requiredDocuments: string[];
  uploadedDocuments: number;
}

export default function GovernmentSubmissionWorkflows() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'submissions' | 'new' | 'templates'>('submissions');
  const [selectedPortal, setSelectedPortal] = useState('');

  const mockSubmissions: GovernmentSubmission[] = [
    {
      id: '1',
      submissionType: 'تقرير السعودة الشهري',
      targetPortal: 'QIWA',
      status: 'processing',
      submissionDate: '2024-01-25',
      dueDate: '2024-02-01',
      priority: 'high',
      description: 'تقرير السعودة لشهر يناير 2024',
      submittedBy: 'مدير الموارد البشرية',
      completionRate: 85,
      requiredDocuments: ['تقرير الموظفين', 'بيانات الرواتب', 'شهادات التدريب'],
      uploadedDocuments: 2
    },
    {
      id: '2',
      submissionType: 'إقرار التأمينات الاجتماعية',
      targetPortal: 'GOSI',
      status: 'submitted',
      submissionDate: '2024-01-20',
      dueDate: '2024-01-31',
      priority: 'medium',
      description: 'إقرار شهري للتأمينات الاجتماعية',
      submittedBy: 'محاسب الرواتب',
      completionRate: 100,
      requiredDocuments: ['كشف الرواتب', 'بيانات الموظفين الجدد', 'تقرير الإجازات'],
      uploadedDocuments: 3
    }
  ];

  const governmentPortals = [
    { code: 'QIWA', name: 'قوى', name_en: 'QIWA', icon: '🏢' },
    { code: 'GOSI', name: 'التأمينات الاجتماعية', name_en: 'GOSI', icon: '🛡️' },
    { code: 'HRSD', name: 'الموارد البشرية والتنمية الاجتماعية', name_en: 'HRSD', icon: '👥' },
    { code: 'ABSHER', name: 'أبشر أعمال', name_en: 'ABSHER Business', icon: '🏛️' },
    { code: 'ZATCA', name: 'الزكاة والضريبة والجمارك', name_en: 'ZATCA', icon: '💰' }
  ];

  const submissionTemplates = [
    { id: '1', name: 'تقرير السعودة الشهري', portal: 'QIWA', frequency: 'شهري' },
    { id: '2', name: 'إقرار التأمينات الاجتماعية', portal: 'GOSI', frequency: 'شهري' },
    { id: '3', name: 'تقرير الإصابات المهنية', portal: 'HRSD', frequency: 'ربع سنوي' },
    { id: '4', name: 'تجديد تراخيص العمل', portal: 'ABSHER', frequency: 'سنوي' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'submitted': return <Send className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPortalIcon = (portalCode: string) => {
    const portal = governmentPortals.find(p => p.code === portalCode);
    return portal?.icon || '🏢';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'سير عمل التقديم الحكومي' : 'Government Submission Workflows'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'إدارة التقديمات والتقارير الحكومية' : 'Manage government submissions and reports'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'submissions'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'التقديمات' : 'Submissions'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'تقديم جديد' : 'New Submission'}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'القوالب' : 'Templates'}
          </button>
        </div>

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {mockSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{getPortalIcon(submission.targetPortal)}</span>
                        {submission.submissionType}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{submission.targetPortal}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(submission.status)}
                          <span>
                            {isRTL ? 
                              (submission.status === 'draft' ? 'مسودة' : 
                               submission.status === 'submitted' ? 'مقدم' : 
                               submission.status === 'processing' ? 'قيد المعالجة' : 
                               submission.status === 'approved' ? 'موافق عليه' : 'مرفوض') 
                              : submission.status}
                          </span>
                        </div>
                      </Badge>
                      <Badge className={getPriorityColor(submission.priority)}>
                        {isRTL ? 
                          (submission.priority === 'low' ? 'منخفضة' : 
                           submission.priority === 'medium' ? 'متوسطة' : 
                           submission.priority === 'high' ? 'عالية' : 'عاجلة') 
                          : submission.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{submission.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'تاريخ التقديم:' : 'Submission Date:'}</span>
                      <span>{submission.submissionDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'الموعد النهائي:' : 'Due Date:'}</span>
                      <span>{submission.dueDate}</span>
                    </div>
                  </div>

                  {/* Document Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'المستندات المطلوبة:' : 'Required Documents:'}</span>
                      <span>{submission.uploadedDocuments}/{submission.requiredDocuments.length}</span>
                    </div>
                    <Progress 
                      value={(submission.uploadedDocuments / submission.requiredDocuments.length) * 100} 
                      className="h-2" 
                    />
                    <div className="flex flex-wrap gap-1 text-xs">
                      {submission.requiredDocuments.map((doc, index) => (
                        <Badge 
                          key={index} 
                          variant={index < submission.uploadedDocuments ? "default" : "outline"}
                          className="text-xs"
                        >
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Completion Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'نسبة الإكمال:' : 'Completion Rate:'}</span>
                      <span>{submission.completionRate}%</span>
                    </div>
                    <Progress value={submission.completionRate} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {submission.status === 'draft' && (
                      <Button className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        {isRTL ? 'تقديم' : 'Submit'}
                      </Button>
                    )}
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                    {submission.status === 'draft' && (
                      <Button variant="outline">
                        {isRTL ? 'تحرير' : 'Edit'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'new' && (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'تقديم حكومي جديد' : 'New Government Submission'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>{isRTL ? 'البوابة الحكومية' : 'Government Portal'}</Label>
                  <Select value={selectedPortal} onValueChange={setSelectedPortal}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر البوابة' : 'Select portal'} />
                    </SelectTrigger>
                    <SelectContent>
                      {governmentPortals.map((portal) => (
                        <SelectItem key={portal.code} value={portal.code}>
                          <div className="flex items-center gap-2">
                            <span>{portal.icon}</span>
                            <span>{isRTL ? portal.name : portal.name_en}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{isRTL ? 'نوع التقديم' : 'Submission Type'}</Label>
                  <Input placeholder={isRTL ? 'أدخل نوع التقديم' : 'Enter submission type'} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الأولوية' : 'Priority'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر الأولوية' : 'Select priority'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                        <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                        <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                        <SelectItem value="urgent">{isRTL ? 'عاجلة' : 'Urgent'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'الموعد النهائي' : 'Due Date'}</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div>
                  <Label>{isRTL ? 'الوصف' : 'Description'}</Label>
                  <Input placeholder={isRTL ? 'وصف موجز للتقديم' : 'Brief description of submission'} />
                </div>
              </div>

              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? 'إنشاء التقديم' : 'Create Submission'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissionTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-xl">{getPortalIcon(template.portal)}</span>
                          <span>{template.portal}</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {template.frequency}
                      </Badge>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      {isRTL ? 'استخدام القالب' : 'Use Template'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}