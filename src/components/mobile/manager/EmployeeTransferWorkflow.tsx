import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2, Calendar, FileText, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface TransferRequest {
  id: string;
  employeeName: string;
  currentDepartment: string;
  requestedDepartment: string;
  transferDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
  submittedDate: string;
}

export default function EmployeeTransferWorkflow() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'requests' | 'new'>('requests');
  const [formData, setFormData] = useState({
    employeeId: '',
    currentDepartment: '',
    targetDepartment: '',
    transferDate: '',
    reason: '',
    priority: 'medium',
    justification: ''
  });

  const mockTransferRequests: TransferRequest[] = [
    {
      id: '1',
      employeeName: 'أحمد محمد',
      currentDepartment: 'المبيعات',
      requestedDepartment: 'التسويق',
      transferDate: '2024-02-15',
      reason: 'تطوير المهارات',
      status: 'pending',
      priority: 'medium',
      requestedBy: 'مدير الموارد البشرية',
      submittedDate: '2024-01-20'
    },
    {
      id: '2',
      employeeName: 'فاطمة أحمد',
      currentDepartment: 'المحاسبة',
      requestedDepartment: 'المالية',
      transferDate: '2024-02-01',
      reason: 'ترقية وظيفية',
      status: 'approved',
      priority: 'high',
      requestedBy: 'المدير التنفيذي',
      submittedDate: '2024-01-10'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <ArrowRight className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitTransfer = async () => {
    // Implementation for submitting transfer request
    console.log('Transfer request submitted:', formData);
  };

  const handleApproveTransfer = async (transferId: string) => {
    // Implementation for approving transfer
    console.log('Transfer approved:', transferId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'سير عمل نقل الموظفين' : 'Employee Transfer Workflow'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'إدارة طلبات نقل الموظفين' : 'Manage employee transfer requests'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'الطلبات المعلقة' : 'Transfer Requests'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'طلب جديد' : 'New Request'}
          </button>
        </div>

        {activeTab === 'requests' ? (
          <div className="space-y-4">
            {mockTransferRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{request.employeeName}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{request.currentDepartment}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{request.requestedDepartment}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span>{isRTL ? request.status === 'pending' ? 'معلق' : request.status === 'approved' ? 'موافق عليه' : request.status : request.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'تاريخ النقل:' : 'Transfer Date:'}</span>
                      <span>{request.transferDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'طلب من:' : 'Requested by:'}</span>
                      <span>{request.requestedBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">{isRTL ? 'السبب:' : 'Reason:'}</span>
                      <p className="text-muted-foreground mt-1">{request.reason}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleApproveTransfer(request.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'موافق' : 'Approve'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'رفض' : 'Reject'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'طلب نقل موظف جديد' : 'New Transfer Request'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="employee">{isRTL ? 'الموظف' : 'Employee'}</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر الموظف' : 'Select employee'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isRTL ? 'أحمد محمد' : 'Ahmed Mohammed'}</SelectItem>
                      <SelectItem value="2">{isRTL ? 'فاطمة أحمد' : 'Fatima Ahmed'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current">{isRTL ? 'القسم الحالي' : 'Current Department'}</Label>
                    <Select value={formData.currentDepartment} onValueChange={(value) => setFormData({...formData, currentDepartment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر القسم' : 'Select department'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
                        <SelectItem value="marketing">{isRTL ? 'التسويق' : 'Marketing'}</SelectItem>
                        <SelectItem value="hr">{isRTL ? 'الموارد البشرية' : 'Human Resources'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target">{isRTL ? 'القسم المستهدف' : 'Target Department'}</Label>
                    <Select value={formData.targetDepartment} onValueChange={(value) => setFormData({...formData, targetDepartment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر القسم' : 'Select department'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
                        <SelectItem value="marketing">{isRTL ? 'التسويق' : 'Marketing'}</SelectItem>
                        <SelectItem value="hr">{isRTL ? 'الموارد البشرية' : 'Human Resources'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">{isRTL ? 'تاريخ النقل' : 'Transfer Date'}</Label>
                    <Input 
                      type="date" 
                      value={formData.transferDate}
                      onChange={(e) => setFormData({...formData, transferDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">{isRTL ? 'الأولوية' : 'Priority'}</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                        <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                        <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">{isRTL ? 'سبب النقل' : 'Transfer Reason'}</Label>
                  <Input 
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder={isRTL ? 'أدخل سبب النقل' : 'Enter transfer reason'}
                  />
                </div>

                <div>
                  <Label htmlFor="justification">{isRTL ? 'التبرير التفصيلي' : 'Detailed Justification'}</Label>
                  <Textarea 
                    value={formData.justification}
                    onChange={(e) => setFormData({...formData, justification: e.target.value})}
                    placeholder={isRTL ? 'قدم تبريراً مفصلاً للنقل' : 'Provide detailed justification for the transfer'}
                    rows={4}
                  />
                </div>
              </div>

              <Button onClick={handleSubmitTransfer} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? 'تقديم طلب النقل' : 'Submit Transfer Request'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}