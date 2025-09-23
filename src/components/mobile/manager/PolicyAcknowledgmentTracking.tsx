import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileCheck, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Eye,
  Download,
  Filter,
  Search,
  Calendar
} from 'lucide-react';

interface PolicyAcknowledgment {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  employeeId: string;
  department: string;
  departmentAr: string;
  position: string;
  positionAr: string;
  status: 'pending' | 'acknowledged' | 'overdue' | 'not_required';
  acknowledgedDate?: string;
  dueDate: string;
  remindersSent: number;
  lastReminderDate?: string;
}

interface Policy {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'hr' | 'safety' | 'it' | 'compliance' | 'code_of_conduct' | 'privacy';
  version: string;
  effectiveDate: string;
  isActive: boolean;
  requiresAcknowledgment: boolean;
  acknowledgmentDeadlineDays: number;
  totalEmployees: number;
  acknowledgedCount: number;
  pendingCount: number;
  overdueCount: number;
  acknowledgments: PolicyAcknowledgment[];
}

export const PolicyAcknowledgmentTracking: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'acknowledged'>('all');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockPolicies: Policy[] = [
    {
      id: '1',
      title: 'Employee Code of Conduct',
      titleAr: 'مدونة سلوك الموظفين',
      description: 'Guidelines for professional behavior and workplace ethics',
      descriptionAr: 'إرشادات للسلوك المهني وأخلاقيات مكان العمل',
      category: 'code_of_conduct',
      version: '2.1',
      effectiveDate: '2024-01-01',
      isActive: true,
      requiresAcknowledgment: true,
      acknowledgmentDeadlineDays: 14,
      totalEmployees: 50,
      acknowledgedCount: 35,
      pendingCount: 10,
      overdueCount: 5,
      acknowledgments: [
        {
          id: '1',
          employeeName: 'Sarah Al-Ahmed',
          employeeNameAr: 'سارة الأحمد',
          employeeId: 'EMP-001',
          department: 'HR',
          departmentAr: 'الموارد البشرية',
          position: 'HR Specialist',
          positionAr: 'أخصائية موارد بشرية',
          status: 'acknowledged',
          acknowledgedDate: '2024-01-05',
          dueDate: '2024-01-15',
          remindersSent: 1,
          lastReminderDate: '2024-01-08'
        },
        {
          id: '2',
          employeeName: 'Ahmad Al-Mansour',
          employeeNameAr: 'أحمد المنصور',
          employeeId: 'EMP-002',
          department: 'IT',
          departmentAr: 'تقنية المعلومات',
          position: 'Software Developer',
          positionAr: 'مطور برمجيات',
          status: 'pending',
          dueDate: '2024-01-15',
          remindersSent: 2,
          lastReminderDate: '2024-01-10'
        },
        {
          id: '3',
          employeeName: 'Fatima Al-Zahra',
          employeeNameAr: 'فاطمة الزهراء',
          employeeId: 'EMP-003',
          department: 'Finance',
          departmentAr: 'المالية',
          position: 'Accountant',
          positionAr: 'محاسبة',
          status: 'overdue',
          dueDate: '2024-01-10',
          remindersSent: 3,
          lastReminderDate: '2024-01-12'
        }
      ]
    },
    {
      id: '2',
      title: 'Information Security Policy',
      titleAr: 'سياسة أمن المعلومات',
      description: 'Data protection and cybersecurity guidelines',
      descriptionAr: 'إرشادات حماية البيانات والأمن السيبراني',
      category: 'it',
      version: '3.0',
      effectiveDate: '2024-01-15',
      isActive: true,
      requiresAcknowledgment: true,
      acknowledgmentDeadlineDays: 7,
      totalEmployees: 50,
      acknowledgedCount: 20,
      pendingCount: 25,
      overdueCount: 5,
      acknowledgments: [
        {
          id: '4',
          employeeName: 'Omar Al-Said',
          employeeNameAr: 'عمر السعيد',
          employeeId: 'EMP-004',
          department: 'IT',
          departmentAr: 'تقنية المعلومات',
          position: 'IT Manager',
          positionAr: 'مدير تقنية المعلومات',
          status: 'acknowledged',
          acknowledgedDate: '2024-01-16',
          dueDate: '2024-01-22',
          remindersSent: 0
        }
      ]
    },
    {
      id: '3',
      title: 'Health and Safety Guidelines',
      titleAr: 'إرشادات الصحة والسلامة',
      description: 'Workplace safety procedures and emergency protocols',
      descriptionAr: 'إجراءات السلامة في مكان العمل وبروتوكولات الطوارئ',
      category: 'safety',
      version: '1.5',
      effectiveDate: '2024-02-01',
      isActive: true,
      requiresAcknowledgment: true,
      acknowledgmentDeadlineDays: 10,
      totalEmployees: 50,
      acknowledgedCount: 45,
      pendingCount: 3,
      overdueCount: 2,
      acknowledgments: []
    }
  ];

  useEffect(() => {
    loadPoliciesData();
  }, []);

  const loadPoliciesData = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would fetch from the database
      setPolicies(mockPolicies);
    } catch (error) {
      console.error('Error loading policies data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acknowledged': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      case 'not_required': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'acknowledged': return 'تم الإقرار';
        case 'pending': return 'في الانتظار';
        case 'overdue': return 'متأخر';
        case 'not_required': return 'غير مطلوب';
        default: return 'غير محدد';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hr': return <Users className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      case 'it': return <FileCheck className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      case 'code_of_conduct': return <FileCheck className="h-4 w-4" />;
      case 'privacy': return <Eye className="h-4 w-4" />;
      default: return <FileCheck className="h-4 w-4" />;
    }
  };

  const getCategoryText = (category: string) => {
    if (locale === 'ar') {
      switch (category) {
        case 'hr': return 'الموارد البشرية';
        case 'safety': return 'السلامة';
        case 'it': return 'تقنية المعلومات';
        case 'compliance': return 'الامتثال';
        case 'code_of_conduct': return 'مدونة السلوك';
        case 'privacy': return 'الخصوصية';
        default: return 'عام';
      }
    }
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  const calculateCompletionRate = (acknowledged: number, total: number) => {
    return total > 0 ? Math.round((acknowledged / total) * 100) : 0;
  };

  const sendReminder = async (policyId: string, employeeId?: string) => {
    try {
      await supabase.functions.invoke('send-policy-reminder', {
        body: { policyId, employeeId }
      });
      loadPoliciesData();
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const exportReport = async (policyId: string) => {
    try {
      const { data } = await supabase.functions.invoke('export-policy-report', {
        body: { policyId }
      });
      
      if (data?.reportUrl) {
        window.open(data.reportUrl, '_blank');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const selectedPolicyData = selectedPolicy ? policies.find(p => p.id === selectedPolicy) : null;

  const filteredAcknowledgments = selectedPolicyData?.acknowledgments.filter(ack => {
    const matchesSearch = ack.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ack.employeeNameAr.includes(searchQuery) ||
                         ack.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ack.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'تتبع إقرار السياسات' : 'Policy Acknowledgment Tracking'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'مراقبة إقرار الموظفين للسياسات والإجراءات' : 'Monitor employee acknowledgment of policies and procedures'}
          </p>
        </div>
      </div>

      {selectedPolicy ? (
        /* Detailed Policy View */
        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedPolicy(null)}
          >
            ← {locale === 'ar' ? 'العودة' : 'Back'}
          </Button>

          {selectedPolicyData && (
            <>
              {/* Policy Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCategoryIcon(selectedPolicyData.category)}
                        {locale === 'ar' ? selectedPolicyData.titleAr : selectedPolicyData.title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {locale === 'ar' ? selectedPolicyData.descriptionAr : selectedPolicyData.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'الإصدار:' : 'Version:'} {selectedPolicyData.version} • 
                        {locale === 'ar' ? ' تاريخ النفاذ: ' : ' Effective: '}{selectedPolicyData.effectiveDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {calculateCompletionRate(selectedPolicyData.acknowledgedCount, selectedPolicyData.totalEmployees)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'معدل الإقرار' : 'Completion Rate'}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={calculateCompletionRate(selectedPolicyData.acknowledgedCount, selectedPolicyData.totalEmployees)} 
                    className="mt-4" 
                  />
                </CardHeader>
              </Card>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedPolicyData.acknowledgedCount}</div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'ar' ? 'تم الإقرار' : 'Acknowledged'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedPolicyData.pendingCount}</div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'ar' ? 'في الانتظار' : 'Pending'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedPolicyData.overdueCount}</div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'ar' ? 'متأخر' : 'Overdue'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={locale === 'ar' ? 'البحث في الموظفين...' : 'Search employees...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'الحالة:' : 'Status:'}
                      </span>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="text-sm bg-background border rounded px-2 py-1"
                      >
                        <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                        <option value="acknowledged">{locale === 'ar' ? 'تم الإقرار' : 'Acknowledged'}</option>
                        <option value="pending">{locale === 'ar' ? 'في الانتظار' : 'Pending'}</option>
                        <option value="overdue">{locale === 'ar' ? 'متأخر' : 'Overdue'}</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => sendReminder(selectedPolicyData.id)}
                      variant="outline"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {locale === 'ar' ? 'إرسال تذكير عام' : 'Send General Reminder'}
                    </Button>
                    <Button 
                      onClick={() => exportReport(selectedPolicyData.id)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {locale === 'ar' ? 'تصدير التقرير' : 'Export Report'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Acknowledgments List */}
              <div className="space-y-3">
                {filteredAcknowledgments.map((acknowledgment) => (
                  <Card key={acknowledgment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">
                              {locale === 'ar' ? acknowledgment.employeeNameAr : acknowledgment.employeeName}
                            </h4>
                            <Badge variant="outline">
                              {acknowledgment.employeeId}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {locale === 'ar' ? acknowledgment.positionAr : acknowledgment.position} • 
                            {locale === 'ar' ? acknowledgment.departmentAr : acknowledgment.department}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {locale === 'ar' ? 'المطلوب بحلول:' : 'Due:'} {acknowledgment.dueDate}
                              </span>
                            </div>
                            {acknowledgment.acknowledgedDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>
                                  {locale === 'ar' ? 'تم الإقرار:' : 'Acknowledged:'} {acknowledgment.acknowledgedDate}
                                </span>
                              </div>
                            )}
                            <div>
                              {acknowledgment.remindersSent} {locale === 'ar' ? 'تذكيرات مرسلة' : 'reminders sent'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(acknowledgment.status) + ' text-white'}>
                            {getStatusText(acknowledgment.status)}
                          </Badge>
                          {acknowledgment.status !== 'acknowledged' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendReminder(selectedPolicyData.id, acknowledgment.employeeId)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              {locale === 'ar' ? 'تذكير' : 'Remind'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Policies List View */
        <div className="space-y-4">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPolicy(policy.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(policy.category)}
                      <h3 className="font-semibold text-foreground">
                        {locale === 'ar' ? policy.titleAr : policy.title}
                      </h3>
                      <Badge variant="outline">
                        v{policy.version}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryText(policy.category)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {locale === 'ar' ? policy.descriptionAr : policy.description}
                    </p>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>{locale === 'ar' ? 'معدل الإقرار' : 'Completion Rate'}</span>
                        <span>{calculateCompletionRate(policy.acknowledgedCount, policy.totalEmployees)}%</span>
                      </div>
                      <Progress value={calculateCompletionRate(policy.acknowledgedCount, policy.totalEmployees)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{policy.acknowledgedCount} {locale === 'ar' ? 'تم الإقرار' : 'acknowledged'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span>{policy.pendingCount} {locale === 'ar' ? 'في الانتظار' : 'pending'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span>{policy.overdueCount} {locale === 'ar' ? 'متأخر' : 'overdue'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {policy.acknowledgedCount}/{policy.totalEmployees}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === 'ar' ? 'موظف' : 'employees'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {policies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد سياسات' : 'No Policies Found'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد سياسات متاحة للتتبع' : 'No policies available for tracking'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};