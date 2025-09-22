import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Preferences } from '@capacitor/preferences';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

interface ApprovalRequest {
  id: string;
  type: 'leave' | 'expense' | 'overtime' | 'purchase' | 'timeoff';
  employeeName: string;
  employeeNameAr: string;
  employeeId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  amount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  documents?: string[];
  requiredApprovers: number;
  currentApprovers: string[];
}

interface TeamApprovalWorkflowProps {
  isArabic: boolean;
}

export const TeamApprovalWorkflow: React.FC<TeamApprovalWorkflowProps> = ({ isArabic }) => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadApprovalRequests();
    
    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadApprovalRequests = async () => {
    try {
      // Try to load from offline storage first
      const { value } = await Preferences.get({ key: 'manager_approvals' });
      if (value) {
        setApprovals(JSON.parse(value));
      } else {
        // Load mock data if no offline data exists
        loadMockApprovals();
      }
    } catch (error) {
      console.error('Error loading approvals:', error);
      loadMockApprovals();
    }
  };

  const saveApprovalsOffline = async (updatedApprovals: ApprovalRequest[]) => {
    try {
      await Preferences.set({
        key: 'manager_approvals',
        value: JSON.stringify(updatedApprovals)
      });
      
      // Also save pending actions for sync when online
      const pendingActions = updatedApprovals
        .filter(a => a.status !== 'pending')
        .map(a => ({ id: a.id, status: a.status, timestamp: new Date().toISOString() }));
        
      await Preferences.set({
        key: 'pending_approval_actions',
        value: JSON.stringify(pendingActions)
      });
    } catch (error) {
      console.error('Error saving approvals offline:', error);
    }
  };

  const loadMockApprovals = () => {
    const mockData: ApprovalRequest[] = [
      {
        id: 'approval_001',
        type: 'leave',
        employeeName: 'Ahmed Al-Rashid',
        employeeNameAr: 'أحمد الراشد',
        employeeId: 'EMP-2024-001',
        title: 'Annual Leave Request',
        titleAr: 'طلب إجازة سنوية',
        description: 'Annual leave for family vacation',
        descriptionAr: 'إجازة سنوية لقضاء عطلة عائلية',
        startDate: '2024-12-25',
        endDate: '2024-01-05',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'pending',
        requiredApprovers: 1,
        currentApprovers: []
      },
      {
        id: 'approval_002',
        type: 'expense',
        employeeName: 'Fatima Al-Zahra',
        employeeNameAr: 'فاطمة الزهراء',
        employeeId: 'EMP-2024-002',
        title: 'Business Trip Expenses',
        titleAr: 'مصاريف رحلة عمل',
        description: 'Hotel and transportation costs for client meeting in Jeddah',
        descriptionAr: 'تكاليف الفندق والنقل لاجتماع العميل في جدة',
        amount: 2500,
        currency: 'SAR',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'pending',
        documents: ['receipt1.pdf', 'receipt2.pdf'],
        requiredApprovers: 1,
        currentApprovers: []
      },
      {
        id: 'approval_003',
        type: 'overtime',
        employeeName: 'Mohammed Al-Saud',
        employeeNameAr: 'محمد السعود',
        employeeId: 'EMP-2024-003',
        title: 'Overtime Hours - Project Delivery',
        titleAr: 'ساعات إضافية - تسليم المشروع',
        description: '15 hours overtime for urgent project completion',
        descriptionAr: '15 ساعة إضافية لإنجاز مشروع عاجل',
        amount: 900,
        currency: 'SAR',
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'under_review',
        requiredApprovers: 1,
        currentApprovers: []
      },
      {
        id: 'approval_004',
        type: 'purchase',
        employeeName: 'Nora Al-Qasimi',
        employeeNameAr: 'نورا القاسمي',
        employeeId: 'EMP-2024-004',
        title: 'Office Equipment Purchase',
        titleAr: 'شراء معدات مكتبية',
        description: 'New laptop and monitor for development work',
        descriptionAr: 'لابتوب وشاشة جديدة لأعمال التطوير',
        amount: 8500,
        currency: 'SAR',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'approved',
        requiredApprovers: 2,
        currentApprovers: ['mgr_001', 'mgr_002']
      }
    ];
    
    setApprovals(mockData);
  };

  const handleApproval = async (requestId: string, action: 'approve' | 'reject', comment?: string) => {
    const updatedApprovals = approvals.map(approval => {
      if (approval.id === requestId) {
        return {
          ...approval,
          status: (action === 'approve' ? 'approved' : 'rejected') as ApprovalRequest['status'],
          currentApprovers: [...approval.currentApprovers, 'current_manager']
        };
      }
      return approval;
    });

    setApprovals(updatedApprovals);
    await saveApprovalsOffline(updatedApprovals);

    console.log(`${action} request ${requestId}${comment ? ` with comment: ${comment}` : ''}`);
    
    // In real app, sync with server when online
    if (isOnline) {
      // syncWithServer(requestId, action, comment);
    }
  };

  const getStatusIcon = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ApprovalRequest['status']) => {
    if (isArabic) {
      switch (status) {
        case 'pending':
          return 'في الانتظار';
        case 'under_review':
          return 'قيد المراجعة';
        case 'approved':
          return 'موافق عليه';
        case 'rejected':
          return 'مرفوض';
      }
    } else {
      switch (status) {
        case 'pending':
          return 'Pending';
        case 'under_review':
          return 'Under Review';
        case 'approved':
          return 'Approved';
        case 'rejected':
          return 'Rejected';
      }
    }
  };

  const getPriorityColor = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
    }
  };

  const getTypeIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'leave':
        return <Calendar className="h-4 w-4" />;
      case 'expense':
        return <CurrencyIcon className="h-4 w-4" />;
      case 'overtime':
        return <Clock className="h-4 w-4" />;
      case 'purchase':
        return <FileText className="h-4 w-4" />;
      case 'timeoff':
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: ApprovalRequest['type']) => {
    if (isArabic) {
      switch (type) {
        case 'leave':
          return 'إجازة';
        case 'expense':
          return 'مصاريف';
        case 'overtime':
          return 'ساعات إضافية';
        case 'purchase':
          return 'شراء';
        case 'timeoff':
          return 'وقت إضافي';
      }
    } else {
      switch (type) {
        case 'leave':
          return 'Leave';
        case 'expense':
          return 'Expense';
        case 'overtime':
          return 'Overtime';
        case 'purchase':
          return 'Purchase';
        case 'timeoff':
          return 'Time Off';
      }
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    switch (activeTab) {
      case 'pending':
        return approval.status === 'pending' || approval.status === 'under_review';
      case 'approved':
        return approval.status === 'approved';
      case 'rejected':
        return approval.status === 'rejected';
      default:
        return true;
    }
  });

  const pendingCount = approvals.filter(a => a.status === 'pending' || a.status === 'under_review').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            {isArabic ? 'سير عمل الموافقات' : 'Approval Workflow'}
          </div>
          {!isOnline && (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {isArabic ? 'غير متصل' : 'Offline'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isArabic ? 'معلقة' : 'Pending'} {pendingCount > 0 && `(${pendingCount})`}
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {isArabic ? 'موافق عليها' : 'Approved'}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {isArabic ? 'مرفوضة' : 'Rejected'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{isArabic ? 'لا توجد طلبات' : 'No requests found'}</p>
              </div>
            ) : (
              filteredApprovals.map((approval) => (
                <div key={approval.id} className={`p-4 border rounded-lg border-l-4 ${getPriorityColor(approval.priority)}`}>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(approval.type)}
                          <Badge variant="secondary">
                            {getTypeText(approval.type)}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {isArabic ? approval.titleAr : approval.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {isArabic ? approval.employeeNameAr : approval.employeeName} • {approval.employeeId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(approval.status)}
                        <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {getStatusText(approval.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <p className="text-sm">
                        {isArabic ? approval.descriptionAr : approval.description}
                      </p>
                      
                      {approval.amount && (
                        <div className="flex items-center gap-2 text-sm">
                          <CurrencyIcon className="h-4 w-4" />
                          <span className="font-medium">
                            {approval.amount.toLocaleString()} {approval.currency}
                          </span>
                        </div>
                      )}

                      {approval.startDate && approval.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(approval.startDate).toLocaleDateString()} - 
                            {new Date(approval.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {isArabic ? 'تم التقديم: ' : 'Submitted: '}
                          {new Date(approval.submittedAt).toLocaleString()}
                        </span>
                        <span>
                          {isArabic ? 'أولوية: ' : 'Priority: '}
                          {approval.priority}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {(approval.status === 'pending' || approval.status === 'under_review') && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproval(approval.id, 'approve')}
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {isArabic ? 'موافقة' : 'Approve'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApproval(approval.id, 'reject')}
                          className="flex-1"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          {isArabic ? 'رفض' : 'Reject'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                {isArabic 
                  ? 'العمل في وضع عدم الاتصال. ستتم مزامنة الموافقات عند الاتصال.'
                  : 'Working offline. Approvals will sync when connected.'
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};